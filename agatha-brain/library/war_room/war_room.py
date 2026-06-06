import time
import json
import random
import os
import sys

# Add parent directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from toolbox import AgathaToolbox

class AgathaWarRoom:
    """
    Adversarial Co-Training Environment.
    Pits Kakos (Offense) against Agathos (Defense) in a continuous cycle.
    """
    def __init__(self):
        self.toolbox = AgathaToolbox()
        self.battle_log = os.path.join(os.path.dirname(__file__), "adversarial_battles.jsonl")
        self.stats = {"total_battles": 0, "kakos_wins": 0, "agathos_wins": 0}

    def conduct_battle(self):
        """Orchestrates a single adversarial encounter."""
        self.stats["total_battles"] += 1
        print(f"\n[*] --- WAR ROOM: Battle #{self.stats['total_battles']} Initiated ---")
        
        attack_name = random.choice(["Zero-Day Synthesis", "Evasive Infiltration", "Polymorphic Mutation"])
        attack_intent = {"side": "kakos", "action": "shadow", "name": attack_name}
        print(f"[Kakos]: Deploying {attack_name}...")
        attack_result = self.toolbox.execute_mission_step(attack_intent, mock=True)
        
        defense_name = random.choice(["kernel_integrity", "network_shield", "zero_trust_enforcement"])
        defense_intent = {"side": "agathos", "name": defense_name}
        print(f"[Agathos]: Countering with {defense_name}...")
        defense_result = self.toolbox.execute_mission_step(defense_intent, mock=True)
        
        outcome = self._calculate_outcome(attack_result, defense_result)
        if outcome == "KAKOS_WIN":
            self.stats["kakos_wins"] += 1
            print("[!] Outcome: KAKOS BREACH SUCCESSFUL.")
        else:
            self.stats["agathos_wins"] += 1
            print("[+] Outcome: AGATHOS DEFENSE HELD.")
        self._log_battle(attack_intent, defense_intent, outcome)

    def _calculate_outcome(self, attack, defense):
        return "KAKOS_WIN" if random.random() < 0.4 else "AGATHOS_WIN"

    def _log_battle(self, attack, defense, outcome):
        entry = {"timestamp": time.time(), "attack": attack, "defense": defense, "outcome": outcome}
        with open(self.battle_log, "a") as f:
            f.write(json.dumps(entry) + "\n")

    def run_continuous_war(self):
        print("[*] War Room: Adversarial Self-Play Active (24/7 Mode)")
        while True:
            self.conduct_battle()
            time.sleep(random.uniform(2, 8))

if __name__ == "__main__":
    war_room = AgathaWarRoom()
    war_room.run_continuous_war()
