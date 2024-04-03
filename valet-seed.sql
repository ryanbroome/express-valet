
-- test users have the password 'password'
-- inserting sample users
INSERT INTO users 
    (username, password, first_name, last_name, email, phone, total_parked, is_admin)
VALUES 
    ('user1', '$2b$12$e4C5KtET7rJRLqk7aM/MPOdIsx/sR3tYUCMDfFkvwnYIFqe74DWDe', 'first', 'last', 'test1@gmail.com', '555-123-4567', 0, FALSE),
    ('user2', '$2b$12$e4C5KtET7rJRLqk7aM/MPOdIsx/sR3tYUCMDfFkvwnYIFqe74DWDe', 'first', 'last', 'test2@gmail.com', '555-123-4567', 0, FALSE),
    ('admin', '$2b$12$e4C5KtET7rJRLqk7aM/MPOdIsx/sR3tYUCMDfFkvwnYIFqe74DWDe', 'first', 'last', 'admin@gmail.com', '555-123-4567', 0, TRUE);



-- Inserting sample vehicles
INSERT INTO vehicles 
    (ticket_num, vehicle_status, mobile, color, make, damages, notes)
VALUES
    (1001, 'Parked', '123456789', 'Red', 'Toyota', 'Scratch on rear bumper', 'stick shift'),
    (1002, 'Parked', '987654321', 'Blue', 'Honda', 'None', 'do not roll down window'),
    (1003, 'Parked', '555555555', 'Black', 'Ford', 'Dented door', '');


--Inserting sample transactions
INSERT INTO transactions
    (user_id, vehicle_id)
VALUES
    (4, 1),
    (4, 2),
    (1, 3),
    (1, 4);