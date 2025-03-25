-- Purpose: This script is used to setup the valet database and test database.
-- It will drop and recreate the valet and valet_test databases, and then execute the schema and seed files.

\set ON_ERROR_STOP on
\echo `Starting database setup...`

-- Drop and recreate valet db
DROP DATABASE IF EXISTS valet WITH (FORCE);
CREATE DATABASE valet;
\c valet


-- Execute schema and seed files
\echo `Executing valet-schema...`
\i valet-schema.sql

\echo `Executing valet-seed...`
\i valet-seed.sql


\echo `Starting test database setup...`
-- Drop and recreate valet_test db
DROP DATABASE IF EXISTS valet_test WITH(FORCE);
CREATE DATABASE valet_test;
\c valet_test

-- Execute schema file for test database
\echo `Executing valet-test-schema...`
\i valet-schema.sql
\echo `Executing valet-test-seed...`
\i valet-seed.sql

\echo `Setup complete!`