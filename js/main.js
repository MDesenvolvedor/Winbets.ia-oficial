// ============================================================
// INICIALIZAÇÃO
// ============================================================
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.width = (Math.random() * 6 + 2) + 'px';
        p.style.height = p.style.width;
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 15 + 's';
        p.style.animationDuration = (Math.random() * 10 + 10) + 's';
        container.appendChild(p);
    }
}
// showGreeting → js/ui/greetings.js
function showAdminPanel() {
    secretClickCount++;
    if (clickTimer) clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
        if (secretClickCount >= 10) {
            secretClickCount = 0;
            document.getElementById('adminSection').style.display = 'block';
            const sections = ['home','analysis','account','deposit','withdraw','bookmakers','leagues','agendaFuturo','mybets','ai','stats','plans','affiliates','ranking','faq','blog','help','policies','surebets','todayGames','simulator'];
            sections.forEach(s => { const el = document.getElementById(s + 'Section'); if(el) el.style.display = 'none'; });
            document.getElementById('adminLoginPanel').style.display = 'block';
            document.getElementById('adminDashboard').style.display = 'none';
            alert('🔐 Acesso administrativo liberado!');
        }
        secretClickCount = 0;
    }, 1000);
}

createParticles();
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.remove('dark'); document.body.classList.add('light');
    document.getElementById('themeIcon').className = 'fas fa-sun';
    document.getElementById('themeText').innerText = 'Claro';
}
checkAuth();
document.getElementById('secretAdminBtn')?.addEventListener('click', showAdminPanel);
loadGames();
loadBookmakers();
loadLeagues();
loadBlog();
loadRanking();
loadPlans();
loadAIAnalysis();
updateMiniBankrollDisplay();
updateDemoBalanceTop();
updateDemoDisplay();
updateAccountInfo();

// EXPOR FUNÇÕES GLOBAIS
window.toggleMenu = toggleMenu;
window.showSection = showSection;
window.showAnalysis = showAnalysis;
window.showAdvancedAnalysis = showAdvancedAnalysis;
window.showHuggingFaceAnalysis = showHuggingFaceAnalysis;
window.closeAnalysis = closeAnalysis;
window.searchTeams = searchTeams;
window.filterFutureGamesByDate = filterFutureGamesByDate;
window.filterFutureGamesByDatePicker = filterFutureGamesByDatePicker;
window.openBankrollModal = openBankrollModal;
window.closeBankrollModal = closeBankrollModal;
window.changeCurrency = changeCurrency;
window.detectSurebets = detectSurebets;
window.promptSimulateBet = promptSimulateBet;
window.checkPendingSimulations = checkPendingSimulations;
window.loadMoreBookmakers = loadMoreBookmakers;
window.showBookmakerSelection = showBookmakerSelection;
window.closeBookmakerModal = closeBookmakerModal;
window.copyText = copyText;
window.copyReferralLink = copyReferralLink;
window.selectPlan = selectPlan;
window.showPaymentMethods = showPaymentMethods;
window.toggleTheme = toggleTheme;
window.changeLanguage = changeLanguage;
window.adminLogin = adminLogin;
window.publishBlogPost = publishBlogPost;
window.deleteBlogPost = deleteBlogPost;
window.makeWithdraw = makeWithdraw;
window.resetSystem = resetSystem;
window.updateBankrollValue = updateBankrollValue;
window.setLeagueFilter = setLeagueFilter;
window.loadMoreLeagues = loadMoreLeagues;
window.filterGamesByLeague = filterGamesByLeague;
window.getEnsemblePrediction = getEnsemblePrediction;
window.getH2HStats = getH2HStats;
window.loadRealStats = loadRealStats;
window.openAuthModal = openAuthModal;
window.register = register;
window.login = login;
window.switchToLogin = switchToLogin;
window.switchToRegister = switchToRegister;
window.logout = logout;
window.closeAccessBlockAndShowLogin = closeAccessBlockAndShowLogin;
window.closeAccessBlockAndShowRegister = closeAccessBlockAndShowRegister;
window.showForgotPassword = showForgotPassword;
window.closeForgotModal = closeForgotModal;
window.closeResetModal = closeResetModal;
window.sendRecoveryCode = sendRecoveryCode;
window.resetPassword = resetPassword;
window.selectAllGames = selectAllGames;
window.deselectAllGames = deselectAllGames;
window.createTicket = createTicket;
window.toggleGameSelect = toggleGameSelect;
