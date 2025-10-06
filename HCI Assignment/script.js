// Utilities
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Header nav toggle
const navToggle = $('.nav__toggle');
const navMenu = $('#navMenu');
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        navMenu.classList.toggle('is-open');
    });
    // Close on link click (mobile)
    $$('.nav__link').forEach((link) => link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
    }));
}

// Current year
const yearEl = $('#year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Intersection Observer for reveal animations
const revealEls = $$('.reveal');
const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
revealEls.forEach((el) => io.observe(el));

// Animated counters for pricing
function animateCounter(el, target) {
    const duration = 900; // ms
    const start = 0;
    const startTime = performance.now();
    function tick(now) {
        const p = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(start + (target - start) * (1 - Math.pow(1 - p, 3)));
        el.textContent = String(value);
        if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}
$$('[data-counter]').forEach((el) => {
    const priceCard = el.closest('[data-price]');
    const target = priceCard ? Number(priceCard.getAttribute('data-price')) : Number(el.textContent || 0);
    animateCounter(el, target);
});

// Pricing calculator
const plan = $('#plan');
const months = $('#months');
const calcTotal = $('#calcTotal');
function updateTotal() {
    const planVal = Number(plan.value || 0);
    const monthsVal = Math.min(Math.max(Number(months.value || 0), 1), 24);
    months.value = String(monthsVal);
    const total = planVal * monthsVal;
    if (calcTotal) calcTotal.textContent = String(total);
}
if (plan && months) {
    plan.addEventListener('change', updateTotal);
    months.addEventListener('input', updateTotal);
    updateTotal();
}

// Carousel (simple)
const carousel = $('.carousel');
if (carousel) {
    const track = $('.carousel__track', carousel);
    const items = $$('.testimonial', track);
    const prev = $('.prev', carousel);
    const next = $('.next', carousel);
    let index = 0;

    function go(to) {
        index = (to + items.length) % items.length;
        const offset = -index * (items[0].offsetWidth + 18); // 18px gap
        track.style.transform = `translateX(${offset}px)`;
    }

    prev?.addEventListener('click', () => go(index - 1));
    next?.addEventListener('click', () => go(index + 1));

    // Autoplay
    const autoplay = carousel.getAttribute('data-autoplay') === 'true';
    let timer;
    function start() { timer = setInterval(() => go(index + 1), 4000); }
    function stop() { clearInterval(timer); }
    if (autoplay) {
        start();
        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
    }
    // Adjust on resize
    window.addEventListener('resize', () => go(index));
    go(0);
}

// Forms validation (lightweight)
function setMsg(el, msg, ok = false) {
    el.textContent = msg;
    el.style.color = ok ? '#00a3ff' : '#ff7b7b';
}

// Newsletter
const newsletterForm = $('#newsletterForm');
if (newsletterForm) {
    const email = $('#newsletterEmail');
    const msg = $('#newsletterMsg');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            setMsg(msg, 'Please enter a valid email.');
            email.focus();
            return;
        }
        setMsg(msg, 'Subscribed! Welcome to NH Fitness 💪', true);
        newsletterForm.reset();
    });
}

// Contact
const contactForm = $('#contactForm');
if (contactForm) {
    const name = $('#name');
    const email = $('#email');
    const message = $('#message');
    const msg = $('#contactMsg');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!name.value.trim()) { setMsg(msg, 'Please enter your name.'); name.focus(); return; }
        if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { setMsg(msg, 'Please enter a valid email.'); email.focus(); return; }
        if (!message.value.trim() || message.value.trim().length < 10) { setMsg(msg, 'Message must be at least 10 characters.'); message.focus(); return; }
        setMsg(msg, 'Thanks! We will get back to you soon.', true);
        contactForm.reset();
    });
}


