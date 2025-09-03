-- SQL script to create a test user for Evoka application
-- Run this in your MySQL database

-- Check if test user already exists and delete if it does
DELETE FROM users WHERE username = 'testuser';

-- Insert test user
INSERT INTO users (username, email, password, name, accountType, created_at, updated_at) 
VALUES (
    'testuser',
    'test@example.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: testpass
    'Test User',
    'private',
    NOW(),
    NOW()
);

-- Verify the user was created
SELECT id, username, email, name, accountType, created_at 
FROM users 
WHERE username = 'testuser';

