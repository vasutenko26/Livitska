// ═══════════════════════════════════════════════════════════════
// МПЗ WEBSITE - JAVASCRIPT FUNCTIONALITY
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initSmoothScroll();
  initHeaderBehavior();
});

// ───────────────────────────────────────────────────────────────
// CONTACT FORM HANDLING
// ───────────────────────────────────────────────────────────────

function initContactForm() {
  const form = document.getElementById('contactForm');
  
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const name = form.querySelector('input[type="text"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const subject = form.querySelectorAll('input[type="text"]')[1].value.trim();
    const message = form.querySelector('textarea').value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showNotification('Будь ласка, заповніть усі обов\'язкові поля', 'error');
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Будь ласка, введіть коректну електронну адресу', 'error');
      return;
    }

    // In a real application, you would send this data to a server
    // For now, we'll just show a success message
    const formData = {
      name,
      email,
      subject: subject || 'Без теми',
      message,
      timestamp: new Date().toISOString(),
    };

    // Simulate form submission
    console.log('Форма відправлена:', formData);
    
    // Show success message
    showNotification('✓ Дякуємо! Ваше повідомлення було отримано. Ми зв\'яжемось із вами найближчим часом.', 'success');

    // Reset form
    form.reset();

    // Focus back to form
    setTimeout(() => {
      form.querySelector('input[type="text"]').focus();
    }, 500);
  });
}

// ───────────────────────────────────────────────────────────────
// NOTIFICATION SYSTEM
// ───────────────────────────────────────────────────────────────

function showNotification(message, type = 'info') {
  const notif = document.createElement('div');
  notif.className = `notification notification-${type}`;
  notif.textContent = message;
  
  // Styling
  Object.assign(notif.style, {
    position: 'fixed',
    top: '100px',
    right: '20px',
    padding: '16px 24px',
    borderRadius: '6px',
    fontFamily: '"Montserrat", sans-serif',
    fontSize: '14px',
    fontWeight: '600',
    zIndex: '1000',
    animation: 'slideIn 0.3s ease-out',
    maxWidth: '400px',
    wordWrap: 'break-word',
  });

  // Color based on type
  if (type === 'success') {
    notif.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    notif.style.color = 'white';
    notif.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
  } else if (type === 'error') {
    notif.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
    notif.style.color = 'white';
    notif.style.boxShadow = '0 4px 12px rgba(244, 67, 54, 0.3)';
  } else {
    notif.style.background = 'linear-gradient(135deg, #2196F3, #0b7dda)';
    notif.style.color = 'white';
    notif.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.3)';
  }

  // Add animation keyframes
  if (!document.querySelector('style[data-notification]')) {
    const style = document.createElement('style');
    style.setAttribute('data-notification', 'true');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notif);

  // Remove notification after 4 seconds
  setTimeout(() => {
    notif.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notif.remove(), 300);
  }, 4000);
}

// ───────────────────────────────────────────────────────────────
// SMOOTH SCROLL (for navigation links)
// ───────────────────────────────────────────────────────────────

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

// ───────────────────────────────────────────────────────────────
// HEADER BEHAVIOR (hide/show on scroll)
// ───────────────────────────────────────────────────────────────

function initHeaderBehavior() {
  const header = document.querySelector('header');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Scroll down - hide header
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      header.style.transform = 'translateY(-100%)';
      header.style.transition = 'transform 0.3s ease-in';
    }
    // Scroll up - show header
    else {
      header.style.transform = 'translateY(0)';
      header.style.transition = 'transform 0.3s ease-out';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile Compatibility
  });
}

// ───────────────────────────────────────────────────────────────
// LAZY LOADING FOR IMAGES
// ───────────────────────────────────────────────────────────────

function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

// ───────────────────────────────────────────────────────────────
// SCROLL ANIMATIONS (fade-in on scroll)
// ───────────────────────────────────────────────────────────────

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add animation class to elements that need it
  document.querySelectorAll('.service-card, .team-card, .stat-card').forEach((el) => {
    observer.observe(el);
  });
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initLazyLoading();
    initScrollAnimations();
  });
} else {
  initLazyLoading();
  initScrollAnimations();
}
