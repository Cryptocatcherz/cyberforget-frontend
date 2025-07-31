import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  LinearProgress,
  Autocomplete,
} from '@mui/material';
import { format } from 'date-fns';
import api from '../../services/apiService';

const ThreatManagement = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [threatType, setThreatType] = useState('PERSONAL_INFO_EXPOSURE');
  const [severity, setSeverity] = useState('MEDIUM');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [siteName, setSiteName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [scanProgress, setScanProgress] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/users');

        if (response.data) {
          setUsers(response.data.users.map(user => ({
            id: user.id,
            label: `${user.firstName || ''} ${user.lastName || ''} (${user.email})`,
            email: user.email
          })));
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Clear success/error messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'N/A';
    }
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  const handleAddThreat = async () => {
    if (!selectedUser) {
      setError('Please select a user');
      return;
    }

    try {
      const response = await api.post(`/admin/threats/${selectedUser.id}`, {
        threatType,
        severity,
        title: title || 'Simulated Security Threat',
        description: description || 'This is a simulated threat created by admin for testing purposes.',
        siteName: siteName || 'Admin Simulated Site',
        siteUrl: siteUrl || `https://example-threat-${Date.now()}.com`
      });

      if (response.data.success) {
        setSuccess('Threat added successfully');
        setTitle('');
        setDescription('');
        setSiteName('');
        setSiteUrl('');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to add threat');
    }
  };

  const handleSimulateScan = async () => {
    if (!selectedUser) {
      setError('Please select a user');
      return;
    }

    try {
      const response = await api.post(`/admin/simulate-scan/${selectedUser.id}`);
      
      if (response.data.success) {
        setSuccess('Scan simulation started successfully');
        setScanProgress({
          progress: 0,
          message: 'Starting scan simulation...'
        });

        // Simulate progress updates
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 10;
          setScanProgress({
            progress: Math.min(progress, 100),
            message: progress < 100 ? `Scanning... ${progress}%` : 'Scan complete!'
          });

          if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
              setScanProgress(null);
            }, 2000);
          }
        }, 500);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to start scan simulation');
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      '&:hover fieldset': {
        borderColor: '#42ffb5',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#42ffb5',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
      '&.Mui-focused': {
        color: '#42ffb5',
      },
    },
    '& .MuiSelect-icon': {
      color: '#42ffb5',
    },
  };

  return (
    <Box sx={{ color: '#fff', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#42ffb5' }}>
        Threat Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: '#1E1E1E',
            border: '1px solid rgba(66, 255, 181, 0.2)',
            boxShadow: 'none',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                color: '#42ffb5',
                fontSize: '1.1rem',
                fontWeight: 600,
                mb: 3
              }}>
                Add Simulated Threat
              </Typography>
              
              <Box component="form" sx={{ '& > *': { mb: 2.5 } }}>
                <Autocomplete
                  value={selectedUser}
                  onChange={(event, newValue) => {
                    setSelectedUser(newValue);
                  }}
                  options={users}
                  loading={loading}
                  getOptionLabel={(option) => option.label || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select User"
                      sx={inputStyles}
                    />
                  )}
                  sx={{
                    '& .MuiAutocomplete-popupIndicator': {
                      color: '#42ffb5',
                    },
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Threat Type</InputLabel>
                  <Select
                    value={threatType}
                    onChange={(e) => setThreatType(e.target.value)}
                    sx={inputStyles}
                  >
                    <MenuItem value="PERSONAL_INFO_EXPOSURE">Personal Info Exposure</MenuItem>
                    <MenuItem value="IDENTITY_THEFT">Identity Theft</MenuItem>
                    <MenuItem value="DATA_BREACH">Data Breach</MenuItem>
                    <MenuItem value="SOCIAL_MEDIA_EXPOSURE">Social Media Exposure</MenuItem>
                    <MenuItem value="FINANCIAL_EXPOSURE">Financial Exposure</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Severity</InputLabel>
                  <Select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    sx={inputStyles}
                  >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                    <MenuItem value="CRITICAL">Critical</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Threat Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  sx={inputStyles}
                  placeholder="Custom threat title (optional)"
                />

                <TextField
                  label="Site Name"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  fullWidth
                  sx={inputStyles}
                  placeholder="e.g., DataBrokerSite.com"
                />

                <TextField
                  label="Site URL"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  fullWidth
                  sx={inputStyles}
                  placeholder="e.g., https://example.com/profile"
                />

                <TextField
                  label="Threat Description"
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  sx={inputStyles}
                  placeholder="Detailed threat description (optional)"
                />

                <Button
                  variant="contained"
                  onClick={handleAddThreat}
                  fullWidth
                  sx={{
                    backgroundColor: '#42ffb5',
                    color: '#000',
                    fontWeight: 600,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: '#00d4aa',
                    },
                  }}
                >
                  Add Threat
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            backgroundColor: '#1E1E1E',
            border: '1px solid rgba(66, 255, 181, 0.2)',
            boxShadow: 'none',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                color: '#42ffb5',
                fontSize: '1.1rem',
                fontWeight: 600,
                mb: 3
              }}>
                Scan Simulation
              </Typography>

              <Box sx={{ '& > *': { mb: 2.5 } }}>
                <Autocomplete
                  value={selectedUser}
                  onChange={(event, newValue) => {
                    setSelectedUser(newValue);
                  }}
                  options={users}
                  loading={loading}
                  getOptionLabel={(option) => option.label || ''}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select User"
                      sx={inputStyles}
                    />
                  )}
                  sx={{
                    '& .MuiAutocomplete-popupIndicator': {
                      color: '#42ffb5',
                    },
                  }}
                />

                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                  This will create a simulated scan session for the selected user with trial simulation data.
                </Typography>

                <Button
                  variant="contained"
                  onClick={handleSimulateScan}
                  fullWidth
                  disabled={!selectedUser}
                  sx={{
                    backgroundColor: '#42ffb5',
                    color: '#000',
                    fontWeight: 600,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: '#00d4aa',
                    },
                    '&:disabled': {
                      backgroundColor: 'rgba(66, 255, 181, 0.3)',
                      color: 'rgba(0, 0, 0, 0.5)',
                    },
                  }}
                >
                  Start Scan Simulation
                </Button>

                {scanProgress && (
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={scanProgress.progress}
                      sx={{
                        backgroundColor: 'rgba(66, 255, 181, 0.1)',
                        height: 8,
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#42ffb5',
                          borderRadius: 4,
                        },
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)', 
                        textAlign: 'center', 
                        mt: 1,
                        fontSize: '0.9rem'
                      }}
                    >
                      {scanProgress.message}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mt: 3,
            backgroundColor: 'rgba(255, 67, 67, 0.1)',
            color: '#ff4343',
            border: '1px solid rgba(255, 67, 67, 0.2)',
            '& .MuiAlert-icon': {
              color: '#ff4343',
            },
          }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert 
          severity="success"
          sx={{ 
            mt: 3,
            backgroundColor: 'rgba(66, 255, 181, 0.1)',
            color: '#42ffb5',
            border: '1px solid rgba(66, 255, 181, 0.2)',
            '& .MuiAlert-icon': {
              color: '#42ffb5',
            },
          }}
        >
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default ThreatManagement;