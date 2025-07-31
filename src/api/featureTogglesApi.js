// FeatureTogglesApi.js

import axios from 'axios';

const FEATURE_TOGGLES_API = process.env.NODE_ENV === 'production'
  ? 'https://cleandata-test-app-961214fcb16c.herokuapp.com/api/feature-toggles'
  : 'http://localhost:5002/api/feature-toggles';

export const getFeatureToggles = async (token) => {
    try {
        console.log('Fetching feature toggles with token:', token);
        const response = await axios.get(FEATURE_TOGGLES_API, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Feature toggles fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching feature toggles:', error.response?.data || error.message);
        return null;
    }
};

export const updateFeatureToggle = async (token, name, value) => {
    try {
        console.log('Updating feature toggle:', { name, value });
        const response = await axios.put(FEATURE_TOGGLES_API, { [name]: value }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        console.log('Feature toggle updated successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating feature toggle:', error.response?.data || error.message);
        return null;
    }
};
