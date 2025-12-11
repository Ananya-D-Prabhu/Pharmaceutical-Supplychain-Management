from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import workers, products, status

app = FastAPI(title="Pharmaceutical Supply Chain Backend")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change to specific URL in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
def root():
    return {"message": "Backend running successfully"}

app.include_router(workers.router)
app.include_router(products.router)
app.include_router(status.router)
