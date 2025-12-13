/**
 * ATV Rental System - Authentication Module
 * Handles token management and authentication state
 */

const Auth = {
    /**
     * Save authentication token to localStorage
     */
    saveToken(token) {
        localStorage.setItem(CONFIG.TOKEN_KEY, token);
    },

    /**
     * Get authentication token from localStorage
     */
    getToken() {
        return localStorage.getItem(CONFIG.TOKEN_KEY);
    },

    /**
     * Remove authentication token from localStorage
     */
    removeToken() {
        localStorage.removeItem(CONFIG.TOKEN_KEY);
    },

    /**
     * Save user data to localStorage
     */
    saveUser(user) {
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
    },

    /**
     * Get user data from localStorage
     */
    getUser() {
        const userData = localStorage.getItem(CONFIG.USER_KEY);
        return userData ? JSON.parse(userData) : null;
    },

    /**
     * Remove user data from localStorage
     */
    removeUser() {
        localStorage.removeItem(CONFIG.USER_KEY);
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.getToken();
    },

    /**
     * Get user role
     */
    getRole() {
        const user = this.getUser();
        return user ? user.role : null;
    },

    /**
     * Check if user has specific role
     */
    hasRole(role) {
        return this.getRole() === role;
    },

    /**
     * Check if user has any of the given roles
     */
    hasAnyRole(roles) {
        const userRole = this.getRole();
        return roles.includes(userRole);
    },

    /**
     * Check if user is admin
     */
    isAdmin() {
        return this.hasRole('admin');
    },

    /**
     * Check if user is manager
     */
    isManager() {
        return this.hasRole('manager');
    },

    /**
     * Check if user is customer
     */
    isCustomer() {
        return this.hasRole('customer');
    },

    /**
     * Check if user can manage (admin or manager)
     */
    canManage() {
        return this.hasAnyRole(['admin', 'manager']);
    },

    /**
     * Clear all auth data (logout)
     */
    clear() {
        this.removeToken();
        this.removeUser();
    },

    /**
     * Redirect to login if not authenticated
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    },

    /**
     * Redirect to dashboard if already authenticated
     */
    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            window.location.href = 'dashboard.html';
            return true;
        }
        return false;
    },

    /**
     * Require specific role(s) to access page
     */
    requireRole(roles) {
        if (!this.requireAuth()) {
            return false;
        }

        if (!Array.isArray(roles)) {
            roles = [roles];
        }

        if (!this.hasAnyRole(roles)) {
            alert('You do not have permission to access this page.');
            window.location.href = 'dashboard.html';
            return false;
        }
        return true;
    },

    /**
     * Handle login response
     */
    handleLoginResponse(response) {
        if (response.success && response.data) {
            this.saveToken(response.data.token);
            this.saveUser(response.data.user);
            return true;
        }
        return false;
    },

    /**
     * Logout user
     */
    async logout(showConfirmation = true) {
        const performLogout = async () => {
            try {
                await API.post('/logout');
                // Show success message if App and Messages are available
                if (typeof App !== 'undefined' && typeof App.showSuccess === 'function' && 
                    typeof Messages !== 'undefined' && Messages.auth) {
                    App.showSuccess(Messages.auth.logoutSuccess);
                    // Small delay to show the message before redirect
                    setTimeout(() => {
                        this.clear();
                        window.location.href = 'index.html';
                    }, 500);
                } else {
                    this.clear();
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.error('Logout error:', error);
                // Still logout even if API call fails
                this.clear();
                window.location.href = 'index.html';
            }
        };

        // Show confirmation dialog if requested
        if (showConfirmation) {
            // Use App.confirm if available, otherwise fall back to native confirm
            if (typeof App !== 'undefined' && typeof App.confirm === 'function') {
                App.confirm('Are you sure you want to logout?', () => {
                    performLogout();
                });
                return; // Exit here, performLogout will be called from callback
            } else {
                // Fallback to native confirm if App.confirm is not available
                if (!confirm('Are you sure you want to logout?')) {
                    return; // User cancelled
                }
            }
        }
        
        // Proceed with logout
        performLogout();
    }
};

