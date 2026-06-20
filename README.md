# WIN BETS 🏆
**Plataforma Nº1 em Análises Inteligentes para Apostas Desportivas**

---

## 📁 Estrutura do Projeto

```
winbets/
├── index.html                  ← Página principal (HTML 100% original)
├── css/
│   └── styles.css              ← Todos os estilos (1113 linhas)
└── js/
    ├── config/
    │   ├── supabase.js         ← Inicialização do Supabase
    │   ├── api-config.js       ← 31 APIs com fallback automático
    │   └── translations.js     ← Traduções PT / EN
    ├── modules/
    │   ├── auth.js             ← Login, registo, recuperação de senha
    │   ├── bankroll.js         ← Gestão de banca + multi-moeda
    │   ├── analysis.js         ← IA, Ensemble e H2H
    │   ├── games.js            ← Carregamento e análise de jogos
    │   ├── bookmakers.js       ← Casas de apostas com logos reais
    │   ├── leagues.js          ← 210+ ligas por região
    │   ├── simulator.js        ← Simulador com gráficos e bilhetes
    │   ├── utils.js            ← Funções utilitárias
    │   ├── surebets.js         ← Detector de arbitragens
    │   ├── plans.js            ← Planos PRO
    │   ├── blog.js             ← Sistema de blog
    │   ├── ranking.js          ← Ranking de utilizadores
    │   ├── stats.js            ← 16 métricas reais, xG, lesões
    │   └── admin.js            ← Painel administrativo
    ├── ui/
    │   ├── theme.js            ← Toggle dark/light + menu
    │   └── navigation.js       ← Navegação entre secções
    └── main.js                 ← Inicialização + funções globais
```

---

## 🚀 Deploy no Vercel (Recomendado)

1. Criar conta em [vercel.com](https://vercel.com)
2. Fazer upload deste ZIP ou importar do GitHub
3. Em **Settings → Environment Variables**, adicionar:

| Variável | API |
|---|---|
| `SUPABASE_URL` | Supabase URL |
| `SUPABASE_ANON_KEY` | Supabase Key |
| `FD_API_KEY` | Football-Data.org |
| `RAPIDAPI_KEY` | API-Football + API-Sports (RapidAPI) |
| `SPORTS_API_KEY` | API-Sports direto |
| `SCOREBAT_KEY` | ScoreBat |
| `SPORTSDB_API_KEY` | TheSportsDB v3 |
| `ODDS_API_KEY` | Odds-API.io |
| `THE_ODDS_API_KEY` | The Odds API |
| `BETFAIR_API_KEY` | Betfair |
| `PINNACLE_API_KEY` | Pinnacle |
| `HF_TOKEN` | Hugging Face |
| `OPENAI_API_KEY` | OpenAI GPT-4 |
| `GEMINI_API_KEY` | Google Gemini |
| `CLAUDE_API_KEY` | Anthropic Claude |
| `XG_API_KEY` | xG API |
| `STATSBOMB_API_KEY` | StatsBomb |
| `WHOSCORED_API_KEY` | WhoScored |
| `WEATHER_API_KEY` | OpenWeather |
| `WEATHERAPI_KEY` | WeatherAPI |
| `INJURY_API_KEY` | Injury API |
| `LIVESCORE_API_KEY` | LiveScore |
| `FLASHSCORE_API_KEY` | FlashScore |
| `SOFASCORE_API_KEY` | SofaScore |

4. Clicar em **Deploy** ✅

---

## 🖥️ Testar Localmente

```bash
npx serve .
# ou
python3 -m http.server 8080
```

Abrir: `http://localhost:8080`

> ⚠️ Não abrir o `index.html` diretamente no browser.

---

## 📊 Resumo das 31 APIs

| Categoria | Quantidade |
|---|---|
| ⚽ Dados de Futebol | 8 |
| 💰 Odds & Apostas | 4 |
| 🧠 Inteligência Artificial | 4 |
| 📊 Estatísticas Avançadas | 3 |
| 🌦️ Clima | 2 |
| 🏥 Lesões | 1 |
| 📺 Resultados ao Vivo | 3 |
| 🔄 Fallback Extra | 6 |
| **Total** | **31** |
| Gratuitas | 27 |
| Premium | 4 |
| Sem chave | 4 |

---

## 📞 Suporte

- 📱 WhatsApp: [+244 927 224 260](https://wa.me/244927224260)

© 2026 WIN BETS — Todos os direitos reservados.
