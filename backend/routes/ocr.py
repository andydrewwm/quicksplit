from fastapi import APIRouter, UploadFile, File, HTTPException
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.core.credentials import AzureKeyCredential
from database import receipts_collection
import io
import pprint
import os
import logging

router = APIRouter()

AZURE_ENDPOINT = os.getenv("AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT")
AZURE_KEY = os.getenv("AZURE_DOCUMENT_INTELLIGENCE_KEY")

document_client = DocumentIntelligenceClient(AZURE_ENDPOINT, AzureKeyCredential(AZURE_KEY))

@router.post("/upload-receipt")
async def upload_receipt(file: UploadFile = File(...)):
    try:
        # Log file info
        print(f"Received file: {file.filename}, content-type: {file.content_type}")
        
        # Read image content
        contents = await file.read()
        receipt_stream = io.BytesIO(contents)
        
        # Use Azure's prebuilt receipt model
        poller = document_client.begin_analyze_document("prebuilt-receipt", receipt_stream)
        result = poller.result()

        if not result.documents:
            raise HTTPException(status_code=400, detail="No receipt data detected")
        
        receipt_data = result.documents[0].fields
        
        items = []
        for item in receipt_data.get("Items", {}).get("valueArray"):
            name = item.get("valueObject", {}).get("Description", {}).get("content")
            price = item.get("valueObject", {}).get("TotalPrice", {}).get("content")
            print(name, price)
            if name and price:
                items.append({"name": name.strip(), "price": float(price.replace("$", "").replace(",", ""))})

        sub_total = sum(item["price"] for item in items)
        doc_total = None
        if "Total" in receipt_data:
            doc_total = receipt_data.get("Total", {}).get("valueCurrency", {}).get("amount")
            print(f"total: {doc_total}")
        
        # Create receipt document
        receipt = {
            "items": items,
            "sub_total": sub_total,
            "grand_total": doc_total if doc_total else sub_total,
        }
        
        # Insert into database
        new_receipt = await receipts_collection.insert_one(receipt)
        
        return {
            "receiptId": str(new_receipt.inserted_id),
            "items": items,
            "sub_total": receipt["sub_total"],
            "grand_total": receipt["grand_total"]
        }
        
    except Exception as e:
        print(f"Error processing receipt: {str(e)}")  # Log the error
        raise HTTPException(
            status_code=500,
            detail=f"Error processing receipt: {str(e)}"
        )