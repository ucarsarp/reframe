/* ==========================================================================
   ReFrame — src/lib/site.js (started once from src/routes/index.tsx after the page renders)
   Countdown, intro title card, nav state, hero intro, showcase scroller,
   split-word headings, scroll reveals,
   mission word scrub, scroll HUD (timecode), parallax, scroll band,
   velocity skew, the viewfinder cursor and the live Nolan chat.
   All motion is skipped when the user prefers reduced motion.
   ========================================================================== */
export function initSite() {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Footer year ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Film stills: fall back to the placeholder if an image is missing ---------- */
  document.querySelectorAll('.frame__img').forEach((img) => {
    const hide = () => img.classList.add('is-missing');
    if (img.complete && img.naturalWidth === 0) hide();
    else img.addEventListener('error', hide);
  });

  /* ---------- Launch countdown ----------
     Change LAUNCH_DATE to move the launch. The +01:00 is Central European
     (winter) time, so every visitor counts down to the same moment. */
  const LAUNCH_DATE = new Date('2026-11-18T12:00:00+01:00');
  const bar = document.getElementById('launch-bar');

  if (bar) {
    const nums = {};
    bar.querySelectorAll('[data-unit]').forEach((el) => { nums[el.dataset.unit] = el; });
    const pad = (n) => String(n).padStart(2, '0');
    let timer = 0;

    function set(unit, value) {
      const el = nums[unit];
      if (el.textContent === value) return;
      el.textContent = value;
      el.classList.remove('is-tick');
      void el.offsetWidth;            // restart the roll-up animation
      el.classList.add('is-tick');
    }

    function tickCountdown() {
      const ms = LAUNCH_DATE - Date.now();
      if (ms <= 0) {
        clearInterval(timer);
        bar.querySelector('.launch-bar__inner').innerHTML =
          '<p class="launch-bar__live">ReFrame is live. <a href="#download">Download now</a></p>';
        return;
      }
      const s = Math.floor(ms / 1000);
      set('days', pad(Math.floor(s / 86400)));
      set('hours', pad(Math.floor(s / 3600) % 24));
      set('minutes', pad(Math.floor(s / 60) % 60));
      set('seconds', pad(s % 60));
    }

    tickCountdown();
    timer = setInterval(tickCountdown, 1000);
  }

  /* ---------- 1. Title card on load, hero when it scrolls in ---------- */
  // A short delay makes sure the hidden state is painted before we animate out of it.
  // (setTimeout rather than rAF so it still fires if the tab starts in the background.)
  setTimeout(() => document.body.classList.add('intro-ready'), 80);

  // The hero's own entrance (headline lines, buttons, screenshot) plays when it arrives
  const heroEl = document.querySelector('.hero');
  if (heroEl && 'IntersectionObserver' in window) {
    const heroIo = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        document.body.classList.add('is-loaded');
        heroIo.disconnect();
      }
    }, { threshold: 0.2 });
    heroIo.observe(heroEl);
  } else {
    document.body.classList.add('is-loaded');
  }

  /* ---------- 2. Sticky nav: add blur background after scrolling ---------- */
  const nav = document.getElementById('nav');
  const SCROLL_THRESHOLD = 40; // px scrolled before the nav gets its background

  const intro = document.getElementById('intro');

  function updateNav() {
    nav.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
    // Hide the header while the title card is on screen
    const introEnd = intro ? intro.offsetHeight - window.innerHeight * 0.5 : 0;
    document.body.classList.toggle('in-intro', window.scrollY < introEnd);
  }
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  /* ---------- 3. Mobile menu ---------- */
  const toggle = nav.querySelector('.nav__toggle');
  const toggleLabel = toggle.querySelector('.sr-only');

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggleLabel.textContent = open ? 'Close menu' : 'Open menu';
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.querySelectorAll('.nav__menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- 4a. Split headings into words (for the word-by-word rise) ---------- */
  // Wraps every word of [data-split] / [data-scrub] in spans, keeping <em> and <br>.
  function splitWords(root, wordClass) {
    let i = 0;
    (function walk(node) {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const outer = document.createElement('span');
            outer.className = wordClass;
            outer.style.setProperty('--i', i++);
            if (wordClass === 'split-word') {
              const inner = document.createElement('span');
              inner.textContent = part;
              outer.appendChild(inner);
            } else {
              outer.textContent = part;
            }
            frag.appendChild(outer);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
          walk(child);
        }
      });
    })(root);
  }

  if (!reduceMotion) {
    document.querySelectorAll('[data-split]').forEach((el) => splitWords(el, 'split-word'));
    document.querySelectorAll('[data-scrub]').forEach((el) => splitWords(el, 'scrub-word'));
  }

  /* ---------- 4b. Scroll HUD: timecode, scene name, progress line ----------
     The timecode treats every 2px scrolled as one frame at 24fps. */
  const hudTc = document.getElementById('hud-tc');
  const hudScene = document.getElementById('hud-scene');
  const progressBar = document.getElementById('scroll-progress');
  const SCENES = [            // [section id, label shown in the HUD]
    ['intro', 'Title card'],
    ['top', 'Scene 00 / Opening'],
    ['features', 'Scene 01 / Features'],
    ['nolan', 'Scene 02 / Nolan'],
    ['how', 'Scene 03 / How it works'],
    ['mission', 'Scene 04 / Mission'],
    ['showcase', 'Scene 05 / Showcase'],
    ['download', 'Scene 06 / Finale'],
    ['credits', 'Scene 07 / The end'],
  ].map(([id, label]) => [document.getElementById(id), label]).filter(([el]) => el);

  function updateHud() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    if (hudTc) {
      const frames = Math.floor(y / 2);
      const pad = (n) => String(n).padStart(2, '0');
      const ff = frames % 24, ss = Math.floor(frames / 24) % 60, mm = Math.floor(frames / 1440) % 60, hh = Math.floor(frames / 86400);
      hudTc.textContent = `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
    }
    if (hudScene) {
      let label = SCENES[0][1];
      SCENES.forEach(([el, l]) => { if (el.getBoundingClientRect().top < window.innerHeight * 0.5) label = l; });
      if (hudScene.textContent !== label) hudScene.textContent = label;
    }
  }
  updateHud();
  window.addEventListener('scroll', updateHud, { passive: true });
  window.addEventListener('resize', updateHud);

  /* ---------- 4c. Scroll reveal with IntersectionObserver ---------- */
  const revealEls = document.querySelectorAll('[data-reveal], [data-split]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target); // reveal once
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- 4d. Showcase: sideways scroller with buttons, counter and drag ----------
     Works on its own, separate from the page's vertical scroll. */
  const scroller = document.getElementById('showcase-scroller');
  if (scroller) {
    const shots = [...scroller.querySelectorAll('.shot')];
    const prev = document.getElementById('showcase-prev');
    const next = document.getElementById('showcase-next');
    const count = document.getElementById('showcase-count');
    const pad = (n) => String(n).padStart(2, '0');
    let current = 0;
    let target = null; // screen we're scrolling to, so quick repeated clicks add up

    // Which screen is closest to the middle?
    function updateActive() {
      const mid = scroller.scrollLeft + scroller.clientWidth / 2;
      let best = 0, bestDist = Infinity;
      shots.forEach((shot, i) => {
        const d = Math.abs(shot.offsetLeft + shot.offsetWidth / 2 - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      current = best;
      shots.forEach((shot, i) => shot.classList.toggle('is-active', i === best));
      count.textContent = `${pad(best + 1)} / ${pad(shots.length)}`;
      prev.disabled = best === 0;
      next.disabled = best === shots.length - 1;
    }

    function goTo(i) {
      target = Math.max(0, Math.min(shots.length - 1, i));
      const shot = shots[target];
      scroller.scrollTo({
        left: shot.offsetLeft + shot.offsetWidth / 2 - scroller.clientWidth / 2,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    }

    prev.addEventListener('click', () => goTo((target ?? current) - 1));
    next.addEventListener('click', () => goTo((target ?? current) + 1));
    let settle = 0;
    scroller.addEventListener('scroll', () => {
      updateActive();
      clearTimeout(settle);
      settle = setTimeout(() => { target = null; }, 150); // scrolling has stopped
    }, { passive: true });
    window.addEventListener('resize', updateActive);

    // Click-and-drag with a mouse (touch and trackpads scroll natively)
    let dragX = 0, dragLeft = 0, dragging = false, moved = false;
    scroller.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true; moved = false;
      dragX = e.clientX; dragLeft = scroller.scrollLeft;
      scroller.classList.add('is-dragging');
      scroller.setPointerCapture(e.pointerId);
    });
    scroller.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - dragX;
      if (Math.abs(dx) > 3) moved = true;
      scroller.scrollLeft = dragLeft - dx * 1.2;
    });
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      scroller.classList.remove('is-dragging');
      if (moved) { updateActive(); goTo(current); } // settle on the nearest screen
    };
    scroller.addEventListener('pointerup', endDrag);
    scroller.addEventListener('pointercancel', endDrag);

    // Start on the first screen
    scroller.scrollLeft = 0;
    updateActive();
  }

  /* ---------- 4e. Intro auto-play ----------
     A small scroll down (or a click on "Scroll") plays the whole title card
     and glides to the hero, so nobody has to scroll through it slowly. */
  const introCue = document.getElementById('intro-cue');
  const heroTop = () => (heroEl ? heroEl.offsetTop : 0);
  const INTRO_GLIDE_MS = 1300;   // how long the auto-play glide takes
  let autoPlaying = false;
  let blockUntil = 0;

  function playIntro() {
    if (autoPlaying) return;
    const from = window.scrollY;
    const to = heroTop();
    if (reduceMotion || to <= from) { window.scrollTo({ top: to, behavior: 'auto' }); return; }
    autoPlaying = true;
    const start = performance.now();
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // ease in-out
    (function step(now) {
      const t = Math.min(1, (now - start) / INTRO_GLIDE_MS);
      window.scrollTo({ top: from + (to - from) * ease(t), behavior: 'instant' });
      if (t < 1) requestAnimationFrame(step);
      else { autoPlaying = false; blockUntil = performance.now() + 400; }
    })(start);
  }

  if (introCue) introCue.addEventListener('click', playIntro);

  if (intro && !reduceMotion) {
    let lastIntroY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const goingDown = y > lastIntroY;
      lastIntroY = y;
      // Started scrolling down inside the title card → play the rest automatically
      if (!autoPlaying && goingDown && y > 2 && y < heroTop() - 4) playIntro();
    }, { passive: true });

    // While gliding (and a moment after), ignore extra wheel/touch input
    // so trackpad momentum doesn't fight the animation
    const block = (e) => { if (autoPlaying || performance.now() < blockUntil) e.preventDefault(); };
    window.addEventListener('wheel', block, { passive: false });
    window.addEventListener('touchmove', block, { passive: false });
  }

  /* ---------- 4f. Nolan chat demo ----------
     When the example conversation scrolls into view: your question appears,
     Nolan "types" (three dots), then his answer writes itself out and the
     suggested questions appear. With reduced motion everything is simply shown. */
  const chat = document.getElementById('nolan-chat');
  if (chat && !reduceMotion && 'IntersectionObserver' in window) {
    const steps = chat.querySelectorAll('[data-step]');
    const answer = chat.querySelector('.nolan-chat__answer');
    const fullAnswer = answer ? answer.textContent : '';
    const TYPE_MS = 18;        // ms per character while Nolan "writes"
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    async function play() {
      await wait(300);
      steps[0].classList.add('is-shown');                 // your question
      await wait(700);
      answer.textContent = '';
      chat.classList.add('is-typing');
      steps[1].classList.add('is-shown');                 // Nolan's bubble, typing dots
      await wait(1300);
      chat.classList.remove('is-typing');
      for (let i = 1; i <= fullAnswer.length; i++) {      // answer writes out
        answer.textContent = fullAnswer.slice(0, i);
        await wait(TYPE_MS);
      }
      await wait(250);
      steps[2].classList.add('is-shown');                 // suggested questions
      await wait(200);
      steps[3].classList.add('is-shown');                 // ask-your-own box
    }

    const chatIo = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { chatIo.disconnect(); play(); }
    }, { threshold: 0.45 });
    chatIo.observe(chat);
  }

  /* ---------- 4g. Nolan live chat ----------
     After the demo, visitors can ask their own questions (or tap a suggestion,
     or attach a still). Each question goes to the server route at /api/nolan (src/routes/api/nolan.ts), which
     asks Claude (or, with no API key, uses his built-in answers) and streams the answer back; it's written into a new bubble
     as it arrives. Needs the Node server running (npm start). */
  const form = document.getElementById('nolan-form');
  const thread = document.getElementById('nolan-thread');
  if (chat && form && thread) {
    const input = form.querySelector('.nolan-chat__input');
    const fileInput = form.querySelector('input[type="file"]');
    const attach = form.querySelector('.nolan-chat__attach');
    const fileNote = document.getElementById('nolan-file');
    const controls = [input, form.querySelector('.nolan-chat__send'), fileInput, ...chat.querySelectorAll('.nolan-chat__chips button')];
    const history = [];   // { role, text, image? } — the server adds the Get Out demo before it
    let image = null;     // { media_type, data, url } for the still waiting to be sent

    const el = (tag, cls, text) => {
      const node = document.createElement(tag);
      if (cls) node.className = cls;
      if (text) node.textContent = text;
      return node;
    };

    // Shrink big photos before upload so requests stay small and fast
    function readStill(file) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, 1568 / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          const url = canvas.toDataURL('image/jpeg', 0.85);
          URL.revokeObjectURL(img.src);
          resolve({ media_type: 'image/jpeg', data: url.split(',')[1], url });
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
    }

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];
      fileInput.value = '';
      if (!file) return;
      try {
        image = await readStill(file);
        attach.classList.add('has-file');
        fileNote.textContent = `Attached: ${file.name}`;
        fileNote.hidden = false;
        input.focus();
      } catch {
        fileNote.textContent = "That file couldn't be read as an image.";
        fileNote.hidden = false;
      }
    });

    function setBusy(busy) {
      controls.forEach((c) => { c.disabled = busy; });
    }

    async function ask(text) {
      text = text.trim();
      if (!text) return;
      const turn = { role: 'user', text };
      if (image) turn.image = { media_type: image.media_type, data: image.data };

      // Your question
      const you = el('div', 'nolan-chat__you');
      if (image) { const pic = el('img'); pic.src = image.url; pic.alt = 'Your attached still'; you.append(pic); }
      you.append(text);
      // Nolan's bubble, typing dots until the first words arrive
      const reply = el('div', 'nolan-chat__reply is-typing');
      const bubble = el('div', 'nolan-chat__bubble');
      const typing = el('span', 'nolan-chat__typing');
      typing.setAttribute('aria-hidden', 'true');
      typing.innerHTML = '<i></i><i></i><i></i>';
      const answer = el('span', 'nolan-chat__answer');
      bubble.append(el('span', 'nolan-chat__name', 'Nolan'), typing, answer);
      const mini = el('span', 'nolan-chat__mini');
      mini.innerHTML = chat.querySelector('.nolan-chat__mini')?.innerHTML ?? ''; // the Nolan mark
      mini.setAttribute('aria-hidden', 'true');
      reply.append(mini, bubble);
      thread.append(you, reply);
      reply.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });

      history.push(turn);
      image = null;
      attach.classList.remove('has-file');
      fileNote.hidden = true;
      input.value = '';
      setBusy(true);

      let full = '';
      try {
        const res = await fetch('/api/nolan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
        });
        if (res.status === 404 || res.status === 405) throw new TypeError('No Nolan server'); // plain static server
        if (!res.ok || !res.body) throw new Error((await res.text().catch(() => '')) || `HTTP ${res.status}`);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value, { stream: true });
          reply.classList.remove('is-typing');
          answer.textContent = full;
        }
        if (!full.trim()) throw new Error('Empty answer');
        history.push({ role: 'assistant', text: full });
      } catch (err) {
        history.pop(); // forget the question so the conversation stays valid
        reply.classList.remove('is-typing');
        reply.classList.add('is-error');
        answer.textContent = location.protocol === 'file:' || err instanceof TypeError
          ? "I'm offline right now. Start ReFrame (npm run dev) and open http://localhost:3000 to talk to me."
          : (err.message.trim() || 'Something went wrong. Try asking again.');
      } finally {
        setBusy(false);
        input.focus({ preventScroll: true });
      }
    }

    form.addEventListener('submit', (e) => { e.preventDefault(); ask(input.value); });
    chat.querySelectorAll('.nolan-chat__chips button').forEach((chip) => {
      chip.addEventListener('click', () => ask(chip.textContent));
    });
  }

  /* ---------- 4g. Popcorn finale (footer) ----------
     When the footer scrolls into view, kernels pop out of the bucket, fly up,
     bounce and pile up around it. Click the bucket for more.
     With reduced motion a finished pile is drawn once, with no animation. */
  const popStage = document.getElementById('popcorn');
  const popCanvas = document.getElementById('popcorn-canvas');
  const bucketBtn = document.getElementById('popcorn-bucket');
  if (popStage && popCanvas && bucketBtn && popCanvas.getContext) {
    const POP_COUNT = 90;      // kernels in the first show
    const MORE_COUNT = 18;     // kernels per click on the bucket
    const SHOW_MS = 4200;      // how long the first show lasts
    const GRAVITY = 0.32;
    const BIN = 4;             // pile resolution in px
    const rootCss = getComputedStyle(document.documentElement);
    const COLOR = rootCss.getPropertyValue('--popcorn-color').trim() || '#f6efdc';
    const RED = rootCss.getPropertyValue('--accent-red').trim() || '#c23a2b';
    const ctx = popCanvas.getContext('2d');
    const pile = document.createElement('canvas');   // settled popcorn is baked here once
    const pctx = pile.getContext('2d');
    let W = 0, H = 0, dpr = 1, heights = [], flying = [], sparks = [], words = [], queue = [];
    let running = false, played = false, popped = 0;
    const rand = (a, b) => a + Math.random() * (b - a);

    function bucket() {
      const r = bucketBtn.getBoundingClientRect(), st = popStage.getBoundingClientRect(), k = r.width / 170;
      return { cx: r.left - st.left + r.width / 2, rimY: r.top - st.top + 24 * k, left: r.left - st.left + 12 * k, right: r.right - st.left - 12 * k, k };
    }
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = popStage.clientWidth; H = popStage.clientHeight;
      for (const c of [popCanvas, pile]) { c.width = W * dpr; c.height = H * dpr; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      heights = new Array(Math.ceil(W / BIN) + 1).fill(0);
      flying = []; sparks = []; words = []; queue = [];
    }
    function groundAt(x) {
      const b = bucket();
      const base = x > b.left && x < b.right ? b.rimY + 10 * b.k : H;
      return base - (heights[Math.max(0, Math.min(heights.length - 1, Math.round(x / BIN)))] || 0);
    }
    function addHeight(x, r) {
      const span = Math.ceil(r * 1.3 / BIN), c = Math.round(x / BIN);
      for (let i = -span; i <= span; i++) {
        const j = c + i; if (j < 0 || j >= heights.length) continue;
        const d = i / span; heights[j] = Math.min(H * 0.55, heights[j] + r * 0.62 * (1 - d * d));
      }
    }
    function makePiece() {
      const b = bucket(), r = rand(6.5, 10.5) * Math.max(0.8, b.k);
      const blobs = [{ dx: 0, dy: 0, rr: r * 0.58 }];
      const n = 4 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + rand(-0.3, 0.3); blobs.push({ dx: Math.cos(a) * r * 0.48, dy: Math.sin(a) * r * 0.48, rr: r * rand(0.38, 0.52) }); }
      return {
        x: b.cx + rand(-1, 1) * (b.right - b.left) * 0.3, y: b.rimY + 6,
        vx: rand(-3.4, 3.4), vy: -rand(7, 13), r, rot: rand(0, 6.28), vr: rand(-0.2, 0.2), s: 0.25,
        blobs, butter: Math.random() < 0.35,
      };
    }
    function drawPiece(c, p) {
      c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.scale(p.s, p.s);
      c.fillStyle = 'rgba(120, 90, 40, 0.28)';                       // soft shadow side
      for (const bl of p.blobs) { c.beginPath(); c.arc(bl.dx + p.r * 0.12, bl.dy + p.r * 0.14, bl.rr, 0, 6.283); c.fill(); }
      c.fillStyle = COLOR;
      for (const bl of p.blobs) { c.beginPath(); c.arc(bl.dx, bl.dy, bl.rr, 0, 6.283); c.fill(); }
      if (p.butter) { c.fillStyle = 'rgba(232, 180, 80, 0.85)'; c.beginPath(); c.arc(p.r * 0.1, p.r * 0.05, p.r * 0.22, 0, 6.283); c.fill(); }
      c.restore();
    }
    function popOne(animated) {
      const p = makePiece(); popped++;
      if (!animated) { p.s = 1; }
      flying.push(p);
      if (animated) {
        for (let i = 0; i < 6; i++) { const a = rand(0, 6.283); sparks.push({ x: p.x, y: p.y, vx: Math.cos(a) * rand(1.5, 3), vy: Math.sin(a) * rand(1.5, 3) - 1, life: 14 }); }
        if (words.length < 2 && Math.random() < 0.08) words.push({ x: p.x + rand(-70, 70), y: p.y - rand(30, 70), life: 60 });
      }
    }
    function physics() {
      for (const p of flying) {
        p.vy += GRAVITY; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.s += (1 - p.s) * 0.3;
        if (p.x < p.r) { p.x = p.r; p.vx = Math.abs(p.vx) * 0.5; }
        if (p.x > W - p.r) { p.x = W - p.r; p.vx = -Math.abs(p.vx) * 0.5; }
        const g = groundAt(p.x);
        if (p.vy > 0 && p.y + p.r * 0.7 >= g) {
          p.y = g - p.r * 0.7;
          if (p.vy > 2.2) { p.vy = -p.vy * 0.32; p.vx *= 0.72; p.vr *= 0.6; }
          else { p.settled = true; p.s = 1; drawPiece(pctx, p); addHeight(p.x, p.r); }
        }
      }
      flying = flying.filter(p => !p.settled);
    }
    function render() {
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(pile, 0, 0, W, H);
      for (const p of flying) drawPiece(ctx, p);
      ctx.strokeStyle = COLOR; ctx.lineWidth = 1.5;
      for (const sp of sparks) { ctx.globalAlpha = sp.life / 14; ctx.beginPath(); ctx.moveTo(sp.x, sp.y); ctx.lineTo(sp.x + sp.vx * 2, sp.y + sp.vy * 2); ctx.stroke(); }
      ctx.font = '11px "IBM Plex Mono", monospace'; ctx.fillStyle = RED; ctx.textAlign = 'center';
      for (const w of words) { ctx.globalAlpha = Math.min(1, w.life / 30); ctx.fillText('pop!', w.x, w.y); }
      ctx.globalAlpha = 1;
    }
    function frame(now) {
      while (queue.length && queue[0] <= now) { queue.shift(); popOne(true); }
      physics();
      for (const sp of sparks) { sp.x += sp.vx; sp.y += sp.vy; sp.life--; }
      sparks = sparks.filter(sp => sp.life > 0);
      for (const w of words) { w.y -= 0.6; w.life--; }
      words = words.filter(w => w.life > 0);
      render();
      if (queue.length || flying.length || sparks.length || words.length) requestAnimationFrame(frame);
      else { running = false; popStage.classList.remove('is-popping'); }
    }
    // slow start, a burst in the middle, then tailing off, like real popcorn
    function show(count, duration) {
      const t0 = performance.now();
      for (let i = 0; i < count; i++) {
        const u = (i + 0.5) / count;
        queue.push(t0 + duration * (Math.asin(2 * u - 1) / Math.PI + 0.5) + rand(-60, 60));
      }
      queue.sort((a, b) => a - b);
      popStage.classList.add('is-popping');
      if (!running) { running = true; requestAnimationFrame(frame); }
    }
    // instant version: simulate without drawing each step, then draw the pile once
    function instant(count) {
      for (let i = 0; i < count; i++) popOne(false);
      for (let step = 0; step < 900 && flying.length; step++) physics();
      flying = []; render();
    }

    resize();
    new IntersectionObserver((entries, io) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect(); played = true;
      reduceMotion ? instant(POP_COUNT) : show(POP_COUNT, SHOW_MS);
    }, { threshold: 0.35 }).observe(popStage);
    bucketBtn.addEventListener('click', () => { played = true; reduceMotion ? instant(MORE_COUNT) : show(MORE_COUNT, 1300); });
    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { const n = popped; popped = 0; resize(); if (played) instant(n); }, 200);
    });
  }

  // Everything below is pure motion, so stop here if reduced motion is on.
  if (reduceMotion) return;

  /* ---------- 5. Scroll-linked motion (one rAF loop) ----------
     Intro title card, parallax stills, showcase scale, the scroll band, the
     mission word scrub, and a skew that follows how fast you scroll. */
  const parallaxEls = [...document.querySelectorAll('[data-parallax]')];
  const scaleEls = [...document.querySelectorAll('[data-scale]')];
  const bandRows = [...document.querySelectorAll('[data-band]')];
  const scrubEls = [...document.querySelectorAll('[data-scrub]')];
  const skewEls = [...document.querySelectorAll('.ticker')];

  const BAND_SPEED = 0.35;  // how far the scroll band moves per px scrolled
  const SKEW_MAX = 6;       // max skew (degrees) when scrolling fast

  let lastY = window.scrollY;
  let velocity = 0;

  // progress: -1 when element is below the viewport, 0 centered, 1 above it
  function progress(el) {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    return ((vh / 2) - (r.top + r.height / 2)) / ((vh + r.height) / 2);
  }
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  // The loop runs while you scroll and keeps going until the skew settles back to 0
  let running = false;
  function onScroll() {
    if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  }
  function loop() {
    render();
    if (Math.abs(velocity) > 0.05) requestAnimationFrame(loop);
    else { running = false; velocity = 0; applySkew(); }
  }
  function applySkew() {
    const skew = clamp(velocity * 0.25, -SKEW_MAX, SKEW_MAX);
    skewEls.forEach((el) => { el.style.setProperty('--skew', `${skew}deg`); });
    bandRows.forEach((el) => { el.style.setProperty('--skew', `${skew}deg`); });
  }

  function render() {
    const y = window.scrollY;
    velocity += ((y - lastY) - velocity) * 0.2; // smoothed px per frame
    lastY = y;
    applySkew();

    // Intro: 0 at the top of the page, 1 once the title card has fully played
    if (intro) {
      const r = intro.getBoundingClientRect();
      const ip = clamp(-r.top / Math.max(1, r.height - window.innerHeight), 0, 1);
      intro.style.setProperty('--ip', ip.toFixed(4));
      intro.classList.toggle('is-scrolling', ip > 0.001);
    }

    // Scroll band: rows slide in opposite directions
    bandRows.forEach((el) => {
      const dir = parseFloat(el.dataset.band) || 1;
      const p = progress(el);
      const overflow = Math.max(0, el.scrollWidth - window.innerWidth);
      const x = -overflow / 2 + dir * p * overflow * BAND_SPEED * 1.4;
      el.style.transform = `translate3d(${x}px, 0, 0) skewX(var(--skew, 0deg))`;
    });

    // Mission: light up words as the statement moves up the screen
    scrubEls.forEach((el) => {
      const words = el.querySelectorAll('.scrub-word');
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const t = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
      const lit = Math.round(t * words.length);
      words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
    });

    // Placeholder images drift vertically inside their frames
    parallaxEls.forEach((el) => {
      const p = clamp(progress(el.parentElement), -1, 1);
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      el.style.transform = `translate3d(0, ${p * speed * 100}%, 0)`;
    });

    // Showcase grows from 90% to 100% as it enters
    scaleEls.forEach((el) => {
      const p = clamp(progress(el) + 1, 0, 1); // 0 entering → 1 centered
      el.style.transform = `scale(${0.9 + p * 0.1})`;
    });
  }

  render();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ---------- 6. Viewfinder cursor (mouse devices only) ----------
     Four focus brackets trail the pointer and invert the colors beneath them.
     Over a link or button they glide out and lock around it, like a camera's
     autofocus; they tighten while you click. A REC light trails behind.
     Sizes live in styles.css (--cursor-size, --cursor-pad, --cursor-corner). */
  if (finePointer) {
    const cursor = document.querySelector('.cursor');
    const rec = document.querySelector('.cursor-rec'); // the REC light that trails it
    const css = getComputedStyle(document.documentElement);
    const px = (name, fallback) => parseFloat(css.getPropertyValue(name)) || fallback;
    const SIZE = px('--cursor-size', 30);
    const PAD = px('--cursor-pad', 8);
    const LOCKABLE = 'a, button, [role="button"], input, label.nolan-chat__attach';
    const MAX_LOCK = 420;   // targets wider than this (big cards) aren't framed

    const FOLLOW = 0.22;    // 0–1: higher = brackets catch up with the pointer faster
    const REC_FOLLOW = 0.1; // the REC light lags a little more

    let x = -100, y = -100, cx = -100, cy = -100, w = SIZE, h = SIZE, rx = -100, ry = -100;
    let target = null, pressed = false;

    window.addEventListener('mousemove', (e) => {
      x = e.clientX; y = e.clientY;
      if (!cursor.classList.contains('is-active')) { cx = rx = x; cy = ry = y; } // no fly-in from the corner
      cursor.classList.add('is-active');
      rec?.classList.add('is-active');
      const t = e.target.closest(LOCKABLE);
      target = t && t.getBoundingClientRect().width <= MAX_LOCK ? t : null;
      cursor.classList.toggle('is-locked', !!target);
    });
    document.addEventListener('mouseleave', () => { cursor.classList.remove('is-active'); rec?.classList.remove('is-active'); });
    window.addEventListener('mousedown', () => { pressed = true; });
    window.addEventListener('mouseup', () => { pressed = false; });

    (function follow() {
      // Where the brackets want to be: framing the target, or a small box on the pointer
      let tx = x, ty = y, tw = SIZE, th = SIZE;
      if (target && target.isConnected) {
        const r = target.getBoundingClientRect();
        tx = r.left + r.width / 2; ty = r.top + r.height / 2;
        tw = r.width + PAD * 2; th = r.height + PAD * 2;
      }
      const squeeze = pressed ? 0.82 : 1;
      cx += (tx - cx) * FOLLOW;
      cy += (ty - cy) * FOLLOW;
      w += (tw * squeeze - w) * FOLLOW;
      h += (th * squeeze - h) * FOLLOW;
      cursor.style.width = `${w}px`;
      cursor.style.height = `${h}px`;
      cursor.style.transform = `translate3d(${cx - w / 2}px, ${cy - h / 2}px, 0)`;

      // REC light: just off the brackets' lower right corner, trailing behind
      if (rec) {
        rx += (cx + w / 2 + 6 - rx) * REC_FOLLOW;
        ry += (cy + h / 2 + 4 - ry) * REC_FOLLOW;
        rec.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      requestAnimationFrame(follow);
    })();
  }
}
