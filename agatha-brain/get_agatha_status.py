import sys
import os
import json

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from governor import BicameralCircuitBreaker
from swarm_controller import SwarmController
from units import get_all_units
from toolbox import AgathaToolbox

def get_status():
    gov = BicameralCircuitBreaker()
    toolbox = AgathaToolbox()
    units = get_all_units(toolbox)
    swarm = SwarmController(units)
    
    # Ethical Heat from Governor
    ethical_heat = gov.get_ethical_heat()
    
    # Swarm Status from SwarmController
    # We define status as unit availability and general swarm health
    unit_status = {}
    for name, unit in units.items():
        # Mock status for each unit
        unit_status[name] = {
            "type": "Agathos" if name in ["AEGIS", "JUSTICAR", "SERAPH", "SENTINEL", "ORACLE"] else "Kakos",
            "active": True, # Mock
            "load": 0.0 # Mock
        }
    
    swarm_status = {
        "unit_count": len(units),
        "active_swarms": 0, # Since we aren't tracking live swarms in this mock
        "units": unit_status,
        "swarm_intelligence_level": 1.0 # Mock
    }
    
    return {
        "ethical_heat": ethical_heat,
        "swarm_status": swarm_status,
        "governor_stats": {
            "agathos_calls": gov.agathos_calls,
            "kakos_calls": gov.kakos_calls
        }
    }

if __name__ == "__main__":
    print(json.dumps(get_status()))
