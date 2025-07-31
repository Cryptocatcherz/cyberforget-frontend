const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://cleandata-test-app-961214fcb16c.herokuapp.com'
  : 'http://localhost:5002';

const testServer = async () => {
    try {
        console.log('Testing server availability...');
        
        // Test root endpoint
        console.log('\nTesting root endpoint...');
        const rootResponse = await fetch(API_URL);
        console.log('Root response status:', rootResponse.status);
        const rootText = await rootResponse.text();
        console.log('Root response:', rootText);

        // Test API endpoint
        console.log('\nTesting API endpoint...');
        const apiResponse = await fetch(`${API_URL}/api`);
        console.log('API response status:', apiResponse.status);
        const apiText = await apiResponse.text();
        console.log('API response:', apiText);

        // Test login endpoint with OPTIONS request to check CORS
        console.log('\nTesting login endpoint CORS...');
        const loginOptionsResponse = await fetch(`${API_URL}/api/users/login`, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
        });
        console.log('Login OPTIONS response status:', loginOptionsResponse.status);
        console.log('Login OPTIONS headers:', Object.fromEntries(loginOptionsResponse.headers));

        // Test alternative login endpoints
        const loginEndpoints = [
            '/api/users/login',
            '/api/auth/login',
            '/api/login',
            '/auth/login'
        ];

        console.log('\nTesting possible login endpoints...');
        for (const endpoint of loginEndpoints) {
            try {
                const response = await fetch(`${API_URL}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: 'test@example.com',
                        password: 'test'
                    })
                });
                console.log(`${endpoint} status:`, response.status);
                const text = await response.text();
                console.log(`${endpoint} response:`, text);
            } catch (error) {
                console.log(`${endpoint} error:`, error.message);
            }
        }

        // Test server info endpoint if available
        console.log('\nTesting server info endpoint...');
        try {
            const infoResponse = await fetch(`${API_URL}/api/server-info`);
            console.log('Server info status:', infoResponse.status);
            if (infoResponse.ok) {
                const info = await infoResponse.json();
                console.log('Server info:', info);
            }
        } catch (error) {
            console.log('Server info not available');
        }

    } catch (error) {
        console.error('Server test failed:', error.message);
        if (error.cause) {
            console.error('Cause:', error.cause);
        }
        process.exit(1);
    }
};

// Run the test
console.log('Starting server tests...');
console.log('Server URL:', API_URL);
testServer(); 