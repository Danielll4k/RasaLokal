-- PostgreSQL 15+ Migration: Initial Schema
-- RasaLokal Platform Core Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Role & Status Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'merchant', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE review_voucher_status AS ENUM ('issued', 'redeemed', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE discount_voucher_status AS ENUM ('active', 'used', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role DEFAULT 'customer',
    phone_number VARCHAR(25),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Restaurants
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    category VARCHAR(50),
    price_range VARCHAR(5),
    open_hour TIME,
    close_hour TIME,
    tags TEXT[],
    is_verified BOOLEAN DEFAULT FALSE,
    banner_url TEXT,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Transactions (Cashier Receipt)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    cashier_id UUID NOT NULL REFERENCES users(id),
    receipt_number VARCHAR(100) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    transaction_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_receipt_per_resto UNIQUE (restaurant_id, receipt_number)
);

-- 4. Review Vouchers (Single-Use Token)
CREATE TABLE IF NOT EXISTS review_vouchers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    voucher_code VARCHAR(30) UNIQUE NOT NULL,
    qr_payload TEXT NOT NULL,
    status review_voucher_status DEFAULT 'issued',
    redeemed_by UUID REFERENCES users(id),
    redeemed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Reviews (Verified Buyer Only)
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    voucher_id UUID UNIQUE NOT NULL REFERENCES review_vouchers(id) ON DELETE RESTRICT,
    rating SMALLINT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    review_text TEXT,
    photos_url TEXT[],
    is_verified_buyer BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Discount Vouchers (5% Reward min. 100k spend)
CREATE TABLE IF NOT EXISTS discount_vouchers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID UNIQUE NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    discount_code VARCHAR(30) UNIQUE NOT NULL,
    discount_percentage INT DEFAULT 5,
    minimum_spend DECIMAL(12, 2) DEFAULT 100000.00,
    status discount_voucher_status DEFAULT 'active',
    used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_restaurants_city ON restaurants(city);
CREATE INDEX IF NOT EXISTS idx_restaurants_category ON restaurants(category);
CREATE INDEX IF NOT EXISTS idx_review_vouchers_code ON review_vouchers(voucher_code);
CREATE INDEX IF NOT EXISTS idx_discount_vouchers_user ON discount_vouchers(user_id, status);
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant ON reviews(restaurant_id);

-- Auto-Rating Trigger Function
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE restaurants
    SET 
        average_rating = (
            SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0.00) 
            FROM reviews 
            WHERE restaurant_id = NEW.restaurant_id
        ),
        total_reviews = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE restaurant_id = NEW.restaurant_id
        ),
        updated_at = NOW()
    WHERE id = NEW.restaurant_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_after_review_change ON reviews;
CREATE TRIGGER trg_after_review_change
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_restaurant_rating();
