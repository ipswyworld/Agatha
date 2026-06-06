import json
from monero.wallet import Wallet
from monero.backends.jsonrpc import JSONRPCWallet

class WarChest:
    """
    Agatha's autonomous financial engine.
    Handles Monero (XMR) transactions for resource acquisition.
    """
    def __init__(self, rpc_url="http://127.0.0.1:18082"):
        # Connects to a local Monero RPC wallet daemon
        self.wallet = Wallet(JSONRPCWallet(url=rpc_url))
        
    def get_balance(self):
        """Retrieve total XMR balance."""
        return self.wallet.balance()
    
    def send_payment(self, address: str, amount_xmr: float):
        """Send payment. Amount in XMR."""
        # Monero-python handles atomic units conversion
        return self.wallet.transfer(address, amount_xmr)

    def generate_escrow_invoice(self, amount: float):
        """Generate a fresh sub-address for receiving funds."""
        return self.wallet.new_address()

if __name__ == "__main__":
    print("WarChest initialized.")
