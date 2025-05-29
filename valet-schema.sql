-- DROP TABLE IF EXISTS users CASCADE;

-- Schema for valet application
-- This script creates the necessary tables for the valet application
-- including users, vehicles, transactions, locations, regions, and podiums.

-- 1. Create independent tables first
CREATE TABLE IF NOT EXISTS regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role TEXT NOT NULL UNIQUE,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS status (
    id SERIAL PRIMARY KEY,
    status TEXT NOT NULL UNIQUE
);

-- 2. Tables that depend on regions
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    region_id INTEGER NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    phone TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE
);

-- 3. Tables that depend on locations
CREATE TABLE IF NOT EXISTS podiums (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location_id INTEGER NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- 4. Tables that depend on roles and podiums
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL CHECK (position('@' IN email) > 1),
    phone TEXT NOT NULL,
    total_parked INTEGER NOT NULL DEFAULT 0,
    role_id INTEGER NOT NULL,
    podium_id INTEGER,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    FOREIGN KEY (podium_id) REFERENCES podiums(id) ON DELETE CASCADE
);

-- 5. Tables that depend on status
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    ticket_num INTEGER,
    status_id INTEGER NOT NULL,
    mobile TEXT NOT NULL,
    color TEXT,
    make TEXT,
    damages TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY (status_id) REFERENCES status(id)
);

-- 6. Tables that depend on users, vehicles, podiums, locations
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    vehicle_id INTEGER,
    podium_id INTEGER,
    location_id INTEGER,
    status_id INTEGER NOT NULL,
    transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (podium_id) REFERENCES podiums(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES status(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS surveys (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    q1_response INTEGER NOT NULL,
    q2_response INTEGER NOT NULL,
    q3_response INTEGER NOT NULL,
    q4_response INTEGER NOT NULL,
    q5_response INTEGER NOT NULL,
    q6_response TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to auto-update the Transactions.updated_at column
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before every UPDATE on transactions
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();