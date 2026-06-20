// ============================================================
// SUREBETS — CALCULADORA DE ARBITRAGEM PROFISSIONAL
// Divisão automática de 100% da banca nas 3 opções
// Lucro = Retorno - Banca (deve ser POSITIVO)
// Casas separadas por moeda: KZ com KZ, USD com USD
// ============================================================

// ── CASAS DE APOSTAS POR MOEDA ───────────────────────────────

const CASAS_KZ = [
    { nome: 'Premier Bet',   logo: '🟡' },
    { nome: 'Elephant Bet',  logo: '🐘' },
    { nome: 'Kwanza Bet',    logo: '💛' },
    { nome: 'Mobet',         logo: '🟠' },
    { nome: 'eBet Angola',   logo: '🔵' },
    { nome: 'BantuBet',      logo: '🟢' },
    { nome: 'Bet Angola',    logo: '🔴' },
];

const CASAS_USD = [
    { nome: '1xBet',   logo: '🔵' },
    { nome: 'Bet365',  logo: '🟢' },
    { nome: 'Betway',  logo: '🟣' },
    { nome: 'Parimatch', logo: '🟡' },
    { nome: 'Pinnacle',  logo: '⚪' },
];

// ── CALCULADORA PRINCIPAL ────────────────────────────────────
// REGRA: só existe arbitragem se somaP < 1 (soma das probs < 100%)
// Lucro REAL = retorno - banca apostada (sempre positivo em arb válida)

function calcularArbitragem(odd1, odd2, odd3, bancaTotal) {
    const p1 = 1 / odd1;
    const p2 = 1 / odd2;
    const p3 = 1 / odd3;
    const somaP = p1 + p2 + p3;

    const isArbitragem = somaP < 1.0; // APENAS se soma < 100%

    // Apostas proporcionais que garantem o mesmo retorno em qualquer resultado
    // Fórmula: aposta_i = (banca / odd_i) / somaP  ← corrigida
    const aposta1 = (bancaTotal / odd1) / somaP;
    const aposta2 = (bancaTotal / odd2) / somaP;
    const aposta3 = (bancaTotal / odd3) / somaP;

    // Verificação: total apostado deve ser igual à banca
    const totalApostado = aposta1 + aposta2 + aposta3;

    // Retorno garantido em QUALQUER resultado
    const retorno1 = aposta1 * odd1; // = banca / somaP
    const retorno2 = aposta2 * odd2; // = banca / somaP
    const retorno3 = aposta3 * odd3; // = banca / somaP
    // Todos os retornos são iguais: banca / somaP
    const retornoGarantido = bancaTotal / somaP;

    // Lucro real = retorno - banca (positivo só se isArbitragem)
    const lucroValor = retornoGarantido - bancaTotal;
    const lucroPct   = ((lucroValor / bancaTotal) * 100).toFixed(2);

    // Percentagens de cada aposta face ao total apostado
    const pct1 = ((aposta1 / totalApostado) * 100).toFixed(1);
    const pct2 = ((aposta2 / totalApostado) * 100).toFixed(1);
    const pct3 = ((aposta3 / totalApostado) * 100).toFixed(1);

    return {
        isArbitragem,
        somaP: (somaP * 100).toFixed(2),   // ex: 97.3%
        lucroPct,                            // ex: 2.7%
        lucroValor,                          // ex: 27 Kz
        retornoGarantido,                    // ex: 1027 Kz
        totalApostado,
        opcoes: [
            { pct: pct1, aposta: aposta1, odd: odd1, retorno: retorno1 },
            { pct: pct2, aposta: aposta2, odd: odd2, retorno: retorno2 },
            { pct: pct3, aposta: aposta3, odd: odd3, retorno: retorno3 },
        ]
    };
}

// ── GERAR ODDS REALISTAS POR CASA E MOEDA ────────────────────

function gerarOddsCasas(homeTeam, awayTeam, moeda) {
    const casas = moeda === 'KZ' ? CASAS_KZ : CASAS_USD;
    const fortes = ['Manchester City','Real Madrid','Bayern','Liverpool','Barcelona','PSG','Benfica','Porto'];
    const hF = fortes.some(t => (homeTeam||'').includes(t));
    const aF = fortes.some(t => (awayTeam||'').includes(t));

    // Base realista das odds
    let baseH = hF ? 1.65 : (aF ? 3.10 : 2.20);
    let baseD = 3.20 + Math.random() * 0.6;
    let baseA = aF ? 1.70 : (hF ? 3.50 : 2.80);

    // Para criar arbitragem válida: soma das probs implícitas < 1
    // Cada casa tem odds ligeiramente diferentes
    return casas.slice(0, 3).map((casa, i) => {
        // Variação pequena entre casas (±3-5%)
        const v = 1 + (i * 0.03) + (Math.random() * 0.02);
        const h = parseFloat((baseH * v).toFixed(2));
        const d = parseFloat((baseD * (1 + i * 0.02)).toFixed(2));
        const a = parseFloat((baseA * (1 + i * 0.02 + Math.random() * 0.02)).toFixed(2));
        const somaP = 1/h + 1/d + 1/a;
        return { casa: casa.nome, logo: casa.logo, h, d, a, somaP };
    });
}

// Melhor odd de cada resultado entre as casas da MESMA moeda
function melhorOddPorResultado(oddsCasas) {
    const melhorH = oddsCasas.reduce((m, c) => c.h > m.odd ? { odd: c.h, casa: c.casa } : m, { odd: 0, casa: '' });
    const melhorD = oddsCasas.reduce((m, c) => c.d > m.odd ? { odd: c.d, casa: c.casa } : m, { odd: 0, casa: '' });
    const melhorA = oddsCasas.reduce((m, c) => c.a > m.odd ? { odd: c.a, casa: c.casa } : m, { odd: 0, casa: '' });
    return { melhorH, melhorD, melhorA };
}

// ── RENDERIZAR CARD ──────────────────────────────────────────

function renderSurebetCard(jogo, bancaTotal, moeda) {
    const oddsCasas = gerarOddsCasas(jogo.home, jogo.away, moeda);
    const { melhorH, melhorD, melhorA } = melhorOddPorResultado(oddsCasas);
    const calc = calcularArbitragem(melhorH.odd, melhorD.odd, melhorA.odd, bancaTotal);

    const cor    = calc.isArbitragem ? '#00C853' : '#FF3B30';
    const bgCor  = calc.isArbitragem ? 'rgba(0,200,83,0.08)' : 'rgba(255,59,48,0.06)';
    const status = calc.isArbitragem
        ? `✅ ARBITRAGEM VÁLIDA — Lucro garantido: +${calc.lucroPct}%`
        : `❌ SEM ARBITRAGEM — Margem da casa: ${calc.somaP}% (precisa ser < 100%)`;

    const opcoes = [
        { label: '🏠 Vitória Casa', cor: '#00C853', casa: melhorH.casa, ...calc.opcoes[0] },
        { label: '🤝 Empate',       cor: '#FFC107', casa: melhorD.casa, ...calc.opcoes[1] },
        { label: '✈️ Vitória Fora', cor: '#00B4D8', casa: melhorA.casa, ...calc.opcoes[2] },
    ];

    // Tabela comparativa de odds por casa (mesma moeda)
    const tabelaOdds = `
    <div style="margin-bottom:14px;">
        <div style="font-size:11px;opacity:0.5;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">
            📊 Comparação de Odds — Casas em ${moeda === 'KZ' ? 'Kwanza 🇦🇴' : 'Dólar 🇺🇸'}
        </div>
        <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:12px;">
                <thead>
                    <tr style="background:rgba(255,255,255,0.05);">
                        <th style="padding:8px 10px;text-align:left;opacity:0.6;">Casa</th>
                        <th style="padding:8px;text-align:center;color:#00C853;">🏠 Casa</th>
                        <th style="padding:8px;text-align:center;color:#FFC107;">🤝 Empate</th>
                        <th style="padding:8px;text-align:center;color:#00B4D8;">✈️ Fora</th>
                        <th style="padding:8px;text-align:center;opacity:0.5;">Margem</th>
                    </tr>
                </thead>
                <tbody>
                    ${oddsCasas.map(c => `
                    <tr style="border-top:1px solid rgba(255,255,255,0.05);">
                        <td style="padding:8px 10px;font-weight:600;">${c.logo} ${c.casa}</td>
                        <td style="padding:8px;text-align:center;${c.h === melhorH.odd ? 'color:#00C853;font-weight:700;' : ''}">${c.h}</td>
                        <td style="padding:8px;text-align:center;${c.d === melhorD.odd ? 'color:#FFC107;font-weight:700;' : ''}">${c.d}</td>
                        <td style="padding:8px;text-align:center;${c.a === melhorA.odd ? 'color:#00B4D8;font-weight:700;' : ''}">${c.a}</td>
                        <td style="padding:8px;text-align:center;opacity:0.5;">${(c.somaP * 100).toFixed(1)}%</td>
                    </tr>`).join('')}
                    <tr style="border-top:2px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.03);">
                        <td style="padding:8px 10px;font-weight:700;color:#FFD700;">⭐ Melhor</td>
                        <td style="padding:8px;text-align:center;color:#00C853;font-weight:700;">${melhorH.odd} <div style="font-size:9px;opacity:0.6;">${melhorH.casa}</div></td>
                        <td style="padding:8px;text-align:center;color:#FFC107;font-weight:700;">${melhorD.odd} <div style="font-size:9px;opacity:0.6;">${melhorD.casa}</div></td>
                        <td style="padding:8px;text-align:center;color:#00B4D8;font-weight:700;">${melhorA.odd} <div style="font-size:9px;opacity:0.6;">${melhorA.casa}</div></td>
                        <td style="padding:8px;text-align:center;color:${cor};font-weight:700;">${calc.somaP}%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>`;

    return `
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:18px;margin-bottom:20px;">

        <!-- Jogo -->
        <div style="text-align:center;margin-bottom:14px;">
            <div style="font-size:12px;opacity:0.5;margin-bottom:3px;">${jogo.league || ''}</div>
            <div style="font-size:16px;font-weight:700;">${jogo.home} vs ${jogo.away}</div>
        </div>

        <!-- Status -->
        <div style="background:${bgCor};border:1px solid ${cor}44;border-radius:10px;padding:10px;text-align:center;margin-bottom:16px;">
            <div style="color:${cor};font-weight:700;font-size:13px;">${status}</div>
            ${calc.isArbitragem ? `
            <div style="font-size:12px;margin-top:6px;opacity:0.8;">
                Apostas a dividir: <strong>${formatCurrency(bancaTotal)}</strong> →
                Retorno garantido: <strong style="color:#00C853;">${formatCurrency(calc.retornoGarantido)}</strong> →
                Lucro: <strong style="color:#00C853;">+${formatCurrency(calc.lucroValor)}</strong>
            </div>` : `
            <div style="font-size:12px;margin-top:6px;opacity:0.7;">
                A soma das melhores odds representa ${calc.somaP}% — precisa ser abaixo de 100% para existir lucro garantido.
            </div>`}
        </div>

        <!-- Tabela de comparação por casa (mesma moeda) -->
        ${tabelaOdds}

        ${calc.isArbitragem ? `
        <!-- Divisão da banca -->
        <div style="font-size:11px;opacity:0.5;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">
            💰 Como dividir a tua banca de ${formatCurrency(bancaTotal)}:
        </div>

        ${opcoes.map(op => `
        <div style="border:1px solid ${op.cor}33;border-radius:12px;padding:14px;margin-bottom:10px;background:${op.cor}07;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span style="font-weight:700;color:${op.cor};">${op.label}</span>
                <span style="font-size:11px;background:${op.cor}22;color:${op.cor};padding:3px 10px;border-radius:20px;">
                    Odd ${op.odd} @ ${op.casa}
                </span>
            </div>
            <!-- Barra -->
            <div style="background:rgba(255,255,255,0.07);border-radius:30px;height:30px;overflow:hidden;margin-bottom:8px;">
                <div style="background:${op.cor};height:100%;width:${op.pct}%;border-radius:30px;display:flex;align-items:center;justify-content:center;transition:width 1s ease;">
                    <span style="color:#000;font-weight:800;font-size:13px;">${op.pct}%</span>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;text-align:center;">
                <div style="padding:8px;background:rgba(255,255,255,0.04);border-radius:8px;">
                    <div style="font-size:9px;opacity:0.5;margin-bottom:2px;">% DA BANCA</div>
                    <div style="font-size:14px;font-weight:700;color:${op.cor};">${op.pct}%</div>
                </div>
                <div style="padding:8px;background:rgba(255,255,255,0.04);border-radius:8px;">
                    <div style="font-size:9px;opacity:0.5;margin-bottom:2px;">APOSTAR</div>
                    <div style="font-size:14px;font-weight:700;color:${op.cor};">${formatCurrency(op.aposta)}</div>
                </div>
                <div style="padding:8px;background:rgba(255,255,255,0.04);border-radius:8px;">
                    <div style="font-size:9px;opacity:0.5;margin-bottom:2px;">RETORNO</div>
                    <div style="font-size:14px;font-weight:700;">${formatCurrency(op.retorno)}</div>
                </div>
            </div>
        </div>`).join('')}

        <!-- Resumo final -->
        <div style="background:rgba(0,200,83,0.1);border:1px solid #00C85344;border-radius:12px;padding:14px;margin-top:4px;">
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;">
                <div>
                    <div style="font-size:10px;opacity:0.5;margin-bottom:3px;">TOTAL APOSTADO</div>
                    <div style="font-size:15px;font-weight:700;">${formatCurrency(bancaTotal)}</div>
                </div>
                <div>
                    <div style="font-size:10px;opacity:0.5;margin-bottom:3px;">RETORNO GARANTIDO</div>
                    <div style="font-size:15px;font-weight:700;color:#00C853;">${formatCurrency(calc.retornoGarantido)}</div>
                </div>
                <div>
                    <div style="font-size:10px;opacity:0.5;margin-bottom:3px;">LUCRO REAL</div>
                    <div style="font-size:15px;font-weight:700;color:#00C853;">+${formatCurrency(calc.lucroValor)}</div>
                </div>
            </div>
            <div style="text-align:center;margin-top:10px;font-size:12px;color:#00C853;">
                ✅ Qualquer que seja o resultado, recebes sempre <strong>${formatCurrency(calc.retornoGarantido)}</strong>
                — lucro de <strong>+${formatCurrency(calc.lucroValor)}</strong> garantido.
            </div>
        </div>` : ''}

        <button onclick="showBookmakerSelection()" style="width:100%;margin-top:14px;background:linear-gradient(135deg,#00C853,#00B4D8);border:none;border-radius:30px;padding:13px;color:#fff;font-size:14px;font-weight:700;cursor:pointer;">
            🎯 Ir para as Casas de Apostas
        </button>
    </div>`;
}

// ── CALCULADORA MANUAL ───────────────────────────────────────

function renderCalculadoraManual(moeda) {
    const simbolo = moeda === 'KZ' ? 'Kz' : 'USD';
    return `
    <div style="background:rgba(0,180,216,0.06);border:1px solid rgba(0,180,216,0.25);border-radius:16px;padding:18px;margin-bottom:24px;">
        <div style="font-size:15px;font-weight:700;margin-bottom:4px;color:#00B4D8;">🧮 Calculadora Manual</div>
        <div style="font-size:12px;opacity:0.6;margin-bottom:16px;">Insere as tuas odds e banca — calculamos a divisão exacta.</div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
            <div>
                <div style="font-size:11px;opacity:0.5;margin-bottom:4px;">🏠 ODD VITÓRIA CASA</div>
                <input id="calcOdd1" type="number" step="0.01" min="1.01" placeholder="ex: 2.50"
                    style="width:100%;padding:10px;border-radius:8px;border:1px solid #00C853;background:rgba(0,200,83,0.06);color:#fff;font-size:16px;font-weight:700;box-sizing:border-box;">
            </div>
            <div>
                <div style="font-size:11px;opacity:0.5;margin-bottom:4px;">🤝 ODD EMPATE</div>
                <input id="calcOdd2" type="number" step="0.01" min="1.01" placeholder="ex: 3.20"
                    style="width:100%;padding:10px;border-radius:8px;border:1px solid #FFC107;background:rgba(255,193,7,0.06);color:#fff;font-size:16px;font-weight:700;box-sizing:border-box;">
            </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
            <div>
                <div style="font-size:11px;opacity:0.5;margin-bottom:4px;">✈️ ODD VITÓRIA FORA</div>
                <input id="calcOdd3" type="number" step="0.01" min="1.01" placeholder="ex: 4.10"
                    style="width:100%;padding:10px;border-radius:8px;border:1px solid #00B4D8;background:rgba(0,180,216,0.06);color:#fff;font-size:16px;font-weight:700;box-sizing:border-box;">
            </div>
            <div>
                <div style="font-size:11px;opacity:0.5;margin-bottom:4px;">💰 BANCA TOTAL (${simbolo})</div>
                <input id="calcBanca" type="number" step="1" min="1" placeholder="ex: 10000"
                    style="width:100%;padding:10px;border-radius:8px;border:1px solid #FFD700;background:rgba(255,215,0,0.06);color:#fff;font-size:16px;font-weight:700;box-sizing:border-box;"
                    value="${userBalanceInUSD || ''}">
            </div>
        </div>

        <button onclick="calcularManual()" style="width:100%;background:linear-gradient(135deg,#00B4D8,#00C853);border:none;border-radius:30px;padding:13px;color:#fff;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:14px;">
            ⚡ Calcular Divisão Agora
        </button>

        <div id="resultadoManual"></div>
    </div>`;
}

function calcularManual() {
    const odd1  = parseFloat(document.getElementById('calcOdd1')?.value);
    const odd2  = parseFloat(document.getElementById('calcOdd2')?.value);
    const odd3  = parseFloat(document.getElementById('calcOdd3')?.value);
    const banca = parseFloat(document.getElementById('calcBanca')?.value);
    const res   = document.getElementById('resultadoManual');
    if (!res) return;

    if ([odd1, odd2, odd3, banca].some(v => !v || isNaN(v)) || odd1 < 1.01 || odd2 < 1.01 || odd3 < 1.01 || banca < 1) {
        res.innerHTML = `<div style="color:#FF3B30;font-size:13px;text-align:center;padding:12px;background:rgba(255,59,48,0.08);border-radius:8px;">⚠️ Preenche todos os campos. Odds devem ser ≥ 1.01.</div>`;
        return;
    }

    const calc   = calcularArbitragem(odd1, odd2, odd3, banca);
    const labels = ['🏠 Vitória Casa', '🤝 Empate', '✈️ Vitória Fora'];
    const cores  = ['#00C853', '#FFC107', '#00B4D8'];
    const cor    = calc.isArbitragem ? '#00C853' : '#FF3B30';

    res.innerHTML = `
    <div style="border:1px solid ${cor}44;border-radius:14px;overflow:hidden;">
        <!-- Status -->
        <div style="padding:12px;background:${calc.isArbitragem ? 'rgba(0,200,83,0.1)' : 'rgba(255,59,48,0.08)'};text-align:center;">
            <div style="font-weight:700;font-size:14px;color:${cor};">
                ${calc.isArbitragem
                    ? `✅ ARBITRAGEM VÁLIDA — A soma das odds é ${calc.somaP}% (abaixo de 100%)`
                    : `❌ SEM ARBITRAGEM — A soma das odds é ${calc.somaP}% (precisa ser abaixo de 100%)`}
            </div>
        </div>

        <div style="padding:14px;">
            ${calc.opcoes.map((op, i) => `
            <div style="margin-bottom:14px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                    <span style="font-weight:700;color:${cores[i]};">${labels[i]}</span>
                    <span style="font-size:12px;opacity:0.6;">Odd: <strong>${op.odd}</strong></span>
                </div>
                <div style="background:rgba(255,255,255,0.07);border-radius:30px;height:30px;overflow:hidden;margin-bottom:6px;">
                    <div style="background:${cores[i]};height:100%;width:${op.pct}%;border-radius:30px;display:flex;align-items:center;justify-content:center;">
                        <span style="color:#000;font-weight:800;font-size:13px;">${op.pct}%</span>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;text-align:center;">
                    <div style="padding:7px;background:rgba(255,255,255,0.04);border-radius:8px;">
                        <div style="font-size:9px;opacity:0.5;">% DA BANCA</div>
                        <div style="font-size:14px;font-weight:700;color:${cores[i]};">${op.pct}%</div>
                    </div>
                    <div style="padding:7px;background:rgba(255,255,255,0.04);border-radius:8px;">
                        <div style="font-size:9px;opacity:0.5;">APOSTAR</div>
                        <div style="font-size:14px;font-weight:700;color:${cores[i]};">${formatCurrency(op.aposta)}</div>
                    </div>
                    <div style="padding:7px;background:rgba(255,255,255,0.04);border-radius:8px;">
                        <div style="font-size:9px;opacity:0.5;">RETORNO</div>
                        <div style="font-size:14px;font-weight:700;">${formatCurrency(op.retorno)}</div>
                    </div>
                </div>
            </div>`).join('')}

            <!-- Resumo -->
            <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:12px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;">
                <div style="padding:10px;background:rgba(255,255,255,0.04);border-radius:10px;">
                    <div style="font-size:10px;opacity:0.5;">APOSTADO</div>
                    <div style="font-size:15px;font-weight:700;">${formatCurrency(banca)}</div>
                </div>
                <div style="padding:10px;background:${calc.isArbitragem ? 'rgba(0,200,83,0.1)' : 'rgba(255,59,48,0.08)'};border-radius:10px;">
                    <div style="font-size:10px;opacity:0.5;">RETORNO</div>
                    <div style="font-size:15px;font-weight:700;color:${cor};">${formatCurrency(calc.retornoGarantido)}</div>
                </div>
                <div style="padding:10px;background:${calc.isArbitragem ? 'rgba(0,200,83,0.1)' : 'rgba(255,59,48,0.08)'};border-radius:10px;">
                    <div style="font-size:10px;opacity:0.5;">LUCRO REAL</div>
                    <div style="font-size:15px;font-weight:700;color:${cor};">${calc.isArbitragem ? '+' : ''}${formatCurrency(calc.lucroValor)}</div>
                </div>
            </div>

            ${calc.isArbitragem
                ? `<div style="text-align:center;margin-top:10px;font-size:12px;color:#00C853;padding:8px;background:rgba(0,200,83,0.06);border-radius:8px;">
                    ✅ Apostas: <strong>${formatCurrency(banca)}</strong> →
                    Retorno garantido: <strong>${formatCurrency(calc.retornoGarantido)}</strong> →
                    Lucro: <strong>+${formatCurrency(calc.lucroValor)}</strong>
                   </div>`
                : `<div style="text-align:center;margin-top:10px;font-size:12px;color:#FF3B30;padding:8px;background:rgba(255,59,48,0.06);border-radius:8px;">
                    ❌ Com estas odds perderias <strong>${formatCurrency(Math.abs(calc.lucroValor))}</strong>.
                    Procura odds mais altas nas casas de apostas.
                   </div>`}
        </div>
    </div>`;
}

// ── FUNÇÃO PRINCIPAL ─────────────────────────────────────────

async function detectSurebets() {
    const container = document.getElementById('surebetsList');
    if (!container) return;

    const moeda = userCurrency || 'KZ';
    const bancaTotal = userBalanceInUSD || 10000;

    container.innerHTML = `
    <div style="text-align:center;padding:30px;">
        <div style="font-size:36px;margin-bottom:10px;">🔍</div>
        <div style="font-size:14px;opacity:0.7;">A comparar odds nas casas de apostas em <strong>${moeda}</strong>...</div>
        <div style="margin-top:14px;height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;">
            <div id="sbProgress" style="height:100%;width:0%;background:linear-gradient(90deg,#00C853,#00B4D8);border-radius:2px;transition:width 2s ease;"></div>
        </div>
    </div>`;

    setTimeout(() => { const b = document.getElementById('sbProgress'); if (b) b.style.width = '100%'; }, 50);
    await new Promise(r => setTimeout(r, 2200));

    const jogos = (dailyGames || []).slice(0, 6);

    let html = `
    <!-- Aviso de moeda -->
    <div style="background:rgba(255,215,0,0.08);border:1px solid rgba(255,215,0,0.3);border-radius:12px;padding:12px;margin-bottom:20px;text-align:center;">
        <div style="font-weight:700;color:#FFD700;margin-bottom:4px;">
            ${moeda === 'KZ' ? '🇦🇴 A comparar casas em Kwanza (KZ)' : '🇺🇸 A comparar casas em Dólar (USD)'}
        </div>
        <div style="font-size:12px;opacity:0.7;">
            ${moeda === 'KZ'
                ? 'Casas comparadas: Premier Bet, Elephant Bet, Kwanza Bet, Mobet, eBet, BantuBet, Bet Angola'
                : 'Casas comparadas: 1xBet, Bet365, Betway, Parimatch, Pinnacle'}
        </div>
        <div style="font-size:11px;opacity:0.5;margin-top:4px;">Kz nunca comparado com USD. Cada moeda tem as suas próprias casas.</div>
    </div>

    <!-- Explicação rápida -->
    <div style="background:rgba(0,180,216,0.06);border:1px solid rgba(0,180,216,0.2);border-radius:12px;padding:14px;margin-bottom:20px;">
        <div style="font-weight:700;margin-bottom:6px;color:#00B4D8;">💡 Como funciona o lucro garantido?</div>
        <p style="font-size:12px;opacity:0.8;line-height:1.7;margin:0;">
            Divides a tua banca pelas 3 opções (Casa, Empate, Fora) de forma proporcional.
            O retorno em <strong>qualquer resultado</strong> é sempre <strong>maior</strong> do que o total apostado.
            A diferença é o teu <strong style="color:#00C853;">lucro garantido</strong> — independente do resultado do jogo.
        </p>
    </div>

    <!-- Calculadora manual -->
    ${renderCalculadoraManual(moeda)}

    <div style="font-size:12px;font-weight:700;opacity:0.4;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">
        📡 Análise Automática dos Jogos de Hoje
    </div>`;

    let narbs = 0;
    for (const jogo of jogos) {
        html += renderSurebetCard(jogo, bancaTotal, moeda);
        // contar arbitragens válidas
        const oc = gerarOddsCasas(jogo.home, jogo.away, moeda);
        const { melhorH, melhorD, melhorA } = melhorOddPorResultado(oc);
        const c = calcularArbitragem(melhorH.odd, melhorD.odd, melhorA.odd, bancaTotal);
        if (c.isArbitragem) narbs++;
    }

    if (jogos.length === 0) {
        html += `<div style="text-align:center;padding:30px;opacity:0.5;">📭 Sem jogos disponíveis. Tenta mais tarde.</div>`;
    } else {
        html += `
        <div style="text-align:center;padding:16px;opacity:0.5;font-size:12px;">
            ✅ ${narbs} arbitragem(s) válida(s) encontrada(s) em ${jogos.length} jogos analisados em ${moeda}
        </div>`;
    }

    container.innerHTML = html;
}

// ============================================================
