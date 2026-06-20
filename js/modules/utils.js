// DEMAIS FUNÇÕES (SIMULADOR, ADMIN, BLOG, RANKING)
// ============================================================
function loadAIAnalysis() {
    const container = document.getElementById('aiAnalysis');
    const todayGames = dailyGames.slice(0, 15);
    if (todayGames.length === 0) { container.innerHTML = '<p>⚠️ Nenhum jogo disponível.</p>'; return; }
    container.innerHTML = `<h3>🤖 50 Equipas Analisadas Hoje</h3><div class="games-grid">${todayGames.map(game => `
        <div class="game-card" onclick="showAnalysis(${game.id})">
            <div class="team-names"><div class="team-info"><img src="${getTeamLogo(game.home)}" class="team-logo"> ${game.home}</div><span>VS</span><div class="team-info">${game.away} <img src="${getTeamLogo(game.away)}" class="team-logo"></div></div>
            <div class="probability-bar"><div class="probability-fill" style="width:${game.probHome}%">${game.home}: ${game.probHome}%</div></div>
            <div class="probability-bar"><div class="probability-fill" style="width:${game.probDraw}%">Empate: ${game.probDraw}%</div></div>
            <div class="probability-bar"><div class="probability-fill" style="width:${game.probAway}%">${game.away}: ${game.probAway}%</div></div>
        </div>
    `).join('')}</div><button class="btn-pay" onclick="loadMoreAIGames()" style="width:100%;">Ver mais →</button>`;
}
function loadMoreAIGames() {
    const more = dailyGames.slice(15, 30);
    const container = document.getElementById('aiAnalysis');
    container.innerHTML += `<div class="games-grid">${more.map(game => `
        <div class="game-card" onclick="showAnalysis(${game.id})">
            <div class="team-names"><div class="team-info"><img src="${getTeamLogo(game.home)}" class="team-logo"> ${game.home}</div><span>VS</span><div class="team-info">${game.away} <img src="${getTeamLogo(game.away)}" class="team-logo"></div></div>
            <div class="probability-bar"><div class="probability-fill" style="width:${game.probHome}%">${game.home}: ${game.probHome}%</div></div>
            <div class="probability-bar"><div class="probability-fill" style="width:${game.probDraw}%">Empate: ${game.probDraw}%</div></div>
            <div class="probability-bar"><div class="probability-fill" style="width:${game.probAway}%">${game.away}: ${game.probAway}%</div></div>
        </div>
    `).join('')}</div><p>📊 Total de 30 jogos analisados</p>`;
}
function loadMyBets() { document.getElementById('myBetsList').innerHTML = '<p>📭 Nenhum bilhete ainda.</p>'; }

