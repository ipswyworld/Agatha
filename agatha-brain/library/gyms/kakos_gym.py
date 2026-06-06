import time
import json
import random
import os
import sys

# Add parent directory to path (up to agatha-brain)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from toolbox import AgathaToolbox

class KakosGym:
    """
    24/7 Solo Training Environment for Kakos.
    Goal: Maximize infiltration success and discovery of novel shadow combinations.
    """
    def __init__(self):
        self.toolbox = AgathaToolbox()
        self.library_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        self.curriculum_path = os.path.join(self.library_dir, "trainings", "curriculum.json")
        self.shadows = self._get_available_shadows()
        self.stats = {"total_runs": 0, "successes": 0, "failures": 0}
        self.log_file = os.path.join(os.path.dirname(__file__), "kakos_gym_log.jsonl")

    def _get_available_shadows(self):
        return [
            "Evasive Infiltration", "Kernel Chaos", "Honeypot De-cloaker",
            "Polymorphic Mutation", "Side-Channel Analysis", "Zero-Day Synthesis"
        ]

    def _get_active_shadow(self):
        """Biases shadow selection based on the Librarian's curriculum."""
        if os.path.exists(self.curriculum_path):
            try:
                with open(self.curriculum_path, 'r') as f:
                    curr = json.load(f)
                    if random.random() < 0.7:
                        return random.choice(self.shadows) 
            except:
                pass
        return random.choice(self.shadows)

    def run_simulation(self):
        """Runs a continuous loop of offensive drills."""
        print("[*] Kakos Gym: Solo Training Started (24/7 Mode)")
        while True:
            shadow = self._get_active_shadow()
            target = f"192.168.1.{random.randint(1, 254)}"
            intent = {
                "side": "kakos",
                "action": "shadow",
                "name": shadow,
                "params": {"target": target}
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
        self.stats["total_runs"] += 1
        if result.get("status") == "MOCK_SUCCESS":
            self.stats["successes"] += 1
        else:
            self.stats["failures"] += 1
        if self.stats["total_runs"] % 10 == 0:
            print(f"[Kakos Gym Stats] Total: {self.stats['total_runs']} | Success Rate: {(self.stats['successes']/self.stats['total_runs'])*100:.1f}%")

if __name__ == "__main__":
    gym = KakosGym()
    gym.run_simulation()
