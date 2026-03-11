// ===== ALIGNA Lab — Main Script =====

// ── Particle Background (Antigravity-style) ──
class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particles-canvas';
        this.canvas.id = 'particlesCanvas';
        document.body.prepend(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -1000, y: -1000 };
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);

        this.resize();
        this.createParticles();
        this.listen();
        this.animate();
    }

    resize() {
        this.w = window.innerWidth;
        this.h = Math.max(document.documentElement.scrollHeight, window.innerHeight);
        this.canvas.width = this.w * this.dpr;
        this.canvas.height = this.h * this.dpr;
        this.canvas.style.width = this.w + 'px';
        this.canvas.style.height = this.h + 'px';
        this.ctx.scale(this.dpr, this.dpr);
    }

    createParticles() {
        const count = window.innerWidth < 768 ? 40 : 80;
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.w,
                y: Math.random() * this.h,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: 2 + Math.random() * 4,
                opacity: 0.06 + Math.random() * 0.12,
                // Pink-lavender palette
                hue: Math.random() > 0.5 ? (340 + Math.random() * 20) : (230 + Math.random() * 30),
                saturation: 50 + Math.random() * 30,
                lightness: 70 + Math.random() * 15,
            });
        }
    }

    listen() {
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY + window.scrollY;
        }, { passive: true });

        window.addEventListener('touchmove', e => {
            if (e.touches[0]) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY + window.scrollY;
            }
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.resize();
                this.createParticles();
            }, 200);
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.w, this.h);

        for (const p of this.particles) {
            // Anti-gravity: repel from mouse
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repelRadius = 150;

            if (dist < repelRadius && dist > 0) {
                const force = (1 - dist / repelRadius) * 2;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }

            // Friction
            p.vx *= 0.98;
            p.vy *= 0.98;

            // Natural drift
            p.vx += (Math.random() - 0.5) * 0.02;
            p.vy += (Math.random() - 0.5) * 0.02;

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < -20) p.x = this.w + 20;
            if (p.x > this.w + 20) p.x = -20;
            if (p.y < -20) p.y = this.h + 20;
            if (p.y > this.h + 20) p.y = -20;

            // Draw particle (soft dot)
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${p.opacity})`;
            this.ctx.fill();

            // Soft glow
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${p.opacity * 0.3})`;
            this.ctx.fill();
        }

        // Draw subtle connection lines between nearby particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const a = this.particles[i];
                const b = this.particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const alpha = (1 - dist / 120) * 0.04;
                    this.ctx.beginPath();
                    this.ctx.moveTo(a.x, a.y);
                    this.ctx.lineTo(b.x, b.y);
                    this.ctx.strokeStyle = `rgba(200, 180, 210, ${alpha})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ── Scroll Reveal Animations ──
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
}

// ── Animated Counters ──
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * ease) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

// ── Portfolio Lightbox ──
function initLightbox() {
    const items = document.querySelectorAll('.portfolio-item');
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !items.length) return;

    const img = lightbox.querySelector('.lightbox-img');
    const caption = lightbox.querySelector('.lightbox-caption');

    items.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.querySelector('img')?.src;
            const alt = item.querySelector('img')?.alt || '';
            if (src) {
                img.src = src;
                caption.textContent = alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ── Portfolio Category Filter ──
function initPortfolioFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item');
    if (!buttons.length || !items.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.filter;

            items.forEach(item => {
                const match = cat === 'all' || item.dataset.category === cat;
                item.style.opacity = match ? '1' : '0';
                item.style.transform = match ? 'scale(1)' : 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = match ? '' : 'none';
                }, match ? 0 : 300);
            });
        });
    });
}

// ── Smooth Scroll for Anchor Links ──
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ── Services Sidebar Sticky + Active Tracking ──
function initServicesSidebar() {
    const sidebar = document.querySelector('.services-sidebar');
    const sections = document.querySelectorAll('.price-category');
    const links = document.querySelectorAll('.sidebar-link');
    if (!sidebar || !sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                const active = sidebar.querySelector(`[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: 0.2, rootMargin: '-100px 0px -60% 0px' });

    sections.forEach(s => observer.observe(s));
}

// ── Contact Form Handling ──
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const consent = form.querySelector('#consentCheckbox');
        if (consent && !consent.checked) {
            alert('Необходимо дать согласие на обработку персональных данных.');
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Отправляется...';
        btn.disabled = true;

        setTimeout(() => {
            form.innerHTML = `
                <div class="form-success">
                    <div class="form-success-icon">✓</div>
                    <h3>Заявка отправлена!</h3>
                    <p>Мы свяжемся с вами в ближайшее время через Telegram или по телефону.</p>
                </div>
            `;
        }, 1500);
    });
}

// ── Preloader ──
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    window.addEventListener('load', () => {
        preloader.classList.add('loaded');
        setTimeout(() => preloader.remove(), 600);
    });
}

// ── Floating Telegram Button ──
function initFloatingTelegram() {
    const btn = document.createElement('a');
    btn.href = 'https://t.me/dr_beresneva';
    btn.target = '_blank';
    btn.rel = 'noopener';
    btn.className = 'floating-telegram';
    btn.id = 'floatingTelegram';
    btn.setAttribute('aria-label', 'Написать в Telegram');
    btn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" fill="currentColor"/>
        </svg>
        <span>Консультация</span>
    `;
    document.body.appendChild(btn);
}

// ── Initialize Everything ──
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    new ParticleBackground();
    initRevealAnimations();
    initCounters();
    initLightbox();
    initPortfolioFilter();
    initSmoothScroll();
    initServicesSidebar();
    initContactForm();
    initFloatingTelegram();
});
