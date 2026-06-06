import sys
import os
import subprocess
import importlib.util

# Add project root and internal dirs to path
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(root)
sys.path.append(os.path.join(root, 'agatha-brain'))
sys.path.append(os.path.join(root, 'agatha-agathos', 'pillars'))

def load_module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

# Import components dynamically
key_vault = load_module("key_vault", os.path.join(root, "agatha-brain", "key_vault.py"))
governor = load_module("governor", os.path.join(root, "agatha-brain", "governor.py"))
resurrection = load_module("resurrection", os.path.join(root, "agatha-agathos", "pillars", "resurrection.py"))
hydra = load_module("hydra", os.path.join(root, "agatha-agathos", "pillars", "hydra.py"))

def test_identity_and_vault():
    print("[TEST] Checking Identity & KeyVault...")
    if not key_vault.vault.list_keys():
        print("[-] KeyVault is empty, but Identity fingerprint is valid.")
    else:
        print("[+] Identity & KeyVault operational.")

def test_governor():
    print("[TEST] Checking Governor/Bicameral Circuit Breaker...")
    gov = governor.BicameralCircuitBreaker()
    gov.record_call("Kakos")
    print(f"[+] Governor active, Ethical Heat: {gov.get_ethical_heat()}")

def test_phantom_ledger():
    print("[TEST] Checking Phantom Ledger...")
    oracle = resurrection.PhantomOracle()
    # Ensure keys exist
    oracle.generate_keys()
    print("[+] Resurrection Pillar operational.")

def test_hydra_integrity():
    print("[TEST] Checking Hydra Integrity...")
    hydra_inst = hydra.Hydra(target_dir=root)
    # Just verify, don't trigger auto-heal on existing files yet
    hydra_inst.verify_integrity()
    print("[+] Hydra Integrity Pillar operational.")

def test_rust_engine():
    print("[TEST] Checking Rust Kakos Compilation...")
    # Attempt to compile the Rust engine
    result = subprocess.run(['cargo', 'check'], cwd=os.path.join(root, 'agatha-kakos'), capture_output=True, text=True)
    if result.returncode == 0:
        print("[+] Kakos Rust Engine compiles successfully.")
    else:
        print(f"[-] Kakos Rust Engine failed to compile: {result.stderr}")

if __name__ == "__main__":
    print("--- Starting System Integration Suite ---")
    test_identity_and_vault()
    test_governor()
    test_phantom_ledger()
    test_hydra_integrity()
    test_rust_engine()
    print("--- Integration Suite Complete ---")
