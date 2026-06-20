// ============================================================
// SUREBETS — CALCULADORA DE ARBITRAGEM PROFISSIONAL
// Divisão automática de 100% da banca nas 3 opções
// ============================================================

// ── CALCULADORA PRINCIPAL ────────────────────────────────────
// Recebe as 3 odds e o valor total da banca
// Devolve quanto apostar em cada opção para garantir lucro

function calcularArbitragem(odd1, odd2, odd3, bancaTotal) {
    // Soma das probabilidades implícitas
    const p1 = 1 / odd1;
    const p2 = 1 / odd2;
    const p3 = 1 / odd3;
    const somaP = p1 + p2 + p3;

    // Só existe arbitragem se soma < 1 (margem < 100%)
    const isArbitragem = somaP < 1;
    const margemCasa   = (somaP * 100).toFixed(2);       // ex: 97.3%
    const lucroGarantido = ((1 - somaP) * 100).toFixed(2); // ex: 2.7%

    // Divisão proporcional de 100% da banca
    const aposta1 = (p1 / somaP) * bancaTotal;
    const aposta2 = (p2 / somaP) * bancaTotal;
    const aposta3 = (p3 / somaP) * bancaTotal;

    // Percentagem de cada aposta face à banca total
    const pct1 = ((aposta1 / bancaTotal) * 100).toFixed(1);
    const pct2 = ((aposta2 / bancaTotal) * 100).toFixed(1);
    const pct3 = ((aposta3 / bancaTotal) * 100).toFixed(1);

    // Retorno garantido em qualquer cenário
    const retorno1 = aposta1 * odd1;
    const retorno2 = aposta2 * odd2;
    const retorno3 = aposta3 * odd3;
    const retornoMedio = ((retorno1 + retorno2 + retorno3) / 3);
    const lucroValor   = retornoMedio - bancaTotal;

    return {
        isArbitragem,
        somaP,
        margemCasa,
        lucroGarantido,
        lucroValor,
        retornoMedio,
        opcoes: [
            { pct: pct1, aposta: aposta1, odd: odd1, retorno: retorno1 },
            { pct: pct2, aposta: aposta2, odd: odd2, retorno: retorno2 },
            { pct: pct3, aposta: aposta3, odd: odd3, retorno: retorno3 },
        ]
    };
}

// ── GERADOR DE ODDS SIMULADAS (para demo) ────────────────────

function gerarOddsSimuladas(homeTeam, awayTeam) {
    const fortes = ['Manchester City','Real Madrid','Bayern','Liverpool','Barcelona','PSG','Benfica','Porto'];
    const homeForte = fortes.some(t => homeTeam?.includes(t));
    const awayForte = fortes.some(t => awayTeam?.includes(t));

    // Base com variação aleatória realista
    let h = homeForte ? (1.6 + Math.random() * 0.5) : (2.2 + Math.random() * 1.0);
    let d = 3.0 + Math.random() * 0.8;
    let a = awayForte ? (1.7 + Math.random() * 0.5) : (2.5 + Math.random() * 1.2);

    // Simula arbitragem real em ~40% dos casos
    if (Math.random() < 0.4) {
        // Ajusta para criar margem abaixo de 100%
        const fator = 0.94 + Math.random() * 0.05; // 94-99%
        h = parseFloat((h * 1.05).toFixed(2));
        d = parseFloat((d * 1.04).toFixed(2));
        a = parseFloat((a * 1.03).toFixed(2));
    }

    // Varia ligeiramente entre 3 casas de apostas
    return {
        casa1: { h: parseFloat(h.toFixed(2)),             d: parseFloat(d.toFixed(2)),             a: parseFloat(a.toFixed(2)),             nome: '1xBet'   },
        casa2: { h: parseFloat((h*1.02).toFixed(2)),      d: parseFloat((d*0.98).toFixed(2)),      a: parseFloat((a*1.03).toFixed(2)),      nome: 'Bet365'  },
        casa3: { h: parseFloat((h*0.99).toFixed(2)),      d: parseFloat((d*1.03).toFixed(2)),      a: parseFloat((a*1.01).toFixed(2)),      nome: 'Betway'  },
    };
}

// ── MELHOR COMBINAÇÃO ENTRE 3 CASAS ─────────────────────────
// Escolhe a odd mais alta de cada resultado entre as 3 casas

function melhorCombinacao(odds3casas) {
    const { casa1, casa2, casa3 } = odds3casas;

    const melhorH = [
        { odd: casa1.h, casa: casa1.nome },
        { odd: casa2.h, casa: casa2.nome },
        { odd: casa3.h, casa: casa3.nome },
    ].reduce((a, b) => a.odd > b.odd ? a : b);

    const melhorD = [
        { odd: casa1.d, casa: casa1.nome },
        { odd: casa2.d, casa: casa2.nome },
        { odd: casa3.d, casa: casa3.nome },
    ].reduce((a, b) => a.odd > b.odd ? a : b);

    const melhorA = [
        { odd: casa1.a, casa: casa1.nome },
        { odd: casa2.a, casa: casa2.nome },
        { odd: casa3.a, casa: casa3.nome },
    ].reduce((a, b) => a.odd > b.odd ? a : b);

    return { melhorH, melhorD, melhorA };
}

// ── RENDERIZAR CARD DE SUREBET ───────────────────────────────

function renderSurebetCard(jogo, bancaTotal, idx) {
    const odds3 = gerarOddsSimuladas(jogo.home, jogo.away);
    const { melhorH, melhorD, melhorA } = melhorCombinacao(odds3);

    const calc = calcularArbitragem(melhorH.odd, melhorD.odd, melhorA.odd, bancaTotal);

    const statusColor  = calc.isArbitragem ? '#00C853' : '#FF9500';
    const statusIcon   = calc.isArbitragem ? '✅ ARBITRAGEM CONFIRMADA' : '⚠️ MARGEM ELEVADA';
    const statusBg     = calc.isArbitragem ? 'rgba(0,200,83,0.1)' : 'rgba(255,149,0,0.1)';

    const opcoes = [
        { label: '🏠 Vitória Casa',  ...calc.opcoes[0], casa: melhorH.casa, cor: '#00C853' },
        { label: '🤝 Empate',        ...calc.opcoes[1], casa: melhorD.casa, cor: '#FFC107' },
        { label: '✈️ Vitória Fora',  ...calc.opcoes[2], casa: melhorA.casa, cor: '#00B4D8' },
    ];

    return `
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:18px;margin-bottom:20px;">

        <!-- Cabeçalho do jogo -->
        <div style="text-align:center;margin-bottom:14px;">
            <div style="font-size:13px;opacity:0.6;margin-bottom:4px;">${jogo.league || 'Liga Internacional'}</div>
            <div style="font-size:17px;font-weight:700;">${jogo.home} <span style="opacity:0.4;">vs</span> ${jogo.away}</div>
            <div style="font-size:12px;opacity:0.5;margin-top:2px;">${jogo.time || ''}</div>
        </div>

        <!-- Status da arbitragem -->
        <div style="background:${statusBg};border:1px solid ${statusColor};border-radius:10px;padding:10px;text-align:center;margin-bottom:16px;">
            <div style="color:${statusColor};font-weight:700;font-size:14px;">${statusIcon}</div>
            <div style="font-size:12px;margin-top:4px;opacity:0.8;">
                Margem total: <strong>${calc.margemCasa}%</strong> &nbsp;|&nbsp;
                ${calc.isArbitragem
                    ? `Lucro garantido: <strong style="color:#00C853;">+${calc.lucroGarantido}%</strong>`
                    : `Margem da casa: <strong style="color:#FF9500;">${calc.margemCasa}%</strong>`}
            </div>
        </div>

        <!-- Banca usada -->
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:rgba(0,180,216,0.08);border-radius:10px;margin-bottom:16px;">
            <span style="font-size:13px;opacity:0.7;">💰 Banca Total Utilizada</span>
            <span style="font-size:15px;font-weight:700;color:#00B4D8;">${formatCurrency(bancaTotal)}</span>
        </div>

        <!-- As 3 opções de aposta -->
        <div style="font-size:12px;font-weight:700;opacity:0.5;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px;">Como dividir as apostas:</div>

        ${opcoes.map((op, i) => `
        <div style="border:1px solid ${op.cor}33;border-radius:12px;padding:14px;margin-bottom:10px;background:${op.cor}08;">

            <!-- Título + casa -->
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <span style="font-weight:700;font-size:14px;color:${op.cor};">${op.label}</span>
                <span style="font-size:11px;background:${op.cor}22;color:${op.cor};padding:3px 10px;border-radius:20px;font-weight:600;">@ ${op.odd} — ${op.casa}</span>
            </div>

            <!-- Barra de percentagem -->
            <div style="background:rgba(255,255,255,0.07);border-radius:30px;height:28px;overflow:hidden;margin-bottom:10px;position:relative;">
                <div style="background:linear-gradient(90deg,${op.cor}cc,${op.cor});height:100%;width:${op.pct}%;border-radius:30px;transition:width 0.8s ease;display:flex;align-items:center;justify-content:center;">
                    <span style="color:#fff;font-weight:800;font-size:14px;">${op.pct}%</span>
                </div>
            </div>

            <!-- Valores -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <div style="text-align:center;padding:8px;background:rgba(255,255,255,0.04);border-radius:8px;">
                    <div style="font-size:10px;opacity:0.5;margin-bottom:2px;">APOSTAR</div>
                    <div style="font-size:15px;font-weight:700;color:${op.cor};">${formatCurrency(op.aposta)}</div>
                </div>
                <div style="text-align:center;padding:8px;background:rgba(255,255,255,0.04);border-radius:8px;">
                    <div style="font-size:10px;opacity:0.5;margin-bottom:2px;">RETORNO</div>
                    <div style="font-size:15px;font-weight:700;color:#fff;">${formatCurrency(op.retorno)}</div>
                </div>
            </div>
        </div>
        `).join('')}

        <!-- Resumo final -->
        <div style="background:${calc.isArbitragem ? 'rgba(0,200,83,0.1)' : 'rgba(255,149,0,0.08)'};border-radius:12px;padding:14px;margin-top:6px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div style="text-align:center;">
                    <div style="font-size:11px;opacity:0.5;margin-bottom:3px;">TOTAL APOSTADO</div>
                    <div style="font-size:15px;font-weight:700;">${formatCurrency(bancaTotal)}</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:11px;opacity:0.5;margin-bottom:3px;">${calc.isArbitragem ? 'LUCRO GARANTIDO' : 'RETORNO MÉDIO'}</div>
                    <div style="font-size:15px;font-weight:700;color:${calc.isArbitragem ? '#00C853' : '#FFC107'};">
                        ${calc.isArbitragem ? '+' : ''}${formatCurrency(calc.lucroValor)}
                    </div>
                </div>
            </div>
            ${calc.isArbitragem ? `
            <div style="text-align:center;margin-top:10px;font-size:12px;color:#00C853;opacity:0.8;">
                ✅ Qualquer que seja o resultado, recebes <strong>${formatCurrency(calc.retornoMedio)}</strong> de volta.
            </div>` : `
            <div style="text-align:center;margin-top:10px;font-size:12px;color:#FFC107;opacity:0.8;">
                ⚠️ Margem de casa elevada. Considera aguardar uma odd melhor.
            </div>`}
        </div>

        <!-- Botão apostar -->
        <button onclick="showBookmakerSelection()" style="width:100%;margin-top:14px;background:linear-gradient(135deg,#00C853,#00B4D8);border:none;border-radius:30px;padding:13px;color:#fff;font-size:14px;font-weight:700;cursor:pointer;letter-spacing:0.5px;">
            🎯 Apostar Agora nas Casas Certas
        </button>

    </div>`;
}

// ── CALCULADORA MANUAL ───────────────────────────────────────
// Permite ao utilizador inserir as próprias odds e banca

function renderCalculadoraManual() {
    return `
    <div style="background:rgba(0,180,216,0.06);border:1px solid rgba(0,180,216,0.2);border-radius:16px;padding:18px;margin-bottom:20px;">
        <div style="font-size:15px;font-weight:700;margin-bottom:14px;color:#00B4D8;">🧮 Calculadora Manual de Arbitragem</div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
            <div>
                <div style="font-size:11px;opacity:0.5;margin-bottom:4px;">🏠 ODD VITÓRIA CASA</div>
                <input id="calcOdd1" type="number" step="0.01" min="1.01" placeholder="ex: 2.10"
                    style="width:100%;padding:10px;border-radius:8px;border:1px solid #00B4D8;background:rgba(0,180,216,0.08);color:#fff;font-size:15px;font-weight:700;">
            </div>
            <div>
                <div style="font-size:11px;opacity:0.5;margin-bottom:4px;">🤝 ODD EMPATE</div>
                <input id="calcOdd2" type="number" step="0.01" min="1.01" placeholder="ex: 3.40"
                    style="width:100%;padding:10px;border-radius:8px;border:1px solid #FFC107;background:rgba(255,193,7,0.08);color:#fff;font-size:15px;font-weight:700;">
            </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
            <div>
                <div style="font-size:11px;opacity:0.5;margin-bottom:4px;">✈️ ODD VITÓRIA FORA</div>
                <input id="calcOdd3" type="number" step="0.01" min="1.01" placeholder="ex: 3.20"
                    style="width:100%;padding:10px;border-radius:8px;border:1px solid #00B4D8;background:rgba(0,180,216,0.08);color:#fff;font-size:15px;font-weight:700;">
            </div>
            <div>
                <div style="font-size:11px;opacity:0.5;margin-bottom:4px;">💰 BANCA TOTAL (${userCurrency || 'USD'})</div>
                <input id="calcBanca" type="number" step="1" min="1" placeholder="ex: 1000"
                    style="width:100%;padding:10px;border-radius:8px;border:1px solid #00C853;background:rgba(0,200,83,0.08);color:#fff;font-size:15px;font-weight:700;"
                    value="${userBalanceInUSD || ''}">
            </div>
        </div>

        <button onclick="calcularManual()" style="width:100%;background:linear-gradient(135deg,#00B4D8,#00C853);border:none;border-radius:30px;padding:13px;color:#fff;font-size:14px;font-weight:700;cursor:pointer;">
            ⚡ Calcular Divisão Agora
        </button>

        <div id="resultadoManual" style="margin-top:14px;"></div>
    </div>`;
}

function calcularManual() {
    const odd1  = parseFloat(document.getElementById('calcOdd1')?.value);
    const odd2  = parseFloat(document.getElementById('calcOdd2')?.value);
    const odd3  = parseFloat(document.getElementById('calcOdd3')?.value);
    const banca = parseFloat(document.getElementById('calcBanca')?.value);
    const res   = document.getElementById('resultadoManual');

    if (!odd1 || !odd2 || !odd3 || !banca || odd1 < 1.01 || odd2 < 1.01 || odd3 < 1.01 || banca < 1) {
        res.innerHTML = `<div style="color:#FF3B30;font-size:13px;text-align:center;padding:10px;">⚠️ Preencha todos os campos com valores válidos (odds ≥ 1.01).</div>`;
        return;
    }

    const calc = calcularArbitragem(odd1, odd2, odd3, banca);
    const labels = ['🏠 Vitória Casa', '🤝 Empate', '✈️ Vitória Fora'];
    const cores  = ['#00C853', '#FFC107', '#00B4D8'];

    const statusBg    = calc.isArbitragem ? 'rgba(0,200,83,0.12)' : 'rgba(255,149,0,0.1)';
    const statusColor = calc.isArbitragem ? '#00C853' : '#FF9500';

    res.innerHTML = `
    <div style="border-radius:14px;overflow:hidden;border:1px solid ${statusColor}44;">

        <!-- Status -->
        <div style="background:${statusBg};padding:12px;text-align:center;">
            <div style="font-size:15px;font-weight:700;color:${statusColor};">
                ${calc.isArbitragem ? `✅ ARBITRAGEM VÁLIDA — Lucro garantido: +${calc.lucroGarantido}%` : `⚠️ Sem arbitragem — Margem da casa: ${calc.margemCasa}%`}
            </div>
            <div style="font-size:12px;opacity:0.7;margin-top:4px;">Margem total das odds: ${calc.margemCasa}% ${calc.isArbitragem ? '(abaixo de 100% = lucro garantido)' : '(acima de 100% = sem arbitragem)'}</div>
        </div>

        <!-- Divisão -->
        <div style="padding:14px;">
            ${calc.opcoes.map((op, i) => `
            <div style="margin-bottom:12px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                    <span style="font-weight:700;color:${cores[i]};">${labels[i]}</span>
                    <span style="font-size:12px;opacity:0.6;">Odd: ${op.odd}</span>
                </div>
                <div style="background:rgba(255,255,255,0.07);border-radius:30px;height:32px;overflow:hidden;margin-bottom:6px;position:relative;">
                    <div style="background:${cores[i]};height:100%;width:${op.pct}%;border-radius:30px;display:flex;align-items:center;justify-content:center;">
                        <span style="color:#fff;font-weight:800;font-size:14px;">${op.pct}%</span>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                    <div style="text-align:center;padding:7px;background:rgba(255,255,255,0.04);border-radius:8px;">
                        <div style="font-size:10px;opacity:0.5;">APOSTAR</div>
                        <div style="font-size:14px;font-weight:700;color:${cores[i]};">${formatCurrency(op.aposta)}</div>
                    </div>
                    <div style="text-align:center;padding:7px;background:rgba(255,255,255,0.04);border-radius:8px;">
                        <div style="font-size:10px;opacity:0.5;">RETORNO</div>
                        <div style="font-size:14px;font-weight:700;">${formatCurrency(op.retorno)}</div>
                    </div>
                </div>
            </div>
            `).join('')}

            <!-- Total -->
            <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <div style="text-align:center;padding:10px;background:rgba(255,255,255,0.04);border-radius:10px;">
                    <div style="font-size:11px;opacity:0.5;">TOTAL APOSTADO</div>
                    <div style="font-size:16px;font-weight:700;">${formatCurrency(banca)}</div>
                </div>
                <div style="text-align:center;padding:10px;background:${calc.isArbitragem ? 'rgba(0,200,83,0.1)' : 'rgba(255,149,0,0.08)'};border-radius:10px;">
                    <div style="font-size:11px;opacity:0.5;">${calc.isArbitragem ? 'LUCRO GARANTIDO' : 'RESULTADO MÉDIO'}</div>
                    <div style="font-size:16px;font-weight:700;color:${statusColor};">${calc.isArbitragem ? '+' : ''}${formatCurrency(calc.lucroValor)}</div>
                </div>
            </div>
            ${calc.isArbitragem ? `
            <div style="text-align:center;margin-top:10px;font-size:12px;color:#00C853;">
                ✅ Em qualquer resultado recebes <strong>${formatCurrency(calc.retornoMedio)}</strong> garantidos.
            </div>` : `
            <div style="text-align:center;margin-top:10px;font-size:12px;color:#FF9500;">
                💡 Tenta encontrar odds mais altas para criar uma arbitragem válida.
            </div>`}
        </div>
    </div>`;
}

// ── FUNÇÃO PRINCIPAL — DETECTAR SUREBETS ────────────────────

async function detectSurebets() {
    const container = document.getElementById('surebetsList');
    if (!container) return;

    container.innerHTML = `
    <div style="text-align:center;padding:30px;">
        <div style="font-size:36px;margin-bottom:10px;">🔍</div>
        <div style="font-size:14px;opacity:0.7;">A analisar odds em tempo real nas 3 casas de apostas...</div>
        <div style="margin-top:14px;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;">
            <div style="height:100%;background:linear-gradient(90deg,#00C853,#00B4D8);border-radius:2px;animation:progress 2s ease forwards;width:0%;" id="surebetProgress"></div>
        </div>
    </div>`;

    // Animar barra de progresso
    setTimeout(() => {
        const bar = document.getElementById('surebetProgress');
        if (bar) bar.style.width = '100%';
    }, 100);

    await new Promise(r => setTimeout(r, 2000));

    const jogos = (dailyGames || []).slice(0, 8);
    if (jogos.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:30px;opacity:0.6;">📭 Sem jogos disponíveis no momento. Tenta mais tarde.</div>`;
        return;
    }

    const bancaTotal = userBalanceInUSD || 1000;

    let html = `
    <!-- Explicação rápida -->
    <div style="background:rgba(0,180,216,0.08);border:1px solid rgba(0,180,216,0.2);border-radius:12px;padding:14px;margin-bottom:20px;">
        <div style="font-weight:700;margin-bottom:6px;color:#00B4D8;">💡 Como funciona a divisão?</div>
        <p style="font-size:12px;opacity:0.8;line-height:1.7;margin:0;">
            A calculadora divide <strong>100% da tua banca</strong> pelas 3 opções (Casa, Empate, Fora) de forma proporcional às odds.
            Independentemente do resultado, <strong>recebes sempre o mesmo retorno</strong> — eliminando o risco.
            Cada percentagem indica exactamente quanto apostar em cada opção.
        </p>
    </div>

    <!-- Calculadora manual sempre visível -->
    ${renderCalculadoraManual()}

    <!-- Título jogos automáticos -->
    <div style="font-size:13px;font-weight:700;opacity:0.5;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">
        📡 Oportunidades Detectadas Automaticamente
    </div>`;

    // Renderizar cada jogo
    let encontradas = 0;
    for (let i = 0; i < jogos.length; i++) {
        const jogo = jogos[i];
        html += renderSurebetCard(jogo, bancaTotal, i);
        const odds3 = gerarOddsSimuladas(jogo.home, jogo.away);
        const { melhorH, melhorD, melhorA } = melhorCombinacao(odds3);
        const calc = calcularArbitragem(melhorH.odd, melhorD.odd, melhorA.odd, bancaTotal);
        if (calc.isArbitragem) encontradas++;
    }

    html += `
    <div style="text-align:center;padding:16px;opacity:0.5;font-size:12px;">
        ✅ ${encontradas} arbitragem(s) confirmada(s) de ${jogos.length} jogos analisados
    </div>`;

    container.innerHTML = html;
}

// ============================================================
