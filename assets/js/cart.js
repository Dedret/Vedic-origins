/**
 * Shopping Cart Module
 * Manages cart using localStorage
 */

const CART_STORAGE_KEY = 'vedic_origins_cart';

/**
 * Get cart from localStorage
 * @returns {Array} Array of cart items
 */
function getCart() {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error reading cart:', error);
    return [];
  }
}

/**
 * Save cart to localStorage
 * @param {Array} cart - Cart items array
 */
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
}

/**
 * Add item to cart or update quantity if it exists
 * @param {string} productId - Unique product identifier
 * @param {string} name - Product name
 * @param {number} price - Product price
 * @param {number} qty - Quantity to add (default: 1)
 * @returns {Object} Updated cart item
 */
function addItem(productId, name, price, qty = 1) {
  const cart = getCart();
  
  // Check if item already exists
  const existingItem = cart.find(item => item.product_id === productId);
  
  if (existingItem) {
    // Update quantity
    existingItem.qty += qty;
    existingItem.subtotal = existingItem.price * existingItem.qty;
  } else {
    // Add new item
    cart.push({
      product_id: productId,
      name: name,
      price: Number(price),
      qty: Number(qty),
      subtotal: Number(price) * Number(qty)
    });
  }
  
  saveCart(cart);
  return existingItem || cart[cart.length - 1];
}

/**
 * Remove item from cart
 * @param {string} productId - Product identifier to remove
 * @returns {boolean} Success status
 */
function removeItem(productId) {
  let cart = getCart();
  const initialLength = cart.length;
  
  cart = cart.filter(item => item.product_id !== productId);
  
  if (cart.length !== initialLength) {
    saveCart(cart);
    return true;
  }
  
  return false;
}

/**
 * Update quantity of an item in cart
 * @param {string} productId - Product identifier
 * @param {number} qty - New quantity (0 or negative will remove item)
 * @returns {boolean} Success status
 */
function updateQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(item => item.product_id === productId);
  
  if (!item) {
    return false;
  }
  
  if (qty <= 0) {
    return removeItem(productId);
  }
  
  item.qty = Number(qty);
  item.subtotal = item.price * item.qty;
  
  saveCart(cart);
  return true;
}

/**
 * Clear entire cart
 */
function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [] } }));
}

/**
 * Get cart totals
 * @returns {Object} Object with subtotal, itemCount, and formatted values
 */
function getTotals() {
  const cart = getCart();
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  
  return {
    subtotal: subtotal,
    itemCount: itemCount,
    subtotalFormatted: '₹' + subtotal.toLocaleString('en-IN')
  };
}

/**
 * Get number of items in cart
 * @returns {number} Total number of items
 */
function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

/**
 * Check if cart is empty
 * @returns {boolean} True if cart is empty
 */
function isCartEmpty() {
  return getCart().length === 0;
}

/**
 * Get specific item from cart
 * @param {string} productId - Product identifier
 * @returns {Object|null} Cart item or null if not found
 */
function getCartItem(productId) {
  const cart = getCart();
  return cart.find(item => item.product_id === productId) || null;
}

/**
 * Update cart badge/counter in UI
 */
function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    const count = getCartItemCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

// Listen for cart updates and update badge
if (typeof window !== 'undefined') {
  window.addEventListener('cartUpdated', updateCartBadge);
  document.addEventListener('DOMContentLoaded', updateCartBadge);
}
