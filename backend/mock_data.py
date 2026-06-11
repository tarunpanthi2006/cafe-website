import uuid
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

KTM_TZ = ZoneInfo("Asia/Kathmandu")

def now_ktm():
    return datetime.now(KTM_TZ).isoformat()

MOCK_DB = {
    "menu_items": [
        # Pizzas
        {"id": str(uuid.uuid4()), "name": "Margherita Pizza", "description": "Classic tomato and mozzarella", "price": 450.00, "category": "Pizza", "image_url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=60", "is_veg": True, "is_vegan": False, "is_gluten_free": False, "is_available": True},
        {"id": str(uuid.uuid4()), "name": "Chicken Tikka Pizza", "description": "Spicy chicken tikka with onions and capsicum", "price": 600.00, "category": "Pizza", "image_url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=60", "is_veg": False, "is_vegan": False, "is_gluten_free": False, "is_available": True},
        {"id": str(uuid.uuid4()), "name": "Vegan Supreme Pizza", "description": "Plant-based cheese with mixed vegetables", "price": 650.00, "category": "Pizza", "image_url": "https://images.unsplash.com/photo-1604381536136-23ebce329184?auto=format&fit=crop&w=500&q=60", "is_veg": True, "is_vegan": True, "is_gluten_free": False, "is_available": True},
        
        # Burgers
        {"id": str(uuid.uuid4()), "name": "Classic Veg Burger", "description": "Crispy veg patty with fresh lettuce and mayo", "price": 280.00, "category": "Burgers", "image_url": "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=500&q=60", "is_veg": True, "is_vegan": False, "is_gluten_free": False, "is_available": True},
        {"id": str(uuid.uuid4()), "name": "Double Cheese Chicken Burger", "description": "Double grilled chicken patty with extra cheese", "price": 420.00, "category": "Burgers", "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60", "is_veg": False, "is_vegan": False, "is_gluten_free": False, "is_available": True},
        {"id": str(uuid.uuid4()), "name": "Spicy Paneer Burger", "description": "Spicy paneer patty with mint chutney", "price": 320.00, "category": "Burgers", "image_url": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=60", "is_veg": True, "is_vegan": False, "is_gluten_free": False, "is_available": True},

        # Cakes
        {"id": str(uuid.uuid4()), "name": "Black Forest Pastry", "description": "Classic black forest with cherry topping", "price": 180.00, "category": "Cakes", "image_url": "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=500&q=60", "is_veg": True, "is_vegan": False, "is_gluten_free": False, "is_available": True},
        {"id": str(uuid.uuid4()), "name": "Red Velvet Slice", "description": "Cream cheese frosting on red velvet sponge", "price": 250.00, "category": "Cakes", "image_url": "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=500&q=60", "is_veg": True, "is_vegan": False, "is_gluten_free": False, "is_available": True},
        {"id": str(uuid.uuid4()), "name": "Gluten-Free Chocolate Cake", "description": "Rich dark chocolate cake with no gluten", "price": 320.00, "category": "Cakes", "image_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=60", "is_veg": True, "is_vegan": False, "is_gluten_free": True, "is_available": True},

        # Shakes
        {"id": str(uuid.uuid4()), "name": "Oreo Thickshake", "description": "Creamy shake blended with Oreo cookies", "price": 250.00, "category": "Shakes", "image_url": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=60", "is_veg": True, "is_vegan": False, "is_gluten_free": False, "is_available": True},
        {"id": str(uuid.uuid4()), "name": "Strawberry Milkshake", "description": "Fresh strawberries blended with milk and ice cream", "price": 220.00, "category": "Shakes", "image_url": "https://images.unsplash.com/photo-1579954115563-e72bf1b81615?auto=format&fit=crop&w=500&q=60", "is_veg": True, "is_vegan": False, "is_gluten_free": True, "is_available": True},
        {"id": str(uuid.uuid4()), "name": "Vegan Mango Smoothie", "description": "Fresh mangoes blended with almond milk", "price": 250.00, "category": "Shakes", "image_url": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=500&q=60", "is_veg": True, "is_vegan": True, "is_gluten_free": True, "is_available": True},
    ],
    "promo_codes": [
        {"id": str(uuid.uuid4()), "code": "LUXE20", "discount_percent": 20, "is_active": True, "expires_at": None, "usage_limit": None, "used_count": 0},
        {"id": str(uuid.uuid4()), "code": "FIRST50", "discount_percent": 50, "is_active": True, "expires_at": None, "usage_limit": 100, "used_count": 0},
    ],
    "orders": [],
    "order_items": [],
    "reviews": []
}

class MockSupabaseTable:
    def __init__(self, table_name):
        self.table_name = table_name

    def select(self, *args, **kwargs):
        class SelectQuery:
            def __init__(self, data):
                self.data = data
            def execute(self):
                return type("Response", (), {"data": self.data})
        return SelectQuery(MOCK_DB[self.table_name])

    def insert(self, data):
        class InsertQuery:
            def __init__(self, table, data):
                self.table = table
                self.data = data if isinstance(data, list) else [data]
            def execute(self):
                for row in self.data:
                    MOCK_DB[self.table].append(row)
                return type("Response", (), {"data": self.data})
        return InsertQuery(self.table_name, data)

    def update(self, data):
        class UpdateQuery:
            def __init__(self, table, data):
                self.table = table
                self.update_data = data
                self.filters = []
            def eq(self, column, value):
                self.filters.append((column, value))
                return self
            def execute(self):
                updated_rows = []
                for row in MOCK_DB[self.table]:
                    match = all(row.get(k) == v for k, v in self.filters)
                    if match:
                        row.update(self.update_data)
                        updated_rows.append(row)
                return type("Response", (), {"data": updated_rows})
        return UpdateQuery(self.table_name, data)

class MockSupabaseClient:
    def table(self, table_name):
        return MockSupabaseTable(table_name)

supabase = MockSupabaseClient()
