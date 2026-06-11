from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import menu, orders, promo, reviews

app = FastAPI(title="LuxeCafe API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(menu.router, prefix="/api/menu", tags=["Menu"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(promo.router, prefix="/api/promo", tags=["Promo"])
app.include_router(reviews.router, prefix="/api/reviews", tags=["Reviews"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
