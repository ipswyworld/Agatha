import os
try:
    from pqcrypto.kem.kyber1024 import generate_keypair, encrypt, decrypt
    from pqcrypto.sign.dilithium5 import generate_keypair as sign_gen, sign, verify
except ImportError:
    # Standardized module names in modern pqcrypto library
    from pqcrypto.kem.ml_kem_1024 import generate_keypair, encrypt, decrypt
    from pqcrypto.sign.ml_dsa_87 import generate_keypair as sign_gen, sign, verify

class PQCVault:
    """
    Agathos's Post-Quantum Cryptographic Vault.
    Uses Kyber (KEM) for secure key encapsulation and Dilithium for digital signatures.
    """
    def __init__(self, vault_dir="agatha-brain/knowledge/keys/pqc"):
        # Correctly resolve the path relative to this file
        self.vault_dir = os.path.abspath(os.path.join(
            os.path.dirname(__file__), '..', '..', '..', vault_dir
        ))
        os.makedirs(self.vault_dir, exist_ok=True)
        self.kem_pub_path = os.path.join(self.vault_dir, 'kem_pub.bin')
        self.kem_priv_path = os.path.join(self.vault_dir, 'kem_priv.bin')

    def generate_kem_keys(self):
        pub, priv = generate_keypair()
        with open(self.kem_pub_path, 'wb') as f: f.write(pub)
        with open(self.kem_priv_path, 'wb') as f: f.write(priv)
        return pub, priv

    def get_keys(self):
        if not os.path.exists(self.kem_pub_path):
            return self.generate_kem_keys()
        with open(self.kem_pub_path, 'rb') as f: pub = f.read()
        with open(self.kem_priv_path, 'rb') as f: priv = f.read()
        return pub, priv

    def pqc_sign(self, message: bytes, priv_key: bytes):
        return sign(message, priv_key)

    def pqc_verify(self, message: bytes, signature: bytes, pub_key: bytes):
        try:
            verify(signature, message, pub_key)
            return True
        except:
            return False

if __name__ == "__main__":
    vault = PQCVault()
    pub, priv = vault.get_keys()
    print(f"PQC Keys loaded: {len(pub)} bytes pub, {len(priv)} bytes priv")
