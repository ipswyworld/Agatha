import subprocess
import time
import os
import sys

class TheLibrarian:
    """
    The 24/7 Guardian of The Library.
    Orchestrates the Archives, Curriculum, Proving Grounds, and the Forge.
    """
    def __init__(self):
        self.library_dir = os.path.dirname(os.path.abspath(__file__))
        self.processes = []

    def open_library(self):
        """Starts the 24/7 learning operations."""
        print("\n" + "="*50)
        print(" PROJECT AGATHA: THE LIBRARY IS NOW OPEN (24/7)")
        print("="*50 + "\n")
        
        # 1. Start the Proving Grounds
        print("[*] Wing: The Proving Grounds [ACTIVATED]")
        self.processes.append(subprocess.Popen([sys.executable, os.path.join(self.library_dir, "gyms", "kakos_gym.py")]))
        self.processes.append(subprocess.Popen([sys.executable, os.path.join(self.library_dir, "gyms", "agathos_gym.py")]))
        self.processes.append(subprocess.Popen([sys.executable, os.path.join(self.library_dir, "war_room", "war_room.py")]))

    def run_curation_cycle(self):
        """Continuous loop to update knowledge and training focus."""
        from curator import TheCurator
        curator = TheCurator()
        while True:
            try:
                print("[*] Wing: The Archives [INGESTING NEW SKILLS]")
                print("[*] Wing: The Curriculum [UPDATING TARGETED TRAINING]")
                curator.generate_curriculum()
                time.sleep(3600) 
            except KeyboardInterrupt:
                self.close_library()
                break

    def close_library(self):
        print("\n[*] The Librarian: Closing wings...")
        for p in self.processes:
            p.terminate()

if __name__ == "__main__":
    librarian = TheLibrarian()
    librarian.open_library()
    librarian.run_curation_cycle()
