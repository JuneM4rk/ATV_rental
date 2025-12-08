/**
 * ATV Rental System - Configuration
 * 
 * IMPORTANT: Change API_BASE_URL when deploying to production
 */

const CONFIG = {
    // API Base URL - Change this for production deployment
    API_BASE_URL: 'https://atvrental.muccs.site/api',
    
    // Storage URL for images
    STORAGE_URL: 'https://atvrental.muccs.site/storage',
    
    // App Settings
    APP_NAME: 'ATV Rental System',
    
    // Pagination
    DEFAULT_PER_PAGE: 12,
    
    // Token storage key
    TOKEN_KEY: 'authtoken',
    USER_KEY: 'authuser',
    
    // Default image placeholder
    DEFAULT_AVATAR: 'images/default.jpg',
    DEFAULT_ATV_IMAGE: 'images/default.jpg',
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);

