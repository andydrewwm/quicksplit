from fastapi import APIRouter
from ..database import receipts_collection
from ..models import Receipt
from bson import ObjectId

router = APIRouter()

@router.post("/assign-items/{receipt_id}")
async def assign_items(receipt_id: str, assignments: dict):
    update_query = {"_id": receipt_id}
    update_values = {"$set": {"items": assignments}}
    await receipts_collection.update_one(update_query, update_values)
    return {"message": "Assignments updated"}

@router.get("/total-owed/{receipt_id}")
async def get_totals(receipt_id: str):
    receipt = await receipts_collection.find_one({"_id": receipt_id})
    if not receipt:
        return {"error": "Receipt not found"}

    totals = {}
    for item in receipt["items"]:
        if item["assigned_to"]:
            totals[item["assigned_to"]] = totals.get(item["assigned_to"], 0) + item["price"]

    return totals
