/**
 * ATV Rental System - API Module
 * jQuery AJAX wrapper with automatic token handling
 */

const API = {
    /**
     * Make an AJAX request with automatic token handling
     */
    request(method, endpoint, data = null, options = {}) {
        return new Promise((resolve, reject) => {
            const url = CONFIG.API_BASE_URL + endpoint;
            const token = Auth.getToken();

            const ajaxOptions = {
                url: url,
                method: method,
                headers: {
                    'Accept': 'application/json',
                },
                success: function(response) {
                    resolve(response);
                },
                error: function(xhr) {
                    // Handle 401 Unauthorized
                    if (xhr.status === 401) {
                        Auth.clear();
                        if (!window.location.pathname.includes('index.html')) {
                            window.location.href = 'index.html';
                        }
                    }
                    
                    const error = {
                        status: xhr.status,
                        message: xhr.responseJSON?.message || 'An error occurred',
                        errors: xhr.responseJSON?.errors || {},
                        response: xhr.responseJSON
                    };
                    reject(error);
                }
            };

            // Add Authorization header if token exists
            if (token) {
                ajaxOptions.headers['Authorization'] = 'Bearer ' + token;
            }

            // Handle data based on content type
            if (data) {
                if (data instanceof FormData) {
                    ajaxOptions.data = data;
                    ajaxOptions.processData = false;
                    ajaxOptions.contentType = false;
                } else {
                    ajaxOptions.data = JSON.stringify(data);
                    ajaxOptions.contentType = 'application/json';
                }
            }

            // Merge with custom options
            $.extend(ajaxOptions, options);

            $.ajax(ajaxOptions);
        });
    },

    /**
     * GET request
     */
    get(endpoint, params = {}) {
        let url = endpoint;
        if (Object.keys(params).length > 0) {
            url += '?' + $.param(params);
        }
        return this.request('GET', url);
    },

    /**
     * POST request
     */
    post(endpoint, data = {}) {
        return this.request('POST', endpoint, data);
    },

    /**
     * PUT request
     */
    put(endpoint, data = {}) {
        return this.request('PUT', endpoint, data);
    },

    /**
     * DELETE request
     */
    delete(endpoint) {
        return this.request('DELETE', endpoint);
    },

    /**
     * POST with FormData (for file uploads)
     */
    upload(endpoint, formData) {
        return this.request('POST', endpoint, formData);
    },

    /**
     * Handle API errors and display message
     */
    handleError(error, defaultMessage = 'An error occurred') {
        let message = error.message || defaultMessage;
        
        // If there are validation errors, show the first one
        if (error.errors && Object.keys(error.errors).length > 0) {
            const firstError = Object.values(error.errors)[0];
            message = Array.isArray(firstError) ? firstError[0] : firstError;
        }
        
        return message;
    },

    /**
     * Display validation errors on form
     */
    showValidationErrors(errors, formId) {
        // Clear previous errors
        $(`#${formId} .error-message`).remove();
        $(`#${formId} .is-invalid`).removeClass('is-invalid');

        // Show new errors
        Object.entries(errors).forEach(([field, messages]) => {
            const input = $(`#${formId} [name="${field}"]`);
            if (input.length) {
                input.addClass('is-invalid');
                const errorMsg = Array.isArray(messages) ? messages[0] : messages;
                input.after(`<span class="error-message">${errorMsg}</span>`);
            }
        });
    },

    /**
     * Clear validation errors from form
     */
    clearValidationErrors(formId) {
        $(`#${formId} .error-message`).remove();
        $(`#${formId} .is-invalid`).removeClass('is-invalid');
    }
};

