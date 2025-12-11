from fastapi import APIRouter
from model import ProductModel
from contract import contract, send_transaction
from database import db

router = APIRouter(prefix="/products")

@router.post("/add")
def add_product(data: ProductModel):
    try:
        contract_function = contract.functions.addProduct(
            data.name,
            data.description,
            data.requiredTemp,
            data.mfgDate
        )
        
        result = send_transaction(contract_function)
        
        if result["success"]:
            db.products.insert_one(data.dict())
            return {"message": "Product added", "tx_hash": result["tx_hash"]}
        else:
            return {"error": result["error"]}, 400
            
    except Exception as e:
        return {"error": str(e)}, 400


@router.get("/list")
def list_products():
    return list(db.products.find())


@router.get("/history/{product_id}")
def get_product_history(product_id: int):
    try:
        history = contract.functions.getProductHistory(product_id).call()
        result = []
        for status in history:
            result.append({
                "location": status[0],
                "temperature": status[1],
                "humidity": status[2],
                "heatIndex": status[3],
                "workerId": status[4],
                "productId": status[5],
                "quantity": status[6],
                "qualityMaintained": status[7],
                "timestamp": status[8]
            })
        return result
    except Exception as e:
        return {"error": str(e)}, 400
