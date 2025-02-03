from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import uuid4

def generate_id():
    return str(uuid4())

class Item(BaseModel): #pydantics model automatically validates datatypes and converts JSON to python <-->
    id: str = Field(default_factory=generate_id)
    name: str
    price: float
    assigned_to: Optional[str] = None  # Name of person

class Receipt(BaseModel):
    user_id: str #not using currently
    total_amount: float
    items: List[Item]

class Person(BaseModel):
    name: str
    total_owed: float
