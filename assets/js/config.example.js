/**
 * Supabase Configuration Template
 * 
 * Instructions:
 * 1. Copy this file to config.js
 * 2. Replace the placeholder values with your actual Supabase credentials
 * 3. Never commit config.js to version control (it's in .gitignore)
 */

const SUPABASE_CONFIG = {
  // Your Supabase project URL (e.g., https://xxxxx.supabase.co)
  url: 'YOUR_SUPABASE_URL_HERE',
  
  // Your Supabase anon/public key
  anonKey: 'YOUR_SUPABASE_ANON_KEY_HERE'
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SUPABASE_CONFIG;
}
