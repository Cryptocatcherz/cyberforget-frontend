import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SCAN_DURATION = 30000;
const UPDATE_INTERVAL = 1000;

const dataBrokerSites = [
    "FastPeopleSearch.com",
    "TruePeopleSearch.com",
    "Spokeo.com",
    "WhitePages.com",
    "Intelius.com",
    "PeopleFinders.com",
    "BeenVerified.com",
    "InstantCheckmate.com",
    "USSearch.com",
    "PeopleLooker.com"
];

// Scanning phases for each site
const scanPhases = [
    "Initializing scan for",
    "Checking records on",
    "Analyzing data from",
    "Verifying matches on",
    "Cross-referencing with",
    "Processing results from",
    "Validating findings on"
];

const useSimulatedScan = (setDashboardData, setDataBrokerList) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const shouldSimulateScan = searchParams.get('dashboard') === 'test';

    useEffect(() => {
        if (!shouldSimulateScan) return;

        let startTime = Date.now();
        let foundBrokers = [];
        let currentSiteIndex = 0;
        let currentPhaseIndex = 0;
        let phaseTimer = 0;
        let siteTimer = 0;

        const scanInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min((elapsedTime / SCAN_DURATION) * 100, 100);
            
            // Increment timers
            phaseTimer += UPDATE_INTERVAL;
            siteTimer += UPDATE_INTERVAL;

            // Change phase every 3 seconds
            if (phaseTimer >= 3000) {
                currentPhaseIndex = (currentPhaseIndex + 1) % scanPhases.length;
                phaseTimer = 0;
            }

            // Change site every 7 seconds
            if (siteTimer >= 7000) {
                currentSiteIndex = (currentSiteIndex + 1) % dataBrokerSites.length;
                siteTimer = 0;
            }

            const currentSite = dataBrokerSites[currentSiteIndex];
            const currentPhase = scanPhases[currentPhaseIndex];
            
            // Randomly find data brokers (20% chance every second)
            if (progress > 10 && Math.random() < 0.2) {
                const newBroker = dataBrokerSites[foundBrokers.length];
                if (newBroker && !foundBrokers.includes(newBroker)) {
                    foundBrokers.push(newBroker);
                }
            }

            // Update dashboard data with current progress
            setDashboardData(prevData => ({
                ...prevData,
                stats: {
                    ...prevData.stats,
                    isScanning: true,
                    sitesScanned: Math.floor((progress / 100) * 42),
                    profilesFound: foundBrokers.length,
                    totalMatches: Math.floor(foundBrokers.length * 1.5),
                    progress: Math.floor(progress),
                    currentSite: `${currentPhase} ${currentSite}...`,
                    dataBrokerExposure: Math.min(Math.floor(progress), 75)
                }
            }));

            // Update data broker list
            setDataBrokerList(
                foundBrokers.map(broker => ({
                    name: broker,
                    status: "Found",
                    isNew: true
                }))
            );

            if (progress >= 100) {
                clearInterval(scanInterval);
                setDashboardData(prevData => ({
                    ...prevData,
                    stats: {
                        ...prevData.stats,
                        isScanning: false,
                        sitesScanned: 42,
                        profilesFound: foundBrokers.length,
                        totalMatches: Math.floor(foundBrokers.length * 1.5),
                        progress: 100,
                        currentSite: "Scan complete ✓",
                        dataBrokerExposure: 75
                    }
                }));
            }
        }, UPDATE_INTERVAL);

        return () => clearInterval(scanInterval);
    }, [shouldSimulateScan, setDashboardData, setDataBrokerList]);
};

export default useSimulatedScan;
