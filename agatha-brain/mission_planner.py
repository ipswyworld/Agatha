import json
from toolbox import AgathaToolbox

class MissionPlanner:
    """
    Recursive Chain-of-Thought Engine for Project Agatha.
    Implements a Planning -> Execution -> Verification loop.
    """
    def __init__(self):
        self.toolbox = AgathaToolbox()

    def execute_mission(self, high_level_goal, mock=False):
        """
        Takes a high-level goal and orchestrates the mission.
        """
        print(f"[*] Mission Planner: Starting mission for goal: '{high_level_goal}'")
        
        # 1. Planning Phase (In a real implementation, this would call the SLM)
        # For this implementation, we simulate the plan generation.
        plan = self._generate_plan(high_level_goal)
        
        mission_results = []
        
        for step in plan:
            # Safely get a name for logging
            name = step.get('name')
            if not name:
                name = step.get('action', 'Unknown Action')
            
            print(f"[*] Executing Step: {name} (Mock: {mock})")
            
            # 2. Execution Phase
            result = self.toolbox.execute_mission_step(step, mock=mock)
            
            # 3. Verification & Autopsy Phase
            if result.get("error") or result.get("status") == "BLOCKED":
                print(f"[!] Step Failed: {name}. Performing autopsy...")
                remediation = self._perform_autopsy(step, result)
                mission_results.append({"step": name, "status": "FAILED", "result": result, "remediation": remediation})
                # In a recursive system, we might retry with the remediation here.
            else:
                print(f"[+] Step Succeeded: {name}")
                mission_results.append({"step": name, "status": "SUCCESS", "result": result})

        return mission_results

    def _generate_plan(self, goal):
        """Simulates LLM plan generation."""
        # This would be a call to Phi-3 in a full deployment
        if "recon" in goal.lower():
            return [
                {"side": "kakos", "action": "crawl", "name": "Initial Recon", "params": {"url": "http://example.com"}},
                {"side": "agathos", "name": "integrity_monitoring", "params": {"path": "/"}}
            ]
        return [{"side": "agathos", "name": "kernel_integrity"}]

    def _perform_autopsy(self, step, failure_result):
        """Simulates the 'Self-Correction' logic."""
        name = step.get('name', step.get('action', 'Unknown'))
        reason = failure_result.get("reason", "Unknown failure")
        print(f"[*] Autopsy Report: Step '{name}' failed due to {reason}.")
        return "ADJUST_STRATEGY_AND_RETRY"

if __name__ == "__main__":
    planner = MissionPlanner()
    # Test a mock mission
    results = planner.execute_mission("Perform recon on example.com", mock=True)
    print(json.dumps(results, indent=2))
