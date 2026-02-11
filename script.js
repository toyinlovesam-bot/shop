// Dynamic total price
function updateTotal() {
  const qtySelect = document.getElementById('quantity');
  const qty = parseInt(qtySelect.value);
  const base = 35000;
  let total = qty * base;
  if (qty === 2) total -= 2000;
  if (qty === 3) total -= 6000;
  const formatted = `₦${total.toLocaleString()}`;
  
  document.getElementById('total-price').textContent = `Total: ${formatted}`;
  document.getElementById('total-price-form').textContent = `Total: ${formatted}`;
}

document.getElementById('quantity').addEventListener('change', updateTotal);
updateTotal(); // initial

// Fake 24-hour countdown
function startCountdown() {
  let timeLeft = 24 * 60 * 60; // 24 hours
  const timer = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timer);
      document.getElementById('countdown').innerHTML = "Offer Expired – Check back soon!";
      return;
    }
    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = timeLeft % 60;
    document.getElementById('hours').textContent = h.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = m.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = s.toString().padStart(2, '0');
  }, 1000);
}
startCountdown();

// Form → Telegram
document.getElementById('orderForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const status = document.getElementById('status');
  status.textContent = 'Sending order...';
  status.style.color = '#007bff';

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const state = document.getElementById('state').value;
  const quantity = document.getElementById('quantity').value;
  const total = (quantity * 35000) - (quantity == 2 ? 2000 : quantity == 3 ? 6000 : 0);

  const message = `🚨 NEW ORDER!\n\n` +
                  `State: ${state}\n` +
                  `Name: ${name}\n` +
                  `Phone: ${phone}\n` +
                  `Address: ${address}\n` +
                  `Quantity: ${quantity} lamp(s)\n` +
                  `Total: ₦${total.toLocaleString()}\n` +
                  `Product: Portable Mosquito Killer Lamp (4000mAh Rechargeable)`;

  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    status.textContent = 'Configuration error – contact seller.';
    status.style.color = '#d00';
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

  try {
    const res = await fetch(url);
    if (res.ok) {
      status.textContent = 'Order received! We will contact you shortly on WhatsApp.';
      status.style.color = '#28a745';
      e.target.reset();
      updateTotal();
    } else {
      status.textContent = 'Failed to send. Please try again or contact us.';
      status.style.color = '#d00';
    }
  } catch (err) {
    status.textContent = 'Network error. Check your connection.';
    status.style.color = '#d00';
  }
});