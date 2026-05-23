// Header behaviour: hide on scroll down, show on scroll up, mobile toggle, theme toggle
(function () {
    const nav = document.getElementById('navbar');
    const btn = document.getElementById('themeToggleRoot');
    const ham = document.getElementById('hamburger');
    const links = document.getElementById('navLinks');
    if (!nav) return;

    // Scroll direction show/hide
    let lastY = window.scrollY; let ticking = false;
    function onScroll() {
        const current = window.scrollY;
        if (current > lastY && current > 100) {
            nav.classList.remove('nav-show'); nav.classList.add('nav-hidden');
        } else {
            nav.classList.remove('nav-hidden');
            void nav.offsetWidth; // reflow
            nav.classList.add('nav-show');
            nav.addEventListener('animationend', () => nav.classList.remove('nav-show'), { once: true });
        }
        nav.classList.toggle('scrolled', current > 40);
        lastY = current <= 0 ? 0 : current; ticking = false;
    }
    window.addEventListener('scroll', () => { if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true } }, { passive: true });

    // mobile toggle
    window.toggleNav = function () {
        if (links) links.classList.toggle('open');
        if (ham) ham.classList.toggle('open');
    };

    // theme toggle wiring
    if (btn) {
        const apply = (isLight) => {
            document.body.classList.toggle('theme-light', !!isLight);
            document.body.classList.toggle('theme-dark', !isLight);
            btn.setAttribute('aria-pressed', (!!isLight).toString());
            btn.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
            try { localStorage.setItem('site-theme', '' + (isLight ? 'light' : 'dark')); } catch (e) { }
        };

        try {
            const saved = localStorage.getItem('site-theme');
            if (saved) apply(saved === 'light');
            else apply(window.matchMedia && window.matchMedia('(prefers-color-scheme:light)').matches);
        } catch (e) { apply(false) }

        btn.addEventListener('click', () => { const isLight = !document.body.classList.contains('theme-light'); apply(isLight); });
    }
})();
