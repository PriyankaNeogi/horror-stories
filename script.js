/* ==========================================================================
   HORROR STORIES - INTERACTIVE JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. ASSET CATALOG DATA (Exact match to ToonYug categories & horror theme)
  const products = [
    {
      id: 1,
      title: "Chudail & Banshee 2D Rig",
      category: "rigs",
      categoryName: "2D Ghost Rig",
      art: "👰‍♀️",
      badge: "HOT",
      badgeClass: "badge-hot",
      price: "$29.00",
      numericPrice: 29.00,
      meta: "Full bone hierarchy • 12 Terror Expressions • Adobe Animate & Moho",
      description: "High-end 2D rigged female ghost character with inverted feet, floating hair physics, and detachable bloody veil."
    },
    {
      id: 2,
      title: "Haunted Haveli & Cemetery",
      category: "backgrounds",
      categoryName: "Haunted Scenery",
      art: "🏚️",
      badge: "RIGGED BG",
      badgeClass: "badge-rig",
      price: "$24.00",
      numericPrice: 24.00,
      meta: "4K Multi-layer Parallax PSD • Fog & Thunder Layers included",
      description: "Spooky Indian mansion and crumbling gothic graveyard with separated mist, moonlight, and gate layers for easy 2.5D camera pans."
    },
    {
      id: 3,
      title: "Rakshasa & Forest Demon Rig",
      category: "monsters",
      categoryName: "Monsters & Beasts",
      art: "👹",
      badge: "POPULAR",
      badgeClass: "badge-hot",
      price: "$34.00",
      numericPrice: 34.00,
      meta: "Quadruped bone rig • Roar lip-sync • 4 Color Variations",
      description: "Towering fanged creature puppet with glowing eyes, morphable jaw, and pre-animated crawling cycles."
    },
    {
      id: 4,
      title: "Cursed Voodoo Doll & Ouija Prop",
      category: "props",
      categoryName: "Cursed Props",
      art: "🕯️",
      badge: "PROPS",
      badgeClass: "badge-rig",
      price: "$14.00",
      numericPrice: 14.00,
      meta: "Vector SVG & PSD • Glowing candle flames • 10 Interactive props",
      description: "Essential horror prop set including bleeding skull chalice, animated flickering lantern, spellbook, and enchanted planchette."
    },
    {
      id: 5,
      title: "Horror Vocals & Scream FX Pack",
      category: "audio",
      categoryName: "Voice & Ambience",
      art: "🎧",
      badge: "SOUND FX",
      badgeClass: "badge-sound",
      price: "$19.00",
      numericPrice: 19.00,
      meta: "120 Royalty-Free WAV Files • YouTube Claim-Free License",
      description: "Ultra-crisp 24-bit 96kHz horror voice acting clips: possessed murmurs, bone crunches, jumpscares, and subterranean drones."
    },
    {
      id: 6,
      title: "2026 Ghost Starter Bundle",
      category: "free",
      categoryName: "100% Free Pack",
      art: "👻",
      badge: "FREE",
      badgeClass: "badge-free",
      price: "FREE",
      numericPrice: 0.00,
      meta: "1 Rigged Spirit • 2 Backgrounds • 5 Jump Scare SFX",
      description: "Our community gift for starting horror YouTube animators. Completely free for commercial storytelling."
    },
    {
      id: 7,
      title: "Possessed Child Puppet Rig",
      category: "rigs",
      categoryName: "2D Ghost Rig",
      art: "👧",
      badge: "RIGGED",
      badgeClass: "badge-rig",
      price: "$27.00",
      numericPrice: 27.00,
      meta: "Head 360 Spin Rig • Tear & Blood sliders • Auto walk cycle",
      description: "Creepypasta-ready rigged schoolgirl puppet with twisted neck morphs and hollow black pupil toggle."
    },
    {
      id: 8,
      title: "Dark Jungle of Whispers",
      category: "backgrounds",
      categoryName: "Haunted Scenery",
      art: "🌲",
      badge: "PARALLAX",
      badgeClass: "badge-rig",
      price: "$22.00",
      numericPrice: 22.00,
      meta: "6 Separated Planes • Wind breeze animated loop",
      description: "Deep nocturnal bamboo and banyan forest with dangling hangman ropes and glowing red eyes in the shadows."
    }
  ];

  // 2. RENDER PRODUCTS
  const productsGrid = document.getElementById('productsGrid');

  function renderProducts(items) {
    if (!productsGrid) return;
    if (items.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #94a3b8;">
          <h3>No horror assets found</h3>
          <p>Try searching for "rig", "ghost", "background" or "free".</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = items.map(product => `
      <div class="product-card" data-category="${product.category}">
        <div class="card-thumbnail">
          <div class="card-badges">
            <span class="product-badge ${product.badgeClass}">${product.badge}</span>
          </div>
          <div class="card-art">${product.art}</div>
          <button class="quick-preview-btn" data-id="${product.id}">Quick View 👁️</button>
        </div>
        <div class="card-content">
          <span class="card-category">${product.categoryName}</span>
          <h3 class="card-title">${product.title}</h3>
          <p class="card-meta">${product.meta}</p>
          <div class="card-footer">
            <span class="card-price ${product.numericPrice === 0 ? 'free' : ''}">${product.price}</span>
            <button class="add-cart-btn" data-id="${product.id}">
              ${product.numericPrice === 0 ? 'Free Download ⚡' : 'Add to Cart 🛒'}
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Rebind Quick Preview and Add to Cart
    document.querySelectorAll('.quick-preview-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'));
        openProductModal(id);
      });
    });

    document.querySelectorAll('.add-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'));
        addToCart(id);
      });
    });
  }

  renderProducts(products);

  // 3. CATEGORY FILTER CONTROLS
  const filterBtns = document.querySelectorAll('.filter-btn');
  const catPills = document.querySelectorAll('.cat-pill');

  function applyFilter(category) {
    filterBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-filter') === category);
    });
    catPills.forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-category') === category);
    });

    if (category === 'all') {
      renderProducts(products);
    } else {
      const filtered = products.filter(p => p.category === category);
      renderProducts(filtered);
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      applyFilter(pill.getAttribute('data-category'));
    });
  });

  document.querySelectorAll('.dropdown-menu a[data-filter]').forEach(link => {
    link.addEventListener('click', (e) => {
      const filter = link.getAttribute('data-filter');
      applyFilter(filter);
    });
  });

  // 4. SEARCH FUNCTIONALITY
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  function performSearch() {
    const query = (searchInput.value || '').toLowerCase().trim();
    if (!query) {
      renderProducts(products);
      return;
    }
    const filtered = products.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.meta.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.categoryName.toLowerCase().includes(query)
    );
    renderProducts(filtered);
    const market = document.getElementById('market');
    if (market) market.scrollIntoView({ behavior: 'smooth' });
  }

  if (searchBtn) searchBtn.addEventListener('click', performSearch);
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }

  // 5. HERO SLIDER CONTROLS
  const slides = document.querySelectorAll('.hero-slider .slide');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsContainer = document.getElementById('sliderDots');
  let currentSlide = 0;
  let sliderInterval;

  if (slides.length > 0 && dotsContainer) {
    dotsContainer.innerHTML = Array.from(slides).map((_, i) => `
      <div class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>
    `).join('');

    const dots = dotsContainer.querySelectorAll('.dot');

    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }

    if (nextBtn) nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      resetSliderTimer();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      resetSliderTimer();
    });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.getAttribute('data-index')));
        resetSliderTimer();
      });
    });

    function resetSliderTimer() {
      clearInterval(sliderInterval);
      sliderInterval = setInterval(() => goToSlide(currentSlide + 1), 6000);
    }

    resetSliderTimer();
  }

  // 6. PROCEDURAL HORROR AUDIO SYNTHESIS (Web Audio API)
  // Generates real, eerie sound effects on demand with zero external dependencies
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSpookySound(type, statusEl) {
    initAudio();
    if (!audioCtx) return;

    if (statusEl) statusEl.textContent = 'Playing sound... 🔊';

    const now = audioCtx.currentTime;

    if (type === 'whisper') {
      // White noise filtered into an eerie whisper
      const bufferSize = audioCtx.sampleRate * 2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 1.8);
      filter.Q.value = 5.0;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();

    } else if (type === 'scream') {
      // High pitched discordant modulating scream
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(500, now);
      osc1.frequency.exponentialRampToValueAtTime(1400, now + 0.3);
      osc1.frequency.exponentialRampToValueAtTime(400, now + 1.5);

      osc2.frequency.setValueAtTime(520, now);
      osc2.frequency.exponentialRampToValueAtTime(1450, now + 0.3);
      osc2.frequency.exponentialRampToValueAtTime(390, now + 1.5);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(now + 1.5);
      osc2.stop(now + 1.5);

    } else if (type === 'growl') {
      // Low frequency FM monster growl
      const osc = audioCtx.createOscillator();
      const mod = audioCtx.createOscillator();
      const modGain = audioCtx.createGain();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.linearRampToValueAtTime(55, now + 1.8);

      mod.frequency.setValueAtTime(35, now);
      modGain.gain.setValueAtTime(80, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      mod.connect(modGain);
      modGain.connect(osc.frequency);
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      mod.start();
      osc.start();
      mod.stop(now + 1.8);
      osc.stop(now + 1.8);

    } else { // drone
      // Sub-bass ominous hum
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 2.5);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(now + 2.5);
    }

    setTimeout(() => {
      if (statusEl) statusEl.textContent = 'Click to test sound';
    }, 2500);
  }

  document.querySelectorAll('.audio-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const soundType = btn.getAttribute('data-sound');
      const status = btn.parentElement.querySelector('.audio-status');
      playSpookySound(soundType, status);
    });
  });

  // 7. SHOPPING CART STATE & SLIDE DRAWER
  let cart = [];
  const cartBtn = document.getElementById('cartBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartDrawer = document.getElementById('cartDrawer');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartCountEl = document.getElementById('cartCount');
  const cartCountDrawerEl = document.getElementById('cartCountDrawer');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartTotalDisplay = document.getElementById('cartTotalDisplay');
  const checkoutBtn = document.getElementById('checkoutBtn');

  function openCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('active');
    }
  }

  function closeCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('active');
    }
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  function addToCart(productId) {
    const item = products.find(p => p.id === productId);
    if (!item) return;

    if (item.numericPrice === 0) {
      alert(`🎉 Starting instant download for: "${item.title}"!\nPackage includes: Vector Puppet, 2 Backgrounds & Sound FX.`);
      return;
    }

    cart.push(item);
    updateCartUI();
    openCart();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
  }

  function updateCartUI() {
    const count = cart.length;
    if (cartCountEl) cartCountEl.textContent = count;
    if (cartCountDrawerEl) cartCountDrawerEl.textContent = count;

    if (!cartItemsContainer) return;

    if (count === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart-text">Your cart is empty. Pick a scary rig or asset!</p>';
      if (cartTotalDisplay) cartTotalDisplay.textContent = '$0.00';
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.numericPrice, 0);
    if (cartTotalDisplay) cartTotalDisplay.textContent = `$${total.toFixed(2)}`;

    cartItemsContainer.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <span class="cart-item-art">${item.art}</span>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">${item.price}</div>
        </div>
        <button class="remove-item-btn" data-index="${index}">&times;</button>
      </div>
    `).join('');

    cartItemsContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        removeFromCart(idx);
      });
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your cart is empty. Add assets first!');
        return;
      }
      alert('🎉 Thank you for testing Horror Stories!\nIn production, this routes to Stripe / PayPal with immediate license key delivery.');
      cart = [];
      updateCartUI();
      closeCart();
    });
  }

  // 8. QUICK PREVIEW MODAL
  const previewModal = document.getElementById('previewModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalBody = document.getElementById('modalBody');

  function openProductModal(productId) {
    const item = products.find(p => p.id === productId);
    if (!item || !modalBody || !previewModal) return;

    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="font-size: 5rem; margin-bottom: 1rem;">${item.art}</div>
        <span class="badge ${item.badgeClass}">${item.badge}</span>
        <h2 style="font-family: var(--font-heading); margin-top: 0.5rem; color: #fff;">${item.title}</h2>
        <p style="color: var(--accent-red); font-weight: 700;">${item.categoryName} • ${item.price}</p>
      </div>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.6;">
        ${item.description}
      </p>
      <div style="background: #111118; border: 1px solid #282838; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; font-size: 0.85rem;">
        <strong>Included Formats:</strong> Adobe Animate (.fla), Moho (.mohoproj), After Effects (.aep), Vector SVG, High-Res PSD, 24-bit WAV.
      </div>
      <div style="display: flex; gap: 1rem;">
        <button class="btn btn-primary" style="flex: 1;" onclick="document.querySelector('.add-cart-btn[data-id=\\'${item.id}\\']').click(); document.getElementById('previewModal').classList.remove('open');">
          ${item.numericPrice === 0 ? 'Download Free ⚡' : 'Add to Cart 🛒'}
        </button>
      </div>
    `;

    previewModal.classList.add('open');
  }

  if (closeModalBtn && previewModal) {
    closeModalBtn.addEventListener('click', () => previewModal.classList.remove('open'));
    previewModal.addEventListener('click', (e) => {
      if (e.target === previewModal) previewModal.classList.remove('open');
    });
  }

  // 9. NEWSLETTER SIMULATION
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMsg = document.getElementById('newsletterMsg');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value) {
        newsletterMsg.textContent = `🎃 Spooky welcome gift sent to ${input.value}! Check your inbox.`;
        input.value = '';
        setTimeout(() => {
          newsletterMsg.textContent = '';
        }, 5000);
      }
    });
  }

});
