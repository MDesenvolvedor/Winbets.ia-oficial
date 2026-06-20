function showSection(section) {
    const sections = ['home','analysis','account','deposit','withdraw','bookmakers','leagues','agendaFuturo','mybets','ai','stats','plans','affiliates','ranking','faq','blog','help','policies','surebets','todayGames','simulator'];
    sections.forEach(s => { const el = document.getElementById(s + 'Section'); if(el) el.style.display = 'none'; });
    const target = document.getElementById(section + 'Section');
    if (target) {
        target.style.display = 'block';
        if (section === 'account') updateAccountInfo();
        if (section === 'bookmakers') loadBookmakers();
        if (section === 'leagues') loadLeagues();
        if (section === 'agendaFuturo') loadFutureGames();
        if (section === 'mybets') loadMyBets();
        if (section === 'ai') loadAIAnalysis();
        if (section === 'blog') loadBlog();
        if (section === 'ranking') loadRanking();
        if (section === 'plans') loadPlans();
        if (section === 'surebets') detectSurebets();
        if (section === 'todayGames') loadTodayGames();
        if (section === 'simulator') { updateDemoDisplay(); loadSimulatorGames(); loadSimulatorHistory(); loadPendingBets(); loadGameSelector(); setTimeout(updateChartBookmakers, 500); }
    } else if (section === 'home') { document.getElementById('homeSection').style.display = 'block'; loadGames(); }
    toggleMenu();
}
async function loadFutureGames() {
    const container = document.getElementById('futureGamesList');
    if (!container) return;
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Carregando...</div>';
    try {
        const res = await fetch(`${FOOTBALL_API}/eventsnextleague.php?id=4328`);
        if (res.ok) {
            const data = await res.json();
            if (data.events && data.events.length > 0) {
                allFutureGames = processApiGames(data.events);
                displayFilteredFutureGames(allFutureGames);
            } else { container.innerHTML = '<div class="analysis-box"><p>❌ Nenhum jogo futuro.</p></div>'; }
        } else { throw new Error(); }
    } catch(e) { container.innerHTML = '<div class="analysis-box"><p>❌ Erro ao carregar jogos futuros.</p></div>'; }
}
function displayFilteredFutureGames(games) {
    const container = document.getElementById('futureGamesList');
    if (!container) return;
    if (games.length === 0) { container.innerHTML = '<div class="analysis-box"><p>📭 Nenhum jogo.</p></div>'; return; }
    const grouped = {};
    games.forEach(g => { const d = g.date || 'Data a definir'; if (!grouped[d]) grouped[d] = []; grouped[d].push(g); });
    let html = '';
    for (const [date, list] of Object.entries(grouped)) {
        html += `<div style="margin:20px 0 10px;"><h3 style="color:#00C853;"><i class="fas fa-calendar-day"></i> ${date}</h3></div><div class="games-grid">`;
        list.forEach(game => {
            html += `<div class="game-card" onclick="showAnalysis(${game.id})"><div class="team-names"><div class="team-info"><img src="${getTeamLogo(game.home)}" class="team-logo"> ${game.home}</div><span>VS</span><div class="team-info">${game.away} <img src="${getTeamLogo(game.away)}" class="team-logo"></div></div><div class="probability-bar"><div class="probability-fill" style="width:${game.probHome}%">${game.home}: ${game.probHome}%</div></div><div class="probability-bar"><div class="probability-fill" style="width:${game.probDraw}%">Empate: ${game.probDraw}%</div></div><div class="probability-bar"><div class="probability-fill" style="width:${game.probAway}%">${game.away}: ${game.probAway}%</div></div><div><span>🏆 ${game.league}</span><span>⏰ ${game.time}</span></div><div style="display:flex;gap:10px;margin-top:10px;"><button class="btn-pay" style="flex:1;" onclick="event.stopPropagation();showAnalysis(${game.id})">📊 Análise</button><button class="btn-pay btn-valuebet" style="flex:1;" onclick="event.stopPropagation();showAdvancedAnalysis(${game.id})">🧠 Ensemble</button></div></div>`;
        });
        html += `</div>`;
    }
    container.innerHTML = html;
}
function filterFutureGamesByDate(filter) {
    const today = new Date(); today.setHours(0,0,0,0);
    let filtered = [...allFutureGames];
    if (filter === 'week') { const later = new Date(today); later.setDate(today.getDate()+7); filtered = allFutureGames.filter(g => { const d = new Date(g.rawDate||g.date); d.setHours(0,0,0,0); return d >= today && d <= later; }); }
    else if (filter === '15days') { const later = new Date(today); later.setDate(today.getDate()+15); filtered = allFutureGames.filter(g => { const d = new Date(g.rawDate||g.date); d.setHours(0,0,0,0); return d >= today && d <= later; }); }
    else if (filter === '30days') { const later = new Date(today); later.setDate(today.getDate()+30); filtered = allFutureGames.filter(g => { const d = new Date(g.rawDate||g.date); d.setHours(0,0,0,0); return d >= today && d <= later; }); }
    displayFilteredFutureGames(filtered);
}
function filterFutureGamesByDatePicker() {
    const picker = document.getElementById('futureDatePicker');
    if (!picker || !picker.value) return;
    const selected = new Date(picker.value); selected.setHours(0,0,0,0);
    const filtered = allFutureGames.filter(g => { const d = new Date(g.rawDate||g.date); d.setHours(0,0,0,0); return d.getTime() === selected.getTime(); });
    displayFilteredFutureGames(filtered);
    if (filtered.length === 0) alert(`📭 Nenhum jogo para ${picker.value}`);
}

