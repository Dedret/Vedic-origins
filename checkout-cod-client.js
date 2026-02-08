/**
 * Client-side snippet to call the Netlify COD order function
 * 
 * This file provides a reusable function to place COD orders from the checkout page.
 * Include this file in your checkout.html or integrate the code directly.
 */

/**
 * Place a COD order via Netlify function
 * @param {Object} orderData - Order details
 * @param {Array} orderData.items - Array of items with product_id, name, price, qty
 * @param {Object} orderData.address - Address object with name, line1, city, state, pincode
 * @param {string} orderData.phone - Customer phone number
 * @param {string} orderData.email - Customer email (optional)
 * @param {string} orderData.notes - Special instructions (optional)
 * @returns {Promise<Object>} Response with orderId, status, and total
 */
async function placeOrderCOD(orderData) {
  try {
    const response = await fetch('/.netlify/functions/place-order-cod', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Order failed: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('COD order error:', error);
    throw error;
  }
}

/**
 * Example usage:
 * 
 * // Parse product details from URL parameters
 * const params = new URLSearchParams(window.location.search);
 * const productName = params.get('product') || 'Vedic Origins Ghee';
 * const rawPrice = params.get('price') || '0';
 * const basePrice = parseInt(rawPrice.replace(/[^0-9]/g, ''));
 * 
 * // When user clicks confirm button
 * async function confirmOrder() {
 *   const name = document.getElementById('name').value;
 *   const phone = document.getElementById('phone').value;
 *   const addressText = document.getElementById('address').value;
 *   
 *   // Parse address (you may need to adjust this based on your form structure)
 *   const addressParts = addressText.split(',').map(s => s.trim());
 *   
 *   const orderData = {
 *     items: [{
 *       product_id: 'cow-ghee-1l', // or derive from product name
 *       name: productName,
 *       price: basePrice,
 *       qty: 1
 *     }],
 *     address: {
 *       name: name,
 *       line1: addressParts[0] || addressText,
 *       city: addressParts[1] || 'City',
 *       state: addressParts[2] || 'State',
 *       pincode: addressParts[3] || '000000'
 *     },
 *     phone: phone,
 *     email: '', // optional
 *     notes: ''  // optional
 *   };
 *   
 *   try {
 *     const result = await placeOrderCOD(orderData);
 *     alert(`Order placed successfully! Order ID: ${result.orderId}`);
 *     window.location.href = 'index.html';
 *   } catch (error) {
 *     alert('Failed to place order. Please try again.');
 *   }
 * }
 */

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { placeOrderCOD };
}
