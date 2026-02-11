// ============================================
// TELEGRAM BOT CONFIGURATION
// ============================================
// REPLACE THESE WITH YOUR ACTUAL TELEGRAM BOT DETAILS
const TELEGRAM_BOT_TOKEN = '6256698104:AAE5QZORxw737Vgc__jArGtIpQ3JrJfyv44'; // Get from @BotFather
const TELEGRAM_CHAT_ID = '1217852633'; // Your personal/group chat ID

// ============================================
// COUNTDOWN TIMER
// ============================================
function updateCountdown() {
  const hoursElement = document.getElementById('hours');
  const minutesElement = document.getElementById('minutes');
  const secondsElement = document.getElementById('seconds');
  
  if (!hoursElement || !minutesElement || !secondsElement) return;
  
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

// ============================================
// PRICE CALCULATION & QUANTITY SELECTOR
// ============================================
function initQuantitySelector() {
  const quantityButtons = document.querySelectorAll('.qty-btn');
  const productPriceElement = document.getElementById('product-price');
  const shippingPriceElement = document.getElementById('shipping-price');
  const totalPriceElement = document.getElementById('total-price');
  
  // Update hero section prices
  const heroPriceElement = document.querySelector('.price-new');
  const oldPriceElement = document.querySelector('.old-price');
  const priceSaveElement = document.querySelector('.price-save');
  const ctaButton = document.querySelector('.cta-btn');
  const headerPrice = document.querySelector('.header-price');
  const stickyPrice = document.querySelector('.sticky-price');
  
  const prices = {
    1: { 
      product: 35000, 
      shipping: 1500, 
      total: 36500, 
      savings: 0,
      oldPrice: 45000,
      saveAmount: 10000,
      perUnit: 35000
    },
    2: { 
      product: 68000, 
      shipping: 0, 
      total: 68000, 
      savings: 2000,
      oldPrice: 90000,
      saveAmount: 22000,
      perUnit: 34000
    },
    3: { 
      product: 99000, 
      shipping: 0, 
      total: 99000, 
      savings: 6000,
      oldPrice: 135000,
      saveAmount: 36000,
      perUnit: 33000
    }
  };
  
  function updateDisplay(quantity) {
    const priceData = prices[quantity];
    
    // Update price displays in order summary
    if (productPriceElement) {
      productPriceElement.textContent = `₦${priceData.product.toLocaleString()}`;
    }
    
    if (shippingPriceElement) {
      shippingPriceElement.textContent = priceData.shipping === 0 ? 'FREE' : `₦${priceData.shipping.toLocaleString()}`;
    }
    
    if (totalPriceElement) {
      totalPriceElement.textContent = `₦${priceData.total.toLocaleString()}`;
    }
    
    // Update hero section prices
    if (heroPriceElement) {
      heroPriceElement.textContent = `₦${priceData.product.toLocaleString()}`;
    }
    
    if (oldPriceElement) {
      oldPriceElement.textContent = `₦${priceData.oldPrice.toLocaleString()}`;
    }
    
    if (priceSaveElement) {
      priceSaveElement.textContent = `You save ₦${priceData.saveAmount.toLocaleString()}`;
    }
    
    // Update CTA buttons
    if (ctaButton) {
      ctaButton.innerHTML = `<i class="fas fa-shopping-cart"></i> Order Now – ₦${priceData.product.toLocaleString()}`;
    }
    
    if (headerPrice) {
      headerPrice.textContent = `₦${priceData.product.toLocaleString()}`;
    }
    
    if (stickyPrice) {
      stickyPrice.textContent = `₦${priceData.product.toLocaleString()}`;
    }
  }
  
  // Add click handlers to quantity buttons
  if (quantityButtons.length > 0) {
    quantityButtons.forEach(button => {
      button.addEventListener('click', () => {
        quantityButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const quantity = parseInt(button.dataset.qty);
        updateDisplay(quantity);
      });
    });
  }
  
  // Initialize with default quantity (2)
  updateDisplay(2);
}

// ============================================
// TELEGRAM MESSAGE SENDER
// ============================================
async function sendOrderToTelegram(orderData) {
  const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  // Format the message with emojis and markdown
  const message = `
🔔 *NEW ORDER - MOSQUITO KILLER LAMP* 🔔
━━━━━━━━━━━━━━━━━━━━━

👤 *CUSTOMER DETAILS*
━━━━━━━━━━━━━━━━━━━━━
📛 *Name:* ${orderData.name}
📞 *Phone:* ${orderData.phone}
📧 *Email:* ${orderData.email || 'Not provided'}

📍 *DELIVERY INFORMATION*
━━━━━━━━━━━━━━━━━━━━━
🏙️ *State:* ${orderData.state}
📮 *Address:* ${orderData.address}
📝 *Instructions:* ${orderData.instructions || 'None'}

🛒 *ORDER DETAILS*
━━━━━━━━━━━━━━━━━━━━━
🔢 *Quantity:* ${orderData.quantity} ${orderData.quantity > 1 ? 'Lamps' : 'Lamp'}
💰 *Product Price:* ₦${orderData.productPrice.toLocaleString()}
🚚 *Shipping:* ${orderData.shipping === 0 ? 'FREE' : `₦${orderData.shipping.toLocaleString()}`}
💵 *Total Amount:* ₦${orderData.totalAmount.toLocaleString()}
🎯 *Savings:* ₦${orderData.savings.toLocaleString()}
${orderData.quantity === 3 ? '🏆 *BEST DEAL!*' : ''}

⏰ *ORDER TIMESTAMP*
━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* ${orderData.orderDate}
🕐 *Time:* ${orderData.orderTime}
🆔 *Order ID:* ${orderData.orderId}

━━━━━━━━━━━━━━━━━━━━━
✅ *Order received - Ready for processing*
  `;
  
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: 'Markdown',
    disable_web_page_preview: true
  };
  
  try {
    const response = await fetch(TELEGRAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.description || 'Failed to send to Telegram');
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Telegram Error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// GENERATE ORDER REFERENCE
// ============================================
function generateOrderId() {
  const prefix = 'MG';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

// ============================================
// FORM SUBMISSION HANDLER
// ============================================
function initForm() {
  const form = document.getElementById('orderForm');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get selected quantity from active button
    const activeQtyBtn = document.querySelector('.qty-btn.active');
    const quantity = activeQtyBtn ? parseInt(activeQtyBtn.dataset.qty) : 2;
    
    // Get price data based on quantity
    const prices = {
      1: { product: 35000, shipping: 1500, total: 36500, savings: 0 },
      2: { product: 68000, shipping: 0, total: 68000, savings: 2000 },
      3: { product: 99000, shipping: 0, total: 99000, savings: 6000 }
    };
    
    const priceData = prices[quantity];
    
    // Collect form data
    const formData = {
      name: document.getElementById('name')?.value.trim(),
      phone: document.getElementById('phone')?.value.trim(),
      email: document.getElementById('email')?.value.trim(),
      state: document.getElementById('state')?.value,
      address: document.getElementById('address')?.value.trim(),
      instructions: document.getElementById('instructions')?.value.trim(),
      quantity: quantity,
      productPrice: priceData.product,
      shipping: priceData.shipping,
      totalAmount: priceData.total,
      savings: priceData.savings,
      orderId: generateOrderId(),
      orderDate: new Date().toLocaleDateString('en-NG', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      }),
      orderTime: new Date().toLocaleTimeString('en-NG', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
    
    // Validate required fields
    if (!formData.name) {
      alert('Please enter your full name');
      document.getElementById('name').focus();
      return;
    }
    
    if (!formData.phone) {
      alert('Please enter your phone number');
      document.getElementById('phone').focus();
      return;
    }
    
    if (!formData.state) {
      alert('Please select your delivery state');
      document.getElementById('state').focus();
      return;
    }
    
    if (!formData.address) {
      alert('Please enter your delivery address');
      document.getElementById('address').focus();
      return;
    }
    
    // Check agreement checkbox
    const agreeCheckbox = document.getElementById('agree');
    if (!agreeCheckbox.checked) {
      alert('Please agree to receive order confirmation via WhatsApp');
      agreeCheckbox.focus();
      return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Order...';
    submitBtn.disabled = true;
    
    try {
      // Send to Telegram
      const result = await sendOrderToTelegram(formData);
      
      if (result.success) {
        // Store order data in localStorage for thank you page
        localStorage.setItem('lastOrder', JSON.stringify({
          orderId: formData.orderId,
          name: formData.name,
          phone: formData.phone,
          quantity: formData.quantity,
          totalAmount: formData.totalAmount,
          state: formData.state,
          orderDate: formData.orderDate
        }));
        
        // Store order history
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        orderHistory.push({
          ...formData,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        
        // Redirect to thank you page with order ID
        window.location.href = `thank-you.html?order=${formData.orderId}`;
      } else {
        throw new Error(result.error || 'Failed to send order');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      
      // Show error message
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Store failed order for retry
      localStorage.setItem('failedOrder', JSON.stringify(formData));
      
      // Show user-friendly error message
      alert('Sorry, there was an error submitting your order. Please try again or contact us on WhatsApp.');
      
      // Option to retry with stored data
      const retryButton = document.createElement('div');
      retryButton.className = 'retry-notification';
      retryButton.innerHTML = `
        <div style="position: fixed; bottom: 80px; left: 20px; right: 20px; background: white; padding: 15px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); z-index: 9999; border-left: 5px solid #ff4500;">
          <p style="margin-bottom: 10px;"><strong>⚠️ Order not sent</strong></p>
          <button onclick="retryFailedOrder()" style="background: #ff4500; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; width: 100%;">
            <i class="fas fa-refresh"></i> Retry Now
          </button>
        </div>
      `;
      document.body.appendChild(retryButton);
      
      setTimeout(() => {
        retryButton.remove();
      }, 10000);
    }
  });
}

// ============================================
// RETRY FAILED ORDER
// ============================================
function retryFailedOrder() {
  const failedOrder = localStorage.getItem('failedOrder');
  if (failedOrder) {
    const orderData = JSON.parse(failedOrder);
    // Resubmit order
    sendOrderToTelegram(orderData).then(result => {
      if (result.success) {
        localStorage.removeItem('failedOrder');
        alert('Order sent successfully! Redirecting...');
        window.location.href = `thank-you.html?order=${orderData.orderId}`;
      }
    });
  }
}

// ============================================
// FAQ ACCORDION
// ============================================
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item
        item.classList.toggle('active');
      });
    }
  });
}

// ============================================
// SCROLL TO ORDER
// ============================================
function scrollToOrder() {
  const orderSection = document.getElementById('orderFormSection');
  if (orderSection) {
    orderSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// ============================================
// STOCK COUNTER ANIMATION
// ============================================
function animateStockCounter() {
  const stockElement = document.querySelector('.stock-warning');
  if (stockElement) {
    let stock = 37;
    setInterval(() => {
      // Randomly decrease stock occasionally to show urgency
      if (Math.random() > 0.7) {
        stock = Math.max(12, stock - Math.floor(Math.random() * 3));
        stockElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Only ${stock} units left in stock!`;
      }
    }, 30000); // Update every 30 seconds
  }
}

// ============================================
// LAZY LOAD IMAGES
// ============================================
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// ============================================
// CHECK URL PARAMETERS FOR ORDER ID
// ============================================
function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('order');
  
  if (orderId && window.location.pathname.includes('thank-you.html')) {
    // Already on thank you page, load order details
    loadOrderDetails(orderId);
  }
}

// ============================================
// LOAD ORDER DETAILS ON THANK YOU PAGE
// ============================================
function loadOrderDetails(orderId) {
  const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
  const order = orderHistory.find(o => o.orderId === orderId);
  
  if (order) {
    // Update thank you page with order details
    const orderRefElement = document.getElementById('orderRef');
    const customerNameElement = document.getElementById('customerName');
    const customerPhoneElement = document.getElementById('customerPhone');
    const orderQuantityElement = document.getElementById('orderQuantity');
    const orderTotalElement = document.getElementById('orderTotal');
    const orderStateElement = document.getElementById('orderState');
    
    if (orderRefElement) orderRefElement.textContent = order.orderId;
    if (customerNameElement) customerNameElement.textContent = order.name;
    if (customerPhoneElement) customerPhoneElement.textContent = order.phone;
    if (orderQuantityElement) orderQuantityElement.textContent = `${order.quantity} ${order.quantity > 1 ? 'Lamps' : 'Lamp'}`;
    if (orderTotalElement) orderTotalElement.textContent = `₦${order.totalAmount.toLocaleString()}`;
    if (orderStateElement) orderStateElement.textContent = order.state;
    
    // Update WhatsApp link
    const whatsappLink = document.getElementById('whatsappLink');
    if (whatsappLink) {
      whatsappLink.href = `https://wa.me/2348000000000?text=Hello!%20I%20just%20placed%20an%20order%20for%20Mosquito%20Killer%20Lamp.%20Order%20ID:%20${order.orderId}`;
    }
  }
}

// ============================================
// ANIMATE ON SCROLL
// ============================================
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .gallery-item, .step');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ============================================
// INITIALIZE ALL FUNCTIONS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  initQuantitySelector();
  initFAQ();
  initForm();
  animateStockCounter();
  lazyLoadImages();
  checkUrlParams();
  initScrollAnimations();
  
  // Add scroll-based header effect
  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        header.style.transform = 'translateY(0)';
      } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
      }
    });
  }
  
  // Add smooth scrolling to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// ============================================
// EXPORT FUNCTIONS FOR GLOBAL USE
// ============================================
window.scrollToOrder = scrollToOrder;
window.retryFailedOrder = retryFailedOrder;
