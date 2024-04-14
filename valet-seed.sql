
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
    ('U1', '$2b$12$e4C5KtET7rJRLqk7aM/MPOdIsx/sR3tYUCMDfFkvwnYIFqe74DWDe', 'U1F', 'U1L', 'U1@gmail.com', '555-123-4567', 0, FALSE, 1),
    ('U2', '$2b$12$e4C5KtET7rJRLqk7aM/MPOdIsx/sR3tYUCMDfFkvwnYIFqe74DWDe', 'U2F', 'U2L', 'U2@gmail.com', '555-123-4567', 0, FALSE, 1),
    ('U3', '$2b$12$e4C5KtET7rJRLqk7aM/MPOdIsx/sR3tYUCMDfFkvwnYIFqe74DWDe', 'U3F', 'U3L', 'U3@gmail.com', '555-123-4567', 0, FALSE, 1),
    ('U4A', '$2b$12$e4C5KtET7rJRLqk7aM/MPOdIsx/sR3tYUCMDfFkvwnYIFqe74DWDe', 'U4F', 'UFL', 'admin@gmail.com', '555-123-4567', 0, TRUE, 1);

-- Inserting sample vehicles
INSERT INTO vehicles 
    (ticket_num, vehicle_status, mobile, color, make, damages, notes)
VALUES
    (1001, 'parked', '123456789', 'Red', 'Toyota', 'Scratch on rear bumper', 'stick shift'),
    (1002, 'parked', '987654321', 'Blue', 'Honda', 'None', 'do not roll down window'),
    (1003, 'parked', '555555555', 'Black', 'Ford', 'Dented door', ''),
    (1004, 'parked', '5551234567', 'Black', 'Ford', 'Dented door', '');

--Inserting sample transactions
INSERT INTO transactions
    (user_id, vehicle_id, location_id)
VALUES
    (4, 1, 1),
    (4, 2, 1),
    (1, 3, 1),
    (1, 4, 1);

