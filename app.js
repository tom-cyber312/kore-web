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
    dropsSection.classList.remove('visible');
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
    camperas: ['chrome-heart', 'hellstar', 'trapstar', 'nocta', 'corteiz']
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
  const transferTotalEl = document.getElementById('transferTotal');
  let currentPaymentMethod = '';

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

  function openCart() {
    cartSidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
    checkoutForm.style.display = 'none';
    paymentOptions.style.display = 'none';
    transferInfo.style.display = 'none';
    finishOrder.style.display = 'none';
    cartItemsContainer.style.display = '';
    if (cart.length > 0) cartFooter.style.display = 'flex';
  }

  function closeCart() {
    cartSidebar.classList.remove('active');
    document.body.style.overflow = '';
    checkoutForm.style.display = 'none';
    paymentOptions.style.display = 'none';
    transferInfo.style.display = 'none';
    finishOrder.style.display = 'none';
    cartItemsContainer.style.display = '';
    if (cart.length > 0) cartFooter.style.display = 'flex';
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
              <div class="cart-item__detail">${item.talle} / ${item.color}</div>
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
    if (transferTotalEl) transferTotalEl.textContent = '$' + total.toLocaleString('es-AR');
  }

  function buildWhatsAppMessage(shippingData, paymentMethod) {
    let msg = 'Hola! Quiero hacer un pedido desde KØRE:\n\n';
    cart.forEach(item => {
      msg += '- ' + item.name + ' (Talle: ' + item.talle + ', Color: ' + item.color + ') x' + item.qty + ' — $' + (item.price * item.qty).toLocaleString('es-AR') + '\n';
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
    const total = subtotal - discount;
    msg += '\nSubtotal: $' + subtotal.toLocaleString('es-AR');
    if (discount > 0) {
      msg += '\nDescuento (' + appliedCoupon.code + '): -$' + discount.toLocaleString('es-AR');
    }
    msg += '\nTotal: $' + total.toLocaleString('es-AR');
    msg += '\n\n--- Datos de envío ---';
    msg += '\nMétodo: ' + shippingData.metodo;
    if (shippingData.metodo !== 'Retiro personal') {
      msg += '\nEmpresa: ' + shippingData.empresa;
    }
    msg += '\nNombre: ' + shippingData.nombre;
    if (shippingData.metodo !== 'Retiro personal') {
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
    } else {
      empresaField.style.display = 'block';
      direccionField.style.display = 'block';
    }
  });

  shippingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    shippingData = {
      metodo: shippingMethod.options[shippingMethod.selectedIndex].text,
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
  });

  payCashBtn.addEventListener('click', () => {
    showFinishOrder('Efectivo');
  });

  payTransferBtn.addEventListener('click', () => {
    paymentOptions.style.display = 'none';
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

  function addToCart(name, price, talle, color, qty = 1, openAfter = true) {
    const key = `${name}-${talle}-${color}`;
    const existing = cart.find(item => `${item.name}-${item.talle}-${item.color}` === key);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ name, price, talle, color, qty: qty });
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

  cartBtn.addEventListener('click', openCart);
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
  function showFinishOrder(paymentMethod) {
    paymentOptions.style.display = 'none';
    transferInfo.style.display = 'none';
    currentPaymentMethod = paymentMethod;

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

    let summaryHtml = '<div class="finish__items">';
    cart.forEach(item => {
      summaryHtml += '<div class="finish__item"><span>' + item.name + ' (' + item.talle + '/' + item.color + ') x' + item.qty + '</span><span>$' + (item.price * item.qty).toLocaleString('es-AR') + '</span></div>';
    });
    summaryHtml += '</div>';
    summaryHtml += '<div class="finish__line finish__subtotal"><span>Subtotal</span><span>$' + subtotal.toLocaleString('es-AR') + '</span></div>';
    if (discount > 0) {
      summaryHtml += '<div class="finish__line finish__discount"><span>Descuento (' + appliedCoupon.code + ')</span><span>-$' + discount.toLocaleString('es-AR') + '</span></div>';
    }
    summaryHtml += '<div class="finish__line finish__total"><span>Total</span><span>$' + total.toLocaleString('es-AR') + '</span></div>';
    summaryHtml += '<div class="finish__line finish__payment"><span>Método de pago</span><span>' + paymentMethod + '</span></div>';

    finishSummary.innerHTML = summaryHtml;
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
    'corteiz-puppet': { brand: 'Corteiz', name: 'Corteiz Puppet', price: 17500, watermark: 'CTZ', category: 'remeras' },
    'corteiz-lata': { brand: 'Corteiz', name: 'Corteiz Lata', price: 16800, watermark: 'CTZ', category: 'remeras' },
    'corteiz-oval': { brand: 'Corteiz', name: 'Corteiz Oval', price: 17200, watermark: 'CTZ', category: 'remeras' },
    'corteiz-world': { brand: 'Corteiz', name: 'Corteiz World', price: 18500, watermark: 'CTZ', category: 'remeras' },
    'air-jordan': { brand: 'Air Jordan', name: 'Air Jordan Tee', price: 15900, watermark: 'JRD', category: 'remeras' },
    'jordan-pink': { brand: 'Jordan', name: 'Jordan Pink', price: 16200, watermark: 'JRD', category: 'remeras' },
    'ck-vrtc': { brand: 'Calvin Klein', name: 'Calvin Klein Vrtc', price: 14900, watermark: 'CK', category: 'remeras' },
    'ck-classic': { brand: 'Calvin Klein', name: 'Calvin Klein Clásic', price: 14500, watermark: 'CK', category: 'remeras' },
    'nike-stussy': { brand: 'Nike x Stüssy', name: 'Nike x Stüssy Tee', price: 19800, watermark: 'NK', category: 'remeras' },
    'lacoste': { brand: 'Lacoste', name: 'Lacoste Classic', price: 15500, watermark: 'LAC', category: 'remeras' },
    'supreme': { brand: 'Supreme', name: 'Supreme Box Logo', price: 21000, watermark: 'SUP', category: 'remeras' },
    'adidas': { brand: 'Adidas', name: 'Adidas OG Tee', price: 14200, watermark: 'ADI', category: 'remeras' },
    'bape-shark': { brand: 'Bape', name: 'Bape Shark Tee', price: 18900, watermark: 'BPE', category: 'remeras' },
    'bape-camo': { brand: 'Bape', name: 'Bape Camo Tee', price: 19500, watermark: 'BPE', category: 'remeras' },
    'corteiz-cargo': { brand: 'Corteiz', name: 'Corteiz Cargo Pant', price: 28500, watermark: 'CTZ', category: 'pantalones' },
    'corteiz-track': { brand: 'Corteiz', name: 'Corteiz Track Pant', price: 26800, watermark: 'CTZ', category: 'pantalones' },
    'chrome-jeans': { brand: 'Chrome Heart', name: 'Chrome Heart Jeans', price: 35000, watermark: 'CH', category: 'pantalones' },
    'chrome-cargo': { brand: 'Chrome Heart', name: 'Chrome Heart Cargo', price: 38500, watermark: 'CH', category: 'pantalones' },
    'hellstar-sweat': { brand: 'Hellstar', name: 'Hellstar Sweatpant', price: 29900, watermark: 'HLS', category: 'pantalones' },
    'hellstar-track': { brand: 'Hellstar', name: 'Hellstar Track Pant', price: 31200, watermark: 'HLS', category: 'pantalones' },
    'trapstar-chaleco': { brand: 'Trapstar', name: 'Trapstar Chaleco Pant', price: 27500, watermark: 'TSP', category: 'pantalones' },
    'trapstar-ice': { brand: 'Trapstar', name: 'Trapstar Ice Pant', price: 30800, watermark: 'TSP', category: 'pantalones' },
    'nocta-track': { brand: 'Nocta', name: 'Nocta Track Pant', price: 33500, watermark: 'NCT', category: 'pantalones' },
    'nocta-fleece': { brand: 'Nocta', name: 'Nocta Fleece Pant', price: 35200, watermark: 'NCT', category: 'pantalones' },
    'corteiz-shell': { brand: 'Corteiz', name: 'Corteiz Shell Jacket', price: 48000, watermark: 'CTZ', category: 'camperas' },
    'corteiz-puffer': { brand: 'Corteiz', name: 'Corteiz Puffer', price: 52000, watermark: 'CTZ', category: 'camperas' },
    'chrome-denim': { brand: 'Chrome Heart', name: 'Chrome Heart Denim Jacket', price: 65000, watermark: 'CH', category: 'camperas' },
    'chrome-hoodie': { brand: 'Chrome Heart', name: 'Chrome Heart Hoodie Jacket', price: 58000, watermark: 'CH', category: 'camperas' },
    'hellstar-varsity': { brand: 'Hellstar', name: 'Hellstar Varsity Jacket', price: 55000, watermark: 'HLS', category: 'camperas' },
    'hellstar-puffer': { brand: 'Hellstar', name: 'Hellstar Puffer Jacket', price: 62000, watermark: 'HLS', category: 'camperas' },
    'trapstar-chaleco-jkt': { brand: 'Trapstar', name: 'Trapstar Chaleco Jacket', price: 45000, watermark: 'TSP', category: 'camperas' },
    'trapstar-ice-jkt': { brand: 'Trapstar', name: 'Trapstar Ice Jacket', price: 50000, watermark: 'TSP', category: 'camperas' },
    'nocta-puffer': { brand: 'Nocta', name: 'Nocta Puffer Jacket', price: 60000, watermark: 'NCT', category: 'camperas' },
    'nocta-track-jkt': { brand: 'Nocta', name: 'Nocta Track Jacket', price: 42000, watermark: 'NCT', category: 'camperas' }
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

  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  addToCartModalBtn.addEventListener('click', () => {
    if (currentModalProduct) {
      const activeSize = document.querySelector('.size-btn.active');
      const activeColor = document.querySelector('.color-btn.active');
      const talle = activeSize ? activeSize.dataset.size : 'M';
      const color = activeColor ? activeColor.dataset.color : 'Negro';
      addToCart(currentModalProduct.name, currentModalProduct.price, talle, color, modalQty, false);
      modalQty = 1;
      if (modalQtyValue) modalQtyValue.textContent = '1';
      closeProductModal();
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
