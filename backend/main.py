from fastapi import FastAPI
from .routes import ocr, receipts
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Update with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include routers
app.include_router(ocr.router)
app.include_router(receipts.router)

@app.get("/")
async def root():
    return {"message": "Receipt Splitter API is running"}