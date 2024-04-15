
--inserting sample locations
INSERT INTO locations
    (siteName)
VALUES 
    ('MCH-MAB'),
    ('MCH-MAIN'),
    ('MCH-ED');

-- test users have the password 'password'
-- inserting sample users
INSERT INTO users 
    (username, password, first_name, last_name, email, phone, total_parked, is_admin, location_id)
VALUES 
    -- ('U1', '$2b$12$e4C5KtET7rJRLqk7aM/MPOdIsx/sR3tYUCMDfFkvwnYIFqe74DWDe', 'U1F', 'U1L', 'U1@gmail.com', '555-123-4567', 0, FALSE, 1),
    ('U1', '$2b$12$7iQHSGIDTdRjGDB6DUW0xeu3gdfmq2XVXhbXZIj.l2O6jjBQGncB.', 'U1F', 'U1L', 'U1@gmail.com', '555-123-4567', 0, FALSE, 1),
    -- ('U2', '$2b$12$e4C5KtET7rJRLqk7aM/MPOdIsx/sR3tYUCMDfFkvwnYIFqe74DWDe', 'U2F', 'U2L', 'U2@gmail.com', '555-123-4567', 0, FALSE, 1),
    ('U2', '$2b$12$Z/tUNaI83MDHoWNxn6eNbeoLFDIP7gNgFaMiOiyB.YMBTeIhePUU.', 'U2F', 'U2L', 'U2@gmail.com', '555-123-4567', 0, FALSE, 2),
    ('U3', '$2b$12$skL41va0elF5iKUYMzUikOPQV0MRdrZYKidycSObGhAX9VrlSbIhW', 'U3F', 'U3L', 'U3@gmail.com', '555-123-4567', 0, FALSE, 3),
    ('U4A', '$2b$12$e4C5KtET7rJRLqk7aM/MPOdIsx/sR3tYUCMDfFkvwnYIFqe74DWDe', 'U4F', 'UFL', 'admin@gmail.com', '555-123-4567', 0, TRUE, 1);

-- Inserting sample vehicles
INSERT INTO vehicles 
    (ticket_num, vehicle_status, mobile, color, make, damages, notes)
VALUES
    (1001, 'parked', '123456789', 'Red', 'Toyota', 'Scratch on rear bumper', 'stick shift'),
    (2002, 'parked', '987654321', 'Blue', 'Honda', 'None', 'do not roll down window'),
    (3003, 'parked', '555555555', 'Black', 'Ford', 'Dented door', 'no notes'),
    (1004, 'parked', '5551234567', 'Black', 'Ford', 'Dented door', 'no notes'),
    (2005, 'parked', '123456789', 'Red', 'Toyota', 'Scratch on rear bumper', 'stick shift'),
    (3006, 'parked', '987654321', 'Blue', 'Honda', 'None', 'do not roll down window'),
    (1007, 'parked', '555555555', 'Black', 'Ford', 'Dented door', 'no notes'),
    (2008, 'parked', '5551234567', 'Black', 'Ford', 'Dented door', 'no notes'),
    (3009, 'parked', '123456789', 'Red', 'Toyota', 'Scratch on rear bumper', 'stick shift'),
    (1010, 'parked', '987654321', 'Blue', 'Honda', 'None', 'do not roll down window'),
    (2011, 'parked', '555555555', 'Black', 'Ford', 'Dented door', 'no notes'),
    (3012, 'parked', '5551234567', 'Black', 'Ford', 'Dented door', 'no notes');

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


