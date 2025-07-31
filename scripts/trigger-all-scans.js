socket.on('connect', () => {
    console.log(`Socket connected for user ${email}`);
    socket.emit('join', {
        userId: userId,
        forceManual: true
    });
}); 