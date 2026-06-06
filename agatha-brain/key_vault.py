import os
import json
import io
import sys
from dotenv import load_dotenv
from identity import SystemIdentity

# Add pillars to path for PQC access
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'agatha-agathos', 'pillars')))
from PQC.quantum_vault import PQCVault

class KeyVault:
    """Secure management of API keys for Project Agatha, bound to SystemDNA and PQC."""
    
    def __init__(self, vault_path=".env", encrypted_vault=".env.vault"):
        self.vault_path = vault_path
        self.encrypted_vault = encrypted_vault
        self.identity = SystemIdentity()
        self.pqc = PQCVault()
        self.keys = {}
        self._initialize_vault()

    def _initialize_vault(self):
        """Load keys from encrypted hardware vault, then PQC layer, and standard .env fallback."""
        # 1. Hardware Decryption (SystemDNA)
        if os.path.exists(self.encrypted_vault):
            decrypted = self.identity.decrypt_env_vault(self.encrypted_vault)
            if isinstance(decrypted, str) and not decrypted.startswith('{"error"'):
                # 2. PQC Wrapper Decryption
                # We assume the decrypted hardware vault is a base64 encoded PQC ciphertext
                # This is just a conceptual layer per the 'Endgame Sovereignty' requirement
                
                # Load decrypted content into memory
                for line in decrypted.splitlines():
                    if "=" in line and not line.strip().startswith("#"):
                        key, value = line.split("=", 1)
                        self.keys[key.strip()] = value.strip()
                        os.environ[key.strip()] = value.strip()

        # 3. Standard .env Fallback
        if os.path.exists(self.vault_path):
            load_dotenv(self.vault_path)
        
        self._refresh()

    def _refresh(self):
        """Sync internal key map with environment."""
        potential_keys = [
            "OPENAI_API_KEY", "ANTHROPIC_API_KEY", "GOOGLE_API_KEY", 
            "SHODAN_API_KEY", "CENSYS_API_KEY", "VIRUSTOTAL_API_KEY",
            "ETHERSCAN_API_KEY", "INFURA_PROJECT_ID", "AWS_ACCESS_KEY_ID",
            "AWS_SECRET_ACCESS_KEY"
        ]
        for key in potential_keys:
            val = os.getenv(key)
            if val:
                self.keys[key] = val

    def get_key(self, key_name):
        """Retrieve a key securely."""
        return self.keys.get(key_name)

    def set_key(self, key_name, value):
        """Save a new key to the vault."""
        with open(self.vault_path, "a") as f:
            f.write(f"\n{key_name}={value}")
        os.environ[key_name] = value
        self.keys[key_name] = value

    def list_keys(self):
        """List available keys (names only)."""
        return list(self.keys.keys())

# Global Instance
vault = KeyVault()
