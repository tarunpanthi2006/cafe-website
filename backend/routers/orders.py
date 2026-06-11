from fastapi import APIRouter, HTTPException
from typing import List
import uuid
import asyncio
from datetime import datetime
from models import OrderCreateRequest, OrderResponse, OrderStatusEnum
from mock_data import supabase, now_ktm

router = APIRouter()

# Auto-advance background task (simple mock)
async def auto_advance_order(order_id: str):
    stages = [
        OrderStatusEnum.preparing,
        OrderStatusEnum.out_for_delivery, # Or ready
        OrderStatusEnum.delivered         # Or served
    ]
    
    for stage in stages:
        await asyncio.sleep(30) # Wait 30 seconds per stage
        
        # Determine specific stage based on order type if needed
        orders = supabase.table("orders").select().execute().data
        order = next((o for o in orders if o["id"] == order_id), None)
        if not order:
            break
            
        current_stage = stage
        if order["order_type"] == "dine_in":
            if stage == OrderStatusEnum.out_for_delivery:
                current_stage = OrderStatusEnum.ready
            elif stage == OrderStatusEnum.delivered:
                current_stage = OrderStatusEnum.served
                
        supabase.table("orders").update({"status": current_stage}).eq("id", order_id).execute()

@router.post("/", response_model=dict)
async def create_order(request: OrderCreateRequest):
    order_id = str(uuid.uuid4())
    
    order_data = {
        "id": order_id,
        "user_id": request.user_id,
        "items": [item.model_dump() for item in request.items],
        "order_type": request.order_type,
        "total_amount": request.total_amount,
        "status": OrderStatusEnum.placed,
        "address": request.address,
        "table_number": request.table_number,
        "created_at": now_ktm()
    }
    
    supabase.table("orders").insert(order_data).execute()
    
    # Trigger auto-advance mock
    asyncio.create_task(auto_advance_order(order_id))
    
    return {"order_id": order_id}

@router.get("/{user_id}", response_model=List[OrderResponse])
def get_user_orders(user_id: str):
    orders = supabase.table("orders").select().execute().data
    user_orders = [o for o in orders if o["user_id"] == user_id]
    # Sort by created_at desc
    user_orders.sort(key=lambda x: x["created_at"], reverse=True)
    return user_orders

@router.get("/{order_id}/status", response_model=dict)
def get_order_status(order_id: str):
    orders = supabase.table("orders").select().execute().data
    order = next((o for o in orders if o["id"] == order_id), None)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"status": order["status"]}

@router.patch("/{order_id}/status", response_model=dict)
def update_order_status(order_id: str, status: OrderStatusEnum):
    res = supabase.table("orders").update({"status": status}).eq("id", order_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"status": "success", "new_status": status}
