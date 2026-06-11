from fastapi import APIRouter
from models import PromoValidateRequest, PromoValidateResponse
from mock_data import supabase

router = APIRouter()

@router.post("/validate", response_model=PromoValidateResponse)
def validate_promo(request: PromoValidateRequest):
    promos = supabase.table("promo_codes").select().execute().data
    promo = next((p for p in promos if p["code"].upper() == request.code.upper()), None)
    
    if not promo:
        return PromoValidateResponse(valid=False, discount_percent=0, discount_amount=0.0, message="Invalid promo code.")
    
    if not promo["is_active"]:
        return PromoValidateResponse(valid=False, discount_percent=0, discount_amount=0.0, message="Promo code is inactive.")
        
    if promo["usage_limit"] is not None and promo["used_count"] >= promo["usage_limit"]:
        return PromoValidateResponse(valid=False, discount_percent=0, discount_amount=0.0, message="Promo code usage limit reached.")
        
    discount_amount = request.cart_total * (promo["discount_percent"] / 100.0)
    
    return PromoValidateResponse(
        valid=True, 
        discount_percent=promo["discount_percent"], 
        discount_amount=discount_amount, 
        message="Promo applied successfully!"
    )
