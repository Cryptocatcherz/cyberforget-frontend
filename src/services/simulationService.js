import { useSocket } from '../hooks/useSocket.js'

class SimulationService {
    constructor() {
        this.isSimulating = false;
        this.currentProgress = 0;
        this.currentSite = null;
        this.sitesScanned = 0;
        this.potentialThreats = 0;
        this.activeMatches = 0;
        this.totalMatches = 0;
        this.listeners = new Set();
        this.cleanupHandlers = [];
        this.isInitialized = false;
        this.setupSocketListeners();
        this.lastScannedSite = null;
    }

    setupSocketListeners() {
        // We'll set up the listeners when they're needed
        this.cleanupHandlers = [];
    }

    registerSocketEvents() {
        if (this.cleanupHandlers.length > 0) {
            console.log('[Simulation Service] Socket events already registered');
            return;
        }

        console.log('[Simulation Service] Registering socket events');

        // Register all event handlers and store their cleanup functions
        this.cleanupHandlers = [
            useSocket.on('simulation_progress', (data) => this.handleProgress(data)),
            useSocket.on('simulation_complete', (data) => this.handleComplete(data)),
            useSocket.on('simulation_error', (error) => this.handleError(error))
        ];
    }

    cleanupSocketEvents() {
        console.log('[Simulation Service] Cleaning up socket events');
        this.cleanupHandlers.forEach(cleanup => cleanup());
        this.cleanupHandlers = [];
    }

    async initialize() {
        if (this.isInitialized) {
            console.log('[Simulation Service] Already initialized');
            return;
        }

        try {
            console.log('[Simulation Service] Initializing...');
            
            // Get token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token available');
            }

            // Connect socket
            const socket = await useSocket.connect(token);
            if (!socket) {
                throw new Error('Failed to initialize socket connection');
            }

            // Register socket events
            this.registerSocketEvents();

            this.isInitialized = true;
            console.log('[Simulation Service] Initialized successfully');
        } catch (error) {
            console.error('[Simulation Service] Initialization error:', error);
            this.isInitialized = false;
            throw error;
        }
    }

    async startSimulation() {
        try {
            if (this.isSimulating) {
                console.log('[Simulation Service] Simulation already in progress');
                return false;
            }

            console.log('[Simulation Service] Starting simulation');
            
            // Reset ALL state
            this.isSimulating = true;
            this.currentProgress = 0;
            this.currentSite = null;
            this.sitesScanned = 0;
            this.potentialThreats = 0;
            this.activeMatches = 0;
            this.totalMatches = 0;
            this.lastScannedSite = null;

            // Notify listeners of simulation start with ALL counters reset
            this._notifyListeners({
                type: 'simulation_start',
                data: {
                    isScanning: true,
                    progress: 0,
                    currentSite: null,
                    sitesScanned: 0,
                    potentialThreats: 0,
                    activeMatches: 0,
                    totalMatches: 0,
                    message: 'Starting simulation...',
                    currentStep: 'Preparing scan...'
                }
            });

            // Force an immediate update to ensure UI reflects reset state
            this._notifyListeners({
                type: 'simulation_progress',
                data: {
                    isScanning: true,
                    progress: 0,
                    currentSite: 'Initializing...',
                    sitesScanned: 0,
                    potentialThreats: 0,
                    activeMatches: 0,
                    totalMatches: 0,
                    message: 'Establishing secure connections',
                    currentStep: 'Preparing scan...',
                    stepStatus: 'In Progress'
                }
            });

            return true;
        } catch (error) {
            console.error('[Simulation Service] Error starting simulation:', error);
            this.isSimulating = false;
            this.handleError(error);
            return false;
        }
    }

    async stopSimulation() {
        if (!this.isSimulating) {
            console.log('[Simulation Service] No simulation in progress');
            return false;
        }

        try {
            console.log('[Simulation Service] Stopping simulation');
            
            // Reset simulation state completely
            this.isSimulating = false;
            this.currentProgress = 0;
            this.currentSite = null;
            this.sitesScanned = 0;
            this.potentialThreats = 0;
            this.activeMatches = 0;
            this.totalMatches = 0;
            this.lastScannedSite = null;

            // Notify listeners of simulation stop with reset counters
            this._notifyListeners({
                type: 'simulation_stop',
                data: {
                    isScanning: false,
                    currentSite: null,
                    sitesScanned: 0,
                    potentialThreats: 0,
                    activeMatches: 0,
                    totalMatches: 0,
                    message: 'Simulation stopped'
                }
            });

            return true;
        } catch (error) {
            console.error('[Simulation Service] Error stopping simulation:', error);
            this.handleError(error);
            return false;
        }
    }

    handleProgress(data) {
        if (!this.isSimulating) {
            console.log('[Simulation Service] Ignoring progress update - not simulating');
            // Start simulation if we receive progress but aren't simulating
            this.startSimulation().then(() => {
                this._handleProgressUpdate(data);
            });
            return;
        }

        this._handleProgressUpdate(data);
    }

    _handleProgressUpdate(data) {
        console.log('[Simulation Service] Progress update:', data);
        
        // Update state with proper validation
        this.currentProgress = Math.min(100, Math.max(0, data.progress || this.currentProgress));
        
        // Calculate step based on progress and status
        let currentStep = 'Preparing scan...';
        let stepStatus = data.status || 'In Progress';
        let lastScannedSite = this.lastScannedSite;
        
        // Check for new site in message or currentSite
        const newSiteMatch = (data.message || '').match(/Scanning\s+([A-Za-z0-9]+\.com)/i) ||
                           (data.currentSite || '').match(/([A-Za-z0-9]+\.com)/i);
        
        if (newSiteMatch && (!this.lastScannedSite || newSiteMatch[1] !== this.lastScannedSite)) {
            const newSite = newSiteMatch[1];
            console.log('[Simulation Service] New site detected:', newSite);
            
            // Increment counters
            this.sitesScanned++;
            
            // Generate random threats and matches for this site
            const newThreats = Math.floor(Math.random() * 5) + 1; // 1-5 new threats
            const newActiveMatches = Math.floor(Math.random() * newThreats); // 0 to newThreats active matches
            const newTotalMatches = newThreats + Math.floor(Math.random() * 3); // threats + 0-2 additional matches
            
            this.potentialThreats += newThreats;
            this.activeMatches += newActiveMatches;
            this.totalMatches += newTotalMatches;
            
            currentStep = `Scanning ${newSite}...`;
            lastScannedSite = newSite;
            this.lastScannedSite = newSite;
            this.currentSite = newSite;
        } else if (data.message === 'Establishing secure connections') {
            currentStep = 'Establishing secure connections';
            this.currentSite = 'Initializing...';
        } else if (data.message) {
            currentStep = data.message;
        } else {
            // Default progress-based steps
            if (this.currentProgress >= 75) {
                currentStep = 'Verifying data points...';
            } else if (this.currentProgress >= 50) {
                currentStep = 'Checking exposures...';
            } else if (this.currentProgress >= 25) {
                currentStep = 'Scanning data brokers...';
            }
        }

        // Notify listeners with validated data
        this._notifyListeners({
            type: 'simulation_progress',
            data: {
                isScanning: true,
                progress: this.currentProgress,
                currentSite: this.currentSite,
                sitesScanned: this.sitesScanned,
                potentialThreats: this.potentialThreats,
                activeMatches: this.activeMatches,
                totalMatches: this.totalMatches,
                lastScannedSite: lastScannedSite,
                currentStep,
                stepStatus,
                message: currentStep
            }
        });

        // Log current state for debugging
        console.log('[Simulation Service] Current state:', {
            progress: this.currentProgress,
            sitesScanned: this.sitesScanned,
            currentSite: this.currentSite,
            lastScannedSite: lastScannedSite,
            potentialThreats: this.potentialThreats,
            activeMatches: this.activeMatches,
            totalMatches: this.totalMatches,
            step: currentStep,
            status: stepStatus
        });
    }

    handleComplete(data) {
        console.log('[Simulation Service] Simulation complete:', data);
        
        this.isSimulating = false;
        this.currentProgress = 100;
        this.currentSite = null;

        this._notifyListeners({
            type: 'simulation_complete',
            data: {
                isScanning: false,
                progress: 100,
                currentSite: null,
                sitesScanned: this.sitesScanned,
                potentialThreats: this.potentialThreats,
                activeMatches: this.activeMatches,
                totalMatches: this.totalMatches,
                completedAt: data.completedAt || new Date().toISOString(),
                message: 'Simulation complete'
            }
        });
    }

    handleError(error) {
        console.error('[Simulation Service] Simulation error:', error);
        
        this.isSimulating = false;

        this._notifyListeners({
            type: 'simulation_error',
            data: {
                isScanning: false,
                error: error.message || 'Unknown error occurred',
                message: `Error: ${error.message || 'Unknown error occurred'}`
            }
        });
    }

    addListener(listener) {
        console.log('[Simulation Service] Adding event listener');
        this.listeners.add(listener);
        return () => {
            console.log('[Simulation Service] Removing event listener');
            this.listeners.delete(listener);
        };
    }

    _notifyListeners(event) {
        console.log('[Simulation Service] Notifying listeners:', event);
        this.listeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('[Simulation Service] Error in listener:', error);
            }
        });
    }

    getState() {
        return {
            isScanning: this.isSimulating,
            progress: this.currentProgress,
            currentSite: this.currentSite,
            sitesScanned: this.sitesScanned,
            potentialThreats: this.potentialThreats,
            activeMatches: this.activeMatches,
            totalMatches: this.totalMatches
        };
    }
}

const simulationService = new SimulationService();
export default simulationService; 