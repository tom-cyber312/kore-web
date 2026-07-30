/* ========================================
   KØRE — App JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // INTRO SCREEN
  // ========================================
  const intro = document.getElementById('intro');
  const introBtn = document.getElementById('introBtn');
  const introVideo = document.getElementById('introVideo');

  // Prevent scroll during intro
  document.body.style.overflow = 'hidden';

  // Start the playing class to trigger animations
  requestAnimationFrame(() => {
    intro.classList.add('playing');
  });

  introBtn.addEventListener('click', () => {
    intro.classList.add('hidden');
    document.body.style.overflow = 'auto';
    document.body.style.overflowX = 'hidden';
    if (introVideo) {
      introVideo.pause();
    }
    window.scrollTo(0, 0);
    setTimeout(() => {
      intro.remove();
    }, 900);
  });

  // ========================================
  // DROPS OVERLAY
  // ========================================
  const dropsSection = document.getElementById('drops');
  const dropsClose = document.getElementById('dropsClose');
  const dropsCartBtn = document.getElementById('dropsCartBtn');
  const dropsCartCount = document.getElementById('dropsCartCount');

  dropsClose.addEventListener('click', () => {
    dropsSection.classList.remove('visible');
    document.body.style.overflow = '';
    closeProductModal();
  });

  dropsCartBtn.addEventListener('click', () => {
    openCart();
  });

  function syncDropsCartCount() {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    dropsCartCount.textContent = total;
    if (total > 0) {
      dropsCartCount.classList.add('visible');
    } else {
      dropsCartCount.classList.remove('visible');
    }
  }

  // ========================================
  // HEADER SCROLL EFFECT
  // ========================================
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // ========================================
  // MOBILE NAV
  // ========================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const mobileNavLinks = mobileNav.querySelectorAll('a');

  function openMobileNav() {
    hamburgerBtn.classList.add('active');
    mobileNav.querySelector('.mobile-nav__panel').classList.add('active');
    mobileNavOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    hamburgerBtn.classList.remove('active');
    mobileNav.querySelector('.mobile-nav__panel').classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', openMobileNav);
  mobileNavOverlay.addEventListener('click', closeMobileNav);
  mobileNavClose.addEventListener('click', closeMobileNav);
  mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileNav));

  // ========================================
  // SCROLL REVEAL ANIMATIONS
  // ========================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ========================================
  // ACTIVE NAV LINK ON SCROLL
  // ========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(section => navObserver.observe(section));

  // ========================================
  // PRODUCT FILTERS
  // ========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  const subfiltersContainer = document.getElementById('subfilters');
  let currentFilter = 'all';
  let currentSubfilter = null;

  const subcategories = {
    remeras: ['jordan', 'nike', 'corteiz', 'supreme', 'adidas', 'lacoste', 'calvin-klein', 'bape'],
    pantalones: ['chrome-heart', 'hellstar', 'trapstar', 'nocta', 'corteiz'],
    camperas: ['chrome-heart', 'hellstar', 'trapstar', 'nocta', 'corteiz', 'jordan', 'nike', 'adidas']
  };

  const subcategoryLabels = {
    'jordan': 'Jordan',
    'nike': 'Nike',
    'corteiz': 'Corteiz',
    'supreme': 'Supreme',
    'adidas': 'Adidas',
    'lacoste': 'Lacoste',
    'calvin-klein': 'Calvin Klein',
    'bape': 'Bape',
    'chrome-heart': 'Chrome Heart',
    'hellstar': 'Hellstar',
    'trapstar': 'Trapstar',
    'nocta': 'Nocta'
  };

  function buildSubfilters(category) {
    subfiltersContainer.innerHTML = '';
    if (!subcategories[category]) return;

    const allBtn = document.createElement('button');
    allBtn.className = 'subfilter-btn active';
    allBtn.dataset.subfilter = 'all';
    allBtn.textContent = 'Todo';
    subfiltersContainer.appendChild(allBtn);

    subcategories[category].forEach(sub => {
      const btn = document.createElement('button');
      btn.className = 'subfilter-btn';
      btn.dataset.subfilter = sub;
      btn.textContent = subcategoryLabels[sub] || sub;
      subfiltersContainer.appendChild(btn);
    });

    subfiltersContainer.querySelectorAll('.subfilter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        subfiltersContainer.querySelectorAll('.subfilter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSubfilter = btn.dataset.subfilter === 'all' ? null : btn.dataset.subfilter;
        applyFilters();
      });
    });
  }

  function applyFilters() {
    productCards.forEach(card => {
      const matchCategory = currentFilter === 'all' || card.dataset.brand === currentFilter;
      const matchSubcategory = !currentSubfilter || card.dataset.subcategory === currentSubfilter;

      if (matchCategory && matchSubcategory) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        });
      } else {
        card.classList.add('hidden');
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      currentSubfilter = null;
      buildSubfilters(currentFilter);
      applyFilters();
    });
  });

  // ========================================
  // COUNTER ANIMATION (Social Proof)
  // ========================================
  const metricNumbers = document.querySelectorAll('.metric__number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const start = performance.now();

        function updateCounter(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          el.textContent = current.toLocaleString('es-AR');

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target.toLocaleString('es-AR');
          }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  metricNumbers.forEach(el => counterObserver.observe(el));

  // ========================================
  // CART FUNCTIONALITY
  // ========================================
  let cart = [];
  const cartBtn = document.getElementById('cartBtn');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotal = document.getElementById('cartTotal');
  const cartCount = document.getElementById('cartCount');
  const clearCartBtn = document.getElementById('clearCart');
  const continueBtn = document.getElementById('continueBtn');
  const checkoutForm = document.getElementById('checkoutForm');
  const paymentOptions = document.getElementById('paymentOptions');
  const transferInfo = document.getElementById('transferInfo');
  const payCashBtn = document.getElementById('payCash');
  const payTransferBtn = document.getElementById('payTransfer');
  const sendWhatsAppBtn = document.getElementById('sendWhatsApp');
  const shippingForm = document.getElementById('shippingForm');
  const shippingMethod = document.getElementById('shippingMethod');
  const shippingCompany = document.getElementById('shippingCompany');
  const empresaField = document.getElementById('empresaField');
  const direccionField = document.getElementById('direccionField');
  let shippingData = {};

  // Back buttons
  const checkoutBack = document.getElementById('checkoutBack');
  const paymentBack = document.getElementById('paymentBack');
  const transferBack = document.getElementById('transferBack');

  // Finish order
  const finishOrder = document.getElementById('finishOrder');
  const finishSummary = document.getElementById('finishSummary');
  const finishOrderBtn = document.getElementById('finishOrderBtn');
  const finishBack = document.getElementById('finishBack');
  const transferSummaryEl = document.getElementById('transferSummary');
  let currentPaymentMethod = '';

  function getShippingCost() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (totalQty <= 3) return 6500;
    if (totalQty <= 6) return 10000;
    return 13000;
  }

  function getShippingLabel() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (totalQty <= 3) return '$6.500 (aprox)';
    if (totalQty <= 6) return '$10.000 (aprox)';
    return '$13.000 (aprox)';
  }

  // Coupon
  const couponToggle = document.getElementById('couponToggle');
  const couponForm = document.getElementById('couponForm');
  const couponInput = document.getElementById('couponInput');
  const couponApply = document.getElementById('couponApply');
  const couponMessage = document.getElementById('couponMessage');
  let appliedCoupon = null;
  const validCoupons = {
    'KORE10': { type: 'percent', value: 10 },
    'KORE20': { type: 'percent', value: 20 },
    'DESCUENTO': { type: 'fixed', value: 1000 }
  };

  function openCart(resetSteps = true) {
    cartSidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (resetSteps) {
      checkoutForm.style.display = 'none';
      paymentOptions.style.display = 'none';
      transferInfo.style.display = 'none';
      finishOrder.style.display = 'none';
      cartItemsContainer.style.display = '';
      if (cart.length > 0) cartFooter.style.display = 'flex';
    }
  }

  function closeCart() {
    cartSidebar.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateCartUI() {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="cart-sidebar__empty">Tu carrito está vacío</p>';
      cartFooter.style.display = 'none';
      cartCount.classList.remove('visible');
      appliedCoupon = null;
      if (couponToggle) couponToggle.style.display = '';
      if (couponForm) couponForm.style.display = 'none';
      if (couponMessage) couponMessage.style.display = 'none';
    } else {
      cartFooter.style.display = 'flex';
      cartCount.classList.add('visible');
      cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
      syncDropsCartCount();

      let html = '';
      cart.forEach((item, index) => {
        const brandShort = item.name.substring(0, 3).toUpperCase();
        html += `
          <div class="cart-item">
            <div class="cart-item__image"><span>${brandShort}</span></div>
            <div class="cart-item__info">
              <div class="cart-item__name">${item.name}</div>
              <div class="cart-item__detail">${item.talle} / ${item.color}${item.espalda ? ' / Espalda: ' + item.espalda : ''}</div>
              <div class="cart-item__price">$${(item.price * item.qty).toLocaleString('es-AR')}</div>
            </div>
            <div class="cart-item__qty">
              <button class="cart-item__qty-btn cart-qty-minus" data-index="${index}" aria-label="Restar">−</button>
              <span class="cart-item__qty-value">${item.qty}</span>
              <button class="cart-item__qty-btn cart-qty-plus" data-index="${index}" aria-label="Sumar">+</button>
            </div>
            <button class="cart-item__remove" data-index="${index}" aria-label="Eliminar">&times;</button>
          </div>
        `;
      });
      cartItemsContainer.innerHTML = html;

      cartItemsContainer.querySelectorAll('.cart-item__remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index);
          cart.splice(idx, 1);
          updateCartUI();
        });
      });

      cartItemsContainer.querySelectorAll('.cart-qty-minus').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index);
          if (cart[idx].qty > 1) {
            cart[idx].qty--;
          } else {
            cart.splice(idx, 1);
          }
          updateCartUI();
        });
      });

      cartItemsContainer.querySelectorAll('.cart-qty-plus').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index);
          cart[idx].qty++;
          updateCartUI();
        });
      });

      updateCartTotals();

      checkoutForm.style.display = 'none';
      paymentOptions.style.display = 'none';
      transferInfo.style.display = 'none';
      finishOrder.style.display = 'none';
      cartItemsContainer.style.display = '';
      cartFooter.style.display = 'flex';
    }
  }

  function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percent') {
        discount = Math.round(subtotal * appliedCoupon.value / 100);
      } else {
        discount = Math.min(appliedCoupon.value, subtotal);
      }
    }
    const total = subtotal - discount;
    cartTotal.textContent = '$' + total.toLocaleString('es-AR');
    if (transferSummaryEl) transferSummaryEl.innerHTML = buildOrderSummary();
  }

  function buildWhatsAppMessage(shippingData, paymentMethod) {
    let msg = 'Hola! Quiero hacer un pedido desde KØRE:\n\n';
    cart.forEach(item => {
      msg += '- ' + item.name + ' (Talle: ' + item.talle + ', Color: ' + item.color + (item.espalda ? ', Espalda: ' + item.espalda : '') + ') x' + item.qty + ' — $' + (item.price * item.qty).toLocaleString('es-AR') + '\n';
    });
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percent') {
        discount = Math.round(subtotal * appliedCoupon.value / 100);
      } else {
        discount = Math.min(appliedCoupon.value, subtotal);
      }
    }
    const isRetiro = shippingData.metodoValue === 'retiro';
    const isViacargo = shippingData.empresa && shippingData.empresa.toLowerCase().includes('cargo');
    const shippingCost = isRetiro ? 0 : (isViacargo ? 0 : getShippingCost());
    const total = subtotal - discount + shippingCost;
    msg += '\nSubtotal: $' + subtotal.toLocaleString('es-AR');
    if (discount > 0) {
      msg += '\nDescuento (' + appliedCoupon.code + '): -$' + discount.toLocaleString('es-AR');
    }
    if (!isRetiro) {
      const shippingLabel = isViacargo ? 'Se paga al recibir' : getShippingLabel();
      msg += '\nEnvío: ' + shippingLabel;
      msg += '\n(El envío varía dependiendo de qué tipo de prendas lleves)';
    }
    msg += '\nTotal: $' + total.toLocaleString('es-AR');
    msg += '\n\n--- Datos de envío ---';
    msg += '\nMétodo: ' + shippingData.metodo;
    if (shippingData.metodo !== 'Retiro en persona') {
      msg += '\nEmpresa: ' + shippingData.empresa;
    }
    msg += '\nNombre: ' + shippingData.nombre;
    if (shippingData.metodo !== 'Retiro en persona') {
      msg += '\nDirección: ' + shippingData.direccion;
    }
    msg += '\nLocalidad: ' + shippingData.localidad;
    msg += '\nProvincia: ' + shippingData.provincia;
    msg += '\nCódigo Postal: ' + shippingData.cp;
    msg += '\nTeléfono: ' + shippingData.telefono;
    msg += '\nGmail: ' + shippingData.email;
    msg += '\n\n--- Pago ---';
    msg += '\nMétodo: ' + paymentMethod;
    if (paymentMethod === 'Transferencia') {
      msg += '\nAlias: kore.arg';
      msg += '\nA nombre de: Tomas Martin Rodriguez';
      msg += '\nEmpresa: Mercado Pago';
      msg += '\nPaso comprobante por WhatsApp';
    }
    return msg;
  }

  continueBtn.addEventListener('click', () => {
    cartFooter.style.display = 'none';
    cartItemsContainer.style.display = 'none';
    checkoutForm.style.display = 'block';
  });

  shippingMethod.addEventListener('change', () => {
    if (shippingMethod.value === 'retiro') {
      empresaField.style.display = 'none';
      direccionField.style.display = 'none';
      shippingCompany.removeAttribute('required');
    } else {
      empresaField.style.display = 'block';
      direccionField.style.display = 'block';
      shippingCompany.setAttribute('required', 'true');
    }
  });

  shippingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    shippingData = {
      metodo: shippingMethod.options[shippingMethod.selectedIndex].text,
      metodoValue: shippingMethod.value,
      empresa: shippingCompany.value ? shippingCompany.options[shippingCompany.selectedIndex].text : '',
      nombre: document.getElementById('clientName').value,
      direccion: document.getElementById('clientAddress').value,
      localidad: document.getElementById('clientCity').value,
      provincia: document.getElementById('clientProvince').value,
      cp: document.getElementById('clientZip').value,
      telefono: document.getElementById('clientPhone').value,
      email: document.getElementById('clientEmail').value
    };
    checkoutForm.style.display = 'none';
    paymentOptions.style.display = 'block';
    updateCartTotals();
    updatePaymentOptions();
  });

  payCashBtn.addEventListener('click', () => {
    if (payCashBtn.classList.contains('disabled')) return;
    showFinishOrder('Efectivo');
  });

  function updatePaymentOptions() {
    const empresa = shippingData.empresa ? shippingData.empresa.toLowerCase() : '';
    const isRetiro = shippingData.metodoValue === 'retiro';
    const isCorreoOCargo = empresa.includes('correo') || empresa.includes('cargo');
    const cashHint = document.getElementById('cashHint');
    if (isRetiro || !isCorreoOCargo) {
      payCashBtn.classList.remove('disabled');
      payCashBtn.removeAttribute('disabled');
      if (cashHint) cashHint.style.display = 'none';
    } else {
      payCashBtn.classList.add('disabled');
      payCashBtn.setAttribute('disabled', 'true');
      if (cashHint) cashHint.style.display = 'flex';
    }
  }

  payTransferBtn.addEventListener('click', () => {
    paymentOptions.style.display = 'none';
    transferSummaryEl.innerHTML = buildOrderSummary();
    transferInfo.style.display = 'block';
  });

  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      const msg = buildWhatsAppMessage(shippingData, 'Transferencia');
      const encoded = encodeURIComponent(msg);
      openWhatsApp('https://wa.me/5493496653146?text=' + encoded);
    });
  }

  function addToCart(name, price, talle, color, qty = 1, openAfter = true, espalda = '') {
    const key = `${name}-${talle}-${color}-${espalda}`;
    const existing = cart.find(item => `${item.name}-${item.talle}-${item.color}-${(item.espalda||'')}` === key);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ name, price, talle, color, qty: qty, espalda: espalda });
    }
    updateCartUI();
    if (openAfter) {
      openCart();
    } else {
      showAddedToast();
    }
  }

  function showAddedToast() {
    let toast = document.getElementById('cartToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cartToast';
      toast.className = 'cart-toast';
      toast.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Agregado al carrito';
      document.body.appendChild(toast);
    }
    toast.classList.add('visible');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2000);
  }

  function openWhatsApp(url) {
    try {
      var w = window.open(url, '_blank');
      if (!w || w.closed || typeof w.closed === 'undefined') {
        window.location.href = url;
      }
    } catch (e) {
      window.location.href = url;
    }
  }

  cartBtn.addEventListener('click', () => {
    openCart();
  });
  cartOverlay.addEventListener('click', closeCart);
  cartClose.addEventListener('click', closeCart);

  clearCartBtn.addEventListener('click', () => {
    cart = [];
    checkoutForm.style.display = 'none';
    paymentOptions.style.display = 'none';
    transferInfo.style.display = 'none';
    finishOrder.style.display = 'none';
    cartItemsContainer.style.display = '';
    updateCartUI();
  });

  // Back button handlers
  checkoutBack.addEventListener('click', () => {
    checkoutForm.style.display = 'none';
    cartItemsContainer.style.display = '';
    cartFooter.style.display = 'flex';
  });

  paymentBack.addEventListener('click', () => {
    paymentOptions.style.display = 'none';
    checkoutForm.style.display = 'block';
  });

  transferBack.addEventListener('click', () => {
    transferInfo.style.display = 'none';
    paymentOptions.style.display = 'block';
  });

  finishBack.addEventListener('click', () => {
    finishOrder.style.display = 'none';
    if (currentPaymentMethod === 'Transferencia') {
      transferInfo.style.display = 'block';
    } else {
      paymentOptions.style.display = 'block';
    }
  });

  // Finish order
  function buildOrderSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percent') {
        discount = Math.round(subtotal * appliedCoupon.value / 100);
      } else {
        discount = Math.min(appliedCoupon.value, subtotal);
      }
    }
    const afterDiscount = subtotal - discount;
    const isRetiro = shippingData.metodoValue === 'retiro';
    const isViacargo = shippingData.empresa && shippingData.empresa.toLowerCase().includes('cargo');
    const shippingCost = isRetiro ? 0 : (isViacargo ? 0 : getShippingCost());
    const total = afterDiscount + shippingCost;

    let html = '<div class="finish__items">';
    cart.forEach(item => {
      html += '<div class="finish__item"><span>' + item.name + ' (' + item.talle + '/' + item.color + ') x' + item.qty + '</span><span>$' + (item.price * item.qty).toLocaleString('es-AR') + '</span></div>';
    });
    html += '</div>';
    html += '<div class="finish__line finish__subtotal"><span>Subtotal</span><span>$' + subtotal.toLocaleString('es-AR') + '</span></div>';
    if (discount > 0) {
      html += '<div class="finish__line finish__discount"><span>Descuento (' + appliedCoupon.code + ')</span><span>-$' + discount.toLocaleString('es-AR') + '</span></div>';
    }
    if (isRetiro) {
      html += '<div class="finish__line finish__shipping"><span>Envío</span><span style="color:#4caf50;">Gratis</span></div>';
    } else {
      const shippingLabel = isViacargo ? 'Se paga al recibir' : getShippingLabel();
      html += '<div class="finish__line finish__shipping"><span>Envío</span><span>' + shippingLabel + '</span></div>';
      if (!isViacargo) {
        html += '<div class="finish__line finish__shipping-note"><span class="shipping-note">El envío varía dependiendo de qué tipo de prendas lleves</span></div>';
      }
    }
    html += '<div class="finish__line finish__total"><span>Total</span><span>$' + total.toLocaleString('es-AR') + '</span></div>';
    return html;
  }

  function showFinishOrder(paymentMethod) {
    paymentOptions.style.display = 'none';
    transferInfo.style.display = 'none';
    currentPaymentMethod = paymentMethod;

    finishSummary.innerHTML = buildOrderSummary() +
      '<div class="finish__line finish__payment"><span>Método de pago</span><span>' + paymentMethod + '</span></div>';
    finishOrder.style.display = 'block';
  }

  finishOrderBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    const msg = buildWhatsAppMessage(shippingData, currentPaymentMethod);
    const encoded = encodeURIComponent(msg);
    openWhatsApp('https://wa.me/5493496653146?text=' + encoded);
  });

  // Coupon logic
  couponToggle.addEventListener('click', () => {
    const isOpen = couponForm.style.display !== 'none';
    couponForm.style.display = isOpen ? 'none' : 'flex';
  });

  couponApply.addEventListener('click', () => {
    const code = couponInput.value.trim().toUpperCase();
    if (!code) return;
    if (validCoupons[code]) {
      appliedCoupon = { type: validCoupons[code].type, value: validCoupons[code].value, code: code };
      couponMessage.textContent = 'Cupón "' + code + '" aplicado correctamente';
      couponMessage.style.display = 'block';
      couponMessage.style.color = '#4caf50';
      couponForm.style.display = 'none';
      couponToggle.style.display = 'none';
      couponInput.value = '';
      updateCartTotals();
    } else {
      couponMessage.textContent = 'Cupón no válido';
      couponMessage.style.display = 'block';
      couponMessage.style.color = '#f44336';
    }
  });

  couponInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      couponApply.click();
    }
  });

  // ========================================
  // PRODUCT MODAL
  // ========================================
  const productModal = document.getElementById('productModal');
  const productModalOverlay = document.getElementById('productModalOverlay');
  const productModalClose = document.getElementById('productModalClose');
  const modalBrandWatermark = document.getElementById('modalBrandWatermark');
  const modalBrand = document.getElementById('modalBrand');
  const modalName = document.getElementById('modalName');
  const modalPrice = document.getElementById('modalPrice');
  const addToCartModalBtn = document.querySelector('.add-to-cart-modal-btn');

  const productData = {
    'corteiz-chico': { brand: 'Corteiz', name: 'Corteiz Chico', price: 16900, watermark: 'CTZ', category: 'remeras', images: ['img/ctz-chi-1.jpg','img/ctz-chi-2.jpg','img/ctz-chi-3.jpg'] },
    'corteiz-manos': { brand: 'Corteiz', name: 'Corteiz Manos', price: 17600, watermark: 'CTZ', category: 'remeras', images: ['img/ctz-man-1.jpg','img/ctz-man-2.jpg','img/ctz-man-3.jpg','img/ctz-man-4.jpg'] },
    'corteiz-lata': { brand: 'Corteiz', name: 'Corteiz Lata', price: 17600, watermark: 'CTZ', category: 'remeras', images: ['img/ctz-lat-1.jpg','img/ctz-lat-2.jpg','img/ctz-lat-3.jpg','img/ctz-lat-4.jpg'] },
    'corteiz-puppet': { brand: 'Corteiz', name: 'Corteiz Puppet', price: 17600, watermark: 'CTZ', category: 'remeras', images: ['img/ctz-pup-1.jpg','img/ctz-pup-2.jpg','img/ctz-pup-3.jpg','img/ctz-pup-4.jpg'] },
    'corteiz-world': { brand: 'Corteiz', name: 'Corteiz Rules The World', price: 17600, watermark: 'CTZ', category: 'remeras', images: ['img/ctz-rul-1.jpg','img/ctz-rul-2.jpg','img/ctz-rul-3.jpg','img/ctz-rul-4.jpg'] },
    'corteiz-oval': { brand: 'Corteiz', name: 'Corteiz', price: 17600, watermark: 'CTZ', category: 'remeras', images: ['img/ctz-1.jpg','img/ctz-2.jpg','img/ctz-3.jpg'] },
    'jordan-saturno': { brand: 'Jordan', name: 'Jordan Saturno', price: 17800, watermark: 'JRD', category: 'remeras', images: ['img/jrd-saturno-1.jpg','img/jrd-saturno-2.jpg','img/jrd-saturno-3.jpg','img/jrd-saturno-4.jpg'] },
    'jordan-flight': { brand: 'Jordan', name: 'Jordan Flight', price: 17800, watermark: 'JRD', category: 'remeras', images: ['img/jrd-flight-1.jpg','img/jrd-flight-2.jpg','img/jrd-flight-3.jpg','img/jrd-flight-4.jpg'] },
    'jordan-air': { brand: 'Jordan', name: 'Air Jordan', price: 17700, watermark: 'JRD', category: 'remeras', images: ['img/jrd-air-1.jpg','img/jrd-air-2.jpg','img/jrd-air-3.jpg','img/jrd-air-4.jpg'] },
    'jordan-jumpman': { brand: 'Jordan', name: 'Jordan Jumpman', price: 17700, watermark: 'JRD', category: 'remeras', images: ['img/jrd-jumpman-1.jpg','img/jrd-jumpman-2.jpg','img/jrd-jumpman-3.jpg','img/jrd-jumpman-4.jpg'] },
    'jordan-glitch': { brand: 'Jordan', name: 'Jordan Glitch', price: 17100, watermark: 'JRD', category: 'remeras', images: ['img/jrd-glitch-1.jpg','img/jrd-glitch-2.jpg','img/jrd-glitch-3.jpg','img/jrd-glitch-4.jpg'] },
    'jordan': { brand: 'Jordan', name: 'Jordan', price: 17000, watermark: 'JRD', category: 'remeras', images: ['img/jrd-1.jpg','img/jrd-2.jpg','img/jrd-3.jpg','img/jrd-4.jpg'] },
    'jordan-ray': { brand: 'Jordan', name: 'Jordan Ray', price: 17600, watermark: 'JRD', category: 'remeras', images: ['img/jrd-ray-1.jpg','img/jrd-ray-2.jpg','img/jrd-ray-3.jpg','img/jrd-ray-4.jpg'] },
    'jordan-m': { brand: 'Jordan', name: 'Jordan M', price: 17000, watermark: 'JRD', category: 'remeras', images: ['img/jrd-m-1.jpg','img/jrd-m-2.jpg','img/jrd-m-3.jpg','img/jrd-m-4.jpg'] },
    'jordan-shoes': { brand: 'Jordan', name: 'Jordan Shoes', price: 17600, watermark: 'JRD', category: 'remeras', images: ['img/jrd-shoes-1.jpg','img/jrd-shoes-2.jpg','img/jrd-shoes-3.jpg','img/jrd-shoes-4.jpg'] },
    'jordan-paint': { brand: 'Jordan', name: 'Jordan Paint', price: 17300, watermark: 'JRD', category: 'remeras', images: ['img/jrd-paint-1.jpg','img/jrd-paint-2.jpg','img/jrd-paint-3.jpg','img/jrd-paint-4.jpg'] },
    'jordan-wings': { brand: 'Jordan', name: 'Jordan Wings', price: 17600, watermark: 'JRD', category: 'remeras', images: ['img/jrd-wings-1.jpg','img/jrd-wings-2.jpg','img/jrd-wings-3.jpg','img/jrd-wings-4.jpg'] },
    'jordan-jamming': { brand: 'Jordan', name: 'Jordan Jamming', price: 17600, watermark: 'JRD', category: 'remeras', images: ['img/jrd-jamming-1.jpg','img/jrd-jamming-2.jpg','img/jrd-jamming-3.jpg','img/jrd-jamming-4.jpg'] },
    'jordan-mars': { brand: 'Jordan', name: 'Jordan Mars', price: 17400, watermark: 'JRD', category: 'remeras', images: ['img/jrd-mars-1.jpg','img/jrd-mars-2.jpg','img/jrd-mars-3.jpg','img/jrd-mars-4.jpg'] },
    'jordan-cena': { brand: 'Jordan', name: 'Jordan Ultima Cena', price: 17400, watermark: 'JRD', category: 'remeras', images: ['img/jrd-cena-1.jpg','img/jrd-cena-2.jpg','img/jrd-cena-3.jpg','img/jrd-cena-4.jpg'] },
    'ck-vrtc': { brand: 'Calvin Klein', name: 'Calvin Klein', price: 17500, watermark: 'CK', category: 'remeras', images: ['img/ck1.jpg','img/ck1-2.jpg','img/ck1-3.jpg','img/ck1-4.jpg'] },
    'ck-classic': { brand: 'Calvin Klein', name: 'Calvin Klein Clasic', price: 17500, watermark: 'CK', category: 'remeras', images: ['img/ck2.jpg','img/ck2-2.jpg','img/ck2-3.jpg','img/ck2-4.jpg'] },
    'nike-stussy': { brand: 'Nike x Stüssy', name: 'Nike x Stüssy', price: 17000, watermark: 'NK', category: 'remeras', images: ['img/nk-stussy-1.jpg','img/nk-stussy-2.jpg','img/nk-stussy-3.jpg','img/nk-stussy-4.jpg'] },
    'nike-mosaico': { brand: 'Nike', name: 'Nike Mosaico', price: 17000, watermark: 'NK', category: 'remeras', images: ['img/nk-mos-1.jpg','img/nk-mos-2.jpg','img/nk-mos-3.jpg','img/nk-mos-4.jpg'] },
    'nike-glitch': { brand: 'Nike', name: 'Nike Glitch', price: 17000, watermark: 'NK', category: 'remeras', images: ['img/nk-glitch-1.jpg','img/nk-glitch-2.jpg','img/nk-glitch-3.jpg','img/nk-glitch-4.jpg'] },
    'nike-red': { brand: 'Nike', name: 'Nike Red', price: 17000, watermark: 'NK', category: 'remeras', images: ['img/nk-red-1.jpg','img/nk-red-2.jpg','img/nk-red-3.jpg','img/nk-red-4.jpg'] },
    'lacoste': { brand: 'Lacoste', name: 'Lacoste', price: 17100, watermark: 'LAC', category: 'remeras', images: ['img/lac-1.jpg','img/lac-2.jpg','img/lac-3.jpg','img/lac-4.jpg'] },
    'lacoste-minimal': { brand: 'Lacoste', name: 'Lacoste Minimal', price: 17100, watermark: 'LAC', category: 'remeras', images: ['img/lac-min-1.jpg','img/lac-min-2.jpg','img/lac-min-3.jpg'] },
    'lacoste-since': { brand: 'Lacoste', name: 'Lacoste Since 1727', price: 17700, watermark: 'LAC', category: 'remeras', images: ['img/lac-since-1.jpg','img/lac-since-2.jpg','img/lac-since-3.jpg'] },
    'supreme-dolar': { brand: 'Supreme', name: 'Supreme Dolar', price: 17700, watermark: 'SUP', category: 'remeras', images: ['img/sup-dol-1.jpg','img/sup-dol-2.jpg','img/sup-dol-3.jpg','img/sup-dol-4.jpg'] },
    'supreme-camufrado': { brand: 'Supreme', name: 'Supreme Camufrado', price: 17700, watermark: 'SUP', category: 'remeras', images: ['img/sup-cam-1.jpg','img/sup-cam-2.jpg','img/sup-cam-3.jpg','img/sup-cam-4.jpg'] },
    'supreme-corona': { brand: 'Supreme', name: 'Supreme Corona', price: 17700, watermark: 'SUP', category: 'remeras', images: ['img/sup-cor-1.jpg','img/sup-cor-2.jpg','img/sup-cor-3.jpg','img/sup-cor-4.jpg'] },
    'adidas-retro': { brand: 'Adidas', name: 'Adidas Retro', price: 16900, watermark: 'ADI', category: 'remeras', images: ['img/adi-ret-1.jpg','img/adi-ret-2.jpg','img/adi-ret-3.jpg','img/adi-ret-4.jpg'] },
    'adidas-clasic': { brand: 'Adidas', name: 'Adidas Clasic', price: 16900, watermark: 'ADI', category: 'remeras', images: ['img/adi-cla-1.jpg','img/adi-cla-2.jpg','img/adi-cla-3.jpg','img/adi-cla-4.jpg'] },
    'bape-shark': { brand: 'Bape', name: 'Bape Shark', price: 17400, watermark: 'BPE', category: 'remeras', images: ['img/bap-shk-1.jpg','img/bap-shk-2.jpg','img/bap-shk-3.jpg'] },
    'bape-bathing': { brand: 'Bape', name: 'A Bathing Ape', price: 17400, watermark: 'BPE', category: 'remeras', images: ['img/bap-bath-1.jpg','img/bap-bath-2.jpg','img/bap-bath-3.jpg','img/bap-bath-4.jpg'] },
    'corteiz-chico-pant': { brand: 'Corteiz', name: 'Corteiz Chico', price: 34500, watermark: 'CTZ', category: 'pantalones', images: ['img/ctz-pant-chi-1.jpg','img/ctz-pant-chi-2.jpg','img/ctz-pant-chi-3.jpg','img/ctz-pant-chi-4.jpg','img/ctz-pant-chi-5.jpg','img/ctz-pant-chi-6.jpg','img/ctz-pant-chi-7.jpg','img/ctz-pant-chi-8.jpg'], hasDiseno: true, disenos: [{ name: 'Negro', bg: '#1a1a1a', border: 'none' }, { name: 'Celeste', bg: '#64b5f6', border: 'none' }] },
    'corteiz-pant': { brand: 'Corteiz', name: 'Corteiz', price: 35250, watermark: 'CTZ', category: 'pantalones', images: ['img/ctz-pant-1.jpg','img/ctz-pant-2.jpg','img/ctz-pant-3.jpg','img/ctz-pant-4.jpg'] },
    'corteiz-crtz-pant': { brand: 'Corteiz', name: 'Corteiz CRTZ', price: 35000, watermark: 'CTZ', category: 'pantalones', images: ['img/ctz-pant-crtz-1.jpg','img/ctz-pant-crtz-2.jpg','img/ctz-pant-crtz-3.jpg','img/ctz-pant-crtz-4.jpg'] },
    'nocta-pant': { brand: 'Nocta', name: 'Nocta', price: 34700, watermark: 'NCT', category: 'pantalones', images: ['img/nct-pant-1.jpg','img/nct-pant-2.jpg','img/nct-pant-3.jpg','img/nct-pant-4.jpg'] },
    'nocta-nike-pant': { brand: 'Nocta', name: 'Nocta x Nike', price: 34700, watermark: 'NCT', category: 'pantalones', images: ['img/nct-nike-1.jpg','img/nct-nike-2.jpg','img/nct-nike-3.jpg','img/nct-nike-4.jpg'] },
    'hellstar-large-pant': { brand: 'Hellstar', name: 'Hellstar large', price: 35100, watermark: 'HLS', category: 'pantalones', images: ['img/hst-large-1.jpg','img/hst-large-2.jpg','img/hst-large-3.jpg','img/hst-large-4.jpg','img/hst-large-5.jpg','img/hst-large-6.jpg','img/hst-large-7.jpg','img/hst-large-8.jpg'], hasDiseno: true, disenos: [{ name: 'Negro', bg: '#1a1a1a', border: 'none' }, { name: 'Blanco', bg: '#ffffff', border: '#ccc' }] },
    'hellstar-logo-pant': { brand: 'Hellstar', name: 'Hellstar logo', price: 35500, watermark: 'HLS', category: 'pantalones', images: ['img/hst-logo-1.jpg','img/hst-logo-2.jpg','img/hst-logo-3.jpg','img/hst-logo-4.jpg','img/hst-logo-5.jpg','img/hst-logo-6.jpg','img/hst-logo-7.jpg','img/hst-logo-8.jpg'], hasDiseno: true, disenos: [{ name: 'Negro', bg: '#1a1a1a', border: 'none' }, { name: 'Blanco', bg: '#ffffff', border: '#ccc' }] },
    'hellstar-chico-pant': { brand: 'Hellstar', name: 'Hellstar chico', price: 34300, watermark: 'HLS', category: 'pantalones', images: ['img/hst-chico-1.jpg','img/hst-chico-2.jpg','img/hst-chico-3.jpg','img/hst-chico-4.jpg','img/hst-chico-5.jpg','img/hst-chico-6.jpg','img/hst-chico-7.jpg','img/hst-chico-8.jpg'], hasDiseno: true, disenos: [{ name: 'Negro', bg: '#1a1a1a', border: 'none' }, { name: 'Blanco', bg: '#ffffff', border: '#ccc' }] },
    'trapstar-large-pant': { brand: 'Trapstar', name: 'Trapstar large', price: 35300, watermark: 'TSP', category: 'pantalones', images: ['img/tst-large-1.jpg','img/tst-large-2.jpg','img/tst-large-3.jpg','img/tst-large-4.jpg','img/tst-large-5.jpg','img/tst-large-6.jpg','img/tst-large-7.jpg','img/tst-large-8.jpg','img/tst-large-9.jpg','img/tst-large-10.jpg','img/tst-large-11.jpg','img/tst-large-12.jpg'], hasDiseno: true, disenos: [{ name: 'Negro', bg: '#1a1a1a', border: 'none' }, { name: 'Blanco', bg: '#ffffff', border: '#ccc' }, { name: 'Rojo', bg: '#d32f2f', border: 'none' }] },
    'trapstar-chico-pant': { brand: 'Trapstar', name: 'Trapstar chico', price: 34700, watermark: 'TSP', category: 'pantalones', images: ['img/tst-chico-1.jpg','img/tst-chico-2.jpg','img/tst-chico-3.jpg','img/tst-chico-4.jpg'] },
    'chrome-pant': { brand: 'Chrome Heart', name: 'Chrome Heart', price: 34500, watermark: 'CH', category: 'pantalones', images: ['img/chr-pant-1.jpg','img/chr-pant-2.jpg','img/chr-pant-3.jpg','img/chr-pant-4.jpg'] },
    'corteiz-chico-jkt': { brand: 'Corteiz', name: 'Corteiz chico', price: 34700, watermark: 'CTZ', category: 'camperas', images: ['img/ctz-jkt-chi-1.jpg','img/ctz-jkt-chi-2.jpg','img/ctz-jkt-chi-3.jpg','img/ctz-jkt-chi-4.jpg','img/ctz-jkt-chi-5.jpg','img/ctz-jkt-chi-6.jpg','img/ctz-jkt-chi-7.jpg'], hasDiseno: true, disenos: [{ name: 'Celeste', bg: '#64b5f6', border: 'none' }, { name: 'Negro', bg: '#1a1a1a', border: 'none' }] },
    'corteiz-jkt': { brand: 'Corteiz', name: 'Corteiz', price: 35400, watermark: 'CTZ', category: 'camperas', images: ['img/ctz-jkt-1.jpg','img/ctz-jkt-2.jpg','img/ctz-jkt-3.jpg','img/ctz-jkt-4.jpg'] },
    'corteiz-oval-jkt': { brand: 'Corteiz', name: 'Corteiz oval', price: 35400, watermark: 'CTZ', category: 'camperas', images: ['img/ctz-oval-1.jpg','img/ctz-oval-2.jpg','img/ctz-oval-3.jpg','img/ctz-oval-4.jpg'] },
    'corteiz-crtz-jkt': { brand: 'Corteiz', name: 'Corteiz CRTZ', price: 35100, watermark: 'CTZ', category: 'camperas', images: ['img/ctz-crtz-jkt-1.jpg','img/ctz-crtz-jkt-2.jpg','img/ctz-crtz-jkt-3.jpg','img/ctz-crtz-jkt-4.jpg'] },
    'trapstar-large-jkt': { brand: 'Trapstar', name: 'Trapstar large', price: 35400, watermark: 'TSP', category: 'camperas', images: ['img/tst-jkt-large-1.jpg','img/tst-jkt-large-2.jpg','img/tst-jkt-large-3.jpg','img/tst-jkt-large-4.jpg','img/tst-jkt-large-5.jpg','img/tst-jkt-large-6.jpg','img/tst-jkt-large-7.jpg','img/tst-jkt-large-8.jpg','img/tst-jkt-large-9.jpg','img/tst-jkt-large-10.jpg'], hasDiseno: true, disenos: [{ name: 'Negro', bg: '#1a1a1a', border: 'none' }, { name: 'Blanco', bg: '#ffffff', border: '#ccc' }, { name: 'Rojo', bg: '#d32f2f', border: 'none' }] },
    'trapstar-chico-jkt': { brand: 'Trapstar', name: 'Trapstar chico', price: 35000, watermark: 'TSP', category: 'camperas', images: ['img/tst-jkt-chico-1.jpg','img/tst-jkt-chico-2.jpg','img/tst-jkt-chico-3.jpg'] },
    'hellstar-large-jkt': { brand: 'Hellstar', name: 'Hellstar large', price: 35200, watermark: 'HLS', category: 'camperas', images: ['img/hst-jkt-large-1.jpg','img/hst-jkt-large-2.jpg','img/hst-jkt-large-3.jpg','img/hst-jkt-large-4.jpg','img/hst-jkt-large-5.jpg','img/hst-jkt-large-6.jpg','img/hst-jkt-large-7.jpg','img/hst-jkt-large-8.jpg','img/hst-jkt-large-9.jpg','img/hst-jkt-large-10.jpg','img/hst-jkt-large-11.jpg','img/hst-jkt-large-12.jpg','img/hst-jkt-large-13.jpg','img/hst-jkt-large-14.jpg'], hasDiseno: true, disenos: [{ name: 'Negro', bg: '#1a1a1a', border: 'none' }, { name: 'Blanco', bg: '#ffffff', border: '#ccc' }], hasEspalda: true, espaldas: [{ name: 'Sin', add: 0 }, { name: 'Negro', add: 2000 }, { name: 'Cremita', add: 2000 }] },
    'hellstar-chico-jkt': { brand: 'Hellstar', name: 'Hellstar chico', price: 34600, watermark: 'HLS', category: 'camperas', images: ['img/hst-jkt-chico-1.jpg','img/hst-jkt-chico-2.jpg','img/hst-jkt-chico-3.jpg','img/hst-jkt-chico-4.jpg','img/hst-jkt-chico-5.jpg','img/hst-jkt-chico-6.jpg','img/hst-jkt-chico-7.jpg','img/hst-jkt-chico-8.jpg','img/hst-jkt-chico-9.jpg','img/hst-jkt-chico-10.jpg','img/hst-jkt-chico-11.jpg'], hasDiseno: true, disenos: [{ name: 'Negro', bg: '#1a1a1a', border: 'none' }, { name: 'Blanco', bg: '#ffffff', border: '#ccc' }], hasEspalda: true, espaldas: [{ name: 'Sin', add: 0 }, { name: 'Negro', add: 2000 }, { name: 'Cremita', add: 2000 }] },
    'hellstar-jkt': { brand: 'Hellstar', name: 'Hellstar', price: 35500, watermark: 'HLS', category: 'camperas', images: ['img/hst-jkt-1.jpg','img/hst-jkt-2.jpg','img/hst-jkt-3.jpg','img/hst-jkt-4.jpg','img/hst-jkt-5.jpg','img/hst-jkt-6.jpg','img/hst-jkt-7.jpg','img/hst-jkt-8.jpg'], hasEspalda: true, espaldas: [{ name: 'Sin', add: 0 }, { name: 'Negro', add: 2000 }, { name: 'Cremita', add: 2000 }] },
    'nocta-jkt': { brand: 'Nocta', name: 'Nocta', price: 35150, watermark: 'NCT', category: 'camperas', images: ['img/nct-jkt-1.jpg','img/nct-jkt-2.jpg','img/nct-jkt-3.jpg'] },
    'nocta-nike-jkt': { brand: 'Nocta', name: 'Nocta x Nike', price: 34950, watermark: 'NCT', category: 'camperas', images: ['img/nct-nike-jkt-1.jpg','img/nct-nike-jkt-2.jpg','img/nct-nike-jkt-3.jpg'] }
  };

  const colorSets = {
    remeras: [
      { name: 'Negro', bg: '#1a1a1a', border: 'none' },
      { name: 'Blanco', bg: '#f5f5f5', border: '1px solid #333' },
      { name: 'Rojo', bg: '#e53935', border: 'none' },
      { name: 'Azul', bg: '#1e88e5', border: 'none' }
    ],
    pantalones: [
      { name: 'Negro', bg: '#1a1a1a', border: 'none' },
      { name: 'Blanco', bg: '#f5f5f5', border: '1px solid #333' },
      { name: 'Gris', bg: '#888', border: 'none' },
      { name: 'Rosa Bebé', bg: '#f8bbd0', border: 'none' }
    ],
    camperas: [
      { name: 'Negro', bg: '#1a1a1a', border: 'none' },
      { name: 'Blanco', bg: '#f5f5f5', border: '1px solid #333' },
      { name: 'Gris', bg: '#888', border: 'none' },
      { name: 'Rosa Bebé', bg: '#f8bbd0', border: 'none' }
    ]
  };

  const colorSelectorContainer = document.querySelector('.color-selector');

  let currentModalProduct = null;
  let modalQty = 1;
  const modalQtyValue = document.getElementById('modalQtyValue');
  const modalQtyMinus = document.querySelector('#modalQtySelector .qty-minus');
  const modalQtyPlus = document.querySelector('#modalQtySelector .qty-plus');

  document.querySelectorAll('.product-card__quick-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const productId = btn.dataset.product;
      const data = productData[productId];
      if (!data) return;

      currentModalProduct = data;
      modalBrandWatermark.textContent = data.watermark;
      modalBrand.textContent = data.brand;
      modalName.textContent = data.name;
      modalPrice.textContent = '$' + data.price.toLocaleString('es-AR');

      const modalImg = document.getElementById('modalCarouselImg');
      const modalDotsEl = document.getElementById('modalDots');
      const arrowL = document.getElementById('modalArrowLeft');
      const arrowR = document.getElementById('modalArrowRight');
      const placeholder = document.getElementById('modalPlaceholder');

      function applyImageStyles(pid, idx) {
        const d = productData[pid];
        modalImg.style.objectPosition = 'center';
        if (d && (d.category === 'pantalones' || d.brand === 'Hellstar')) {
          modalImg.style.objectFit = 'cover';
          modalImg.style.background = 'none';
        } else {
          modalImg.style.objectFit = 'contain';
          modalImg.style.background = '#1a1a1a';
        }
      }

      if (data.images && data.images.length > 0) {
        let modalIdx = 0;
        modalImg.src = data.images[0];
        modalImg.style.display = 'block';
        placeholder.style.display = 'none';
        arrowL.style.display = 'flex';
        arrowR.style.display = 'flex';
        modalDotsEl.innerHTML = '';
        applyImageStyles(productId, 0);
        data.images.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
          dot.addEventListener('click', () => {
            modalIdx = i;
            modalImg.src = data.images[i];
            modalDotsEl.querySelectorAll('.carousel__dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            applyImageStyles(productId, i);
          });
          modalDotsEl.appendChild(dot);
        });
        modalImg.onerror = function() {
          modalImg.style.display = 'none';
          placeholder.style.display = 'flex';
        };
        modalImg.onload = function() {
          modalImg.style.display = 'block';
          placeholder.style.display = 'none';
        };
        const updateModalImg = (idx) => {
          modalIdx = idx;
          modalImg.src = data.images[idx];
          modalImg.style.display = 'block';
          placeholder.style.display = 'none';
          modalDotsEl.querySelectorAll('.carousel__dot').forEach((d, i) => d.classList.toggle('active', i === idx));
          applyImageStyles(productId, idx);
        };
        arrowL.onclick = () => updateModalImg((modalIdx - 1 + data.images.length) % data.images.length);
        arrowR.onclick = () => updateModalImg((modalIdx + 1) % data.images.length);
      } else {
        modalImg.style.display = 'none';
        placeholder.style.display = 'flex';
        arrowL.style.display = 'none';
        arrowR.style.display = 'none';
        modalDotsEl.innerHTML = '';
      }

      renderSizeButtons(data.category);

      const colors = colorSets[data.category] || colorSets.remeras;
      colorSelectorContainer.innerHTML = '';
      colors.forEach((c, i) => {
        const cbtn = document.createElement('button');
        cbtn.className = 'color-btn' + (i === 0 ? ' active' : '');
        cbtn.dataset.color = c.name;
        cbtn.style.background = c.bg;
        if (c.border !== 'none') cbtn.style.border = c.border;
        cbtn.setAttribute('aria-label', c.name);
        colorSelectorContainer.appendChild(cbtn);
      });

      colorSelectorContainer.querySelectorAll('.color-btn').forEach(cbtn => {
        cbtn.addEventListener('click', () => {
          colorSelectorContainer.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
          cbtn.classList.add('active');
        });
      });

      const disenoSelector = document.getElementById('disenoSelector');
      const disenoContainer = document.querySelector('.diseno-selector');
      if (data.hasDiseno && disenoSelector && disenoContainer) {
        disenoSelector.style.display = 'block';
        disenoContainer.innerHTML = '';
        const disenos = data.disenos || [
          { name: 'Negro', bg: '#1a1a1a', border: 'none' },
          { name: 'Celeste', bg: '#64b5f6', border: 'none' }
        ];
        disenos.forEach((d, i) => {
          const dbtn = document.createElement('button');
          dbtn.className = 'diseno-btn' + (i === 0 ? ' active' : '');
          dbtn.dataset.diseno = d.name;
          dbtn.innerHTML = '<span class="diseno-btn__swatch" style="background:' + d.bg + '"></span>' + d.name;
          dbtn.setAttribute('aria-label', d.name);
          disenoContainer.appendChild(dbtn);
        });
        disenoContainer.querySelectorAll('.diseno-btn').forEach(dbtn => {
          dbtn.addEventListener('click', () => {
            disenoContainer.querySelectorAll('.diseno-btn').forEach(b => b.classList.remove('active'));
            dbtn.classList.add('active');
          });
        });
      } else if (disenoSelector) {
        disenoSelector.style.display = 'none';
      }

      const espaldaSelector = document.getElementById('espaldaSelector');
      const espaldaContainer = document.querySelector('.espalda-selector');
      if (data.hasEspalda && espaldaSelector && espaldaContainer) {
        espaldaSelector.style.display = 'block';
        espaldaContainer.innerHTML = '';
        const espaldas = data.espaldas || [{ name: 'Sin', add: 0 }];
        espaldas.forEach((e, i) => {
          const ebtn = document.createElement('button');
          ebtn.className = 'diseno-btn' + (i === 0 ? ' active' : '');
          ebtn.dataset.espalda = e.name;
          ebtn.dataset.add = e.add;
          ebtn.textContent = e.name;
          espaldaContainer.appendChild(ebtn);
        });
        espaldaContainer.querySelectorAll('.diseno-btn').forEach(ebtn => {
          ebtn.addEventListener('click', () => {
            espaldaContainer.querySelectorAll('.diseno-btn').forEach(b => b.classList.remove('active'));
            ebtn.classList.add('active');
            const notice = document.getElementById('espaldaNotice');
            if (notice) {
              notice.classList.toggle('visible', parseInt(ebtn.dataset.add || 0) > 0);
            }
          });
        });
      } else if (espaldaSelector) {
        espaldaSelector.style.display = 'none';
      }

      modalQty = 1;
      if (modalQtyValue) modalQtyValue.textContent = '1';

      productModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalQtyMinus) {
    modalQtyMinus.addEventListener('click', () => {
      if (modalQty > 1) {
        modalQty--;
        if (modalQtyValue) modalQtyValue.textContent = modalQty;
      }
    });
  }

  if (modalQtyPlus) {
    modalQtyPlus.addEventListener('click', () => {
      modalQty++;
      if (modalQtyValue) modalQtyValue.textContent = modalQty;
    });
  }

  function closeProductModal() {
    productModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  productModalOverlay.addEventListener('click', closeProductModal);
  productModalClose.addEventListener('click', closeProductModal);

  const sizeSets = {
    remeras: ['S', 'M', 'L', 'XL'],
    pantalones: ['2', '3', '4'],
    camperas: ['2', '3', '4']
  };
  const sizeSelector = document.querySelector('.size-selector');

  function renderSizeButtons(category) {
    const sizes = sizeSets[category] || sizeSets.remeras;
    sizeSelector.innerHTML = '';
    sizes.forEach((s, i) => {
      const btn = document.createElement('button');
      btn.className = 'size-btn' + (i === 0 ? ' active' : '');
      btn.dataset.size = s;
      btn.textContent = s;
      btn.addEventListener('click', () => {
        sizeSelector.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
      sizeSelector.appendChild(btn);
    });
  }

  addToCartModalBtn.addEventListener('click', () => {
    if (currentModalProduct) {
      const activeSize = document.querySelector('.size-btn.active');
      const activeColor = document.querySelector('.color-btn.active');
      const activeDiseno = document.querySelector('.diseno-btn.active');
      const activeEspalda = document.querySelector('.espalda-selector .diseno-btn.active');
      const defaultSizes = sizeSets[currentModalProduct.category] || sizeSets.remeras;
      const talle = activeSize ? activeSize.dataset.size : defaultSizes[0];
      let color = activeColor ? activeColor.dataset.color : 'Negro';
      if (activeDiseno) {
        color = color + ' / ' + activeDiseno.dataset.diseno;
      }
      let espalda = '';
      let price = currentModalProduct.price;
      if (activeEspalda) {
        espalda = activeEspalda.dataset.espalda;
        price = price + parseInt(activeEspalda.dataset.add || 0);
      }
      addToCart(currentModalProduct.name, price, talle, color, modalQty, false, espalda);
      modalQty = 1;
      if (modalQtyValue) modalQtyValue.textContent = '1';
    }
  });

  // ========================================
  // NEWSLETTER
  // ========================================
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input').value;
    const subject = encodeURIComponent('Nueva suscripción al newsletter KØRE');
    const body = encodeURIComponent(`Nuevo suscriptor al newsletter KØRE:\n\nEmail: ${email}`);
    window.location.href = `mailto:kore.argentina0@gmail.com?subject=${subject}&body=${body}`;
    newsletterForm.reset();
  });

  // ========================================
  // ESCAPE KEY HANDLER
  // ========================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropsSection.classList.remove('visible');
      document.body.style.overflow = '';
      closeProductModal();
      closeCart();
      closeMobileNav();
    }
  });

  // ========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        if (targetId === '#drops') {
          target.classList.add('visible');
          document.body.style.overflow = 'hidden';
          return;
        }
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) + parseInt(getComputedStyle(document.documentElement).getPropertyValue('--announcement-height')) + 4;
        setTimeout(() => {
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }, 0);
      }
    });
  });

});
