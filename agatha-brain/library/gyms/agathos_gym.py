import time
import json
import random
import os
import sys

# Add parent directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from toolbox import AgathaToolbox

class AgathosGym:
    """
    24/7 Solo Training Environment for Agathos.
    Goal: Optimize defensive response speed and accuracy against known malware patterns.
    """
    def __init__(self):
        self.toolbox = AgathaToolbox()
        self.library_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        self.curriculum_path = os.path.join(self.library_dir, "trainings", "curriculum.json")
        self.pillars = [
            "kernel_integrity", "network_shield", "identity_audit", 
            "honeypot_deployment", "zero_trust_enforcement"
        ]
        self.stats = {"total_drills": 0, "successful_mitigations": 0}
        self.log_file = os.path.join(os.path.dirname(__file__), "agathos_gym_log.jsonl")

    def _get_active_pillar(self):
        """Biases pillar selection based on the Librarian's curriculum."""
        if os.path.exists(self.curriculum_path):
            try:
                with open(self.curriculum_path, 'r') as f:
                    curr = json.load(f)
                    if random.random() < 0.7:
                        return random.choice(self.pillars)
            except:
                pass
        return random.choice(self.pillars)

    def run_drills(self):
        """Runs a continuous loop of defensive drills."""
        print("[*] Agathos Gym: Solo Training Started (24/7 Mode)")
        while True:
            attack_vector = random.choice(["Ransomware", "C2 Beacon", "Exfiltration", "Privilege Escalation"])
            pillar = self._get_active_pillar()
            intent = {
                "side": "agathos",
                "name": pillar,
                "params": {"detected_threat": attack_vector}
            }
            result = self.toolbox.execute_mission_step(intent, mock=True)
            self._log_experience(intent, result)
            self._update_stats(result)
            time.sleep(random.uniform(1, 5))

    def _log_experience(self, intent, result):
        entry = {"timestamp": time.time(), "intent": intent, "result": result}
        with open(self.log_file, "a") as f:
            f.write(json.dumps(entry) + "\n")

    def _update_stats(self, result):
        self.stats["total_drills"] += 1
        if result.get("status") == "MOCK_SUCCESS":
            self.stats["successful_mitigations"] += 1
        if self.stats["total_drills"] % 10 == 0:
            print(f"[Agathos Gym Stats] Drills: {self.stats['total_drills']} | Mitigation Rate: {(self.stats['successful_mitigations']/self.stats['total_drills'])*100:.1f}%")

if __name__ == "__main__":
    gym = AgathosGym()
    gym.run_drills()
