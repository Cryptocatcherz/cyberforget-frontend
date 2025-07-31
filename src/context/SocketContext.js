import React, { createContext, useContext } from 'react';
import { useSocket } from '../hooks/useSocket';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const socketState = useSocket();

    return (
        <SocketContext.Provider value={socketState}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocketContext must be used within a SocketProvider');
    }
    return context;
};

export default SocketContext; 