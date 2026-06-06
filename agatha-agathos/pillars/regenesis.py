import os
import shutil
import random
import sys
from datetime import datetime

class DigitalPhoenix:
    """
    Agathos's self-refactoring unit.
    Mutates source code to evade forensic fingerprinting and redeploys.
    """
    def __init__(self, target_dir="agatha"):
        self.target_dir = os.path.abspath(target_dir)
        self.backup_dir = os.path.join(self.target_dir, ".phoenix_backup")

    def backup_system(self):
        """Backs up the current state before mutation."""
        if os.path.exists(self.backup_dir):
            shutil.rmtree(self.backup_dir)
        shutil.copytree(self.target_dir, self.backup_dir, ignore=shutil.ignore_patterns('.phoenix_backup', '.git', 'node_modules'))
        print(f"[Regenesis] Backup created at {self.backup_dir}")

    def mutate_file(self, file_path: str):
        """Applies random mutations to a source file."""
        with open(file_path, 'r') as f:
            lines = f.readlines()
        
        # Mutation: Add inert junk function
        junk_func = f"\ndef _junk_{random.randint(1000, 9999)}():\n    return {random.randint(0, 100)}\n"
        lines.append(junk_func)
        
        # Mutation: Rename simple variables (rudimentary)
        new_content = "".join(lines).replace("temp", f"tmp_{random.randint(1,100)}")
        
        with open(file_path, 'w') as f:
            f.write(new_content)
        print(f"[Regenesis] Mutated {file_path}")

    def hot_reload(self):
        """Triggers a restart of the command loop."""
        print("[Regenesis] Restarting core...")
        os.execv(sys.executable, ['python'] + sys.argv)

if __name__ == "__main__":
    phoenix = DigitalPhoenix()
    phoenix.backup_system()
    # Mutate a dummy file for demonstration
    phoenix.mutate_file("agatha/agatha-agathos/pillars/intelligence.py")
    # phoenix.hot_reload()
