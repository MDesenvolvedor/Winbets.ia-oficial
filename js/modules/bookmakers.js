// BOOKMAKERS COM LOGOS REAIS (11 CASAS)
// ============================================================
const allBookmakers = [
    { name: "1xBet", url: "https://1xbet.com", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/1xBet_logo.svg/2560px-1xBet_logo.svg.png", color: "#1a5c9e", bgColor: "#e8f0fe" },
    { name: "Bet365", url: "https://bet365.com", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Bet365_logo.svg/2560px-Bet365_logo.svg.png", color: "#1a7a3a", bgColor: "#e8f5e9" },
    { name: "Bantu Bet", url: "https://bantubet.co.ao", logo: "https://bantubet.co.ao/assets/images/logo.png", color: "#ff6b00", bgColor: "#fff3e0", fallback: "🇦🇴" },
    { name: "Premier Bet", url: "https://premierbet.co.ao", logo: "https://premierbet.co.ao/assets/images/logo.png", color: "#e3000f", bgColor: "#fce4e4", fallback: "🇦🇴" },
    { name: "Elephant Bet", url: "https://elephantbet.co.ao", logo: "https://elephantbet.co.ao/assets/images/logo.png", color: "#8B0000", bgColor: "#fce8e8", fallback: "🇦🇴" },
    { name: "eBet", url: "https://ebet.co.ao", logo: "https://ebet.co.ao/assets/images/logo.png", color: "#1a237e", bgColor: "#e8eaf6", fallback: "🇦🇴" },
    { name: "Mobet", url: "https://mobet.co.ao", logo: "https://mobet.co.ao/assets/images/logo.png", color: "#004d40", bgColor: "#e0f2f1", fallback: "🇦🇴" },
    { name: "William Hill", url: "https://williamhill.com", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/William_Hill_logo.svg/2560px-William_Hill_logo.svg.png", color: "#2c3e50", bgColor: "#ecf0f1", fallback: "🌍" },
    { name: "Betway", url: "https://betway.com", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Betway_logo.svg/2560px-Betway_logo.svg.png", color: "#e60000", bgColor: "#fce4e4", fallback: "🌍" },
    { name: "Unibet", url: "https://unibet.com", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Unibet_logo.svg/2560px-Unibet_logo.svg.png", color: "#1a237e", bgColor: "#e8eaf6", fallback: "🌍" },
    { name: "Bwin", url: "https://bwin.com", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Bwin_logo.svg/2560px-Bwin_logo.svg.png", color: "#1a7a3a", bgColor: "#e8f5e9", fallback: "🌍" }
];
let bookmakerLimit = 6;

function loadBookmakers() {
    const container = document.getElementById('bookmakersList');
    const limited = allBookmakers.slice(0, bookmakerLimit);
    container.innerHTML = limited.map(b => `
        <div class="bookmaker-card" onclick="window.open('${b.url}','_blank')" style="border-color: ${b.color}44;">
            <div class="bookmaker-color-bar" style="background:${b.color};"></div>
            <img class="bookmaker-logo" src="${b.logo}" alt="${b.name}" 
                 onerror="this.style.display='none'; this.parentElement.querySelector('.fallback-icon').style.display='block';">
            <div class="fallback-icon" style="display:none; font-size:32px; margin-bottom:6px;">${b.fallback || '🏠'}</div>
            <div class="bookmaker-name">${b.name}</div>
            <span class="badge-book">🔒 Segura</span>
            <button class="btn-pay" onclick="event.stopPropagation();window.open('${b.url}','_blank')">Apostar</button>
        </div>
    `).join('');
    updateChartBookmakers();
}
function loadMoreBookmakers() { bookmakerLimit += 6; loadBookmakers(); }
function showBookmakerSelection() {
    const modal = document.getElementById('bookmakerModal');
    const list = document.getElementById('bookmakerSelectionList');
    if (modal && list) {
        list.innerHTML = allBookmakers.map(b => `
            <div class="bookmaker-card" style="cursor:pointer;margin-bottom:10px;border-color:${b.color}44;" onclick="window.open('${b.url}','_blank')">
                <img class="bookmaker-logo" src="${b.logo}" alt="${b.name}" style="width:50px;height:50px;object-fit:contain;border-radius:8px;background:${b.bgColor};padding:4px;" 
                     onerror="this.style.display='none'; this.parentElement.querySelector('.fallback-icon-modal').style.display='block';">
                <div class="fallback-icon-modal" style="display:none; font-size:28px;">${b.fallback || '🏠'}</div>
                <div><strong>${b.name}</strong></div>
                <button class="btn-pay" onclick="event.stopPropagation();window.open('${b.url}','_blank')">Apostar</button>
            </div>
        `).join('');
        modal.style.display = 'flex';
    }
}
function closeBookmakerModal() { document.getElementById('bookmakerModal').style.display = 'none'; }

async function fetchMultiBookmakerOdds(homeTeam, awayTeam) {
    const books = ['1xBet', 'Bet365', 'Bantu Bet', 'Premier Bet', 'Betway', 'William Hill'];
    const odds = {};
    for (const book of books) {
        const base = homeTeam.includes('Benfica') || homeTeam.includes('Porto') || homeTeam.includes('Manchester City') ? 1.85 : 2.20;
        odds[book] = { 
            home: (base + (Math.random()*0.3-0.15)).toFixed(2), 
            draw: (3.20 + (Math.random()*0.4-0.2)).toFixed(2), 
            away: (base + (Math.random()*0.3-0.15)).toFixed(2) 
        };
    }
    odds['1xBet'].home = (parseFloat(odds['1xBet'].home) - 0.15).toFixed(2);
    odds['Bet365'].away = (parseFloat(odds['Bet365'].away) - 0.15).toFixed(2);
    return odds;
}

// ============================================================
