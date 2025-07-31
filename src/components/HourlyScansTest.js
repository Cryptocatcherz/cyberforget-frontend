import React, { useEffect, useState } from 'react';
import { useHourlyScans } from '../hooks/useHourlyScans';
import { useAuth } from "../hooks/useAuthUtils";

const HourlyScansTest = () => {
  const { user } = useAuth();
  const {
    isActive,
    progress,
    currentSite,
    currentStage,
    error,
    isConnected,
    startScan,
    stopScan,
    runManualScan,
    requestStatus
  } = useHourlyScans(user?.id);

  const [logs, setLogs] = useState([]);

  // Log all changes
  useEffect(() => {
    const newLog = {
      timestamp: new Date().toLocaleTimeString(),
      event: 'Status Update',
      data: {
        isConnected,
        isActive,
        progress,
        currentSite,
        currentStage,
        error
      }
    };
    setLogs(prev => [newLog, ...prev.slice(0, 19)]); // Keep last 20 logs
  }, [isConnected, isActive, progress, currentSite, currentStage, error]);

  const addLog = (event, data) => {
    setLogs(prev => [{
      timestamp: new Date().toLocaleTimeString(),
      event,
      data: typeof data === 'string' ? data : JSON.stringify(data)
    }, ...prev.slice(0, 19)]);
  };

  const handleStartScan = () => {
    addLog('User Action', 'Starting hourly scan');
    startScan();
  };

  const handleStopScan = () => {
    addLog('User Action', 'Stopping scan');
    stopScan();
  };

  const handleManualScan = () => {
    addLog('User Action', 'Starting manual scan');
    runManualScan();
  };

  const handleRequestStatus = () => {
    addLog('User Action', 'Requesting status');
    requestStatus();
  };

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      margin: '20px 0',
      color: 'white',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ color: '#00ff88', marginBottom: '20px' }}>
        🧪 Hourly Scans Test Component
      </h3>

      {/* Connection Status */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '10px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: isConnected ? '#10b981' : '#ef4444'
          }} />
          <span>Socket: {isConnected ? 'Connected' : 'Disconnected'}</span>
          <span style={{ marginLeft: '20px' }}>User ID: {user?.id || 'None'}</span>
        </div>
      </div>

      {/* Current Status */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#00ff88' }}>Current Status:</h4>
        <div>Active: <span style={{ color: isActive ? '#10b981' : '#ef4444' }}>{isActive ? 'Yes' : 'No'}</span></div>
        <div>Progress: {progress}%</div>
        <div>Current Site: {currentSite || 'None'}</div>
        <div>Stage: {currentStage || 'None'}</div>
        <div>Error: <span style={{ color: error ? '#ef4444' : '#10b981' }}>{error || 'None'}</span></div>
      </div>

      {/* Controls */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#00ff88' }}>Controls:</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleRequestStatus}
            disabled={!isConnected}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: isConnected ? 'pointer' : 'not-allowed',
              opacity: isConnected ? 1 : 0.5
            }}
          >
            Request Status
          </button>
          
          {!isActive ? (
            <>
              <button
                onClick={handleStartScan}
                disabled={!isConnected}
                style={{
                  background: '#10b981',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: isConnected ? 'pointer' : 'not-allowed',
                  opacity: isConnected ? 1 : 0.5
                }}
              >
                Start Hourly Scan
              </button>
              
              <button
                onClick={handleManualScan}
                disabled={!isConnected}
                style={{
                  background: '#3b82f6',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: isConnected ? 'pointer' : 'not-allowed',
                  opacity: isConnected ? 1 : 0.5
                }}
              >
                Manual Scan
              </button>
            </>
          ) : (
            <button
              onClick={handleStopScan}
              disabled={!isConnected}
              style={{
                background: '#ef4444',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: isConnected ? 'pointer' : 'not-allowed',
                opacity: isConnected ? 1 : 0.5
              }}
            >
              Stop Scan
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {isActive && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#00ff88' }}>Progress:</h4>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            height: '20px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #00ff88, #00cc6e)',
              height: '100%',
              width: `${progress}%`,
              transition: 'width 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'black',
              fontWeight: 'bold',
              fontSize: '12px'
            }}>
              {progress}%
            </div>
          </div>
        </div>
      )}

      {/* Event Logs */}
      <div>
        <h4 style={{ margin: '0 0 10px 0', color: '#00ff88' }}>Event Logs:</h4>
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
          padding: '15px',
          maxHeight: '300px',
          overflowY: 'auto',
          fontSize: '12px'
        }}>
          {logs.length === 0 ? (
            <div style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              No logs yet...
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{
                marginBottom: '8px',
                paddingBottom: '8px',
                borderBottom: index < logs.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
              }}>
                <div style={{ color: '#00ff88' }}>
                  [{log.timestamp}] {log.event}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginLeft: '10px' }}>
                  {typeof log.data === 'string' ? log.data : JSON.stringify(log.data, null, 2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#60a5fa' }}>🔍 Testing Instructions:</h4>
        <ol style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.8)' }}>
          <li>Check that Socket shows "Connected" (green dot)</li>
          <li>Click "Request Status" to test communication</li>
          <li>Try "Start Hourly Scan" to test scan functionality</li>
          <li>Watch the progress bar and event logs</li>
          <li>Use "Stop Scan" to halt a running scan</li>
          <li>Check browser console for detailed logs (press F12)</li>
        </ol>
      </div>
    </div>
  );
};

export default HourlyScansTest; 