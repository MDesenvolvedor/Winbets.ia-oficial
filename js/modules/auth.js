// ============================================================
// AUTENTICAÇÃO — WIN BETS (COM DEBUG)
// ============================================================

console.log('🔍 [Auth] Iniciando módulo de autenticação...');

function getSupabaseClient() {
    console.log('🔍 [Auth] Tentando obter Supabase client...');
    
    const client = window.supabaseClient || window.__supabase || window.supabase;
    
    if (client && typeof client.auth !== 'undefined') {
        console.log('✅ [Auth] Supabase client encontrado!');
        return client;
    }
    
    console.warn('⚠️ [Auth] Supabase NÃO disponível! Usando fallback.');
    console.warn('⚠️ [Auth] Verifique se o supabase.js foi carregado antes do auth.js');
    
    return {
        auth: {
            signUp: () => {
                console.error('❌ [Auth] Tentativa de signUp com fallback!');
                return Promise.reject(new Error('Supabase não disponível. Modo offline.'));
            },
            signInWithPassword: () => {
                console.error('❌ [Auth] Tentativa de login com fallback!');
                return Promise.reject(new Error('Supabase não disponível. Modo offline.'));
            },
            signOut: () => Promise.resolve({ error: null }),
            getSession: () => {
                console.warn('⚠️ [Auth] getSession com fallback');
                return Promise.resolve({ data: { session: null }, error: null });
            },
            updateUser: () => Promise.reject(new Error('Supabase não disponível.')),
            resetPasswordForEmail: () => Promise.reject(new Error('Supabase não disponível.'))
        },
        from: () => ({
            select: () => Promise.reject(new Error('Supabase não disponível.')),
            insert: () => Promise.reject(new Error('Supabase não disponível.')),
            update: () => Promise.reject(new Error('Supabase não disponível.')),
            delete: () => Promise.reject(new Error('Supabase não disponível.'))
        })
    };
}

function isSupabaseAvailable() {
    const client = window.supabaseClient || window.__supabase || window.supabase;
    const available = client && typeof client.auth !== 'undefined' && typeof client.auth.signUp === 'function';
    console.log(`🔍 [Auth] Supabase disponível: ${available ? '✅ Sim' : '❌ Não'}`);
    return available;
}

// ── CADASTRO ─────────────────────────────────────────────────
async function register() {
    console.log('🔍 [Auth] Função register() chamada');
    clearAllErrors();

    // Verificar Supabase
    if (!isSupabaseAvailable()) {
        console.error('❌ [Auth] Supabase não disponível para cadastro!');
        showAuthMessage('⚠️ Modo offline. O cadastro não está disponível. Verifique sua conexão.', 'error');
        return;
    }

    const supabase = getSupabaseClient();
    console.log('✅ [Auth] Supabase obtido com sucesso para cadastro');

    const name = document.getElementById('regName')?.value.trim();
    const phone = document.getElementById('regPhone')?.value.trim();
    const email = document.getElementById('regEmail')?.value.trim();
    const emailConfirm = document.getElementById('regEmailConfirm')?.value.trim();
    const password = document.getElementById('regPassword')?.value;
    const confirm = document.getElementById('regConfirmPassword')?.value;

    console.log('🔍 [Auth] Dados do formulário:', { name, phone, email, passwordLength: password?.length });

    // Validar
    let hasError = false;
    const nameErr = validateName(name);
    if (nameErr) { showFieldError('regName', nameErr); hasError = true; }

    const phoneErr = validatePhone(phone);
    if (phoneErr) { showFieldError('regPhone', phoneErr); hasError = true; }

    const emailErr = validateEmail(email);
    if (emailErr) { showFieldError('regEmail', emailErr); hasError = true; }

    if (!emailErr) {
        const emailConfirmErr = validateEmailConfirm(email, emailConfirm);
        if (emailConfirmErr) { showFieldError('regEmailConfirm', emailConfirmErr); hasError = true; }
    }

    const passErr = validatePassword(password);
    if (passErr) { showFieldError('regPassword', passErr); hasError = true; }

    if (!passErr) {
        const confirmErr = validatePasswordConfirm(password, confirm);
        if (confirmErr) { showFieldError('regConfirmPassword', confirmErr); hasError = true; }
    }

    if (hasError) {
        console.warn('⚠️ [Auth] Erros de validação no formulário');
        return;
    }

    const btn = document.getElementById('authButton');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A criar conta...';
    btn.disabled = true;

    try {
        console.log('🔍 [Auth] Enviando requisição para Supabase signUp...');
        
        const affiliateCode = Math.random().toString(36).substring(2, 10).toUpperCase();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name, phone } }
        });

        console.log('🔍 [Auth] Resposta do Supabase:', { data, error });

        if (error) throw error;

        if (data.user) {
            console.log('✅ [Auth] Usuário criado:', data.user.id);
            
            const { error: insertError } = await supabase.from('users').insert([{
                id: data.user.id,
                name,
                email,
                phone,
                affiliate_code: affiliateCode,
                bankroll: 1000,
                demo_balance: 50000
            }]);

            if (insertError) {
                console.error('❌ [Auth] Erro ao inserir na tabela users:', insertError);
            } else {
                console.log('✅ [Auth] Usuário inserido na tabela users');
            }
        }

        showAuthMessage('✅ Conta criada! Verifique o seu e-mail para confirmar.', 'success');
        setTimeout(() => { switchToLogin(); showGreeting(true); }, 2500);

    } catch (err) {
        console.error('❌ [Auth] Erro no cadastro:', err);
        if (err.message.includes('already registered')) {
            showFieldError('regEmail', 'Este e-mail já está registado.');
        } else {
            showAuthMessage('❌ Erro: ' + err.message, 'error');
        }
    } finally {
        btn.innerHTML = '<i class="fas fa-user-plus"></i> Cadastrar';
        btn.disabled = false;
    }
}

// ── LOGIN ────────────────────────────────────────────────────
async function login() {
    console.log('🔍 [Auth] Função login() chamada');

    if (!isSupabaseAvailable()) {
        console.error('❌ [Auth] Supabase não disponível para login!');
        showAuthMessage('⚠️ Modo offline. O login não está disponível. Verifique sua conexão.', 'error');
        return;
    }

    const supabase = getSupabaseClient();

    const identifier = document.getElementById('loginIdentifier')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;

    console.log('🔍 [Auth] Tentando login com:', { identifier });

    if (!identifier || !password) {
        showAuthMessage('❌ Preencha todos os campos.', 'error');
        return;
    }

    const btn = document.getElementById('authButton');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A entrar...';
    btn.disabled = true;

    try {
        console.log('🔍 [Auth] Enviando requisição para Supabase signIn...');
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: identifier,
            password
        });

        console.log('🔍 [Auth] Resposta do Supabase:', { data, error });

        if (error) throw error;

        if (data.user) {
            console.log('✅ [Auth] Login bem-sucedido:', data.user.id);
            
            authToken = data.session.access_token;
            localStorage.setItem('supabaseToken', authToken);

            const { data: userData, error: userError } = await supabase
                .from('users').select('*')
                .eq('id', data.user.id).single();

            if (userError) {
                console.error('❌ [Auth] Erro ao buscar dados do usuário:', userError);
            }

            currentUser = {
                id: data.user.id,
                email: data.user.email,
                name: userData?.name || data.user.user_metadata?.name || data.user.email,
                phone: userData?.phone || '',
                plan: userData?.plan || 'free',
                affiliate_code: userData?.affiliate_code || '',
                commissions: userData?.commissions || 0,
                total_referrals: userData?.total_referrals || 0,
                is_admin: userData?.plan === 'admin',
                bankroll: userData?.bankroll || 1000
            };

            userBalanceInUSD = currentUser.bankroll;
            document.getElementById('authModal').style.display = 'none';
            updateUserButton();
            showGreeting(false);
            updateAccountInfo();
            document.getElementById('accessBlock').classList.add('hide');
            document.getElementById('mainContent').style.display = 'block';
            loadGames(); loadBookmakers(); loadLeagues();
            loadBlog(); loadRanking(); loadPlans(); loadAIAnalysis();
            updateMiniBankrollDisplay(); updateDemoBalanceTop();
            setTimeout(() => { updateChartBookmakers(); }, 2000);
        }

    } catch (err) {
        console.error('❌ [Auth] Erro no login:', err);
        if (err.message.includes('Invalid login')) {
            showAuthMessage('❌ E-mail ou senha incorretos.', 'error');
        } else if (err.message.includes('Email not confirmed')) {
            showAuthMessage('⚠️ Confirme o seu e-mail antes de entrar.', 'error');
        } else {
            showAuthMessage('❌ Erro: ' + err.message, 'error');
        }
    } finally {
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar';
        btn.disabled = false;
    }
}

// ... (restante do auth.js igual)
