// test-jwt-decode.js
const { jwtDecode } = require('jwt-decode');

// A valid JWT token for testing
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

try {
    const decoded = jwtDecode(token);
    console.log('Decoded:', decoded);
} catch (error) {
    console.error('Error decoding token:', error);
}
