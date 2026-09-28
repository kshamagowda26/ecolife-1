// EcoLife - Shared Client Interactivity

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initStickyHeader();
  initActiveLinks();
  initWasteSorter();
  initRecyclingFilter();
  initSolarCalculator();
  initHabitTracker();
  initGalleryLightbox();
  initContactForm();
});

// 1. Mobile Navigation & Drawer
function initNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!isExpanded));
      mobileMenu.classList.toggle('hidden');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    }

    // Close when clicking an anchor in mobile menu
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// 2. Sticky Header blur & elevation on scroll
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('nav-scrolled');
      header.classList.remove('bg-white/80');
    } else {
      header.classList.remove('nav-scrolled');
      header.classList.add('bg-white/80');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// 3. Highlight current active nav item
function initActiveLinks() {
  const path = window.location.pathname.replace(/\/$/, '');
  const currentPage = path.split('/').pop() || 'index.html';

  const navLinks = document.querySelectorAll('[data-nav-link]');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const targetPage = href.split('/').pop() || 'index.html';

    if (
      (currentPage === '' && targetPage === 'index.html') ||
      (currentPage === 'index.html' && targetPage === 'index.html') ||
      (currentPage === targetPage)
    ) {
      link.classList.add('text-emerald-700', 'font-semibold');
      link.classList.remove('text-neutral-600');
      link.setAttribute('aria-current', 'page');
    }
  });
}

// 4. Waste Management - Interactive Segregation Checker
function initWasteSorter() {
  const wasteInput = document.getElementById('waste-item-input');
  const wasteBtn = document.getElementById('waste-check-btn');
  const wasteResult = document.getElementById('waste-result-box');
  if (!wasteInput || !wasteBtn || !wasteResult) return;

  const wasteDb = [
    { keywords: ['apple', 'banana', 'food', 'vegetable', 'peel', 'leaves', 'tea', 'coffee', 'eggshell', 'bread'], stream: 'Wet Waste (Compostable)', bin: 'Green Bin', desc: 'Biodegradable organic matter. Decomposes naturally into nutrient-rich compost within 45–60 days.' },
    { keywords: ['paper', 'cardboard', 'plastic', 'bottle', 'can', 'tin', 'glass', 'box', 'magazine', 'carton'], stream: 'Dry Waste (Recyclable)', bin: 'Blue Bin', desc: 'Non-biodegradable, clean materials that can be remanufactured into secondary consumer products.' },
    { keywords: ['phone', 'laptop', 'cable', 'battery', 'charger', 'circuit', 'bulb', 'led', 'earphone', 'wire'], stream: 'E-Waste (Specialized Collection)', bin: 'Grey/Red Bin or E-Drop', desc: 'Contains heavy metals (lithium, lead, mercury) and valuable rare earths. Requires certified e-waste recyclers.' },
    { keywords: ['medicine', 'paint', 'chemical', 'bleach', 'pesticide', 'needle', 'syringe', 'oil', 'thermometer'], stream: 'Hazardous Waste (Safe Disposal)', bin: 'Yellow/Hazard Bin', desc: 'Toxic or bio-hazardous items. Never mix with household streams; bring to municipal hazardous collection drives.' }
  ];

  const checkItem = () => {
    const query = wasteInput.value.trim().toLowerCase();
    if (!query) {
      wasteResult.innerHTML = '<p class="text-amber-800 text-sm">Please type an item name (e.g., "banana peel", "plastic bottle", "laptop cable").</p>';
      wasteResult.classList.remove('hidden');
      return;
    }

    let match = null;
    for (const item of wasteDb) {
      if (item.keywords.some(k => query.includes(k))) {
        match = item;
        break;
      }
    }

    if (match) {
      wasteResult.className = 'mt-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 text-slate-800 transition-all';
      wasteResult.innerHTML = `
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">✓</div>
          <div>
            <p class="font-semibold text-emerald-950 text-base">Destination: <span class="text-emerald-700">${match.stream}</span></p>
            <p class="text-xs font-semibold text-emerald-800 mt-0.5">Recommended Container: ${match.bin}</p>
            <p class="text-sm text-slate-600 mt-1">${match.desc}</p>
          </div>
        </div>
      `;
    } else {
      wasteResult.className = 'mt-4 p-4 rounded-xl border border-blue-200 bg-blue-50/70 text-slate-800 transition-all';
      wasteResult.innerHTML = `
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">ℹ</div>
          <div>
            <p class="font-semibold text-blue-950 text-base">General Rule for "${query}":</p>
            <p class="text-sm text-slate-600 mt-1">If it is organic food or garden material, place in <strong>Wet Waste (Green)</strong>. If clean and dry (clean packaging, metal, glass), place in <strong>Dry Recyclables (Blue)</strong>. Electronics and batteries must go to designated E-Waste points.</p>
          </div>
        </div>
      `;
    }
    wasteResult.classList.remove('hidden');
  };

  wasteBtn.addEventListener('click', checkItem);
  wasteInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkItem();
  });
}

// 5. Recycling Page Material Filter
function initRecyclingFilter() {
  const filterBtns = document.querySelectorAll('[data-material-filter]');
  const materialCards = document.querySelectorAll('[data-material-item]');
  if (!filterBtns.length || !materialCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-material-filter');

      // Update button active states
      filterBtns.forEach(b => {
        b.classList.remove('bg-emerald-700', 'text-white');
        b.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      });
      btn.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      btn.classList.add('bg-emerald-700', 'text-white');

      // Filter cards
      materialCards.forEach(card => {
        const itemCat = card.getAttribute('data-material-category');
        if (category === 'all' || itemCat === category) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// 6. Renewable Energy - Solar & Carbon Offset Estimator
function initSolarCalculator() {
  const billInput = document.getElementById('calc-monthly-bill');
  const roofInput = document.getElementById('calc-roof-area');
  const calculateBtn = document.getElementById('calc-submit-btn');
  const resultsCard = document.getElementById('calc-results');

  if (!billInput || !calculateBtn || !resultsCard) return;

  calculateBtn.addEventListener('click', () => {
    const monthlyBill = parseFloat(billInput.value) || 120;
    const roofSqft = parseFloat(roofInput ? roofInput.value : 400) || 400;

    // Approximations: Average $0.16/kWh
    const estimatedMonthlyKwh = monthlyBill / 0.16;
    const recommendedSystemKw = Math.min(Math.round((estimatedMonthlyKwh / 130) * 10) / 10, roofSqft / 65);
    const annualCo2SavedKg = Math.round(recommendedSystemKw * 1400 * 0.385);
    const annualMoneySaved = Math.round(monthlyBill * 12 * 0.75);
    const treesEquivalent = Math.round(annualCo2SavedKg / 22);

    document.getElementById('res-system-size').textContent = `${recommendedSystemKw} kW`;
    document.getElementById('res-money-saved').textContent = `$${annualMoneySaved.toLocaleString()} / year`;
    document.getElementById('res-carbon-saved').textContent = `${annualCo2SavedKg.toLocaleString()} kg CO₂`;
    document.getElementById('res-trees-saved').textContent = `${treesEquivalent} mature trees`;

    resultsCard.classList.remove('hidden');
  });
}

// 7. Green Tips - Interactive Habit Tracker
function initHabitTracker() {
  const checkboxes = document.querySelectorAll('.habit-checkbox');
  const progressText = document.getElementById('habit-progress-text');
  const progressBar = document.getElementById('habit-progress-bar');
  const habitScore = document.getElementById('habit-score-badge');

  if (!checkboxes.length || !progressBar) return;

  const updateProgress = () => {
    const total = checkboxes.length;
    let completed = 0;
    checkboxes.forEach(cb => {
      if (cb.checked) completed++;
    });

    const percent = Math.round((completed / total) * 100);
    progressBar.style.width = `${percent}%`;
    if (progressText) {
      progressText.textContent = `${completed} of ${total} Eco-Habits Active (${percent}%)`;
    }
    if (habitScore) {
      if (percent === 100) {
        habitScore.textContent = 'Planet Guardian (Master)';
      } else if (percent >= 60) {
        habitScore.textContent = 'Eco Champion';
      } else if (percent >= 30) {
        habitScore.textContent = 'Conscious Explorer';
      } else {
        habitScore.textContent = 'Getting Started';
      }
    }
  };

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateProgress);
  });
  updateProgress();
}

// 8. Gallery - Filter & Fullscreen Lightbox
function initGalleryLightbox() {
  const filterBtns = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('[data-gallery-item]');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  // Filter functionality
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-gallery-filter');

        filterBtns.forEach(b => {
          b.classList.remove('bg-emerald-700', 'text-white');
          b.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
        });
        btn.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');
        btn.classList.add('bg-emerald-700', 'text-white');

        galleryItems.forEach(item => {
          const cat = item.getAttribute('data-category');
          if (category === 'all' || cat === category) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // Lightbox functionality
  if (lightbox && lightboxImg && lightboxCaption) {
    let currentIdx = 0;
    const visibleCards = () => Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));

    const openLightbox = (index) => {
      const cards = visibleCards();
      if (!cards[index]) return;
      currentIdx = index;
      const img = cards[index].querySelector('img');
      const title = cards[index].querySelector('[data-caption-title]')?.textContent || '';
      const desc = cards[index].querySelector('[data-caption-desc]')?.textContent || '';

      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Gallery photo';
      }
      lightboxCaption.innerHTML = `<span class="font-semibold text-white">${title}</span> — <span class="text-emerald-200 text-sm">${desc}</span>`;
      lightbox.classList.remove('hidden');
      document.body.classList.add('lightbox-open');
    };

    const closeLightbox = () => {
      lightbox.classList.add('hidden');
      document.body.classList.remove('lightbox-open');
    };

    galleryItems.forEach((card) => {
      card.addEventListener('click', () => {
        const cards = visibleCards();
        const idx = cards.indexOf(card);
        if (idx !== -1) openLightbox(idx);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        const cards = visibleCards();
        currentIdx = (currentIdx - 1 + cards.length) % cards.length;
        openLightbox(currentIdx);
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        const cards = visibleCards();
        currentIdx = (currentIdx + 1) % cards.length;
        openLightbox(currentIdx);
      });
    }

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('hidden')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
      if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
    });
  }
}

// 9. Contact Form Simulation & Live Validation
function initContactForm() {
  const form = document.getElementById('eco-contact-form');
  const successModal = document.getElementById('contact-success-modal');
  const modalClose = document.getElementById('contact-modal-close');
  const charCounter = document.getElementById('msg-char-counter');
  const msgInput = document.getElementById('contact-message');

  if (msgInput && charCounter) {
    msgInput.addEventListener('input', () => {
      charCounter.textContent = `${msgInput.value.length}/500`;
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const subject = document.getElementById('contact-subject')?.value.trim();
      const message = document.getElementById('contact-message')?.value.trim();

      if (!name || !email || !subject || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      if (successModal) {
        const senderNameEl = document.getElementById('modal-sender-name');
        if (senderNameEl) senderNameEl.textContent = name;
        successModal.classList.remove('hidden');
      }
      form.reset();
      if (charCounter) charCounter.textContent = '0/500';
    });
  }

  if (modalClose && successModal) {
    modalClose.addEventListener('click', () => {
      successModal.classList.add('hidden');
    });
  }
}
