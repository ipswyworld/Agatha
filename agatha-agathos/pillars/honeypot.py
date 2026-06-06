import socket
import threading
import os
import sys

# Add agatha-brain to path so we can import the vault
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'agatha-brain')))
from knowledge.malware_vault import MalwareVault

class AutonomousHoneypot:
    """
    Agathos's snare. Opens a vulnerable-looking port to capture
    live malware from the internet or local network.
    """
    def __init__(self, port=2222, service_name="FakeSSH"):
        self.port = port
        self.service_name = service_name
        self.vault = MalwareVault()
        self.is_running = False

    def handle_client(self, client_socket, address):
        print(f"[Honeypot] Connection detected from {address}")
        try:
            # Send a fake banner
            banner = b"SSH-2.0-OpenSSH_7.2p2 Ubuntu-4ubuntu2.8\r\n"
            client_socket.send(banner)
            
            # Wait for payload (e.g., an automated exploit or brute force dictionary)
            payload = client_socket.recv(4096)
            if payload:
                print(f"[Honeypot] Captured payload ({len(payload)} bytes). Isolating...")
                
                # We save it with a timestamp
                import time
                timestamp = int(time.time())
                sample_name = f"Captured_{self.service_name}_{address[0]}_{timestamp}"
                
                # Send to the vault for secure, encrypted storage
                self.vault.add_sample(sample_name, "Unknown_Exploit", payload, f"Honeypot:{address[0]}")
                
        except Exception as e:
            print(f"[Honeypot] Error handling client: {e}")
        finally:
            client_socket.close()

    def start(self):
        self.is_running = True
        server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server.bind(('0.0.0.0', self.port))
        server.listen(5)
        print(f"[Agathos] Honeypot online. Listening on port {self.port} as {self.service_name}...")
        
        while self.is_running:
            try:
                client, addr = server.accept()
                client_handler = threading.Thread(target=self.handle_client, args=(client, addr))
                client_handler.start()
            except KeyboardInterrupt:
                print("[Honeypot] Shutting down.")
                break
        server.close()

if __name__ == "__main__":
    hp = AutonomousHoneypot()
    hp.start()
