const express = require('express');
const router = express.Router();
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { 
    getUsers, 
    initiateUserScan, 
    getScanStatus, 
    stopUserScan, 
    getThreatStats 
} = require('../controllers/adminController');

// Protect all admin routes with authentication and admin middleware
router.use(authenticateToken);
router.use(isAdmin);

// Get list of users who can be scanned
router.get('/users', getUsers);

// Initiate a scan for a specific user
router.post('/scan/:userId', initiateUserScan);

// Get scan status for a specific user
router.get('/scan/status/:userId', getScanStatus);

// Stop an ongoing scan for a specific user
router.post('/scan/stop/:userId', stopUserScan);

// Get overall threat statistics
router.get('/threats/stats', getThreatStats);

module.exports = router; 