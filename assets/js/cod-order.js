// Client-side helper to call the COD Netlify function
async function placeCodOrder(cartItems, address, phone, email = '', notes = '') {
  try {
    const res = await fetch('/.netlify/functions/place-order-cod', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems, address, phone, email, notes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || 'Order failed');
    alert('COD order placed! Order ID: ' + data.orderId);
    // Optional redirect to thank-you page
    if (typeof window !== 'undefined') {
      window.location.href = 'thank-you.html?order=' + encodeURIComponent(data.orderId);
    }
    return data;
  } catch (err) {
    alert(err.message || 'Network error');
    return null;
  }
}

// Example usage (bind to your checkout button):
// document.querySelector('.confirm-btn').addEventListener('click', async () => {
//   const cartItems = [
//     { product_id: 'cow-ghee-1l', name: 'A2 Gir Cow Ghee (1L)', price: 4000, qty: 1 }
//   ];
//   const address = {
//     name: document.getElementById('name').value,
//     line1: document.getElementById('address').value,
//     city: document.getElementById('city').value,
//     state: document.getElementById('state').value,
//     pincode: document.getElementById('pincode').value
//   };
//   const phone = document.getElementById('phone').value;
//   const email = document.getElementById('email')?.value || '';
//   const notes = document.getElementById('notes')?.value || '';
//   await placeCodOrder(cartItems, address, phone, email, notes);
// });
