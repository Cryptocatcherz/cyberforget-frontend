import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Switch,
  TextField,
  Button,
  Alert,
  Slider,
  FormControlLabel,
  Divider,
  Chip,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Notifications as NotificationsIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  RestoreFromTrash as RestoreIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import api from '../../services/apiService';
import './AdminSettings.css';

const AdminSettings = () => {
  const [settings, setSettings] = useState({});
  const [originalSettings, setOriginalSettings] = useState({});
  const [autoScanStatus, setAutoScanStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null });
  const [timeUntilNextScan, setTimeUntilNextScan] = useState(0);

  useEffect(() => {
    loadSettings();
    loadAutoScanStatus();
  }, []);

  useEffect(() => {
    // Update countdown timer
    const interval = setInterval(() => {
      if (autoScanStatus.timeUntilNext > 0) {
        setTimeUntilNextScan(prev => Math.max(0, prev - 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [autoScanStatus.timeUntilNext]);

  const loadSettings = async () => {
    try {
      const response = await api.get('/admin/settings');
      if (response.data.success) {
        setSettings(response.data.data);
        setOriginalSettings(response.data.data);
      }
    } catch (error) {
      setError('Failed to load admin settings');
      console.error('Settings load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAutoScanStatus = async () => {
    try {
      const response = await api.get('/admin/auto-scan/status');
      if (response.data.success) {
        setAutoScanStatus(response.data.data);
        setTimeUntilNextScan(response.data.data.timeUntilNext || 0);
      }
    } catch (error) {
      console.error('Auto scan status error:', error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/admin/settings', settings);
      if (response.data.success) {
        setSuccess('Settings saved successfully');
        setOriginalSettings({ ...settings });
        loadAutoScanStatus(); // Refresh auto scan status
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings({ ...originalSettings });
    setError('');
    setSuccess('');
  };

  const toggleAutoScan = async () => {
    try {
      const newEnabled = !autoScanStatus.enabled;
      const response = await api.post('/admin/auto-scan/toggle', { enabled: newEnabled });
      
      if (response.data.success) {
        setAutoScanStatus(prev => ({ ...prev, enabled: newEnabled }));
        setSuccess(`Auto scan ${newEnabled ? 'enabled' : 'disabled'} successfully`);
        loadAutoScanStatus(); // Refresh full status
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to toggle auto scan');
    }
  };

  const triggerManualScan = async () => {
    setConfirmDialog({ open: false, action: null });
    try {
      const response = await api.post('/admin/auto-scan/trigger');
      if (response.data.success) {
        setSuccess(`Manual scan triggered for ${response.data.data.userCount} users`);
        loadAutoScanStatus(); // Refresh status
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to trigger manual scan');
    }
  };

  const formatCountdown = (milliseconds) => {
    if (milliseconds <= 0) return 'Overdue';
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#42ffb5' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, color: '#fff' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#42ffb5' }}>
        <SettingsIcon sx={{ mr: 2 }} />
        Admin Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, backgroundColor: 'rgba(255, 67, 67, 0.1)', color: '#ff4343' }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3, backgroundColor: 'rgba(66, 255, 181, 0.1)', color: '#42ffb5' }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Auto Scan Configuration */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ backgroundColor: '#1E1E1E', border: '1px solid rgba(66, 255, 181, 0.2)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#42ffb5', display: 'flex', alignItems: 'center' }}>
                <ScheduleIcon sx={{ mr: 1 }} />
                Auto Scan Configuration
              </Typography>

              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoScanStatus.enabled || false}
                      onChange={toggleAutoScan}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#42ffb5' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#42ffb5' }
                      }}
                    />
                  }
                  label="Enable Automatic Scans"
                  sx={{ color: '#fff' }}
                />
              </Box>

              {autoScanStatus.enabled && (
                <Box sx={{ mb: 3 }}>
                  <Paper sx={{ p: 2, backgroundColor: 'rgba(66, 255, 181, 0.1)', border: '1px solid rgba(66, 255, 181, 0.3)' }}>
                    <Typography variant="body2" sx={{ color: '#42ffb5', mb: 1 }}>
                      Next Scan: {timeUntilNextScan > 0 ? formatCountdown(timeUntilNextScan) : 'Calculating...'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                      Last Scan: {autoScanStatus.lastScanAt ? new Date(autoScanStatus.lastScanAt).toLocaleString() : 'Never'}
                    </Typography>
                  </Paper>
                </Box>
              )}

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom sx={{ color: '#fff' }}>
                  Scan Interval: {settings.auto_scan_interval || 24} hours
                </Typography>
                <Slider
                  value={settings.auto_scan_interval || 24}
                  onChange={(e, value) => handleSettingChange('auto_scan_interval', value)}
                  min={1}
                  max={168}
                  step={1}
                  marks={[
                    { value: 1, label: '1h' },
                    { value: 24, label: '1d' },
                    { value: 72, label: '3d' },
                    { value: 168, label: '1w' }
                  ]}
                  sx={{
                    color: '#42ffb5',
                    '& .MuiSlider-thumb': { backgroundColor: '#42ffb5' },
                    '& .MuiSlider-track': { backgroundColor: '#42ffb5' },
                    '& .MuiSlider-rail': { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
                  }}
                />
              </Box>

              <Button
                variant="contained"
                onClick={() => setConfirmDialog({ open: true, action: 'trigger-scan' })}
                startIcon={<PlayArrowIcon />}
                sx={{
                  backgroundColor: '#42ffb5',
                  color: '#000',
                  '&:hover': { backgroundColor: '#00d4aa' }
                }}
                fullWidth
              >
                Trigger Manual Scan for All Users
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* System Settings */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ backgroundColor: '#1E1E1E', border: '1px solid rgba(66, 255, 181, 0.2)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#42ffb5', display: 'flex', alignItems: 'center' }}>
                <SecurityIcon sx={{ mr: 1 }} />
                System Settings
              </Typography>

              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Max Concurrent Scans"
                  type="number"
                  value={settings.max_concurrent_scans || 5}
                  onChange={(e) => handleSettingChange('max_concurrent_scans', parseInt(e.target.value))}
                  fullWidth
                  inputProps={{ min: 1, max: 20 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: '#42ffb5' },
                      '&.Mui-focused fieldset': { borderColor: '#42ffb5' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Scan Timeout (minutes)"
                  type="number"
                  value={settings.scan_timeout_minutes || 30}
                  onChange={(e) => handleSettingChange('scan_timeout_minutes', parseInt(e.target.value))}
                  fullWidth
                  inputProps={{ min: 5, max: 120 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: '#42ffb5' },
                      '&.Mui-focused fieldset': { borderColor: '#42ffb5' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom sx={{ color: '#fff' }}>
                  Data Retention: {settings.data_retention_days || 90} days
                </Typography>
                <Slider
                  value={settings.data_retention_days || 90}
                  onChange={(e, value) => handleSettingChange('data_retention_days', value)}
                  min={30}
                  max={365}
                  step={30}
                  marks={[
                    { value: 30, label: '30d' },
                    { value: 90, label: '90d' },
                    { value: 180, label: '6m' },
                    { value: 365, label: '1y' }
                  ]}
                  sx={{
                    color: '#42ffb5',
                    '& .MuiSlider-thumb': { backgroundColor: '#42ffb5' },
                    '& .MuiSlider-track': { backgroundColor: '#42ffb5' },
                    '& .MuiSlider-rail': { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ backgroundColor: '#1E1E1E', border: '1px solid rgba(66, 255, 181, 0.2)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#42ffb5', display: 'flex', alignItems: 'center' }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                Notification Settings
              </Typography>

              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.email_notifications_enabled || false}
                      onChange={(e) => handleSettingChange('email_notifications_enabled', e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#42ffb5' },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#42ffb5' }
                      }}
                    />
                  }
                  label="Enable Email Notifications"
                  sx={{ color: '#fff' }}
                />
              </Box>

              <TextField
                label="Admin Notification Email"
                value={settings.notification_email || ''}
                onChange={(e) => handleSettingChange('notification_email', e.target.value)}
                fullWidth
                type="email"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                    '&:hover fieldset': { borderColor: '#42ffb5' },
                    '&.Mui-focused fieldset': { borderColor: '#42ffb5' }
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ backgroundColor: '#1E1E1E', border: '1px solid rgba(66, 255, 181, 0.2)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#42ffb5', display: 'flex', alignItems: 'center' }}>
                <StorageIcon sx={{ mr: 1 }} />
                Quick Actions
              </Typography>

              <List>
                <ListItem button onClick={loadAutoScanStatus}>
                  <ListItemIcon>
                    <RefreshIcon sx={{ color: '#42ffb5' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Refresh Status" 
                    secondary="Update auto scan and system status"
                    sx={{ '& .MuiListItemText-primary': { color: '#fff' }, '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.7)' } }}
                  />
                </ListItem>

                <ListItem button onClick={resetSettings}>
                  <ListItemIcon>
                    <RestoreIcon sx={{ color: '#ff9800' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Reset Settings" 
                    secondary="Restore to last saved configuration"
                    sx={{ '& .MuiListItemText-primary': { color: '#fff' }, '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.7)' } }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Actions */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={resetSettings}
          disabled={!hasChanges || saving}
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: '#fff',
            '&:hover': { borderColor: '#42ffb5', color: '#42ffb5' }
          }}
        >
          Reset Changes
        </Button>
        <Button
          variant="contained"
          onClick={saveSettings}
          disabled={!hasChanges || saving}
          startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
          sx={{
            backgroundColor: '#42ffb5',
            color: '#000',
            '&:hover': { backgroundColor: '#00d4aa' },
            '&:disabled': { backgroundColor: 'rgba(66, 255, 181, 0.3)' }
          }}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={() => setConfirmDialog({ open: false, action: null })}
        PaperProps={{
          sx: { backgroundColor: '#1E1E1E', color: '#fff' }
        }}
      >
        <DialogTitle sx={{ color: '#42ffb5' }}>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to trigger a manual scan for all users? This will create scan jobs for all active premium and trial users.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialog({ open: false, action: null })}
            sx={{ color: '#fff' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={triggerManualScan}
            variant="contained"
            sx={{ backgroundColor: '#42ffb5', color: '#000' }}
          >
            Trigger Scan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSettings;