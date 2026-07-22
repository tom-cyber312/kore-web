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

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      productCards.forEach(card => {
        if (filter === 'all' || card.dataset.brand === filter) {
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
  const shippingForm = document.getElementById('shippingForm');
  const shippingMethod = document.getElementById('shippingMethod');
  const shippingCompany = document.getElementById('shippingCompany');
  const empresaField = document.getElementById('empresaField');
  const direccionField = document.getElementById('direccionField');

  function openCart() {
    cartSidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
    checkoutForm.style.display = 'none';
    cartItemsContainer.style.display = '';
    if (cart.length > 0) cartFooter.style.display = 'flex';
  }

  function closeCart() {
    cartSidebar.classList.remove('active');
    document.body.style.overflow = '';
    checkoutForm.style.display = 'none';
    cartItemsContainer.style.display = '';
    if (cart.length > 0) cartFooter.style.display = 'flex';
  }

  function updateCartUI() {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="cart-sidebar__empty">Tu carrito está vacío</p>';
      cartFooter.style.display = 'none';
      cartCount.classList.remove('visible');
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
              <div class="cart-item__price">$${(item.price * item.qty).toLocaleString('es-AR')} x${item.qty}</div>
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

      const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      cartTotal.textContent = '$' + total.toLocaleString('es-AR');

      checkoutForm.style.display = 'none';
      cartItemsContainer.style.display = '';
      cartFooter.style.display = 'flex';
    }
  }

  function buildWhatsAppMessage(shippingData) {
    let msg = 'Hola! Quiero hacer un pedido desde KØRE:\n\n';
    cart.forEach(item => {
      msg += `- ${item.name} (Talle: ${item.talle}, Color: ${item.color}) x${item.qty} — $${(item.price * item.qty).toLocaleString('es-AR')}\n`;
    });
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    msg += `\nTotal: $${total.toLocaleString('es-AR')}`;
    msg += `\n\n--- Datos de envío ---`;
    msg += `\nMétodo: ${shippingData.metodo}`;
    if (shippingData.metodo !== 'retiro') {
      msg += `\nEmpresa: ${shippingData.empresa}`;
    }
    msg += `\nNombre: ${shippingData.nombre}`;
    if (shippingData.metodo !== 'retiro') {
      msg += `\nDirección: ${shippingData.direccion}`;
    }
    msg += `\nLocalidad: ${shippingData.localidad}`;
    msg += `\nProvincia: ${shippingData.provincia}`;
    msg += `\nCódigo Postal: ${shippingData.cp}`;
    msg += `\nTeléfono: ${shippingData.telefono}`;
    msg += `\nGmail: ${shippingData.email}`;
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
    const data = {
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
    const msg = buildWhatsAppMessage(data);
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/5493496653146?text=${encoded}`, '_blank');
  });

  function addToCart(name, price, talle, color) {
    const key = `${name}-${talle}-${color}`;
    const existing = cart.find(item => `${item.name}-${item.talle}-${item.color}` === key);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price, talle, color, qty: 1 });
    }
    updateCartUI();
    openCart();
  }

  cartBtn.addEventListener('click', openCart);
  cartOverlay.addEventListener('click', closeCart);
  cartClose.addEventListener('click', closeCart);

  clearCartBtn.addEventListener('click', () => {
    cart = [];
    checkoutForm.style.display = 'none';
    cartItemsContainer.style.display = '';
    updateCartUI();
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
    'corteiz-cargo': { brand: 'Corteiz', name: 'Corteiz Cargo Pant', price: 28500, watermark: 'CTZ', category: 'pantalones' },
    'nike-tech': { brand: 'Nike', name: 'Nike Tech Fleece', price: 32000, watermark: 'NK', category: 'pantalones' },
    'adidas-track': { brand: 'Adidas', name: 'Adidas Track Pant', price: 24900, watermark: 'ADI', category: 'pantalones' },
    'nike-puffer': { brand: 'Nike', name: 'Nike Puffer Jacket', price: 55000, watermark: 'NK', category: 'camperas' },
    'corteiz-shell': { brand: 'Corteiz', name: 'Corteiz Shell Jacket', price: 48000, watermark: 'CTZ', category: 'camperas' },
    'supreme-tnf': { brand: 'Supreme x TNF', name: 'Supreme Nuptse Jacket', price: 72000, watermark: 'SUP', category: 'camperas' }
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

      productModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

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
      addToCart(currentModalProduct.name, currentModalProduct.price, talle, color);
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
