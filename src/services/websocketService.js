import { io } from 'socket.io-client';
import { getApiUrl } from '../config/environment';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 1000;
  }

  connect(token) {
    if (this.socket && this.connected) {
      console.log('[WebSocketService] Already connected');
      return;
    }

    const socketUrl = getApiUrl().replace('/api', ''); // Remove /api suffix for socket connection
    
    console.log('[WebSocketService] Connecting to:', socketUrl);

    this.socket = io(socketUrl, {
      auth: {
        token: token
      },
      transports: ['websocket'],
      upgrade: false,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectInterval
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[WebSocketService] Connected');
      this.connected = true;
      this.reconnectAttempts = 0;
      
      // Re-subscribe to all active subscriptions
      this.resubscribeAll();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[WebSocketService] Disconnected:', reason);
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('[WebSocketService] Connection error:', error);
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('[WebSocketService] Socket error:', error);
    });

    // Handle real-time events
    this.socket.on('scan_updated', (data) => {
      this.notifySubscribers('scan_updated', data);
    });

    this.socket.on('scan_progress', (data) => {
      this.notifySubscribers('scan_progress', data);
    });

    this.socket.on('threat_discovered', (data) => {
      this.notifySubscribers('threat_discovered', data);
    });

    this.socket.on('feature_toggle_updated', (data) => {
      this.notifySubscribers('feature_toggle_updated', data);
    });

    this.socket.on('removal_request_updated', (data) => {
      this.notifySubscribers('removal_request_updated', data);
    });
  }

  disconnect() {
    if (this.socket) {
      console.log('[WebSocketService] Disconnecting');
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.subscriptions.clear();
    }
  }

  /**
   * Subscribe to scan updates for a specific user
   */
  subscribeToScans(userId, callback) {
    if (!this.isConnected()) {
      console.warn('[WebSocketService] Not connected, cannot subscribe to scans');
      return null;
    }

    const subscriptionKey = `scans_${userId}`;
    
    // Store the subscription
    if (!this.subscriptions.has(subscriptionKey)) {
      this.subscriptions.set(subscriptionKey, new Set());
    }
    this.subscriptions.get(subscriptionKey).add(callback);

    // Join the room for this user's scans
    this.socket.emit('join_scan_room', { userId });

    console.log('[WebSocketService] Subscribed to scans for user:', userId);

    // Return unsubscribe function
    return () => {
      this.unsubscribeFromScans(userId, callback);
    };
  }

  /**
   * Subscribe to feature toggle updates for a specific user
   */
  subscribeToFeatureToggles(userId, callback) {
    if (!this.isConnected()) {
      console.warn('[WebSocketService] Not connected, cannot subscribe to feature toggles');
      return null;
    }

    const subscriptionKey = `features_${userId}`;
    
    // Store the subscription
    if (!this.subscriptions.has(subscriptionKey)) {
      this.subscriptions.set(subscriptionKey, new Set());
    }
    this.subscriptions.get(subscriptionKey).add(callback);

    // Join the room for this user's feature toggles
    this.socket.emit('join_features_room', { userId });

    console.log('[WebSocketService] Subscribed to feature toggles for user:', userId);

    // Return unsubscribe function
    return () => {
      this.unsubscribeFromFeatureToggles(userId, callback);
    };
  }

  /**
   * Unsubscribe from scan updates
   */
  unsubscribeFromScans(userId, callback) {
    const subscriptionKey = `scans_${userId}`;
    
    if (this.subscriptions.has(subscriptionKey)) {
      this.subscriptions.get(subscriptionKey).delete(callback);
      
      // If no more subscribers, leave the room
      if (this.subscriptions.get(subscriptionKey).size === 0) {
        this.subscriptions.delete(subscriptionKey);
        if (this.socket) {
          this.socket.emit('leave_scan_room', { userId });
        }
      }
    }

    console.log('[WebSocketService] Unsubscribed from scans for user:', userId);
  }

  /**
   * Unsubscribe from feature toggle updates
   */
  unsubscribeFromFeatureToggles(userId, callback) {
    const subscriptionKey = `features_${userId}`;
    
    if (this.subscriptions.has(subscriptionKey)) {
      this.subscriptions.get(subscriptionKey).delete(callback);
      
      // If no more subscribers, leave the room
      if (this.subscriptions.get(subscriptionKey).size === 0) {
        this.subscriptions.delete(subscriptionKey);
        if (this.socket) {
          this.socket.emit('leave_features_room', { userId });
        }
      }
    }

    console.log('[WebSocketService] Unsubscribed from feature toggles for user:', userId);
  }

  /**
   * Notify all subscribers of an event
   */
  notifySubscribers(eventType, data) {
    const userId = data.userId || data.user_id;
    
    // Notify scan subscribers
    if (eventType.startsWith('scan_') || eventType.includes('threat_')) {
      const subscriptionKey = `scans_${userId}`;
      if (this.subscriptions.has(subscriptionKey)) {
        this.subscriptions.get(subscriptionKey).forEach(callback => {
          try {
            callback({
              eventType,
              table: 'scan_sessions',
              new: data,
              old: null
            });
          } catch (error) {
            console.error('[WebSocketService] Error in scan callback:', error);
          }
        });
      }
    }

    // Notify feature toggle subscribers
    if (eventType.includes('feature_toggle')) {
      const subscriptionKey = `features_${userId}`;
      if (this.subscriptions.has(subscriptionKey)) {
        this.subscriptions.get(subscriptionKey).forEach(callback => {
          try {
            callback({
              eventType,
              table: 'feature_toggles',
              new: data,
              old: null
            });
          } catch (error) {
            console.error('[WebSocketService] Error in feature toggle callback:', error);
          }
        });
      }
    }
  }

  /**
   * Re-subscribe to all active subscriptions (called on reconnect)
   */
  resubscribeAll() {
    console.log('[WebSocketService] Re-subscribing to all active subscriptions');
    
    this.subscriptions.forEach((callbacks, subscriptionKey) => {
      if (subscriptionKey.startsWith('scans_')) {
        const userId = subscriptionKey.replace('scans_', '');
        this.socket.emit('join_scan_room', { userId });
      } else if (subscriptionKey.startsWith('features_')) {
        const userId = subscriptionKey.replace('features_', '');
        this.socket.emit('join_features_room', { userId });
      }
    });
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected() {
    return this.socket && this.connected;
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      connected: this.connected,
      socketId: this.socket?.id || null,
      subscriptions: Array.from(this.subscriptions.keys())
    };
  }

  /**
   * Emit an event to the server
   */
  emit(eventName, data) {
    if (this.isConnected()) {
      this.socket.emit(eventName, data);
    } else {
      console.warn('[WebSocketService] Cannot emit event, not connected:', eventName);
    }
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;