from fastapi import APIRouter
from database import receipts_collection
from models import Receipt
from bson import ObjectId

router = APIRouter()

@router.post("/assign-items/{receipt_id}")
async def assign_items(receipt_id: str, assignments: dict):
    try:
        object_id = ObjectId(receipt_id)
        
        # Get current receipt
        receipt = await receipts_collection.find_one({"_id": object_id})
        if not receipt:
            return {"error": "Receipt not found"}

        # Update items with assignments
        updated_items = receipt['items']
        assignments_dict = assignments.get('assignments', {})
        
        for item in updated_items:
            if item['name'] in assignments_dict:
                item['assigned_to'] = assignments_dict[item['name']]

        # Update the document
        result = await receipts_collection.update_one(
            {"_id": object_id},
            {"$set": {"items": updated_items}}
        )
        
        return {"message": "Assignments updated"}
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return {"error": f"Invalid receipt ID: {str(e)}"}
    
@router.get("/total-owed/{receipt_id}")
async def get_totals(receipt_id: str):
    try:
        object_id = ObjectId(receipt_id)
        receipt = await receipts_collection.find_one({"_id": object_id})
        if not receipt:
            return {"error": "Receipt not found"}

        totals = {}
        for item in receipt["items"]:
            if item["assigned_to"]:
                totals[item["assigned_to"]] = totals.get(item["assigned_to"], 0) + item["price"]

        return totals
    except:
        return {"error": "Invalid receipt ID"}
