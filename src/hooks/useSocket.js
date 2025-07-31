import { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getSocketUrl } from '../config/environment';

// Constants
const SOCKET_URL = getSocketUrl();
const HEARTBEAT_INTERVAL = 25000; // 25 seconds
const MAX_RECONNECTION_ATTEMPTS = 5;

export const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [error, setError] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState({
    progress: 0,
    currentSite: null,
    currentStage: null,
    statusMessage: '',
    metrics: {
      sitesScanned: 0,
      potentialThreats: 0,
      totalMatches: 0
    }
  });

  const reconnectAttempts = useRef(0);
  const heartbeatInterval = useRef(null);
  const eventHandlers = useRef(new Map());

  // Initialize socket connection
  useEffect(() => {
    if (!userId) return;
    let newSocket;
    try {
      newSocket = io(SOCKET_URL, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: MAX_RECONNECTION_ATTEMPTS,
        reconnectionDelay: 1000,
        timeout: 10000,
        auth: {
          token: localStorage.getItem('token')?.replace('Bearer ', ''),
          userId
        }
      });
      setSocket(newSocket);
    } catch (err) {
      setError(err);
    }
    return () => {
      if (newSocket) newSocket.disconnect();
      setSocket(null);
    };
  }, [userId]);

  // Setup event handlers
  useEffect(() => {
    if (!socket) return;
    socket.on('connect', () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
      startHeartbeat();
      if (userId) joinRoom(userId);
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
      setCurrentRoom(null);
      stopHeartbeat();
    });
    socket.on('connect_error', (err) => {
      setError(err);
      setIsConnected(false);
      setCurrentRoom(null);
      reconnectAttempts.current++;
    });
    // Add more event handlers as needed
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
    // eslint-disable-next-line
  }, [socket]);

  const startHeartbeat = () => {
    if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
    heartbeatInterval.current = setInterval(() => {
      if (socket?.connected) {
        socket.emit('heartbeat', {
          userId,
          timestamp: new Date().toISOString()
        });
      }
    }, HEARTBEAT_INTERVAL);
  };

  const stopHeartbeat = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
  };

  const joinRoom = (userId) => {
    if (!socket?.connected) return;
    socket.emit('join', { userId }, (response) => {
      if (!response.error) setCurrentRoom(`user_${userId}`);
    });
  };

  // Add more methods as needed (leaveRoom, startSimulation, etc.)

  return {
    socket,
    isConnected,
    currentRoom,
    error,
    isSimulating,
    simulationProgress,
    joinRoom
    // Add more methods as needed
  };
};