import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://emplagwsoqmbiunstere.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtcGxhZ3dzb3FtYml1bnN0ZXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MDE4MzcsImV4cCI6MjA1MDI3NzgzN30.R29M23ndPcutrekx7oqM6Mlag9w6gwRwL3vw1lrFVuU";

// Create Supabase client with proper configuration
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Function to verify if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!supabase;
};