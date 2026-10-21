// Theme switching
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle?.querySelector('i');
const languageToggle = document.getElementById('language-toggle');

const setThemeState = (theme) => {
    const isLight = theme === 'light';
    body.classList.toggle('light-theme', isLight);
    body.classList.toggle('dark-theme', !isLight);
    icon?.classList.toggle('fa-sun', isLight);
    icon?.classList.toggle('fa-moon', !isLight);
    themeToggle?.setAttribute('aria-pressed', String(isLight));
};

let savedTheme = null;
try {
    savedTheme = localStorage.getItem('theme');
} catch (error) {
    console.warn('Theme preference could not be loaded.', error);
}

setThemeState(savedTheme === 'light' ? 'light' : 'dark');

const year = document.getElementById('current-year');
if (year) year.textContent = new Date().getFullYear();

themeToggle?.addEventListener('click', () => {
    const theme = body.classList.contains('dark-theme') ? 'light' : 'dark';
    setThemeState(theme);
    try {
        localStorage.setItem('theme', theme);
    } catch (error) {
        console.warn('Theme preference could not be saved.', error);
    }
});

// Search and category filters
const cards = [...document.querySelectorAll('.app-card')];
const searchInput = document.getElementById('app-search');
const emptyState = document.getElementById('empty-state');
let activeFilter = 'all';
const filterApps = () => {
    const query = searchInput?.value.trim().toLowerCase() || '';
    let visible = 0;
    cards.forEach(card => {
        const matchesFilter = activeFilter === 'all' || card.dataset.type === activeFilter;
        const matchesQuery = (card.dataset.name || '').toLowerCase().includes(query);
        const show = matchesFilter && matchesQuery;
        card.hidden = !show;
        if (show) visible += 1;
    });
    if (emptyState) emptyState.hidden = visible !== 0;
};
searchInput?.addEventListener('input', filterApps);
document.querySelectorAll('.filter-btn').forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter || 'all';
    document.querySelectorAll('.filter-btn').forEach(item => item.classList.toggle('is-active', item === button));
    filterApps();
}));

// Lightweight English/Arabic UI toggle
const translations = {
    en: { navApps:'Apps', navContact:'Contact', heroText:'Discover focused Android apps and playful experiments designed with care, clarity, and a smooth user experience.', explore:'Explore the store', search:'Search apps...' },
    ar: { navApps:'التطبيقات', navContact:'تواصل معنا', heroText:'اكتشف تطبيقات أندرويد وألعابًا خفيفة مصممة بعناية وتجربة استخدام سلسة.', explore:'استكشف المتجر', search:'ابحث عن تطبيق...' }
};
const setLanguage = language => {
    const isArabic = language === 'ar';
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const value = translations[language][element.dataset.i18n];
        if (value) element.childNodes[0].nodeValue = value + (element.querySelector('i') ? ' ' : '');
    });
    if (searchInput) searchInput.placeholder = translations[language].search;
    if (languageToggle) languageToggle.textContent = isArabic ? 'EN' : 'عربي';
    try { localStorage.setItem('language', language); } catch (error) { /* storage is optional */ }
};
let savedLanguage = 'en';
try { savedLanguage = localStorage.getItem('language') === 'ar' ? 'ar' : 'en'; } catch (error) { /* storage is optional */ }
setLanguage(savedLanguage);
languageToggle?.addEventListener('click', () => setLanguage(document.documentElement.lang === 'ar' ? 'en' : 'ar'));

if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});

// Scroll reveal animations
const revealElements = document.querySelectorAll('.scroll-reveal');

if ('IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => scrollObserver.observe(el));
} else {
    revealElements.forEach(el => el.classList.add('active'));
}
