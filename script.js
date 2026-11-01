/* ===================================================================
   HORROR STORIES - COMPLETE INTERACTIVE JAVASCRIPT v3.0
   Exact ToonYug feature clone with Stripe payments & real animations
   =================================================================== */

'use strict';

// ====================================================
// STRIPE CONFIG (Test mode — replace with your keys)
// ====================================================
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51OxYmRSKJwWKi4TrHORROR000000000000HorrorStoriesTestKeyReplaceMe00000000000000000000000000000000000000';
// NOTE: Replace STRIPE_PUBLISHABLE_KEY with your real Stripe publishable key from https://dashboard.stripe.com/apikeys
// For testing right now: the payment form will work in demo mode showing the UI correctly.

let stripe = null;
let stripeElements = null;
let stripeCardElement = null;

function initStripe() {
  try {
    if (window.Stripe && STRIPE_PUBLISHABLE_KEY !== 'pk_test_51OxYmRSKJwWKi4TrHORROR000000000000HorrorStoriesTestKeyReplaceMe00000000000000000000000000000000000000') {
      stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
      stripeElements = stripe.elements({
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#e11d48',
            colorBackground: '#121217',
            colorText: '#f0f0f8',
            colorDanger: '#f87171',
            fontFamily: 'Inter, system-ui, sans-serif',
            borderRadius: '7px',
          }
        }
      });
      stripeCardElement = stripeElements.create('card', {
        style: {
          base: { color: '#f0f0f8', fontSize: '15px', '::placeholder': { color: '#64748b' } },
          invalid: { color: '#f87171' }
        }
      });
      stripeCardElement.mount('#stripeCardElement');
      stripeCardElement.on('change', (e) => {
        const errEl = document.getElementById('stripeCardErrors');
        errEl.textContent = e.error ? e.error.message : '';
      });
    } else {
      // Demo mode: show a placeholder card UI
      const mount = document.getElementById('stripeCardElement');
      if (mount) {
        mount.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:.5rem;">
            <input type="text" placeholder="Card number: 4242 4242 4242 4242" style="background:#0f0f14; border:1px solid #2a2a3a; border-radius:7px; padding:.65rem .9rem; color:#f0f0f8; font-size:.88rem; outline:none; width:100%;" id="demoCardNum">
            <div style="display:flex; gap:.5rem;">
              <input type="text" placeholder="MM/YY" style="background:#0f0f14; border:1px solid #2a2a3a; border-radius:7px; padding:.65rem .9rem; color:#f0f0f8; font-size:.88rem; outline:none; flex:1;" id="demoCardExp">
              <input type="text" placeholder="CVC" style="background:#0f0f14; border:1px solid #2a2a3a; border-radius:7px; padding:.65rem .9rem; color:#f0f0f8; font-size:.88rem; outline:none; width:80px;" id="demoCardCvc">
            </div>
            <p style="font-size:.72rem; color:#64748b; margin-top:.25rem;">🧪 Demo Mode: Use card 4242 4242 4242 4242, any future date, any CVC</p>
          </div>
        `;
      }
    }
  } catch(e) {
    console.warn('Stripe init skipped (demo mode):', e.message);
  }
}

// ====================================================
// PRODUCT CATALOG (ToonYug exact categories)
// ====================================================
const products = [
  {
    id: 1,
    title: 'Chudail Banshee Ghost Rig',
    category: 'ghosts',
    catLabel: '2D Ghost Rig',
    art: '👰‍♀️',
    badge: 'HOT',
    badgeClass: 'cb-hot',
    price: '₹2,399',
    numericPrice: 2399,
    priceUSD: 29,
    meta: 'Full bone hierarchy • 12 Terror Expressions • Adobe Animate & Moho',
    desc: 'High-end 2D rigged female ghost character with inverted feet, floating hair physics, spectral trail FX, and detachable bloody veil. Includes 12 pre-built facial expressions and 4 walk cycles.',
    rating: '4.9 ⭐ (128)',
    formats: ['Adobe Animate .fla', 'Moho .mohoproj', 'After Effects .aep', 'Vector SVG', 'PSD Layers']
  },
  {
    id: 2,
    title: 'Haunted Haveli & Cemetery BG',
    category: 'backgrounds',
    catLabel: 'Haunted Background',
    art: '🏚️',
    badge: 'PARALLAX',
    badgeClass: 'cb-rig',
    price: '₹1,999',
    numericPrice: 1999,
    priceUSD: 24,
    meta: '4K Multi-layer PSD • Fog & Thunder layers • Night & Dusk modes',
    desc: 'Spooky Indian mansion and crumbling gothic graveyard with 8 separated parallax planes: mist, moonlight, iron gate, broken walls, and overgrown vegetation. Perfect for 2.5D camera pans.',
    rating: '4.8 ⭐ (92)',
    formats: ['4K PSD Layers', 'PNG Sequence', 'Video Loop MP4', 'After Effects .aep']
  },
  {
    id: 3,
    title: 'Rakshasa Demon Character Rig',
    category: 'demons',
    catLabel: 'Demon & Devil',
    art: '😈',
    badge: 'POPULAR',
    badgeClass: 'cb-popular',
    price: '₹2,799',
    numericPrice: 2799,
    priceUSD: 34,
    meta: 'Quadruped & bipedal modes • Roar lip-sync • 4 color variants',
    desc: 'Towering fanged demon puppet with glowing eyes, morphable jaw, dripping blood rig, and pre-animated attack sequences. Includes fire breath particle overlay in After Effects.',
    rating: '5.0 ⭐ (206)',
    formats: ['Adobe Animate .fla', 'Moho .mohoproj', 'Vector SVG', 'High-Res PSD']
  },
  {
    id: 4,
    title: 'Cursed Voodoo & Ritual Props',
    category: 'props',
    catLabel: 'Cursed Props',
    art: '🕯️',
    badge: 'PROPS',
    badgeClass: 'cb-rig',
    price: '₹1,149',
    numericPrice: 1149,
    priceUSD: 14,
    meta: 'Vector SVG & PSD • 12 animated props • Glowing candle flames',
    desc: 'Essential horror prop pack: animated skull chalice, flickering lanterns, spellbook with page-turn rig, enchanted planchette, crystal ball, hangman noose, and bloodied altar cloth.',
    rating: '4.7 ⭐ (74)',
    formats: ['Vector SVG', 'High-Res PSD', 'Adobe Animate .fla', 'PNG Spritesheet']
  },
  {
    id: 5,
    title: 'Horror Vocals & Scream FX Pack',
    category: 'audio',
    catLabel: 'Voice & Sound FX',
    art: '🎧',
    badge: 'SOUND FX',
    badgeClass: 'cb-sound',
    price: '₹1,549',
    numericPrice: 1549,
    priceUSD: 19,
    meta: '120 Royalty-Free WAV files • 24-bit 96kHz • YouTube Claim-Free',
    desc: 'Ultra-crisp horror audio: possessed murmurs, bone crunch foley, jumpscare stings, subterranean drones, banshee wails, and 40 atmospheres. Every track cleared for YouTube monetization.',
    rating: '4.9 ⭐ (165)',
    formats: ['WAV 24-bit 96kHz', 'MP3 320kbps', 'FLAC Lossless', 'OGG Vorbis']
  },
  {
    id: 6,
    title: '2026 Ghost Starter Bundle',
    category: 'ghosts',
    catLabel: 'Free Ghost Rig',
    art: '👻',
    badge: 'FREE',
    badgeClass: 'cb-free',
    price: 'FREE',
    numericPrice: 0,
    priceUSD: 0,
    meta: '1 Rigged Spirit • 2 Backgrounds • 5 Jump Scare SFX included',
    desc: 'Our community gift for starting horror YouTube animators. Completely free for commercial storytelling. Includes a basic ghost rig, two haunted backgrounds, and five professional jumpscare sounds.',
    rating: '4.6 ⭐ (1,240)',
    formats: ['Adobe Animate .fla', 'PSD Backgrounds', 'WAV Sound FX']
  },
  {
    id: 7,
    title: 'Possessed Child Puppet Rig',
    category: 'ghosts',
    catLabel: '2D Character Rig',
    art: '👧',
    badge: 'NEW',
    badgeClass: 'cb-new',
    price: '₹2,249',
    numericPrice: 2249,
    priceUSD: 27,
    meta: 'Head 360° spin rig • Tear & blood sliders • Auto walk cycle',
    desc: 'Creepypasta-ready rigged schoolgirl puppet with twisted neck morphs, hollow black pupil toggle, levitation rig, dragging feet cycle, and full facial possession expression library.',
    rating: '4.8 ⭐ (89)',
    formats: ['Adobe Animate .fla', 'Moho .mohoproj', 'Vector SVG', 'PSD Layers']
  },
  {
    id: 8,
    title: 'Dark Whisper Forest BG',
    category: 'backgrounds',
    catLabel: 'Haunted Background',
    art: '🌲',
    badge: 'PARALLAX',
    badgeClass: 'cb-rig',
    price: '₹1,799',
    numericPrice: 1799,
    priceUSD: 22,
    meta: '6 separated planes • Animated wind loop • Red eyes in shadows',
    desc: 'Deep nocturnal bamboo and banyan forest with dangling hangman ropes, glowing red eyes in the darkness, wind-animated foliage, blood-red moonlight, and eerie firefly particle overlay.',
    rating: '4.9 ⭐ (113)',
    formats: ['4K PSD Layers', 'PNG Sequence', 'After Effects .aep', 'Video Loop MP4']
  },
  {
    id: 9,
    title: 'Zombie Horde Pack (5 Rigs)',
    category: 'monsters',
    catLabel: 'Monster & Creature',
    art: '🧟',
    badge: 'BUNDLE',
    badgeClass: 'cb-popular',
    price: '₹3,999',
    numericPrice: 3999,
    priceUSD: 48,
    meta: '5 unique zombies • Walk cycles • Tear-apart physics rig',
    desc: 'Five fully-rigged undead characters: male, female, child, bloated, and charred zombie variants. Each has shambling walk cycles, unique gore details, and modular limb tear-apart rigs.',
    rating: '4.8 ⭐ (67)',
    formats: ['Adobe Animate .fla', 'Moho .mohoproj', 'Vector SVG', 'High-Res PSD']
  },
  {
    id: 10,
    title: 'Witch Coven Character Set',
    category: 'witches',
    catLabel: 'Witch & Warlock',
    art: '🧙‍♀️',
    badge: 'HOT',
    badgeClass: 'cb-hot',
    price: '₹2,649',
    numericPrice: 2649,
    priceUSD: 32,
    meta: '3 witch variants • Broomstick flying rig • Spell FX included',
    desc: 'Three witch archetypes: ancient crone, seductive dark enchantress, and mad forest hag. Each rigged with flying broomstick, cauldron stir animation, and projectile spell overlay.',
    rating: '4.9 ⭐ (104)',
    formats: ['Adobe Animate .fla', 'Moho .mohoproj', 'After Effects .aep', 'Vector SVG']
  },
  {
    id: 11,
    title: 'Dark Royal Court Characters',
    category: 'royals',
    catLabel: 'Dark Royal Empire',
    art: '👑',
    badge: 'PREMIUM',
    badgeClass: 'cb-new',
    price: '₹3,199',
    numericPrice: 3199,
    priceUSD: 38,
    meta: 'King, Queen, Knight & Executioner rigs • 3 throne backgrounds',
    desc: 'Four aristocratic horror characters set in a cursed medieval kingdom. Includes: mad king with crumbling crown, vampire queen, headless knight, and hooded executioner with working axe rig.',
    rating: '4.7 ⭐ (52)',
    formats: ['Adobe Animate .fla', 'Moho .mohoproj', 'Vector SVG', 'PSD Backgrounds']
  },
  {
    id: 12,
    title: 'Haunted Interior Room BG',
    category: 'backgrounds',
    catLabel: 'Haunted Background',
    art: '🏠',
    badge: 'PARALLAX',
    badgeClass: 'cb-rig',
    price: '₹1,649',
    numericPrice: 1649,
    priceUSD: 20,
    meta: 'Victorian bedroom • Animated curtains & fireplace • 5 layers',
    desc: 'Victorian haunted bedroom with animated flickering fireplace, swaying blood-stained curtains, rocking chair cycle, cracked mirror FX, and photo frames with animated spirit faces.',
    rating: '4.8 ⭐ (88)',
    formats: ['4K PSD Layers', 'PNG Sequence', 'After Effects .aep', 'MP4 Video Loop']
  }
];

const voiceActors = [
  {
    id: 'va1',
    name: 'Vikram "The Shadow"',
    role: 'Deep Narrator & Entity Voice',
    avatar: '🧛‍♂️',
    desc: 'Specializes in chilling storytelling, ancient demon whispers, and haunting horror story prologues for YouTube animation channels.',
    sound: 'whisper',
    price: '₹4,999 / episode',
    tags: ['Male Voice', 'Horror Narrator', 'Dark Entity']
  },
  {
    id: 'va2',
    name: 'Kavita "Witch\'s Wail"',
    role: 'Witch, Banshee & Screamer',
    avatar: '🧙‍♀️',
    desc: 'Bone-piercing screams, deranged laughter, and spine-chilling curses. Specializes in climax scenes, possessions, and supernatural reveals.',
    sound: 'scream',
    price: '₹5,499 / episode',
    tags: ['Female Voice', 'Horror Screams', 'Witch & Banshee']
  },
  {
    id: 'va3',
    name: 'Rohan "The Ghoul"',
    role: 'Monster, Zombie & Growler',
    avatar: '🧟‍♂️',
    desc: 'Throaty subterranean monster growls, visceral creature sounds, and terrifying demonic entity gasps and breathing effects.',
    sound: 'growl',
    price: '₹4,499 / episode',
    tags: ['Male Voice', 'Monster Sounds', 'Creature FX']
  },
  {
    id: 'va4',
    name: 'Priya "Dark Ambient"',
    role: 'Eerie Drones & Atmospheres',
    avatar: '🔮',
    desc: 'Sub-bass frequencies, haunted grandfather clock atmospheres, cold subterranean wind, and chilling minimalist ambient scores.',
    sound: 'drone',
    price: '₹3,999 / episode',
    tags: ['Female Voice', 'Ambient FX', 'Atmospheric Drones']
  }
];

const tutorials = [
  { art: '🎬', tag: 'MASTER PANEL', title: 'One-Click Ghost Animation in Adobe Animate', meta: '18 min • Free • 42,000 views' },
  { art: '💀', tag: 'LIP SYNC', title: 'Accurate Horror Lip Sync Using Master Panel', meta: '22 min • Free • 31,500 views' },
  { art: '🌫️', tag: 'VFX', title: 'Atmospheric Fog & Mist Effects for Horror Scenes', meta: '15 min • Free • 28,900 views' },
  { art: '🏚️', tag: 'BACKGROUNDS', title: 'Building 2.5D Parallax Haunted Environments', meta: '35 min • Free • 19,200 views' }
];

// ====================================================
// STATE
// ====================================================
let cart = [];
let wishlist = [];
let visibleProductCount = 8;
let currentFilter = 'all';
let audioCtx = null;

// ====================================================
// HORROR CANVAS PARTICLE SYSTEM
// ====================================================
function initHorrorCanvas() {
  const canvas = document.getElementById('horrorCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const particles = [];
  const PARTICLE_COUNT = 60;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 2.5 + 0.5,
      speedY: -(Math.random() * 0.4 + 0.1),
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.7 ? 0 : 270,  // red or purple
      pulse: Math.random() * Math.PI * 2,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.pulse += 0.02;
      p.y += p.speedY;
      p.x += p.speedX;
      const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},90%,60%,${alpha})`;
      ctx.fill();

      if (p.size > 1.5) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},90%,60%,${alpha * 0.08})`;
        ctx.fill();
      }
    });
    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
}

// ====================================================
// HERO SLIDER
// ====================================================
function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('slideDots');
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  if (!slides.length) return;

  let current = 0;
  let timer;

  dotsContainer.innerHTML = [...slides].map((_, i) =>
    `<button class="slide-dot ${i === 0 ? 'active' : ''}" aria-label="Go to slide ${i + 1}"></button>`
  ).join('');

  const dots = dotsContainer.querySelectorAll('.slide-dot');

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 6000);
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); startTimer(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); startTimer(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startTimer(); }));
  startTimer();
}

// ====================================================
// CATEGORY TILES
// ====================================================
function initCategoryTiles() {
  const tiles = document.querySelectorAll('.cat-tile');
  tiles.forEach(tile => {
    tile.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = tile.dataset.cat;
      tiles.forEach(t => t.classList.remove('active'));
      tile.classList.add('active');
      applyFilter(cat);
      document.getElementById('market').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ====================================================
// PRODUCT RENDER & FILTER
// ====================================================
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const filtered = currentFilter === 'all'
    ? products
    : products.filter(p => p.category === currentFilter);

  const visible = filtered.slice(0, visibleProductCount);

  if (visible.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:4rem 1rem;color:var(--c-muted);">
        <div style="font-size:3rem;margin-bottom:1rem;">🔍</div>
        <h3 style="color:#fff;margin-bottom:.5rem;">No assets found</h3>
        <p>Try a different category or search term.</p>
      </div>`;
    return;
  }

  grid.innerHTML = visible.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="card-thumb">
        <div class="card-badge-row">
          <span class="card-badge ${p.badgeClass}">${p.badge}</span>
        </div>
        <button class="card-wishlist-btn ${wishlist.includes(p.id) ? 'wishlisted' : ''}" data-id="${p.id}" aria-label="Add to wishlist">
          ${wishlist.includes(p.id) ? '🖤' : '♡'}
        </button>
        <div class="card-emoji-art">${p.art}</div>
        <button class="quick-view-btn" data-id="${p.id}">👁 Quick View</button>
      </div>
      <div class="card-body">
        <div class="card-cat">${p.catLabel}</div>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-meta">${p.meta}</p>
        <div class="card-footer">
          <div>
            <div class="card-price ${p.numericPrice === 0 ? 'price-free' : ''}">${p.price}</div>
            <div class="card-rating">${p.rating}</div>
          </div>
          <button class="add-to-cart-btn" data-id="${p.id}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            ${p.numericPrice === 0 ? 'Free Download' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Load more button visibility
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.style.display = visible.length < filtered.length ? 'inline-flex' : 'none';
  }

  bindCardEvents();
}

function bindCardEvents() {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
  });
  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', () => openProductModal(parseInt(btn.dataset.id)));
  });
  document.querySelectorAll('.card-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); toggleWishlist(parseInt(btn.dataset.id)); });
  });
}

function applyFilter(cat) {
  currentFilter = cat;
  visibleProductCount = 8;

  // Sync filter chips
  document.querySelectorAll('.filter-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.filter === cat);
  });

  // Sync mega menu links (deselect)
  renderProducts();
}

// Filter chips
function initFilterChips() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => applyFilter(chip.dataset.filter));
  });

  // Mega menu category links
  document.querySelectorAll('.mega-col a[data-cat]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      applyFilter(a.dataset.cat);
      document.getElementById('market').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// Load More
function initLoadMore() {
  const btn = document.getElementById('loadMoreBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      visibleProductCount += 4;
      renderProducts();
    });
  }
}

// ====================================================
// SEARCH
// ====================================================
function initSearch() {
  const input = document.getElementById('siteSearch');
  const btn = document.getElementById('siteSearchBtn');
  const dropdown = document.getElementById('searchDropdown');
  if (!input || !btn) return;

  function showResults(query) {
    if (!query || query.length < 2) {
      dropdown.classList.remove('show');
      return;
    }
    const q = query.toLowerCase();
    const results = products.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.catLabel.toLowerCase().includes(q) ||
      p.meta.toLowerCase().includes(q)
    ).slice(0, 5);

    if (results.length === 0) {
      dropdown.classList.remove('show');
      return;
    }

    dropdown.innerHTML = results.map(p => `
      <div class="search-result-item" data-id="${p.id}">
        <span class="search-result-art">${p.art}</span>
        <div>
          <div style="font-weight:700;font-size:.88rem;color:#fff;">${p.title}</div>
          <div style="font-size:.75rem;color:var(--c-muted);">${p.catLabel} · ${p.price}</div>
        </div>
      </div>
    `).join('');

    dropdown.classList.add('show');

    dropdown.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        openProductModal(parseInt(item.dataset.id));
        dropdown.classList.remove('show');
        input.value = '';
      });
    });
  }

  function performSearch() {
    const q = input.value.trim().toLowerCase();
    dropdown.classList.remove('show');
    if (!q) { currentFilter = 'all'; visibleProductCount = 8; renderProducts(); return; }

    const filtered = products.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.catLabel.toLowerCase().includes(q) ||
      p.meta.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    );
    const grid = document.getElementById('productsGrid');
    if (grid) {
      currentFilter = 'all';
      const visible = filtered.slice(0, 8);
      grid.innerHTML = visible.length ? visible.map(p => `
        <div class="product-card" data-id="${p.id}">
          <div class="card-thumb">
            <div class="card-badge-row"><span class="card-badge ${p.badgeClass}">${p.badge}</span></div>
            <div class="card-emoji-art">${p.art}</div>
            <button class="quick-view-btn" data-id="${p.id}">👁 Quick View</button>
          </div>
          <div class="card-body">
            <div class="card-cat">${p.catLabel}</div>
            <h3 class="card-title">${p.title}</h3>
            <p class="card-meta">${p.meta}</p>
            <div class="card-footer">
              <div>
                <div class="card-price ${p.numericPrice === 0 ? 'price-free' : ''}">${p.price}</div>
                <div class="card-rating">${p.rating}</div>
              </div>
              <button class="add-to-cart-btn" data-id="${p.id}">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                ${p.numericPrice === 0 ? 'Free Download' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>`).join('') :
        `<div style="grid-column:1/-1;text-align:center;padding:4rem;color:var(--c-muted);"><div style="font-size:3rem;margin-bottom:1rem;">🔍</div><h3 style="color:#fff;">No results for "${q}"</h3></div>`;
      bindCardEvents();
    }
    document.getElementById('market').scrollIntoView({ behavior: 'smooth' });
    input.value = '';
  }

  input.addEventListener('input', () => showResults(input.value.trim()));
  btn.addEventListener('click', performSearch);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') performSearch(); });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
}

// ====================================================
// CART LOGIC
// ====================================================
function addToCart(productId) {
  const item = products.find(p => p.id === productId);
  if (!item) return;

  if (item.numericPrice === 0) {
    showNotification(`🎁 "${item.title}" added to downloads!`, 'success');
    triggerFreeDownload(item);
    return;
  }

  cart.push({ ...item, cartKey: Date.now() });
  updateCartUI();
  openCartDrawer();
  showNotification(`🛒 "${item.title}" added to cart!`, 'success');
}

function triggerFreeDownload(item) {
  // Simulate generating a temporary download token
  const token = 'HS_FREE_' + Math.random().toString(36).substr(2, 9).toUpperCase();
  showNotification(`✅ Download Token: ${token} — Check your email!`, 'info');
  // In production: call your backend /api/free-download endpoint here
}

function removeFromCart(cartKey) {
  cart = cart.filter(item => item.cartKey !== cartKey);
  updateCartUI();
}

function updateCartUI() {
  const count = cart.length;
  const total = cart.reduce((s, i) => s + i.numericPrice, 0);

  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartDrawerCount').textContent = `(${count})`;

  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = `₹${total.toLocaleString('en-IN')}.00`;

  const itemsEl = document.getElementById('cartItems');
  const emptyEl = document.getElementById('cartEmpty');

  if (count === 0) {
    itemsEl.innerHTML = '';
    emptyEl.style.display = 'flex';
    return;
  }
  emptyEl.style.display = 'none';
  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item-row">
      <span class="ci-art">${item.art}</span>
      <div class="ci-info">
        <div class="ci-name">${item.title}</div>
        <div class="ci-price">${item.price}</div>
      </div>
      <button class="ci-remove" data-key="${item.cartKey}" aria-label="Remove">✕</button>
    </div>
  `).join('');

  itemsEl.querySelectorAll('.ci-remove').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.key)));
  });
}

function openCartDrawer() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('overlay').classList.add('show');
}
function closeCartDrawer() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

// ====================================================
// WISHLIST
// ====================================================
function toggleWishlist(productId) {
  const idx = wishlist.indexOf(productId);
  if (idx === -1) {
    wishlist.push(productId);
    showNotification('🖤 Saved to Wishlist!', 'info');
  } else {
    wishlist.splice(idx, 1);
  }
  document.getElementById('wishlistCount').textContent = wishlist.length;
  document.getElementById('wishlistDrawerCount').textContent = `(${wishlist.length})`;
  updateWishlistUI();
  renderProducts();
}

function updateWishlistUI() {
  const itemsEl = document.getElementById('wishlistItems');
  const emptyEl = document.getElementById('wishlistEmpty');
  if (!itemsEl) return;

  const wishItems = products.filter(p => wishlist.includes(p.id));
  if (!wishItems.length) {
    itemsEl.innerHTML = '';
    emptyEl.style.display = 'flex';
    return;
  }
  emptyEl.style.display = 'none';
  itemsEl.innerHTML = wishItems.map(p => `
    <div class="cart-item-row">
      <span class="ci-art">${p.art}</span>
      <div class="ci-info">
        <div class="ci-name">${p.title}</div>
        <div class="ci-price">${p.price}</div>
      </div>
      <button class="add-to-cart-btn" style="font-size:.72rem;padding:.4rem .7rem;" data-id="${p.id}">Add to Cart</button>
    </div>
  `).join('');

  itemsEl.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
  });
}

// ====================================================
// PRODUCT QUICK VIEW MODAL
// ====================================================
function openProductModal(productId) {
  const p = products.find(prod => prod.id === productId);
  if (!p) return;

  document.getElementById('modalContent').innerHTML = `
    <div class="pm-hero">
      <span class="pm-art">${p.art}</span>
      <div class="pm-badge-row">
        <span class="card-badge ${p.badgeClass}">${p.badge}</span>
      </div>
      <h2 class="pm-title">${p.title}</h2>
      <p class="pm-cat-price">${p.catLabel} <span class="pm-price-big">${p.price}</span></p>
      <div style="margin-top:.35rem;font-size:.82rem;color:var(--c-amber);">${p.rating}</div>
    </div>
    <p class="pm-desc">${p.desc}</p>
    <div class="pm-formats">
      <strong>📦 Included Formats:</strong>
      <div class="pm-format-list">
        ${p.formats.map(f => `<span class="pm-fmt">${f}</span>`).join('')}
      </div>
    </div>
    <div class="pm-actions">
      ${p.numericPrice === 0
        ? `<button class="btn-primary" onclick="triggerFreeDownload({title:'${p.title}'}); document.getElementById('modalBackdrop').classList.remove('open');">⚡ Free Download</button>`
        : `<button class="btn-primary" onclick="addToCart(${p.id}); document.getElementById('modalBackdrop').classList.remove('open');">🛒 Add to Cart — ${p.price}</button>`
      }
      <button class="btn-ghost" onclick="toggleWishlist(${p.id}); document.getElementById('modalBackdrop').classList.remove('open');">
        ${wishlist.includes(p.id) ? '🖤 Wishlisted' : '♡ Save'}
      </button>
    </div>
  `;

  document.getElementById('modalBackdrop').classList.add('open');
}

// ====================================================
// STRIPE PAYMENT CHECKOUT
// ====================================================
function openPaymentModal() {
  if (cart.length === 0) {
    showNotification('🛒 Your cart is empty!', 'warning');
    return;
  }

  closeCartDrawer();

  const total = cart.reduce((s, i) => s + i.numericPrice, 0);
  const orderSummary = document.getElementById('orderSummary');
  orderSummary.innerHTML = `
    ${cart.map(item => `
      <div class="os-item">
        <span class="os-name">${item.art} ${item.title}</span>
        <span class="os-price">${item.price}</span>
      </div>
    `).join('')}
    <div class="os-item">
      <span class="os-name">GST (18%)</span>
      <span class="os-price">₹${Math.round(total * 0.18).toLocaleString('en-IN')}</span>
    </div>
    <div class="os-item os-total">
      <span class="os-name">Total</span>
      <span class="os-price">₹${Math.round(total * 1.18).toLocaleString('en-IN')}</span>
    </div>
  `;

  document.getElementById('paymentBackdrop').classList.add('open');
  initStripe();
}

async function handlePaymentSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('paymentSubmitBtn');
  const btnText = document.getElementById('payBtnText');
  const email = document.getElementById('pfEmail').value;
  const name = document.getElementById('pfName').value;

  if (!email || !name) {
    showNotification('Please fill in all required fields.', 'warning');
    return;
  }

  // Disable button and show spinner
  btn.disabled = true;
  btnText.innerHTML = '<span class="spinner"></span> Processing...';

  if (stripe && stripeCardElement) {
    // Real Stripe payment flow
    try {
      // In production: first create a PaymentIntent on your backend server
      // const response = await fetch('/api/create-payment-intent', { method: 'POST', ... });
      // const { clientSecret } = await response.json();
      // const { error } = await stripe.confirmCardPayment(clientSecret, { payment_method: { card: stripeCardElement, billing_details: { name, email } } });

      // Demo: simulate processing delay
      await new Promise(r => setTimeout(r, 2000));
      showPaymentSuccess();
    } catch (err) {
      document.getElementById('stripeCardErrors').textContent = err.message;
      btn.disabled = false;
      btnText.textContent = 'Pay Now ⚡';
    }
  } else {
    // Demo mode: validate demo card fields
    const cardNum = document.getElementById('demoCardNum');
    const cardExp = document.getElementById('demoCardExp');
    const cardCvc = document.getElementById('demoCardCvc');

    if (!cardNum || !cardNum.value.replace(/\s/g,'').match(/^\d{13,19}$/)) {
      document.getElementById('stripeCardErrors').textContent = 'Please enter a valid card number.';
      btn.disabled = false;
      btnText.textContent = 'Pay Now ⚡';
      return;
    }

    if (!cardExp || !cardExp.value.match(/^\d{2}\/\d{2,4}$/)) {
      document.getElementById('stripeCardErrors').textContent = 'Please enter a valid expiry date (MM/YY).';
      btn.disabled = false;
      btnText.textContent = 'Pay Now ⚡';
      return;
    }

    if (!cardCvc || !cardCvc.value.match(/^\d{3,4}$/)) {
      document.getElementById('stripeCardErrors').textContent = 'Please enter a valid CVC.';
      btn.disabled = false;
      btnText.textContent = 'Pay Now ⚡';
      return;
    }

    // Simulate processing
    await new Promise(r => setTimeout(r, 2200));
    showPaymentSuccess();
  }
}

function showPaymentSuccess() {
  document.getElementById('paymentBackdrop').classList.remove('open');
  const orderId = 'HS-' + Date.now().toString(36).toUpperCase();
  document.getElementById('successOrderId').textContent = `Order ID: ${orderId}`;
  document.getElementById('successBackdrop').classList.add('open');
  cart = [];
  updateCartUI();
}

// ====================================================
// VOICE ACTOR AUDIO (Web Audio API synthesis)
// ====================================================
function initAudioCtx() {
  if (audioCtx) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return;
  }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (AC) audioCtx = new AC();
}

function playHorrorSound(type, btn, statusEl) {
  initAudioCtx();
  if (!audioCtx) {
    if (statusEl) statusEl.textContent = '⚠ Audio not supported in this browser';
    return;
  }
  btn.classList.add('playing');
  if (statusEl) statusEl.textContent = 'Playing... 🔊';

  const now = audioCtx.currentTime;
  let duration = 2.5;

  if (type === 'whisper') {
    // Filtered noise whisper
    const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 3, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.45));
    }
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    const bp = audioCtx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(900, now);
    bp.frequency.exponentialRampToValueAtTime(300, now + 2.8);
    bp.Q.value = 4;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
    src.connect(bp); bp.connect(gain); gain.connect(audioCtx.destination);
    src.start(); duration = 2.8;
  } else if (type === 'scream') {
    // Dual osc discordant scream
    [500, 512].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(380, now + 1.8);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(); osc.stop(now + 1.8);
    });
    duration = 1.8;
  } else if (type === 'growl') {
    // FM monster growl
    const osc = audioCtx.createOscillator();
    const mod = audioCtx.createOscillator();
    const modGain = audioCtx.createGain();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.linearRampToValueAtTime(55, now + 2.2);
    mod.frequency.setValueAtTime(38, now);
    modGain.gain.setValueAtTime(90, now);
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
    mod.connect(modGain); modGain.connect(osc.frequency);
    osc.connect(gain); gain.connect(audioCtx.destination);
    mod.start(); osc.start(); mod.stop(now + 2.2); osc.stop(now + 2.2);
    duration = 2.2;
  } else {
    // Sub-bass drone
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(68, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 3.2);
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(now + 3.2);
    duration = 3.2;
  }

  setTimeout(() => {
    btn.classList.remove('playing');
    if (statusEl) statusEl.textContent = 'Click to audition';
  }, duration * 1000 + 100);
}

// ====================================================
// VOICE ACTORS RENDER
// ====================================================
function renderVoiceActors() {
  const grid = document.getElementById('vaGrid');
  if (!grid) return;
  grid.innerHTML = voiceActors.map(va => `
    <div class="va-card">
      <div class="va-header">
        <div class="va-avatar">${va.avatar}</div>
        <div>
          <div class="va-name">${va.name}</div>
          <span class="va-role">${va.role}</span>
        </div>
      </div>
      <p class="va-desc">${va.desc}</p>
      <div style="display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:1rem;">
        ${va.tags.map(t => `<span style="font-size:.65rem;font-weight:700;background:rgba(139,92,246,.12);border:1px solid rgba(139,92,246,.3);color:var(--c-purple2);padding:.15rem .5rem;border-radius:4px;">${t}</span>`).join('')}
      </div>
      <div class="va-player">
        <button class="va-audio-btn" data-sound="${va.sound}" data-va-id="${va.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Audition Sample
        </button>
        <span class="va-status">Click to audition</span>
        <button class="va-add-btn" data-va-id="${va.id}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          Hire — ${va.price}
        </button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.va-audio-btn').forEach(btn => {
    const statusEl = btn.closest('.va-player').querySelector('.va-status');
    btn.addEventListener('click', () => playHorrorSound(btn.dataset.sound, btn, statusEl));
  });

  document.querySelectorAll('.va-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const va = voiceActors.find(v => v.id === btn.dataset.vaId);
      if (va) showNotification(`🎙️ Booking request for "${va.name}" sent! We'll contact you via email.`, 'success');
    });
  });
}

// ====================================================
// TUTORIALS RENDER
// ====================================================
function renderTutorials() {
  const grid = document.getElementById('tutorialsGrid');
  if (!grid) return;
  grid.innerHTML = tutorials.map(t => `
    <div class="tutorial-card">
      <div class="tutorial-thumb">
        ${t.art}
        <div class="tut-play-overlay">
          <div class="tut-play-btn">▶</div>
        </div>
      </div>
      <div class="tutorial-body">
        <div class="tut-tag">${t.tag}</div>
        <div class="tut-title">${t.title}</div>
        <div class="tut-meta">${t.meta}</div>
      </div>
    </div>
  `).join('');
}

// ====================================================
// NEWSLETTER
// ====================================================
function initNewsletter() {
  const form = document.getElementById('nlForm');
  const success = document.getElementById('nlSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('nlEmail').value;
    success.textContent = `🎃 Welcome to the coven! Spooky gifts are on their way to ${email}!`;
    form.reset();
    setTimeout(() => { success.textContent = ''; }, 6000);
  });
}

// ====================================================
// NOTIFICATION TOAST
// ====================================================
function showNotification(message, type = 'success') {
  let container = document.getElementById('notifContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notifContainer';
    container.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:.5rem;pointer-events:none;';
    document.body.appendChild(container);
  }

  const colors = { success: '#10b981', warning: '#f59e0b', info: '#8b5cf6', error: '#ef4444' };
  const toast = document.createElement('div');
  toast.style.cssText = `background:var(--c-card);border:1px solid ${colors[type] || colors.success};border-left:4px solid ${colors[type] || colors.success};border-radius:8px;padding:.85rem 1.25rem;font-size:.88rem;color:#fff;max-width:340px;box-shadow:0 8px 25px rgba(0,0,0,0.7);animation:toastIn .3s ease forwards;pointer-events:auto;`;
  toast.textContent = message;

  container.appendChild(toast);

  if (!document.getElementById('toastStyle')) {
    const style = document.createElement('style');
    style.id = 'toastStyle';
    style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}@keyframes toastOut{from{opacity:1}to{opacity:0;transform:translateX(20px)}}';
    document.head.appendChild(style);
  }

  setTimeout(() => {
    toast.style.animation = 'toastOut .3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ====================================================
// MASTER PANEL MOCKUP ANIMATION
// ====================================================
function initMockupAnimations() {
  const expressions = [
    'Haunted Wail', 'Banshee Scream', 'Evil Grin', 'Death Stare',
    'Sorrow Cry', 'Rage Possessed', 'Blank Hollow'
  ];
  const hudEl = document.getElementById('hudExpression');
  if (hudEl) {
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % expressions.length;
      hudEl.textContent = expressions[idx];
    }, 2500);
  }
}

// ====================================================
// DRAWER & MODAL CONTROLS
// ====================================================
function initDrawersAndModals() {
  // Cart
  document.getElementById('cartToggle').addEventListener('click', openCartDrawer);
  document.getElementById('cartDrawerClose').addEventListener('click', closeCartDrawer);
  document.getElementById('overlay').addEventListener('click', () => {
    closeCartDrawer();
    closeWishlistDrawer();
  });

  // Checkout
  document.getElementById('checkoutBtn').addEventListener('click', openPaymentModal);
  document.getElementById('continueShoppingBtn').addEventListener('click', closeCartDrawer);

  // Wishlist
  document.getElementById('wishlistToggle').addEventListener('click', () => {
    document.getElementById('wishlistDrawer').classList.add('open');
    document.getElementById('overlay').classList.add('show');
    updateWishlistUI();
  });
  document.getElementById('wishlistDrawerClose').addEventListener('click', closeWishlistDrawer);

  // Product modal
  document.getElementById('modalClose').addEventListener('click', () =>
    document.getElementById('modalBackdrop').classList.remove('open'));
  document.getElementById('modalBackdrop').addEventListener('click', (e) => {
    if (e.target.id === 'modalBackdrop') e.target.classList.remove('open');
  });

  // Payment modal
  document.getElementById('paymentModalClose').addEventListener('click', () =>
    document.getElementById('paymentBackdrop').classList.remove('open'));
  document.getElementById('paymentBackdrop').addEventListener('click', (e) => {
    if (e.target.id === 'paymentBackdrop') e.target.classList.remove('open');
  });

  // Payment form
  document.getElementById('paymentForm').addEventListener('submit', handlePaymentSubmit);

  // Success modal
  document.getElementById('successCloseBtn').addEventListener('click', () =>
    document.getElementById('successBackdrop').classList.remove('open'));

  // ESC key closes all
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeWishlistDrawer();
      document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
    }
  });
}

function closeWishlistDrawer() {
  document.getElementById('wishlistDrawer').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

// ====================================================
// MOBILE NAV
// ====================================================
function initMobileNav() {
  const hamburger = document.getElementById('hamburgerBtn');
  const nav = document.getElementById('mainNav');
  if (!hamburger || !nav) return;
  hamburger.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'none' ? 'block' : 'none';
  });
}

// ====================================================
// STICKY HEADER SHRINK
// ====================================================
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.9)';
    } else {
      header.style.boxShadow = '0 2px 40px rgba(0,0,0,0.6)';
    }
  }, { passive: true });
}

// ====================================================
// BOOT — Run everything after DOM ready
// ====================================================
document.addEventListener('DOMContentLoaded', () => {
  initHorrorCanvas();
  initSlider();
  initCategoryTiles();
  renderProducts();
  initFilterChips();
  initLoadMore();
  initSearch();
  renderVoiceActors();
  renderTutorials();
  initNewsletter();
  initDrawersAndModals();
  initMockupAnimations();
  initMobileNav();
  initStickyHeader();
  updateCartUI();
});
