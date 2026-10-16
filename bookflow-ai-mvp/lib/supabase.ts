import { createClient } from '@supabase/supabase-js';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export function createPublicSupabase() {
  if (!url || !anon) throw new Error('Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  return createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
}
