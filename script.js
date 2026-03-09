document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initActiveNavLink();
    initStickyNavbar();
    initFaqAccordion();
    initRevealAnimations();
    initStarfield();
});

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const hamburgerIcon = document.querySelector('.hamburger i');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (!hamburgerIcon) return;

        if (navLinks.classList.contains('active')) {
            hamburgerIcon.classList.remove('fa-bars');
            hamburgerIcon.classList.add('fa-times');
        } else {
            hamburgerIcon.classList.remove('fa-times');
            hamburgerIcon.classList.add('fa-bars');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (!hamburgerIcon) return;
            hamburgerIcon.classList.remove('fa-times');
            hamburgerIcon.classList.add('fa-bars');
        });
    });
}

function initActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

function initStickyNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });
}

function initRevealAnimations() {
    const fadeElements = document.querySelectorAll('.fade-up');
    if (!fadeElements.length) return;

    if (!('IntersectionObserver' in window)) {
        fadeElements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            currentObserver.unobserve(entry.target);
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.12
    });

    fadeElements.forEach(el => observer.observe(el));
}

function initStarfield() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const stars = [];
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    let animationFrameId = null;
    let running = true;

    function computeStarCount() {
        const area = window.innerWidth * window.innerHeight;
        const rawCount = Math.floor(area / 28000);
        return Math.max(45, Math.min(95, rawCount));
    }

    function createStars() {
        stars.length = 0;
        const count = computeStarCount();
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: (0.5 + Math.random() * 1.2) * pixelRatio,
                speed: 0.08 + Math.random() * 0.22,
                opacity: 0.1 + Math.random() * 0.45
            });
        }
    }

    function resizeCanvas() {
        canvas.width = Math.floor(window.innerWidth * pixelRatio);
        canvas.height = Math.floor(window.innerHeight * pixelRatio);
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        createStars();
    }

    function animateStars() {
        if (!running) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            ctx.globalAlpha = star.opacity;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();

            star.y -= star.speed * pixelRatio;
            if (star.y < -2) {
                star.y = canvas.height + 2;
                star.x = Math.random() * canvas.width;
            }
        });

        animationFrameId = requestAnimationFrame(animateStars);
    }

    let resizeRaf = null;
    window.addEventListener('resize', () => {
        if (resizeRaf) cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(resizeCanvas);
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            running = false;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        } else if (!running) {
            running = true;
            animateStars();
        }
    });

    resizeCanvas();
    animateStars();
}
