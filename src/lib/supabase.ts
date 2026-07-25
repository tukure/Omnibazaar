import { createClient } from '@supabase/supabase-js';

function getValidSupabaseUrl(rawUrl?: string): string {
  const fallback = 'https://qulfvekxkttplcmtanwo.supabase.co';
  if (!rawUrl || typeof rawUrl !== 'string') return fallback;
  
  let cleaned = rawUrl.trim();
  if (!cleaned || cleaned.startsWith('MY_') || cleaned === 'undefined') {
    return fallback;
  }
  
  // Remove /rest/v1 suffix if present
  cleaned = cleaned.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
  
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }
  
  try {
    const parsed = new URL(cleaned);
    return parsed.origin;
  } catch {
    return fallback;
  }
}

function getValidSupabaseAnonKey(rawKey?: string): string {
  const fallback = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1bGZ2ZWt4a3R0cGxjbXRhbndvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NDExNjcsImV4cCI6MjEwMDUxNzE2N30.8V_o6VSxnGtRgv1937JtqcBEcfofUmk-U2TWsp2QprM';
  if (!rawKey || typeof rawKey !== 'string') return fallback;
  const cleaned = rawKey.trim();
  if (!cleaned || cleaned.startsWith('MY_') || cleaned === 'undefined') return fallback;
  return cleaned;
}

export const SUPABASE_URL = getValidSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
export const SUPABASE_ANON_KEY = getValidSupabaseAnonKey(import.meta.env.VITE_SUPABASE_ANON_KEY);
export const SUPABASE_PROJECT_ID = 'qulfvekxkttplcmtanwo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper SQL definition for users to run in Supabase SQL editor if needed
export const SUPABASE_SQL_SCHEMA = `
-- Run this in your Supabase SQL Editor if tables are not yet created:

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT,
  email TEXT,
  avatar_url TEXT,
  location JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  rating NUMERIC DEFAULT 5.0,
  trades_completed INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  seller_id TEXT,
  seller_username TEXT,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC DEFAULT 0,
  category TEXT,
  condition TEXT,
  listing_type TEXT,
  image_url TEXT,
  additional_images JSONB,
  location JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_sold BOOLEAN DEFAULT FALSE,
  is_traded BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS trade_offers (
  id TEXT PRIMARY KEY,
  sender_id TEXT,
  sender_username TEXT,
  recipient_id TEXT,
  recipient_username TEXT,
  target_product_id TEXT,
  target_product_title TEXT,
  target_product_image_url TEXT,
  offered_item JSONB,
  cash_top_up NUMERIC DEFAULT 0,
  note TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT,
  sender_id TEXT,
  sender_username TEXT,
  recipient_id TEXT,
  recipient_username TEXT,
  product_id TEXT,
  trade_offer_id TEXT,
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  is_system_notification BOOLEAN DEFAULT FALSE
);

-- Enable RLS and public access policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read/write users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write trade_offers" ON trade_offers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write messages" ON messages FOR ALL USING (true) WITH CHECK (true);
`.trim();
