// ============================================================
// SUPABASE — INICIALIZAÇÃO DO CLIENTE
// ============================================================

const SUPABASE_URL = typeof process !== 'undefined' && process.env?.SUPABASE_URL
    ? process.env.SUPABASE_URL
    : 'https://hvcydvifrmezenndfuhg.supabase.co';

const SUPABASE_ANON_KEY = typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY
    ? process.env.SUPABASE_ANON_KEY
    : 'sb_publishable_oB5Uw8Q1-xqoRy5otf388Q_UVZgbjls';

// ✅ Usar window.supabase (biblioteca carregada pelo CDN no <head>)
let supabase;
try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase inicializado com sucesso.');
} catch (e) {
    console.error('❌ Erro ao inicializar Supabase:', e.message);
}

let currentUser = null;
let authToken   = null;

try { authToken = localStorage.getItem('supabaseToken'); } catch(e) {}

// ============================================================
