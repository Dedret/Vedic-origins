/**
 * Products Page Logic
 * Fetches and displays products from Supabase
 */

let allProducts = [];
let currentFilter = 'all';

/**
 * Fetch products from Supabase
 */
async function fetchProducts() {
  const client = initSupabase();
  if (!client) {
    console.error('Supabase not initialized');
    return [];
  }

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('type', { ascending: true })
      .order('sale_price', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception fetching products:', err);
    return [];
  }
}

/**
 * Display products in the grid
 */
function displayProducts(products) {
  const grid = document.getElementById('products-grid');
  
  if (!products || products.length === 0) {
    grid.innerHTML = '<div class="no-products">No products available at the moment.</div>';
    return;
  }

  grid.innerHTML = products.map(product => {
    const discount = Math.round(((product.mrp - product.sale_price) / product.mrp) * 100);
    
    return `
      <div class="product-card" data-type="${product.type}">
        <img src="${product.image_url}" alt="${product.name}" class="product-image" onerror="this.src='cow0.jpg'">
        <div class="product-info">
          <div class="product-name">${product.name}</div>
          <div class="product-desc">${product.description || ''}</div>
          <div class="product-price">
            <span class="price-mrp">₹${product.mrp}</span>
            <span class="price-sale">₹${product.sale_price}</span>
            <span class="price-discount">${discount}% OFF</span>
          </div>
          <button class="add-to-cart-btn" onclick="addToCart('${product.id}', '${product.name}', ${product.sale_price})">
            <i class="fas fa-cart-plus"></i> ADD TO CART
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Filter products by type
 */
function filterProducts(type) {
  currentFilter = type;
  
  // Update filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Filter and display
  let filtered = allProducts;
  if (type !== 'all') {
    filtered = allProducts.filter(p => p.type === type);
  }
  
  displayProducts(filtered);
}

/**
 * Add product to cart with visual feedback
 */
function addToCart(productId, productName, price) {
  // Add to cart
  const item = addItem(productId, productName, price, 1);
  
  // Visual feedback
  const btn = event.target.closest('.add-to-cart-btn');
  const originalContent = btn.innerHTML;
  
  btn.innerHTML = '<i class="fas fa-check"></i> ADDED!';
  btn.style.background = '#27ae60';
  btn.style.borderColor = '#27ae60';
  btn.style.color = 'white';
  
  setTimeout(() => {
    btn.innerHTML = originalContent;
    btn.style.background = '';
    btn.style.borderColor = '';
    btn.style.color = '';
  }, 1500);
  
  // Animate cart icon
  const cartIcon = document.querySelector('.cart-icon');
  if (cartIcon) {
    cartIcon.style.animation = 'bounce 0.5s';
    setTimeout(() => {
      cartIcon.style.animation = '';
    }, 500);
  }
}

/**
 * Handle logout
 */
async function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    const success = await signOut();
    if (success) {
      window.location.href = '/login.html';
    }
  }
}

/**
 * Initialize products page
 */
async function initProductsPage() {
  try {
    // Fetch products
    allProducts = await fetchProducts();
    displayProducts(allProducts);
  } catch (error) {
    console.error('Error initializing products page:', error);
    document.getElementById('products-grid').innerHTML = 
      '<div class="no-products">Error loading products. Please refresh the page.</div>';
  }
}

// Initialize on page load
if (document.getElementById('products-grid')) {
  document.addEventListener('DOMContentLoaded', initProductsPage);
}
