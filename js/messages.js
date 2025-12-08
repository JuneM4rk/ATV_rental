/**
 * ATV Rental System - User-Friendly Messages
 * Centralized message configuration
 */

const Messages = {
    // Authentication Messages
    auth: {
        loginSuccess: 'Welcome back! Redirecting to dashboard...',
        loginFailed: 'Invalid email/username or password. Please try again.',
        loginNotVerified: 'Please verify your email before logging in. Check your inbox for the verification link.',
        loginError: 'An error occurred during login. Please try again.',
        
        registerSuccess: 'Account created successfully! Please check your email to verify your account.',
        registerFailed: 'Registration failed. Please check your information and try again.',
        registerEmailExists: 'This email is already registered. Please login or use a different email.',
        registerUsernameExists: 'This username is already taken. Please choose another one.',
        
        logoutSuccess: 'You have been logged out successfully.',
        
        verifySuccess: 'Email verified successfully! You can now login to your account.',
        verifyFailed: 'Verification failed. The link may be invalid or expired. Please request a new verification email.',
        verifyExpired: 'This verification link has expired. Please register again or contact support.',
        
        passwordResetRequestSent: 'If the email exists, a password reset link has been sent to your inbox.',
        passwordResetSuccess: 'Password reset successfully! Redirecting to login...',
        passwordResetFailed: 'Password reset failed. The link may be invalid or expired.',
        passwordResetExpired: 'This reset link has expired. Please request a new password reset.',
        
        passwordChangeSuccess: 'Password changed successfully!',
        passwordChangeFailed: 'Failed to change password. Please check your current password.',
        passwordMismatch: 'New passwords do not match. Please try again.',
        passwordIncorrect: 'Current password is incorrect.',
        passwordWeak: 'Password must be at least 8 characters long.',
    },
    
    // Profile Messages
    profile: {
        updateSuccess: 'Profile updated successfully!',
        updateFailed: 'Failed to update profile. Please try again.',
        avatarUploadSuccess: 'Avatar uploaded successfully!',
        avatarUploadFailed: 'Failed to upload avatar. Please ensure the file is an image (JPG, PNG, GIF).',
        avatarUploadTooLarge: 'Image file is too large. Maximum size is 2MB.',
    },
    
    // ATV Messages
    atv: {
        loadFailed: 'Failed to load ATVs. Please refresh the page.',
        createSuccess: 'ATV added successfully!',
        createFailed: 'Failed to add ATV. Please check all fields and try again.',
        updateSuccess: 'ATV updated successfully!',
        updateFailed: 'Failed to update ATV. Please try again.',
        deleteSuccess: 'ATV deleted successfully!',
        deleteFailed: 'Failed to delete ATV. This ATV may have active rentals.',
        deleteWithRentals: 'Cannot delete ATV with active rentals. Complete or cancel all rentals first.',
        notFound: 'ATV not found.',
        notAvailable: 'This ATV is not available for rental at the moment.',
        alreadyBooked: 'This ATV is already booked for the selected time period.',
    },
    
    // Rental Messages
    rental: {
        loadFailed: 'Failed to load rentals. Please refresh the page.',
        createSuccess: 'Rental request submitted successfully! You will be notified once it\'s approved.',
        createFailed: 'Failed to submit rental request. Please try again.',
        updateStatusSuccess: 'Rental status updated successfully!',
        updateStatusFailed: 'Failed to update rental status. Please try again.',
        requestReturnSuccess: 'Return request submitted. Please wait for manager confirmation.',
        requestReturnFailed: 'Failed to submit return request. Please try again.',
        cannotRequestReturn: 'You can only request return when rental status is "rented".',
        notFound: 'Rental not found.',
        invalidStatusChange: 'Cannot change status. Invalid status transition.',
        overlap: 'This ATV is already booked for the selected time period.',
    },
    
    // User Management Messages (Admin)
    user: {
        loadFailed: 'Failed to load users. Please refresh the page.',
        updateSuccess: 'User updated successfully!',
        updateFailed: 'Failed to update user. Please try again.',
        deleteSuccess: 'User deleted successfully!',
        deleteFailed: 'Failed to delete user. This user may have active rentals.',
        deleteWithRentals: 'Cannot delete user with active rentals. Complete or cancel all rentals first.',
        deleteSelf: 'You cannot delete your own account.',
        notFound: 'User not found.',
        cannotChangeOwnRole: 'You cannot change your own role.',
    },
    
    // General Messages
    general: {
        loading: 'Loading...',
        saving: 'Saving...',
        processing: 'Processing...',
        success: 'Operation completed successfully!',
        error: 'An error occurred. Please try again.',
        networkError: 'Network error. Please check your internet connection.',
        unauthorized: 'You are not authorized to perform this action.',
        notAuthenticated: 'Please login to continue.',
        sessionExpired: 'Your session has expired. Please login again.',
        validationError: 'Please check the form for errors.',
        confirmDelete: 'Are you sure you want to delete this item? This action cannot be undone.',
        noData: 'No data available.',
        searchNoResults: 'No results found. Try adjusting your search.',
    },
    
    /**
     * Get a formatted error message based on API error response
     */
    getErrorMessage(error) {
        if (error.message) {
            // Check for specific error messages
            const message = error.message.toLowerCase();
            
            if (message.includes('invalid credential') || message.includes('invalid email')) {
                return this.auth.loginFailed;
            }
            if (message.includes('not verified') || message.includes('verify')) {
                return this.auth.loginNotVerified;
            }
            if (message.includes('email exists') || message.includes('email has already been taken')) {
                return this.auth.registerEmailExists;
            }
            if (message.includes('username exists') || message.includes('username has already been taken')) {
                return this.auth.registerUsernameExists;
            }
            if (message.includes('password') && message.includes('incorrect')) {
                return this.auth.passwordIncorrect;
            }
            if (message.includes('expired')) {
                if (message.includes('reset')) {
                    return this.auth.passwordResetExpired;
                }
                return this.auth.verifyExpired;
            }
            if (message.includes('unauthorized') || error.status === 401) {
                return this.general.sessionExpired;
            }
            if (error.status === 403) {
                return this.general.unauthorized;
            }
            if (error.status === 404) {
                return this.general.notFound || 'Item not found.';
            }
            if (error.status === 422) {
                return this.general.validationError;
            }
            if (error.status === 0 || error.status >= 500) {
                return this.general.networkError;
            }
            
            return error.message;
        }
        
        return this.general.error;
    },
    
    /**
     * Get a success message based on action type
     */
    getSuccessMessage(action, type = 'general') {
        const messages = this[type] || {};
        const key = action + 'Success';
        return messages[key] || this.general.success;
    }
};

