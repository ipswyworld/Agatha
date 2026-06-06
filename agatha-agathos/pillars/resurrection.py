import os
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.backends import default_backend

class PhantomOracle:
    def __init__(self):
        self.keys_dir = os.path.abspath(os.path.join(
            os.path.dirname(__file__), '..', '..', 'agatha-brain', 'knowledge', 'keys'
        ))
        self.priv_key_path = os.path.join(self.keys_dir, 'phantom_priv.pem')
        self.pub_key_path = os.path.join(self.keys_dir, 'phantom_pub.pem')
        self.audit_log_path = os.path.join(self.keys_dir, 'phantom_audit.log')

    def generate_keys(self):
        os.makedirs(self.keys_dir, exist_ok=True)
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend()
        )

        with open(self.priv_key_path, "wb") as f:
            f.write(private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.TraditionalOpenSSL,
                encryption_algorithm=serialization.NoEncryption()
            ))

        public_key = private_key.public_key()
        with open(self.pub_key_path, "wb") as f:
            f.write(public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            ))
        return self.pub_key_path, self.priv_key_path

    def resurrect_footprints(self, hidden_file_path: str):
        if not os.path.exists(self.priv_key_path):
            # Auto-generate keys if they do not exist
            self.generate_keys()
            raise FileNotFoundError(f"Phantom private key was missing. Generated a new pair at {self.priv_key_path}. Cannot decrypt old ledgers.")

        with open(self.priv_key_path, "rb") as key_file:
            private_key = serialization.load_pem_private_key(
                key_file.read(),
                password=None,
                backend=default_backend()
            )

        if not os.path.exists(hidden_file_path):
            raise FileNotFoundError(f"Hidden file {hidden_file_path} not found.")

        with open(hidden_file_path, "rb") as f:
            data = f.read()

        # Format from Rust: [RSA_Encrypted_AES_Key(256)] [AES_Nonce(12)] [AES_Encrypted_Payload_with_16_byte_Tag]
        rsa_key_size = 256
        if len(data) < rsa_key_size + 12 + 16:
            raise ValueError("Invalid .phantom_ledger.bin format")

        encrypted_aes_key = data[:rsa_key_size]
        nonce = data[rsa_key_size:rsa_key_size + 12]
        encrypted_payload = data[rsa_key_size + 12:] # This includes the 16-byte GCM tag appended by Rust

        try:
            # Rust used Pkcs1v15Encrypt
            aes_key = private_key.decrypt(
                encrypted_aes_key,
                padding.PKCS1v15()
            )
        except ValueError as e:
            raise ValueError(f"RSA Decryption failed, possibly wrong key: {e}")

        aesgcm = AESGCM(aes_key)
        try:
            decrypted_payload = aesgcm.decrypt(nonce, encrypted_payload, None)
        except Exception as e:
            raise ValueError(f"AES-GCM Decryption failed: {e}")

        os.makedirs(self.keys_dir, exist_ok=True)
        with open(self.audit_log_path, "ab") as f:
            f.write(b"--- RECOVERED RECORD ---\n")
            f.write(decrypted_payload)
            f.write(b"\n")

        return decrypted_payload.decode('utf-8', errors='replace')

def resurrect_footprints(hidden_file_path: str):
    oracle = PhantomOracle()
    return oracle.resurrect_footprints(hidden_file_path)

def generate_keys():
    oracle = PhantomOracle()
    return oracle.generate_keys()
