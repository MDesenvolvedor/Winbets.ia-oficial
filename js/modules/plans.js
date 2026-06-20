// PLANOS
// ============================================================
const PLAN_PRICES = { biweekly:5, monthly:9, quarterly:22, semester:35, yearlyNew:53 };
function loadPlans() {
    const container = document.getElementById('plansContainer');
    container.innerHTML = `
        <div class="plan-card"><div class="plan-icon"><i class="fas fa-star-of-life"></i></div><div class="plan-name">📊 Grátis</div><div class="plan-price">0 USD</div><div class="plan-features"><p>✅ 3 análises/dia</p></div><button class="btn-plan" onclick="alert('Plano Grátis ativado!')">Ativar</button></div>
        <div class="plan-card"><div class="plan-icon"><i class="fas fa-calendar-week"></i></div><div class="plan-name">⭐ 2 Semanas</div><div class="plan-price">5 USD</div><div class="plan-features"><p>✅ Ilimitado</p><p>✅ IA Avançada</p></div><button class="btn-plan" onclick="selectPlan('biweekly')">Assinar</button></div>
        <div class="plan-card"><div class="plan-icon"><i class="fas fa-calendar-alt"></i></div><div class="plan-name">🚀 1 Mês</div><div class="plan-price">9 USD</div><div class="plan-features"><p>✅ Ilimitado</p><p>✅ Economize 20%</p></div><button class="btn-plan" onclick="selectPlan('monthly')">Assinar</button></div>
        <div class="plan-card"><div class="plan-icon"><i class="fas fa-chart-line"></i></div><div class="plan-name">💎 Trimestral</div><div class="plan-price">22 USD</div><div class="plan-features"><p>✅ Suporte Prioritário</p><p>✅ Economize 30%</p></div><button class="btn-plan" onclick="selectPlan('quarterly')">Assinar</button></div>
        <div class="plan-card"><div class="plan-icon"><i class="fas fa-trophy"></i></div><div class="plan-name">🏆 Semestral</div><div class="plan-price">35 USD</div><div class="plan-features"><p>✅ Suporte VIP</p><p>✅ Economize 40%</p></div><button class="btn-plan" onclick="selectPlan('semester')">Assinar</button></div>
        <div class="plan-card"><div class="plan-icon"><i class="fas fa-crown"></i></div><div class="plan-name">👑 Anual</div><div class="plan-price">53 USD</div><div class="plan-features"><p>✅ Suporte VIP 24/7</p><p>✅ Economize 50%</p></div><button class="btn-plan" onclick="selectPlan('yearlyNew')">Assinar</button></div>
    `;
}
function selectPlan(planType) {
    if (!currentUser) { alert('Faça login!'); openAuthModal(); return; }
    const amount = PLAN_PRICES[planType];
    const planName = planType === 'biweekly' ? '2 Semanas' : (planType === 'monthly' ? '1 Mês' : (planType === 'quarterly' ? 'Trimestral' : (planType === 'semester' ? 'Semestral' : 'Anual')));
    if (confirm(`💳 Plano PRO ${planName}: ${amount} USD\n\n✅ Pagamento via Binance TRC20: TXPWLZ3jPUyzAYZDuKCKJPTd7PSXk53Kvw\n\nApós pagamento, envie comprovativo para WhatsApp 927224260`)) {
        alert(`📤 Envie comprovativo de ${amount} USD para 927224260. Seu plano será ativado em até 2 horas!`);
    }
}
function showPaymentMethods() { alert("💳 Binance TRC20: TXPWLZ3jPUyzAYZDuKCKJPTd7PSXk53Kvw\nBybit: 0x0bed3e1862b7214b3b83b6fc0000a0097d608bbd"); }

// ============================================================
