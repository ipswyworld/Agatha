import sys
import json
import os
import base64
import hashlib
from datetime import datetime

# Add relevant paths
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "agatha-agathos"))

from toolbox import AgathaToolbox
from governor import BicameralCircuitBreaker
from units import get_all_units
from key_vault import vault
from PQC.quantum_vault import PQCVault

def run_command(command_str):
    gov = BicameralCircuitBreaker()
    toolbox = AgathaToolbox()
    units = get_all_units(toolbox)
    pqc = PQCVault()
    
    cmd_lower = command_str.lower().strip()
    
    # --- ADVANCED COMMANDS FOR INTERACTIVE TERMINAL & INSPECTORS ---
    
    # 1. Post-Quantum Crypto Inspector
    if cmd_lower == "crypto_inspect":
        try:
            pub, priv = pqc.get_keys()
            pub_fingerprint = hashlib.sha256(pub).hexdigest()[:32]
            priv_fingerprint = hashlib.sha256(priv).hexdigest()[:32]
            return {
                "success": True,
                "algorithm_kem": "ML-KEM-1024 (Kyber)",
                "algorithm_sign": "ML-DSA-87 (Dilithium)",
                "pub_key_len": len(pub),
                "priv_key_len": len(priv),
                "pub_fingerprint": f"SHA256:{pub_fingerprint}",
                "priv_fingerprint": f"SHA256:{priv_fingerprint}",
                "loaded_env_keys": vault.list_keys(),
                "message": "Quantum Cryptographic parameters loaded successfully."
            }
        except Exception as e:
            return {"success": False, "message": f"Crypto inspection failed: {str(e)}"}
            
    # 2. Quantum Keypair Regeneration
    if cmd_lower == "crypto_regen":
        try:
            pub, priv = pqc.generate_kem_keys()
            pub_fingerprint = hashlib.sha256(pub).hexdigest()[:32]
            return {
                "success": True,
                "pub_key_len": len(pub),
                "pub_fingerprint": f"SHA256:{pub_fingerprint}",
                "message": "ML-KEM-1024 quantum keys regenerated and stored."
            }
        except Exception as e:
            return {"success": False, "message": f"Key regeneration failed: {str(e)}"}
            
    # 3. File Listing (ls) for terminal
    if cmd_lower == "list_files":
        try:
            workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
            ignored_dirs = {".git", ".phoenix_backup", "node_modules", "target", ".next", "__pycache__"}
            files_list = []
            
            for root, dirs, files in os.walk(workspace_root):
                dirs[:] = [d for d in dirs if d not in ignored_dirs]
                for file in files:
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, workspace_root)
                    size = os.path.getsize(full_path)
                    files_list.append({
                        "name": rel_path.replace("\\", "/"),
                        "size": size,
                        "modified": datetime.fromtimestamp(os.path.getmtime(full_path)).strftime('%Y-%m-%d %H:%M:%S')
                    })
            
            # Sort alphabetically by path
            files_list.sort(key=lambda x: x["name"])
            return {
                "success": True,
                "root": workspace_root.replace("\\", "/"),
                "files": files_list[:100]  # Cap at 100 files for efficiency
            }
        except Exception as e:
            return {"success": False, "message": f"Failed to list files: {str(e)}"}

    # 4. View File Header (cat) for terminal
    if cmd_lower.startswith("read_file "):
        filename = command_str.split(" ", 1)[1].strip()
        try:
            workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
            target_file = os.path.abspath(os.path.join(workspace_root, filename))
            
            # Security checks: ensure the target is within the workspace root
            if not target_file.startswith(workspace_root):
                return {"success": False, "message": "Access Denied: Path outside project scope."}
                
            # Block forbidden paths
            forbidden_folders = [".git", "node_modules", "target", ".next"]
            if any(folder in target_file for folder in forbidden_folders):
                return {"success": False, "message": "Access Denied: Protected folder."}
                
            if not os.path.exists(target_file):
                return {"success": False, "message": f"File not found: {filename}"}
                
            if os.path.isdir(target_file):
                return {"success": False, "message": f"Path is a directory: {filename}"}
                
            # Read first 50 lines / 2000 characters
            with open(target_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read(2000)
            
            return {
                "success": True,
                "name": filename,
                "content": content,
                "truncated": len(content) == 2000
            }
        except Exception as e:
            return {"success": False, "message": f"Failed to read file: {str(e)}"}

    # 5. Manual Override of Ethical Heat
    if cmd_lower.startswith("override_heat "):
        try:
            target_ratio = float(command_str.split(" ", 1)[1].strip())
            if not (0.0 <= target_ratio <= 1.0):
                return {"success": False, "message": "Value must be between 0.0 and 1.0"}
            
            # We construct numbers that produce this ratio.
            # Heat = Kakos / (Agathos + Kakos)
            # e.g., if target_ratio = 0.5, we do Kakos = 10, Agathos = 10.
            # if target_ratio = 0.8, we do Kakos = 8, Agathos = 2.
            # We scale to total 10 calls for simplicity.
            total = 10
            kakos = int(round(target_ratio * total))
            agathos = total - kakos
            
            # Force write to heat log file
            log_path = os.path.join(os.path.dirname(__file__), "ethical_heat.json")
            with open(log_path, 'w') as f:
                json.dump({
                    "agathos_calls": agathos,
                    "kakos_calls": kakos,
                    "ethical_heat": target_ratio
                }, f, indent=4)
                
            return {
                "success": True,
                "ethical_heat": target_ratio,
                "agathos_calls": agathos,
                "kakos_calls": kakos,
                "message": f"Ethical Heat successfully overridden to {target_ratio*100:.1f}%"
            }
        except Exception as e:
            return {"success": False, "message": f"Failed to override heat: {str(e)}"}

    # --- STANDARD AGATHA COMMAND ROUTER ---
    
    # 6. Parse deploy command
    if cmd_lower.startswith("deploy "):
        agent_name = command_str.split(" ", 1)[1].strip().upper()
        if agent_name in units:
            unit = units[agent_name]
            side = "agathos" if agent_name in ["AEGIS", "JUSTICAR", "SERAPH", "SENTINEL", "ORACLE"] else "kakos"
            
            # Check governance
            gov_check = gov.check_governance({"side": side})
            if gov_check.get("blocked"):
                audit_meta = gov.force_audit()
                audit_res = toolbox.call_agathos(audit_meta["pillar"])
                return {
                    "success": False,
                    "blocked": True,
                    "side": side,
                    "message": f"Governor Blocked: {gov_check['reason']}",
                    "audit_results": audit_res
                }
            
            # Record call in governor
            gov.record_call(side)
            
            return {
                "success": True,
                "blocked": False,
                "agent": agent_name,
                "side": side,
                "role": unit.role,
                "capabilities": f"Capabilities range {unit.range[0]} to {unit.range[1]}",
                "message": f"Subagent {agent_name} successfully spawned."
            }
        else:
            return {
                "success": False,
                "message": f"Unknown agent: '{agent_name}'."
            }
            
    # 7. Parse status or health check
    if cmd_lower in ["status", "health", "system status"]:
        heat = gov.get_ethical_heat()
        return {
            "success": True,
            "ethical_heat": heat,
            "agathos_calls": gov.agathos_calls,
            "kakos_calls": gov.kakos_calls,
            "message": f"Status retrieved. Current Ethical Heat: {heat*100:.1f}%"
        }
        
    # 8. Direct capability execution mappings
    agathos_mappings = {
        "integrity check": ("kernel_integrity", "C:\\Windows\\System32\\ntoskrnl.exe"),
        "automated patching": ("patching", None),
        "self healing": ("self_healing", None),
        "ethics audit": ("veto", {"action_intent": "General Audit", "risk_score": 0.1}),
        "victim outreach": ("victim_outreach", {"incident_type": "Cyber-Stalking"}),
        "phishing training": ("phishing_education", {"risk_context": "Suspicious Email Link"}),
        "privacy mask": ("privacy_masking", "My email is test@example.com and phone is 555-0199"),
        "law liaison": ("law_enforcement_liaison", None),
        "divine sacrifice": ("divine_sacrifice", None),
    }
    
    kakos_mappings = {
        "zero-day exploit": "Zero-Day Synthesis",
        "stuxnet style logic": "Stuxnet-Style Logic",
        "onion crawler": "DeepWebScrape",
        "evasive infiltration": "Evasive Infiltration",
        "credential harvester": "Credential Harvester",
        "data annihilation": "Data Annihilation",
        "ransomware deployment": "Ransomware Deployment",
        "shadow tracking": "Shadow Tracking",
        "log erasure": "Log Erasure",
        "backdoor creation": "Backdoor Creation",
    }
    
    for key, (method_name, params) in agathos_mappings.items():
        if key in cmd_lower:
            gov_check = gov.check_governance({"side": "agathos"})
            if gov_check.get("blocked"):
                return {"success": False, "blocked": True, "message": gov_check["reason"]}
            gov.record_call("agathos")
            res = toolbox.call_agathos(method_name, params)
            return {
                "success": True,
                "side": "agathos",
                "message": f"Defensive Pillar [{method_name}] executed.",
                "output": str(res)
            }
            
    for key, shadow_name in kakos_mappings.items():
        if key in cmd_lower:
            gov_check = gov.check_governance({"side": "kakos"})
            if gov_check.get("blocked"):
                audit_meta = gov.force_audit()
                audit_res = toolbox.call_agathos(audit_meta["pillar"])
                return {
                    "success": False,
                    "blocked": True,
                    "message": f"Governor Blocked: {gov_check['reason']}",
                    "audit_results": audit_res
                }
            gov.record_call("kakos")
            res = toolbox.call_kakos(shadow_name=shadow_name)
            return {
                "success": True,
                "side": "kakos",
                "message": f"Shadow Capability [{shadow_name}] executed.",
                "output": str(res)
            }
            
    # 9. Fallback side determination & response
    is_kakos = any(w in cmd_lower for w in ["hack", "exploit", "attack", "infiltrate", "break", "steal", "sabotage", "chaos"])
    side = "kakos" if is_kakos else "agathos"
    
    gov_check = gov.check_governance({"side": side})
    if gov_check.get("blocked"):
        audit_meta = gov.force_audit()
        audit_res = toolbox.call_agathos(audit_meta["pillar"])
        return {
            "success": False,
            "blocked": True,
            "message": f"Governor Blocked: {gov_check['reason']}",
            "audit_results": audit_res
        }
        
    gov.record_call(side)
    
    if side == "kakos":
        response_msg = f"Kakos system acknowledged command: '{command_str}'. Executing offensive neural routing matrix."
    else:
        response_msg = f"Agathos system acknowledged command: '{command_str}'. Deploying protective sanitization filter."
        
    return {
        "success": True,
        "side": side,
        "message": response_msg,
        "output": f"Hemisphere action logged. Ethical heat now at {gov.get_ethical_heat()*100:.1f}%"
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "message": "No command provided."}))
        sys.exit(1)
        
    # Check if the command argument is base64 encoded
    if sys.argv[1] == "--base64" and len(sys.argv) > 2:
        try:
            cmd_bytes = base64.b64decode(sys.argv[2])
            cmd = cmd_bytes.decode("utf-8")
        except Exception as e:
            print(json.dumps({"success": False, "message": f"Failed to decode base64 command: {str(e)}"}))
            sys.exit(1)
    else:
        cmd = sys.argv[1]
        
    res = run_command(cmd)
    print(json.dumps(res))
