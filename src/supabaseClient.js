import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rbfyfrdgcsmawyvwmqzj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiZnlmcmRnY3NtYXd5dndtcXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzE2OTYsImV4cCI6MjA4MTMwNzY5Nn0.rjqJZssP75a2qxXvjJIvsw5DcvvZ6dy4FDxQ1fozkV4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
