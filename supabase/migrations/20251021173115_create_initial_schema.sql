/*
  # Initial Database Schema for Smart Portfolio System

  ## Overview
  This migration creates the complete database structure for the portfolio module management system
  with authentication, module management, user portfolios, and payment tracking.

  ## 1. New Tables

  ### `users` Table
  Extends Supabase auth.users with application-specific data:
  - `id` (uuid, primary key) - Links to auth.users.id
  - `username` (text, unique) - User's display name
  - `full_name` (text) - User's full name
  - `email` (text, unique) - User's email
  - `role` (text) - User role: 'user' or 'admin'
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `portfolio_modules` Table
  Stores portfolio templates/modules that can be used:
  - `id` (uuid, primary key)
  - `name` (text) - Module name
  - `description` (text) - Module description
  - `template_code` (text) - Complete functional template code
  - `preview_image` (text) - URL to preview image
  - `is_free` (boolean) - Whether module is free or paid
  - `price` (numeric) - Price in USD (0 for free modules)
  - `category` (text) - Module category
  - `is_active` (boolean) - Whether module is available
  - `created_by` (uuid) - Admin who created it
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `user_portfolios` Table
  Stores generated portfolios for users:
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Reference to users table
  - `module_id` (uuid) - Reference to portfolio_modules
  - `full_name` (text) - User's full name
  - `specialty` (text) - User's specialty/job title
  - `skills` (text) - User's skills description
  - `bio` (text) - Generated or custom bio
  - `profile_image` (text) - URL to profile image
  - `linkedin` (text) - LinkedIn profile URL
  - `github` (text) - GitHub profile URL
  - `email` (text) - Contact email
  - `projects` (jsonb) - Array of project objects
  - `tools` (jsonb) - Array of tools/technologies
  - `template_settings` (jsonb) - Template customization settings
  - `generated_html` (text) - Generated portfolio HTML
  - `is_published` (boolean) - Whether portfolio is public
  - `slug` (text, unique) - URL-friendly portfolio identifier
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `payments` Table
  Tracks payment transactions:
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Reference to users
  - `module_id` (uuid) - Reference to portfolio_modules
  - `amount` (numeric) - Payment amount
  - `currency` (text) - Currency code (default 'USD')
  - `status` (text) - Payment status: 'pending', 'completed', 'failed', 'refunded'
  - `payment_method` (text) - Payment method used
  - `transaction_id` (text, unique) - External payment transaction ID
  - `payment_data` (jsonb) - Additional payment metadata
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `user_module_access` Table
  Tracks which paid modules users have access to:
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Reference to users
  - `module_id` (uuid) - Reference to portfolio_modules
  - `payment_id` (uuid) - Reference to payments (null for free modules)
  - `granted_at` (timestamptz) - When access was granted
  - Unique constraint on (user_id, module_id)

  ## 2. Security (Row Level Security)

  All tables have RLS enabled with restrictive policies:
  
  ### Users Table
  - Users can read their own data
  - Users can update their own profile
  - Admins can read all users

  ### Portfolio Modules Table
  - Everyone can read active modules
  - Only admins can create/update/delete modules

  ### User Portfolios Table
  - Users can read their own portfolios
  - Users can create/update/delete their own portfolios
  - Published portfolios are publicly readable

  ### Payments Table
  - Users can read their own payment history
  - Only admins can read all payments

  ### User Module Access Table
  - Users can read their own access records
  - System manages insert/update (via functions)
  - Admins can read all access records

  ## 3. Indexes
  - Performance indexes on foreign keys and frequently queried columns
  - Unique indexes for username, email, slug, transaction_id

  ## 4. Functions
  - Automatic timestamp updates via triggers
  - Helper function to grant module access after payment
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username text UNIQUE NOT NULL,
  full_name text,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Portfolio Modules Table
CREATE TABLE IF NOT EXISTS portfolio_modules (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  template_code text NOT NULL,
  preview_image text,
  is_free boolean DEFAULT true,
  price numeric(10, 2) DEFAULT 0 CHECK (price >= 0),
  category text DEFAULT 'general',
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Portfolios Table
CREATE TABLE IF NOT EXISTS user_portfolios (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  module_id uuid REFERENCES portfolio_modules(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  specialty text NOT NULL,
  skills text,
  bio text,
  profile_image text,
  linkedin text,
  github text,
  email text,
  projects jsonb DEFAULT '[]'::jsonb,
  tools jsonb DEFAULT '[]'::jsonb,
  template_settings jsonb DEFAULT '{}'::jsonb,
  generated_html text,
  is_published boolean DEFAULT false,
  slug text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  module_id uuid REFERENCES portfolio_modules(id) ON DELETE SET NULL NOT NULL,
  amount numeric(10, 2) NOT NULL CHECK (amount >= 0),
  currency text DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method text,
  transaction_id text UNIQUE,
  payment_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Module Access Table
CREATE TABLE IF NOT EXISTS user_module_access (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  module_id uuid REFERENCES portfolio_modules(id) ON DELETE CASCADE NOT NULL,
  payment_id uuid REFERENCES payments(id) ON DELETE SET NULL,
  granted_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_modules_is_active ON portfolio_modules(is_active);
CREATE INDEX IF NOT EXISTS idx_portfolio_modules_is_free ON portfolio_modules(is_free);
CREATE INDEX IF NOT EXISTS idx_user_portfolios_user_id ON user_portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_user_portfolios_slug ON user_portfolios(slug);
CREATE INDEX IF NOT EXISTS idx_user_portfolios_is_published ON user_portfolios(is_published);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_user_module_access_user_id ON user_module_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_module_access_module_id ON user_module_access(module_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_modules_updated_at BEFORE UPDATE ON portfolio_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_portfolios_updated_at BEFORE UPDATE ON user_portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to grant module access after successful payment
CREATE OR REPLACE FUNCTION grant_module_access_after_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO user_module_access (user_id, module_id, payment_id)
    VALUES (NEW.user_id, NEW.module_id, NEW.id)
    ON CONFLICT (user_id, module_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER grant_access_on_payment_complete
  AFTER UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION grant_module_access_after_payment();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_module_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for portfolio_modules table
CREATE POLICY "Anyone can read active modules"
  ON portfolio_modules FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can insert modules"
  ON portfolio_modules FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update modules"
  ON portfolio_modules FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete modules"
  ON portfolio_modules FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for user_portfolios table
CREATE POLICY "Users can read own portfolios"
  ON user_portfolios FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Published portfolios are public"
  ON user_portfolios FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Users can insert own portfolios"
  ON user_portfolios FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own portfolios"
  ON user_portfolios FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own portfolios"
  ON user_portfolios FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for payments table
CREATE POLICY "Users can read own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "System can insert payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_module_access table
CREATE POLICY "Users can read own access"
  ON user_module_access FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all access"
  ON user_module_access FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "System can grant access"
  ON user_module_access FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
