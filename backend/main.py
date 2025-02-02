from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import pytesseract
from PIL import Image
import io
from database import receipts_collection
import requests
import os

app = FastAPI()

# Define models
class Receipt(BaseModel):
    user_id: str
    total_amount: float
    items: list

class Request(BaseModel):
    recipient: str
    amount: float
    note: str