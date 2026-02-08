/**
 * Authentication Gate
 * Redirects unauthenticated users to login page
 * Include this script at the top of protected pages
 */

(async function() {
  // Public pages that don't require authentication
  const publicPages = [
    '/login.html',
    '/index.html', // Allow homepage for browsing
    '/test-order.html'
  ];
  
  // Check if current page is public
  const currentPath = window.location.pathname;
  const isPublicPage = publicPages.some(page => currentPath.endsWith(page) || currentPath === '/');
  
  // For static assets, tests, and public pages - skip auth check
  if (isPublicPage || currentPath.includes('/assets/') || currentPath.includes('/test-')) {
    return;
  }
  
  // Wait a moment for Supabase to initialize
  await new Promise(resolve => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      resolve();
    }
  });
  
  // Check authentication status
  try {
    const session = await getSession();
    
    if (!session) {
      // No active session - redirect to login
      // Save intended destination
      sessionStorage.setItem('redirectAfterLogin', window.location.href);
      window.location.href = '/login.html';
    }
  } catch (error) {
    console.error('Auth gate error:', error);
    // On error, redirect to login for safety
    sessionStorage.setItem('redirectAfterLogin', window.location.href);
    window.location.href = '/login.html';
  }
})();
