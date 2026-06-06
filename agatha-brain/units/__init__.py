from .base import AgathosUnit, KakosUnit

def get_all_units(toolbox):
    return {
        # --- AGATHOS UNITS (Defense/Healing) ---
        "AEGIS": AgathosUnit(
            "AEGIS", 
            "Network & System Hardening", 
            (1, 100), 
            toolbox
        ),
        "JUSTICAR": AgathosUnit(
            "JUSTICAR", 
            "Forensics & Law Enforcement Liaison", 
            (101, 200), 
            toolbox
        ),
        "SERAPH": AgathosUnit(
            "SERAPH", 
            "Malware Neutralization & Self-Healing", 
            (201, 300), 
            toolbox
        ),
        "SENTINEL": AgathosUnit(
            "SENTINEL", 
            "Intelligence & Threat Observation", 
            (301, 400), 
            toolbox
        ),
        "ORACLE": AgathosUnit(
            "ORACLE", 
            "Ethics, Cognitive Defense & High-Frontier (Space/Quantum)", 
            (401, 500), 
            toolbox
        ),

        # --- KAKOS UNITS (Offense/Infiltration) ---
        "WRAITH": KakosUnit(
            "WRAITH", 
            "Stealth, Evasion & Anti-Forensics", 
            (1, 100), 
            toolbox
        ),
        "REAVER": KakosUnit(
            "REAVER", 
            "Exploitation, Brute Force & Data Neutralization", 
            (101, 200), 
            toolbox
        ),
        "VIPER": KakosUnit(
            "VIPER", 
            "Infiltration, Social Engineering & OSINT", 
            (201, 300), 
            toolbox
        ),
        "LICH": KakosUnit(
            "LICH", 
            "Persistence, Kernel Chaos & Privilege Escalation", 
            (301, 400), 
            toolbox
        ),
        "BANSHEE": KakosUnit(
            "BANSHEE", 
            "Economic Sabotage & Existential Chaos", 
            (401, 500), 
            toolbox
        ),
    }
