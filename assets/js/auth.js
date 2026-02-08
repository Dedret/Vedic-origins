/**
 * Supabase Authentication Module
 * Handles OTP-based authentication (email and phone)
 */

// Initialize Supabase client
let supabaseClient = null;

/**
 * Initialize the Supabase client with configuration
 */
function initSupabase() {
  if (supabaseClient) return supabaseClient;
  
  if (typeof SUPABASE_CONFIG === 'undefined') {
    console.error('SUPABASE_CONFIG not found. Please create assets/js/config.js from config.example.js');
    return null;
  }
  
  if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded. Please include the Supabase CDN script.');
    return null;
  }
  
  supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  return supabaseClient;
}

/**
 * Send OTP to email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Result object with success status
 */
async function sendEmailOTP(email) {
  const client = initSupabase();
  if (!client) {
    return { success: false, error: 'Supabase not initialized' };
  }
  
  try {
    const { data, error } = await client.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    
    if (error) {
      console.error('Email OTP error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('Send email OTP exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Send OTP to phone
 * @param {string} phone - User's phone number (with country code, e.g., +919876543210)
 * @returns {Promise<Object>} Result object with success status
 */
async function sendPhoneOTP(phone) {
  const client = initSupabase();
  if (!client) {
    return { success: false, error: 'Supabase not initialized' };
  }
  
  try {
    const { data, error } = await client.auth.signInWithOtp({
      phone: phone,
      options: {
        channel: 'sms'
      }
    });
    
    if (error) {
      console.error('Phone OTP error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('Send phone OTP exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Verify OTP
 * @param {string} identifier - Email or phone number used to send OTP
 * @param {string} token - OTP code entered by user
 * @param {string} type - 'email' or 'phone'
 * @returns {Promise<Object>} Result object with session data
 */
async function verifyOTP(identifier, token, type = 'email') {
  const client = initSupabase();
  if (!client) {
    return { success: false, error: 'Supabase not initialized' };
  }
  
  try {
    const verifyParams = {
      token: token,
      type: type === 'phone' ? 'sms' : 'email'
    };
    
    if (type === 'email') {
      verifyParams.email = identifier;
    } else {
      verifyParams.phone = identifier;
    }
    
    const { data, error } = await client.auth.verifyOtp(verifyParams);
    
    if (error) {
      console.error('OTP verification error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, session: data.session, user: data.user };
  } catch (err) {
    console.error('Verify OTP exception:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Get current session
 * @returns {Promise<Object|null>} Current session or null
 */
async function getSession() {
  const client = initSupabase();
  if (!client) return null;
  
  try {
    const { data: { session }, error } = await client.auth.getSession();
    if (error) {
      console.error('Get session error:', error);
      return null;
    }
    return session;
  } catch (err) {
    console.error('Get session exception:', err);
    return null;
  }
}

/**
 * Get current user
 * @returns {Promise<Object|null>} Current user or null
 */
async function getCurrentUser() {
  const client = initSupabase();
  if (!client) return null;
  
  try {
    const { data: { user }, error } = await client.auth.getUser();
    if (error) {
      console.error('Get user error:', error);
      return null;
    }
    return user;
  } catch (err) {
    console.error('Get user exception:', err);
    return null;
  }
}

/**
 * Sign out current user
 * @returns {Promise<boolean>} Success status
 */
async function signOut() {
  const client = initSupabase();
  if (!client) return false;
  
  try {
    const { error } = await client.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Sign out exception:', err);
    return false;
  }
}

/**
 * Listen for auth state changes
 * @param {Function} callback - Callback function to handle auth state changes
 */
function onAuthStateChange(callback) {
  const client = initSupabase();
  if (!client) return null;
  
  const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  
  return subscription;
}

// Auto-initialize on load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
  });
}
