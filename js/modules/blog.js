    const newPass = prompt('Nova senha (8+ caracteres):');
    if (newPass && newPass.length >= 8) {
        const { error } = await supabase.auth.updateUser({ password: newPass });
        if (error) { alert('Erro: ' + error.message); } else { alert('✅ Senha alterada! Faça login novamente.'); logout(); }
    } else if (newPass) { alert('Senha fraca! Use 8+ caracteres.'); }
}
function updateWithdrawMessage() {
    const msgDiv = document.getElementById('withdrawMessage');
    if (!msgDiv) return;
    if (currentUser && currentUser.plan !== 'pro') {
        msgDiv.innerHTML = `<div style="background:rgba(255,193,7,0.2);border:1px solid #FFC107;border-radius:10px;padding:12px;"><i class="fas fa-lock"></i> <strong>🔒 Saque bloqueado para FREE</strong><br>Você tem ${(currentUser.commissions||0).toFixed(2)} USD! <a href="#" onclick="showSection('plans'); return false;" style="color:#00C853;">Assine PRO</a> para sacar.</div>`;
    } else if (currentUser && currentUser.plan === 'pro') {
        msgDiv.innerHTML = `<div style="background:rgba(0,200,83,0.2);border:1px solid #00C853;border-radius:10px;padding:12px;"><i class="fas fa-check-circle"></i> <strong>✅ Saques liberados!</strong><br>Você tem ${(currentUser.commissions||0).toFixed(2)} USD disponíveis.</div>`;
    } else { msgDiv.innerHTML = ''; }
}
async function makeWithdraw() {
    if (!currentUser) { alert('Faça login!'); return; }
    if (currentUser.plan !== 'pro') { alert('🔒 Apenas PRO podem sacar!'); showSection('plans'); return; }
    const amount = parseFloat(document.getElementById('withdrawAmount')?.value);
    if (isNaN(amount) || amount <= 0) { alert('Digite um valor válido!'); return; }
    if (amount < 10) { alert('💰 Mínimo: 10 USD'); return; }
    if (amount > (currentUser.commissions||0)) { alert('Saldo insuficiente!'); return; }
    const newCommissions = (currentUser.commissions||0) - amount;
    const { error } = await supabase.from('users').update({ commissions: newCommissions }).eq('id', currentUser.id);
    if (error) { alert('Erro ao solicitar saque: ' + error.message); } else { currentUser.commissions = newCommissions; alert(`✅ Saque de ${amount} USD solicitado!`); document.getElementById('withdrawAmount').value=''; updateAccountInfo(); }
}
async function adminLogin() {
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { alert('❌ Credenciais inválidas!'); return; }
    if (data.user) {
        const { data: userData } = await supabase.from('users').select('is_admin').eq('id', data.user.id).single();
        if (userData?.is_admin) {
            authToken = data.session.access_token; localStorage.setItem('supabaseToken', authToken);
            currentUser = { id: data.user.id, email: data.user.email, name: 'Administrador', is_admin: true };
            document.getElementById('adminLoginPanel').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';
            await loadAdminStats(); await loadAdminUsers();
            alert('✅ Login administrativo realizado!');
        } else { alert('❌ Usuário não tem permissão de admin!'); await supabase.auth.signOut(); }
    }
}
async function loadAdminStats() {
    const { data, error } = await supabase.from('users').select('id, plan, bankroll');
    if (data) {
        document.getElementById('adminTotalUsers').innerText = data.length;
        document.getElementById('adminProUsers').innerText = data.filter(u => u.plan === 'pro').length;
        document.getElementById('adminTotalBankroll').innerText = formatCurrency(data.reduce((sum,u) => sum + (u.bankroll||0), 0));
    }
