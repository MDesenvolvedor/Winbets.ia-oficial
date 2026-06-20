// ============================================================
// AUTENTICAÇÃO — WIN BETS
// Validações completas e profissionais
// ============================================================

// ── VALIDADORES ─────────────────────────────────────────────

function validateName(name) {
    if (!name || name.trim().length < 3)
        return 'O nome deve ter pelo menos 3 caracteres.';
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name))
        return 'O nome só pode conter letras e espaços.';
    return null;
}

function validatePhone(phone) {
    // Aceita formatos nacionais e internacionais
    // Ex: 927224260 | +244927224260 | +55 11 91234-5678 | +1 (800) 555-0199
    const cleaned = phone.replace(/[\s\-().]/g, '');
    if (!/^\+?[0-9]{7,15}$/.test(cleaned))
        return 'Número inválido. Use formato nacional (927224260) ou internacional (+244927224260).';
    return null;
}

function validateEmail(email) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return 'E-mail inválido.';
    return null;
}

function validateEmailConfirm(email, emailConfirm) {
    if (email !== emailConfirm)
        return 'Os e-mails não coincidem.';
    return null;
}

function validatePassword(password) {
    if (!password || password.length < 8)
        return 'A senha deve ter pelo menos 8 caracteres.';
    if (!/[A-Z]/.test(password))
        return 'A senha deve ter pelo menos uma letra maiúscula.';
    if (!/[a-z]/.test(password))
        return 'A senha deve ter pelo menos uma letra minúscula.';
    if (!/[0-9]/.test(password))
        return 'A senha deve ter pelo menos um número.';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
        return 'A senha deve ter pelo menos um caractere especial (!@#$%...).';
    return null;
}

function validatePasswordConfirm(password, confirm) {
    if (password !== confirm)
        return 'As senhas não coincidem.';
    return null;
}

// ── MOSTRAR ERROS NO FORMULÁRIO ──────────────────────────────

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.style.borderColor = '#FF3B30';
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
    const err = field.parentNode.querySelector('.field-error');
    if (err) err.remove();
}

function clearAllErrors() {
    ['regName','regPhone','regEmail','regEmailConfirm','regPassword','regConfirmPassword'].forEach(clearFieldError);
}

// ── FORÇA DA SENHA (indicador visual) ───────────────────────

function updatePasswordStrength(password) {
    let indicator = document.getElementById('passwordStrength');
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

// ── CADASTRO ─────────────────────────────────────────────────

async function register() {
    clearAllErrors();

    const name         = document.getElementById('regName')?.value.trim();
    const phone        = document.getElementById('regPhone')?.value.trim();
    const email        = document.getElementById('regEmail')?.value.trim();
    const emailConfirm = document.getElementById('regEmailConfirm')?.value.trim();
    const password     = document.getElementById('regPassword')?.value;
    const confirm      = document.getElementById('regConfirmPassword')?.value;

    // Validar todos os campos
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

    if (hasError) return;

    // Botão de loading
    const btn = document.getElementById('authButton');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A criar conta...';
    btn.disabled = true;

    try {
        const affiliateCode = Math.random().toString(36).substring(2, 10).toUpperCase();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name, phone } }
        });

        if (error) throw error;

        if (data.user) {
            await supabase.from('users').insert([{
                id: data.user.id,
                name,
                email,
                phone,
                affiliate_code: affiliateCode,
                bankroll: 1000,
                demo_balance: 50000
            }]);
        }

        showAuthMessage('✅ Conta criada! Verifique o seu e-mail para confirmar.', 'success');
        setTimeout(() => { switchToLogin(); showGreeting(true); }, 2500);

    } catch (err) {
        if (err.message.includes('already registered'))
            showFieldError('regEmail', 'Este e-mail já está registado.');
        else
            showAuthMessage('❌ Erro: ' + err.message, 'error');
    } finally {
        btn.innerHTML = '<i class="fas fa-user-plus"></i> Cadastrar';
        btn.disabled = false;
    }
}

// ── LOGIN ────────────────────────────────────────────────────

async function login() {
    const identifier = document.getElementById('loginIdentifier')?.value.trim();
    const password   = document.getElementById('loginPassword')?.value;

    if (!identifier || !password) {
        showAuthMessage('❌ Preencha todos os campos.', 'error');
        return;
    }

    const btn = document.getElementById('authButton');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A entrar...';
    btn.disabled = true;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: identifier,
            password
        });

        if (error) throw error;

        if (data.user) {
            authToken = data.session.access_token;
            localStorage.setItem('supabaseToken', authToken);

            const { data: userData } = await supabase
                .from('users').select('*')
                .eq('id', data.user.id).single();

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
        if (err.message.includes('Invalid login'))
            showAuthMessage('❌ E-mail ou senha incorretos.', 'error');
        else if (err.message.includes('Email not confirmed'))
            showAuthMessage('⚠️ Confirme o seu e-mail antes de entrar.', 'error');
        else
            showAuthMessage('❌ Erro: ' + err.message, 'error');
    } finally {
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar';
        btn.disabled = false;
    }
}

// ── LOGOUT ───────────────────────────────────────────────────

async function logout() {
    await supabase.auth.signOut();
    currentUser = null;
    authToken = null;
    localStorage.removeItem('supabaseToken');
    updateUserButton();
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('accessBlock').classList.remove('hide');
}

// ── RECUPERAÇÃO DE SENHA ─────────────────────────────────────

async function sendRecoveryCode() {
    const email = document.getElementById('forgotEmail')?.value.trim();
    const emailErr = validateEmail(email);
    if (emailErr) { showFieldError('forgotEmail', emailErr); return; }

    const btn = document.querySelector('#forgotModal button');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> A enviar...';
    btn.disabled = true;

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin
        });
        if (error) throw error;
        showAuthMessage(`📧 Link de recuperação enviado para ${email}`, 'success');
        setTimeout(() => {
            document.getElementById('forgotModal').style.display = 'none';
            document.getElementById('resetModal').style.display = 'flex';
        }, 1500);
    } catch (err) {
        showFieldError('forgotEmail', 'Erro ao enviar: ' + err.message);
    } finally {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Link';
        btn.disabled = false;
    }
}

function resetPassword() {
    document.getElementById('resetModal').style.display = 'none';
    openAuthModal();
    switchToLogin();
}

// ── MENSAGEM DE FEEDBACK NO MODAL ────────────────────────────

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
    setTimeout(() => { if (el) el.style.display = 'none'; }, 4000);
}

// ── VERIFICAR SESSÃO ─────────────────────────────────────────

async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        authToken = session.access_token;
        localStorage.setItem('supabaseToken', authToken);

        const { data: userData } = await supabase
            .from('users').select('*')
            .eq('id', session.user.id).single();

        currentUser = {
            id: session.user.id,
            email: session.user.email,
            name: userData?.name || session.user.user_metadata?.name || session.user.email,
            phone: userData?.phone || '',
            plan: userData?.plan || 'free',
            affiliate_code: userData?.affiliate_code || '',
            commissions: userData?.commissions || 0,
            total_referrals: userData?.total_referrals || 0,
            is_admin: userData?.plan === 'admin',
            bankroll: userData?.bankroll || 1000
        };

        userBalanceInUSD = currentUser.bankroll;
        updateUserButton();
        document.getElementById('accessBlock').classList.add('hide');
        document.getElementById('mainContent').style.display = 'block';
        loadGames(); loadBookmakers(); loadLeagues();
        loadBlog(); loadRanking(); loadPlans(); loadAIAnalysis();
        updateMiniBankrollDisplay(); updateDemoBalanceTop(); updateAccountInfo();
        setTimeout(() => { updateChartBookmakers(); }, 2000);
        return true;
    }
    return false;
}

// ── NAVEGAÇÃO DO MODAL ───────────────────────────────────────

function updateUserButton() {
    const btn = document.getElementById('userNameDisplay');
    if (!btn) return;
    btn.innerHTML = currentUser
        ? `<i class="fas fa-user-check"></i> ${currentUser.name?.split(' ')[0] || currentUser.email}`
        : `<i class="fas fa-user"></i> Visitante`;
}

function openAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
    const loginVisible = document.getElementById('loginFields')?.style.display === 'block';
    loginVisible ? switchToLogin() : switchToRegister();
}

function closeAccessBlockAndShowLogin()    { document.getElementById('accessBlock').classList.add('hide'); openAuthModal(); switchToLogin(); }
function closeAccessBlockAndShowRegister() { document.getElementById('accessBlock').classList.add('hide'); openAuthModal(); switchToRegister(); }

function switchToLogin() {
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
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('forgotModal').style.display = 'flex';
}
function closeForgotModal() { document.getElementById('forgotModal').style.display = 'none'; openAuthModal(); }
function closeResetModal()  { document.getElementById('resetModal').style.display = 'none'; openAuthModal(); switchToLogin(); }

// ============================================================
