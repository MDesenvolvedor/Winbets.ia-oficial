// MOEDAS E BANKROLL
// ============================================================
const exchangeRates = { 'USD':1.00, 'KZ':912.50, 'EUR':0.92, 'BRL':5.15, 'GBP':0.78, 'AOA':912.50 };
const currencySymbols = { 'USD':'$', 'KZ':'Kz', 'EUR':'€', 'BRL':'R$', 'GBP':'£', 'AOA':'Kz' };
const currencyNames = { 'USD':'Dólar', 'KZ':'Kwanza', 'EUR':'Euro', 'BRL':'Real', 'GBP':'Libra', 'AOA':'Kwanza' };
let userCurrency = localStorage.getItem('userCurrency') || 'KZ';
let userBalanceInUSD = 1000;
let demoBalance = parseFloat(localStorage.getItem('demoBalance')) || 50000;
let simulatorHistory = JSON.parse(localStorage.getItem('simulatorHistory')) || [];
let pendingSimulations = JSON.parse(localStorage.getItem('pendingSimulations')) || [];
let selectedGames = [];

function convertCurrency(amount, fromCurrency, toCurrency) { return (amount / exchangeRates[fromCurrency]) * exchangeRates[toCurrency]; }
function formatCurrency(amount, currency = userCurrency) { const symbol = currencySymbols[currency] || '$'; const converted = convertCurrency(amount, 'USD', currency); if (currency === 'KZ' || currency === 'AOA') return `${symbol} ${Math.round(converted).toLocaleString()}`; return `${symbol} ${converted.toFixed(2)}`; }
function formatDemoCurrency(amountInKZ) { const converted = convertCurrency(amountInKZ, 'KZ', userCurrency); const symbol = currencySymbols[userCurrency]; if (userCurrency === 'KZ' || userCurrency === 'AOA') return `${symbol} ${Math.round(converted).toLocaleString()}`; return `${symbol} ${converted.toFixed(2)}`; }
function updateMiniBankrollDisplay() { const el = document.getElementById('miniBankrollDisplay'); if (el) { const balance = convertCurrency(userBalanceInUSD, 'USD', userCurrency); el.innerHTML = userCurrency === 'KZ' || userCurrency === 'AOA' ? `💰 ${Math.round(balance).toLocaleString()}` : `💰 ${balance.toFixed(2)}`; } }
function updateDemoBalanceTop() { const el = document.getElementById('demoBalanceTopValue'); if (el) { const converted = convertCurrency(demoBalance, 'KZ', userCurrency); el.innerHTML = userCurrency === 'KZ' || userCurrency === 'AOA' ? `🎮 Demo: ${currencySymbols[userCurrency]} ${Math.round(converted).toLocaleString()}` : `🎮 Demo: ${currencySymbols[userCurrency]} ${converted.toFixed(2)}`; } }
function updateDemoDisplay() { const el = document.getElementById('demoBalanceDisplay'); if (el) el.innerHTML = formatDemoCurrency(demoBalance); updateDemoBalanceTop(); }
function changeCurrency(newCurrency) { userCurrency = newCurrency; localStorage.setItem('userCurrency', userCurrency); updateMiniBankrollDisplay(); updateDemoBalanceTop(); updateDemoDisplay(); }
function openBankrollModal() {
    const modalContent = document.getElementById('bankrollModalContent');
    modalContent.innerHTML = `
        <h2>💰 Gestão de Banca</h2>
        <div class="simulator-card">
            <p><strong>Saldo Atual:</strong> ${formatCurrency(userBalanceInUSD)}</p>
            <p><strong>Stake Recomendado (5%):</strong> ${formatCurrency(userBalanceInUSD * 0.05)}</p>
            <p><strong>Stake Máximo (10%):</strong> ${formatCurrency(userBalanceInUSD * 0.10)}</p>
        </div>
        <div style="margin:15px 0;">
            <h4>💱 Mudar Moeda</h4>
            <select id="currencySelect" onchange="changeCurrency(this.value)">
                <option value="KZ" ${userCurrency === 'KZ' ? 'selected' : ''}>🇦🇴 Kwanza (KZ)</option>
                <option value="USD" ${userCurrency === 'USD' ? 'selected' : ''}>🇺🇸 Dólar (USD)</option>
                <option value="EUR" ${userCurrency === 'EUR' ? 'selected' : ''}>🇪🇺 Euro (EUR)</option>
                <option value="BRL" ${userCurrency === 'BRL' ? 'selected' : ''}>🇧🇷 Real (BRL)</option>
                <option value="GBP" ${userCurrency === 'GBP' ? 'selected' : ''}>🇬🇧 Libra (GBP)</option>
            </select>
        </div>
        <div style="margin:15px 0;">
            <h4>📝 Atualizar Banca</h4>
            <input type="number" id="newBankrollInput" placeholder="Valor em ${currencyNames[userCurrency]}" style="width:100%;">
            <button onclick="updateBankrollValue()">Atualizar</button>
        </div>
        <button onclick="closeBankrollModal()">Fechar</button>
    `;
    document.getElementById('bankrollModal').style.display = 'flex';
}
function closeBankrollModal() { document.getElementById('bankrollModal').style.display = 'none'; }
async function updateBankrollValue() {
    const newValue = parseFloat(document.getElementById('newBankrollInput')?.value);
    if (!isNaN(newValue) && newValue > 0) {
        const amountInUSD = convertCurrency(newValue, userCurrency, 'USD');
        await updateUserBankroll(amountInUSD);
        openBankrollModal();
        alert(`✅ Banca atualizada para ${formatCurrency(userBalanceInUSD)}`);
    } else { alert('Digite um valor válido'); }
}
async function updateUserBankroll(newAmount) {
    if (!currentUser) return;
    userBalanceInUSD = newAmount;
    const { error } = await supabase.from('users').update({ bankroll: newAmount }).eq('id', currentUser.id);
    if (error) console.error('Erro ao atualizar bankroll:', error);
    updateMiniBankrollDisplay();
}
function copyText(text) { navigator.clipboard.writeText(text); alert('Copiado!'); }

// ============================================================
