// ============================================================
// SISTEMA DE SAUDAÇÕES PERSONALIZADAS — WIN BETS
// Mensagens dinâmicas por hora, dia, plano e perfil
// ============================================================

const GREETINGS = {

    // ── Por hora do dia ──────────────────────────────────────
    timeOfDay: (name) => {
        const hour = new Date().getHours();
        if (hour >= 5  && hour < 12) return { text: `Bom Dia, ${name}! ☀️`,        emoji: '🌅' };
        if (hour >= 12 && hour < 15) return { text: `Boa Tarde, ${name}! 🌤️`,      emoji: '☀️' };
        if (hour >= 15 && hour < 18) return { text: `Boa Tarde, ${name}! ⚽`,       emoji: '🏟️' };
        if (hour >= 18 && hour < 21) return { text: `Boa Noite, ${name}! 🌆`,       emoji: '🌆' };
        return                              { text: `Olá, ${name}! Ainda acordado?`, emoji: '🌙' };
    },

    // ── Por dia da semana ────────────────────────────────────
    dayOfWeek: (name) => {
        const days = {
            0: `${name}, domingo é dia de analisar os jogos da semana com calma. 📋`,
            1: `${name}, nova semana, novas oportunidades! Vamos começar forte. 💼`,
            2: `${name}, terça-feira de futebol europeu. A IA já analisou os jogos! 🔥`,
            3: `${name}, é quarta! Dia de Champions League. Não percas as análises. ⚽`,
            4: `${name}, quinta de Europa League. Verifica as surebets de hoje. 🎯`,
            5: `${name}, sexta-feira! O fim de semana de futebol começa agora. 🎉`,
            6: `${name}, sábado é dia de grandes ligas. Tens o teu bilhete pronto? 🏟️`,
        };
        return days[new Date().getDay()];
    },

    // ── Por plano ────────────────────────────────────────────
    byPlan: (name, plan) => {
        const messages = {
            free: [
                `${name}, estás no plano Free. Faz upgrade PRO e desbloqueia as 31 APIs! 🚀`,
                `${name}, utilizadores PRO têm 3x mais lucro. Experimenta hoje! 💎`,
                `${name}, o plano PRO dá-te acesso ao IA Ensemble com 97-99% de precisão. 🧠`,
            ],
            pro: [
                `${name}, és PRO! Tens acesso total às 31 APIs e IA Ensemble. Aproveita! ⭐`,
                `${name}, o teu plano PRO está activo. Usa o detector de arbitragens hoje! 🎯`,
                `${name}, PRO activo! Não te esqueças de gerir a tua banca com Kelly. 💰`,
            ],
            vip: [
                `${name}, conta VIP activa! Tu és um dos nossos melhores apostadores. 👑`,
                `${name}, VIP em força! As melhores análises do dia já estão disponíveis. 🌟`,
                `${name}, como VIP tens prioridade nas análises. Boas apostas hoje! 🏆`,
            ],
            admin: [
                `${name}, sessão de administrador iniciada. Tudo sob controlo! 🔐`,
                `${name}, bem-vindo ao painel admin. O sistema está operacional. ✅`,
            ],
        };
        const list = messages[plan] || messages.free;
        return list[Math.floor(Math.random() * list.length)];
    },

    // ── Motivacionais gerais (com nome) ──────────────────────
    motivational: (name) => {
        const phrases = [
            // Estratégia e dados
            `${name}, a inteligência vence a sorte. Apostas com dados valem mais. 📊`,
            `${name}, quem analisa antes de apostar, lucra mais a longo prazo. 🧠`,
            `${name}, a nossa IA analisou mais de 210 ligas para ti hoje. Aproveita! 🌍`,
            `${name}, consistência é a chave — aposta com estratégia, não com emoção. 💡`,
            `${name}, os melhores apostadores usam dados. Tu também podes. 🔥`,
            `${name}, cada aposta inteligente é um passo para o topo do ranking. 🏆`,
            `${name}, ROI positivo não é sorte — é método. Nós temos o método. 📈`,
            `${name}, já experimentaste o detector de arbitragens hoje? 🎲`,
            `${name}, gere a tua banca com o Critério de Kelly e maximiza os lucros. 💰`,
            `${name}, pequenas apostas consistentes constroem grandes carteiras. 📐`,
            `${name}, o sucesso nas apostas começa com uma análise honesta. ✅`,
            `${name}, hoje pode ser o teu melhor dia — as análises estão prontas! 🌟`,
            `${name}, disciplina + dados + paciência = lucro consistente. 🎯`,
            `${name}, verifica as estatísticas reais antes de apostares. 16 métricas disponíveis! 📉`,
            // Frases solicitadas
            `${name}, o sucesso é a soma de pequenos esforços feitos dia após dia. 💪`,
            `${name}, convida amigos e recebe a tua recompensa no primeiro plano PRO que eles activarem! 🎁`,
            // Constância e fidelidade à plataforma
            `${name}, cada dia que analisas é um dia que te aproximas do lucro real. 📅`,
            `${name}, os grandes apostadores não param — eles aprendem, ajustam e continuam. 🔄`,
            `${name}, a tua presença diária na plataforma faz diferença nos resultados. 📌`,
            `${name}, não és apenas um utilizador — és um apostador inteligente em crescimento. 🌱`,
            `${name}, a regularidade bate o talento quando o talento não é regular. ⚡`,
            `${name}, cada análise que fazes hoje é um investimento no teu amanhã. 🔮`,
            `${name}, quem nunca falta à análise diária raramente falta ao lucro mensal. 📆`,
            `${name}, mantém o ritmo — os resultados aparecem para quem não desiste. 🏃`,
            `${name}, um passo por dia leva-te mais longe do que dez passos uma vez por semana. 👣`,
            // Comunidade e afiliados
            `${name}, partilha o teu link de afiliado e ganha 10% de comissão para sempre. 🤝`,
            `${name}, a tua rede cresce quando partilhas o que funciona. Convida alguém hoje! 👥`,
            `${name}, cada amigo que convidas é uma comissão garantida no futuro. 💸`,
            `${name}, os melhores do ranking têm uma coisa em comum: partilham a plataforma. 🥇`,
            // Confiança e motivação
            `${name}, a WIN BETS está aqui todos os dias — e tu também deves estar. 🏠`,
            `${name}, apostas bem analisadas não são apostas — são investimentos. 💼`,
            `${name}, o teu próximo grande ganho começa com a análise de hoje. 🎯`,
            `${name}, campeões não esperam pela motivação — eles constroem o hábito. 🏋️`,
            `${name}, a diferença entre ganhar e perder está na preparação. Prepara-te aqui. 📚`,
        ];
        return phrases[Math.floor(Math.random() * phrases.length)];
    },

    // ── Pós-cadastro (primeira vez) ──────────────────────────
    welcome: (name) => {
        const phrases = [
            `Bem-vindo à família WIN BETS, ${name}! 🎉 A tua jornada inteligente começa agora.`,
            `${name}, é um prazer tê-lo connosco! 🏆 Explora as análises da IA e começa a ganhar.`,
            `Conta criada com sucesso, ${name}! 🚀 Estás agora entre os apostadores mais inteligentes.`,
            `${name}, bem-vindo! 🌟 A WIN BETS tem 31 APIs a trabalhar para ti a partir de agora.`,
            `${name}, és o mais recente membro da nossa comunidade! 🎊 Começa pelo simulador gratuito.`,
            `Que honra tê-lo connosco, ${name}! 💎 Analisa, aposta com inteligência e cresce connosco.`,
            `${name}, a tua conta está activa! ⚡ Convida amigos e começa já a ganhar comissões de 10%.`,
        ];
        return phrases[Math.floor(Math.random() * phrases.length)];
    },

    // ── Retorno (login) ──────────────────────────────────────
    returning: (name) => {
        const phrases = [
            `${name}, que bom tê-lo de volta! 😊 Os jogos de hoje já foram analisados.`,
            `De volta, ${name}! 🔥 A IA esteve a trabalhar enquanto estavas fora.`,
            `${name}, bem-vindo de volta! 💪 Novos jogos, novas oportunidades.`,
            `Sentimos a tua falta, ${name}! 🌟 Há novas análises prontas para ti.`,
            `${name}, voltaste na hora certa! ⚽ Grandes jogos hoje.`,
            `${name}, a consistência é o teu maior activo — e tu voltaste! 🔄`,
            `Olá de novo, ${name}! 👋 O teu painel está actualizado com os últimos jogos.`,
            `${name}, cada login é um passo a mais rumo ao topo do ranking. Vamos lá! 🏆`,
            `${name}, bem-vindo! A tua banca e os teus bilhetes estão à tua espera. 💰`,
            `${name}, voltaste! O sucesso é a soma de pequenos esforços feitos dia após dia. 💪`,
        ];
        return phrases[Math.floor(Math.random() * phrases.length)];
    },
};

// ── FUNÇÃO PRINCIPAL ─────────────────────────────────────────

function showGreeting(isNewUser = false) {
    if (!currentUser) return;

    const name  = currentUser.name?.split(' ')[0] || 'Campeão';
    const plan  = currentUser.plan || 'free';
    const hour  = new Date().getHours();

    const timeData   = GREETINGS.timeOfDay(name);
    const dayMsg     = GREETINGS.dayOfWeek(name);
    const planMsg    = GREETINGS.byPlan(name, plan);
    const motivation = GREETINGS.motivational(name);
    const mainMsg    = isNewUser
        ? GREETINGS.welcome(name)
        : GREETINGS.returning(name);

    // Badge por plano
    const planBadges = {
        free:  { label: 'FREE',  color: '#888' },
        pro:   { label: 'PRO',   color: '#00B4D8' },
        vip:   { label: 'VIP',   color: '#FFD700' },
        admin: { label: 'ADMIN', color: '#FF6B35' },
    };
    const badge = planBadges[plan] || planBadges.free;

    const msg = document.getElementById('greetingMessage');
    if (!msg) return;

    msg.innerHTML = `
        <div style="position:relative; padding:4px;">

            <!-- Fechar -->
            <div onclick="closeGreeting()" style="position:absolute;top:-4px;right:-4px;cursor:pointer;opacity:0.5;font-size:16px;line-height:1;">✕</div>

            <!-- Hora + badge -->
            <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:8px;">
                <span style="font-size:28px;">${timeData.emoji}</span>
                <span style="font-size:16px;font-weight:700;">${timeData.text}</span>
                <span style="background:${badge.color};color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;">${badge.label}</span>
            </div>

            <!-- Mensagem principal (novo ou retorno) -->
            <div style="font-size:13px;background:rgba(0,180,216,0.1);border-left:3px solid #00B4D8;border-radius:6px;padding:8px 10px;margin-bottom:8px;text-align:left;">
                ${mainMsg}
            </div>

            <!-- Dia da semana -->
            <div style="font-size:12px;background:rgba(255,193,7,0.08);border-left:3px solid #FFC107;border-radius:6px;padding:7px 10px;margin-bottom:8px;text-align:left;">
                ${dayMsg}
            </div>

            <!-- Motivacional -->
            <div style="font-size:12px;font-style:italic;opacity:0.8;margin-bottom:8px;padding:0 4px;text-align:left;">
                💬 "${motivation}"
            </div>

            <!-- Plano -->
            <div style="font-size:12px;background:rgba(0,200,83,0.08);border-left:3px solid #00C853;border-radius:6px;padding:7px 10px;margin-bottom:10px;text-align:left;">
                ${planMsg}
            </div>

            <!-- Código de afiliado -->
            ${currentUser.affiliate_code ? `
            <div style="font-size:11px;opacity:0.6;margin-bottom:6px;text-align:center;">
                📋 Código afiliado: <strong style="color:#00C853;">${currentUser.affiliate_code}</strong>
            </div>
            <button onclick="copyReferralLink()" style="background:linear-gradient(135deg,#00C853,#00B4D8);border:none;border-radius:30px;padding:9px 16px;color:#fff;font-size:12px;cursor:pointer;width:100%;font-weight:600;">
                📢 Partilhar link e ganhar 10% de comissão
            </button>` : ''}
        </div>`;

    msg.style.display  = 'block';
    msg.style.opacity  = '0';
    msg.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => { msg.style.opacity = '1'; });

    // Auto-fechar após 15 segundos
    clearTimeout(window._greetingTimer);
    window._greetingTimer = setTimeout(() => closeGreeting(), 15000);
}

function closeGreeting() {
    const msg = document.getElementById('greetingMessage');
    if (!msg) return;
    msg.style.opacity = '0';
    setTimeout(() => { msg.style.display = 'none'; msg.style.opacity = '1'; }, 500);
    clearTimeout(window._greetingTimer);
}

// ============================================================
