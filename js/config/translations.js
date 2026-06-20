// ============================================================
// TRADUÇÕES PT/EN
// ============================================================
const translations = {
    pt: { menuHome:'Início', menuToday:'📅 Jogos de Hoje', menuSimulator:'🎮 Simulador', menuAccount:'Minha Conta', menuDeposit:'Assinar PRO', menuWithdraw:'Sacar Comissões', menuBookmakers:'Casas de Apostas', menuLeagues:'Todas as Ligas', menuAgenda:'📅 Próximos Jogos', menuMyBets:'Meus Bilhetes', menuAI:'IA Avançada', menuStats:'Estatísticas', menuPlans:'Planos', menuAffiliates:'Afiliados 10%', menuRanking:'Ranking', menuFaq:'Dúvidas', menuBlog:'Blog', menuHelp:'Ajuda', menuPolicies:'Políticas', menuSurebets:'🎯 Arbitragens', menuLogout:'Sair' },
    en: { menuHome:'Home', menuToday:'📅 Today\'s Games', menuSimulator:'🎮 Bet Simulator', menuAccount:'My Account', menuDeposit:'Subscribe PRO', menuWithdraw:'Withdraw Commissions', menuBookmakers:'Bookmakers', menuLeagues:'All Leagues', menuAgenda:'📅 Upcoming Games', menuMyBets:'My Tickets', menuAI:'Advanced AI', menuStats:'Statistics', menuPlans:'Plans', menuAffiliates:'Affiliates 10%', menuRanking:'Ranking', menuFaq:'FAQ', menuBlog:'Blog', menuHelp:'Help', menuPolicies:'Policies', menuSurebets:'🎯 Surebets', menuLogout:'Logout' }
};
let currentLang = localStorage.getItem('lang') || 'pt';
function changeLanguage(lang) { currentLang = lang; localStorage.setItem('lang', lang); applyTranslations(); }
function applyTranslations() { const t = translations[currentLang] || translations.pt; document.querySelectorAll('[data-i18n]').forEach(el => { const key = el.getAttribute('data-i18n'); if (t[key]) el.textContent = t[key]; }); document.getElementById('langSelect').value = currentLang; }
document.addEventListener('DOMContentLoaded', applyTranslations);

