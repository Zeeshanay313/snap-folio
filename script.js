document.addEventListener('DOMContentLoaded', function () {
  // ——————————————————————————————
  // Skills bar animation
  // ——————————————————————————————
  document.querySelectorAll('.skills-card').forEach(card => {
    card.querySelectorAll('.progress-bar.bg-gold').forEach(bar => {
      const percent = parseInt(bar.getAttribute('data-target'), 10);
      const label = bar.closest('.skills-progress')
                       .previousElementSibling
                       .querySelector('.percent-text');
      if (!label) return;
      label.textContent = '0%';
      bar.style.width = '0%';

      let current = 0;
      const duration = 1200;
      const step = Math.max(Math.floor(duration / percent), 10);

      setTimeout(() => {
        const timer = setInterval(() => {
          current++;
          label.textContent = current + '%';
          if (current >= percent) {
            clearInterval(timer);
          }
        }, step);

        bar.style.width = percent + '%';
      }, 200);
    });
  });

  // ——————————————————————————————
  // Resume skills bar animation
  // ——————————————————————————————
  document.querySelectorAll('.resume-skills .progress-bar.bg-gold').forEach(bar => {
    const pct = parseInt(bar.getAttribute('aria-valuenow'), 10);
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.transition = 'width 1.2s cubic-bezier(.4,2,.6,1)';
      bar.style.width = pct + '%';
    }, 200);
  });

  // ——————————————————————————————
  // Portfolio filter & placeholder logic
  // ——————————————————————————————
  function updatePortfolioPlaceholders() {
    const container = document.querySelector('.portfolio-container');
    if (!container) return;

    // remove any old placeholders
    container.querySelectorAll('.portfolio-placeholder').forEach(el => el.remove());

    // collect all visible real items
    const realItems = Array.from(container.children)
      .filter(el => el.classList.contains('portfolio-item') && !el.classList.contains('hidden'));

    // decide how many cols (you can tweak breakpoints here)
    let cols = 3;
    if (window.innerWidth < 900) cols = 2;
    if (window.innerWidth < 600) cols = 1;

    const remainder = realItems.length % cols;
    const needed = remainder === 0 ? 0 : cols - remainder;

    if (needed > 0 && realItems.length > 0) {
      // grab the size of the first visible item
      const rect = realItems[0].getBoundingClientRect();

      for (let i = 0; i < needed; i++) {
        const ph = document.createElement('div');
        ph.className = 'portfolio-item portfolio-placeholder';
        ph.style.visibility = 'hidden';
        ph.style.width      = rect.width + 'px';
        ph.style.height     = rect.height + 'px';
        container.appendChild(ph);
      }
    }
  }

  // wire up filters
  const filters     = document.querySelectorAll('#portfolio-flters li');
  const allItems    = document.querySelectorAll('.portfolio-item');

  filters.forEach(btn => btn.addEventListener('click', function () {
    filters.forEach(b => b.classList.remove('filter-active'));
    this.classList.add('filter-active');

    const f = this.getAttribute('data-filter');
    allItems.forEach(item => {
      if (f === '*' || item.classList.contains(f.slice(1))) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });

    updatePortfolioPlaceholders();
  }));

  // re-calc on resize
  window.addEventListener('resize', updatePortfolioPlaceholders);

  // trigger the first load
  const active = document.querySelector('#portfolio-flters .filter-active') || filters[0];
  if (active) active.click();

  // ——————————————————————————————
  // AOS init
  // ——————————————————————————————
  if (window.AOS) {
    AOS.init({ once: true, duration: 900, offset: 100 });
  }

  // ——————————————————————————————
  // Sidebar dropdown toggle
  // ——————————————————————————————
  document.querySelectorAll('.nav-item.dropdown').forEach(dd => {
    const toggle = dd.querySelector('.dropdown-toggle') || dd;
    toggle.addEventListener('click', () => dd.classList.toggle('active'));
  });

  // ——————————————————————————————
  // Scroll‑spy nav
  // ——————————————————————————————
  const navLinks = document.querySelectorAll('.nav-item > a');
  const sections = document.querySelectorAll('section[id], .container[id]');

  function onScroll() {
    const scrollY = window.pageYOffset;
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (scrollY >= top && scrollY < top + sec.offsetHeight) {
        currentId = sec.getAttribute('id');
      }
    });
    navLinks.forEach(a => {
      const isActive = a.getAttribute('href').slice(1) === currentId;
      a.parentElement.classList.toggle('active', isActive);
    });
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  navLinks.forEach(a => {
    a.addEventListener('click', () => {
      navLinks.forEach(x => x.parentElement.classList.remove('active'));
      a.parentElement.classList.add('active');
    });
  });

  // ——————————————————————————————
  // Typewriter effect
  // ——————————————————————————————
  (function typewriter() {
    const phrases = ["UI/UX Designer","Web Developer","Creative Designer","Freelancer"];
    const el      = document.querySelector(".typewriter-text");
    if (!el) return;

    let p = 0, c = 0, deleting = false;
    const TYPING = 80, ERASING = 45, DELAY = 1100;

    function tick() {
      const text = phrases[p];
      if (!deleting) {
        el.textContent = text.slice(0, ++c);
        if (c === text.length) {
          deleting = true;
          return setTimeout(tick, DELAY);
        }
      } else {
        el.textContent = text.slice(0, --c);
        if (c === 0) {
          deleting = false;
          p = (p + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? ERASING : TYPING);
    }
    tick();
  })();

  // ——————————————————————————————
  // Stats counter
  // ——————————————————————————————
  function animateCounter(el) {
    const target = +el.getAttribute('data-target');
    const duration = 2000;
    let current = 0;
    const step = target / (duration / 16);

    function update() {
      current += step;
      el.textContent = Math.floor(current);
      if (current < target) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }
    update();
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: .3, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.counter').forEach(c => observer.observe(c));
});
