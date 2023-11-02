import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ocdouhmjkpwrezufxspz.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jZG91aG1qa3B3cmV6dWZ4c3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg1NDA2NDAsImV4cCI6MjAxNDExNjY0MH0.MEGINryHJdgHwst1dtSn2F_ECotwp4xqzRFjf7Frs8k';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default supabase;
