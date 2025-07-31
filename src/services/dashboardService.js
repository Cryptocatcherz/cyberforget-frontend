import api from './apiService';

/**
 * Dashboard Service - Direct API integration with Prisma backend
 */
class DashboardService {
    async getDashboardData() {
        return this.getDashboardStats();
    }

    async getDashboardStats() {
        try {
            const response = await api.get('/users/stats');
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('[DashboardService] Get stats failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message
            };
        }
    }

    async getThreatData() {
        try {
            const response = await api.get('/threats');
            return {
                success: true,
                data: response.data.data || []
            };
        } catch (error) {
            console.error('[DashboardService] Get threats failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message,
                data: []
            };
        }
    }

    async getScanHistory() {
        try {
            const response = await api.get('/scans');
            return {
                success: true,
                data: response.data.data || []
            };
        } catch (error) {
            console.error('[DashboardService] Get scan history failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message,
                data: []
            };
        }
    }

    async getRemovalRequests() {
        try {
            const response = await api.get('/removal-requests');
            return {
                success: true,
                data: response.data.data || []
            };
        } catch (error) {
            console.error('[DashboardService] Get removal requests failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message,
                data: []
            };
        }
    }

    async triggerScan(scanData) {
        try {
            const response = await api.post('/scans', scanData);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('[DashboardService] Trigger scan failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message
            };
        }
    }
}

const dashboardService = new DashboardService();
export default dashboardService; 