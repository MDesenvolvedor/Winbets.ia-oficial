// NAVEGAÇÃO
// ============================================================
function toggleMenu() { document.getElementById('sideMenu').classList.toggle('active'); }
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    const text = document.getElementById('themeText');
    if (body.classList.contains('dark')) {
        body.classList.remove('dark'); body.classList.add('light');
        icon.className='fas fa-sun'; text.innerText='Claro';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light'); body.classList.add('dark');
        icon.className='fas fa-moon'; text.innerText='Escuro';
        localStorage.setItem('theme', 'dark');
    }
}
