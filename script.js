// ── NAV ──
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('elevated', scrollY > 20);
});


// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const mobMenu   = document.getElementById('mobMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobMenu.classList.toggle('open');
});
document.querySelectorAll('.m-link').forEach(l => l.addEventListener('click', () => {
  hamburger.classList.remove('open');
  mobMenu.classList.remove('open');
}));

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealIO  = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 50);
      revealIO.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealIO.observe(el));


// ── PORTFOLIO : UNIVERS DEV / CRÉA ──
document.querySelectorAll('.universe-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const u = btn.dataset.u;
    document.querySelectorAll('.universe-btn').forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
    });
    document.querySelectorAll('[data-filters]').forEach(f => { f.hidden = f.dataset.filters !== u; });
    document.querySelectorAll('[data-grid]').forEach(g => {
      g.hidden = g.dataset.grid !== u;
      if (!g.hidden) g.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    });
  });
});

// ── PORTFOLIO : SOUS-ONGLETS (propres à chaque univers) ──
document.querySelectorAll('[data-filters]').forEach(group => {
  const grid = document.querySelector(`[data-grid="${group.dataset.filters}"]`);
  group.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.f;
      grid.querySelectorAll('.portfolio-card').forEach(card => {
        const match = f === 'all' || card.dataset.cat === f;
        card.style.transition = 'opacity 0.35s, transform 0.35s';
        card.style.opacity    = match ? '1' : '0.2';
        card.style.transform  = match ? '' : 'scale(0.97)';
        card.style.pointerEvents = match ? 'all' : 'none';
      });
    });
  });
});

// ── FAQ ──
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
});

// ── FORM ──
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const msg = document.getElementById('formMsg');
  msg.classList.add('show');
  e.target.reset();
  setTimeout(() => msg.classList.remove('show'), 5000);
});

// ── HERO PARALLAX ──
window.addEventListener('mousemove', e => {
  const circle = document.getElementById('photoCircle');
  if (!circle || window.innerWidth < 900) return;
  const cx = window.innerWidth * 0.75;
  const cy = window.innerHeight * 0.5;
  const dx = (e.clientX - cx) / cx * 6;
  const dy = (e.clientY - cy) / cy * 5;
  circle.style.transform = `translate(${dx}px,${dy}px)`;
});

// ── ACTIVE NAV ──
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (scrollY >= s.offsetTop - 120) cur = s.id; });
  navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
});




//-----------------------------------------------------------------------PARCOURS-----------------------------------------------------------------------
// ── PARCOURS HORIZONTAL ──
const parcoursSection = document.getElementById('parcours');
const parcoursLine = document.querySelector('.parcours-line');
const parcoursLineFill = document.querySelector('.parcours-line-fill');
const parcoursItems = document.querySelectorAll('.parcours-item');

if (parcoursSection && parcoursLine && parcoursLineFill && parcoursItems.length) {

  // place les points selon data-pos (%)
  parcoursItems.forEach(item => {
    const pos = parseFloat(item.dataset.pos || '0'); // ex: 10, 35, 65, 90
    item.style.left = pos + '%';
  });

  let parcoursAnimated = false;

  const obsParcours = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !parcoursAnimated) {
        parcoursAnimated = true;

        // anime la ligne (3s)
        parcoursLineFill.style.width = '100%';

        let progress = 0;
        const duration = 3000; // 3s
        const step = 30;       // ms
        const increment = 100 / (duration / step);

        const interval = setInterval(() => {
          progress += increment;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
          }

          parcoursItems.forEach(item => {
            const pos = parseFloat(item.dataset.pos || '0');
            if (progress >= pos) {
              item.classList.add('visible');
            }
          });
        }, step);
      }
    });
  }, { threshold: 0.3 });

  obsParcours.observe(parcoursSection);
}


// ==================== FOND ANIMÉ CANVAS ====================
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 80;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.25;
        this.speedY = Math.random() * 1 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 150)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ==================== FOOTER ====================

// ── Grand nom : lettres séparées, taille ajustée à la largeur, apparition au scroll ──
const wordmark = document.getElementById('footerWordmark');
if (wordmark) {
  const text = 'Bouaziz Mohamed';
  [...text].forEach((ch, i) => {
    const s = document.createElement('span');
    s.setAttribute('aria-hidden', 'true');
    s.className = ch === ' ' ? 'wm-char wm-space' : 'wm-char';
    s.style.setProperty('--i', i);
    s.textContent = ch === ' ' ? '' : ch;
    wordmark.appendChild(s);
  });

  const fitWordmark = () => {
    const box = wordmark.parentElement;
    const cs = getComputedStyle(box);
    const available = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    wordmark.style.fontSize = '100px';
    const chars = wordmark.querySelectorAll('.wm-char');
    const natural = chars[chars.length - 1].getBoundingClientRect().right - chars[0].getBoundingClientRect().left;
    wordmark.style.fontSize = Math.floor(100 * available / natural * 10) / 10 + 'px';
  };
  fitWordmark();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitWordmark);
  window.addEventListener('resize', fitWordmark);

  const wmIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        wordmark.classList.add('in');
        setTimeout(() => wordmark.classList.add('ready'), 1500);
        wmIO.disconnect();
      }
    });
  }, { threshold: 0.4 });
  wmIO.observe(wordmark);
}

// ── Heure à Béziers ──
const footerClock = document.getElementById('footerClock');
if (footerClock) {
  const tick = () => {
    footerClock.textContent = new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris'
    }).format(new Date());
  };
  tick();
  setInterval(tick, 30000);
}

// ── Année ──
const footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();
