import api from './apiService';

class UserFeatureService {
  constructor() {
    this.baseUrl = '/user-features';
  }

  /**
   * Get user's feature toggles
   */
  async getFeatureToggles() {
    try {
      const response = await api.get(`${this.baseUrl}/toggles`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('[UserFeatureService] Get feature toggles failed:', error);
      return { success: false, error: error.response?.data?.error?.message || error.message };
    }
  }

  /**
   * Update user's feature toggles (bulk update)
   */
  async updateFeatureToggles(toggles) {
    try {
      const response = await api.patch(`${this.baseUrl}/toggles`, toggles);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('[UserFeatureService] Update feature toggles failed:', error);
      return { success: false, error: error.response?.data?.error?.message || error.message };
    }
  }

  /**
   * Update single feature toggle
   */
  async updateFeatureToggle(toggleName, value) {
    try {
      const response = await api.post(`${this.baseUrl}/toggle`, {
        toggleName,
        value
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('[UserFeatureService] Update feature toggle failed:', error);
      return { success: false, error: error.response?.data?.error?.message || error.message };
    }
  }

  /**
   * Reset feature toggles to defaults
   */
  async resetFeatureToggles() {
    try {
      const response = await api.post(`${this.baseUrl}/reset`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('[UserFeatureService] Reset feature toggles failed:', error);
      return { success: false, error: error.response?.data?.error?.message || error.message };
    }
  }


  /**
   * Convenience methods for specific toggles
   */
  async enableMultiFactorAuth() {
    return this.updateFeatureToggle('multiFactorAuth', true);
  }

  async disableMultiFactorAuth() {
    return this.updateFeatureToggle('multiFactorAuth', false);
  }

  async enableRoleBasedAccess() {
    return this.updateFeatureToggle('roleBasedAccess', true);
  }

  async disableRoleBasedAccess() {
    return this.updateFeatureToggle('roleBasedAccess', false);
  }

  async enableMonitoringVerification() {
    return this.updateFeatureToggle('monitoringVerification', true);
  }

  async disableMonitoringVerification() {
    return this.updateFeatureToggle('monitoringVerification', false);
  }

  async enableDataLeakNotification() {
    return this.updateFeatureToggle('dataLeakNotification', true);
  }

  async disableDataLeakNotification() {
    return this.updateFeatureToggle('dataLeakNotification', false);
  }
}

// Create a singleton instance
const userFeatureService = new UserFeatureService();

export default userFeatureService;