from fastapi import APIRouter
from model import StatusModel
from contract import contract, send_transaction
from database import db

router = APIRouter(prefix="/status")

@router.post("/update")
def update_status(data: StatusModel):
    try:
        contract_function = contract.functions.updateStatus(
            data.productId,
            data.location,
            data.temperature,
            data.humidity,
            data.heatIndex,
            data.quantity,
            True
        )
        
        result = send_transaction(contract_function)
        
        if result["success"]:
            db.status.insert_one(data.dict())
            return {"message": "Status updated", "tx_hash": result["tx_hash"]}
        else:
            return {"error": result["error"]}, 400
            
    except Exception as e:
        return {"error": str(e)}, 400


@router.get("/track/{pid}")
def track_status(pid: int):
    status_data = db.status.find({"pid": pid})
    return list(status_data)
