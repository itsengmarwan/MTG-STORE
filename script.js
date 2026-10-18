// نظام التبديل بين الأوضاع
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle?.querySelector('i');

const setThemeState = (theme) => {
    const isLight = theme === 'light';
    body.classList.toggle('light-theme', isLight);
    body.classList.toggle('dark-theme', !isLight);
    icon?.classList.toggle('fa-sun', isLight);
    icon?.classList.toggle('fa-moon', !isLight);
    themeToggle?.setAttribute('aria-pressed', String(isLight));
};

setThemeState(localStorage.getItem('theme') === 'light' ? 'light' : 'dark');

themeToggle?.addEventListener('click', () => {
    const theme = body.classList.contains('dark-theme') ? 'light' : 'dark';
    setThemeState(theme);
    localStorage.setItem('theme', theme);
});

// نظام ظهور العناصر عند السكرول (Scroll Reveal)
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
