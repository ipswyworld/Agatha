import requests
import re
import os
import sys

# Add the parent directory to sys.path to allow running as a script
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from knowledge.rag_engine import RagEngine
    from knowledge.kag_engine import KagEngine
except ImportError:
    from rag_engine import RagEngine
    from kag_engine import KagEngine

class CVEIngestor:
    """
    Automated CVE Ingestor for Project Agatha.
    Fetches latest vulnerabilities and updates RAG/KAG engines.
    """
    def __init__(self, rag=None, kag=None):
        self.rag = rag or RagEngine()
        self.kag = kag or KagEngine()
        self.base_url = "https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword="

    def fetch_recent_cves(self, year="2025"):
        print(f"[Ingestor] Fetching recent CVEs for {year} from MITRE...")
        try:
            # We use a search for the current year to get recent entries
            response = requests.get(f"{self.base_url}{year}", timeout=30)
            response.raise_for_status()
            return response.text
        except Exception as e:
            print(f"[Ingestor] Error fetching CVEs: {e}")
            return None

    def parse_and_ingest(self, html_content):
        if not html_content:
            return
        
        # Regex to extract CVE ID and Description from the MITRE search result table
        # Structure: <td valign="top" nowrap="nowrap"><a href="...">CVE-202X-NNNN</a></td><td valign="top">Description</td>
        pattern = r'<a href="[^"]*">(CVE-\d{4}-\d{4,})</a></td>\s*<td[^>]*>(.*?)</td>'
        matches = re.findall(pattern, html_content, re.DOTALL)
        
        print(f"[Ingestor] Found {len(matches)} potential CVE entries.")
        
        count = 0
        for cve_id, description in matches:
            description = description.strip()
            # Clean HTML tags if any in description
            description = re.sub('<[^<]+?>', '', description)
            
            # 1. Update RAG (Vector Store)
            self.rag.add_to_memory(
                text=f"Vulnerability {cve_id}: {description}", 
                metadata={"source": "mitre", "type": "cve", "id": cve_id}
            )
            
            # 2. Update KAG (Knowledge Graph)
            # Link CVE to general Vulnerability class
            self.kag.add_relationship(cve_id, "Vulnerability", "IS_A")
            
            # Semantic extraction for relationship mapping
            desc_lower = description.lower()
            if "sql injection" in desc_lower:
                self.kag.add_relationship(cve_id, "SQL Injection", "EXPLOITS_VIA")
            if "remote code execution" in desc_lower or " rce " in desc_lower:
                self.kag.add_relationship(cve_id, "RCE", "EXPLOITS_VIA")
            if "cross-site scripting" in desc_lower or " xss " in desc_lower:
                self.kag.add_relationship(cve_id, "XSS", "EXPLOITS_VIA")
            if "buffer overflow" in desc_lower:
                self.kag.add_relationship(cve_id, "Buffer Overflow", "EXPLOITS_VIA")
            if "privilege escalation" in desc_lower:
                self.kag.add_relationship(cve_id, "Privilege Escalation", "RESULT_IN")
            
            count += 1
            if count >= 100: # Limit per run to avoid bloat
                break
                
        self.kag.save()
        print(f"[Ingestor] Successfully ingested {count} CVEs into RAG and KAG.")

if __name__ == "__main__":
    # Test run
    ingestor = CVEIngestor()
    html = ingestor.fetch_recent_cves("2024")
    ingestor.parse_and_ingest(html)
