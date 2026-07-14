-- ============================================================
-- ResumeAI SaaS - Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- Synced from Clerk via webhook. Stores subscription state.
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  usage_today INTEGER NOT NULL DEFAULT 0,
  last_reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- REVIEWS TABLE
-- Stores each AI resume review result per user
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resume_text TEXT NOT NULL,
  job_description TEXT NOT NULL,
  job_title TEXT,
  company_name TEXT,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  relevance_score INTEGER NOT NULL CHECK (relevance_score >= 0 AND relevance_score <= 100),
  keywords_score INTEGER NOT NULL CHECK (keywords_score >= 0 AND keywords_score <= 100),
  formatting_score INTEGER NOT NULL CHECK (formatting_score >= 0 AND formatting_score <= 100),
  experience_score INTEGER NOT NULL CHECK (experience_score >= 0 AND experience_score <= 100),
  strengths JSONB NOT NULL DEFAULT '[]',
  improvements JSONB NOT NULL DEFAULT '[]',
  missing_keywords JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON reviews(user_id);
CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS profiles_clerk_user_id_idx ON profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx ON profiles(stripe_customer_id);

-- ============================================================
-- AUTO-UPDATE updated_at ON profiles
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (optional but recommended)
-- If using Supabase client directly from frontend, enable RLS.
-- Since we use service role key server-side, we keep RLS disabled.
-- ============================================================
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
