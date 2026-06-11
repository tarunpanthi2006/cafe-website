from fastapi import APIRouter, Query
from typing import List, Optional
from models import MenuItemResponse
from mock_data import supabase

router = APIRouter()

@router.get("/", response_model=List[MenuItemResponse])
def get_menu(
    category: Optional[str] = None,
    veg: Optional[bool] = None,
    search: Optional[str] = None
):
    items = supabase.table("menu_items").select().execute().data
    
    # Calculate average rating
    reviews = supabase.table("reviews").select().execute().data
    
    results = []
    for item in items:
        # Filter logic
        if category and category.lower() != "all" and item["category"].lower() != category.lower():
            continue
        if veg is True and not item["is_veg"]:
            continue
        if search and search.lower() not in item["name"].lower() and search.lower() not in item["description"].lower():
            continue
            
        item_reviews = [r["rating"] for r in reviews if r["menu_item_id"] == item["id"]]
        avg_rating = sum(item_reviews) / len(item_reviews) if item_reviews else 0.0
        
        item_data = dict(item)
        item_data["avg_rating"] = round(avg_rating, 1)
        results.append(item_data)
        
    return results

@router.get("/popular", response_model=List[MenuItemResponse])
def get_popular_menu():
    # Mock logic: return first 6 items for now or sorted by hypothetical order count
    # Since we don't have historical orders pre-seeded, we just return the first 6 items
    items = supabase.table("menu_items").select().execute().data
    reviews = supabase.table("reviews").select().execute().data
    
    results = []
    for item in items[:6]:
        item_reviews = [r["rating"] for r in reviews if r["menu_item_id"] == item["id"]]
        avg_rating = sum(item_reviews) / len(item_reviews) if item_reviews else 0.0
        item_data = dict(item)
        item_data["avg_rating"] = round(avg_rating, 1)
        results.append(item_data)
        
    return results
