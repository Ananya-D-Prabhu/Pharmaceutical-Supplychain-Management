from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv
import json
import os

# Load environment variables
load_dotenv()

# --------------------------------------
# Environment variables
# --------------------------------------
RPC_URL = os.getenv("RPC_URL")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")

# --------------------------------------
# Connect to Ethereum node (Hardhat/Ganache/Testnet)
# --------------------------------------
web3 = Web3(Web3.HTTPProvider(RPC_URL))

if not web3.is_connected():
    raise Exception("❌ Web3 Connection Failed. Check RPC_URL in .env")

print("✅ Connected to Blockchain:", web3.is_connected())

# Create account from private key for signing transactions
try:
    account = Account.from_key(PRIVATE_KEY)
    print(f"✅ Account loaded: {account.address}")
except Exception as e:
    print(f"❌ Error loading account: {e}")
    account = None

# --------------------------------------
# Load ABI from file
# --------------------------------------
ABI_PATH = os.path.join(os.path.dirname(__file__), "abi.json")

with open(ABI_PATH, "r") as f:
    contract_abi = json.load(f)

# --------------------------------------
# Contract Object
# --------------------------------------
try:
    contract = web3.eth.contract(
        address=Web3.to_checksum_address(CONTRACT_ADDRESS),
        abi=contract_abi
    )
    print("✅ Smart Contract Loaded Successfully")
except Exception as e:
    print("❌ Error loading contract:", e)
    contract = None


# ===========================================================
# Helper Functions for Auto-Signing Transactions
# ===========================================================

def send_transaction(contract_function, gas=300000):
    """
    Helper function to build, sign, and send a transaction
    """
    if not account:
        raise Exception("Account not loaded")
    
    try:
        # Get nonce
        nonce = web3.eth.get_transaction_count(account.address)
        
        # Build transaction
        tx_dict = contract_function.build_transaction({
            "from": account.address,
            "nonce": nonce,
            "gas": gas,
            "gasPrice": web3.eth.gas_price,
        })
        
        # Sign transaction
        signed_tx = web3.eth.account.sign_transaction(tx_dict, PRIVATE_KEY)
        
        # Send raw transaction (use .raw_transaction instead of .rawTransaction)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)
        
        # Wait for receipt
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash, timeout=30)
        
        return {
            "success": True,
            "tx_hash": tx_hash.hex(),
            "receipt": dict(receipt)
        }
    except Exception as e:
        print(f"Transaction error: {e}")
        return {
            "success": False,
            "error": str(e)
        }

def call_contract(function_name, *args):
    """
    For read-only smart contract functions.
    Example:
        call_contract("getProducts")
    """
    func = getattr(contract.functions, function_name)
    return func(*args).call()
