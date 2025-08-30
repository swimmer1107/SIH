import { createClient } from '@supabase/supabase-js';

// --- IMPORTANT ---
// The application requires a Supabase backend to handle user authentication.
// You must create a Supabase project and add your project's URL and
// anon key as environment variables (SUPABASE_URL and SUPABASE_ANON_KEY).

// To prevent the application from crashing in a development environment where
// environment variables might not be set, we are providing placeholder values below.
// With these placeholders, the app will run, but authentication WILL NOT WORK until
// you provide your actual Supabase credentials.

const supabaseUrl = process.env.SUPABASE_URL || 'https://ltexqacsjtiesncjvfml.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZXhxYWNzanRpZXNuY2p2Zm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MDk4MjQsImV4cCI6MjA3MTk4NTgyNH0.41O5hpoVCTSZiPuysABjHapBNxikWaPLbg8I66_Ejn4';

if (supabaseUrl === 'https://ltexqacsjtiesncjvfml.supabase.co' || !process.env.SUPABASE_URL) {
    console.warn(
        'Supabase is using placeholder credentials because SUPABASE_URL and SUPABASE_ANON_KEY environment variables are not set. ' +
        'Authentication will fail until you provide your own Supabase credentials.'
    );
}

// The original code threw an error if the variables were not set, which is the
// correct behavior for a production environment. We are using placeholders here 
// specifically to prevent a crash in a development sandbox where setting env 
// vars might not be straightforward.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
