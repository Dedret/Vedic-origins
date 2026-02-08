/**
 * Profile Management Module
 * Handles user profile operations with Supabase
 */

/**
 * Get user profile from Supabase
 * @returns {Promise<Object|null>} User profile or null
 */
async function getUserProfile() {
  const client = initSupabase();
  if (!client) return null;

  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      // If profile doesn't exist, create it
      if (error.code === 'PGRST116') {
        return await createUserProfile(user);
      }
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception fetching profile:', err);
    return null;
  }
}

/**
 * Create user profile in Supabase
 * @param {Object} user - User object from auth
 * @returns {Promise<Object|null>} Created profile or null
 */
async function createUserProfile(user) {
  const client = initSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email || null,
        phone: user.phone || null,
        name: user.user_metadata?.name || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Exception creating profile:', err);
    return null;
  }
}

/**
 * Update user profile in Supabase
 * @param {Object} updates - Profile fields to update
 * @returns {Promise<boolean>} Success status
 */
async function updateUserProfile(updates) {
  const client = initSupabase();
  if (!client) return false;

  try {
    const user = await getCurrentUser();
    if (!user) return false;

    const { error } = await client
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception updating profile:', err);
    return false;
  }
}

/**
 * Get user orders from Supabase
 * @param {number} limit - Maximum number of orders to fetch
 * @returns {Promise<Array>} Array of orders
 */
async function getUserOrders(limit = 10) {
  const client = initSupabase();
  if (!client) return [];

  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const { data, error } = await client
      .from('orders')
      .select(`
        *,
        order_items (
          product_id,
          name,
          price,
          qty,
          currency
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception fetching orders:', err);
    return [];
  }
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
}

/**
 * Get order status badge class
 * @param {string} status - Order status
 * @returns {string} CSS class name
 */
function getOrderStatusClass(status) {
  const statusMap = {
    'cod_pending': 'status pending',
    'paid': 'status shipped',
    'payment_failed': 'status cancelled',
    'pending_payment': 'status pending',
    'shipped': 'status shipped',
    'delivered': 'status delivered',
    'cancelled': 'status cancelled'
  };
  return statusMap[status] || 'status pending';
}

/**
 * Get order status text
 * @param {string} status - Order status
 * @returns {string} Display text
 */
function getOrderStatusText(status) {
  const statusMap = {
    'cod_pending': 'Pending (COD)',
    'paid': 'Paid',
    'payment_failed': 'Payment Failed',
    'pending_payment': 'Pending Payment',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  return statusMap[status] || 'Unknown';
}
