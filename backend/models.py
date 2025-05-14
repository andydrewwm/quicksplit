from pydantic import BaseModel
from typing import List, Optional

class Item(BaseModel): #pydantics model automatically validates datatypes and converts JSON to python <-->
    name: str
    quantity: int
    price: float
    assigned_to: Optional[str] = None 

class Receipt(BaseModel):
    merchant_name: str
    date: str
    items: List[Item]
    subtotal: float
    tax: Optional[float] = None
    tip: Optional[float] = None
    total_amount: float

