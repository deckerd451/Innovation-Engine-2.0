
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace with your project's URL and anon key.
// You can find these in your Supabase project's API settings.
const supabaseUrl = 'https://hvmotpzhliufzomewzfl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bW90cHpobGl1ZnpvbWV3emZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NzY2NDUsImV4cCI6MjA1ODE1MjY0NX0.foHTGZVtRjFvxzDfMf1dpp0Zw4XFfD-FPZK-zRnjc6s';

// Helper to clean common copy-paste error where 'YOUR' from the placeholder is left in the key
let cleanKey = supabaseAnonKey;
if (cleanKey && cleanKey.startsWith('YOUReyJ')) {
    console.warn('Detected "YOUR" prefix in API key. Attempting to clean it automatically.');
    cleanKey = cleanKey.substring(4);
}

export const isSupabaseConfigured = (supabaseUrl as string) !== 'YOUR_SUPABASE_URL' && !cleanKey.startsWith('YOUR_');

if (!isSupabaseConfigured) {
    console.error("Supabase credentials not set. Please update supabaseClient.ts. Instructions are in INSTRUCTIONS.md.");
}

// Fix: Use a fallback URL to prevent createClient from throwing an error if the URL is invalid (placeholder).
// This allows the app to render the configuration warning screen instead of crashing.
const validUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const validKey = isSupabaseConfigured ? cleanKey : 'placeholder';

export const supabase = createClient(validUrl, validKey);
