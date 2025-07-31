// StatusBarComponent.js

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './StatusBarComponent.css';

const StatusBarComponent = ({ sitesScanned, totalSites = 176, lastScanTime, isScanning, nextScanTime, matchesFound = 0 }) => {
    const [animatedPercentage, setAnimatedPercentage] = useState(0);
    const sitesScannedNum = Number(sitesScanned) || 0;
    const totalSitesNum = Number(totalSites) || 1;
    const percentage = Math.min((sitesScannedNum / totalSitesNum) * 100, 100);

    useEffect(() => {
        const animationDuration = 1000; // 1 second
        const steps = 60;
        const increment = percentage / steps;
        let currentPercentage = 0;

        const timer = setInterval(() => {
            currentPercentage += increment;
            if (currentPercentage >= percentage) {
                clearInterval(timer);
                setAnimatedPercentage(percentage);
            } else {
                setAnimatedPercentage(currentPercentage);
            }
        }, animationDuration / steps);

        return () => clearInterval(timer);
    }, [percentage]);

    const getStatusMessage = () => {
        if (isScanning) return 'Scanning in progress...';
        if (sitesScannedNum >= totalSitesNum) return 'Scanning completed.';
        if (sitesScannedNum > 0) return 'Scan paused.';
        return 'Ready to start...';
    };

    const getStatusColor = () => {
        if (isScanning) return 'text-blue-500';
        if (sitesScannedNum >= totalSitesNum) return 'text-green-500';
        if (sitesScannedNum > 0) return 'text-yellow-500';
        return 'text-gray-500';
    };

    return (
        <div className={`status-bar-container bg-white shadow-lg rounded-lg p-4 ${isScanning ? 'border-blue-500 border-2' : ''}`}>
            <h2 className="status-bar-title text-xl font-bold mb-2">Scan Progress</h2>
            <div className="progress-bar-container bg-gray-200 rounded-full h-4 mb-4">
                <div
                    className="progress-bar bg-blue-500 rounded-full h-4 transition-all duration-500 ease-out"
                    style={{ width: `${animatedPercentage.toFixed(2)}%` }}
                ></div>
            </div>
            <div className="progress-text text-center font-semibold mb-2">
                {sitesScannedNum} / {totalSitesNum} Sites Scanned ({animatedPercentage.toFixed(2)}%)
            </div>
            <div className="status-details flex justify-between items-center">
                <div className={`status-text ${getStatusColor()} font-medium`}>
                    <span className="mr-2">●</span>{getStatusMessage()}
                </div>
                {nextScanTime && (
                    <div className="scan-times text-sm text-gray-600">
                        Next Scan: {new Date(nextScanTime).toLocaleString()}
                    </div>
                )}
            </div>
            {lastScanTime && (
                <div className="last-scan-time text-xs text-gray-500 mt-2">
                    Last Scan: {new Date(lastScanTime).toLocaleString()}
                </div>
            )}
            <div className="matches-found text-center font-semibold mt-2">
                Matches found: {matchesFound}
            </div>
        </div>
    );
};

StatusBarComponent.propTypes = {
    sitesScanned: PropTypes.number.isRequired,
    totalSites: PropTypes.number,
    lastScanTime: PropTypes.string,
    isScanning: PropTypes.bool,
    nextScanTime: PropTypes.string,
    matchesFound: PropTypes.number
};

export default StatusBarComponent;
