/* ============================================
   SUGHOSH DHUNGEL — PERSONAL LEGAL PORTFOLIO
   app.js — All interactions & animations
============================================ */

/* --- SCROLL PROGRESS BAR --- */
const progressBar = document.getElementById('progress-bar');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (scrollTop / docHeight * 100) + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

/* --- NAV SCROLL EFFECT --- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* --- MOBILE MENU --- */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* --- CURSOR SPOTLIGHT --- */
const spotlight = document.getElementById('cursor-spotlight');
if (spotlight) {
  document.addEventListener('mousemove', e => {
    spotlight.style.left = e.clientX + 'px';
    spotlight.style.top  = e.clientY + 'px';
  }, { passive: true });
}

/* --- TYPEWRITER EFFECT --- */
const roles = [
  'Legal Researcher',
  'Advocate',
  'BBM, LLB Graduate',
  'Treaty Analyst',
  'Moot Court Practitioner',
  'Corporate Lawyer'
];
let roleIndex = 0, charIndex = 0, deleting = false;
const tw = document.getElementById('typewriter');
if (tw) {
  function typeLoop() {
    const current = roles[roleIndex];
    if (!deleting) {
      tw.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 2000);
        return;
      }
    } else {
      tw.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 45 : 85);
  }
  setTimeout(typeLoop, 800);
}

/* --- SCROLL REVEAL --- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* --- COUNTER ANIMATION --- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat__num').forEach(el => counterObserver.observe(el));

/* --- SCALES OF JUSTICE ANIMATION --- */
const panLeft  = document.querySelector('.pan-left');
const panRight = document.querySelector('.pan-right');
if (panLeft && panRight) {
  let angle = 0;
  function animateScales() {
    angle += 0.012;
    const swing = Math.sin(angle) * 14;
    panLeft.setAttribute('transform',  `rotate(${swing},  32.5, 95)`);
    panRight.setAttribute('transform', `rotate(${-swing}, 167.5, 95)`);
    requestAnimationFrame(animateScales);
  }
  animateScales();
}

/* --- FLOATING LATIN TERMS --- */
document.querySelectorAll('.legal-floats span').forEach((el, i) => {
  const x   = Math.random() * 82 + 5;
  const y   = Math.random() * 78 + 5;
  const dur = 12 + Math.random() * 10;
  const delay = i * 0.9;
  el.style.cssText = `left:${x}%;top:${y}%;animation-duration:${dur}s;animation-delay:-${delay}s`;
});

/* --- LEGAL QUOTES ROTATOR --- */
const slides  = document.querySelectorAll('.quote-slide');
const dotsEl  = document.getElementById('q-dots');
const prevBtn = document.getElementById('q-prev');
const nextBtn = document.getElementById('q-next');
let currentQ  = 0, autoTimer;

if (slides.length && dotsEl) {
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'q-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Quote ${i + 1}`);
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
  });

  function goTo(n) {
    slides[currentQ].classList.remove('active');
    dotsEl.children[currentQ].classList.remove('active');
    currentQ = (n + slides.length) % slides.length;
    slides[currentQ].classList.add('active');
    dotsEl.children[currentQ].classList.add('active');
    resetTimer();
  }
  function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(currentQ + 1), 5000);
  }
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentQ - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentQ + 1));
  resetTimer();
}

/* --- 3D TILT ON EXPERIENCE CARDS --- */
document.querySelectorAll('.timeline-item__card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ============================================
   RADAR CHART (SVG Canvas)
============================================ */
function drawRadar() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 230, cy = 230, maxR = 170;
  const labels   = ['Corporate Law','Litigation','Intl. Law','Drafting','Family Law','Constitutional'];
  const values   = [0.82, 0.78, 0.85, 0.90, 0.72, 0.75];
  const colors   = ['#a78bfa','#2dd4bf','#fbbf24','#fb7185','#818cf8','#34d399'];
  const levels   = 5;
  const angleStep = (Math.PI * 2) / labels.length;
  let progress   = 0;

  function drawFrame(p) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Grid rings
    for (let l = 1; l <= levels; l++) {
      const r = (maxR / levels) * l;
      ctx.beginPath();
      for (let i = 0; i < labels.length; i++) {
        const a = i * angleStep - Math.PI / 2;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // Axes
    for (let i = 0; i < labels.length; i++) {
      const a = i * angleStep - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + maxR * Math.cos(a), cy + maxR * Math.sin(a));
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // Data polygon
    ctx.beginPath();
    for (let i = 0; i < labels.length; i++) {
      const a = i * angleStep - Math.PI / 2;
      const r = maxR * values[i] * p;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(167,139,250,0.15)';
    ctx.fill();
    ctx.strokeStyle = '#a78bfa';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Dots + Labels
    for (let i = 0; i < labels.length; i++) {
      const a = i * angleStep - Math.PI / 2;
      const r = maxR * values[i] * p;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = colors[i];
      ctx.fill();
      // Label
      const lx = cx + (maxR + 28) * Math.cos(a);
      const ly = cy + (maxR + 28) * Math.sin(a);
      ctx.fillStyle = 'rgba(226,226,240,0.85)';
      ctx.font = '500 12px Inter, sans-serif';
      ctx.textAlign = Math.abs(lx - cx) < 5 ? 'center' : lx > cx ? 'left' : 'right';
      ctx.textBaseline = ly < cy ? 'bottom' : 'top';
      ctx.fillText(labels[i], lx, ly);
    }
    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#a78bfa';
    ctx.fill();
  }

  // Animate in
  const radarObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      radarObs.disconnect();
      let start = null;
      function animate(ts) {
        if (!start) start = ts;
        progress = Math.min((ts - start) / 1200, 1);
        drawFrame(progress);
        if (progress < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    }
  }, { threshold: 0.3 });
  radarObs.observe(canvas);
}
drawRadar();

/* ============================================
   COURT HIERARCHY INFO BOX
============================================ */
function showCourtInfo(el) {
  const box  = document.getElementById('court-info-box');
  const text = document.getElementById('court-info-text');
  const info = el.getAttribute('data-info');
  text.textContent = info;
  box.classList.add('active');
  document.querySelectorAll('.court-node').forEach(n => n.classList.remove('selected'));
  el.classList.add('selected');
}

/* ============================================
   NST CLOCK
============================================ */
function updateNSTClocks() {
  const now = new Date();
  // NST = UTC + 5:45
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const nst = new Date(utc + (5 * 60 + 45) * 60000);
  const hh = String(nst.getHours()).padStart(2, '0');
  const mm = String(nst.getMinutes()).padStart(2, '0');
  const ss = String(nst.getSeconds()).padStart(2, '0');
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const timeStr = `${hh}:${mm}:${ss}`;
  const dateStr = `${days[nst.getDay()]}, ${nst.getDate()} ${months[nst.getMonth()]} ${nst.getFullYear()}`;
  const shortStr = `${hh}:${mm}`;

  const fullClock = document.getElementById('nst-clock');
  const dateClock = document.getElementById('nst-date');
  const heroClock = document.getElementById('hero-clock');
  if (fullClock) fullClock.textContent = timeStr;
  if (dateClock) dateClock.textContent = dateStr;
  if (heroClock) heroClock.textContent = shortStr;
}
updateNSTClocks();
setInterval(updateNSTClocks, 1000);

/* ============================================
   LEGAL OATH ANIMATION
============================================ */
const oathContent = `"I do not chase cases — I build arguments. I do not follow the law — I command it. Every brief I draft, every clause I dissect, every client I stand for carries the full weight of my conviction. I entered law not for prestige, but for purpose. Justice is not a concept I admire from a distance — it is a standard I hold myself to, every single day."`;

function startOath() {
  const el = document.getElementById('oath-text');
  if (!el) return;
  el.textContent = '';
  let i = 0;
  function nextChar() {
    if (i < oathContent.length) {
      el.textContent = oathContent.slice(0, ++i);
      setTimeout(nextChar, oathContent[i - 1] === ' ' ? 28 : 18);
    }
  }
  nextChar();
}

const oathObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    oathObs.disconnect();
    setTimeout(startOath, 400);
  }
}, { threshold: 0.4 });
const oathEl = document.getElementById('oath-text');
if (oathEl) oathObs.observe(oathEl);

/* ============================================
   GAVEL EASTER EGG
============================================ */
const gavelCard   = document.getElementById('gavel-card');
const gavelIcon   = document.getElementById('gavel-icon');
const gavelRipple = document.getElementById('gavel-ripple');
const gavelCount  = document.getElementById('gavel-count');
const gavelLabel  = document.getElementById('gavel-count-label');

const API_URL = 'http://localhost:3001/api/strikes';

const gavelMilestones = {
  1:   'First strike ⚖️',
  5:   'Order in the court!',
  10:  'Ten strikes — relentless.',
  25:  '25 — You mean business.',
  50:  'Fifty! Overruled, sustained, repeat.',
  100: '100 strikes. Case closed. 🏛️',
};

function setGavelDisplay(n) {
  if (gavelCount) gavelCount.textContent = Number(n).toLocaleString();
  if (gavelLabel) gavelLabel.textContent = n === 1 ? 'strike' : 'strikes';
}

function popGavelNum() {
  if (!gavelCount) return;
  gavelCount.classList.remove('pop');
  void gavelCount.offsetWidth;
  gavelCount.classList.add('pop');
  setTimeout(() => gavelCount.classList.remove('pop'), 150);
}

/* On load — fetch count from backend, fall back to localStorage */
fetch(API_URL)
  .then(r => r.json())
  .then(data => {
    setGavelDisplay(data.strikes);
    localStorage.setItem('gavelStrikes', data.strikes);
  })
  .catch(() => {
    // Backend offline — use localStorage
    setGavelDisplay(parseInt(localStorage.getItem('gavelStrikes') || '0', 10));
  });

if (gavelCard) {
  gavelCard.addEventListener('click', () => {
    // Swing animation
    gavelIcon.style.transform = 'rotate(-40deg) scale(1.35)';
    gavelRipple.classList.add('active');
    setTimeout(() => {
      gavelIcon.style.transform = '';
      gavelRipple.classList.remove('active');
    }, 480);

    /* POST to backend — increment on server */
    fetch(API_URL, { method: 'POST' })
      .then(r => r.json())
      .then(data => {
        setGavelDisplay(data.strikes);
        localStorage.setItem('gavelStrikes', data.strikes);
        popGavelNum();
        if (gavelMilestones[data.strikes]) showGavelToast(gavelMilestones[data.strikes]);
      })
      .catch(() => {
        // Backend offline — fall back to localStorage
        let n = parseInt(localStorage.getItem('gavelStrikes') || '0', 10) + 1;
        localStorage.setItem('gavelStrikes', n);
        setGavelDisplay(n);
        popGavelNum();
        if (gavelMilestones[n]) showGavelToast(gavelMilestones[n]);
      });
  });
}

function showGavelToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = [
    'position:fixed',
    'bottom:90px',
    'left:50%',
    'transform:translateX(-50%) translateY(10px)',
    'background:rgba(251,191,36,0.18)',
    'border:1px solid rgba(251,191,36,0.35)',
    'color:#fbbf24',
    'font-size:0.85rem',
    'font-weight:600',
    'letter-spacing:0.04em',
    'padding:10px 22px',
    'border-radius:40px',
    'backdrop-filter:blur(12px)',
    'z-index:9999',
    'pointer-events:none',
    'opacity:0',
    'transition:opacity 0.3s ease, transform 0.3s ease',
  ].join(';');
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-8px)';
    setTimeout(() => toast.remove(), 350);
  }, 2400);
}

// Also on logo click
const logoEl = document.querySelector('.nav__logo');
if (logoEl) {
  logoEl.addEventListener('click', () => {
    const flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;background:rgba(167,139,250,0.06);pointer-events:none;z-index:999;animation:flashOut 0.4s ease forwards';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 400);
  });
}

/* --- COPY TO CLIPBOARD --- */
document.querySelectorAll('.copy-text').forEach(el => {
  el.style.cursor = 'pointer';
  el.addEventListener('click', () => {
    const text = el.dataset.copy;
    const tip  = el.querySelector('.copy-tip');
    navigator.clipboard.writeText(text).then(() => {
      if (tip) {
        tip.textContent = '✓ Copied!';
        tip.classList.add('copied');
        setTimeout(() => {
          tip.textContent = 'Copy';
          tip.classList.remove('copied');
        }, 2000);
      }
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
  });
});

/* --- CONTACT FORM --- */
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.textContent = 'Sending…';
  setTimeout(() => {
    document.getElementById('contact-form').style.display = 'none';
    document.getElementById('form-success').classList.add('visible');
  }, 1200);
}

/* --- SMOOTH SCROLL --- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* --- TILT ON PROFILE IMAGE --- */
const profileImg = document.querySelector('.about__image');
if (profileImg) {
  profileImg.addEventListener('mousemove', e => {
    const r = profileImg.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    profileImg.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 10}deg) scale(1.03)`;
    profileImg.style.boxShadow = `${-x * 20}px ${-y * 20}px 40px rgba(167,139,250,0.25)`;
  });
  profileImg.addEventListener('mouseleave', () => {
    profileImg.style.transform = '';
    profileImg.style.boxShadow = '';
  });
}

/* ============================================
   STRIDE COUNTER
============================================ */
(function () {
  // Legal journey start — KU School of Law, August 2021
  const journeyStart = new Date('2021-08-01T00:00:00');

  function calcDays() {
    return Math.floor((Date.now() - journeyStart.getTime()) / 86400000);
  }

  function animateStride(el, target, duration) {
    const start = performance.now();
    const update = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (p < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const strideSection = document.getElementById('stride');
  if (!strideSection) return;

  const strideObs = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    strideObs.disconnect();

    // Animate live days counter
    const daysEl = document.getElementById('stride-days');
    if (daysEl) animateStride(daysEl, calcDays(), 2200);

    // Animate static counters
    strideSection.querySelectorAll('.stride-count').forEach(el => {
      animateStride(el, parseInt(el.dataset.target, 10), 2000);
    });
  }, { threshold: 0.25 });

  strideObs.observe(strideSection);
})();

/* --- BACK TO TOP BUTTON --- */
const backTop = document.createElement('button');
backTop.innerHTML = '↑';
backTop.className = 'back-top';
backTop.title = 'Back to top';
backTop.setAttribute('aria-label', 'Back to top');
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(backTop);
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
