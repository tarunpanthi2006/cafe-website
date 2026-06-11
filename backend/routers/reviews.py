from fastapi import APIRouter
from typing import List
import uuid
from models import ReviewCreateRequest, ReviewResponse
from mock_data import supabase, now_ktm

router = APIRouter()

@router.post("/", response_model=ReviewResponse)
def create_review(request: ReviewCreateRequest):
    review_id = str(uuid.uuid4())
    review_data = {
        "id": review_id,
        "user_id": request.user_id,
        "menu_item_id": request.menu_item_id,
        "rating": request.rating,
        "comment": request.comment,
        "created_at": now_ktm()
    }
    supabase.table("reviews").insert(review_data).execute()
    return review_data

@router.get("/{menu_item_id}", response_model=List[ReviewResponse])
def get_reviews(menu_item_id: str):
    reviews = supabase.table("reviews").select().execute().data
    item_reviews = [r for r in reviews if r["menu_item_id"] == menu_item_id]
    item_reviews.sort(key=lambda x: x["created_at"], reverse=True)
    return item_reviews
