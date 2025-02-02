from pydantic import BaseModel
from typing import List, Optional

class Item(BaseModel): #pydantics model automatically validates datatypes and converts JSON to python <-->
    name: str
    price: float
    assigned_to: Optional[str] = None  # Name of person

class Receipt(BaseModel):
    user_id: str
    total_amount: float
    items: List[Item]

class Person(BaseModel):
    name: str
    total_owed: float