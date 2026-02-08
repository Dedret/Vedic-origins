// ===== VALIDATION HELPERS =====

/**
 * Validates name field (minimum 2 characters)
 */
function validateName(name) {
  const trimmed = (name || '').trim();
  if (trimmed.length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }
  return { valid: true, message: '' };
}

/**
 * Validates mobile number (exactly 10 digits)
 */
function validateMobile(mobile) {
  const trimmed = (mobile || '').trim();
  if (!/^\d{10}$/.test(trimmed)) {
    return { valid: false, message: 'Mobile number must be exactly 10 digits' };
  }
  return { valid: true, message: '' };
}

/**
 * Validates landmark field (minimum 2 characters)
 */
function validateLandmark(landmark) {
  const trimmed = (landmark || '').trim();
  if (trimmed.length < 2) {
    return { valid: false, message: 'Landmark must be at least 2 characters' };
  }
  return { valid: true, message: '' };
}

/**
 * Validates area/street field (minimum 2 characters)
 */
function validateArea(area) {
  const trimmed = (area || '').trim();
  if (trimmed.length < 2) {
    return { valid: false, message: 'Area/Street must be at least 2 characters' };
  }
  return { valid: true, message: '' };
}

/**
 * Validates city field (letters and spaces only, minimum 2 characters)
 */
function validateCity(city) {
  const trimmed = (city || '').trim();
  if (trimmed.length < 2) {
    return { valid: false, message: 'City must be at least 2 characters' };
  }
  if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
    return { valid: false, message: 'City should only contain letters and spaces' };
  }
  return { valid: true, message: '' };
}

/**
 * Validates pincode (exactly 6 digits)
 */
function validatePincode(pincode) {
  const trimmed = (pincode || '').trim();
  if (!/^\d{6}$/.test(trimmed)) {
    return { valid: false, message: 'Pincode must be exactly 6 digits' };
  }
  return { valid: true, message: '' };
}

/**
 * Validates email (optional, but if provided must be valid format)
 */
function validateEmail(email) {
  const trimmed = (email || '').trim();
  if (trimmed === '') {
    return { valid: true, message: '' }; // Optional field
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  return { valid: true, message: '' };
}

/**
 * Show inline validation error for a field
 */
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(fieldId + '-error');
  
  if (field) {
    field.classList.add('invalid');
  }
  
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

/**
 * Clear inline validation error for a field
 */
function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(fieldId + '-error');
  
  if (field) {
    field.classList.remove('invalid');
  }
  
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
}

/**
 * Validate all form fields
 */
function validateAllFields() {
  let isValid = true;
  
  // Validate name
  const nameResult = validateName(document.getElementById('name')?.value);
  if (!nameResult.valid) {
    showError('name', nameResult.message);
    isValid = false;
  } else {
    clearError('name');
  }
  
  // Validate mobile
  const mobileResult = validateMobile(document.getElementById('phone')?.value);
  if (!mobileResult.valid) {
    showError('phone', mobileResult.message);
    isValid = false;
  } else {
    clearError('phone');
  }
  
  // Validate landmark
  const landmarkResult = validateLandmark(document.getElementById('landmark')?.value);
  if (!landmarkResult.valid) {
    showError('landmark', landmarkResult.message);
    isValid = false;
  } else {
    clearError('landmark');
  }
  
  // Validate area
  const areaResult = validateArea(document.getElementById('area')?.value);
  if (!areaResult.valid) {
    showError('area', areaResult.message);
    isValid = false;
  } else {
    clearError('area');
  }
  
  // Validate city
  const cityResult = validateCity(document.getElementById('city')?.value);
  if (!cityResult.valid) {
    showError('city', cityResult.message);
    isValid = false;
  } else {
    clearError('city');
  }
  
  // Validate pincode
  const pincodeResult = validatePincode(document.getElementById('pincode')?.value);
  if (!pincodeResult.valid) {
    showError('pincode', pincodeResult.message);
    isValid = false;
  } else {
    clearError('pincode');
  }
  
  // Validate email (optional)
  const emailResult = validateEmail(document.getElementById('email')?.value);
  if (!emailResult.valid) {
    showError('email', emailResult.message);
    isValid = false;
  } else {
    clearError('email');
  }
  
  return isValid;
}

// ===== MODAL LOGIC =====

let currentOrderData = null;
let firstFocusableElement = null;
let lastFocusableElement = null;

/**
 * Opens the professional order confirmation modal
 */
function openModal(orderData) {
  currentOrderData = orderData;
  const modal = document.getElementById('order-modal');
  
  if (!modal) {
    console.error('Modal element not found');
    return;
  }
  
  // Populate modal with order details
  document.getElementById('modal-customer-name').textContent = orderData.customerName;
  document.getElementById('modal-order-id').textContent = orderData.orderId;
  document.getElementById('modal-amount').textContent = '₹' + orderData.total;
  document.getElementById('modal-payment-mode').textContent = orderData.mode || 'COD';
  
  // Show modal
  modal.classList.add('active');
  
  // Setup focus trap
  setupFocusTrap(modal);
  
  // Focus on primary button
  const primaryBtn = document.getElementById('modal-primary-btn');
  if (primaryBtn) {
    setTimeout(() => primaryBtn.focus(), 100);
  }
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

/**
 * Closes the modal
 */
function closeModal() {
  const modal = document.getElementById('order-modal');
  if (modal) {
    modal.classList.remove('active');
  }
  
  // Restore body scroll
  document.body.style.overflow = '';
  
  currentOrderData = null;
}

/**
 * Setup focus trap within modal for accessibility
 */
function setupFocusTrap(modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  firstFocusableElement = focusableElements[0];
  lastFocusableElement = focusableElements[focusableElements.length - 1];
  
  modal.addEventListener('keydown', handleModalKeydown);
}

/**
 * Handle keyboard events in modal (ESC to close, TAB for focus trap)
 */
function handleModalKeydown(e) {
  if (e.key === 'Escape') {
    closeModal();
    return;
  }
  
  if (e.key === 'Tab') {
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusableElement) {
        e.preventDefault();
        lastFocusableElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusableElement) {
        e.preventDefault();
        firstFocusableElement.focus();
      }
    }
  }
}

/**
 * Navigate to thank you page with order ID
 */
function goToThankYou() {
  if (currentOrderData && currentOrderData.orderId) {
    window.location.href = '/thank-you.html?order=' + encodeURIComponent(currentOrderData.orderId);
  }
}

// ===== ORDER PLACEMENT =====

/**
 * Client-side helper to call the COD Netlify function
 */
async function placeCodOrder(cartItems, address, phone, email = '', notes = '') {
  try {
    const res = await fetch('/.netlify/functions/place-order-cod', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems, address, phone, email, notes })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data?.error || 'Order failed');
    }
    
    // Show professional modal instead of alert
    openModal({
      customerName: address.name,
      orderId: data.orderId,
      total: data.total,
      mode: 'COD'
    });
    
    return data;
  } catch (err) {
    // Show error in a user-friendly way
    const errorMsg = err.message || 'Network error. Please try again.';
    alert(errorMsg); // Still using alert for errors, but can be improved with error modal
    return null;
  }
}
