/* ============================================================
   MIA SUPREMA — main.js
   ============================================================ */

// ─── CUSTOM CURSOR ────────────────────────────────────────
const cursor      = document.getElementById('cursor');
const cursorOuter = document.getElementById('cursor-outer');
let mx = 0, my = 0, ox = 0, oy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animOuter() {
  ox += (mx - ox) * 0.13;
  oy += (my - oy) * 0.13;
  cursorOuter.style.left = ox + 'px';
  cursorOuter.style.top  = oy + 'px';
  requestAnimationFrame(animOuter);
})();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('link-hover');
    cursorOuter.classList.add('link-hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('link-hover');
    cursorOuter.classList.remove('link-hover');
  });
});

// ─── NAV SCROLL ───────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── GOLD PARTICLE SYSTEM ─────────────────────────────────
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

class Particle {
  constructor() { this.init(true); }

  init(scatter) {
    this.x         = Math.random() * canvas.width;
    this.y         = scatter ? Math.random() * canvas.height : canvas.height + 10;
    this.r         = Math.random() * 1.8 + 0.3;
    this.vy        = -(Math.random() * 0.55 + 0.15);
    this.vx        = (Math.random() - 0.5) * 0.25;
    this.maxAlpha  = Math.random() * 0.5 + 0.1;
    this.alpha     = scatter ? Math.random() * this.maxAlpha : 0;
    this.life      = scatter ? Math.floor(Math.random() * 220) : 0;
    this.maxLife   = Math.random() * 240 + 120;
    this.fadeIn    = 30;
    this.fadeOut   = this.maxLife - 40;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life < this.fadeIn) {
      this.alpha = (this.life / this.fadeIn) * this.maxAlpha;
    } else if (this.life > this.fadeOut) {
      this.alpha = ((this.maxLife - this.life) / (this.maxLife - this.fadeOut)) * this.maxAlpha;
    } else {
      this.alpha = this.maxAlpha;
    }
    if (this.life >= this.maxLife || this.y < -10) this.init(false);
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.shadowBlur  = 9;
    ctx.shadowColor = '#C9A855';
    ctx.fillStyle   = '#E8D080';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const particles = Array.from({ length: 90 }, () => new Particle());

(function animParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animParticles);
})();

// ─── HERO PARALLAX ────────────────────────────────────────
const heroBgImg = document.querySelector('.hero-bg img');
window.addEventListener('scroll', () => {
  if (!heroBgImg) return;
  const s = window.scrollY;
  if (s < window.innerHeight * 1.2) {
    heroBgImg.style.transform = `translateY(${s * 0.28}px)`;
  }
}, { passive: true });

// ─── SCROLL REVEAL ────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // don't unobserve so stagger siblings still work
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ─── MAGNETIC BUTTONS ─────────────────────────────────────
document.querySelectorAll('.fans-cta, .btn-primary, .btn-ghost').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.14;
    const y = (e.clientY - r.top  - r.height / 2) * 0.14;
    btn.style.transform   = `translate(${x}px,${y}px)`;
    btn.style.transition  = 'transform 0.15s ease, box-shadow 0.3s, background 0.3s';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform  = '';
    btn.style.transition = 'transform 0.45s ease, box-shadow 0.3s, background 0.3s';
  });
});

// ─── SMOOTH ANCHOR SCROLL ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ─── MOBILE NAV TOGGLE ────────────────────────────────────
const mobileToggle = document.getElementById('mobileToggle');
const navLinks     = document.querySelector('.nav-links');
if (mobileToggle && navLinks) {
  mobileToggle.addEventListener('click', () => {
    const open = navLinks.style.display === 'flex';
    navLinks.style.display   = open ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position  = 'absolute';
    navLinks.style.top       = '100%';
    navLinks.style.left      = '0';
    navLinks.style.right     = '0';
    navLinks.style.background = 'rgba(6,4,6,0.97)';
    navLinks.style.padding   = '24px 24px';
    navLinks.style.gap       = '24px';
    navLinks.style.backdropFilter = 'blur(20px)';
    navLinks.style.borderBottom = '1px solid rgba(201,168,85,0.1)';
    if (!open) navLinks.style.display = 'flex';
  });
}
