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
  const hiddenQuantityInput = document.getElementById('selectedQuantity');
  const productPriceElement = document.getElementById('product-price');
  const shippingPriceElement = document.getElementById('shipping-price');
  const totalPriceElement = document.getElementById('total-price');
  
  const prices = {
    1: { product: 35000, shipping: 1500, total: 36500 },
    2: { product: 68000, shipping: 0, total: 68000 },
    3: { product: 99000, shipping: 0, total: 99000 }
  };
  
  function updateDisplay(quantity) {
    const priceData = prices[quantity];
    
    // Update hidden input
    if (hiddenQuantityInput) {
      hiddenQuantityInput.value = quantity;
    }
    
    // Update price displays
    if (productPriceElement) {
      productPriceElement.textContent = `₦${priceData.product.toLocaleString()}`;
    }
    
    if (shippingPriceElement) {
      shippingPriceElement.textContent = priceData.shipping === 0 ? 'FREE' : `₦${priceData.shipping.toLocaleString()}`;
    }
    
    if (totalPriceElement) {
      totalPriceElement.textContent = `₦${priceData.total.toLocaleString()}`;
    }
    
    // Update CTA button price
    const ctaButtons = document.querySelectorAll('.cta-btn, .header-price, .sticky-price');
    ctaButtons.forEach(btn => {
      if (btn.classList.contains('sticky-price')) {
        btn.textContent = `₦${priceData.product.toLocaleString()}`;
      } else if (btn.classList.contains('header-price')) {
        btn.textContent = `₦${priceData.product.toLocaleString()}`;
      } else if (btn.classList.contains('cta-btn')) {
        btn.innerHTML = `<i class="fas fa-shopping-cart"></i> Order Now – ₦${priceData.product.toLocaleString()}`;
      }
    });
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
  
  // Format the message
  const message = `
🔔 *NEW ORDER - MOSQUITO KILLER LAMP* 🔔

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

📊 *DISCOUNT APPLIED*
━━━━━━━━━━━━━━━━━━━━━
🎯 *Savings:* ₦${orderData.savings.toLocaleString()}
${orderData.quantity === 3 ? '🏆 *BEST DEAL!*' : ''}

⏰ *ORDER TIMESTAMP*
━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* ${orderData.orderDate}
🕐 *Time:* ${orderData.orderTime}

🆔 *Order Reference:* ${orderData.orderId}
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
    
    // Get selected quantity
    const activeQtyBtn = document.querySelector('.qty-btn.active');
    const quantity = activeQtyBtn ? parseInt(activeQtyBtn.dataset.qty) : 2;
    
    // Get price data
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
    if (!formData.name || !formData.phone || !formData.state || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (!formData.state) {
      alert('Please select your delivery state');
      return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Order...';
    submitBtn.disabled = true;
    
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
        state: formData.state
      }));
      
      // Redirect to thank you page
      window.location.href = 'thank-you.html?order=' + formData.orderId;
    } else {
      // Show error message
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      alert('Sorry, there was an error submitting your order. Please try again or contact us on WhatsApp.');
      
      // Store for retry
      localStorage.setItem('failedOrder', JSON.stringify(formData));
    }
  });
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
    orderSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// ============================================
// INITIALIZE ALL FUNCTIONS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  initQuantitySelector();
  initFAQ();
  initForm();
  
  // Add scroll-based header effect
  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
      }
    });
  }
});

