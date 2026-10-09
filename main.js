/* Seed One, PX3. One script for every page: each block checks for its own elements before it runs. */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const still = root.classList.contains('still');          // #still: review captures only
  // .wix: the Wix Studio comparison build. Only behaviour Wix Studio offers natively runs.
  const wix = root.classList.contains('wix');
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- text splitting ---------- */
  // Hero lines: each word rises out of its line mask.
  if (!wix) $$('.hero-h .hl').forEach((line, li) => {
    let i = 0;
    const out = [];
    line.childNodes.forEach(n => {
      if (n.nodeType !== 3) { out.push(n); return; }
      n.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { out.push(document.createTextNode(' ')); return; }
        const w = document.createElement('span');
        w.className = 'hw'; w.textContent = part;
        w.style.transitionDelay = (0.25 + li * 0.14 + i++ * 0.06).toFixed(2) + 's';
        out.push(w);
      });
    });
    line.replaceChildren(...out);
  });
  // Word masks are reserved for the two editorial headlines; other headings use a quiet fade.
  if (!wix) $$('.words').forEach(el => {
    const txt = el.textContent.trim();
    el.setAttribute('aria-label', txt);
    el.innerHTML = txt.split(/\s+/).map((w, i) => `<span class="wm" aria-hidden="true"><span class="wi" style="transition-delay:${(i * 0.055).toFixed(3)}s">${w}</span></span>`).join(' ');
  });
  // Mission statement: words fill from grey to ink as you read down the page.
  const fill = $('.fill');
  let fillWords = [];
  if (fill && wix) {
    // Static two-tone text, as Wix rich text would set it.
    const txt = fill.textContent.trim(), cut = txt.indexOf(' and turn');
    fill.innerHTML = cut > 0 ? `${txt.slice(0, cut)}<span class="tone">${txt.slice(cut)}</span>` : txt;
  } else if (fill) {
    const txt = fill.textContent.trim();
    fill.setAttribute('aria-label', txt);
    fill.innerHTML = txt.split(/\s+/).map(w => `<span class="fw" aria-hidden="true">${w}</span>`).join(' ');
    fillWords = $$('.fw', fill);
    if (reduce) fillWords.forEach(w => w.classList.add('on'));
  }

  /* ---------- smooth scroll: Lenis, kept gentle ---------- */
  // Wheel, trackpad and keyboard share one eased feel. Touch stays native. Off for reduced motion.
  let lenis = null;
  const NAV_CLEAR = 96;
  if (!reduce && !still && !wix && window.Lenis) {
    lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, smoothWheel: true, syncTouch: false });
    const loop = t => { lenis.raf(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);

    // In-page links glide to their section, clearing the floating nav.
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -NAV_CLEAR, duration: 1.4 });
      if (target.tabIndex < 0 && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }));

    // Keyboard scrolling through Lenis, so it eases exactly like the wheel.
    const typing = el => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
    addEventListener('keydown', e => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || lenis.isStopped) return;
      const el = document.activeElement;
      if (typing(el)) return;
      const page = innerHeight - NAV_CLEAR - 40;
      let d = null;
      switch (e.key) {
        case 'ArrowDown': d = 120; break;
        case 'ArrowUp': d = -120; break;
        case 'PageDown': d = page; break;
        case 'PageUp': d = -page; break;
        case ' ':
          if (el && /^(BUTTON|A|SUMMARY)$/.test(el.tagName)) return;   // space activates controls
          d = e.shiftKey ? -page : page; break;
        case 'Home': e.preventDefault(); lenis.scrollTo(0); return;
        case 'End': e.preventDefault(); lenis.scrollTo(lenis.limit); return;
        default: return;
      }
      e.preventDefault();
      lenis.scrollTo(clamp(lenis.targetScroll + d, 0, lenis.limit));
    });
  }

  /* ---------- intro ---------- */
  const start = () => requestAnimationFrame(() => document.body.classList.add('ready'));
  const go = () => { if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]).then(start); else start(); };
  // A review gate (added only to preview builds) holds the intro until it opens.
  if (root.classList.contains('locked')) addEventListener('gate:open', go, { once: true }); else go();

  /* ---------- nav ---------- */
  const nav = $('#nav'), burger = nav && $('.burger', nav);
  const closeMenu = () => { if (!nav) return; nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); };
  if (burger) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    $$('.menu a', nav).forEach(a => a.addEventListener('click', closeMenu));
  }

  /* ---------- background videos: one control pauses all of them ---------- */
  const vids = $$('video');
  const toggle = $('#vidtoggle');
  let paused = reduce || saveData || store.get('so-videos') === 'paused';
  const setPaused = p => {
    paused = p;
    vids.forEach(v => { if (p) v.pause(); else if (v.dataset.near !== '0' && (v.dataset.loaded || !v.classList.contains('lazy-video'))) v.play().catch(() => {}); });
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(p));
      toggle.textContent = p ? 'Play videos' : 'Pause videos';
    }
  };
  if (paused) vids.forEach(v => v.removeAttribute('autoplay'));
  if (toggle) toggle.addEventListener('click', () => { setPaused(!paused); store.set('so-videos', paused ? 'paused' : 'playing'); });
  setPaused(paused);

  // Every video plays only while near the viewport (the hero film included), so off-screen
  // films stop decoding while you scroll. Section films also load only when first approached.
  if (!reduce && !saveData) {
    const vio = new IntersectionObserver(es => es.forEach(e => {
      const v = e.target;
      v.dataset.near = e.isIntersecting ? '1' : '0';
      if (e.isIntersecting) {
        if (v.classList.contains('lazy-video') && !v.dataset.loaded) { v.preload = 'auto'; v.load(); v.dataset.loaded = '1'; }
        if (!paused) v.play().catch(() => {});
      } else v.pause();
    }), { rootMargin: '40% 0px' });
    vids.forEach(v => vio.observe(v));
  }

  // Decode images well before they scroll into view, so they never decode mid-scroll.
  const dio = new IntersectionObserver((es, obs) => es.forEach(e => {
    if (!e.isIntersecting) return;
    const img = e.target; img.loading = 'eager';
    if (img.decode) img.decode().catch(() => {});
    obs.unobserve(img);
  }), { rootMargin: '150% 0px' });
  $$('img[loading="lazy"]').forEach(i => { i.decoding = 'async'; dio.observe(i); });

  /* ---------- reveals: every entrance fires once ---------- */
  // A clipped element has no visible area to intersect, so clip reveals watch their parent.
  const io = new IntersectionObserver((es, obs) => es.forEach(e => {
    if (!e.isIntersecting) return;
    (e.target._rv || e.target).classList.add('in'); obs.unobserve(e.target);
  }), { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, .words, .fade-h, .dots').forEach(el => reduce ? el.classList.add('in') : io.observe(el));
  $$('.rv-tile').forEach(el => { if (reduce) { el.classList.add('in'); return; } el.parentElement._rv = el; io.observe(el.parentElement); });

  /* ---------- impact grid: its gradients drift only while it is on screen ---------- */
  const bento = $('.bento');
  if (bento && !reduce && !wix) new IntersectionObserver(([e]) => bento.classList.toggle('on', e.isIntersecting), { rootMargin: '10% 0px' }).observe(bento);

  /* ---------- counters ---------- */
  const cio = new IntersectionObserver((es, obs) => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = +el.dataset.to, from = +(el.dataset.from || 0), t0 = performance.now(), dur = 1600;
    const tick = now => {
      const p = clamp((now - t0) / dur, 0, 1), k = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(from + (to - from) * k);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick); obs.unobserve(el);
  }), { threshold: 0.6 });
  if (!reduce && !still && !wix) $$('.count').forEach(c => { c.textContent = c.dataset.from || '0'; cio.observe(c); });

  /* ---------- accordion ---------- */
  $$('.ai-h').forEach(btn => btn.addEventListener('click', () => {
    const item = btn.closest('.ai'), open = !item.classList.contains('open');
    $$('.ai').forEach(a => { a.classList.remove('open'); $('.ai-h', a).setAttribute('aria-expanded', 'false'); });
    if (open) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
  }));

  /* ---------- portfolio filter ---------- */
  const chips = $$('.pf-filter button');
  if (chips.length) {
    const cards = $$('.pf-card');
    chips.forEach(b => b.addEventListener('click', () => {
      const f = b.dataset.f;
      chips.forEach(c => c.setAttribute('aria-pressed', String(c === b)));
      cards.forEach(c => c.classList.toggle('off', f !== 'all' && c.dataset.area !== f));
      const n = cards.filter(c => !c.classList.contains('off')).length, live = $('.pf-count');
      if (live) live.textContent = `${n} ${n === 1 ? 'company' : 'companies'}`;
    }));
  }

  /* ---------- enquiry: drawer and form ---------- */
  const drawer = $('#enquire');
  let opener = null;
  const openDrawer = () => {
    if (!drawer || drawer.open) return;
    opener = document.activeElement;
    closeMenu();
    drawer.classList.remove('closing');
    drawer.showModal();
    if (lenis) lenis.stop();
    root.classList.add('drawer-open');
    const first = $('input:not([type=radio]), textarea', drawer);
    setTimeout(() => first && first.focus({ preventScroll: true }), reduce ? 0 : 320);
  };
  const closeDrawer = () => {
    if (!drawer || !drawer.open || drawer.classList.contains('closing')) return;
    const done = () => { drawer.classList.remove('closing'); drawer.close(); root.classList.remove('drawer-open'); if (lenis) lenis.start(); if (opener) opener.focus({ preventScroll: true }); };
    if (reduce) { done(); return; }
    drawer.classList.add('closing');
    setTimeout(done, 420);
  };
  if (drawer) {
    $$('[data-enquire]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); openDrawer(); }));
    $('.drawer-x', drawer).addEventListener('click', closeDrawer);
    drawer.addEventListener('cancel', e => { e.preventDefault(); closeDrawer(); });           // Esc
    drawer.addEventListener('click', e => { if (e.target === drawer) closeDrawer(); });       // backdrop
    if (location.hash === '#enquire') openDrawer();
  }

  $$('form.enq').forEach(form => {
    const status = $('.enq-status', form), done = form.parentElement.querySelector('.enq-done');
    const fields = $$('input[required]', form);
    const check = inp => {
      const ok = inp.checkValidity() && inp.value.trim() !== '';
      const fld = inp.closest('.fld');
      fld.classList.toggle('bad', !ok);
      inp.setAttribute('aria-invalid', String(!ok));
      const err = $('.err', fld);
      if (err) inp.setAttribute('aria-describedby', err.id);
      return ok;
    };
    fields.forEach(inp => {
      inp.addEventListener('blur', () => { if (inp.value) check(inp); });
      inp.addEventListener('input', () => { if (inp.closest('.fld').classList.contains('bad')) check(inp); });
    });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const bad = fields.filter(f => !check(f));
      if (bad.length) { status.textContent = `Please check the ${bad.length === 1 ? 'highlighted field' : bad.length + ' highlighted fields'}.`; bad[0].focus(); return; }
      const btn = $('button[type=submit]', form);
      btn.disabled = true; status.textContent = 'Sending…';
      const data = Object.fromEntries(new FormData(form));
      const endpoint = form.dataset.endpoint;
      try {
        // Wire data-endpoint to the form service (for example Formspree or a Wix Velo function).
        // Until it is set, the form shows its success state so the flow can be reviewed.
        if (endpoint) {
          const r = await fetch(endpoint, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
          if (!r.ok) throw new Error(r.status);
        } else await new Promise(r => setTimeout(r, 700));
        form.hidden = true;
        $('.done-name', done).textContent = data.first ? ', ' + data.first.trim() : '';
        done.hidden = false; done.focus();
        requestAnimationFrame(() => done.classList.add('in'));
      } catch (err) {
        status.textContent = 'Something went wrong sending your message. Please try again.';
        btn.disabled = false;
      }
    });
  });

  /* ---------- scroll-linked motion ---------- */
  const plx = $$('.plx').map(el => ({ el, img: $('img', el), k: +(el.dataset.k || 0.06), on: false }));
  const pio = new IntersectionObserver(es => es.forEach(e => { const p = plx.find(x => x.el === e.target); if (p) p.on = e.isIntersecting; }), { rootMargin: '15% 0px' });
  plx.forEach(p => pio.observe(p.el));

  const hero = $('#hero'), heroMedia = $('.hero-media'), heroIn = $('.hero-in');
  const cta = $('#contact'), ga = cta && $('.ga', cta), gb = cta && $('.gb', cta);
  const method = $('.method'), steps = method ? $$('.step', method) : [], rail = method && $('.pin-rail i', method);
  const pinMQ = matchMedia('(min-width: 1024px) and (min-height: 700px)');
  const pinned = () => method && !reduce && !wix && pinMQ.matches;
  const methodIn = method && $('.method-in', method);
  // The pinned frame is exactly as tall as its content, held centred in the viewport,
  // so the next section follows straight on when the pin releases.
  const sizePin = () => {
    if (!methodIn) return;
    const h = methodIn.offsetHeight;
    method.style.setProperty('--pin-h', h + 'px');
    method.style.setProperty('--pt', Math.max(84, Math.round((innerHeight - h) / 2 + 20)) + 'px');
  };
  // Pin only when the whole section fits on screen under the nav; otherwise it stays a normal grid.
  const setPin = () => {
    root.classList.toggle('pin-on', !!pinned());
    if (root.classList.contains('pin-on') && methodIn && methodIn.offsetHeight + 84 > innerHeight) root.classList.remove('pin-on');
    sizePin();
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizePin);
  setPin(); pinMQ.addEventListener('change', () => { setPin(); onScroll(); });

  let vh = innerHeight, lastY = scrollY, navHidden = false, heroOn = !!hero, ctaOn = false, lastStep = -1;
  const watch = (el, fn) => el && new IntersectionObserver(([e]) => fn(e.isIntersecting), { rootMargin: '10% 0px' }).observe(el);
  watch(hero, v => heroOn = v); watch(cta, v => ctaOn = v);

  let ticking = false;
  const frame = () => {
    ticking = false;
    const y = scrollY;

    // nav: stays put; tightens once you scroll and gains a hairline past the film
    if (nav) {
      const threshold = hero ? hero.offsetHeight : 120;
      nav.classList.toggle('solid', y > threshold - 90);
      nav.classList.toggle('compact', y > 40);          // always visible; tightens by 20px once you scroll
    }
    lastY = y;

    if (!reduce) {
      if (heroOn && heroMedia) {
        const heroH = hero.offsetHeight, p = clamp(y / heroH, 0, 1);
        heroMedia.style.transform = wix ? `translate3d(0,${(y * 0.32).toFixed(1)}px,0)` : `translate3d(0,${(y * 0.32).toFixed(1)}px,0) scale(${(1 + p * 0.06).toFixed(4)})`;
        heroIn.style.transform = `translate3d(0,${(y * 0.16).toFixed(1)}px,0)`;
        heroIn.style.opacity = (1 - clamp((p - 0.22) / 0.6, 0, 1)).toFixed(3);
      }
      plx.forEach(p => {
        if (!p.on) return;
        const r = p.el.getBoundingClientRect();
        const c = (r.top + r.height / 2 - vh / 2) / vh;
        p.img.style.setProperty('--py', (c * -p.k * r.height * 1.6).toFixed(1) + 'px');
      });
      if (ctaOn && ga) {
        const r = cta.getBoundingClientRect();
        const p = clamp((vh - r.top) / (vh * 0.75), 0, 1);
        const e = 1 - Math.pow(1 - p, 3), off = (1 - e) * innerWidth * 0.05;
        ga.style.transform = `translate3d(${(-off).toFixed(1)}px,0,0)`;
        gb.style.transform = `translate3d(${off.toFixed(1)}px,0,0)`;
      }
    }

    // Method: while pinned, the five stages light in sequence and stay lit.
    if (method) {
      if (root.classList.contains('pin-on')) {
        const r = method.getBoundingClientRect(), travel = r.height - vh;
        const p = clamp(-r.top / Math.max(travel, 1), 0, 1);
        const idx = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999 + 0.0001));
        if (rail) rail.style.transform = `scaleX(${(0.02 + p * 0.98).toFixed(4)})`;
        if (idx !== lastStep) {
          steps.forEach((s, i) => { s.classList.toggle('lit', i <= idx); s.classList.toggle('now', i === idx); });
          lastStep = idx;
        }
      } else if (lastStep !== -2) {
        steps.forEach(s => s.classList.add('lit')); steps.forEach(s => s.classList.remove('now')); lastStep = -2;
      }
    }

    if (fillWords.length && !reduce) {       // every frame (cheap), so a fast scroll past still completes the fill
      const r = fill.getBoundingClientRect();
      const p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.35), 0, 1);
      const n = Math.round(p * fillWords.length);
      fillWords.forEach((w, i) => w.classList.toggle('on', i < n));
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { vh = innerHeight; lastStep = -1; setPin(); onScroll(); });
  frame();

  // Gradient fields: a soft highlight follows the pointer.
  if (fine && !reduce && !wix) $$('.tile.grad, .ai .im, .st-tile, .pf-card .grad').forEach(t => {
    t.addEventListener('pointermove', e => {
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      t.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      t.style.setProperty('--mh', '.42');
    });
    t.addEventListener('pointerleave', () => t.style.setProperty('--mh', '0'));
  });
})();
