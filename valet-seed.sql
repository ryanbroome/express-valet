
--inserting sample locations
INSERT INTO locations
    (siteName)
    -- , address, phone)
VALUES 
    ('Hospital Main'),
    -- , '123 Main St', '555-123-4567'),
    ('Hospital ED'),
    -- , '456 Elm St', '555-987-6543'),
    ('Hospital POB');
    -- , '789 Oak St', '555-555-5555');


-- test users have the password 'password'
-- inserting sample users
INSERT INTO users (username, password, first_name, last_name, email, phone, total_parked, is_admin, location_id)
VALUES
    ('U1', '$2b$12$7iQHSGIDTdRjGDB6DUW0xeu3gdfmq2XVXhbXZIj.l2O6jjBQGncB.', 'U1F', 'U1L', 'U1@gmail.com', '555-123-4567', 0, FALSE, 1),
    ('U2', '$2b$12$Z/tUNaI83MDHoWNxn6eNbeoLFDIP7gNgFaMiOiyB.YMBTeIhePUU.', 'U2F', 'U2L', 'U2@gmail.com', '555-123-4567', 0, FALSE, 2),
    ('U3', '$2b$12$skL41va0elF5iKUYMzUikOPQV0MRdrZYKidycSObGhAX9VrlSbIhW', 'U3F', 'U3L', 'U3@gmail.com', '555-123-4567', 0, FALSE, 3),
    ('U4A', '$2b$12$e4C5KtET7rJRLqk7aM/MPOdIsx/sR3tYUCMDfFkvwnYIFqe74DWDe', 'U4F', 'UFL', 'admin@gmail.com', '555-123-4567', 0, TRUE, 1);

-- Inserting sample vehicles
INSERT INTO vehicles 
    (ticket_num, vehicle_status, mobile, color, make, damages, notes)
VALUES
    (101, 'parked', '1234567899', 'Red', 'Toyota', 'Scratch on rear bumper', 'stick shift'),
    (102, 'parked', '9876543211', 'Blue', 'Honda', 'None', 'do not roll down window'),
    (103, 'parked', '5555555555', 'Black', 'Ford', 'Dented door', 'no notes'),
    (104, 'parked', '5551234567', 'Black', 'Ford', 'Dented door', 'no notes'),
    (105, 'parked', '1234567899', 'Red', 'Toyota', 'Scratch on rear bumper', 'stick shift'),
    (106, 'parked', '9876543211', 'Blue', 'Honda', 'None', 'do not roll down window'),
    (107, 'parked', '5555555555', 'Black', 'Ford', 'Dented door', 'no notes'),
    (108, 'parked', '5551234567', 'Black', 'Ford', 'Dented door', 'no notes'),
    (109, 'parked', '1234567899', 'Red', 'Toyota', 'Scratch on rear bumper', 'stick shift'),
    (110, 'parked', '9876543211', 'Blue', 'Honda', 'None', 'do not roll down window'),
    (111, 'parked', '5555555555', 'Black', 'Ford', 'Dented door', 'no notes'),
    (112, 'parked', '5551234567', 'Black', 'Ford', 'Dented door', 'no notes');
    (113, 'parked', '5551234567', 'Black', 'Ford', 'Dented door', 'no notes');
    (114, 'parked', '5551234567', 'Black', 'Ford', 'Dented door', 'no notes');
    (115, 'parked', '5551234567', 'Black', 'Ford', 'Dented door', 'no notes');
    (116, 'parked', '5551234567', 'Black', 'Ford', 'Dented door', 'no notes');
    (117, 'parked', '5551234567', 'Black', 'Ford', 'Dented door', 'no notes');
    (118, 'parked', '5551234567', 'Black', 'Ford', 'Dented door', 'no notes');
    (119, 'parked', '5551234567', 'Black', 'Ford', 'Dented door', 'no notes');
    (120, 'parked', '5551234567', 'Black', 'Ford', 'Dented door', 'no notes');

--Inserting sample transactions
INSERT INTO transactions
    (user_id, vehicle_id, location_id)
VALUES
    (1, 1, 1),
    (2, 2, 2),
    (3, 3, 3),
    (1, 4, 1),
    (2, 5, 2),
    (3, 6, 3),
    (1, 7, 1),
    (2, 8, 2),
    (3, 9, 3),
    (1, 10, 1),
    (2, 11, 2),
    (3, 12, 3);

    -- ? TO ADD? when seeding database use this as damages for vehicles VALUES second to last item in array **[{"x":99.97265625,"y":265.44140625},{"x":321.97265625,"y":257.44140625},{"x":327.97265625,"y":240.44140625}]**
