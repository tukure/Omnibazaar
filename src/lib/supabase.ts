import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

export function getStoredSupabaseUrl(): string {
  const custom = typeof localStorage !== 'undefined' ? localStorage.getItem('OMNI_SUPABASE_URL') : null;
  return getValidSupabaseUrl(custom || import.meta.env.VITE_SUPABASE_URL);
}

export function getStoredSupabaseAnonKey(): string {
  const custom = typeof localStorage !== 'undefined' ? localStorage.getItem('OMNI_SUPABASE_KEY') : null;
  return getValidSupabaseAnonKey(custom || import.meta.env.VITE_SUPABASE_ANON_KEY);
}

export function getSupabaseProjectId(): string {
  const url = getStoredSupabaseUrl();
  try {
    const host = new URL(url).hostname;
    const parts = host.split('.');
    return parts[0] || 'qulfvekxkttplcmtanwo';
  } catch {
    return 'qulfvekxkttplcmtanwo';
  }
}

let activeClient: SupabaseClient = createClient(getStoredSupabaseUrl(), getStoredSupabaseAnonKey());

export function updateSupabaseConfig(url: string, key: string) {
  if (url && url.trim()) {
    localStorage.setItem('OMNI_SUPABASE_URL', url.trim());
  } else {
    localStorage.removeItem('OMNI_SUPABASE_URL');
  }

  if (key && key.trim()) {
    localStorage.setItem('OMNI_SUPABASE_KEY', key.trim());
  } else {
    localStorage.removeItem('OMNI_SUPABASE_KEY');
  }

  activeClient = createClient(getStoredSupabaseUrl(), getStoredSupabaseAnonKey());
  return activeClient;
}

export function resetSupabaseConfig() {
  localStorage.removeItem('OMNI_SUPABASE_URL');
  localStorage.removeItem('OMNI_SUPABASE_KEY');
  activeClient = createClient(getStoredSupabaseUrl(), getStoredSupabaseAnonKey());
  return activeClient;
}

export const SUPABASE_URL = getStoredSupabaseUrl();
export const SUPABASE_ANON_KEY = getStoredSupabaseAnonKey();
export const SUPABASE_PROJECT_ID = getSupabaseProjectId();

// Proxy object delegating all Supabase calls to activeClient
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const val = (activeClient as any)[prop];
    if (typeof val === 'function') {
      return val.bind(activeClient);
    }
    return val;
  }
});

// Helper SQL definition for users to run in Supabase SQL editor if needed
export const SUPABASE_SQL_SCHEMA = `
-- =========================================================================
-- OMNIBAZAAR COMPLETE SUPABASE DATABASE SETUP & REPAIR SCRIPT
-- Copy ALL lines below, paste into your Supabase SQL Editor, and click "Run".
-- =========================================================================

-- STEP 1: CLEANUP PREVIOUS TABLES (PREVENTS COLUMN MISMATCH ERRORS)
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.trade_offers CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- STEP 2: CREATE USERS TABLE
CREATE TABLE public.users (
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

-- STEP 3: CREATE PRODUCTS TABLE
CREATE TABLE public.products (
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

-- STEP 4: CREATE TRADE OFFERS TABLE
CREATE TABLE public.trade_offers (
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

-- STEP 5: CREATE MESSAGES TABLE
CREATE TABLE public.messages (
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

-- STEP 6: GRANT TABLE ACCESS TO ANON, AUTHENTICATED & SERVICE_ROLE
GRANT ALL ON TABLE public.users TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.trade_offers TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.messages TO anon, authenticated, service_role;

-- STEP 7: ENABLE ROW LEVEL SECURITY & SET UNRESTRICTED ACCESS POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read/write users" ON public.users;
DROP POLICY IF EXISTS "Public read/write products" ON public.products;
DROP POLICY IF EXISTS "Public read/write trade_offers" ON public.trade_offers;
DROP POLICY IF EXISTS "Public read/write messages" ON public.messages;

CREATE POLICY "Public read/write users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write trade_offers" ON public.trade_offers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);
`.trim();
