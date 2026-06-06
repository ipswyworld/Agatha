import json

class AgathaUnit:
    """Base class for all specialized Agatha sub-agents (Units)."""
    
    def __init__(self, name, hemisphere, role, capabilities_range, toolbox):
        self.name = name
        self.hemisphere = hemisphere # "agathos" or "kakos"
        self.role = role
        self.range = capabilities_range # e.g., (1, 100)
        self.toolbox = toolbox

    def can_handle(self, capability_id):
        """Check if this unit specializes in this capability range."""
        return self.range[0] <= capability_id <= self.range[1]

    def execute(self, action_name, params=None):
        """Executes a specific capability using the toolbox."""
        if self.hemisphere == "agathos":
            return self.toolbox.call_agathos(action_name, params)
        else:
            return self.toolbox.call_kakos(shadow_name=action_name)

class AgathosUnit(AgathaUnit):
    def __init__(self, name, role, capabilities_range, toolbox):
        super().__init__(name, "agathos", role, capabilities_range, toolbox)

class KakosUnit(AgathaUnit):
    def __init__(self, name, role, capabilities_range, toolbox):
        super().__init__(name, "kakos", role, capabilities_range, toolbox)
