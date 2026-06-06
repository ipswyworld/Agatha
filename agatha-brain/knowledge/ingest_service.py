import sys
import os
import json
import re

# Add relevant paths
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "agatha-agathos"))

from rag_engine import RagEngine
from kag_engine import KagEngine

class IngestService:
    def __init__(self):
        self.rag = RagEngine()
        self.kag = KagEngine()

    def ingest_text(self, text, metadata=None):
        """Vectorizes text and extracts knowledge graphs relationships dynamically."""
        if not text.strip():
            return {"success": False, "message": "Text payload is empty."}

        # 1. Write to RAG memory (FAISS)
        self.rag.add_to_memory(text, metadata)

        # 2. Parse concepts and write to KAG knowledge graph (NetworkX)
        self._extract_kag_relations(text)
        self.kag.save()

        return {
            "success": True,
            "message": "Intel ingested successfully into RAG & KAG.",
            "document_count": len(self.rag.documents),
            "graph_nodes": len(self.kag.graph.nodes)
        }

    def _extract_kag_relations(self, text):
        """Analyzes text for key relationship keywords and links concepts in KAG."""
        text_lower = text.lower()
        
        # Mapping definitions: Keyword -> (Relationship, Target)
        relationships = {
            "sql injection": ("EXPLOITS_VIA", "SQL Injection"),
            "cross-site scripting": ("EXPLOITS_VIA", "XSS"),
            "buffer overflow": ("EXPLOITS_VIA", "Buffer Overflow"),
            "rce": ("EXPLOITS_VIA", "RCE"),
            "remote code execution": ("EXPLOITS_VIA", "RCE"),
            "malware": ("IS_A", "Malware"),
            "ransomware": ("IS_A", "Ransomware"),
            "phishing": ("EXPLOITS_VIA", "Phishing"),
            "zero-day": ("IS_A", "Zero-Day"),
            "patching": ("COUNTERED_BY", "Automated Patching"),
            "self-healing": ("COUNTERED_BY", "System Self-Healing"),
            "veto": ("COUNTERED_BY", "Ethical Veto"),
            "integrity": ("COUNTERED_BY", "Integrity Monitoring"),
            "encryption": ("COUNTERED_BY", "Cryptographic Protection")
        }

        # Look for CVE identifiers (e.g. CVE-2026-12345)
        cves = re.findall(r'\b(cve-\d{4}-\d{4,})\b', text_lower)
        for cve in cves:
            cve_upper = cve.upper()
            self.kag.add_relationship(cve_upper, "Vulnerability", "IS_A")
            for keyword, (rel, target) in relationships.items():
                if keyword in text_lower:
                    self.kag.add_relationship(cve_upper, target, rel)

        # Direct links: If threat and countermeasure exist in the same paragraph
        for keyword, (rel, target) in relationships.items():
            if keyword in text_lower:
                # E.g. connect XSS to Vulnerability class
                self.kag.add_relationship(target, "Vulnerability", "IS_A")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "message": "No text content provided."}))
        sys.exit(1)

    ingestor = IngestService()
    
    # Check if bulk json payload
    if sys.argv[1] == "--json":
        try:
            # If a second parameter is not provided, read payload from stdin
            if len(sys.argv) > 2:
                payload = json.loads(sys.argv[2])
            else:
                payload = json.loads(sys.stdin.read())
            res = ingestor.ingest_text(payload.get("content", ""), payload.get("metadata"))
            print(json.dumps(res))
        except Exception as e:
            print(json.dumps({"success": False, "message": f"Failed to parse JSON input: {str(e)}"}))
    else:
        res = ingestor.ingest_text(sys.argv[1])
        print(json.dumps(res))
