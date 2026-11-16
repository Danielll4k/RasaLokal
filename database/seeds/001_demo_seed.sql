-- Seed Data for Testing & Demo

-- Users
-- Password hash corresponds to 'password123'
INSERT INTO users (id, email, password_hash, full_name, role, phone_number)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'alya@rasalokal.id', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1p6sP8e9r2pXjJ1.5C.Z2iBq1F.x2q', 'Alya Rahman', 'customer', '081234567890'),
    ('22222222-2222-2222-2222-222222222222', 'kasir.sore@rasalokal.id', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1p6sP8e9r2pXjJ1.5C.Z2iBq1F.x2q', 'Kasir Sore Dining', 'merchant', '081298765432'),
    ('33333333-3333-3333-3333-333333333333', 'admin@rasalokal.id', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1p6sP8e9r2pXjJ1.5C.Z2iBq1F.x2q', 'Admin Platform', 'admin', '081122334455')
ON CONFLICT (id) DO NOTHING;

-- Restaurants
INSERT INTO restaurants (id, owner_id, name, address, city, latitude, longitude, category, price_range, open_hour, close_hour, tags, is_verified, average_rating, total_reviews, banner_url)
VALUES 
    (
        'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
        '22222222-2222-2222-2222-222222222222', 
        'Sore Dining', 
        'Jl. Tirtodipuran No. 18, Mantrijeron, Yogyakarta', 
        'Yogyakarta', 
        -6.2738290, 
        106.8164390, 
        'Indonesian Modern', 
        '$$', 
        '10:00:00', 
        '22:00:00', 
        ARRAY['Cozy', 'Halal', 'Family-friendly'], 
        TRUE, 
        4.90, 
        246,
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'
    ),
    (
        'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
        '22222222-2222-2222-2222-222222222222', 
        'Nusa Kitchen', 
        'Jl. Kaliurang KM 14, Sleman, Yogyakarta', 
        'Yogyakarta', 
        -6.2798290, 
        106.8214390, 
        'Asian Grill', 
        '$$$', 
        '11:00:00', 
        '23:00:00', 
        ARRAY['Authentic', 'Spacious', 'Outdoor'], 
        TRUE, 
        4.80, 
        189,
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200'
    ),
    (
        'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
        '22222222-2222-2222-2222-222222222222', 
        'Kopi Kalyan', 
        'Jl. Sajiono No. 13, Kotabaru, Yogyakarta', 
        'Yogyakarta', 
        -6.2448290, 
        106.7934390, 
        'Cafe & Pastries', 
        '$$', 
        '07:00:00', 
        '21:00:00', 
        ARRAY['Work-friendly', 'Coffee', 'Chill'], 
        TRUE, 
        4.70, 
        328,
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200'
    )
ON CONFLICT (id) DO NOTHING;

-- Seed Transaction
INSERT INTO transactions (id, restaurant_id, cashier_id, receipt_number, total_amount, transaction_time)
VALUES 
    (
        'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        '22222222-2222-2222-2222-222222222222',
        'INV-SORE-20261109-001',
        175000.00,
        NOW() - INTERVAL '2 hours'
    )
ON CONFLICT (id) DO NOTHING;

-- Seed Review Voucher (Standard proposal demo token)
INSERT INTO review_vouchers (id, transaction_id, restaurant_id, voucher_code, qr_payload, status, expires_at)
VALUES 
    (
        'ccccccc1-cccc-cccc-cccc-cccccccccccc',
        'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'SORE-8X29K',
        'https://rasalokal.id/verify?code=SORE-8X29K',
        'issued',
        NOW() + INTERVAL '30 days'
    )
ON CONFLICT (id) DO NOTHING;
