import api from './apiService';

// Feature Toggle Service - Direct API integration with Prisma backend

class FeatureToggleService {
    constructor() {
        this.defaultToggles = {
            multi_factor_auth: false,
            role_based_access: false,
            monitoring_verification: false,
            data_leak_notification: false
        };
    }

    // Get feature toggles for user
    async getFeatureToggles(userId) {
        try {
            const response = await api.get('/user-features/toggles');
            return {
                success: true,
                data: response.data.data || this.defaultToggles
            };
        } catch (error) {
            console.error('[FeatureToggleService] Get toggles failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message,
                data: this.defaultToggles
            };
        }
    }

    // Update a single feature toggle for user
    async updateFeatureToggle(toggleName, value, userId) {
        try {
            const response = await api.post('/user-features/toggle', {
                toggleName,
                value
            });
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('[FeatureToggleService] Update toggle failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message
            };
        }
    }

    // Bulk update feature toggles for user
    async bulkUpdateFeatureToggles(toggles, userId) {
        try {
            const response = await api.patch('/user-features/toggles', toggles);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('[FeatureToggleService] Bulk update failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message
            };
        }
    }

    // Subscribe to real-time feature toggle changes (WebSocket-based)
    subscribeToFeatureToggles(userId, callback) {
        // Real-time updates handled by WebSocket manager
        console.log('[FeatureToggleService] Real-time subscriptions handled by WebSocket');
        return null;
    }

    // Unsubscribe from real-time updates
    unsubscribe(subscription) {
        // No-op since we're using WebSocket manager
        console.log('[FeatureToggleService] Unsubscribe handled by WebSocket manager');
    }
}

// Create singleton instance
const featureToggleService = new FeatureToggleService();

export default featureToggleService;