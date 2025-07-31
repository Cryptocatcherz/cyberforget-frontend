import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { API_BASE_URL } from '../../config/endpoints';

const AutomatedScans = () => {
  const [autoScanEnabled, setAutoScanEnabled] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(null);
  const [nextScanTime, setNextScanTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const fetchAutoScanStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/scan/auto-scan/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Auto-scan feature is not available. Please ensure the backend server is running and the endpoint exists.');
        } else if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
          // Optionally redirect to login
          // window.location.href = '/login';
        } else {
          const errorData = await response.json().catch(() => null);
          setError(errorData?.message || `Server error: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      setAutoScanEnabled(data.enabled || false);
      setLastScanTime(data.lastScanTime);
      
      // Calculate next scan time (next hour at minute 0)
      const now = new Date();
      const next = new Date(now);
      next.setHours(now.getHours() + (now.getMinutes() > 0 ? 1 : 0));
      next.setMinutes(0);
      next.setSeconds(0);
      next.setMilliseconds(0);
      setNextScanTime(next.toISOString());

      setError(null);
    } catch (error) {
      console.error('Error fetching auto-scan status:', error);
      setError(
        error.message === 'Failed to fetch' 
          ? 'Unable to connect to the server. Please ensure the backend server is running.'
          : `Error: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoScan = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/scan/auto-scan/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled: !autoScanEnabled  // Send the new desired state
        })
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Auto-scan toggle endpoint is not available. Please ensure the backend server is running and the endpoint exists.');
        } else if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else {
          const errorData = await response.json().catch(() => null);
          setError(errorData?.message || `Failed to toggle auto-scan: Server error ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      
      if (data.enabled === undefined) {
        setError('Invalid server response: Missing enabled status');
        return;
      }

      setAutoScanEnabled(data.enabled);
      setLastScanTime(data.lastScanTime);
      setError(null);
    } catch (error) {
      console.error('Error toggling auto-scan:', error);
      setError(
        error.message === 'Failed to fetch' 
          ? 'Unable to connect to the server. Please ensure the backend server is running.'
          : `Error toggling auto-scan: ${error.message}`
      );
    }
  };

  useEffect(() => {
    fetchAutoScanStatus();
    const interval = setInterval(fetchAutoScanStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getNextScanTime = () => {
    const now = new Date();
    const next = new Date(now);
    next.setHours(now.getHours() + (now.getMinutes() > 0 ? 1 : 0), 0, 0, 0);
    return next;
  };

  const formatTimeUntilNextScan = () => {
    const now = new Date();
    const next = getNextScanTime();
    const diffMs = next - now;
    
    if (diffMs < 0) return 'Due now';
    
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Box>
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        backgroundColor: '#1E1E1E',
        border: '1px solid rgba(216, 255, 96, 0.1)',
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
              Automated Scans
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {autoScanEnabled ? 
                `Next automated scan in: ${formatTimeUntilNextScan()}` :
                'Automated scans are currently disabled'
              }
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={autoScanEnabled}
                onChange={toggleAutoScan}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#D8FF60',
                    '&:hover': {
                      backgroundColor: 'rgba(216, 255, 96, 0.08)',
                    },
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#D8FF60',
                  },
                }}
              />
            }
            label={autoScanEnabled ? 'Enabled' : 'Disabled'}
            sx={{ color: '#fff' }}
          />
        </Box>

        <Box 
          mt={3} 
          p={2} 
          sx={{ 
            backgroundColor: 'rgba(216, 255, 96, 0.05)',
            borderRadius: 1,
            border: '1px solid rgba(216, 255, 96, 0.1)',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography sx={{ color: '#D8FF60', fontSize: '0.875rem', mb: 0.5 }}>
                Next Scan in: {formatTimeUntilNextScan()}
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.813rem' }}>
                Last scan: {formatDateTime(lastScanTime)}
              </Typography>
            </Box>
            <Tooltip title="Refresh Status">
              <IconButton 
                onClick={fetchAutoScanStatus}
                size="small"
                sx={{ 
                  color: '#D8FF60',
                  '&:hover': {
                    backgroundColor: 'rgba(216, 255, 96, 0.08)',
                  },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {error && (
        <Paper
          sx={{ 
            p: 3,
            mb: 3,
            backgroundColor: 'rgba(255, 67, 67, 0.1)',
            border: '1px solid rgba(255, 67, 67, 0.3)',
            borderRadius: 1,
          }}
        >
          <Box display="flex" alignItems="flex-start" gap={1}>
            <ErrorIcon sx={{ color: '#ff4343', mt: 0.5 }} />
            <Box>
              <Typography sx={{ color: '#ff4343', fontWeight: 500, mb: 0.5 }}>
                Error
              </Typography>
              <Typography sx={{ color: '#ff4343', fontSize: '0.875rem' }}>
                {error}
              </Typography>
              {error.includes('backend server') && (
                <Typography sx={{ color: '#ff4343', fontSize: '0.813rem', mt: 1 }}>
                  Troubleshooting steps:
                  <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                    <li>Ensure the backend server is running on port 5002</li>
                    <li>Check if the API endpoint is correctly implemented</li>
                    <li>Verify your authentication token is valid</li>
                  </ul>
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>
      )}

      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            p: 2
          }}
        >
          <CircularProgress size={20} sx={{ color: '#D8FF60' }} />
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Loading auto-scan status...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AutomatedScans; 