-- Schema for valet application
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    siteName TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL CHECK (position('@' IN email) > 1),
    phone TEXT NOT NULL,
    total_parked INTEGER NOT NULL DEFAULT 0,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    location_id INTEGER NOT NULL,
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- vehicle_status may need to be fixed, to make a default value of parked with every initial entry
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    ticket_num INTEGER,
    vehicle_status TEXT DEFAULT 'parked',
    check_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mobile TEXT NOT NULL,
    color TEXT,
    make TEXT,
    damages TEXT NOT NULL,
    check_out TIMESTAMP,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INTEGER,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    location_id INTEGER,
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
