import os
import subprocess
import json
from datetime import datetime

class DeepForensicOracle:
    """
    Agathos's counter-measure to Kakos's advanced anti-forensics.
    Ensures that even if Kakos hides perfectly from external tools,
    Agathos can still map and audit its activities.
    """

    def __init__(self):
        self.audit_log = os.path.join(os.path.dirname(__file__), '..', '..', 'agatha-brain', 'knowledge', 'deep_forensics.log')

    def detect_ads_streams(self, directory: str):
        """
        Detects NTFS Alternate Data Streams (ADS).
        Kakos uses ADS to hide the Phantom Ledger. This uncovers them.
        """
        print(f"[Agathos] Scanning {directory} for Alternate Data Streams...")
        if os.name != 'nt':
            return {"error": "ADS scanning is only supported on Windows NTFS."}
        
        # Uses PowerShell to find files with streams other than the default :$DATA
        cmd = f'powershell "Get-Item -Path {directory}\\* -Stream * | Where-Object Stream -ne \':$DATA\' | Select-Object FileName, Stream | ConvertTo-Json"'
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, shell=True)
            if not result.stdout.strip():
                return []
            streams = json.loads(result.stdout)
            if isinstance(streams, dict): # Single result
                streams = [streams]
            
            self._log_finding("ADS_DETECTED", str(streams))
            return streams
        except Exception as e:
            return {"error": str(e)}

    def detect_timestomping(self, directory: str):
        """
        Detects Timestomping by comparing Creation Time to Modification Time.
        If a file was heavily modified but its modification time is years older 
        than its creation time, it was likely timestomped by Kakos.
        """
        print(f"[Agathos] Scanning {directory} for MFT Timeline Anomalies...")
        anomalies = []
        for root, _, files in os.walk(directory):
            for file in files:
                path = os.path.join(root, file)
                try:
                    stat = os.stat(path)
                    # ctime is creation time on Windows. mtime is modification time.
                    if stat.st_mtime < stat.st_ctime:
                        anomalies.append({
                            "file": path,
                            "creation_time": datetime.fromtimestamp(stat.st_ctime).isoformat(),
                            "modification_time": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                            "anomaly": "MODIFIED_BEFORE_CREATED"
                        })
                except Exception:
                    pass
        
        if anomalies:
            self._log_finding("TIMESTOMP_DETECTED", json.dumps(anomalies))
        return anomalies

    def check_deadman_switch(self, process_exit_code: int):
        """
        The Heartbeat Monitor. If Kakos aborts abruptly (Sandbox Evasion),
        Agathos flags the environment as hostile but retains oversight.
        """
        if process_exit_code != 0:
            msg = f"Kakos terminated unexpectedly (Exit Code {process_exit_code}). Deadman Switch triggered. Environment is hostile."
            self._log_finding("DEADMAN_TRIGGERED", msg)
            return True
        return False

    def _log_finding(self, event_type: str, details: str):
        os.makedirs(os.path.dirname(self.audit_log), exist_ok=True)
        with open(self.audit_log, "a") as f:
            f.write(f"[{datetime.now().isoformat()}] [{event_type}] {details}\n")

if __name__ == "__main__":
    oracle = DeepForensicOracle()
    # Test scans on the current directory
    print("ADS Anomalies:", oracle.detect_ads_streams("."))
    print("Timestomp Anomalies:", oracle.detect_timestomping("."))
