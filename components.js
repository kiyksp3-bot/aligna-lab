// ===== ALIGNA Lab — Shared Components =====

const LEGAL = {
    name: 'ООО «АЛИГНА»',
    inn: '7700000001',
    ogrn: '1217700000001',
    address: 'г. Москва, ул. Примерная, д. 10, оф. 305',
    email: 'info@aligna-lab.ru',
    telegram: '@dr_beresneva',
    instagram: 'aligna_lab',
};

const NAV_ITEMS = [
    { href: 'index.html', label: 'Главная', id: 'home' },
    { href: 'services.html', label: 'Услуги и цены', id: 'services' },
    { href: 'portfolio.html', label: 'Портфолио', id: 'portfolio' },
    { href: 'blog.html', label: 'Блог', id: 'blog' },
    { href: 'contacts.html', label: 'Контакты', id: 'contacts' },
];

function getCurrentPage() {
    const path = window.location.pathname;
    const file = path.split('/').pop() || 'index.html';
    return file;
}

function renderHeader() {
    const current = getCurrentPage();
    const header = document.createElement('header');
    header.className = 'header';
    header.id = 'header';
    header.innerHTML = `
        <div class="container header-inner">
            <a href="index.html" class="logo" id="logo">
                <svg viewBox="0 0 180 50" class="logo-svg" aria-label="ALIGNA by Beresneva">
                    <polygon points="25,3 47,42 3,42" fill="none" stroke="#2D2D3A" stroke-width="2.5"/>
                    <text x="62" y="22" font-family="Inter,sans-serif" font-weight="700" font-size="14" letter-spacing="5" fill="#2D2D3A">ALIGNA</text>
                    <text x="62" y="38" font-family="Playfair Display,serif" font-weight="400" font-size="10" fill="#666">by Beresneva</text>
                </svg>
            </a>
            <nav class="nav" id="nav">
                <ul class="nav-list">
                    ${NAV_ITEMS.map(item => `
                        <li><a href="${item.href}" class="nav-link${current === item.href || (current === '' && item.id === 'home') ? ' active' : ''}">${item.label}</a></li>
                    `).join('')}
                </ul>
            </nav>
            <a href="contacts.html" class="btn btn-header" id="header-cta">Связаться</a>
            <button class="burger" id="burger" aria-label="Открыть меню">
                <span></span><span></span><span></span>
            </button>
        </div>
    `;
    document.body.prepend(header);

    // Mobile menu
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu';
    overlay.id = 'mobileMenu';
    overlay.innerHTML = `
        <ul class="mobile-menu-list">
            ${NAV_ITEMS.map(item => `
                <li><a href="${item.href}" class="mobile-menu-link">${item.label}</a></li>
            `).join('')}
        </ul>
    `;
    header.after(overlay);

    // Burger toggle
    const burger = document.getElementById('burger');
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
    });
    overlay.querySelectorAll('.mobile-menu-link').forEach(l => l.addEventListener('click', () => {
        burger.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }));

    // Scroll behavior
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
}

function renderFooter() {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
        <div class="container footer-inner">
            <div class="footer-brand">
                <svg viewBox="0 0 180 50" class="footer-logo" aria-label="ALIGNA by Beresneva">
                    <polygon points="25,3 47,42 3,42" fill="none" stroke="#fff" stroke-width="2.5"/>
                    <text x="62" y="22" font-family="Inter,sans-serif" font-weight="700" font-size="14" letter-spacing="5" fill="#fff">ALIGNA</text>
                    <text x="62" y="38" font-family="Playfair Display,serif" font-weight="400" font-size="10" fill="rgba(255,255,255,0.6)">by Beresneva</text>
                </svg>
                <p class="footer-desc">Премиальная зуботехническая лаборатория в Москве. Ортодонтические аппараты и реставрации.</p>
            </div>
            <div class="footer-links">
                <h4>Навигация</h4>
                <ul>
                    ${NAV_ITEMS.map(i => `<li><a href="${i.href}">${i.label}</a></li>`).join('')}
                </ul>
            </div>
            <div class="footer-links">
                <h4>Документы</h4>
                <ul>
                    <li><a href="privacy.html">Политика конфиденциальности</a></li>
                    <li><a href="consent.html">Согласие на обработку ПД</a></li>
                </ul>
            </div>
            <div class="footer-contact">
                <h4>Связаться</h4>
                <a href="https://t.me/${LEGAL.telegram}" target="_blank" rel="noopener">Telegram: ${LEGAL.telegram}</a>
                <a href="https://www.instagram.com/${LEGAL.instagram}" target="_blank" rel="noopener">Instagram: @${LEGAL.instagram}</a>
                <p class="footer-legal">${LEGAL.name}<br>ИНН ${LEGAL.inn} / ОГРН ${LEGAL.ogrn}<br>${LEGAL.address}</p>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container footer-bottom-inner">
                <p>© ${new Date().getFullYear()} ${LEGAL.name}. Все права защищены.</p>
                <p>Зуботехническая лаборатория, Москва</p>
            </div>
        </div>
    `;
    document.body.appendChild(footer);
}

function renderCookieBanner() {
    if (localStorage.getItem('aligna_cookies_accepted')) return;
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.id = 'cookieBanner';
    banner.innerHTML = `
        <div class="cookie-banner-inner">
            <p>Мы используем файлы cookie для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с <a href="privacy.html">Политикой конфиденциальности</a>.</p>
            <div class="cookie-banner-actions">
                <button class="btn btn-primary btn-sm" id="cookieAccept">Принять</button>
                <a href="privacy.html" class="btn btn-outline btn-sm">Подробнее</a>
            </div>
        </div>
    `;
    document.body.appendChild(banner);
    setTimeout(() => banner.classList.add('visible'), 500);

    document.getElementById('cookieAccept').addEventListener('click', () => {
        localStorage.setItem('aligna_cookies_accepted', 'true');
        banner.classList.remove('visible');
        setTimeout(() => banner.remove(), 400);
    });
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
    renderCookieBanner();
});
