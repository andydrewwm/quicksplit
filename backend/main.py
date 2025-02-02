from fastapi import FastAPI
from .routes import ocr, receipts

app = FastAPI()

# Include routers
app.include_router(ocr.router)
app.include_router(receipts.router)