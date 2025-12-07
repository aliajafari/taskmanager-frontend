import Cookies from 'js-cookie';

const TOKEN_COOKIE_NAME = 'auth_token';
const TOKEN_PREFIX = 'tm_';

export const authUtils = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    // Try to get from js-cookie first
    let token = Cookies.get(TOKEN_COOKIE_NAME);
    
    // Fallback to document.cookie if js-cookie doesn't work
    if (!token && document.cookie) {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === TOKEN_COOKIE_NAME) {
          token = decodeURIComponent(value);
          break;
        }
      }
    }
    
    return token || null;
  },

  getTokenWithPrefix: (): string | null => {
    const token = authUtils.getToken();
    if (!token) {
      return null;
    }
    // Add prefix if token exists and doesn't already have it
    if (!token.startsWith(TOKEN_PREFIX)) {
      return TOKEN_PREFIX + token;
    }
    return token;
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') {
      return;
    }
    // Store token without prefix (store original token from API)
    // Remove prefix if it already exists to avoid duplication
    let tokenToStore = token.startsWith(TOKEN_PREFIX) ? token.substring(TOKEN_PREFIX.length) : token;
    
    // Set cookie with 7 days expiration
    // Use path: '/' to ensure cookie is available for all routes
    // Use sameSite: 'lax' instead of 'strict' to allow cookie to be sent on navigation
    Cookies.set(TOKEN_COOKIE_NAME, tokenToStore, {
      expires: 7,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    
    // Also set via document.cookie as fallback to ensure it's set
    const expires = new Date();
    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    document.cookie = `${TOKEN_COOKIE_NAME}=${tokenToStore}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
  },

  clearToken: (): void => {
    if (typeof window === 'undefined') {
      return;
    }
    Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' });
  },

  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },
};

