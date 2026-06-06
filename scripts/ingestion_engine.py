import requests
import logging
from bs4 import BeautifulSoup
from urllib.robotparser import RobotFileParser
from urllib.parse import urljoin, urlparse
import io
import pypdf
import json
from typing import Dict, Optional

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger_crawler = logging.getLogger("KnowledgeCrawler")
logger_normalizer = logging.getLogger("DataNormalizer")

class KnowledgeCrawler:
    def __init__(self, whitelist_domains, user_agent="AgathaCrawler/1.0"):
        self.whitelist = {dom.lower() for dom in whitelist_domains}
        self.user_agent = user_agent
        self.robot_parsers = {}

    def _get_base_domain(self, netloc):
        parts = netloc.lower().split('.')
        if len(parts) > 2:
            return '.'.join(parts[-2:])
        return netloc.lower()

    def get_robot_parser(self, base_url, netloc):
        if netloc in self.robot_parsers:
            return self.robot_parsers[netloc]

        rp = RobotFileParser()
        robots_url = urljoin(base_url, "/robots.txt")
        try:
            headers = {"User-Agent": self.user_agent}
            response = requests.get(robots_url, headers=headers, timeout=5)
            if response.status_code == 404:
                rp.parse([])
            elif response.status_code >= 400:
                rp.disallow_all = True
            else:
                rp.parse(response.text.splitlines())
        except Exception as e:
            logger_crawler.warning(f"Failed to fetch robots.txt for {netloc}: {e}")
            rp.disallow_all = True
            
        self.robot_parsers[netloc] = rp
        return rp

    def is_allowed(self, url):
        parsed = urlparse(url)
        netloc = parsed.netloc.lower()
        base_domain = self._get_base_domain(netloc)

        if netloc not in self.whitelist and base_domain not in self.whitelist:
            return False

        base_url = f"{parsed.scheme}://{parsed.netloc}"
        rp = self.get_robot_parser(base_url, netloc)
        
        return rp.can_fetch(self.user_agent, url)

    def crawl(self, url):
        if not self.is_allowed(url):
            logger_crawler.info(f"Crawl disallowed or out-of-scope: {url}")
            return None

        try:
            headers = {"User-Agent": self.user_agent}
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            return response.text
        except Exception as e:
            logger_crawler.error(f"Error crawling {url}: {e}")
            return None

class DataNormalizer:
    def extract_text_from_pdf(self, pdf_bytes: bytes) -> str:
        text = ""
        try:
            reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        except Exception as e:
            logger_normalizer.error(f"Failed to extract PDF text: {e}")
        return text

    def normalize_to_jsonl(self, raw_content, source_type) -> Optional[Dict]:
        text = ""
        
        if source_type.lower() == "pdf":
            if isinstance(raw_content, bytes):
                text = self.extract_text_from_pdf(raw_content)
            else:
                logger_normalizer.error("PDF content must be passed as raw bytes.")
                return None
        elif source_type.lower() in ["markdown", "md"]:
            text = str(raw_content)
        else:
            text = str(raw_content)

        text = text.replace('\u0000', '').strip()
        if not text:
            return None

        instruction = "Outline the forensic methodology for the following security protocol."
        if "exploit" in text.lower() or "vulnerability" in text.lower():
            instruction = "Analyze the following vulnerability research data and identify key indicators."
        elif "remediation" in text.lower() or "patch" in text.lower():
            instruction = "Draft the mitigation and remediation steps based on this advisory."

        return {
            "instruction": instruction,
            "output": f"Methodology: {text[:500]}..." 
        }
