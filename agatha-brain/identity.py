try:
    import wmi
except ImportError:
    wmi = None
import uuid
import hashlib
import os
import base64
from cryptography.fernet import Fernet

class SystemIdentity:
    """
    Generates a unique SystemDNA fingerprint for the host machine.
    Uses CPU ID, Disk Serial, and MAC Address as hardware anchors.
    Provides logic to decrypt the .env vault using this fingerprint.
    """
    def __init__(self):
        try:
            self.w = wmi.WMI()
        except Exception:
            self.w = None

    def get_cpu_id(self):
        """Retrieve the Processor ID via WMI."""
        if self.w:
            try:
                for cpu in self.w.Win32_Processor():
                    if cpu.ProcessorId:
                        return cpu.ProcessorId.strip()
            except Exception:
                pass
        return os.environ.get("PROCESSOR_REVISION", "CPU-GHOST-ID")

    def get_disk_serial(self):
        """Retrieve the Serial Number of the primary physical media."""
        if self.w:
            try:
                for disk in self.w.Win32_PhysicalMedia():
                    if disk.SerialNumber:
                        return disk.SerialNumber.strip()
            except Exception:
                pass
        return "DISK-PHANTOM-SN"

    def get_mac_address(self):
        """Retrieve the system MAC address via uuid node."""
        node = uuid.getnode()
        return ':'.join(['{:02x}'.format((node >> ele) & 0xff) for ele in range(0, 8*6, 8)][::-1])

    def generate_system_dna(self):
        """
        Combine hardware IDs into a SystemDNA fingerprint.
        This fingerprint is unique to the physical hardware.
        """
        cpu = self.get_cpu_id()
        disk = self.get_disk_serial()
        mac = self.get_mac_address()
        raw_dna = f"AGATHA-CORE-{cpu}-{disk}-{mac}"
        return hashlib.sha256(raw_dna.encode()).hexdigest()

    def derive_vault_key(self, dna=None):
        """
        Derive a Fernet-compatible key from the SystemDNA.
        Ensures the key is hardware-bound.
        """
        if dna is None:
            dna = self.generate_system_dna()
        # Hash the DNA to get 32 bytes and base64 encode it for Fernet requirements
        key_hash = hashlib.sha256(dna.encode()).digest()
        return base64.urlsafe_b64encode(key_hash)

    def decrypt_env_vault(self, encrypted_path=".env.vault"):
        """
        Decrypt the .env vault using the hardware-bound SystemDNA key.
        Returns the decrypted string content.
        """
        key = self.derive_vault_key()
        f = Fernet(key)
        
        if not os.path.exists(encrypted_path):
            # If default .env.vault doesn't exist, try local .env if it's encrypted
            # But per prompt, we decrypt the vault.
            return {"error": f"Vault file '{encrypted_path}' not found."}
            
        try:
            with open(encrypted_path, "rb") as vault_file:
                encrypted_content = vault_file.read()
            
            decrypted_content = f.decrypt(encrypted_content)
            return decrypted_content.decode()
        except Exception as e:
            return {"error": f"Decryption failed (DNA mismatch or corrupt vault): {str(e)}"}

if __name__ == "__main__":
    identity = SystemIdentity()
    dna = identity.generate_system_dna()
    print(f"SystemDNA Fingerprint generated: {dna}")
    print(f"Hardware Key derived for Fernet: {identity.derive_vault_key(dna).decode()}")
