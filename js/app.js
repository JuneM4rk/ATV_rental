/**
 * ATV Rental System - Main Application Module
 */

const App = {
    /**
     * Initialize the application
     */
    init() {
        this.setupNavigation();
        this.updateAuthUI();
    },

    /**
     * Setup navigation based on auth state
     */
    setupNavigation() {
        const user = Auth.getUser();
        
        if (user) {
            // Show logged in navigation
            $('.nav-guest').hide();
            $('.nav-user').show();
            
            // Update user info in nav
            $('#nav-user-name').text(user.first_name);
            
            // Show/hide based on role
            if (Auth.canManage()) {
                $('.nav-manage').show();
            } else {
                $('.nav-manage').hide();
            }
            
            if (Auth.isAdmin()) {
                $('.nav-admin').show();
            } else {
                $('.nav-admin').hide();
            }
        } else {
            // Show guest navigation
            $('.nav-guest').show();
            $('.nav-user').hide();
            $('.nav-manage').hide();
            $('.nav-admin').hide();
        }
    },

    /**
     * Update UI based on authentication state
     */
    updateAuthUI() {
        const user = Auth.getUser();
        
        if (user) {
            // Update avatar
            const avatarUrl = user.avatar || CONFIG.DEFAULT_AVATAR;
            $('.user-avatar').attr('src', avatarUrl);
            
            // Update username displays
            $('.user-name').text(user.first_name + ' ' + user.last_name);
            $('.user-email').text(user.email);
            $('.user-role').text(user.role.charAt(0).toUpperCase() + user.role.slice(1));
        }
    },

    /**
     * Show loading spinner
     */
    showLoading(selector = 'body') {
        const loader = `<div class="loading-overlay"><div class="spinner"></div></div>`;
        $(selector).append(loader);
    },

    /**
     * Hide loading spinner
     */
    hideLoading() {
        $('.loading-overlay').remove();
    },

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const toastId = 'toast-' + Date.now();
        const toast = `
            <div id="${toastId}" class="toast toast-${type}">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="$('#${toastId}').remove()">&times;</button>
            </div>
        `;
        
        // Create toast container if not exists
        if (!$('#toast-container').length) {
            $('body').append('<div id="toast-container"></div>');
        }
        
        $('#toast-container').append(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            $(`#${toastId}`).fadeOut(300, function() {
                $(this).remove();
            });
        }, 5000);
    },

    /**
     * Show success toast
     */
    showSuccess(message) {
        this.showToast(message, 'success');
    },

    /**
     * Show error toast
     */
    showError(message) {
        this.showToast(message, 'error');
    },

    /**
     * Show confirmation modal
     */
    confirm(message, onConfirm, onCancel = null) {
        const modalId = 'confirm-modal-' + Date.now();
        const modal = `
            <div id="${modalId}" class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Confirm Action</h3>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="${modalId}-cancel">Cancel</button>
                        <button class="btn btn-primary" id="${modalId}-confirm">Confirm</button>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(modal);
        
        $(`#${modalId}-confirm`).on('click', function() {
            $(`#${modalId}`).remove();
            if (onConfirm) onConfirm();
        });
        
        $(`#${modalId}-cancel`).on('click', function() {
            $(`#${modalId}`).remove();
            if (onCancel) onCancel();
        });
    },

    /**
     * Format currency
     */
    formatCurrency(amount) {
        return '$' + parseFloat(amount).toFixed(2);
    },

    /**
     * Format date
     */
    formatDate(dateString) {
        // Handle date-only strings (YYYY-MM-DD) to avoid timezone conversion issues
        if (dateString && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = dateString.split('-');
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
        // Handle full datetime strings
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    /**
     * Format datetime
     */
    formatDateTime(dateString) {
        // Handle date-only strings (YYYY-MM-DD) to avoid timezone conversion issues
        if (dateString && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = dateString.split('-');
            const date = new Date(year, month - 1, day);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
        // Handle full datetime strings
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Get status badge HTML
     */
    getStatusBadge(status) {
        const statusClasses = {
            'available': 'badge-success',
            'rented': 'badge-warning',
            'maintenance': 'badge-danger',
            'pending': 'badge-info',
            'approved': 'badge-success',
            'denied': 'badge-danger',
            'cancelled': 'badge-danger',
            'pending_return': 'badge-warning',
            'returned': 'badge-secondary'
        };
        
        const statusLabels = {
            'available': 'Available',
            'rented': 'Rented',
            'maintenance': 'Maintenance',
            'pending': 'Pending',
            'approved': 'Approved',
            'denied': 'Denied',
            'cancelled': 'Cancelled',
            'pending_return': 'Pending Return',
            'returned': 'Returned'
        };
        
        const className = statusClasses[status] || 'badge-secondary';
        const label = statusLabels[status] || status;
        
        return `<span class="badge ${className}">${label}</span>`;
    },

    /**
     * Get role badge HTML
     */
    getRoleBadge(role) {
        const roleClasses = {
            'admin': 'badge-danger',
            'manager': 'badge-warning',
            'customer': 'badge-info'
        };
        
        const className = roleClasses[role] || 'badge-secondary';
        const label = role.charAt(0).toUpperCase() + role.slice(1);
        
        return `<span class="badge ${className}">${label}</span>`;
    },

    /**
     * Handle file preview
     */
    previewImage(input, previewSelector) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $(previewSelector).attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    },

    /**
     * Debounce function for search inputs
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Build pagination HTML
     */
    buildPagination(pagination, onPageClick) {
        if (pagination.last_page <= 1) {
            return '';
        }

        let html = '<div class="pagination">';
        
        // Previous button
        if (pagination.current_page > 1) {
            html += `<button class="page-btn" data-page="${pagination.current_page - 1}">&laquo; Prev</button>`;
        }
        
        // Page numbers
        for (let i = 1; i <= pagination.last_page; i++) {
            if (
                i === 1 || 
                i === pagination.last_page || 
                (i >= pagination.current_page - 2 && i <= pagination.current_page + 2)
            ) {
                const activeClass = i === pagination.current_page ? 'active' : '';
                html += `<button class="page-btn ${activeClass}" data-page="${i}">${i}</button>`;
            } else if (
                i === pagination.current_page - 3 || 
                i === pagination.current_page + 3
            ) {
                html += `<span class="page-ellipsis">...</span>`;
            }
        }
        
        // Next button
        if (pagination.current_page < pagination.last_page) {
            html += `<button class="page-btn" data-page="${pagination.current_page + 1}">Next &raquo;</button>`;
        }
        
        html += '</div>';
        
        return html;
    }
};

// Initialize app when document is ready
$(document).ready(function() {
    App.init();
});

