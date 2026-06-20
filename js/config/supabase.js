// ============================================================
// SUPABASE - VARIÁVEIS DE AMBIENTE (SEGURAS NO VERCEL)
// ============================================================
const SUPABASE_URL = typeof process !== 'undefined' && process.env.SUPABASE_URL 
    ? process.env.SUPABASE_URL 
    : 'https://hvcydvifrmezenndfuhg.supabase.co';
const SUPABASE_ANON_KEY = typeof process !== 'undefined' && process.env.SUPABASE_ANON_KEY 
    ? process.env.SUPABASE_ANON_KEY 
    : 'sb_publishable_oB5Uw8Q1-xqoRy5otf388Q_UVZgbjls';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;
let authToken = localStorage.getItem('supabaseToken');

