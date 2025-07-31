import api from './apiService';

// Scan Service - Direct API integration with Prisma backend

class ScanService {
    async startScan(scanData) {
        try {
            const response = await api.post('/scans', scanData);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('[ScanService] Start scan failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message
            };
        }
    }

    async getScanStatus(scanId) {
        try {
            const response = await api.get(`/scans/${scanId}`);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('[ScanService] Get scan status failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message
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
            console.error('[ScanService] Get scan history failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message,
                data: []
            };
        }
    }

    async cancelScan(scanId) {
        try {
            const response = await api.patch(`/scans/${scanId}/cancel`);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('[ScanService] Cancel scan failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message
            };
        }
    }

    async retryScan(scanId) {
        try {
            const response = await api.post(`/scans/${scanId}/retry`);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('[ScanService] Retry scan failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message
            };
        }
    }

    // Update scan result
    async updateScanResult(scanId, resultId, updates) {
        try {
            const response = await api.patch(`/scans/${scanId}/results/${resultId}`, updates);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('[ScanService] Update scan result failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message
            };
        }
    }
}

// Create singleton instance
const scanService = new ScanService();
export default scanService; 