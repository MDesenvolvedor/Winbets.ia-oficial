// ============================================================
// AUTENTICAÇÃO — WIN BETS (COM VERIFICAÇÃO ROBUSTA)
// ============================================================

function getSupabaseClient() {
    const client = window.supabaseClient || window.__supabase || window.supabase;
    if (client && typeof client.auth !== 'undefined') return client;
    console.warn('⚠️ [Auth] Supabase não disponível. Usando fallback offline.');
    return {
        auth: {
            signUp: () => Promise.reject(new Error('Supabase não disponível. Modo offline.')),
            signInWithPassword: () => Promise.reject(new Error('Supabase não disponível. Modo offline.')),
            signOut: () => Promise.resolve({ error: null }),
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            updateUser: () => Promise.reject(new Error('Supabase não disponível. Modo offline.')),
            resetPasswordForEmail: () => Promise.reject(new Error('Supabase não disponível. Modo offline.'))
        },
        from: () => ({
            select: () => Promise.reject(new Error('Supabase não disponível. Modo offline.')),
            insert: () => Promise.reject(new Error('Supabase não disponível. Modo offline.')),
            update: () => Promise.reject(new Error('Supabase não disponível. Modo offline.')),
            delete: () => Promise.reject(new Error('Supabase não disponível. Modo offline.'))
        })
    };
}

function isSupabaseAvailable() {
    const client = window.supabaseClient || window.__supabase || window.supabase;
    return client && typeof client.auth !== 'undefined' && typeof client.auth.signUp === 'function';
}

function validateName(name) {
    if (!name || name.trim().length < 3) return 'O nome deve ter pelo menos 3 caracteres.';
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)) return 'O nome só pode conter letras e espaços.';
    return null;
}

function validatePhone(phone) {
    const cleaned = phone.replace(/[\s\-().]/g, '');
    if (!/^\+?[0-9]{7,15}$/.test(cleaned))
        return 'Número inválido. Use formato nacional (927224260) ou internacional (+244927224260).';
    return null;
}

function validateEmail(email) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'E-mail inválido.';
    return null;
}

function validateEmailConfirm(email, emailConfirm) {
    if (email !== emailConfirm) return 'Os e-mails não coincidem.';
    return null;
}

function validatePassword(password) {
    if (!password || password.length < 8) return 'A senha deve ter pelo menos 8 caracteres.';
    if (!/[A-Z]/.test(password)) return 'A senha deve ter pelo menos uma letra maiúscula.';
    if (!/[a-z]/.test(password)) return 'A senha deve ter pelo menos uma letra minúscula.';
    if (!/[0-9]/.test(password)) return 'A senha deve ter pelo menos um número.';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
        return 'A senha deve ter pelo menos um caractere especial (!@#$%...).';
    return null;
}

function validatePasswordConfirm(password, confirm) {
    if (password !== confirm) return 'As senhas não coincidem.';
    return null;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.style.borderColor = '#FF3B30';
    let err = field.parentNode.querySelector('.field-error');
