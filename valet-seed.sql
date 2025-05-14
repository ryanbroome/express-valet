-- 1. Seed roles
INSERT INTO roles (role) VALUES
    ('valet'),
    ('supervisor'),
    ('manager'),
    ('director'),
    ('admin');

-- 2. Seed status
INSERT INTO status (status) VALUES
    ('checked_in'),
    ('staged'),
    ('parked'),
    ('requested'),
    ('retrieved'),
    ('checked_out');

-- 3. Seed regions
INSERT INTO regions (name) VALUES
    ('North'),
    ('South');

-- 4. Seed locations (each assigned to a region)
INSERT INTO locations (name, region_id, address, city, state, zip_code, phone) VALUES
    ('Hospital', 1, '123 Main St', 'Safety Harbor', 'FL', '34695', '555-333-1234'),
    ('Dealership', 2, '456 South St', 'Miami', 'FL', '90002', '555-333-4321');

-- 5. Seed podiums (3 per location)
INSERT INTO podiums (name, location_id) VALUES
    ('Main Entrance', 1),
    ('Medical Arts Building', 1),
    ('Emergency Department', 1),
    ('Service', 2),
    ('Sales', 2),
    ('Parts', 2);

-- 6. Seed users
INSERT INTO users (username, password, first_name, last_name, email, phone, total_parked, role_id, podium_id) VALUES
    ('manager', '$2b$12$BLPVziFEloBat.LYw9ujaOCriQYzPMOlXqRPNYHNp6DGIpBVuVLbW', 'Manager', 'One', 'manager@valet.com', '555-333-3333', 0, 3, 1),
    ('valet1', '$2b$12$grXCgBTCKtSpWtyH07eXAegiYdQGNV0iaydfvgAAucIJxWcj8BvXS', 'Valet', 'One', 'valet1@valet.com', '555-444-4444', 0, 1, 1),
    ('valet2', '$2b$12$12GdaOM6G6lcVVXgys1xB.eSyAJt.klydp4suGPuIhofOVLQDR/4W', 'Valet', 'Two', 'valet2@valet.com', '555-555-5555', 0, 1, 2),
    ('valet3', '$2b$12$4cj1PfvVVBU80DLHLMP5ieg6O7lfpQ4SAVWnj.7kzqNC3mmU3z.ry', 'Valet', 'Three', 'valet3@valet.com', '555-666-6666', 0, 1, 3),
    ('valet4', '$2b$12$eWUzNmK34Jo7BHkHcx/Ub.YSXrT77wSEuE1iKDw6QLa5S1I.WKGGC', 'Valet', 'Four', 'valet4@valet.com', '555-777-7777', 0, 1, 4),
    ('valet5', '$2b$12$b0eRZNsRvtlvlzk.Mscx7uCCcMBkz5b16gT3EHWLeX.wCA70yaoKa', 'Valet', 'Five', 'valet5@valet.com', '555-888-8888', 0, 1, 5),
    ('valet6', '$2b$12$jwTwVnGA7iMrfvvlPGYT1OsZka1aw8Va03G9X1DfRzJEWFZd4C6LK', 'Valet', 'Six', 'valet6@valet.com', '555-999-9999', 0, 1, 6),
    ('valet7', '$2b$12$eZ1mCqJRbweE5gamt2yWeepsGKWniHHFvynlLD.c7rf3glsi2tP7G', 'Valet', 'Seven', 'valet7@valet.com', '555-000-0000', 0, 1, 1),
    ('valet8', '$2b$12$gd9Tvt9ssdcNexxlXsopCeq5PTeLBur.Twe5483ozAF4cw4ikojk2', 'Valet', 'Eight', 'valet8@valet.com', '555-101-0101', 0, 1, 2),
    ('valet9', '$2b$12$R8y8A1Q11iycyIY5O/UTnePSbAScGDG4iyY3.Iysf3OoFnXC6T8ZK', 'Valet', 'Nine', 'valet9@valet.com', '555-202-0202', 0, 1, 3),
    ('valet10', '$2b$12$UPoUIk/vnlO.5xgVDqiF7uGGlrPWcutf3GVfnytFQ8i/9O.nx.2fG', 'Valet', 'Ten', 'valet10@valet.com', '555-202-0202', 0, 1, 4),
    ('valet11', '$2b$12$Hd0z5raDhEbrPTkVJAwzre5THFFOZ3GCs3IxebEE6WkJzxpaO3uES', 'Valet', 'Eleven', 'valet11@valet.com', '555-202-0202', 0, 1, 5),
    ('valet12', '$2b$12$sFnLgjbY/MvF4mhPYu0zie/GSglD3f0JXNwktHidZITDA6UnTyF/.', 'Valet', 'Twelve', 'valet12@valet.com', '555-202-0202', 0, 1, 6);

-- 7. Seed vehicles (example)
INSERT INTO vehicles (ticket_num, status_id, mobile, color, make, damages, notes)
VALUES
    (1001, 1, '555-303-0303', 'Red', 'Volkswagen', '[{"x":222.71875,"y":143}]', 'stick shift');

-- 8. Seed transactions (example)
INSERT INTO transactions (user_id, vehicle_id, podium_id, location_id, status_id, transaction_time, updated_at)
VALUES
    (1, 1, 1, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);