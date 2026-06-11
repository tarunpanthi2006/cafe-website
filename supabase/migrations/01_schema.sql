-- LuxeCafe Supabase Schema Migration
-- Note: This is currently for reference, as we are using mock data for development.

CREATE TYPE order_type_enum AS ENUM ('dine_in', 'takeaway', 'delivery');
CREATE TYPE order_status_enum AS ENUM ('placed', 'preparing', 'out_for_delivery', 'delivered', 'ready', 'served');

-- Menu Items
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url TEXT,
    is_veg BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('Asia/Kathmandu'::text, now()) NOT NULL
);

-- Promo Codes
CREATE TABLE promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INT NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    usage_limit INT,
    used_count INT DEFAULT 0
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- references auth.users(id)
    items JSONB NOT NULL,
    order_type order_type_enum NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status order_status_enum NOT NULL DEFAULT 'placed',
    address TEXT,
    table_number VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('Asia/Kathmandu'::text, now()) NOT NULL
);

-- Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL
);

-- Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- references auth.users(id)
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('Asia/Kathmandu'::text, now()) NOT NULL
);

-- Row Level Security (RLS) Policies
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Menu Items & Promo Codes are publicly readable
CREATE POLICY "Menu items are viewable by everyone." ON menu_items FOR SELECT USING (true);
CREATE POLICY "Promo codes are viewable by everyone." ON promo_codes FOR SELECT USING (true);

-- Orders: Users can read and insert their own orders
CREATE POLICY "Users can insert their own orders." ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own orders." ON orders FOR SELECT USING (auth.uid() = user_id);

-- Order Items: Viewable if you can view the order
CREATE POLICY "Users can insert their own order items." ON order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Users can view their own order items." ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);

-- Reviews: Publicly readable, users can only write their own
CREATE POLICY "Reviews are viewable by everyone." ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert their own reviews." ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews." ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews." ON reviews FOR DELETE USING (auth.uid() = user_id);
