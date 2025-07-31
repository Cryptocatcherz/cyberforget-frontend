import { getApiUrl, environment, devLog, isProductionMode } from '../config/environment';
import peopleSearchSites from '../data/peopleSearchSites';

class AutoScanService {
    constructor() {
        this.isScanning = false;
        this.scanInterval = null;
        this.sites = [];
        this.currentSiteIndex = 0;
        this.scanResults = [];
        this.subscribers = new Set();
        
        // Configuration
        this.config = {
            enabled: true, // Always enable hourly scans
            intervalHours: 1, // Run every hour
            maxConcurrentScans: 5,
            retryAttempts: 2,
            timeoutMs: 30000,
            scheduleOnHour: true // Run at the start of every hour
        };
        
        // Load all sites from the predefined list
        this.sites = peopleSearchSites.map((site, index) => ({
            id: index + 1,
            name: site,
            url: `https://${site}`,
            category: this.categorizeSite(site)
        }));
        
        devLog(`AutoScanService initialized with ${this.sites.length} sites:`, this.config);
    }

    // Categorize site based on its domain name
    categorizeSite(siteName) {
        const name = siteName.toLowerCase();
        if (name.includes('background') || name.includes('check') || name.includes('record')) {
            return 'background_check';
        }
        if (name.includes('people') || name.includes('search') || name.includes('directory')) {
            return 'people_search';
        }
        if (name.includes('public') || name.includes('records') || name.includes('info')) {
            return 'public_records';
        }
        if (name.includes('phone') || name.includes('address') || name.includes('lookup')) {
            return 'phone_address';
        }
        return 'other';
    }

    // Subscribe to scan updates
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    // Notify all subscribers
    notify(data) {
        this.subscribers.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('Error in scan subscriber callback:', error);
            }
        });
    }

    // Get sites (already loaded in constructor)
    getSites() {
        devLog(`Using ${this.sites.length} predefined sites for scanning`);
        
        this.notify({
            type: 'sites_loaded',
            sites: this.sites,
            count: this.sites.length
        });

        return this.sites;
    }

    // Start automatic scanning
    async startAutoScan() {
        if (!this.config.enabled) {
            devLog('Auto-scan disabled in configuration');
            return;
        }

        if (this.isScanning) {
            devLog('Auto-scan already running');
            return;
        }

        devLog('Starting auto-scan service');
        this.isScanning = true;

        // Sites are already loaded in constructor
        this.getSites();

        if (this.sites.length === 0) {
            console.warn('No sites available for scanning');
            this.isScanning = false;
            return;
        }

        this.notify({
            type: 'scan_started',
            totalSites: this.sites.length,
            intervalHours: this.config.intervalHours
        });

        // Run initial scan cycle
        this.runScanCycle();

        // Schedule scans to run at the start of every hour
        this.scheduleHourlyScans();

        devLog(`Auto-scan started - will run ${this.sites.length} sites every hour at minute 0`);
    }

    // Schedule scans to run precisely at the start of every hour
    scheduleHourlyScans() {
        const now = new Date();
        const nextHour = new Date(now);
        nextHour.setHours(now.getHours() + 1, 0, 0, 0); // Next hour at minute 0
        
        const msUntilNextHour = nextHour.getTime() - now.getTime();
        
        devLog(`Next hourly scan scheduled in ${Math.round(msUntilNextHour / 1000 / 60)} minutes`);

        // Schedule the first scan at the start of the next hour
        setTimeout(() => {
            if (this.isScanning) {
                this.runScanCycle();
                
                // Then set up interval to run every hour
                this.scanInterval = setInterval(() => {
                    if (this.isScanning) {
                        this.runScanCycle();
                    }
                }, 60 * 60 * 1000); // 1 hour = 3,600,000 ms
            }
        }, msUntilNextHour);
    }

    // Stop automatic scanning
    stopAutoScan() {
        if (!this.isScanning) {
            return;
        }

        devLog('Stopping auto-scan service');
        this.isScanning = false;

        if (this.scanInterval) {
            clearInterval(this.scanInterval);
            this.scanInterval = null;
        }

        this.notify({
            type: 'scan_stopped'
        });
    }

    // Run a complete scan cycle through all sites
    async runScanCycle() {
        if (!this.isScanning || this.sites.length === 0) {
            return;
        }

        const cycleId = Date.now();
        devLog(`🔄 Starting hourly scan cycle ${cycleId} for ${this.sites.length} sites`);
        
        this.notify({
            type: 'cycle_started',
            cycleId,
            totalSites: this.sites.length,
            timestamp: new Date().toISOString(),
            phases: ['Initializing', 'Connecting', 'Searching', 'Analyzing', 'Verifying']
        });

        const startTime = Date.now();
        let successCount = 0;
        let errorCount = 0;

        // 5-Phase Scanning Process
        const phases = [
            { name: 'Initializing', duration: 10, description: 'Setting up scan parameters and security protocols' },
            { name: 'Connecting', duration: 15, description: 'Establishing secure connections to data broker networks' },
            { name: 'Searching', duration: 20, description: 'Scanning data broker databases for matches' },
            { name: 'Analyzing', duration: 10, description: 'Processing and analyzing found data points' },
            { name: 'Verifying', duration: 5, description: 'Verifying results and preparing final report' }
        ];

        // Execute each phase
        for (const phase of phases) {
            if (!this.isScanning) break;

            this.notify({
                type: 'phase_started',
                cycleId,
                phase: phase.name,
                description: phase.description,
                duration: phase.duration,
                timestamp: new Date().toISOString()
            });

            // Process sites during this phase
            await this.processPhase(phase, cycleId);
            
            this.notify({
                type: 'phase_completed',
                cycleId,
                phase: phase.name,
                timestamp: new Date().toISOString()
            });
        }

        // Process all sites in batches during the main scanning phases
        if (this.isScanning) {
            const batchSize = this.config.maxConcurrentScans;
            
            for (let i = 0; i < this.sites.length; i += batchSize) {
                if (!this.isScanning) break;

                const batch = this.sites.slice(i, i + batchSize);
                const batchPromises = batch.map(site => this.scanSite(site, i + batch.indexOf(site), cycleId));

                try {
                    const results = await Promise.allSettled(batchPromises);
                    
                    results.forEach((result, index) => {
                        if (result.status === 'fulfilled') {
                            successCount++;
                        } else {
                            errorCount++;
                            devLog(`Scan failed for site ${batch[index].name}:`, result.reason);
                        }
                    });

                    // Small delay between batches to avoid overwhelming
                    if (i + batchSize < this.sites.length) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                } catch (error) {
                    console.error('Error processing batch:', error);
                    errorCount += batch.length;
                }
            }
        }

        const duration = Date.now() - startTime;
        
        this.notify({
            type: 'cycle_completed',
            cycleId,
            duration,
            successCount,
            errorCount,
            totalSites: this.sites.length,
            timestamp: new Date().toISOString(),
            nextScan: new Date(Date.now() + 60 * 60 * 1000).toISOString()
        });

        devLog(`✅ Hourly scan cycle ${cycleId} completed: ${successCount} successful, ${errorCount} errors, ${Math.round(duration/1000)}s duration`);
    }

    // Process a specific scanning phase
    async processPhase(phase, cycleId) {
        const phaseStart = Date.now();
        
        // Simulate phase processing with realistic timing
        await new Promise(resolve => setTimeout(resolve, phase.duration * 100)); // Scale down for demo
        
        const phaseDuration = Date.now() - phaseStart;
        
        this.notify({
            type: 'phase_progress',
            cycleId,
            phase: phase.name,
            duration: phaseDuration,
            sitesProcessed: Math.floor(this.sites.length * (phase.duration / 60)), // Proportional
            timestamp: new Date().toISOString()
        });
    }

    // Scan a single site
    async scanSite(site, index, cycleId) {
        if (!this.isScanning) {
            throw new Error('Scanning was stopped');
        }

        const startTime = Date.now();
        
        this.notify({
            type: 'site_scan_started',
            cycleId,
            site,
            index,
            totalSites: this.sites.length,
            progress: ((index + 1) / this.sites.length) * 100
        });

        try {
            // Simulate scanning by checking site responsiveness
            const simulatedScan = await this.simulateSiteScan(site);
            const duration = Date.now() - startTime;

            const scanResult = {
                cycleId,
                site,
                success: simulatedScan.accessible,
                result: simulatedScan,
                duration,
                timestamp: new Date().toISOString()
            };

            this.scanResults.push(scanResult);

            this.notify({
                type: 'site_scan_completed',
                ...scanResult,
                index,
                progress: ((index + 1) / this.sites.length) * 100
            });

            return scanResult;
        } catch (error) {
            const duration = Date.now() - startTime;
            
            const scanResult = {
                cycleId,
                site,
                success: false,
                error: error.message,
                duration,
                timestamp: new Date().toISOString()
            };

            this.scanResults.push(scanResult);

            this.notify({
                type: 'site_scan_failed',
                ...scanResult,
                index,
                progress: ((index + 1) / this.sites.length) * 100
            });

            throw error;
        }
    }

    // Simulate scanning a site to check if it's accessible
    async simulateSiteScan(site) {
        try {
            // Simulate scan duration based on site name
            const scanDelay = 200 + Math.random() * 300; // 200-500ms
            await new Promise(resolve => setTimeout(resolve, scanDelay));

            // Simulate results - most sites should be "accessible" 
            const isAccessible = Math.random() > 0.1; // 90% success rate
            
            return {
                accessible: isAccessible,
                responseTime: Math.round(scanDelay),
                status: isAccessible ? 'active' : 'unavailable',
                category: site.category,
                lastChecked: new Date().toISOString(),
                findings: isAccessible ? {
                    dataFound: Math.random() > 0.7, // 30% chance of finding data
                    profileCount: Math.floor(Math.random() * 5),
                    removalRequired: Math.random() > 0.8 // 20% need removal
                } : null
            };
        } catch (error) {
            return {
                accessible: false,
                error: error.message,
                status: 'error',
                category: site.category,
                lastChecked: new Date().toISOString()
            };
        }
    }

    // Get scan statistics
    getStats() {
        const totalScans = this.scanResults.length;
        const successfulScans = this.scanResults.filter(r => r.success).length;
        const failedScans = totalScans - successfulScans;
        
        const lastScan = this.scanResults.length > 0 ? 
            this.scanResults[this.scanResults.length - 1].timestamp : null;

        return {
            isActive: this.isScanning,
            totalSites: this.sites.length,
            totalScans,
            successfulScans,
            failedScans,
            successRate: totalScans > 0 ? (successfulScans / totalScans) * 100 : 0,
            lastScan,
            nextScan: this.isScanning && this.scanInterval ? 
                new Date(Date.now() + (this.config.intervalHours * 60 * 60 * 1000)).toISOString() : null,
            config: this.config
        };
    }

    // Get recent scan results
    getRecentResults(limit = 10) {
        return this.scanResults
            .slice(-limit)
            .reverse(); // Most recent first
    }

    // Manual trigger for immediate scan
    async triggerManualScan() {
        devLog('Manual scan triggered');
        
        if (!this.isScanning) {
            await this.fetchSites();
        }

        this.notify({
            type: 'manual_scan_triggered'
        });

        await this.runScanCycle();
    }

    // Update configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        devLog('Auto-scan configuration updated:', this.config);
        
        this.notify({
            type: 'config_updated',
            config: this.config
        });

        // Restart scanning if it was active and interval changed
        if (this.isScanning && newConfig.intervalHours && this.scanInterval) {
            this.stopAutoScan();
            this.startAutoScan();
        }
    }
}

// Create singleton instance
const autoScanService = new AutoScanService();

export default autoScanService;