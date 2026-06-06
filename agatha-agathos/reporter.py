import json
import datetime
import hashlib

def generate_evidence_package(target, violation_type, evidence_data):
    """
    Generates a JSON-formatted Evidence Package.
    """
    timestamp = datetime.datetime.utcnow().isoformat() + 'Z'
    evidence_hash = hashlib.sha256(evidence_data.encode('utf-8')).hexdigest()
    
    package = {
        "timestamp": timestamp,
        "target": target,
        "evidence_hash": evidence_hash,
        "violation_type": violation_type
    }
    
    return json.dumps(package, indent=4)

if __name__ == "__main__":
    # Example usage
    target_info = "192.168.1.1"
    v_type = "Illicit Content"
    e_content = "Sample evidence data for demonstration purposes."
    
    print(generate_evidence_package(target_info, v_type, e_content))
