-- 1. Seed roles
INSERT INTO roles (role, is_deleted) VALUES
    ('valet', FALSE),
    ('supervisor', FALSE),
    ('manager', FALSE),
    ('director', FALSE),
    ('admin', FALSE);

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
    ('Hospital', 1, '123 Main St', 'Safety Harbor', 'FL', '34695', '5553331234'),
    ('Dealership', 2, '456 South St', 'Miami', 'FL', '90002', '5553334321');

-- 5. Seed podiums (3 per location)
INSERT INTO podiums (name, location_id, is_deleted) VALUES
    ('Main Entrance', 1, FALSE),
    ('Medical Arts Building', 1, FALSE),
    ('Emergency Department', 1, FALSE),
    ('Service', 2, FALSE),
    ('Sales', 2, FALSE),
    ('Parts', 2, FALSE);

-- 6. Seed users
INSERT INTO users (username, password, first_name, last_name, email, phone, total_parked, role_id, podium_id) VALUES
    ('manager', '$2b$12$BLPVziFEloBat.LYw9ujaOCriQYzPMOlXqRPNYHNp6DGIpBVuVLbW', 'Manager', 'One', 'manager@valet.com', '5553333333', 0, 3, 1),
    ('valet1', '$2b$12$grXCgBTCKtSpWtyH07eXAegiYdQGNV0iaydfvgAAucIJxWcj8BvXS', 'Valet', 'One', 'valet1@valet.com', '5554444444', 0, 1, 1),
    ('valet2', '$2b$12$12GdaOM6G6lcVVXgys1xB.eSyAJt.klydp4suGPuIhofOVLQDR/4W', 'Valet', 'Two', 'valet2@valet.com', '5555555555', 0, 1, 2),
    ('valet3', '$2b$12$4cj1PfvVVBU80DLHLMP5ieg6O7lfpQ4SAVWnj.7kzqNC3mmU3z.ry', 'Valet', 'Three', 'valet3@valet.com', '5556666666', 0, 1, 3),
    ('valet4', '$2b$12$eWUzNmK34Jo7BHkHcx/Ub.YSXrT77wSEuE1iKDw6QLa5S1I.WKGGC', 'Valet', 'Four', 'valet4@valet.com', '5557777777', 0, 1, 4),
    ('valet5', '$2b$12$b0eRZNsRvtlvlzk.Mscx7uCCcMBkz5b16gT3EHWLeX.wCA70yaoKa', 'Valet', 'Five', 'valet5@valet.com', '5558888888', 0, 1, 5),
    ('valet6', '$2b$12$jwTwVnGA7iMrfvvlPGYT1OsZka1aw8Va03G9X1DfRzJEWFZd4C6LK', 'Valet', 'Six', 'valet6@valet.com', '5559999999', 0, 1, 6),
    ('valet7', '$2b$12$eZ1mCqJRbweE5gamt2yWeepsGKWniHHFvynlLD.c7rf3glsi2tP7G', 'Valet', 'Seven', 'valet7@valet.com', '5550000000', 0, 1, 1),
    ('valet8', '$2b$12$gd9Tvt9ssdcNexxlXsopCeq5PTeLBur.Twe5483ozAF4cw4ikojk2', 'Valet', 'Eight', 'valet8@valet.com', '5551010101', 0, 1, 2),
    ('valet9', '$2b$12$R8y8A1Q11iycyIY5O/UTnePSbAScGDG4iyY3.Iysf3OoFnXC6T8ZK', 'Valet', 'Nine', 'valet9@valet.com', '5552020202', 0, 1, 3),
    ('valet10', '$2b$12$UPoUIk/vnlO.5xgVDqiF7uGGlrPWcutf3GVfnytFQ8i/9O.nx.2fG', 'Valet', 'Ten', 'valet10@valet.com', '5552020202', 0, 1, 4),
    ('valet11', '$2b$12$Hd0z5raDhEbrPTkVJAwzre5THFFOZ3GCs3IxebEE6WkJzxpaO3uES', 'Valet', 'Eleven', 'valet11@valet.com', '5552020202', 0, 1, 5),
    ('valet12', '$2b$12$sFnLgjbY/MvF4mhPYu0zie/GSglD3f0JXNwktHidZITDA6UnTyF/.', 'Valet', 'Twelve', 'valet12@valet.com', '5552020202', 0, 1, 6),
    ('admin', '$2b$12$TNXkUFNNcieqdJBe9PBxfuoT095N8RXD981H211YE2haesqHqm3yS', 'Admin', 'User', 'admin@valet.com', '5551234567', 0, 5, 1);

-- 6. Seed user_regions
INSERT INTO user_regions (user_id, region_id) VALUES
    (1, 1),
    (2, 1),
    (3, 2),
    (4, 2),
    (5, 2),
    (6, 2),
    (7, 1),
    (8, 1),
    (9, 1),
    (10, 1),
    (11, 1),
    (12, 1),
    (13, 1),
    (14, 1),
    (14, 2);

-- 6. Seed user_locations
INSERT INTO user_locations (user_id, location_id) VALUES

-- 7. Seed vehicles (example)
INSERT INTO vehicles (ticket_num, status_id, mobile, color, make, damages, notes)
VALUES
    (1001, 1, '5553030303', 'Red', 'Volkswagen', '[{"x":222.71875,"y":143}]', 'stick shift'),
    (1002, 2, '5554040404', 'Blue', 'Toyota', '[{"x":222.71875,"y":143}]', 'automatic'),
    (1003, 3, '5555050505', 'Green', 'Honda', '[{"x":222.71875,"y":143}]', 'manual'),
    (1004, 4, '5556060606', 'Black', 'Ford', '[{"x":222.71875,"y":143}]', 'automatic'),
    (1005, 5, '5557070707', 'White', 'Chevrolet', '[{"x":222.71875,"y":143}]', 'stick shift'),
    (1006, 6, '5558080808', 'Red', 'Nissan', '[{"x":222.71875,"y":143}]', 'automatic'),
    (1007, 1, '5559090909', 'Purple', 'Kia', '[{"x":222.71875,"y":143}]', 'manual'),
    (1008, 2, '5550101010', 'Orange', 'Hyundai', '[{"x":222.71875,"y":143}]', 'automatic'),
    (1009, 3, '5551111212', 'Red', 'Subaru', '[{"x":222.71875,"y":143}]', 'stick shift'),
    (1010, 4, '5551311414', 'Gray', 'Mazda', '[{"x":222.71875,"y":143}]', 'automatic'),
    (1011, 5, '5551511616', 'Brown', 'Volkswagen', '[{"x":222.71875,"y":143}]', 'manual'),
    (1012, 6, '5551711818', 'Blue', 'Toyota', '[{"x":222.71875,"y":143}]', 'stick shift'),
    (1013, 1, '5551912020', 'Purple', 'Honda', '[{"x":222.71875,"y":143}]', 'automatic'),
    (1014, 2, '5552122222', 'Green', 'Ford', '[{"x":222.71875,"y":143}]', 'manual'),
    (1015, 3, '5552322424', 'Green', 'Chevrolet', '[{"x":222.71875,"y":143}]', 'stick shift'),
    (1016, 4, '5552522626', 'Blue', 'Nissan', '[{"x":222.71875,"y":143}]', 'automatic'),
    (1017, 5, '5552722828', 'Blue', 'Kia', '[{"x":222.71875,"y":143}]', 'manual'),
    (1018, 6, '5552923030', 'White', 'Hyundai', '[{"x":222.71875,"y":143}]', 'stick shift'),
    (1019, 1, '5553133232', 'Silver', 'Subaru', '[{"x":222.71875,"y":143}]', 'automatic'),
    (1020, 2, '5553333434', 'Black', 'Mazda', '[{"x":222.71875,"y":143}]', 'manual'),
    (1021, 3, '5553533636', 'Red', 'Volkswagen', '[{"x":222.71875,"y":143}]', 'stick shift'),
    (1022, 4, '5553733838', 'Blue', 'Toyota', '[{"x":222.71875,"y":143}]', 'automatic'),
    (1023, 5, '5553934040', 'Green', 'Honda', '[{"x":222.71875,"y":143}]', 'manual'),
    (1024, 6, '5554144242', 'Black', 'Ford', '[{"x":222.71875,"y":143}]', 'automatic'),
    (1025, 1, '5554344444', 'White', 'Chevrolet', '[{"x":222.71875,"y":143}]', 'stick shift'),
    (1026, 2, '5554544646', 'Red', 'Nissan', '[{"x":222.71875,"y":143}]', 'automatic');

-- 8. Seed transactions (example)
INSERT INTO transactions (user_id, vehicle_id, podium_id, location_id, status_id, transaction_time, updated_at)
VALUES
    (1, 1, 1, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 2, 2, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 3, 3, 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 4, 4, 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, 5, 5, 1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (6, 6, 1, 1, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (7, 7, 2, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (8, 8, 3, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (9, 9, 4, 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (10, 10, 5, 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (11, 11, 1, 1, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (12, 12, 2, 1, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (13, 13, 3, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (1, 14, 4, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 15, 5, 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

    -- 9. Seed surveys table
    INSERT INTO surveys (transaction_id, q1_response, q2_response, q3_response, q4_response, q5_response, q6_response, submitted_at)
    VALUES
        (1, 5, 4, 3, 2, 1, 'Great service!', CURRENT_TIMESTAMP),
        (2, 4, 3, 2, 1, 5, 'Will recommend!', CURRENT_TIMESTAMP),
        (3, 3, 2, 1, 5, 4, 'Satisfactory experience.', CURRENT_TIMESTAMP),
        (4, 2, 1, 5, 4, 3, 'Could be better.', CURRENT_TIMESTAMP),
        (5, 1, 5, 4, 3, 2, 'Not satisfied.', CURRENT_TIMESTAMP);

