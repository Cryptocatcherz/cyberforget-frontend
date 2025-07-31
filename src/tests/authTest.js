const API_URL = 'http://localhost:5002';
const CLIENT_ORIGIN = 'http://localhost:3000';
const JWT_SECRET = '24242433131313131';

const jwt = require('jsonwebtoken');
const axios = require('axios');
const io = require('socket.io-client');

// Configure axios with better defaults
axios.defaults.baseURL = API_URL;
axios.defaults.proxy = false;
axios.defaults.timeout = 10000;
axios.defaults.headers.common['Connection'] = 'keep-alive';
axios.defaults.validateStatus = status => status < 500;

// Socket.IO connection options
const socketOptions = {
    auth: {
        token: null // Will be set after login
    },
    transports: ['polling', 'websocket'], // Try polling first
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
    forceNew: true,
    path: '/socket.io/',
    extraHeaders: {
        'Origin': CLIENT_ORIGIN
    },
    autoConnect: false, // Don't connect automatically
    rejectUnauthorized: false // Allow self-signed certificates
};

// Add process error handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

const logStep = (step, details = '') => {
    console.log('\n' + '='.repeat(50));
    console.log(`STEP: ${step}`);
    if (details) console.log(details);
    console.log('='.repeat(50));
};

const debugToken = (token) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.log('Invalid token format - not a valid JWT');
            return;
        }

        const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

        console.log('\nToken Debug Info:');
        console.log('Header:', JSON.stringify(header, null, 2));
        console.log('Payload:', JSON.stringify(payload, null, 2));
        console.log('Signature Length:', parts[2].length);
    } catch (err) {
        console.error('Error debugging token:', err);
    }
};

const testPasswordResetFlow = async () => {
    try {
        logStep('6. Testing Password Reset Flow', `
URL: ${API_URL}/api/request-password-reset
Method: POST
Headers: Content-Type: application/json
Body: {
    email: 'admin@example.com'
}`);
        
        // Request password reset
        const resetRequestResponse = await axios.post(`${API_URL}/api/request-password-reset`, {
            email: 'admin@example.com'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': CLIENT_ORIGIN,
                'Accept': 'application/json'
            }
        });

        if (resetRequestResponse.status !== 200) {
            throw new Error(`Password reset request failed with status ${resetRequestResponse.status}`);
        }

        console.log('\nPassword Reset Request Response:', JSON.stringify(resetRequestResponse.data, null, 2));

        // Test OTP verification
        logStep('7. Testing OTP Verification', `
URL: ${API_URL}/api/verify-otp
Method: POST`);

        const otpResponse = await axios.post(`${API_URL}/api/verify-otp`, {
            email: 'admin@example.com',
            otp: '123456' // This should be replaced with actual OTP in real testing
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': CLIENT_ORIGIN,
                'Accept': 'application/json'
            }
        });

        if (otpResponse.status !== 200) {
            throw new Error(`OTP verification failed with status ${otpResponse.status}`);
        }

        console.log('\nOTP Verification Response:', JSON.stringify(otpResponse.data, null, 2));

        // Test password reset
        const resetToken = otpResponse.data.token;
        logStep('8. Testing Password Reset', `
URL: ${API_URL}/api/reset-password
Method: POST`);

        const resetResponse = await axios.post(`${API_URL}/api/reset-password`, {
            token: resetToken,
            newPassword: 'NewPassword123!'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': CLIENT_ORIGIN,
                'Accept': 'application/json'
            }
        });

        if (resetResponse.status !== 200) {
            throw new Error(`Password reset failed with status ${resetResponse.status}`);
        }

        console.log('\nPassword Reset Response:', JSON.stringify(resetResponse.data, null, 2));

        return true;
    } catch (error) {
        console.error('Password reset flow test failed:', error);
        throw error;
    }
};

const testLogin = async () => {
    try {
        logStep('1. Testing Login Endpoint', `
URL: ${API_URL}/api/users/login
Method: POST
Headers: Content-Type: application/json
Body: {
    email: 'admin@example.com',
    password: 'AdminTest123!'
}`);
        
        // Login request using axios
        const loginResponse = await axios.post(`${API_URL}/api/users/login`, {
            email: 'admin@example.com',
            password: 'AdminTest123!'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': CLIENT_ORIGIN,
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        if (loginResponse.status !== 200) {
            throw new Error(`Login failed with status ${loginResponse.status}: ${JSON.stringify(loginResponse.data)}`);
        }

        // Log response details
        logStep('2. Login Response', `Status: ${loginResponse.status}
Headers: ${JSON.stringify(loginResponse.headers, null, 2)}`);
        
        console.log('\nResponse Data:', JSON.stringify(loginResponse.data, null, 2));

        if (!loginResponse.data.token) {
            throw new Error('No token received in login response');
        }

        // Verify and decode JWT token
        logStep('3. Verifying JWT Token');
        
        // Store token with Bearer prefix for HTTP requests
        const token = loginResponse.data.token.startsWith('Bearer ') ? loginResponse.data.token : `Bearer ${loginResponse.data.token}`;
        const rawToken = token.replace('Bearer ', '');
        
        // Debug token structure
        debugToken(rawToken);
        
        try {
            const decoded = jwt.verify(rawToken, JWT_SECRET);
            console.log('\nToken Verification:', 'Success ✓');
            console.log('\nDecoded Token Payload:', JSON.stringify(decoded, null, 2));
            
            // Verify required fields
            const requiredFields = ['userId', 'email', 'role', 'firstName', 'lastName', 'type'];
            const missingFields = requiredFields.filter(field => !decoded[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`Token missing required fields: ${missingFields.join(', ')}`);
            }
            console.log('\nRequired Fields Check:', 'All Present ✓');
            
        } catch (err) {
            console.error('\nToken Verification Failed:', err.message);
            throw new Error(`JWT verification failed: ${err.message}`);
        }

        // Test authenticated profile request
        logStep('4. Testing Profile Endpoint', `
URL: ${API_URL}/api/users/profile
Method: GET
Headers: 
  Authorization: ${token.substring(0, 20)}...
  Content-Type: application/json`);
        
        const profileResponse = await axios.get(`${API_URL}/api/users/profile`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'Origin': CLIENT_ORIGIN,
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        if (profileResponse.status !== 200) {
            throw new Error(`Profile request failed with status ${profileResponse.status}: ${JSON.stringify(profileResponse.data)}`);
        }

        console.log('\nProfile Response Status:', profileResponse.status);
        console.log('\nProfile Data:', JSON.stringify(profileResponse.data, null, 2));

        // Test socket connection
        logStep('5. Testing Socket.IO Connection', `
URL: ${API_URL}
Auth Token: ${rawToken.substring(0, 20)}... (without Bearer prefix)
Transport: ${socketOptions.transports.join(', ')}`);

        // Update socket options with the token
        socketOptions.auth.token = rawToken;

        // Create socket connection with retry logic
        const socket = io(API_URL, socketOptions);

        let simulationFailed = false;

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error.message);
            simulationFailed = true;
            socket.disconnect();
            process.exit(1);
        });

        socket.on('simulation_progress', (data) => {
            console.log('Simulation progress:', data);
        });

        socket.on('simulation_complete', (data) => {
            console.log('Simulation complete:', data);
            socket.disconnect();
            process.exit(0);
        });

        socket.connect();

        // Wait for connection
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                socket.disconnect();
                reject(new Error('Socket connection timeout'));
            }, 10000);

            socket.on('connect', () => {
                console.log('Socket connected successfully');
                clearTimeout(timeout);
                resolve();
            });
        });

        // Start simulation
        console.log('Starting simulation...');
        socket.emit('start_simulation');

        // Wait for simulation to complete or timeout
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                if (!simulationFailed) {
                    socket.disconnect();
                    reject(new Error('Simulation timeout'));
                }
            }, 30000);

            socket.on('simulation_complete', (data) => {
                console.log('Simulation completed successfully:', data);
                clearTimeout(timeout);
                resolve();
            });

            socket.on('error', (error) => {
                clearTimeout(timeout);
                reject(new Error(`Simulation failed: ${error.message}`));
            });
        });

        // Add password reset flow test
        await testPasswordResetFlow();

        logStep('TEST RESULTS', 'All Tests Passed Successfully! ✓');
        process.exit(0);
    } catch (error) {
        logStep('TEST FAILED', error.message);
        if (error.response) {
            console.error('\nResponse Error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        }
        if (error.stack) {
            console.error('\nStack Trace:', error.stack);
        }
        process.exit(1);
    }
};

// Mock localStorage for Node.js environment
if (typeof localStorage === 'undefined') {
    global.localStorage = {
        _data: {},
        setItem: function(id, val) { return this._data[id] = String(val); },
        getItem: function(id) { return this._data.hasOwnProperty(id) ? this._data[id] : undefined; },
        removeItem: function(id) { return delete this._data[id]; },
        clear: function() { return this._data = {}; }
    };
}

// Run the test
logStep('STARTING AUTHENTICATION TESTS', `
Server URL: ${API_URL}
Client Origin: ${CLIENT_ORIGIN}
JWT Secret: ${JWT_SECRET.substring(0, 5)}...`);

testLogin(); 