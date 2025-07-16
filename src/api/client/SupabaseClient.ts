import { createClient } from "@supabase/supabase-js";

const dbUrl = import.meta.env.VITE_SUPABASE_DATABASE_URL;

const supabase = createClient(dbUrl, import.meta.env.VITE_SUPABASE_ANON_KEY);

export default supabase;
