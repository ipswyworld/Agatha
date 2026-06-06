import os
import json
from ingestion_engine import KnowledgeCrawler, DataNormalizer

# Expanded authorized domains for security research
WHITELISTED_DOMAINS = [
    'cisa.gov',
    'owasp.org',
    'nist.gov',
    'github.com',
    'ieee.org',
    'acm.org',
    'arxiv.org',
    'googleblog.com'
]

# Seeds for the crawler
SEED_URLS = [
    'https://www.cisa.gov/resources-tools/resources',
    'https://owasp.org/www-project-top-ten/',
    'https://csrc.nist.gov/publications',
    'https://arxiv.org/list/cs.CR/recent', # Computer Science - Cryptography and Security
]

def run_ingestion_pipeline():
    crawler = KnowledgeCrawler(whitelist_domains=WHITELISTED_DOMAINS)
    normalizer = DataNormalizer()
    
    output_file = "agatha_training_data.jsonl"
    
    print(f"[Orchestrator] Starting ingestion pipeline (Limitless Mode)...")
    
    for url in SEED_URLS:
        print(f"[Orchestrator] Ingesting: {url}")
        
        # Determine source type
        source_type = "markdown"
        if url.endswith(".pdf"):
            source_type = "pdf"
            
        raw_data = crawler.crawl(url)
        
        if raw_data:
            normalized = normalizer.normalize_to_jsonl(raw_data, source_type)
            if normalized:
                with open(output_file, "a", encoding='utf-8') as f:
                    f.write(json.dumps(normalized) + "\n")
                print(f"[Orchestrator] Ingested and normalized: {url}")
            else:
                print(f"[Orchestrator] Failed to normalize: {url}")
        else:
            print(f"[Orchestrator] Failed to crawl or disallowed: {url}")

    print(f"[Orchestrator] Ingestion complete. Data saved to {output_file}")

if __name__ == "__main__":
    run_ingestion_pipeline()
