import os
import shutil
import hashlib
import json
import subprocess
from pathlib import Path

# Assuming these are available in the project structure
# from mesh.mesh_client import GhostNodeClient 

class Hydra:
    """
    Agatha's regenerative pillar. Ensures the system is always functional,
    even if core components are corrupted or destroyed by forensic actors.
    """
    def __init__(self, target_dir="agatha"):
        self.target_dir = os.path.abspath(target_dir)
        self.backup_dir = os.path.join(self.target_dir, ".phoenix_backup")
        self.integrity_file = os.path.join(self.target_dir, ".integrity_db.json")

    def verify_integrity(self):
        """Scans core files and checks against known good hashes."""
        print("[Hydra] Verifying system integrity...")
        if not os.path.exists(self.integrity_file):
            self._create_integrity_db()
            return True
        
        with open(self.integrity_file, 'r') as f:
            db = json.load(f)
            
        for path, expected_hash in db.items():
            if not os.path.exists(path):
                print(f"[Hydra] CRITICAL: File missing: {path}")
                self.heal(path)
                continue
                
            actual_hash = self._get_hash(path)
            if actual_hash != expected_hash:
                print(f"[Hydra] CRITICAL: File tampered: {path}")
                self.heal(path)
        return True

    def _get_hash(self, path):
        hasher = hashlib.sha256()
        with open(path, 'rb') as f:
            while chunk := f.read(8192):
                hasher.update(chunk)
        return hasher.hexdigest()

    def _create_integrity_db(self):
        """Creates a snapshot of the current system for integrity checks."""
        db = {}
        ignored_dirs = {".git", ".phoenix_backup", "node_modules", "target", ".next"}
        for root, dirs, files in os.walk(self.target_dir):
            # Modify dirs in-place to prevent recursing into build/dependency folders
            dirs[:] = [d for d in dirs if d not in ignored_dirs]
            for file in files:
                path = os.path.join(root, file)
                db[path] = self._get_hash(path)
        with open(self.integrity_file, 'w') as f:
            json.dump(db, f, indent=4)
        print("[Hydra] Integrity database created.")

    def heal(self, path):
        """Restores a single file from the backup."""
        relative_path = os.path.relpath(path, self.target_dir)
        backup_path = os.path.join(self.backup_dir, relative_path)
        if os.path.exists(backup_path):
            shutil.copy2(backup_path, path)
            print(f"[Hydra] File {relative_path} healed.")
        else:
            print(f"[Hydra] Cannot heal {relative_path}: Backup missing.")

    def spawn_redundant_unit(self, unit_script):
        """Spawns a critical unit if it has crashed."""
        print(f"[Hydra] Respawning unit: {unit_script}")
        subprocess.Popen(['python', unit_script])

    def sync_from_mesh(self):
        """Pulls the current system state from the P2P mesh peers."""
        print("[Hydra] Synchronizing state from Ghost Net peers...")
        # Conceptual call to mesh_client logic
        # node = GhostNodeClient()
        # node.request_state_sync()
        pass

if __name__ == "__main__":
    hydra = Hydra()
    hydra.verify_integrity()
