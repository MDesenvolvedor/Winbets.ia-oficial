async function loadAdminUsers() {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (data) {
        const tbody = document.getElementById('adminUsersList');
        tbody.innerHTML = data.map(u => `
            <tr>
                <td>${u.name||'—'}</td>
                <td>${u.email}</td>
                <td><span class="status-badge ${u.plan==='pro'?'status-active':''}">${u.plan==='pro'?'PRO':'FREE'}</span></td>
                <td><span class="status-badge ${u.is_banned?'status-banned':'status-active'}">${u.is_banned?'Banido':'Ativo'}</span></td>
                <td><button onclick="toggleUserPlan('${u.id}')">⭐</button><button onclick="toggleUserBan('${u.id}')">${u.is_banned?'🔓':'🔒'}</button></td>
            </tr>
        `).join('');
    }
}
async function toggleUserPlan(userId) {
    const { data: user } = await supabase.from('users').select('plan').eq('id', userId).single();
    const newPlan = user?.plan === 'pro' ? 'free' : 'pro';
    const { error } = await supabase.from('users').update({ plan: newPlan }).eq('id', userId);
    if (error) { alert('Erro ao alterar plano'); } else { alert('Plano alterado!'); loadAdminUsers(); loadAdminStats(); }
}
async function toggleUserBan(userId) {
    const { data: user } = await supabase.from('users').select('is_banned').eq('id', userId).single();
    const newStatus = !user?.is_banned;
    const { error } = await supabase.from('users').update({ is_banned: newStatus }).eq('id', userId);
    if (error) { alert('Erro ao alterar status'); } else { alert(newStatus ? 'Usuário banido!' : 'Usuário desbanido!'); loadAdminUsers(); }
}
function copyReferralLink() {
    if (!currentUser) { alert('Faça login!'); return; }
    navigator.clipboard.writeText(`${window.location.origin}/?ref=${currentUser.affiliate_code||''}`);
    alert('Link copiado!');
}
function resetSystem() {
    if (confirm('⚠️ Limpar dados locais do navegador?')) {
        localStorage.clear();
        alert('Dados locais limpos. A página será recarregada.');
        location.reload();
    }
}
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================================
