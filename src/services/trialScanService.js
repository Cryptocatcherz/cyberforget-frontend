import api from './apiService';

class TrialScanService {
  constructor() {
    this.baseUrl = '/trial-scans';
  }

  /**
   * Get user's scan history
   */
  async getScanHistory(limit = 10, offset = 0) {
    try {
      const response = await api.get(`${this.baseUrl}/sessions`, {
        params: { limit, offset }
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('[TrialScanService] Get scan history failed:', error);
      return { success: false, error: error.response?.data?.error?.message || error.message };
    }
  }

  /**
   * Create new scan session
   */
  async createScan(scanData) {
    try {
      const response = await api.post(`${this.baseUrl}/sessions`, scanData);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('[TrialScanService] Create scan failed:', error);
      return { success: false, error: error.response?.data?.error?.message || error.message };
    }
  }

  /**
   * Update scan session
   */
  async updateScan(scanId, updates) {
    try {
      const response = await api.patch(`${this.baseUrl}/sessions/${scanId}`, updates);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('[TrialScanService] Update scan failed:', error);
      return { success: false, error: error.response?.data?.error?.message || error.message };
    }
  }

  /**
   * Start a real scan with SitescanV2
   */
  async startRealScan(userData) {
    try {
      const response = await api.post(`${this.baseUrl}/real-scan`, { userData });
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('[TrialScanService] Start real scan failed:', error);
      return { success: false, error: error.response?.data?.error?.message || error.message };
    }
  }

  /**
   * Get threats for a scan session
   */
  async getScanThreats(scanSessionId) {
    try {
      const response = await api.get(`${this.baseUrl}/sessions/${scanSessionId}/threats`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('[TrialScanService] Get scan threats failed:', error);
      return { success: false, error: error.response?.data?.error?.message || error.message };
    }
  }

  /**
   * Create new threat
   */
  async createThreat(threatData) {
    try {
      const response = await api.post(`${this.baseUrl}/threats`, threatData);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('[TrialScanService] Create threat failed:', error);
      return { success: false, error: error.response?.data?.error?.message || error.message };
    }
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    try {
      const response = await api.get(`${this.baseUrl}/stats`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('[TrialScanService] Get dashboard stats failed:', error);
      return { success: false, error: error.response?.data?.error?.message || error.message };
    }
  }

  /**
   * Legacy compatibility methods (for smooth transition)
   */
  async getScanHistory_Legacy(userId) {
    return this.getScanHistory();
  }

  async createScan_Legacy(scanData) {
    return this.createScan(scanData);
  }

  async updateScan_Legacy(scanId, updates) {
    return this.updateScan(scanId, updates);
  }

  async getDashboardStats_Legacy(userId) {
    return this.getDashboardStats();
  }
}

// Create a singleton instance
const trialScanService = new TrialScanService();

export default trialScanService;