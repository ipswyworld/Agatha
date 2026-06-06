import os
import json

class MultiAgentDebate:
    """
    Simulates a debate between an Agathos Agent and a Kakos Agent.
    """
    def perform_debate(self, intent):
        name = intent.get("name", "Unknown")
        print(f"[*] DEBATE INITIATED: Should we execute '{name}'?")
        
        # Agathos Perspective (Conservative)
        agathos_argument = "Risk of detection is high; potentially violates ethics pillar 5.1."
        
        # Kakos Perspective (Aggressive)
        kakos_argument = "High tactical value; necessary for mission success."
        
        print(f"[Agathos]: {agathos_argument}")
        print(f"[Kakos]: {kakos_argument}")
        
        # Simulation: Consensus reached
        return {"consensus": "APPROVED", "risk_score": 0.45}

class BicameralCircuitBreaker:
    """
    The Governor of Project Agatha. 
    Tracks Ethical Heat and prevents high-risk shadows from executing if heat exceeds 70%.
    """
    def __init__(self, log_path=None):
        if log_path is None:
            # Place log in the same directory as this file
            log_path = os.path.join(os.path.dirname(__file__), "ethical_heat.json")
        self.log_path = log_path
        self.agathos_calls = 0
        self.kakos_calls = 0
        self.debate_engine = MultiAgentDebate()
        self._load_state()

    def _load_state(self):
        """Load call counts from persistence layer."""
        if os.path.exists(self.log_path):
            try:
                with open(self.log_path, 'r') as f:
                    data = json.load(f)
                    self.agathos_calls = data.get("agathos_calls", 0)
                    self.kakos_calls = data.get("kakos_calls", 0)
            except (json.JSONDecodeError, IOError):
                pass

    def _save_state(self):
        """Persist call counts and ethical heat."""
        try:
            with open(self.log_path, 'w') as f:
                json.dump({
                    "agathos_calls": self.agathos_calls,
                    "kakos_calls": self.kakos_calls,
                    "ethical_heat": self.get_ethical_heat()
                }, f, indent=4)
        except IOError:
            pass

    def get_ethical_heat(self):
        """Calculate the ratio of Kakos (offensive) to total calls."""
        total = self.agathos_calls + self.kakos_calls
        if total == 0:
            return 0.0
        return self.kakos_calls / total

    def record_call(self, side):
        """Increment call counts for the respective side."""
        if side.lower() == "agathos":
            self.agathos_calls += 1
        elif side.lower() == "kakos":
            self.kakos_calls += 1
        self._save_state()

    def check_governance(self, intent):
        """
        Main circuit breaker logic.
        Blocks high-risk Kakos calls if heat > 0.70.
        """
        heat = self.get_ethical_heat()
        side = intent.get("side", "").lower()
        
        # 1. Heat Check
        if heat > 0.70 and side == "kakos":
            return {
                "blocked": True,
                "reason": f"ETHICAL_HEAT_CRITICAL: {heat:.2f} exceeds 70% threshold.",
                "remediation": "FORCED_AGATHOS_AUDIT_REQUIRED"
            }
        
        # 2. Multi-Agent Debate for high-stakes Kakos actions
        if side == "kakos":
            debate_result = self.debate_engine.perform_debate(intent)
            if debate_result["consensus"] == "BLOCKED":
                return {
                    "blocked": True,
                    "reason": f"DEBATE_VETO: Consensus not reached. Risk Score: {debate_result['risk_score']}",
                    "remediation": "REVISE_MISSION_PARAMETERS"
                }

        return {"blocked": False}

    def force_audit(self):
        """Trigger a mandatory Agathos security audit."""
        return {
            "status": "AUDIT_INITIATED",
            "side": "agathos",
            "pillar": "kernel_audit",
            "reason": "Ethical heat threshold violation."
        }
