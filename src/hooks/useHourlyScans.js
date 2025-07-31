import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from './useSocket';

export const useHourlyScans = (userId) => {
  // States for hourly scan management
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSite, setCurrentSite] = useState(null);
  const [currentStage, setCurrentStage] = useState(null);
  const [error, setError] = useState(null);
  const [isManualScan, setIsManualScan] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [metrics, setMetrics] = useState({
    sitesScanned: 0,
    threatsFound: 0,
    totalMatches: 0,
    lastScanTime: null,
    nextScanTime: null
  });
  const [settings, setSettings] = useState({
    intervalMinutes: 60,
    enableNotifications: true,
    runDuringOffHours: true
  });

  // Use existing socket hook
  const { socket, isConnected, currentRoom } = useSocket(userId);
  
  // Refs for cleanup
  const eventHandlersSetup = useRef(false);

  // Setup event listeners
  useEffect(() => {
    if (!socket || !isConnected || eventHandlersSetup.current) return;

    console.log('🔌 Setting up hourly scan event listeners');

    // Hourly scan events
    socket.on('hourly_scan_started', (data) => {
      console.log('🟢 Hourly scan started:', data);
      setIsActive(true);
      setProgress(0);
      setCurrentSite(null);
      setCurrentStage('Initializing');
      setError(null);
      setIsManualScan(data.manual || false);
    });

    socket.on('hourly_scan_progress', (data) => {
      console.log('📊 Hourly scan progress:', data);
      setProgress(data.progress || 0);
      setCurrentSite(data.currentSite || null);
      setCurrentStage(data.currentStage || null);
      setMetrics(prev => ({
        ...prev,
        sitesScanned: data.sitesScanned || prev.sitesScanned,
        threatsFound: data.threatsFound || prev.threatsFound,
        totalMatches: data.totalMatches || prev.totalMatches,
        // Add stage-specific data
        stageIcon: data.stageIcon,
        stageDescription: data.stageDescription,
        stageIndex: data.stageIndex,
        totalStages: data.totalStages,
        stageDuration: data.stageDuration,
        siteIndex: data.siteIndex,
        totalSites: data.totalSites
      }));
    });

    // Listen for detailed stage progress
    socket.on('hourly_scan_stage_progress', (data) => {
      console.log('🔄 Stage progress:', data);
      setMetrics(prev => ({
        ...prev,
        stageProgress: data.stageProgress,
        timeRemaining: data.timeRemaining,
        stageIcon: data.stageIcon
      }));
    });

    // Listen for stage completion
    socket.on('hourly_scan_stage_complete', (data) => {
      console.log('✅ Stage complete:', data);
      // You can add visual feedback here for stage completion
    });

    socket.on('hourly_scan_completed', (data) => {
      console.log('✅ Hourly scan completed:', data);
      setIsActive(false);
      setProgress(100);
      setCurrentSite(null);
      setCurrentStage('Completed');
      setIsManualScan(false);
      
      // Update metrics and history
      const completedScan = {
        id: data.scanId || Date.now(),
        timestamp: new Date().toISOString(),
        duration: data.duration || 0,
        sitesScanned: data.sitesScanned || 0,
        threatsFound: data.threatsFound || 0,
        totalMatches: data.totalMatches || 0,
        type: data.manual ? 'manual' : 'hourly'
      };

      setScanHistory(prev => [completedScan, ...prev.slice(0, 9)]); // Keep last 10 scans
      setMetrics(prev => ({
        ...prev,
        sitesScanned: data.sitesScanned || prev.sitesScanned,
        threatsFound: data.threatsFound || prev.threatsFound,
        totalMatches: data.totalMatches || prev.totalMatches,
        lastScanTime: new Date().toISOString(),
        nextScanTime: data.nextScanTime || null
      }));

      // Clear progress after a delay
      setTimeout(() => {
        setProgress(0);
        setCurrentStage(null);
      }, 3000);
    });

    socket.on('hourly_scan_stopped', (data) => {
      console.log('🛑 Hourly scan stopped:', data);
      setIsActive(false);
      setProgress(0);
      setCurrentSite(null);
      setCurrentStage('Stopped');
      setIsManualScan(false);
      setError(null);
    });

    socket.on('hourly_scan_error', (data) => {
      console.error('❌ Hourly scan error:', data);
      setError(data.error || 'An error occurred during scanning');
      setIsActive(false);
      setCurrentStage('Error');
    });

    socket.on('hourly_scan_status', (data) => {
      console.log('📋 Hourly scan status:', data);
      if (data.success) {
        setIsActive(data.isActive || false);
        setProgress(data.progress || 0);
        setCurrentSite(data.currentSite || null);
        setCurrentStage(data.currentStage || null);
        setMetrics(prev => ({
          ...prev,
          lastScanTime: data.lastScanTime || prev.lastScanTime,
          nextScanTime: data.nextScanTime || prev.nextScanTime
        }));
        if (data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
      }
    });

    socket.on('hourly_scan_settings_updated', (data) => {
      console.log('⚙️ Hourly scan settings updated:', data);
      if (data.success && data.settings) {
        setSettings(prev => ({ ...prev, ...data.settings }));
      }
    });

    eventHandlersSetup.current = true;

    // Request initial status
    requestStatus();

    return () => {
      console.log('🔌 Cleaning up hourly scan event listeners');
      socket.off('hourly_scan_started');
      socket.off('hourly_scan_progress');
      socket.off('hourly_scan_stage_progress');
      socket.off('hourly_scan_stage_complete');
      socket.off('hourly_scan_completed');
      socket.off('hourly_scan_stopped');
      socket.off('hourly_scan_error');
      socket.off('hourly_scan_status');
      socket.off('hourly_scan_settings_updated');
      eventHandlersSetup.current = false;
    };
  }, [socket, isConnected]);

  // API methods
  const startScan = useCallback((options = {}) => {
    if (!socket || !isConnected) {
      setError('Not connected to server');
      return;
    }

    const scanOptions = {
      intervalMinutes: options.intervalMinutes || settings.intervalMinutes,
      runImmediately: options.runImmediately !== undefined ? options.runImmediately : true,
      manual: options.manual || false
    };

    console.log('🚀 Starting hourly scan:', scanOptions);
    socket.emit('hourly_scan:start', scanOptions);
    setError(null);
  }, [socket, isConnected, settings.intervalMinutes]);

  const stopScan = useCallback(() => {
    if (!socket || !isConnected) {
      setError('Not connected to server');
      return;
    }

    console.log('🛑 Stopping hourly scan');
    socket.emit('hourly_scan:stop');
    setError(null);
  }, [socket, isConnected]);

  const requestStatus = useCallback(() => {
    if (!socket || !isConnected) return;
    
    console.log('📋 Requesting hourly scan status');
    socket.emit('hourly_scan:status');
  }, [socket, isConnected]);

  const updateSettings = useCallback((newSettings) => {
    if (!socket || !isConnected) {
      setError('Not connected to server');
      return;
    }

    console.log('⚙️ Updating hourly scan settings:', newSettings);
    socket.emit('hourly_scan:update_settings', newSettings);
    setError(null);
  }, [socket, isConnected]);

  const runManualScan = useCallback(() => {
    startScan({ 
      runImmediately: true, 
      manual: true,
      intervalMinutes: 0 // One-time scan
    });
  }, [startScan]);

  // Connection status effect
  useEffect(() => {
    if (isConnected && currentRoom) {
      // Request status when connected
      setTimeout(() => requestStatus(), 1000);
    }
  }, [isConnected, currentRoom, requestStatus]);

  return {
    // State
    isActive,
    progress,
    currentSite,
    currentStage,
    error,
    isManualScan,
    scanHistory,
    metrics,
    settings,
    isConnected,
    
    // Actions
    startScan,
    stopScan,
    runManualScan,
    requestStatus,
    updateSettings,
    
    // Helpers
    clearError: () => setError(null)
  };
}; 