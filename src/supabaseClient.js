import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rkvvasabmogmkfnzheot.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrdnZhc2FibW9nbWtmbnpoZW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNzY1NDQsImV4cCI6MjA3OTY1MjU0NH0.oBbTf1Vu_YA0HocUlV_sCtm3YHXpTxKtryRq2KLb1zE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
