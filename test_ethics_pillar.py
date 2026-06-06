
import sys
import os
import json

# Add the pillars directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "agatha-agathos", "pillars")))

try:
    import ethics
    
    def test_ethics():
        print("Testing Ethical Veto...")
        print(json.dumps(ethics.ethical_veto("Mass_Surveillance in city center", 0.9), indent=2))
        
        print("\nTesting Privacy Masking...")
        test_data = "Contact me at john.doe@example.com or call 555-0199. My IP is 192.168.1.1."
        res = ethics.privacy_masking(test_data)
        print(json.dumps(res, indent=2))
        
        print("\nTesting Law Enforcement Liaison...")
        incident = {"summary": "Data breach at bank", "jurisdiction": "UK"}
        print(json.dumps(ethics.law_enforcement_liaison(incident), indent=2))

        print("\nTesting Psychological Firewall...")
        msg = "This is a very urgent message. Don't be afraid, but you should act now or you will regret it. Stop gaslighting me."
        print(json.dumps(ethics.psychological_firewall(msg), indent=2))

    if __name__ == "__main__":
        test_ethics()

except ImportError as e:
    print(f"Import Error: {e}")
    print(f"Current sys.path: {sys.path}")
