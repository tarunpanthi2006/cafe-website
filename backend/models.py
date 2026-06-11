from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class OrderTypeEnum(str, Enum):
    dine_in = 'dine_in'
    takeaway = 'takeaway'
    delivery = 'delivery'

class OrderStatusEnum(str, Enum):
    placed = 'placed'
    preparing = 'preparing'
    out_for_delivery = 'out_for_delivery'
    delivered = 'delivered'
    ready = 'ready'
    served = 'served'

class MenuItemResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    price: float
    category: str
    image_url: Optional[str]
    is_veg: bool
    is_vegan: bool
    is_gluten_free: bool
    is_available: bool
    avg_rating: Optional[float] = 0.0

class OrderItemRequest(BaseModel):
    menu_item_id: str
    quantity: int
    unit_price: float

class OrderCreateRequest(BaseModel):
    user_id: str
    items: List[OrderItemRequest]
    order_type: OrderTypeEnum
    total_amount: float
    address: Optional[str] = None
    table_number: Optional[str] = None
    promo_code: Optional[str] = None

class OrderResponse(BaseModel):
    id: str
    user_id: str
    items: List[Dict[str, Any]]
    order_type: OrderTypeEnum
    total_amount: float
    status: OrderStatusEnum
    address: Optional[str]
    table_number: Optional[str]
    created_at: str

class PromoValidateRequest(BaseModel):
    code: str
    cart_total: float

class PromoValidateResponse(BaseModel):
    valid: bool
    discount_percent: int
    discount_amount: float
    message: Optional[str]

class ReviewCreateRequest(BaseModel):
    user_id: str
    menu_item_id: str
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str]

class ReviewResponse(BaseModel):
    id: str
    user_id: str
    menu_item_id: str
    rating: int
    comment: Optional[str]
    created_at: str
