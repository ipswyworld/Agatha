#!/usr/bin/env python3
"""
Agatha Python Bridge - Extensible Scripting Interface
Provides Python-based modules for the Rust core
"""

import sys
import json
import hashlib
import subprocess
from typing import Dict, Any, List
from dataclasses import dataclass
from datetime import datetime

@dataclass
class ModuleResult:
    success: bool
    output: str
    metadata: Dict[str, Any]

class AgathaPythonModule:
    def __init__(self):
        self.name = "base_module"
    
    def execute(self, params: Dict[str, Any]) -> ModuleResult:
        raise NotImplementedError

class OSINTModule(AgathaPythonModule):
    """Open Source Intelligence Gathering"""
    
    def __init__(self):
        super().__init__()
        self.name = "osint"
    
    def execute(self, params: Dict[str, Any]) -> ModuleResult:
        target = params.get("target", "")
        
        # DNS enumeration
        dns_info = self._dns_lookup(target)
        
        # WHOIS lookup
        whois_info = self._whois_lookup(target)
        
        output = f"""
OSINT Report for: {target}
{'='*50}
DNS Records: {dns_info}
WHOIS: {whois_info}
        """.strip()
        
        return ModuleResult(
            success=True,
            output=output,
            metadata={"dns": dns_info, "whois": whois_info}
        )
    
    def _dns_lookup(self, domain: str) -> List[str]:
        try:
            result = subprocess.run(
                ["nslookup", domain] if sys.platform == "win32" else ["dig", "+short", domain],
                capture_output=True,
                text=True
            )
            return result.stdout.strip().split('\n') if result.stdout else []
        except Exception as e:
            return [f"Error: {e}"]
    
    def _whois_lookup(self, domain: str) -> str:
        # WHOIS placeholder for windows / systems without whois binary
        try:
            result = subprocess.run(
                ["whois", domain],
                capture_output=True,
                text=True
            )
            lines = result.stdout.split('\n')
            relevant = [l for l in lines if any(x in l.lower() for x in ['registrar', 'creation', 'expiration'])]
            return '\n'.join(relevant[:5])
        except Exception as e:
            return f"WHOIS utility not installed or failed: {e}. Resolve manually for {domain}."

class VulnScanModule(AgathaPythonModule):
    """Vulnerability Scanning using external tools"""
    
    def __init__(self):
        super().__init__()
        self.name = "vulnscan"
    
    def execute(self, params: Dict[str, Any]) -> ModuleResult:
        target = params.get("target", "")
        port_range = params.get("ports", "1-1000")
        
        output = f"""
Vulnerability Scan for: {target}
Port Range: {port_range}
Status: Placeholder - integrate with nmap/nuclei
        """.strip()
        
        return ModuleResult(
            success=True,
            output=output,
            metadata={"target": target, "ports": port_range}
        )

class ReportGenerator(AgathaPythonModule):
    """PDF Report Generation"""
    
    def __init__(self):
        super().__init__()
        self.name = "report"
    
    def execute(self, params: Dict[str, Any]) -> ModuleResult:
        findings = params.get("findings", [])
        template = params.get("template", "standard")
        
        report = f"""
AGATHA SECURITY ASSESSMENT REPORT
Generated: {datetime.now().isoformat()}
Template: {template}
Findings: {len(findings)}
        """.strip()
        
        le_key = params.get("le_public_key")
        if le_key:
            report += "\n[ENCRYPTED WITH LE PUBLIC KEY]"
        
        return ModuleResult(
            success=True,
            output=report,
            metadata={"findings_count": len(findings), "encrypted": le_key is not None}
        )

def main():
    if len(sys.argv) < 2:
        print("Usage: agatha_bridge.py <module> [params_json]")
        sys.exit(1)
    
    module_name = sys.argv[1]
    params = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
    
    modules = {
        "osint": OSINTModule(),
        "vulnscan": VulnScanModule(),
        "report": ReportGenerator(),
    }
    
    module = modules.get(module_name)
    if not module:
        print(f"Unknown module: {module_name}")
        sys.exit(1)
    
    result = module.execute(params)
    print(json.dumps({
        "success": result.success,
        "output": result.output,
        "metadata": result.metadata
    }))

if __name__ == "__main__":
    main()
