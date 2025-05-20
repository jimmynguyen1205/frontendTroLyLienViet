-- Add updated_at column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Add is_active column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update timestamp
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION check_user_login(
    p_email TEXT,
    p_password TEXT
)
RETURNS TABLE (
    user_id UUID,
    user_email TEXT,
    user_status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id,
        u.email,
        CASE
            WHEN u.is_active = false THEN 'rejected'
            ELSE 'approved'
        END as user_status
    FROM users u
    WHERE u.email = p_email
      AND crypt(p_password, u.password_hash) = u.password_hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DELETE FROM users WHERE email = 'test@gmail.com';

INSERT INTO users (id, email, password_hash, full_name, role_id, is_active)
VALUES (
  uuid_generate_v4(),
  'test@gmail.com',
  crypt('yourpassword', gen_salt('bf')),
  'Test User',
  1,
  true
);

SELECT column_name FROM information_schema.columns WHERE table_name = 'users'; 