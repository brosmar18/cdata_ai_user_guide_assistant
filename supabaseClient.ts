import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define a global object to store the Supabase client instance
const globalForSupabase = globalThis as unknown as {
  supabase: SupabaseClient | undefined;
};

// Create or reuse the Supabase client instance
export const supabase = globalForSupabase.supabase ?? createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// If not in production, store the instance globally to prevent hot-reload issues
if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.supabase = supabase;
}
