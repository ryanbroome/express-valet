-- Drop and recreate valet db
DROP DATABASE IF EXISTS valet;
CREATE DATABASE valet;
\c valet

-- Execute schema and seed files
\i valet-schema.sql
\i valet-seed.sql

-- Drop and recreate valet_test db
DROP DATABASE IF EXISTS valet_test;
CREATE DATABASE valet_test;
\c valet_test

-- Execute schema file for test database
\i valet-schema.sql
\i valet-seed.sql