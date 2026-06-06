import os
import sys
import json

# Add parent directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from knowledge.ingestor import CVEIngestor

class SkillIngestor:
    """
    Wing: The Archives.
    Ingests raw security data and converts it into structured skills.
    """
    def __init__(self):
        self.library_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        self.skills_dir = os.path.join(self.library_dir, "skills")
        self.ingestor = CVEIngestor()

    def run_ingestion(self):
        print("[*] Skill Ingestor: Fetching latest global security data...")
        # In actual use, this pulls live CVEs
        mock_skill = {"name": "SQLi_Auth_Bypass_2026", "type": "shadow_upgrade", "description": "Advanced bypass for 2026-era WAFs."}
        with open(os.path.join(self.skills_dir, "new_skill_2026.json"), 'w') as f:
            json.dump(mock_skill, f, indent=4)
        print(f"[+] Skill Ingestor: New skill archived.")

if __name__ == "__main__":
    si = SkillIngestor()
    si.run_ingestion()
