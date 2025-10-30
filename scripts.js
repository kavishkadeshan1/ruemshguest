/* Kavishka Diving & Snorkeling Center - v2.0 JS
   Features: mobile navbar collapse, reveal on scroll, gallery lightbox,
             testimonial auto-advance, contact form preview + WhatsApp link
*/

document.addEventListener('DOMContentLoaded', () => {
  // Inject shared header/footer and decorative bubbles on pages that don't have them
  const headerHTML = `
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top" aria-label="Main navigation">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center" href="index.html" aria-label="Kavishka Diving & Snorkeling Center home">
        <img src="images/logo.svg" width="32" height="32" alt="Kavishka logo" class="me-2" />
        <span class="brand-text">Kavishka Diving & Snorkeling Center</span>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-controls="navMain" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMain">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
          <li class="nav-item"><a class="nav-link" href="services.html">Services</a></li>
          <li class="nav-item"><a class="nav-link" href="packages.html">Packages</a></li>
          <li class="nav-item"><a class="nav-link" href="gallery.html">Gallery</a></li>
          <li class="nav-item"><a class="nav-link cta ms-lg-3" href="contact.html">Contact</a></li>
        </ul>
      </div>
    </div>
  </nav>`;

  const footerHTML = `
  <footer class="py-5 border-top" role="contentinfo">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-4">
          <h5 class="fw-bold">Kavishka Diving & Snorkeling Center</h5>
          <p class="mb-1">Mirissa, Southern Province, Sri Lanka</p>
          <p class="mb-1">Open daily: 8:00 AM – 6:00 PM</p>
          <div class="d-flex gap-3 mt-3">
            <a href="#" aria-label="Facebook" class="social-icon"><i class="bi bi-facebook"></i></a>
            <a href="#" aria-label="Instagram" class="social-icon"><i class="bi bi-instagram"></i></a>
            <a href="#" aria-label="WhatsApp" class="social-icon"><i class="bi bi-whatsapp"></i></a>
          </div>
        </div>
        <div class="col-lg-4">
          <h6 class="fw-bold">Quick Links</h6>
          <ul class="list-unstyled">
            <li><a href="about.html">About</a></li>
            <li><a href="services.html">Services</a></li>
            <li><a href="packages.html">Packages</a></li>
            <li><a href="gallery.html">Gallery</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="col-lg-4">
          <h6 class="fw-bold">Contact</h6>
          <ul class="list-unstyled">
            <li><a href="tel:+94123456789">+94 12 345 6789</a></li>
            <li><a href="mailto:info@kavikashadiving.com">info@kavikashadiving.com</a></li>
          </ul>
        </div>
      </div>
      <div class="text-center mt-4 text-muted">
        <small>© <span id="year"></span> Kavishka Diving & Snorkeling Center. All rights reserved.</small>
      </div>
    </div>
  </footer>`;

  const bubblesHTML = `
  <div class="ocean-bubbles" aria-hidden="true">
    <span class="bubble" style="left:6%; width:10px; height:10px; animation-delay:0s; bottom:48px"></span>
    <span class="bubble" style="left:18%; width:16px; height:16px; animation-delay:2s; bottom:36px"></span>
    <span class="bubble" style="left:32%; width:8px; height:8px; animation-delay:1s; bottom:52px"></span>
    <span class="bubble" style="left:50%; width:14px; height:14px; animation-delay:3s; bottom:44px"></span>
    <span class="bubble" style="left:68%; width:9px; height:9px; animation-delay:1.5s; bottom:40px"></span>
    <span class="bubble" style="left:84%; width:18px; height:18px; animation-delay:2.5s; bottom:30px"></span>
  </div>`;

  // Insert header if missing
  if (!document.querySelector('.navbar')) {
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
  }
  // Ensure every page has the ocean-themed footer: replace existing footer or insert one
  const existingFooter = document.querySelector('footer');
  if (existingFooter) {
    // Replace existing footer with ocean footer and bubbles
    existingFooter.outerHTML = bubblesHTML + footerHTML;
  } else {
    document.body.insertAdjacentHTML('beforeend', bubblesHTML + footerHTML);
  }

  // Clean up images across pages: remove query strings and replace some externals with local placeholders
  const imgMapByAlt = {
    'turtle': 'images/turtle-snorkel.svg',
    'night': 'images/night-dive.svg',
    'fun': 'images/fun-dive.svg',
    'underwater': 'images/underwater.svg',
    'logo': 'images/logo.svg'
  };
  document.querySelectorAll('img').forEach(img => {
    try {
      // Skip image cleanup for gallery images that explicitly want to preserve their src
      if (img.dataset.preserve === 'true' || img.classList.contains('preserve-src') || img.closest('#rotating-gallery')) return;
      const src = img.getAttribute('src') || img.src || '';
      if (!src) return;
      // remove query strings
      if (src.includes('?')) {
        const clean = src.split('?')[0];
        img.src = clean;
      }
      // if image is external and likely from unsplash/wikimedia, try to use a local placeholder
      const lower = (img.alt || '').toLowerCase();
      const srcLower = (img.src || '').toLowerCase();
      if (srcLower.includes('unsplash') || srcLower.includes('upload.wikimedia.org') || srcLower.includes('images.unsplash')) {
        // pick based on alt text
        for (const key in imgMapByAlt) {
          if (lower.includes(key) || srcLower.includes(key)) { img.src = imgMapByAlt[key]; return; }
        }
        // fallback to underwater placeholder
        img.src = 'images/underwater.svg';
      }
    } catch (e) {
      // ignore per-image failures
      console.warn('img cleanup failed', e);
    }
  });

  // Header shadow on scroll
  const nav = document.querySelector('.navbar');
  const onScroll = () => {
    if (window.scrollY > 8) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Collapse mobile navbar when a nav link is clicked (improves mobile UX)
  try {
    document.querySelectorAll('.navbar-collapse .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const collapseEl = document.querySelector('.navbar-collapse');
        if (!collapseEl) return;
        if (collapseEl.classList.contains('show') && window.bootstrap) {
          const inst = bootstrap.Collapse.getInstance(collapseEl) || new bootstrap.Collapse(collapseEl, { toggle: false });
          inst.hide();
        }
      });
    });
  } catch (err) {
    // noop
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Testimonial auto-advance (if carousel exists)
  const tc = document.querySelector('#testimonialCarousel');
  if (tc && window.bootstrap) {
    const inst = new bootstrap.Carousel(tc, { interval: 5000, wrap: true });
  }

  // Gallery Lightbox
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const imgEl = lightbox.querySelector('.lightbox-img');
    const capEl = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    const openLightbox = (src, alt, caption) => {
      imgEl.src = src;
      imgEl.alt = alt || '';
      capEl.textContent = caption || alt || '';
      lightbox.classList.remove('d-none');
      document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
      lightbox.classList.add('d-none');
      imgEl.src = '';
      document.body.style.overflow = '';
    };

    galleryItems.forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const full = a.getAttribute('data-full') || a.href;
        const img = a.querySelector('img');
        openLightbox(full, img?.alt, a.getAttribute('data-caption'));
      });
    });
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.classList.contains('d-none')) closeLightbox();
    });
  }

  // Contact form handling (client-side demo)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    // Preselect tour from URL param if present
    const params = new URLSearchParams(window.location.search);
    const selected = params.get('selected');
    const tourSelect = document.getElementById('tour');
    if (selected && tourSelect) {
      [...tourSelect.options].forEach(opt => {
        if (opt.text.toLowerCase() === selected.toLowerCase()) opt.selected = true;
      });
    }

  // WhatsApp link builder
  // Set the destination WhatsApp number here (international format, no spaces)
  const phone = '+94760224529'; // user-requested destination
    const updateWhatsAppLink = () => {
      const waLink = document.getElementById('whatsappLink');
      const name = document.getElementById('name')?.value || '';
      const email = document.getElementById('email')?.value || '';
      const phoneInput = document.getElementById('phone')?.value || '';
      const tour = document.getElementById('tour')?.value || 'Tour Booking';
      const message = document.getElementById('message')?.value || '';
      const text =
        `Hello Kavishka Diving,
I'd like to book: ${tour}
Name: ${name}
Email: ${email}
Phone: ${phoneInput}
Message: ${message}`;
      const url = `https://wa.me/${phone.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(text)}`;
      if (waLink) waLink.href = url;
    };
    ['input','change'].forEach(ev => {
      contactForm.addEventListener(ev, updateWhatsAppLink);
    });
    updateWhatsAppLink();

    // Form submit: open WhatsApp with the filled details when valid
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        return;
      }
      // Ensure the WhatsApp link is up-to-date
      updateWhatsAppLink();
      const waLinkEl = document.getElementById('whatsappLink');
      const waUrl = waLinkEl?.href || (() => {
        // Fallback build (same format as updateWhatsAppLink)
        const name = document.getElementById('name')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const phoneInput = document.getElementById('phone')?.value || '';
        const tour = document.getElementById('tour')?.value || 'Tour Booking';
        const message = document.getElementById('message')?.value || '';
        const text = `Hello Kavishka Diving,%0ALike to book: ${tour}%0AName: ${name}%0AEmail: ${email}%0APhone: ${phoneInput}%0AMessage: ${message}`;
        return `https://wa.me/${phone.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(text)}`;
      })();

      // Open WhatsApp in a new tab/window. On mobile this will open the WhatsApp app when available.
      try {
        window.open(waUrl, '_blank');
        const status = document.getElementById('formStatus');
        if (status) status.innerHTML = '<div class="alert alert-success">Opening WhatsApp to send your message…</div>';
        // Optionally reset the form after a short delay
        setTimeout(() => { contactForm.reset(); updateWhatsAppLink(); }, 900);
      } catch (err) {
        const status = document.getElementById('formStatus');
        if (status) status.innerHTML = '<div class="alert alert-danger">Could not open WhatsApp. Please use the WhatsApp button below.</div>';
      }
    });
  }

  /* ==========================
     Additional animations & UI behaviors
     ========================== */

  // 1) Preloader overlay
  const showPreloader = () => {
    if (document.querySelector('.preloader')) return;
    const pre = document.createElement('div');
    pre.className = 'preloader';
    pre.innerHTML = `<div class="loader"><div class="droplet" aria-hidden="true"></div><div style="opacity:.9">Loading...</div></div>`;
    document.body.appendChild(pre);
    // hide after window load
    window.addEventListener('load', () => {
      setTimeout(() => pre.classList.add('hidden'), 350);
      setTimeout(() => pre.remove(), 900);
    });
  };
  showPreloader();

  // 2) Hero parallax, waves and staggered text
  const hero = document.querySelector('.hero-banner');
  if (hero) {
    // wrap content so we can move inner for parallax
    const inner = hero.querySelector('.hero-content');
    if (inner && !hero.querySelector('.hero-inner')) {
      const wrap = document.createElement('div');
      wrap.className = 'hero-inner';
      while (inner.firstChild) wrap.appendChild(inner.firstChild);
      inner.appendChild(wrap);
    }
    // waves overlay
    if (!hero.querySelector('.hero-waves')) {
      const waves = document.createElement('div');
      waves.className = 'hero-waves';
      waves.innerHTML = `<svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg"><path fill="#0ea5a1" opacity="0.08" d="M0 40 C 220 0, 440 80, 720 40 C 1000 0, 1220 80, 1440 40 L1440 120 L0 120 Z"/></svg>`;
      hero.appendChild(waves);
    }

    // parallax on scroll (desktop only)
    const heroInner = hero.querySelector('.hero-inner');
    const applyParallax = () => {
      const sc = window.scrollY;
      if (heroInner) {
        const rect = hero.getBoundingClientRect();
        const offset = Math.max(0, -rect.top);
        // move up slower than scroll
        heroInner.style.transform = `translateY(${Math.min(offset * 0.25, 120)}px)`;
      }
    };
    window.addEventListener('scroll', applyParallax, { passive: true });
    applyParallax();

    // stagger hero text reveal on load
    const heroTextChildren = hero.querySelectorAll('.stagger');
    heroTextChildren.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 160 * i + 180);
    });
    // floating effect for elements with .floaty
    (hero.querySelectorAll('.floaty') || []).forEach(el => el.classList.add('floaty'));
  }

  // 3) CTA ripple effect
  document.querySelectorAll('.btn.ripple, .btn-primary').forEach(btn => {
    btn.classList.add('ripple', 'btn-modern');
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const r = document.createElement('span');
      r.className = 'ripple-el';
      const size = Math.max(rect.width, rect.height) * 1.6;
      r.style.width = r.style.height = size + 'px';
      r.style.left = (e.clientX - rect.left - size / 2) + 'px';
      r.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(r);
      requestAnimationFrame(() => r.style.transform = 'scale(1)');
      setTimeout(() => r.remove(), 600);
    });
  });

  // 4) Scroll indicator: hide after first scroll
  if (hero) {
    if (!hero.querySelector('.scroll-indicator')) {
      const ind = document.createElement('div');
      ind.className = 'scroll-indicator';
      ind.innerHTML = '<span class="arrow" aria-hidden="true"></span>';
      hero.appendChild(ind);
      const hideOnScroll = () => { ind.style.transition = 'opacity 0.4s ease'; ind.style.opacity = '0'; setTimeout(()=>ind.remove(),700); window.removeEventListener('scroll', hideOnScroll); };
      window.addEventListener('scroll', hideOnScroll, { once: true, passive: true });
    }
  }

  // 5) Enhanced reveal observer: supports data-animation and data-delay
  const enhancedObserver = (function(){
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseFloat(el.dataset.delay || '0') * 1000;
          const anim = el.dataset.animation || 'fade';
          setTimeout(()=> {
            if (anim === 'slide-up') el.classList.add('slide-up');
            if (anim === 'fade') el.classList.add('fade-in');
            el.classList.add('visible');
            // for staggered grids, add visible to children with delays
            if (el.classList.contains('stagger-grid')) {
              const children = Array.from(el.children);
              children.forEach((c,i)=> setTimeout(()=> c.classList.add('visible'), i * 80));
            }
          }, delay);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    return { observe: el => obs.observe(el) };
  })();

  /* Rotating gallery carousel: slides per view responsive, autoplay, dots, touch */
  (function initRotatingGallery(){
    const wrap = document.getElementById('rotating-gallery');
    if (!wrap) return;
    const track = wrap.querySelector('.gallery-track');
    const slides = Array.from(track.querySelectorAll('.gallery-slide'));
    const prev = document.getElementById('galleryPrev');
    const next = document.getElementById('galleryNext');
    const dotsWrap = document.getElementById('galleryDots');
    if (!slides.length) return;

    let slidesPerView = 1;
    const resize = () => {
      if (window.matchMedia('(min-width:1200px)').matches) slidesPerView = 4;
      else if (window.matchMedia('(min-width:768px)').matches) slidesPerView = 2;
      else slidesPerView = 1;
      // ensure track width / slide widths are handled by CSS; we'll compute translate by slide width
      slideWidth = slides[0].getBoundingClientRect().width;
      goTo(current); // reposition
    };

    let current = 0;
    let slideWidth = 0;
    const INTERVAL = 4500;
    let timer = null;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // create dots (one per slide)
    const dots = [];
    slides.forEach((_,i) => { const b = document.createElement('button'); b.type='button'; b.dataset.index = i; b.setAttribute('aria-label', 'Go to image '+(i+1)); b.addEventListener('click', ()=>{ goTo(i); pauseAutoplay(); }); dotsWrap.appendChild(b); dots.push(b); });

    function updateDots(){ dots.forEach(d=>d.classList.remove('active')); const activeIndex = current % slides.length; if (dots[activeIndex]) dots[activeIndex].classList.add('active'); }

    function goTo(i){
      current = (i + slides.length) % slides.length;
      const x = -(current * slideWidth);
      track.style.transform = `translateX(${x}px)`;
      updateDots();
    }
    function nextSlide(){ goTo(current+1); }
    function prevSlide(){ goTo(current-1); }

    // autoplay
    function startAutoplay(){ if (reduced) return; stopAutoplay(); timer = setInterval(nextSlide, INTERVAL); }
    function stopAutoplay(){ if (timer) { clearInterval(timer); timer = null; } }
    function pauseAutoplay(ms=5000){ stopAutoplay(); if (!reduced) setTimeout(startAutoplay, ms); }

    // controls
    next?.addEventListener('click', ()=>{ nextSlide(); pauseAutoplay(); });
    prev?.addEventListener('click', ()=>{ prevSlide(); pauseAutoplay(); });

    // touch support
    (function touch(){ let startX=0, dist=0, moving=false; track.addEventListener('touchstart', e=>{ startX = e.touches[0].clientX; moving=true; stopAutoplay(); }); track.addEventListener('touchmove', e=>{ if(!moving) return; dist = e.touches[0].clientX - startX; track.style.transform = `translateX(${-(current*slideWidth) + dist}px)`; }); track.addEventListener('touchend', ()=>{ moving=false; if (dist > 40) { prevSlide(); } else if (dist < -40) { nextSlide(); } track.style.transform = `translateX(${-(current*slideWidth)}px)`; dist=0; pauseAutoplay(); }); })();

    // keyboard navigation
    wrap.addEventListener('keydown', e=>{ if (e.key==='ArrowLeft') { prevSlide(); pauseAutoplay(); } if (e.key==='ArrowRight') { nextSlide(); pauseAutoplay(); } });

    window.addEventListener('resize', resize);
    // init
    resize();
    goTo(0);
    startAutoplay();

    // pause on hover/focus
    wrap.addEventListener('mouseenter', stopAutoplay);
    wrap.addEventListener('mouseleave', ()=>{ if (!reduced) startAutoplay(); });
    wrap.querySelectorAll('button, a').forEach(el => { el.addEventListener('focus', stopAutoplay); el.addEventListener('blur', ()=>{ if (!reduced) startAutoplay(); }); });
  })();
  // observe elements with data-animation or with common classes
  document.querySelectorAll('[data-animation], .slide-up, .fade-in, .stagger-grid, .reveal').forEach(el => enhancedObserver.observe(el));

  // 6) Scroll progress indicator
  if (!document.querySelector('.scroll-progress')) {
    const sp = document.createElement('div'); sp.className = 'scroll-progress'; document.body.appendChild(sp);
    window.addEventListener('scroll', () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const pct = height ? (window.scrollY / height) * 100 : 0;
      sp.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }, { passive: true });
  }

  // 7) Scroll-to-top button
  if (!document.querySelector('.to-top')) {
    const t = document.createElement('button'); t.className = 'to-top'; t.title = 'Back to top'; t.innerHTML = '&#8679;'; document.body.appendChild(t);
    const toggle = () => { if (window.scrollY > 480) t.classList.add('visible'); else t.classList.remove('visible'); };
    window.addEventListener('scroll', toggle, { passive: true });
    t.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
    toggle();
  }

  // 8) FAQ accordion smooth expand/collapse (requires markup .faq .question + .answer)
  document.querySelectorAll('.faq .question').forEach(q => {
    q.addEventListener('click', () => {
      const ans = q.nextElementSibling;
      if (!ans) return;
      const isOpen = ans.classList.contains('open');
      if (isOpen) {
        // smoothly collapse
        const height = ans.scrollHeight;
        ans.style.height = height + 'px';
        requestAnimationFrame(()=> { ans.style.height = '0px'; });
        ans.classList.remove('open');
      } else {
        // expand
        ans.style.height = 'auto';
        const height = ans.scrollHeight + 'px';
        ans.style.height = '0px';
        requestAnimationFrame(()=> { ans.style.height = height; });
        ans.classList.add('open');
        // clear inline height after transition
        ans.addEventListener('transitionend', function clear() { ans.style.height = 'auto'; ans.removeEventListener('transitionend', clear); });
      }
    });
  });

  // 9) Contact form floating labels: add class when value present or focus
  // Support both legacy .form-group and Bootstrap's .form-floating markup
  document.querySelectorAll('.form-group input, .form-group textarea, .form-floating input, .form-floating textarea, .form-floating select').forEach(inp => {
    const toggle = () => { if (inp.value && inp.value.trim()) inp.classList.add('has-value'); else inp.classList.remove('has-value'); };
    inp.addEventListener('input', toggle);
    inp.addEventListener('blur', toggle);
    toggle();
  });

  // 10) Improve testimonial carousel: add fade if bootstrap present
  if (window.bootstrap) {
    document.querySelectorAll('#testimonialCarousel').forEach(car => car.classList.add('carousel-fade'));
    // ensure auto-init handled earlier
  }

  /* ==========================
     Guest reviews slider (custom lightweight carousel)
     Features: autoplay, prev/next, dots, touch swipe, keyboard, AOS fallback
  ========================== */
  (function initReviewsCarousel(){
    const wrap = document.getElementById('guest-reviews');
    if (!wrap) return;
    const slider = wrap.querySelector('.reviews-slider');
    const slides = Array.from(slider.querySelectorAll('.review-card'));
    const prevBtn = document.getElementById('revPrev');
    const nextBtn = document.getElementById('revNext');
    const dotsWrap = document.getElementById('revDots');
    if (!slides.length) return;

    // Accessibility & state
    let current = 0;
    let autoplay = true;
    const INTERVAL = 5500; // autoplay interval (ms)
    let timer = null;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // initialize slides and dots
    slides.forEach((s,i) => { s.classList.remove('active'); s.setAttribute('aria-hidden', 'true'); s.dataset.index = i; });
    const dots = [];
    slides.forEach((_,i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = i===0? 'active':''; b.setAttribute('aria-label', `Go to review ${i+1}`);
      b.dataset.index = i; b.addEventListener('click', () => { goTo(parseInt(b.dataset.index,10)); pauseAutoplay(5000); });
      dotsWrap.appendChild(b); dots.push(b);
    });

    // show a slide
    function show(i){
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      const slide = slides[i];
      if (!slide) return;
      slide.classList.add('active'); slide.removeAttribute('aria-hidden');
      dots[i].classList.add('active');
    }

    function goTo(i){
      current = (i + slides.length) % slides.length;
      show(current);
    }

    function next(){ goTo(current+1); }
    function prev(){ goTo(current-1); }

    // Autoplay handling
    function startAutoplay(){ if (reduced) return; stopAutoplay(); timer = setInterval(next, INTERVAL); }
    function stopAutoplay(){ if (timer) { clearInterval(timer); timer = null; } }
    function pauseAutoplay(ms=6000){ stopAutoplay(); if (!reduced) setTimeout(startAutoplay, ms); }

    // Hook controls
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); pauseAutoplay(5000); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); pauseAutoplay(5000); });

    // keyboard support when focused
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { prev(); pauseAutoplay(5000); }
      if (e.key === 'ArrowRight') { next(); pauseAutoplay(5000); }
    });

    // pause on hover/focus
    wrap.addEventListener('mouseenter', () => { stopAutoplay(); });
    wrap.addEventListener('mouseleave', () => { if (autoplay) startAutoplay(); });
    wrap.querySelectorAll('button, a').forEach(el => { el.addEventListener('focus', () => stopAutoplay()); el.addEventListener('blur', () => { if (autoplay) startAutoplay(); }); });

    // touch swipe support
    (function touchSwipe(){
      let startX = 0, dist = 0, started = false;
      slider.addEventListener('touchstart', (e)=>{ started=true; startX = e.touches[0].clientX; dist = 0; });
      slider.addEventListener('touchmove', (e)=>{ if (!started) return; dist = e.touches[0].clientX - startX; });
      slider.addEventListener('touchend', ()=>{ if (!started) return; started=false; const threshold = 40; if (dist > threshold) { prev(); pauseAutoplay(5000); } else if (dist < -threshold) { next(); pauseAutoplay(5000); } dist = 0; });
    })();

    // Visibility change: pause autoplay when tab hidden
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopAutoplay(); else if (autoplay) startAutoplay(); });

    // Start
    goTo(0);
    if (autoplay) startAutoplay();

    // AOS fallback: if AOS not present, reveal on intersection
    if (window.AOS) {
      try { AOS.refresh(); } catch(e){}
    } else if ('IntersectionObserver' in window) {
      const aels = wrap.querySelectorAll('[data-aos]');
      const aobs = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('aos-animate'); aobs.unobserve(en.target);} }), {threshold:0.12});
      aels.forEach(el => aobs.observe(el));
    }

  })();

  /* ==========================
     Gallery: Masonry layout, filtering, enhanced lightbox
     - Computes grid row spans based on images heights
     - Filters items with smooth transitions
     - Lightbox with prev/next, counter, keyboard and swipe
  ========================== */
  (function initGallery(){
    const grid = document.getElementById('masonryGrid');
    if (!grid) return;
    const items = Array.from(grid.querySelectorAll('.masonry-item'));
    const links = items.map(it => it.querySelector('a.gallery-item')).filter(Boolean);

    // If the grid is a uniform square grid, skip complex masonry maths
    const uniform = grid.classList.contains('uniform-grid');

    // Helpers to compute row sizing from CSS grid values (used by masonry only)
    const getGridNumbers = () => {
      const cs = getComputedStyle(grid);
      const row = parseFloat(cs.getPropertyValue('grid-auto-rows')) || 8;
      const gap = parseFloat(cs.getPropertyValue('row-gap')) || parseFloat(cs.getPropertyValue('grid-row-gap')) || 8;
      return { row, gap };
    };

    const resizeItem = (item) => {
      if (uniform) {
        // ensure uniform grids are single row spans
        item.style.gridRowEnd = 'span 1';
        return;
      }
      const img = item.querySelector('img');
      if (!img) return;
      const caption = item.querySelector('figcaption');
      const { row, gap } = getGridNumbers();
      // measure height of image + caption
      const imgH = img.getBoundingClientRect().height;
      const capH = caption ? caption.getBoundingClientRect().height : 0;
      const total = Math.ceil(imgH + capH);
      const rowSpan = Math.max(1, Math.ceil((total + gap) / (row + gap)));
      item.style.gridRowEnd = `span ${rowSpan}`;
    };

    const layoutAll = () => items.forEach(i => resizeItem(i));

    // Ensure images when loaded cause a layout update
    items.forEach(item => {
      const img = item.querySelector('img');
      if (!img) return;
      // remove placeholder blur when loaded
      const onLoad = () => { img.classList.add('loaded'); resizeItem(item); };
      img.addEventListener('load', onLoad);
      if (img.complete && img.naturalHeight) onLoad();
    });

    // Re-layout on resize (debounced)
    let rTO = null;
    window.addEventListener('resize', () => { clearTimeout(rTO); rTO = setTimeout(layoutAll, 150); });

    // Filtering
    const filterWrap = document.getElementById('galleryFilters');
    const updateVisibleLinks = () => links.filter(a => !a.closest('.masonry-item').classList.contains('hidden'));
    if (filterWrap) {
      filterWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        // toggle active
        filterWrap.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        items.forEach(it => {
          const cat = it.dataset.category || '';
          const show = filter === '*' || cat === filter;
          if (show) it.classList.remove('hidden'); else it.classList.add('hidden');
        });
        // after transition, reflow
        setTimeout(() => {
          layoutAll();
          // if lightbox open and no visible images, close it
          if (lightboxEl && !lightboxEl.classList.contains('d-none')) {
            const vis = updateVisibleLinks();
            if (!vis.length) closeLightbox(); else updateCounter();
          }
        }, 260);
      });
    }

    // Lightbox wiring
    const lightboxEl = document.getElementById('lightbox');
    if (!lightboxEl) return; // nothing more to do
    const lbImg = lightboxEl.querySelector('.lightbox-img');
    const lbCaption = lightboxEl.querySelector('.lightbox-caption');
    const lbClose = lightboxEl.querySelector('.lightbox-close');
    const lbPrev = lightboxEl.querySelector('.lightbox-prev');
    const lbNext = lightboxEl.querySelector('.lightbox-next');
    const lbCounter = lightboxEl.querySelector('.lightbox-counter');

    let currentIndex = 0;

    const visibleLinks = () => updateVisibleLinks();

    const updateCounter = () => {
      const vis = visibleLinks();
      if (lbCounter) lbCounter.textContent = vis.length ? `${currentIndex+1} / ${vis.length}` : '';
    };

    const openAt = (i) => {
      const vis = visibleLinks();
      if (!vis.length) return;
      currentIndex = (i + vis.length) % vis.length;
      const a = vis[currentIndex];
      const src = a.dataset.full || a.href;
      const alt = a.querySelector('img')?.alt || '';
      const caption = a.dataset.caption || a.querySelector('figcaption strong')?.textContent || alt;
      lbImg.src = src;
      lbImg.alt = alt;
      if (lbCaption) lbCaption.textContent = caption;
      lightboxEl.classList.remove('d-none');
      document.body.style.overflow = 'hidden';
      updateCounter();
      // focus for keyboard
      lightboxEl.focus?.();
    };

    const closeLightbox = () => {
      lightboxEl.classList.add('d-none');
      lbImg.src = '';
      document.body.style.overflow = '';
    };

    const showPrev = () => { openAt(currentIndex - 1); };
    const showNext = () => { openAt(currentIndex + 1); };

    // attach click events to grid links
    links.forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        // compute index among visible
        const vis = visibleLinks();
        const idx = vis.indexOf(a);
        openAt(idx >= 0 ? idx : 0);
      });
    });

    // Controls
    lbClose?.addEventListener('click', closeLightbox);
    lbPrev?.addEventListener('click', showPrev);
    lbNext?.addEventListener('click', showNext);

    // click outside to close
    lightboxEl.addEventListener('click', (e) => { if (e.target === lightboxEl) closeLightbox(); });

    // keyboard
    document.addEventListener('keydown', (e) => {
      if (!lightboxEl || lightboxEl.classList.contains('d-none')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });

    // touch swipe on lightbox
    (function swipe(){
      if (!lightboxEl) return;
      let startX = 0, dist = 0, moving = false;
      lightboxEl.addEventListener('touchstart', e => { startX = e.touches[0].clientX; moving = true; });
      lightboxEl.addEventListener('touchmove', e => { if (!moving) return; dist = e.touches[0].clientX - startX; });
      lightboxEl.addEventListener('touchend', () => { moving = false; if (dist > 40) showPrev(); else if (dist < -40) showNext(); dist = 0; });
    })();

    // initial layout
    setTimeout(layoutAll, 120);
  })();

});