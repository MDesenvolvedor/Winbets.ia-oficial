// ============================================================
// SUPABASE — INICIALIZAÇÃO COM FALLBACK ROBUSTO
// ============================================================

const SUPABASE_URL = typeof process !== 'undefined' && process.env?.SUPABASE_URL
    ? process.env.SUPABASE_URL
    : 'https://hvcydvifrmezenndfuhg.supabase.co';

const SUPABASE_ANON_KEY = typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY
    ? process.env.SUPABASE_ANON_KEY
    : 'sb_publishable_oB5Uw8Q1-xqoRy5otf388Q_UVZgbjls';

let supabase = null;
let supabaseInitialized = false;
let currentUser = null;
let authToken = null;

try { authToken = localStorage.getItem('supabaseToken'); } catch(e) {}

function initSupabase() {
    try {
        if (typeof window.supabase === 'undefined') {
            console.warn('⚠️ [Supabase] Biblioteca não carregada. Tentando novamente em 1s...');
            setTimeout(initSupabase, 1000);
            return false;
        }

        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
                storage: window.localStorage,
                storageKey: 'supabase.auth.token',
            },
            db: { schema: 'public' },
            global: { headers: { 'X-Client-Info': 'winbets-web' } }
        });

        supabaseInitialized = true;
        console.log('✅ [Supabase] Inicializado com sucesso!');
        window.supabaseClient = supabase;
        window.__supabase = supabase;
        return true;
    } catch (error) {
        console.error('❌ [Supabase] Erro ao inicializar:', error.message);
        supabase = null;
        supabaseInitialized = false;
        return false;
    }
}

function createFallbackSupabase() {
    return {
        auth: {
            signUp: () => Promise.reject(new Error('Supabase não disponível. Modo offline.')),
            signInWithPassword: () => Promise.reject(new Error('Supabase não disponível. Modo offline.')),
            signOut: () => Promise.resolve({ error: null }),
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            updateUser: () => Promise.reject(new Error('Supabase não disponível. Modo offline.')),
            resetPasswordForEmail: () => Promise.reject(new Error('Supabase não disponível. Modo offline.'))
        },
        from: (table) => ({
            select: () => Promise.reject(new Error(`Supabase não disponível. Tabela: ${table}`)),
            insert: () => Promise.reject(new Error(`Supabase não disponível. Tabela: ${table}`)),
            update: () => Promise.reject(new Error(`Supabase não disponível. Tabela: ${table}`)),
            delete: () => Promise.reject(new Error(`Supabase não disponível. Tabela: ${table}`)),
            eq: () => Promise.reject(new Error(`Supabase não disponível. Tabela: ${table}`)),
            single: () => Promise.reject(new Error(`Supabase não disponível. Tabela: ${table}`)),
            order: () => Promise.reject(new Error(`Supabase não disponível. Tabela: ${table}`)),
            limit: () => Promise.reject(new Error(`Supabase não disponível. Tabela: ${table}`))
        })
    };
}

function getSupabase() {
    if (supabase && supabaseInitialized) return supabase;
    const initResult = initSupabase();
    if (initResult) return supabase;
    return createFallbackSupabase();
}

initSupabase();

document.addEventListener('DOMContentLoaded', function() {
    if (!supabaseInitialized) {
        console.log('🔄 [Supabase] Tentando inicializar após DOM carregado...');
        initSupabase();
    }
});

setTimeout(function() {
    if (!supabaseInitialized) {
        console.log('🔄 [Supabase] Tentando inicializar após timeout...');
        initSupabase();
    }
}, 3000);

window.supabaseClient = supabase || createFallbackSupabase();
window.__supabase = supabase || createFallbackSupabase();
window.getSupabase = getSupabase;
window.isSupabaseReady = () => supabaseInitialized;

console.log('✅ [Supabase] Módulo carregado. Status:', supabaseInitialized ? '✅ Online' : '⚠️ Offline');

// ============================================================
