// GRÁFICOS PROFISSIONAIS (SIMULADOR)
// ============================================================
function updateChartBookmakers() {
    const bookmakers = allBookmakers.slice(0, bookmakerLimit);
    const total = bookmakers.length;
    if (total === 0) return;
    const perBook = 15; // 15% por casa
    const totalPercent = total * perBook;
    document.getElementById('totalVisualPercent').innerText = totalPercent + '%';
    document.getElementById('bookmakersCount').innerText = total;
    
    const bars = document.querySelectorAll('#chartBookmakers .chart-bar');
    const bookNames = bookmakers.map(b => b.name);
    
    bars.forEach((bar, index) => {
        if (index < total) {
            const fill = bar.querySelector('.bar-fill');
            const value = bar.querySelector('.bar-value');
            const label = bar.querySelector('.bar-label');
            label.textContent = bookNames[index];
            fill.style.width = perBook + '%';
            fill.textContent = perBook + '%';
            value.textContent = perBook + '%';
            bar.style.display = 'flex';
        } else {
            bar.style.display = 'none';
        }
    });
}

// ============================================================
// SELEÇÃO DE JOGOS (SIMULADOR)
// ============================================================
function loadGameSelector() {
    const container = document.getElementById('gameSelectorList');
    if (!container) return;
    if (dailyGames.length === 0) {
        container.innerHTML = '<p style="color:#aaa;">📭 Nenhum jogo disponível para seleção.</p>';
        return;
    }
    selectedGames = [];
    container.innerHTML = dailyGames.map(game => `
        <div class="game-selector-item" data-id="${game.id}" onclick="toggleGameSelect(${game.id})">
            <div class="check-box"><i class="fas fa-check" style="font-size:12px;color:#fff;display:none;"></i></div>
            <div class="game-info">
                <div class="teams">${game.home} vs ${game.away}</div>
                <div class="league">🏆 ${game.league} • ${game.time}</div>
            </div>
            <div style="font-size:12px;color:#00C853;">${game.probHome}%</div>
        </div>
    `).join('');
    updateGameCounter();
}

function toggleGameSelect(gameId) {
    const item = document.querySelector(`.game-selector-item[data-id="${gameId}"]`);
    if (!item) return;
    const check = item.querySelector('.check-box i');
    const idx = selectedGames.indexOf(gameId);
    if (idx > -1) {
        selectedGames.splice(idx, 1);
        item.classList.remove('selected');
        check.style.display = 'none';
    } else {
        selectedGames.push(gameId);
        item.classList.add('selected');
        check.style.display = 'block';
    }
    updateGameCounter();
}

function selectAllGames() {
    const items = document.querySelectorAll('.game-selector-item');
    items.forEach(item => {
        const id = parseInt(item.dataset.id);
        if (!selectedGames.includes(id)) {
            selectedGames.push(id);
            item.classList.add('selected');
            item.querySelector('.check-box i').style.display = 'block';
        }
    });
    updateGameCounter();
}

function deselectAllGames() {
    const items = document.querySelectorAll('.game-selector-item');
    items.forEach(item => {
        const id = parseInt(item.dataset.id);
        const idx = selectedGames.indexOf(id);
        if (idx > -1) {
            selectedGames.splice(idx, 1);
        }
        item.classList.remove('selected');
        item.querySelector('.check-box i').style.display = 'none';
    });
    updateGameCounter();
}

function updateGameCounter() {
    document.getElementById('gamesSelectedCount').innerText = selectedGames.length;
}

function createTicket() {
    if (selectedGames.length === 0) {
        alert('❌ Selecione pelo menos 1 jogo para criar um bilhete!');
        return;
    }
    const games = dailyGames.filter(g => selectedGames.includes(g.id));
    if (games.length === 0) {
        alert('❌ Jogos selecionados não encontrados!');
        return;
    }
    
    // Buscar odds para cada jogo selecionado
    let ticketHtml = '<h3>🎫 Bilhete Criado</h3><div style="margin:10px 0;">';
    let totalOdd = 1;
    games.forEach(game => {
        const odds = fetchMultiBookmakerOdds(game.home, game.away);
        odds.then(oddsData => {
            const bestHome = Math.max(...Object.values(oddsData).map(o => parseFloat(o.home)));
            const bestDraw = Math.max(...Object.values(oddsData).map(o => parseFloat(o.draw)));
            const bestAway = Math.max(...Object.values(oddsData).map(o => parseFloat(o.away)));
            const best = Math.max(bestHome, bestDraw, bestAway);
            const outcome = best === bestHome ? 'Vitória Casa' : (best === bestDraw ? 'Empate' : 'Vitória Fora');
            ticketHtml += `
                <div style="background:rgba(0,0,0,0.1);border-radius:8px;padding:10px;margin:6px 0;border-left:3px solid #00C853;">
                    <div><strong>${game.home}</strong> vs <strong>${game.away}</strong></div>
                    <div style="font-size:13px;color:#88ccff;">${game.league} • ${game.time}</div>
                    <div style="display:flex;gap:15px;margin-top:4px;font-size:13px;">
                        <span>🎯 ${outcome}</span>
                        <span>📊 Odd: ${best.toFixed(2)}</span>
                        <span>📈 Prob: ${game.probHome}%</span>
                    </div>
                </div>
            `;
            totalOdd *= best;
            document.getElementById('ticketResult').innerHTML = ticketHtml + `
                <div style="margin-top:15px;padding:12px;background:rgba(0,200,83,0.05);border-radius:10px;border:1px solid rgba(0,200,83,0.1);">
                    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;">
                        <span><strong>📊 Odd Total:</strong> ${totalOdd.toFixed(2)}</span>
                        <span><strong>🎯 Jogos:</strong> ${games.length}</span>
                        <span><strong>💰 Potencial:</strong> ${formatDemoCurrency(demoBalance * 0.1 * totalOdd)}</span>
                    </div>
                    <button class="btn-pay" style="margin-top:10px;width:100%;" onclick="confirmTicket()">✅ Confirmar Bilhete</button>
                </div>
            </div>`;
        });
    });
    
    // Criar modal temporário para mostrar o bilhete
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width:500px;">
            <div id="ticketResult" style="max-height:400px;overflow-y:auto;">
                <div class="loading"><i class="fas fa-spinner"></i> Montando bilhete...</div>
            </div>
            <button style="margin-top:15px;background:transparent;border:1px solid #00B4D8;border-radius:12px;padding:10px;color:#fff;cursor:pointer;width:100%;" onclick="this.closest('.modal').style.display='none'">Fechar</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function confirmTicket() {
    alert('🎫 Bilhete confirmado! Sua aposta foi registrada com sucesso.');
    // Fechar modal
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

// ============================================================
// SIMULADOR
async function checkPendingSimulations() {
    let updated = false;
    for (let i = 0; i < pendingSimulations.length; i++) {
        const p = pendingSimulations[i];
        const realResult = await fetchRealResult(p.matchId, p.homeTeam, p.awayTeam, p.matchDate);
        if (realResult.hasResult) {
            let isWin = false;
            if (p.selectedOutcome === 'home' && realResult.homeScore > realResult.awayScore) isWin = true;
            else if (p.selectedOutcome === 'away' && realResult.awayScore > realResult.homeScore) isWin = true;
            else if (p.selectedOutcome === 'draw' && realResult.homeScore === realResult.awayScore) isWin = true;
            if (isWin) { demoBalance += p.potentialWin; p.result='win'; p.resultText='GANHOU'; p.profit=p.potentialWin-p.stake; }
            else { p.result='loss'; p.resultText='PERDEU'; p.profit=-p.stake; }
            p.resolved=true; p.score=`${realResult.homeScore}-${realResult.awayScore}`;
            simulatorHistory.unshift(p); pendingSimulations.splice(i,1); updated=true; i--;
        }
    }
    if (updated) { saveSimulatorData(); updateDemoDisplay(); loadSimulatorHistory(); loadPendingBets(); alert('✅ Resultados atualizados!'); }
    else { alert('📭 Nenhum resultado pendente.'); }
}
async function fetchRealResult(matchId, homeTeam, awayTeam, matchDate) {
    try {
        const date = new Date(matchDate).toISOString().split('T')[0];
        const res = await fetch(`${FOOTBALL_API}/eventsday.php?d=${date}&s=Soccer`);
        if (res.ok) {
            const data = await res.json();
            if (data.events) {
                const match = data.events.find(m => (m.strHomeTeam === homeTeam && m.strAwayTeam === awayTeam) || (m.strHomeTeam === awayTeam && m.strAwayTeam === homeTeam));
                if (match && match.intHomeScore !== undefined) return { homeScore: parseInt(match.intHomeScore), awayScore: parseInt(match.intAwayScore), hasResult: true };
            }
        }
    } catch(e) {}
    return { hasResult: false };
}
function saveSimulatorData() { localStorage.setItem('demoBalance', demoBalance); localStorage.setItem('simulatorHistory', JSON.stringify(simulatorHistory)); localStorage.setItem('pendingSimulations', JSON.stringify(pendingSimulations)); }
function loadSimulatorHistory() {
    const container = document.getElementById('simulatorHistoryList');
    if (!container) return;
    const completed = simulatorHistory.filter(h => h.resolved);
    if (completed.length === 0) container.innerHTML = '<p>📭 Nenhuma simulação finalizada.</p>';
    else {
        container.innerHTML = completed.slice(0,20).map(h => `
            <div style="background:rgba(0,200,83,0.1);border-radius:10px;padding:12px;margin-bottom:10px;border-left:3px solid ${h.result==='win'?'#00C853':'#FF3B30'}">
                <div><strong>${h.homeTeam}</strong> vs <strong>${h.awayTeam}</strong> <span style="color:${h.result==='win'?'#00C853':'#FF3B30'}">${h.resultText}</span></div>
                <div>📅 ${h.date} | 🎯 ${h.selectedOutcome} (Odd ${h.odd}) | 💰 Stake: ${formatDemoCurrency(h.stake)}</div>
                <div>📊 Resultado: ${h.score||'?'} - ${h.profit>0 ? `✅ +${formatDemoCurrency(h.profit)}` : `❌ ${formatDemoCurrency(h.profit)}`}</div>
            </div>
        `).join('');
    }
}
function loadPendingBets() {
    const container = document.getElementById('pendingBetsList');
    if (!container) return;
    if (pendingSimulations.length === 0) container.innerHTML = '<p>📭 Nenhuma aposta pendente.</p>';
    else {
        container.innerHTML = pendingSimulations.map(p => `
            <div style="background:rgba(255,193,7,0.1);border-left:3px solid #FFC107;border-radius:10px;padding:12px;margin-bottom:10px;">
                <div><strong>${p.homeTeam}</strong> vs <strong>${p.awayTeam}</strong> <span style="color:#FFC107;">⏳ Pendente</span></div>
                <div>📅 ${p.date} | 🎯 ${p.selectedOutcome} (Odd ${p.odd}) | 💰 Stake: ${formatDemoCurrency(p.stake)}</div>
            </div>
        `).join('');
    }
}
async function loadSimulatorGames() {
    const container = document.getElementById('simulatorGamesList');
    if (!container) return;
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Carregando...</div>';
    const fixtures = await fetchRealGames();
    if (fixtures && fixtures.length > 0) {
        const games = processApiGames(fixtures);
        container.innerHTML = games.map(game => `
            <div class="game-card">
                <div class="team-names"><div class="team-info"><img src="${getTeamLogo(game.home)}" class="team-logo"> ${game.home}</div><span>VS</span><div class="team-info">${game.away} <img src="${getTeamLogo(game.away)}" class="team-logo"></div></div>
                <div class="probability-bar"><div class="probability-fill" style="width:${game.probHome}%">${game.home}: ${game.probHome}%</div></div>
                <div class="probability-bar"><div class="probability-fill" style="width:${game.probDraw}%">Empate: ${game.probDraw}%</div></div>
                <div class="probability-bar"><div class="probability-fill" style="width:${game.probAway}%">${game.away}: ${game.probAway}%</div></div>
                <div style="display:flex;gap:10px;margin-top:10px;">
                    <button class="btn-pay btn-simulate" style="flex:1;" onclick="promptSimulateBet(${game.id},'home')">🏠 ${game.home}</button>
                    <button class="btn-pay btn-simulate" style="flex:1;" onclick="promptSimulateBet(${game.id},'draw')">🤝 Empate</button>
                    <button class="btn-pay btn-simulate" style="flex:1;" onclick="promptSimulateBet(${game.id},'away')">✈️ ${game.away}</button>
                </div>
            </div>
        `).join('');
    } else { container.innerHTML = '<div class="analysis-box"><p>❌ Nenhum jogo disponível.</p></div>'; }
}
function promptSimulateBet(gameId, outcome) {
    const game = dailyGames.find(g => g.id === gameId);
    if (!game) return;
    let odd = outcome === 'home' ? game.probHome/100*2+0.5 : (outcome === 'draw' ? game.probDraw/100*3+1 : game.probAway/100*2+0.5);
    let outcomeName = outcome === 'home' ? `Vitória do ${game.home}` : (outcome === 'draw' ? 'Empate' : `Vitória do ${game.away}`);
    const stake = prompt(`💰 Stake (Saldo: ${formatDemoCurrency(demoBalance)})\nOdd: ${odd.toFixed(2)}\nResultado: ${outcomeName}\nMínimo: 10 ${currencySymbols[userCurrency]}:`);
    if (stake) {
        const val = parseFloat(stake);
        if (isNaN(val) || val < 10) { alert('❌ Valor inválido! Mínimo 10.'); return; }
        const stakeInKZ = convertCurrency(val, userCurrency, 'KZ');
        if (stakeInKZ > demoBalance) { alert(`❌ Saldo insuficiente!`); return; }
        simulateBet(game, outcome, stakeInKZ);
    }
}
async function simulateBet(game, outcome, stake) {
    if (stake > demoBalance) { alert(`❌ Saldo insuficiente!`); return false; }
    let odd = outcome === 'home' ? game.probHome/100*2+0.5 : (outcome === 'draw' ? game.probDraw/100*3+1 : game.probAway/100*2+0.5);
    const potentialWin = stake * odd;
    demoBalance -= stake;
    pendingSimulations.unshift({
        id:Date.now(), date:new Date().toLocaleString(), matchDate:game.rawDate||game.date,
        matchId:game.fixtureId||game.id, homeTeam:game.home, awayTeam:game.away,
        league:game.league, selectedOutcome:outcome,
        odd:odd.toFixed(2), stake, potentialWin,
        result:null, resultText:'PENDENTE', profit:null, resolved:false, score:null
    });
    saveSimulatorData(); updateDemoDisplay(); loadPendingBets();
    alert(`🎮 Aposta registrada!\n💰 Stake: ${formatDemoCurrency(stake)}\n🎯 Odd: ${odd.toFixed(2)}`);
    return true;
}

// ============================================================
