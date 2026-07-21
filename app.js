/* ========================================
   KØRE — App JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // CIRCULAR REVEAL
  // ========================================
  const revealContainer = document.getElementById('circularReveal');
  const revealAlt = revealContainer ? revealContainer.querySelector('.circular-reveal__img--alt') : null;

  if (revealContainer && revealAlt) {
    const RADIUS = 60;

    function setRevealCircle(x, y) {
      revealAlt.style.clipPath = `circle(${RADIUS}px at ${x}px ${y}px)`;
      revealContainer.classList.add('active');
    }

    function hideRevealCircle() {
      revealAlt.style.clipPath = 'circle(0px at -9999px -9999px)';
      revealContainer.classList.remove('active');
    }

    revealContainer.addEventListener('mousemove', (e) => {
      const rect = revealContainer.getBoundingClientRect();
      setRevealCircle(e.clientX - rect.left, e.clientY - rect.top);
    });

    revealContainer.addEventListener('mouseleave', hideRevealCircle);

    revealContainer.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = revealContainer.getBoundingClientRect();
      setRevealCircle(touch.clientX - rect.left, touch.clientY - rect.top);
    }, { passive: false });

    revealContainer.addEventListener('touchend', hideRevealCircle);
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
  const checkoutWhatsapp = document.getElementById('checkoutWhatsapp');
  const clearCartBtn = document.getElementById('clearCart');

  function openCart() {
    cartSidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
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
    } else {
      cartFooter.style.display = 'flex';
      cartCount.classList.add('visible');
      cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);

      let html = '';
      cart.forEach((item, index) => {
        const brandShort = item.name.substring(0, 3).toUpperCase();
        html += `
          <div class="cart-item">
            <div class="cart-item__image"><span>${brandShort}</span></div>
            <div class="cart-item__info">
              <div class="cart-item__name">${item.name}</div>
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

      let msg = 'Hola! Quiero hacer un pedido desde KØRE:\n\n';
      cart.forEach(item => {
        msg += `- ${item.name} x${item.qty} — $${(item.price * item.qty).toLocaleString('es-AR')}\n`;
      });
      msg += `\nTotal: $${total.toLocaleString('es-AR')}`;
      const encoded = encodeURIComponent(msg);
      checkoutWhatsapp.href = `https://wa.me/5493496653146?text=${encoded}`;
    }
  }

  function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    updateCartUI();
    openCart();
  }

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      addToCart(name, price);
    });
  });

  cartBtn.addEventListener('click', openCart);
  cartOverlay.addEventListener('click', closeCart);
  cartClose.addEventListener('click', closeCart);

  clearCartBtn.addEventListener('click', () => {
    cart = [];
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
  const modalWhatsapp = document.getElementById('modalWhatsapp');
  const addToCartModalBtn = document.querySelector('.add-to-cart-modal-btn');

  const productData = {
    'corteiz-puppet': { brand: 'Corteiz', name: 'Corteiz Puppet', price: 17500, watermark: 'CTZ' },
    'corteiz-lata': { brand: 'Corteiz', name: 'Corteiz Lata', price: 16800, watermark: 'CTZ' },
    'corteiz-oval': { brand: 'Corteiz', name: 'Corteiz Oval', price: 17200, watermark: 'CTZ' },
    'corteiz-world': { brand: 'Corteiz', name: 'Corteiz World', price: 18500, watermark: 'CTZ' },
    'air-jordan': { brand: 'Air Jordan', name: 'Air Jordan Tee', price: 15900, watermark: 'JRD' },
    'jordan-pink': { brand: 'Jordan', name: 'Jordan Pink', price: 16200, watermark: 'JRD' },
    'ck-vrtc': { brand: 'Calvin Klein', name: 'Calvin Klein Vrtc', price: 14900, watermark: 'CK' },
    'ck-classic': { brand: 'Calvin Klein', name: 'Calvin Klein Clásic', price: 14500, watermark: 'CK' },
    'nike-stussy': { brand: 'Nike x Stüssy', name: 'Nike x Stüssy Tee', price: 19800, watermark: 'NK' },
    'lacoste': { brand: 'Lacoste', name: 'Lacoste Classic', price: 15500, watermark: 'LAC' },
    'supreme': { brand: 'Supreme', name: 'Supreme Box Logo', price: 21000, watermark: 'SUP' },
    'adidas': { brand: 'Adidas', name: 'Adidas OG Tee', price: 14200, watermark: 'ADI' }
  };

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

      const encoded = encodeURIComponent(`Hola! Quiero consultar por ${data.name} — $${data.price.toLocaleString('es-AR')}`);
      modalWhatsapp.href = `https://wa.me/5493496653146?text=${encoded}`;

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

  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  addToCartModalBtn.addEventListener('click', () => {
    if (currentModalProduct) {
      addToCart(currentModalProduct.name, currentModalProduct.price);
      closeProductModal();
    }
  });

  // ========================================
  // FORM SUBMISSIONS
  // ========================================
  const wholesaleForm = document.getElementById('wholesaleForm');
  wholesaleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('ws-name').value;
    const email = document.getElementById('ws-email').value;
    const phone = document.getElementById('ws-phone').value;
    const business = document.getElementById('ws-business').value;
    const message = document.getElementById('ws-message').value;

    let text = `Hola! Soy ${name} y quiero ser mayorista KØRE.\n\n`;
    text += `Email: ${email}\n`;
    if (phone) text += `WhatsApp: ${phone}\n`;
    if (business) text += `Local/Marca: ${business}\n`;
    if (message) text += `Mensaje: ${message}\n`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/5493496653146?text=${encoded}`, '_blank');
    wholesaleForm.reset();
  });

  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input').value;
    alert(`Gracias por suscribirte! Te avisaremos de nuevos drops en ${email}`);
    newsletterForm.reset();
  });

  // ========================================
  // ESCAPE KEY HANDLER
  // ========================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
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
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) + parseInt(getComputedStyle(document.documentElement).getPropertyValue('--announcement-height')) + 4;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
