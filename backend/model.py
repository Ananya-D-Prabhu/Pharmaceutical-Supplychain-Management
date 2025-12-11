from pydantic import BaseModel

class WorkerModel(BaseModel):
    name: str
    role: int  # 0: MANUFACTURER, 1: DISTRIBUTOR, 2: TRANSPORTER
    walletAddress: str  # New: Ethereum address of the worker

class ProductModel(BaseModel):
    name: str
    description: str
    requiredTemp: str
    mfgDate: str

class StatusModel(BaseModel):
    productId: int
    location: str
    temperature: str
    humidity: str
    heatIndex: str
    quantity: int

