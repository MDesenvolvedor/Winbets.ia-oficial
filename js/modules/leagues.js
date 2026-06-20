// LEAGUES
// ============================================================
let currentLeagueLimit = 40, currentLeagueFilter = 'all';
function loadLeagues() {
    const allLeagues = [
        { name:"🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League", country:"Inglaterra", teams:20, continent:"europe", importance:10 },
        { name:"🇪🇸 La Liga", country:"Espanha", teams:20, continent:"europe", importance:10 },
        { name:"🇮🇹 Serie A", country:"Itália", teams:20, continent:"europe", importance:10 },
        { name:"🇩🇪 Bundesliga", country:"Alemanha", teams:18, continent:"europe", importance:10 },
        { name:"🇫🇷 Ligue 1", country:"França", teams:18, continent:"europe", importance:9 },
        { name:"🇵🇹 Primeira Liga", country:"Portugal", teams:18, continent:"europe", importance:9 },
        { name:"🇦🇴 Girabola", country:"Angola", teams:16, continent:"africa", importance:7 },
        { name:"🇧🇷 Brasileirão", country:"Brasil", teams:20, continent:"southAmerica", importance:10 },
        { name:"🇦🇷 Liga Profesional", country:"Argentina", teams:28, continent:"southAmerica", importance:10 },
        { name:"🇺🇸 MLS", country:"EUA", teams:29, continent:"northAmerica", importance:9 },
        { name:"🏆 UEFA Champions League", country:"Europa", teams:32, continent:"international", importance:10 }
    ];
    const container = document.getElementById('leaguesList');
    if (!container) return;
    let filtered = allLeagues;
    if (currentLeagueFilter !== 'all') filtered = allLeagues.filter(l => l.continent === currentLeagueFilter);
    filtered.sort((a,b) => (b.importance||0) - (a.importance||0));
    const limited = filtered.slice(0, currentLeagueLimit);
    let html = `<div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px;justify-content:center;">
        <button class="filter-btn ${currentLeagueFilter==='all'?'active-filter':''}" onclick="setLeagueFilter('all')">🌍 Todas</button>
        <button class="filter-btn ${currentLeagueFilter==='europe'?'active-filter':''}" onclick="setLeagueFilter('europe')">🇪🇺 Europa</button>
        <button class="filter-btn ${currentLeagueFilter==='southAmerica'?'active-filter':''}" onclick="setLeagueFilter('southAmerica')">🇧🇷 América do Sul</button>
        <button class="filter-btn ${currentLeagueFilter==='northAmerica'?'active-filter':''}" onclick="setLeagueFilter('northAmerica')">🇺🇸 América do Norte</button>
        <button class="filter-btn ${currentLeagueFilter==='africa'?'active-filter':''}" onclick="setLeagueFilter('africa')">🇿🇦 África</button>
        <button class="filter-btn ${currentLeagueFilter==='international'?'active-filter':''}" onclick="setLeagueFilter('international')">🏆 Internacionais</button>
    </div><div class="games-grid">`;
    limited.forEach(league => {
        html += `<div class="league-card" onclick="filterGamesByLeague('${league.name}')"><h3>🏆 ${league.name}</h3><p>📍 ${league.country} • ${league.teams} equipas</p><button class="btn-pay" onclick="event.stopPropagation();filterGamesByLeague('${league.name}')">Ver Jogos</button></div>`;
    });
    html += `</div>`;
    if (filtered.length > currentLeagueLimit) html += `<div style="text-align:center;margin-top:20px;"><button class="btn-pay" onclick="loadMoreLeagues()">Ver mais →</button></div>`;
    container.innerHTML = html;
    document.getElementById('statTotalLeagues').innerText = allLeagues.length;
}
function setLeagueFilter(filter) { currentLeagueFilter = filter; currentLeagueLimit = 40; loadLeagues(); }
function loadMoreLeagues() { currentLeagueLimit += 40; loadLeagues(); }
async function filterGamesByLeague(leagueName) {
    showSection('home');
    const container = document.getElementById('gamesList');
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Carregando...</div>';
    try {
        const today = new Date().toISOString().split('T')[0];
        const res = await fetch(`${FOOTBALL_API}/eventsday.php?d=${today}&s=Soccer`);
        if (res.ok) {
            const data = await res.json();
            if (data.events) {
                const filtered = data.events.filter(f => f.strLeague?.toLowerCase().includes(leagueName.toLowerCase()));
                if (filtered.length > 0) { dailyGames = processApiGames(filtered); loadGames(); alert(`📅 ${filtered.length} jogos da ${leagueName}`); return; }
            }
        }
        alert(`⚠️ Nenhum jogo encontrado para ${leagueName}`);
        loadGames();
    } catch(e) { alert('Erro ao carregar jogos'); loadGames(); }
}

// ============================================================
