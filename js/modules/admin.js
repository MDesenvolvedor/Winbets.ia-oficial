// ADMIN, BLOG, RANKING
// ============================================================
async function loadRanking() {
    const container = document.getElementById('rankingList');
    if (!container) return;
    const { data, error } = await supabase.from('users').select('name, commissions, total_referrals').order('commissions', { ascending: false }).limit(50);
    if (error) { container.innerHTML = '<p>Erro ao carregar ranking</p>'; return; }
    if (data && data.length > 0) {
        container.innerHTML = data.map((user, i) => `<div class="analysis-box"><p><strong>${i+1}º</strong> ${user.name} - 💰 ${(user.commissions||0).toLocaleString()} USD | ${user.total_referrals||0} indicações</p></div>`).join('');
    } else { container.innerHTML = '<p>Nenhum afiliado ainda</p>'; }
}
async function loadBlog() {
    const container = document.getElementById('blogPosts');
    if (!container) return;
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Carregando posts...</div>';
    const { data, error } = await supabase.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false }).limit(50);
    if (error) { container.innerHTML = '<p>Erro ao carregar posts</p>'; return; }
    if (data && data.length > 0) {
        container.innerHTML = data.map(post => `
            <div class="analysis-box">
                <h3>📝 ${escapeHtml(post.title)}</h3>
                <p>${escapeHtml(post.content)}</p>
                <small>📅 ${new Date(post.created_at).toLocaleString()}</small>
                ${currentUser && currentUser.is_admin ? `<div style="margin-top:10px;"><button class="btn-pay" style="background:#FF3B30;padding:5px 10px;font-size:12px;" onclick="deleteBlogPost(${post.id})">🗑️ Excluir</button></div>` : ''}
            </div>
        `).join('');
    } else { container.innerHTML = '<p>📝 Nenhum post ainda.</p>'; }
}
async function publishBlogPost() {
    if (!currentUser || !currentUser.is_admin) { alert('Apenas administradores podem publicar!'); return; }
    const title = document.getElementById('blogTitle')?.value.trim();
    const content = document.getElementById('blogContent')?.value.trim();
    if (!title || !content) { alert('Preencha título e conteúdo!'); return; }
    const { error } = await supabase.from('blog_posts').insert([{ title, content, author_id: currentUser.id, published: true }]);
    if (error) { alert('Erro ao publicar: ' + error.message); } else { document.getElementById('blogTitle').value=''; document.getElementById('blogContent').value=''; alert('✅ Post publicado!'); loadBlog(); }
}
async function deleteBlogPost(postId) {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', postId);
    if (error) { alert('Erro ao excluir: ' + error.message); } else { alert('✅ Post excluído!'); loadBlog(); }
}
async function updateAccountInfo() {
    const container = document.getElementById('accountInfo');
    if (container && currentUser) {
        container.innerHTML = `
            <p>👤 Nome: ${currentUser.name}</p>
            <p>📧 E-mail: ${currentUser.email}</p>
            <p>📱 Telefone: ${currentUser.phone||'Não informado'}</p>
            <p>⭐ Plano: ${currentUser.plan==='pro'?'PRO ⭐':'Grátis'}</p>
            <p>💰 Banca: ${formatCurrency(userBalanceInUSD)}</p>
            <p>🔗 Código: <span style="color:#00C853">${currentUser.affiliate_code||'Gerando...'}</span></p>
            <p>💰 Comissões: ${(currentUser.commissions||0).toFixed(2)} USD</p>
            <button class="btn-pay" onclick="showSection('plans')">⬆️ Upgrade PRO</button>
            <button class="btn-pay" onclick="changePassword()">🔐 Alterar Senha</button>
        `;
        document.getElementById('affiliateLink').innerHTML = `${window.location.origin}/?ref=${currentUser.affiliate_code||''}`;
        document.getElementById('affiliateCommissions').innerHTML = currentUser.commissions||0;
        document.getElementById('affiliateReferrals').innerHTML = currentUser.total_referrals||0;
    }
    updateWithdrawMessage();
}
async function changePassword() {
    if (!currentUser) { alert('Faça login!'); return; }

    const newPass = prompt('Nova senha (mín. 8 caracteres):');
    if (!newPass || newPass.length < 8) { alert('Senha inválida!'); return; }
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) { alert('Erro: ' + error.message); } else { alert('✅ Senha alterada com sucesso!'); }
}
// ============================================================
