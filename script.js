// Countdown Timer
function updateCountdown() {
  const hoursElement = document.getElementById('hours');
  const minutesElement = document.getElementById('minutes');
  const secondsElement = document.getElementById('seconds');
  
  // Set the target date (24 hours from now)
  const now = new Date();
  const target = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  function update() {
    const now = new Date();
    const diff = target - now;
    
    if (diff <= 0) {
      hoursElement.textContent = '00';
      minutesElement.textContent = '00';
      secondsElement.textContent = '00';
      return;
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
  }
  
  update();
  setInterval(update, 1000);
}

// Price Calculation
function updatePrices() {
  const quantityButtons = document.querySelectorAll('.qty-btn');
  const productPriceElement = document.getElementById('product-price');
  const shippingPriceElement = document.getElementById('shipping-price');
  const totalPriceElement = document.getElementById('total-price');
  
  const prices = {
    1: 35000,
    2: 68000,
    3: 99000
  };
  
  function updateDisplay(quantity) {
    const price = prices[quantity];
    const shipping = quantity > 1 ? 0 : 1500; // Free shipping for 2+ units
    
    productPriceElement.textContent = `₦${price.toLocaleString()}`;
    shippingPriceElement.textContent = shipping === 0 ? 'FREE' : `₦${shipping.toLocaleString()}`;
    totalPriceElement.textContent = `₦${(price + shipping).toLocaleString()}`;
    
    // Update CTA button text
    const ctaButtons = document.querySelectorAll('.cta-btn, .mobile-sticky-cta .sticky-price');
    ctaButtons.forEach(btn => {
      if (btn.classList.contains('sticky-price')) {
        btn.textContent = `₦${price.toLocaleString()}`;
      }
    });
  }
  
  quantityButtons.forEach(button => {
    button.addEventListener('click', () => {
      quantityButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const quantity = parseInt(button.dataset.qty);
      updateDisplay(quantity);
    });
  });
  
  // Initialize with default quantity
  updateDisplay(2);
}

// FAQ Accordion
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
}

// Form Submission
function initForm() {
  const form = document.getElementById('orderForm');
  const statusElement = document.createElement('div');
  statusElement.className = 'form-status';
  form.appendChild(statusElement);
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success message
    statusElement.innerHTML = `
      <div class="success-message">
        <i class="fas fa-check-circle"></i>
        <h3>Order Submitted Successfully!</h3>
        <p>We've received your order and will contact you within 1 hour via WhatsApp to confirm details and arrange delivery.</p>
        <p><strong>Order Reference:</strong> MG-${Date.now().toString().slice(-8)}</p>
      </div>
    `;
    
    // Reset form after 5 seconds
    setTimeout(() => {
      form.reset();
      statusElement.innerHTML = '';
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Scroll to success message
      statusElement.scrollIntoView({ behavior: 'smooth' });
    }, 5000);
  });
}

// Scroll to Order Function
function scrollToOrder() {
  const orderSection = document.getElementById('orderFormSection');
  orderSection.scrollIntoView({ behavior: 'smooth' });
}

// Intersection Observer for animations
function initAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, observerOptions);
  
  // Observe elements to animate
  const elementsToAnimate = document.querySelectorAll('.feature-card, .testimonial-card, .faq-item, .gallery-item');
  elementsToAnimate.forEach(el => observer.observe(el));
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  updatePrices();
  initFAQ();
  initForm();
  initAnimations();
  
  // Add scroll-based header effect
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 100) {
      header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
  });
});
