import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wlhqhfedrvqlgfjfijuj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsaHFoZmVkcnZxbGdmamZpanVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzYyNDQsImV4cCI6MjA2ODk1MjI0NH0.uq2WE2hN9a5vL5fwPRsq3tt3c9DPXr7ubbNDR7HvPO4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);