const { testSocketConnection, connectSocket, disconnectSocket } = require('../socket');

const testScanEvents = (socket) => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error('Scan events test timed out after 10 seconds'));
        }, 10000);

        let eventsReceived = {
            scan_started: false,
            scan_progress: false,
            scan_complete: false
        };

        // Listen for scan events
        socket.on('scan_started', (data) => {
            console.log('✓ Received scan_started event:', data);
            eventsReceived.scan_started = true;
            checkCompletion();
        });

        socket.on('scan_progress', (data) => {
            console.log('✓ Received scan_progress event:', data);
            eventsReceived.scan_progress = true;
            checkCompletion();
        });

        socket.on('scan_complete', (data) => {
            console.log('✓ Received scan_complete event:', data);
            eventsReceived.scan_complete = true;
            checkCompletion();
        });

        socket.on('scan_error', (error) => {
            console.error('✗ Received scan_error event:', error);
            reject(new Error('Scan error received: ' + JSON.stringify(error)));
        });

        // Function to check if all events have been received
        const checkCompletion = () => {
            if (eventsReceived.scan_started && 
                eventsReceived.scan_progress && 
                eventsReceived.scan_complete) {
                clearTimeout(timeoutId);
                resolve(true);
            }
        };

        // Emit event to start a test scan
        console.log('Emitting test_scan event...');
        socket.emit('test_scan', { userId: 'test-user-123' });
    });
};

const runTests = async () => {
    console.log('Starting socket tests...\n');

    try {
        // Test 1: Basic Connection
        console.log('Test 1: Testing basic socket connection...');
        await testSocketConnection();
        console.log('✓ Basic connection test passed!\n');

        // Test 2: Scan Events
        console.log('Test 2: Testing scan events...');
        const socket = connectSocket();
        await testScanEvents(socket);
        console.log('✓ Scan events test passed!\n');

        // Cleanup
        disconnectSocket();
        console.log('All tests passed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('✗ Tests failed:', error);
        disconnectSocket();
        process.exit(1);
    }
};

runTests(); 