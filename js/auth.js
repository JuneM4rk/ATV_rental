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
    async logout() {
        try {
            await API.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clear();
            window.location.href = 'index.html';
        }
    }
};

