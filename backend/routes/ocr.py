from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import io
import pytesseract
from ..database import receipts_collection
import logging

router = APIRouter()

@router.post("/upload-receipt")
async def upload_receipt(file: UploadFile = File(...)):
    try:
        # Log file info
        print(f"Received file: {file.filename}, content-type: {file.content_type}")
        
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Perform OCR
        text = pytesseract.image_to_string(image)
        print(f"Extracted text: {text[:200]}...")  # Print first 200 chars
        
        # Parse items (make sure this matches your actual parsing logic)
        items = []
        lines = text.split("\n")
        for line in lines:
            parts = line.rsplit(" ", 1)
            if len(parts) == 2:
                name, price = parts
                try:
                    price = float(price.replace("$", ""))
                    items.append({"name": name.strip(), "price": price})
                except ValueError:
                    continue
        
        # Create receipt document
        receipt = {
            "items": items,
            "total_amount": sum(item["price"] for item in items)
        }
        
        # Insert into database
        new_receipt = await receipts_collection.insert_one(receipt)
        
        return {
            "receipt_id": str(new_receipt.inserted_id),
            "items": items,
            "total_amount": receipt["total_amount"]
        }
        
    except Exception as e:
        print(f"Error processing receipt: {str(e)}")  # Log the error
        raise HTTPException(
            status_code=500,
            detail=f"Error processing receipt: {str(e)}"
        )