/**
 * Formats the list of data brokers.
 *
 * @param {Array} brokers - Array of broker names.
 * @param {string|null} currentSite - The currently active site.
 * @returns {Array} Formatted list of brokers with status.
 */
// src/utils/index.js
export const getScreenshotUrl = (url) => {
    return `https://image.thum.io/get/auth/YOUR_AUTH_KEY/width/800/crop/600/${encodeURIComponent(url)}`;
  };
export const formatDataBrokerList = (brokers, currentSite) => {
    return brokers.map(broker => ({
        name: broker,
        status: broker === currentSite ? 'active' : 'inactive',
    }));
};
