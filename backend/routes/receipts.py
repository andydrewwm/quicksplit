from fastapi import APIRouter, Body, HTTPException, status
from database import receipts_collection
from models import Receipt, ReceiptUpdate
from pymongo import ReturnDocument
from bson import ObjectId

router = APIRouter()

@router.put(
    "/assign-items/{id}",
    response_model=Receipt,
    response_model_by_alias=False
)
async def update_items(id: str, receipt: ReceiptUpdate = Body(...)):
    receipt = {
        k: v for k, v in receipt.model_dump(by_alias=True).items() if v is not None
    }

    if len(receipt) >= 1:
        updated_receipt = await receipts_collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": receipt},
            return_document=ReturnDocument.AFTER
        )
        if updated_receipt is not None:
            return updated_receipt

    else:
        existing_receipt = await receipts_collection.find_one({"_id": id})
        if existing_receipt is not None:
            return existing_receipt
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Receipt {id} not found"
    )
    
@router.get("/total-owed/{id}")
async def get_totals(id: str):
    receipt_dict = await receipts_collection.find_one({"_id": ObjectId(id)})
    if receipt_dict is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Receipt {id} not found"
        )
    
    receipt = Receipt(**receipt_dict)

    fees = receipt.total - receipt.subtotal

    sub_totals = {}
    for item in receipt.items:
        if item.assigned_to:
            person = item.assigned_to
            if person not in sub_totals:
                sub_totals[person] = 0
        
            sub_totals[person] += item.price

    for person in sub_totals:
        proportion = sub_totals[person] / receipt.subtotal
        sub_totals[person] += round(fees * proportion,2)

    return sub_totals
