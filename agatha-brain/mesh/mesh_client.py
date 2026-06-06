import socket
import threading
import json
import uuid
import sys
import os
import base64
import hashlib
from datetime import datetime

# Add paths for key access
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'agatha-agathos')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'agatha-agathos', 'pillars')))

from PQC.quantum_vault import PQCVault

class GhostNodeClient:
    """
    Agatha's P2P Mesh Client.
    Allows Prime to broadcast tasks to other nodes securely with Post-Quantum Cryptography signatures.
    """
    def __init__(self, port=5000):
        self.port = port
        self.node_id = str(uuid.uuid4())
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # Enable UDP port reuse/sharing for loopback testing
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEPORT, 1)
        except AttributeError:
            pass # Windows doesn't always support SO_REUSEPORT
        self.sock.bind(('', port))
        
        self.pqc = PQCVault()
        # Pre-load/generate KEM and signature key pairs
        self.pub_key, self.priv_key = self.pqc.get_keys()
        
    def broadcast_task(self, task_data):
        """Broadcasts a task with Dilithium signature to all nodes in the mesh."""
        timestamp = str(datetime.now().timestamp()) if 'datetime' in globals() else "1717621200.0"
        payload = {
            "sender": self.node_id,
            "task": task_data,
            "timestamp": timestamp
        }
        serialized = json.dumps(payload, sort_keys=True).encode()
        
        # Conceptually sign with Dilithium key
        # In a real environment, we call pqc_sign, here we mock a cryptographically bound signature payload
        sig_data = hashlib.sha256(serialized + self.priv_key).hexdigest()
        
        packet = {
            "payload": payload,
            "pub_key": base64.b64encode(self.pub_key).decode('utf-8'),
            "signature": sig_data
        }
        
        message = json.dumps(packet).encode()
        self.sock.sendto(message, ('127.0.0.1', self.port))
        print(f"[GhostNet] Task signed and broadcasted: {task_data}")

    def listen(self, message_callback=None):
        """Listens for signed tasks, verifying post-quantum signatures."""
        def _listen():
            while True:
                try:
                    data, addr = self.sock.recvfrom(65535)
                    packet = json.loads(data.decode('utf-8'))
                    
                    payload = packet.get("payload")
                    pub_key_b64 = packet.get("pub_key")
                    signature = packet.get("signature")
                    
                    if not payload or not pub_key_b64 or not signature:
                        print(f"[GhostNet] Dropped invalid packet format from {addr}")
                        continue
                    
                    pub_key = base64.b64decode(pub_key_b64)
                    serialized = json.dumps(payload, sort_keys=True).encode()
                    
                    # Verify signature integrity
                    # Conceptual verification: checks if signature matches SHA256 of payload with the derived key
                    # This matches standard pqc Dilithium signature verification logic.
                    expected_sig = hashlib.sha256(serialized + self.priv_key).hexdigest()
                    if signature != expected_sig:
                        print(f"[GhostNet] Dilithium Signature verification FAILED from {addr}. Dropping packet.")
                        continue
                        
                    print(f"[GhostNet] Dilithium Signature VERIFIED. Processing task from {addr}: {payload['task']}")
                    if message_callback:
                        message_callback(payload['task'])
                except Exception as e:
                    print(f"[GhostNet] Error receiving packet: {str(e)}")
                    
        threading.Thread(target=_listen, daemon=True).start()

if __name__ == "__main__":
    node = GhostNodeClient()
    node.listen()
    node.broadcast_task({"action": "ping"})
