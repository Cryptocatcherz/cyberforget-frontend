import { api } from './authService';
import { ENDPOINTS } from '../config/endpoints';

class SubscriptionService {
    async getSubscriptionStatus(userId) {
        try {
            const response = await api.get(`${ENDPOINTS.SUBSCRIPTION.STATUS}/${userId}`);
            return response.data;
        } catch (error) {
            console.error('[SubscriptionService] Get subscription status failed:', error);
            throw error;
        }
    }

    async reactivateSubscription() {
        try {
            const response = await api.post(ENDPOINTS.SUBSCRIPTION.REACTIVATE);
            
            if (response.data?.message) {
                return response.data;
            }
            
            throw new Error('Failed to reactivate subscription');
        } catch (error) {
            console.error('[SubscriptionService] Reactivate subscription failed:', error);
            throw error;
        }
    }

    async sendReengagementEmail(userId) {
        try {
            const response = await api.post(ENDPOINTS.SUBSCRIPTION.SEND_REENGAGEMENT, { userId });
            
            if (response.data?.message) {
                return response.data;
            }
            
            throw new Error('Failed to send re-engagement email');
        } catch (error) {
            console.error('[SubscriptionService] Send re-engagement email failed:', error);
            throw error;
        }
    }

    async sendTrialWarning(userId, daysLeft) {
        try {
            const response = await api.post(ENDPOINTS.SUBSCRIPTION.SEND_TRIAL_WARNING, { 
                userId, 
                daysLeft 
            });
            
            if (response.data?.message) {
                return response.data;
            }
            
            throw new Error('Failed to send trial warning');
        } catch (error) {
            console.error('[SubscriptionService] Send trial warning failed:', error);
            throw error;
        }
    }
}

const subscriptionService = new SubscriptionService();
export default subscriptionService;