import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isPlaceholder = (val: string) => !val || val.includes('placeholder') || val === 'your_supabase_url' || val === 'your_supabase_anon_key';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !isPlaceholder(supabaseUrl) && 
  !isPlaceholder(supabaseAnonKey)
);

if (!isSupabaseConfigured) {
  console.error('Supabase URL or Anon Key is missing or invalid');
}

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-key'
);

