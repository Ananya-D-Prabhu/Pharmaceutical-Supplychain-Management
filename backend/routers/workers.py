from fastapi import APIRouter
from model import WorkerModel
from contract import contract, send_transaction
from database import db

router = APIRouter(prefix="/workers")

@router.post("/add")
def add_worker(data: WorkerModel):
    try:
        print(f"📝 Adding worker: {data.name}, role: {data.role}, address: {data.walletAddress}")
        
        # Prepare contract function with wallet address
        contract_function = contract.functions.registerWorker(data.name, data.role, data.walletAddress)
        
        # Send signed transaction
        result = send_transaction(contract_function)
        print(f"📦 Transaction result: {result}")
        
        if result["success"]:
            db.workers.insert_one({"name": data.name, "role": data.role, "walletAddress": data.walletAddress})
            response_data = {"message": "Worker added", "tx_hash": result["tx_hash"]}
            print(f"✅ Response: {response_data}")
            return response_data
        else:
            error_response = {"error": result["error"]}
            print(f"❌ Error response: {error_response}")
            return error_response, 400
            
    except Exception as e:
        error_response = {"error": str(e)}
        print(f"❌ Exception: {error_response}")
        return error_response, 400

@router.get("/list")
def list_workers():
    result = db.workers.find()
    return list(result)
