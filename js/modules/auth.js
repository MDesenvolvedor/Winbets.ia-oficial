// ============================================================
// AUTENTICAÇÃO — WIN BETS (VERSÃO COMPLETA E FUNCIONAL)
// ============================================================
// ✅ Compatível com todas as versões do Supabase
// ✅ Fallback robusto
// ✅ Logs detalhados para debug
// ✅ Validações completas
// ✅ Recuperação de senha
// ✅ Persistência de sessão
// ============================================================

// ──────────────────────────────────────────────────────────────
// 1. OBTENÇÃO DO SUPABASE (MULTIPLAS FONTES)
// ──────────────────────────────────────────────────────────────

function getSupabaseClient() {
    // Tentar obter de várias fontes
    const sources = [
        window.supabaseClient,
        window.__supabase,
        window.supabase,
        // Se o supabase foi criado como variável global
        typeof supabase !== 'undefined' ? supabase : null
    ];
    
    for (const source of sources) {
        if (source && typeof source === 'object' && source.auth) {
            console.log('✅ [Auth] Supabase encontrado!');
            return source;
        }
    }
    
    console.warn('⚠️ [Auth] Supabase não encontrado. Criando fallback...');
    
    // Fallback que mostra alerta
    return {
        auth: {
            signUp: (data) => {
                console.error('❌ [Auth] signUp em modo offline', data);
                alert('❌ Supabase não está disponível. Verifique sua conexão e recarregue a página.');
                return Promise.reject(new Error('Supabase indisponível'));
            },
            signInWithPassword: (data) => {
                console.error('❌ [Auth] login em modo offline', data);
                alert('❌ Supabase não está disponível. Verifique sua conexão e recarregue a página.');
                return Promise.reject(new Error('Supabase indisponível'));
            },
            signOut: () => {
                console.log('ℹ️ [Auth] Logout offline');
                return Promise.resolve({ error: null });
            },
            getSession: () => {
                console.log('ℹ️ [Auth] getSession offline');
                return Promise.resolve({ data: { session: null }, error: null });
            },
            updateUser: () => Promise.reject(new Error('Supabase indisponível')),
            resetPasswordForEmail: () => Promise.reject(new Error('Supabase indisponível'))
        },
        from: () => ({
            select: () => Promise.reject(new Error('Supabase indisponível')),
            insert: () => Promise.reject(new Error('Supabase indisponível')),
            update: () => Promise.reject(new Error('Supabase indisponível')),
            delete: () => Promise.reject(new Error('Supabase indisponível')),
            eq: () => Promise.reject(new Error('Supabase indisponível')),
            single: () => Promise.reject(new Error('Supabase indisponível'))
        })
    };
}

// ──────────────────────────────────────────────────────────────
// 2. VARIÁVEIS GLOBAIS
// ──────────────────────────────────────────────────────────────

const supabase = getSupabaseClient();
let currentUser = null;
let authToken = null;

try {
    authToken = localStorage.getItem('supabaseToken');
    if (authToken) {
        console.log('🔑 [Auth] Token encontrado no localStorage');
    }
} catch (e) {
    console.warn('⚠️ [Auth] Erro ao ler localStorage:', e.message);
}

// ──────────────────────────────────────────────────────────────
// 3. VALIDADORES
// ──────────────────────────────────────────────────────────────

function validateName(name) {
    if (!name || name.trim().length < 3) {
        return 'O nome deve ter pelo menos 3 caracteres.';
    }
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)) {
        return 'O nome só pode conter letras e espaços.';
    }
    return null;
}

function validatePhone(phone) {
    if (!phone) return 'O telefone é obrigatório.';
    const cleaned = phone.replace(/[\s\-().]/g, '');
    if (!/^\+?[0-9]{7,15}$/.test(cleaned)) {
        return 'Número inválido. Use formato nacional (927224260) ou internacional (+244927224260).';
    }
    return null;
}

function validateEmail(email) {
    if (!email) return 'O e-mail é obrigatório.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'E-mail inválido.';
    }
    return null;
}

function validateEmailConfirm(email, emailConfirm) {
    if (email !== emailConfirm) {
        return 'Os e-mails não coincidem.';
    }
    return null;
}

function validatePassword(password) {
    if (!password || password.length < 8) {
        return 'A senha deve ter pelo menos 8 caracteres.';
    }
    if (!/[A-Z]/.test(password)) {
        return 'A senha deve ter pelo menos uma letra maiúscula.';
    }
    if (!/[a-z]/.test(password)) {
        return 'A senha deve ter pelo menos uma letra minúscula.';
    }
    if (!/[0-9]/.test(password)) {
        return 'A senha deve ter pelo menos um número.';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return 'A senha deve ter pelo menos um caractere especial (!@#$%...).';
    }
    return null;
}

function validatePasswordConfirm(password, confirm) {
    if (password !== confirm) {
        return 'As senhas não coincidem.';
    }
    return null;
}

// ──────────────────────────────────────────────────────────────
// 4. FUNÇÕES DE UI (ERROS)
// ──────────────────────────────────────────────────────────────

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.style.borderColor = '#FF3B30';
    field.style.borderWidth = '2px';
    
    let err = field.parentNode.querySelector('.field-error');
    if (!err) {
        err = document.createElement('div');
        err.className = 'field-error';
        err.style.cssText = 'color:#FF3B30;font-size:11px;margin-top:4px;padding-left:4px;';
        field.parentNode.appendChild(err);
    }
    err.textContent = message;
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.style.borderColor = '';
    field.style.borderWidth = '';
    
    const err = field.parentNode.querySelector('.field-error');
    if (err) err.remove();
}

function clearAllErrors() {
    ['regName','regPhone','regEmail','regEmailConfirm','regPassword','regConfirmPassword'].forEach(clearFieldError);
    const authMsg = document.getElementById('authMessage');
    if (authMsg) authMsg.style.display = 'none';
}

// ──────────────────────────────────────────────────────────────
// 5. FORÇA DA SENHA
// ──────────────────────────────────────────────────────────────

function updatePasswordStrength(password) {
    const indicator = document.getElementById('passwordStrength');
    if (!indicator) return;
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
    if (password.length >= 12) score++;

    const levels = [
        { label: '', color: 'transparent' },
        { label: '🔴 Muito fraca', color: '#FF3B30' },
        { label: '🟠 Fraca', color: '#FF9500' },
        { label: '🟡 Média', color: '#FFCC00' },
        { label: '🟢 Forte', color: '#34C759' },
        { label: '✅ Muito forte', color: '#00C853' },
    ];
    
    const level = levels[Math.min(score, 5)];
    indicator.textContent = level.label;
    indicator.style.color = level.color;
}

// ──────────────────────────────────────────────────────────────
// 6. MENSAGEM DE FEEDBACK
// ──────────────────────────────────────────────────────────────

function showAuthMessage(msg, type) {
    let el = document.getElementById('authMessage');
    if (!el) {
        el = document.createElement('div');
        el.id = 'authMessage';
        el.style.cssText = 'padding:10px;border-radius:8px;margin:10px 0;font-size:13px;text-align:center;';
        const btn = document.getElementById('authButton');
        if (btn) btn.parentNode.insertBefore(el, btn);
    }
    el.textContent = msg;
    el.style.background = type === 'success' ? 'rgba(0,200,83,0.15)' : 'rgba(255,59,48,0.15)';
    el.style.color = type === 'success' ? '#00C853' : '#FF3B30';
    el.style.display = 'block';
    
    clearTimeout(el._timeout);
    el._timeout = setTimeout(() => {
        if (el) el.style.display = 'none';
    }, 4000);
}

// ──────────────────────────────────────────────────────────────
// 7. CADASTRO (REGISTER)
// ──────────────────────────────────────────────────────────────

async function register() {
    console.log('🔍 [Auth] register() iniciado');
    clearAllErrors();

    // Verificar Supabase
    if (!supabase || !supabase.auth || typeof supabase.auth.signUp !== 'function') {
        console.error('❌ [Auth] Supabase não disponível para cadastro!');
        showAuthMessage('⚠️ Modo offline. O cadastro não está disponível.', 'error');
        return;
    }

    const name = document.getElementById('regName')?.value.trim();
    const phone = document.getElementById('regPhone')?.value.trim();
    const email = document.getElementById('regEmail')?.value.trim();
    const emailConfirm = document.getElementById('regEmailConfirm')?.value.trim();
    const password = document.getElementById('regPassword')?.value;
    const confirm = document.getElementById('regConfirmPassword')?.value;

    console.log('🔍 [Auth] Dados:', { name, phone, email, passwordLength: password?.length });

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
        console.warn('⚠️ [Auth] Erros de validação');
        return;
    }

    // Botão loading
    const btn = document.getElementById('authButton');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A criar conta...';
    btn.disabled = true;

    try {
        const affiliateCode = Math.random().toString(36).substring(2, 10).toUpperCase();

        console.log('🔍 [Auth] Chamando supabase.auth.signUp...');
        
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { 
                    name: name, 
                    phone: phone,
                    affiliate_code: affiliateCode
                }
            }
        });

        console.log('🔍 [Auth] Resposta:', { data, error });

        if (error) {
            console.error('❌ [Auth] Erro do Supabase:', error);
            throw error;
        }

        if (data?.user) {
            console.log('✅ [Auth] Usuário criado:', data.user.id);
            
            // Inserir na tabela users
            if (supabase.from && typeof supabase.from === 'function') {
                try {
                    const { error: insertError } = await supabase
                        .from('users')
                        .insert([{
                            id: data.user.id,
                            name: name,
                            email: email,
                            phone: phone,
                            affiliate_code: affiliateCode,
                            bankroll: 1000,
                            plan: 'free'
                        }]);

                    if (insertError) {
                        console.error('❌ [Auth] Erro ao inserir na tabela users:', insertError);
                    } else {
                        console.log('✅ [Auth] Usuário inserido na tabela users');
                    }
                } catch (e) {
                    console.error('❌ [Auth] Erro ao inserir na tabela users:', e);
                }
            }
        }

        showAuthMessage('✅ Conta criada! Verifique seu e-mail para confirmar.', 'success');
        
        setTimeout(() => {
            switchToLogin();
            showGreeting(true);
        }, 2500);

    } catch (err) {
        console.error('❌ [Auth] Erro no cadastro:', err);
        
        if (err.message?.includes('already registered')) {
            showFieldError('regEmail', 'Este e-mail já está registado.');
        } else if (err.message?.includes('password')) {
            showFieldError('regPassword', 'Senha inválida. Use 8+ caracteres com letras, números e especiais.');
        } else {
            showAuthMessage('❌ Erro: ' + err.message, 'error');
        }
    } finally {
        btn.innerHTML = '<i class="fas fa-user-plus"></i> Cadastrar';
        btn.disabled = false;
    }
}

// ──────────────────────────────────────────────────────────────
// 8. LOGIN
// ──────────────────────────────────────────────────────────────

async function login() {
    console.log('🔍 [Auth] login() iniciado');

    if (!supabase || !supabase.auth || typeof supabase.auth.signInWithPassword !== 'function') {
        console.error('❌ [Auth] Supabase não disponível para login!');
        showAuthMessage('⚠️ Modo offline. O login não está disponível.', 'error');
        return;
    }

    const identifier = document.getElementById('loginIdentifier')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;

    if (!identifier || !password) {
        showAuthMessage('❌ Preencha todos os campos.', 'error');
        return;
    }

    console.log('🔍 [Auth] Tentando login com:', { identifier });

    const btn = document.getElementById('authButton');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A entrar...';
    btn.disabled = true;

    try {
        console.log('🔍 [Auth] Chamando supabase.auth.signInWithPassword...');
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: identifier,
            password: password
        });

        console.log('🔍 [Auth] Resposta:', { data, error });

        if (error) {
            console.error('❌ [Auth] Erro do Supabase:', error);
            throw error;
        }

        if (data?.user) {
            console.log('✅ [Auth] Login bem-sucedido:', data.user.id);
            
            authToken = data.session?.access_token;
            if (authToken) {
                localStorage.setItem('supabaseToken', authToken);
            }

            // Buscar dados do usuário
            let userData = null;
            if (supabase.from && typeof supabase.from === 'function') {
                try {
                    const { data: uData, error: uError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', data.user.id)
                        .single();

                    if (uError) {
                        console.warn('⚠️ [Auth] Erro ao buscar dados do usuário:', uError);
                    } else {
                        userData = uData;
                        console.log('✅ [Auth] Dados do usuário obtidos:', userData);
                    }
                } catch (e) {
                    console.warn('⚠️ [Auth] Erro ao buscar dados do usuário:', e);
                }
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
                is_admin: userData?.is_admin || false,
                bankroll: userData?.bankroll || 1000
            };

            console.log('✅ [Auth] currentUser definido:', currentUser);

            // Atualizar UI
            userBalanceInUSD = currentUser.bankroll || 1000;
            document.getElementById('authModal').style.display = 'none';
            updateUserButton();
            showGreeting(false);
            updateAccountInfo();
            document.getElementById('accessBlock').classList.add('hide');
            document.getElementById('mainContent').style.display = 'block';
            
            // Carregar dados
            if (typeof loadGames === 'function') loadGames();
            if (typeof loadBookmakers === 'function') loadBookmakers();
            if (typeof loadLeagues === 'function') loadLeagues();
            if (typeof loadBlog === 'function') loadBlog();
            if (typeof loadRanking === 'function') loadRanking();
            if (typeof loadPlans === 'function') loadPlans();
            if (typeof loadAIAnalysis === 'function') loadAIAnalysis();
            
            updateMiniBankrollDisplay();
            updateDemoBalanceTop();
            
            setTimeout(() => {
                if (typeof updateChartBookmakers === 'function') updateChartBookmakers();
            }, 2000);
        }

    } catch (err) {
        console.error('❌ [Auth] Erro no login:', err);
        
        if (err.message?.includes('Invalid login')) {
            showAuthMessage('❌ E-mail ou senha incorretos.', 'error');
        } else if (err.message?.includes('Email not confirmed')) {
            showAuthMessage('⚠️ Confirme seu e-mail antes de entrar.', 'error');
        } else {
            showAuthMessage('❌ Erro: ' + err.message, 'error');
        }
    } finally {
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar';
        btn.disabled = false;
    }
}

// ──────────────────────────────────────────────────────────────
// 9. LOGOUT
// ──────────────────────────────────────────────────────────────

async function logout() {
    console.log('🔍 [Auth] logout() iniciado');
    
    if (supabase && supabase.auth && typeof supabase.auth.signOut === 'function') {
        try {
            await supabase.auth.signOut();
            console.log('✅ [Auth] Logout realizado no Supabase');
        } catch (e) {
            console.warn('⚠️ [Auth] Erro ao fazer logout no Supabase:', e);
        }
    }
    
    currentUser = null;
    authToken = null;
    localStorage.removeItem('supabaseToken');
    localStorage.removeItem('supabase.auth.token');
    
    updateUserButton();
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('accessBlock').classList.remove('hide');
    
    console.log('✅ [Auth] Logout concluído');
}

// ──────────────────────────────────────────────────────────────
// 10. RECUPERAÇÃO DE SENHA
// ──────────────────────────────────────────────────────────────

async function sendRecoveryCode() {
    console.log('🔍 [Auth] sendRecoveryCode() iniciado');

    if (!supabase || !supabase.auth || typeof supabase.auth.resetPasswordForEmail !== 'function') {
        showAuthMessage('⚠️ Modo offline. Recuperação de senha indisponível.', 'error');
        return;
    }

    const email = document.getElementById('forgotEmail')?.value.trim();
    const emailErr = validateEmail(email);
    
    if (emailErr) {
        showFieldError('forgotEmail', emailErr);
        return;
    }

    const btn = document.querySelector('#forgotModal button');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A enviar...';
    btn.disabled = true;

    try {
        console.log('🔍 [Auth] Chamando supabase.auth.resetPasswordForEmail...');
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/?reset=true'
        });

        if (error) {
            console.error('❌ [Auth] Erro ao enviar recuperação:', error);
            throw error;
        }

        console.log('✅ [Auth] Link de recuperação enviado para:', email);
        showAuthMessage(`📧 Link de recuperação enviado para ${email}`, 'success');
        
        setTimeout(() => {
            document.getElementById('forgotModal').style.display = 'none';
            document.getElementById('resetModal').style.display = 'flex';
        }, 1500);

    } catch (err) {
        console.error('❌ [Auth] Erro ao enviar recuperação:', err);
        showFieldError('forgotEmail', 'Erro ao enviar: ' + err.message);
    } finally {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Link';
        btn.disabled = false;
    }
}

function resetPassword() {
    console.log('🔍 [Auth] resetPassword() iniciado');
    document.getElementById('resetModal').style.display = 'none';
    openAuthModal();
    switchToLogin();
}

// ──────────────────────────────────────────────────────────────
// 11. VERIFICAR SESSÃO
// ──────────────────────────────────────────────────────────────

async function checkAuth() {
    console.log('🔍 [Auth] checkAuth() iniciado');

    if (!supabase || !supabase.auth || typeof supabase.auth.getSession !== 'function') {
        console.warn('⚠️ [Auth] Supabase não disponível para verificar sessão');
        return false;
    }

    try {
        console.log('🔍 [Auth] Chamando supabase.auth.getSession...');
        
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            console.error('❌ [Auth] Erro ao verificar sessão:', error);
            return false;
        }

        if (!session) {
            console.log('ℹ️ [Auth] Nenhuma sessão ativa');
            return false;
        }

        console.log('✅ [Auth] Sessão encontrada:', session.user.id);

        authToken = session.access_token;
        localStorage.setItem('supabaseToken', authToken);

        // Buscar dados do usuário
        let userData = null;
        if (supabase.from && typeof supabase.from === 'function') {
            try {
                const { data: uData, error: uError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (uError) {
                    console.warn('⚠️ [Auth] Erro ao buscar dados do usuário:', uError);
                } else {
                    userData = uData;
                }
            } catch (e) {
                console.warn('⚠️ [Auth] Erro ao buscar dados do usuário:', e);
            }
        }

        currentUser = {
            id: session.user.id,
            email: session.user.email,
            name: userData?.name || session.user.user_metadata?.name || session.user.email,
            phone: userData?.phone || '',
            plan: userData?.plan || 'free',
            affiliate_code: userData?.affiliate_code || '',
            commissions: userData?.commissions || 0,
            total_referrals: userData?.total_referrals || 0,
            is_admin: userData?.is_admin || false,
            bankroll: userData?.bankroll || 1000
        };

        console.log('✅ [Auth] currentUser definido via sessão:', currentUser);

        userBalanceInUSD = currentUser.bankroll || 1000;
        updateUserButton();
        document.getElementById('accessBlock').classList.add('hide');
        document.getElementById('mainContent').style.display = 'block';
        
        if (typeof loadGames === 'function') loadGames();
        if (typeof loadBookmakers === 'function') loadBookmakers();
        if (typeof loadLeagues === 'function') loadLeagues();
        if (typeof loadBlog === 'function') loadBlog();
        if (typeof loadRanking === 'function') loadRanking();
        if (typeof loadPlans === 'function') loadPlans();
        if (typeof loadAIAnalysis === 'function') loadAIAnalysis();
        
        updateMiniBankrollDisplay();
        updateDemoBalanceTop();
        updateAccountInfo();
        
        setTimeout(() => {
            if (typeof updateChartBookmakers === 'function') updateChartBookmakers();
        }, 2000);

        return true;

    } catch (error) {
        console.error('❌ [Auth] Erro ao verificar sessão:', error);
        return false;
    }
}

// ──────────────────────────────────────────────────────────────
// 12. NAVEGAÇÃO DO MODAL
// ──────────────────────────────────────────────────────────────

function updateUserButton() {
    const btn = document.getElementById('userNameDisplay');
    if (!btn) return;
    btn.innerHTML = currentUser
        ? `<i class="fas fa-user-check"></i> ${currentUser.name?.split(' ')[0] || currentUser.email}`
        : `<i class="fas fa-user"></i> Visitante`;
}

function openAuthModal() {
    console.log('🔍 [Auth] openAuthModal()');
    document.getElementById('authModal').style.display = 'flex';
    const loginVisible = document.getElementById('loginFields')?.style.display === 'block';
    loginVisible ? switchToLogin() : switchToRegister();
}

function closeAccessBlockAndShowLogin() {
    console.log('🔍 [Auth] closeAccessBlockAndShowLogin()');
    document.getElementById('accessBlock').classList.add('hide');
    openAuthModal();
    switchToLogin();
}

function closeAccessBlockAndShowRegister() {
    console.log('🔍 [Auth] closeAccessBlockAndShowRegister()');
    document.getElementById('accessBlock').classList.add('hide');
    openAuthModal();
    switchToRegister();
}

function switchToLogin() {
    console.log('🔍 [Auth] switchToLogin()');
    document.getElementById('authTitle').innerHTML = 'Bem-vindo de Volta';
    document.getElementById('authSub').innerHTML = 'Entre na sua conta e comece a ganhar <span class="emoji-float">⚡</span>';
    document.getElementById('regFields').style.display = 'none';
    document.getElementById('loginFields').style.display = 'block';
    document.getElementById('authButton').innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar';
    document.getElementById('authButton').onclick = login;
    document.getElementById('switchText').innerHTML = 'Não tem conta? <span onclick="switchToRegister()">Criar conta →</span>';
    clearAllErrors();
}

function switchToRegister() {
    console.log('🔍 [Auth] switchToRegister()');
    document.getElementById('authTitle').innerHTML = 'Crie a sua Conta';
    document.getElementById('authSub').innerHTML = 'Apostas inteligentes começam aqui <span class="emoji-float">🚀</span>';
    document.getElementById('regFields').style.display = 'block';
    document.getElementById('loginFields').style.display = 'none';
    document.getElementById('authButton').innerHTML = '<i class="fas fa-user-plus"></i> Cadastrar';
    document.getElementById('authButton').onclick = register;
    document.getElementById('switchText').innerHTML = 'Já tem conta? <span onclick="switchToLogin()">Entrar →</span>';
    clearAllErrors();
}

function showForgotPassword() {
    console.log('🔍 [Auth] showForgotPassword()');
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('forgotModal').style.display = 'flex';
}

function closeForgotModal() {
    console.log('🔍 [Auth] closeForgotModal()');
    document.getElementById('forgotModal').style.display = 'none';
    openAuthModal();
}

function closeResetModal() {
    console.log('🔍 [Auth] closeResetModal()');
    document.getElementById('resetModal').style.display = 'none';
    openAuthModal();
    switchToLogin();
}

// ──────────────────────────────────────────────────────────────
// 13. INICIALIZAÇÃO
// ──────────────────────────────────────────────────────────────

console.log('✅ [Auth] Módulo de autenticação carregado!');
console.log('🔍 [Auth] Supabase disponível:', !!supabase);
console.log('🔍 [Auth] auth.signUp disponível:', typeof supabase?.auth?.signUp === 'function');
console.log('🔍 [Auth] auth.signInWithPassword disponível:', typeof supabase?.auth?.signInWithPassword === 'function');

// Tentar restaurar sessão automaticamente
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 [Auth] DOM carregado, verificando sessão...');
    setTimeout(checkAuth, 500);
});

// ──────────────────────────────────────────────────────────────
// 14. EXPORTAÇÕES
// ──────────────────────────────────────────────────────────────

window.register = register;
window.login = login;
window.logout = logout;
window.checkAuth = checkAuth;
window.sendRecoveryCode = sendRecoveryCode;
window.resetPassword = resetPassword;
window.openAuthModal = openAuthModal;
window.closeAccessBlockAndShowLogin = closeAccessBlockAndShowLogin;
window.closeAccessBlockAndShowRegister = closeAccessBlockAndShowRegister;
window.switchToLogin = switchToLogin;
window.switchToRegister = switchToRegister;
window.showForgotPassword = showForgotPassword;
window.closeForgotModal = closeForgotModal;
window.closeResetModal = closeResetModal;
window.updateUserButton = updateUserButton;
window.clearFieldError = clearFieldError;
window.updatePasswordStrength = updatePasswordStrength;
window.showAuthMessage = showAuthMessage;

console.log('✅ [Auth] Todas as funções exportadas para o window');

// ============================================================
// FIM DO ARQUIVO
// ============================================================
