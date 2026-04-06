/* =====================================================
   YIFERU MEKONNEN – PORTFOLIO JAVASCRIPT
   ===================================================== */

'use strict';

/* ──────────────────────────────────────────────────────
   1. DOM READY
────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTyped();
  initParticles();
  initScrollSpy();
  initAOS();
  initSkillTabs();
  initSkillBars();
  initCounters();
  initContactForm();
  initBackToTop();
  setFooterYear();
});

/* ──────────────────────────────────────────────────────
   2. NAVBAR – scroll shrink + hamburger
────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  // Scroll shrink
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('mobile-open');
  });

  // Close on nav-link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('mobile-open');
    });
  });
}

/* ──────────────────────────────────────────────────────
   3. TYPED TEXT EFFECT
────────────────────────────────────────────────────── */
function initTyped() {
  const el    = document.getElementById('typed-role');
  const roles = [
    'Data Scientist',
    'ML Engineer',
    'Deep Learning Developer',
    'Computer Vision Expert',
    'Big Data Enthusiast',
    'NLP Researcher',
  ];
  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let pause    = false;

  function tick() {
    const current = roles[roleIdx];

    if (!deleting) {
      // typing
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        pause = true;
        setTimeout(() => { pause = false; deleting = true; }, 1800);
      }
    } else {
      // deleting
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
      }
    }

    if (!pause) {
      const speed = deleting ? 50 : 90;
      setTimeout(tick, speed);
    }
  }

  tick();
}

/* ──────────────────────────────────────────────────────
   4. PARTICLE CANVAS
────────────────────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function create() {
    const count = Math.floor((W * H) / 18000);
    particles = Array.from({ length: count }, () => ({
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 1.5 + 0.4,
      dx:   (Math.random() - 0.5) * 0.4,
      dy:   (Math.random() - 0.5) * 0.4,
      o:    Math.random() * 0.5 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108,99,255,${p.o})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });

    // draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(108,99,255,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  create();
  draw();

  window.addEventListener('resize', () => { resize(); create(); }, { passive: true });
}

/* ──────────────────────────────────────────────────────
   5. SCROLL SPY (active nav + section)
────────────────────────────────────────────────────── */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

/* ──────────────────────────────────────────────────────
   6. SIMPLE AOS (Animate On Scroll)
────────────────────────────────────────────────────── */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────────────────────
   7. SKILL TABS
────────────────────────────────────────────────────── */
function initSkillTabs() {
  const tabs   = document.querySelectorAll('.stab');
  const panels = document.querySelectorAll('.skills-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t   => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById(`panel-${target}`);
      if (panel) {
        panel.classList.add('active');
        // Re-trigger AOS for newly shown panel
        panel.querySelectorAll('[data-aos]').forEach(el => {
          el.classList.remove('aos-animate');
          setTimeout(() => el.classList.add('aos-animate'), 50);
        });
        // Re-animate skill bars when core tab becomes active
        if (target === 'core') animateSkillBars();
      }
    });
  });
}

/* ──────────────────────────────────────────────────────
   8. SKILL BARS (progress animation)
────────────────────────────────────────────────────── */
function initSkillBars() {
  const skillsSection = document.getElementById('skills');
  let animated = false;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      animateSkillBars();
    }
  }, { threshold: 0.2 });

  if (skillsSection) observer.observe(skillsSection);
}

function animateSkillBars() {
  document.querySelectorAll('.skill-bar').forEach(bar => {
    const width = bar.dataset.width;
    // Reset then animate
    bar.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.width = width + '%';
      });
    });
  });
}

/* ──────────────────────────────────────────────────────
   9. COUNTER ANIMATION
────────────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.a-num[data-target]');
  let started    = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(counter => {
          const target   = parseInt(counter.dataset.target, 10);
          const duration = 1800;
          const start    = performance.now();

          function update(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease     = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(ease * target);
            if (progress < 1) requestAnimationFrame(update);
            else counter.textContent = target + '+';
          }

          requestAnimationFrame(update);
        });
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  const statsEl = document.querySelector('.about-stats');
  if (statsEl) observer.observe(statsEl);
}

/* ──────────────────────────────────────────────────────
   10. CONTACT FORM VALIDATION + SUBMIT
────────────────────────────────────────────────────── */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  if (!form) return;

  const nameEl    = document.getElementById('form-name');
  const emailEl   = document.getElementById('form-email');
  const messageEl = document.getElementById('form-message');
  const errName   = document.getElementById('err-name');
  const errEmail  = document.getElementById('err-email');
  const errMsg    = document.getElementById('err-message');
  const submitBtn = document.getElementById('form-submit-btn');
  const successEl = document.getElementById('form-success');

  function validate() {
    let valid = true;

    // Name
    if (!nameEl.value.trim()) {
      errName.textContent = 'Please enter your name.';
      nameEl.classList.add('error');
      valid = false;
    } else {
      errName.textContent = '';
      nameEl.classList.remove('error');
    }

    // Email
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailEl.value.trim() || !emailRe.test(emailEl.value)) {
      errEmail.textContent = 'Please enter a valid email address.';
      emailEl.classList.add('error');
      valid = false;
    } else {
      errEmail.textContent = '';
      emailEl.classList.remove('error');
    }

    // Message
    if (!messageEl.value.trim() || messageEl.value.trim().length < 10) {
      errMsg.textContent = 'Message must be at least 10 characters.';
      messageEl.classList.add('error');
      valid = false;
    } else {
      errMsg.textContent = '';
      messageEl.classList.remove('error');
    }

    return valid;
  }

  // Live validation
  [nameEl, emailEl, messageEl].forEach(el => {
    el.addEventListener('input', validate);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate send
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Sending…';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Send Message';
      successEl.classList.add('show');
      form.reset();

      // Build mailto link as actual send mechanism
      const name    = nameEl.value.trim()    || '';
      const email   = emailEl.value.trim()   || '';
      const subject = document.getElementById('form-subject').value.trim() || 'Portfolio Contact';
      const message = messageEl.value.trim() || '';

      const mailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      window.location.href =
        `mailto:yiferumekonne@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;

      setTimeout(() => successEl.classList.remove('show'), 6000);
    }, 1200);
  });
}

/* ──────────────────────────────────────────────────────
   11. BACK TO TOP
────────────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ──────────────────────────────────────────────────────
   12. FOOTER YEAR
────────────────────────────────────────────────────── */
function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ──────────────────────────────────────────────────────
   13. SMOOTH SCROLL for anchor links
────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ──────────────────────────────────────────────────────
   14. PROJECT CARD – tilt effect on hover (desktop)
────────────────────────────────────────────────────── */
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const xRel   = (e.clientX - rect.left) / rect.width  - 0.5;
      const yRel   = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `
        translateY(-8px)
        rotateY(${xRel * 8}deg)
        rotateX(${-yRel * 8}deg)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ──────────────────────────────────────────────────────
   15. SKILL CHIPS – ripple effect
────────────────────────────────────────────────────── */
document.querySelectorAll('.tool-chip').forEach(chip => {
  chip.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      border-radius:50%;
      background:rgba(255,255,255,0.2);
      transform:scale(0);
      animation:ripple 0.5s linear;
      pointer-events:none;
    `;
    if (!document.getElementById('ripple-style')) {
      const s = document.createElement('style');
      s.id = 'ripple-style';
      s.textContent = '@keyframes ripple{to{transform:scale(2);opacity:0;}}';
      document.head.appendChild(s);
    }
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* ──────────────────────────────────────────────────────
   16. GITHUB PROFILE – dynamic contribution graph embed
────────────────────────────────────────────────────── */
(function injectGithubWidget() {
  // Append a GitHub contribution chart image into the projects CTA area
  const cta = document.querySelector('.projects-cta');
  if (!cta) return;

  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    margin-top: 40px;
    padding: 28px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    text-align: center;
  `;

  wrapper.innerHTML = `
    <p style="color:var(--text-secondary);font-size:0.85rem;margin-bottom:16px;font-family:var(--font-mono);letter-spacing:1px;text-transform:uppercase;">GitHub Activity</p>
    <img
      src="https://ghchart.rshah.org/6c63ff/yiferu2123"
      alt="Yiferu Mekonnen GitHub Contributions"
      id="github-chart"
      style="max-width:100%;border-radius:8px;display:block;margin:0 auto;"
      onerror="this.parentElement.style.display='none'"
    />
    <a
      href="https://github.com/yiferu2123"
      target="_blank"
      rel="noopener noreferrer"
      style="display:inline-block;margin-top:16px;color:var(--accent-1);font-size:0.85rem;font-weight:600;"
    >github.com/yiferu2123 →</a>
  `;

  cta.appendChild(wrapper);
})();
