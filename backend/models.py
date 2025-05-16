from pydantic import BaseModel, ConfigDict, Field
from pydantic.functional_validators import BeforeValidator
from typing import List, Optional
from typing_extensions import Annotated

# MongoDB ObjectId as string for Pydantic/JSON compatibility
PyObjectId = Annotated[str, BeforeValidator(str)]

class Item(BaseModel):
    """
    Represents an item on a receipt.
    """
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    price: float
    quantity: Optional[int] = None
    assigned_to: Optional[str] = None
    model_config = ConfigDict(populate_by_name=True)

class Receipt(BaseModel):
    """
    Represents a receipt containing multiple items.
    """
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    merchant_name: Optional[str] = None
    date: Optional[str] = None
    items: List[Item]
    subtotal: float
    total: float
    model_config = ConfigDict(populate_by_name=True)

class ReceiptUpdate(BaseModel):
    """
    Model for updating a receipt. All fields are optional.
    """
    merchant_name: Optional[str] = None
    date: Optional[str] = None
    items: Optional[List[Item]] = None
    subtotal: Optional[float] = None
    total: Optional[float] = None
