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

// Also observe dynamically-added capture inputs for cursor state
document.querySelectorAll('.capture-input-group input').forEach(el => {
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

// ─── CONNECT TABS ─────────────────────────────────────────
document.querySelectorAll('.links-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.links-tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.links-tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const panel = document.getElementById('links-panel-' + target);
    if (panel) panel.classList.add('active');
  });
});

// ─── CAPTURE FORMS ────────────────────────────────────────
async function submitCapture(formId, successId) {
  const form    = document.getElementById(formId);
  const success = document.getElementById(successId);
  if (!form || !success) return;

  // Inject error message element if not already there
  let errMsg = form.querySelector('.capture-error');
  if (!errMsg) {
    errMsg = document.createElement('p');
    errMsg.className = 'capture-error';
    errMsg.style.cssText = 'color:var(--pink);font-size:0.78rem;margin-top:8px;display:none;';
    form.appendChild(errMsg);
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    errMsg.style.display = 'none';
    const btn = form.querySelector('.capture-submit');
    const originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '…';

    try {
      const res = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        form.style.display  = 'none';
        success.removeAttribute('hidden');
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'server');
      }
    } catch (err) {
      btn.disabled  = false;
      btn.innerHTML = originalContent;
      errMsg.textContent = 'Something went wrong — please try again.';
      errMsg.style.display = 'block';
    }
  });
}

submitCapture('capture-email', 'success-email');
submitCapture('capture-sms',   'success-sms');
submitCapture('capture-wa',    'success-wa');

// WhatsApp: also open a chat after successful submission
(function () {
  const waForm = document.getElementById('capture-wa');
  if (!waForm) return;
  waForm.addEventListener('submit', e => {
    // runs AFTER the async handler above, which already called preventDefault
    const numRaw = (waForm.querySelector('input[type="tel"]')?.value || '').trim();
    const num    = numRaw.replace(/[\s\(\)\-\.]/g, '').replace(/^\+/, '');
    if (num.length >= 7) {
      const msg = encodeURIComponent('Hola Mia! Me uno al inner circle de WhatsApp ✦');
      setTimeout(() => {
        window.open('https://wa.me/' + num + '?text=' + msg, '_blank', 'noopener,noreferrer');
      }, 600);
    }
  }, true); // capture phase so it fires before the async one prevents default
})();

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
