document.addEventListener('DOMContentLoaded', function () {

    // Navbar scroll effect
    const navbar = document.getElementById('mainNav');
    const hero = document.getElementById('hero');

    if (hero) { // Only run if hero element exists
        window.addEventListener('scroll', () => {
            if (window.scrollY > hero.offsetHeight) {
                navbar.classList.add('navbar-sticky');
            } else {
                navbar.classList.remove('navbar-sticky');
            }
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Staggered reveal para los logos (observa la fila y revela cada .col)
    (function () {
        const sponsorSection = document.querySelector('.elementor-widget-wrap.elementor-element-populated');
        if (!sponsorSection) return;

        const row = sponsorSection.querySelector('.row');
        if (!row) return;

        const items = Array.from(row.querySelectorAll(':scope > div')); // columnas directas
        if (items.length === 0) return;

        items.forEach(i => i.classList.add('sponsor-item'));

        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!('IntersectionObserver' in window) || prefersReduced) {
            items.forEach(i => i.classList.add('visible'));
            return;
        }

        const STAGGER_MS = 110;

        // Si la fila ya está dentro del viewport en carga -> revelar inmediatamente con stagger
        const rowRect = row.getBoundingClientRect();
        if (rowRect.top < window.innerHeight && rowRect.bottom > 0) {
            items.forEach((el, idx) => {
                requestAnimationFrame(() => setTimeout(() => el.classList.add('visible'), idx * STAGGER_MS));
            });
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    items.forEach((el, idx) => {
                        // requestAnimationFrame + setTimeout para pintura más suave
                        requestAnimationFrame(() => setTimeout(() => el.classList.add('visible'), idx * STAGGER_MS));
                    });
                    obs.disconnect();
                }
            });
        }, {threshold: 0.12, rootMargin: '0px 0px -8% 0px'});

        observer.observe(row);
    })();

    // Sponsors continuous auto-scroll carousel (CSS-driven, duración calculada)
    (function initSponsorsCarousel() {
        const slider = document.querySelector('.sponsors-slider');
        if (!slider) return;
        const track = slider.querySelector('.sponsors-track');
        if (!track) return;

        // Duplicar contenido para que el loop sea seamless
        track.innerHTML = track.innerHTML + track.innerHTML;

        // Calcula duración en segundos según ancho y velocidad (px/seg)
        const computeDuration = () => {
            // ancho del bloque original (antes de duplicar) = scrollWidth / 2
            const originalWidth = track.scrollWidth / 2 || track.offsetWidth;
            const speed = 120; // px por segundo (ajusta para ir más lento/rápido)
            const durationSec = Math.max(8, originalWidth / speed); // mínimo 8s
            track.style.setProperty('--sponsors-duration', durationSec + 's');
        };

        // Pausar al pasar el ratón (y al tocar en móviles)
        slider.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
        slider.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
        slider.addEventListener('touchstart', () => { track.style.animationPlayState = 'paused'; }, {passive: true});
        slider.addEventListener('touchend', () => { track.style.animationPlayState = 'running'; }, {passive: true});

        // recalcula en carga y redimensionado
        computeDuration();
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(computeDuration, 150);
        });
    })();

});
