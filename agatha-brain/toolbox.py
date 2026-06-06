import json
import subprocess
import os
import sys

# Add Agathos and Kakos paths to sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
AGATHOS_DIR = os.path.join(BASE_DIR, 'agatha-agathos')
sys.path.append(AGATHOS_DIR)

try:
    from guardian_core import GuardianCore
except ImportError:
    # Fallback for different execution contexts
    sys.path.append(os.path.join(BASE_DIR, 'agatha', 'agatha-agathos'))
    from guardian_core import GuardianCore

from key_vault import vault
from governor import BicameralCircuitBreaker

class AgathaToolbox:
    """The unified interface for the 1000 capabilities of Project Agatha."""
    
    def __init__(self):
        self.guardian = GuardianCore()
        self.vault = vault
        self.governor = BicameralCircuitBreaker()
        self.kakos_path = os.path.abspath(os.path.join(BASE_DIR, 'agatha-kakos'))
        self.kakos_bin = os.path.join(self.kakos_path, 'target', 'debug', 'agatha-kakos.exe')
        
        # Verify Kakos binary exists
        if not os.path.exists(self.kakos_bin):
            self.kakos_cmd = ["cargo", "run", "--manifest-path", os.path.join(self.kakos_path, "Cargo.toml"), "--"]
        else:
            self.kakos_cmd = [self.kakos_bin]

    def call_agathos(self, pillar_name, params=None):
        """Call a defensive pillar from the Guardian Core."""
        try:
            method = getattr(self.guardian, pillar_name)
            if params:
                if isinstance(params, dict):
                    return method(**params)
                else:
                    return method(params)
            else:
                return method()
        except AttributeError:
            return {"error": f"Agathos Pillar '{pillar_name}' not found."}
        except Exception as e:
            return {"error": f"Agathos Execution Failed: {str(e)}"}

    def call_kakos(self, shadow_name=None, url=None, proxy=None, mock=False):
        """Call an offensive shadow from the Kakos Engine via CLI."""
        cmd = list(self.kakos_cmd)
        
        if mock:
            cmd.append("--mock")

        if shadow_name:
            cmd.extend(["--shadow", shadow_name])
        elif url:
            cmd.extend(["--url", url])
            if proxy:
                cmd.extend(["--proxy", proxy])
        else:
            return {"error": "Kakos requires either a shadow name or a URL."}

        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            try:
                return json.loads(result.stdout)
            except json.JSONDecodeError:
                return {"status": "executed", "output": result.stdout.strip()}
        except subprocess.CalledProcessError as e:
            return {"error": f"Kakos Execution Failed: {e.stderr}"}

    def execute_mission_step(self, intent, mock=False):
        """
        Executes a step based on the SLM's intent.
        Example intent: {"side": "kakos", "action": "shadow", "name": "Evasive Infiltration"}
        """
        # 0. Mock Mode Logic for Agathos
        if mock and intent.get("side") == "agathos":
            return {"status": "MOCK_SUCCESS", "message": f"Simulated Agathos Pillar: {intent.get('name')}"}

        # 1. Governance Check (Circuit Breaker)
        gov_status = self.governor.check_governance(intent)
        if gov_status.get("blocked"):
            # If blocked, trigger mandatory audit
            audit_meta = self.governor.force_audit()
            audit_exec = self.call_agathos(audit_meta["pillar"])
            return {
                "status": "BLOCKED",
                "reason": gov_status["reason"],
                "remediation": gov_status["remediation"],
                "audit_results": audit_exec
            }

        side = intent.get("side", "").lower()
        action = intent.get("action", "").lower()
        name = intent.get("name")
        params = intent.get("params", {})

        # 2. Record Call in Governor
        self.governor.record_call(side)

        # 3. Execution
        if side == "agathos":
            return self.call_agathos(name, params)
        elif side == "kakos":
            if action == "shadow":
                return self.call_kakos(shadow_name=name, mock=mock)
            elif action == "crawl":
                return self.call_kakos(url=params.get("url"), proxy=params.get("proxy"), mock=mock)
        
        return {"error": f"Unknown side/action: {side}/{action}"}

if __name__ == "__main__":
    toolbox = AgathaToolbox()
    print("Agatha Toolbox Initialized.")
    # Test a pillar
    print("Testing Agathos Pillar (kernel_integrity):")
    print(toolbox.call_agathos("kernel_integrity", "C:\\Windows\\System32\\ntoskrnl.exe"))
