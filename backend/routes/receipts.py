from fastapi import APIRouter
from database import receipts_collection
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
        
        sub_total = receipt.get("sub_total", 0)
        grand_total = receipt.get("grand_total", sub_total)

        fees = grand_total - sub_total

        sub_totals = {}
        for item in receipt["items"]:
            item_subtotal += item["price"]

            if "assigned_to" in item and item["assigned_to"]:
                person = item["assigned_to"]
                if person not in sub_totals:
                    sub_totals[person] = 0
            
                sub_totals[person] += item["price"] 
        
        grand_totals = {}
        for person, subtotal in sub_totals.items():
            grand_totals[person] = subtotal + (subtotal / grand_total) * fees
            grand_totals[person] = round(grand_totals[person], 2)
        
        return grand_totals

    except:
        return {"error": "Invalid receipt ID"}
