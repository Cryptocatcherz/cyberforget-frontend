import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Switch,
    FormControlLabel,
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import './Settings.css';

const Settings = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [autoScanInterval, setAutoScanInterval] = useState(60);
    const [retentionDays, setRetentionDays] = useState(30);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingChanges, setPendingChanges] = useState(null);

    const handleSettingChange = (setting, value) => {
        setPendingChanges({ setting, value });
        setShowConfirmDialog(true);
    };

    const confirmChange = async () => {
        if (!pendingChanges) return;

        try {
            // Here you would typically make an API call to save the settings
            switch (pendingChanges.setting) {
                case 'emailNotifications':
                    setEmailNotifications(pendingChanges.value);
                    break;
                case 'autoScanInterval':
                    setAutoScanInterval(pendingChanges.value);
                    break;
                case 'retentionDays':
                    setRetentionDays(pendingChanges.value);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        }

        setShowConfirmDialog(false);
        setPendingChanges(null);
    };

    return (
        <div className="admin-settings">
            <Card className="settings-card">
                <CardContent>
                    <Typography variant="h6" className="settings-title">
                        Notification Settings
                    </Typography>
                    <Box className="settings-section">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={emailNotifications}
                                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Email Notifications"
                        />
                        <Typography variant="body2" className="setting-description">
                            Send email notifications for important system events and alerts
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            <Card className="settings-card">
                <CardContent>
                    <Typography variant="h6" className="settings-title">
                        Scan Settings
                    </Typography>
                    <Box className="settings-section">
                        <TextField
                            label="Auto-Scan Interval (minutes)"
                            type="number"
                            value={autoScanInterval}
                            onChange={(e) => handleSettingChange('autoScanInterval', e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                        />
                        <Typography variant="body2" className="setting-description">
                            Set the interval between automated scans
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            <Card className="settings-card">
                <CardContent>
                    <Typography variant="h6" className="settings-title">
                        Data Retention
                    </Typography>
                    <Box className="settings-section">
                        <TextField
                            label="Data Retention Period (days)"
                            type="number"
                            value={retentionDays}
                            onChange={(e) => handleSettingChange('retentionDays', e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                        />
                        <Typography variant="body2" className="setting-description">
                            Set how long to keep scan data and logs
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            <Dialog
                open={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
            >
                <DialogTitle>Confirm Setting Change</DialogTitle>
                <DialogContent>
                    Are you sure you want to update this setting? This may affect system behavior.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowConfirmDialog(false)}>
                        Cancel
                    </Button>
                    <Button onClick={confirmChange} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Settings; 