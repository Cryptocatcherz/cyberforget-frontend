import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FaCopy, FaSync, FaEdit, FaTrash, FaEnvelope, FaInbox, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import './TempEmailPage.css';
import { getApiUrl, getSocketUrl } from '../config/environment';

const TempEmailPage = () => {
  const [tempEmail, setTempEmail] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [socket, setSocket] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Initialize WebSocket connection
  useEffect(() => {
    if (tempEmail?.accessToken) {
      const newSocket = io(getSocketUrl(), {
        path: '/socket.io'
      });

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket');
        newSocket.emit('subscribe-temp-email', { accessToken: tempEmail.accessToken });
      });

      newSocket.on('new-message', (data) => {
        setMessages(prev => [data.message, ...prev]);
        toast.success(`New message from ${data.message.sender}`, {
          position: 'top-right',
          autoClose: 5000
        });
      });

      newSocket.on('email-expired', () => {
        toast.warn('Your temporary email has expired', {
          position: 'top-right',
          autoClose: 5000
        });
        setTempEmail(null);
        setMessages([]);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [tempEmail]);

  // Generate new temporary email
  const generateTempEmail = async () => {
    setGenerating(true);
    setTempEmail(null); // Clear existing email during generation
    
    try {
      const response = await fetch(`${getApiUrl()}/api/v1/temp-email/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prefix: '',
          hoursUntilExpiry: 24,
          useGuerrillaFallback: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTempEmail(data);
        setMessages([]);
        
        // Load messages immediately after generating email
        setTimeout(() => {
          if (data.accessToken) {
            loadMessagesForEmail(data.accessToken);
          }
        }, 1000);
        
        toast.success('New temporary email generated!', {
          position: 'top-right',
          autoClose: 3000
        });
      } else {
        throw new Error('Failed to generate email');
      }
    } catch (error) {
      console.error('Error generating temp email:', error);
      console.error('API URL:', `${getApiUrl()}/api/v1/temp-email/generate`);
      
      // Show error to user but still provide fallback
      toast.error('Backend connection failed. Using demo mode. Real functionality requires backend connection.', {
        position: 'top-right',
        autoClose: 8000
      });
      
      // Fallback: Generate a mock email for demo purposes
      const mockEmail = {
        id: 'demo-' + Date.now(),
        emailAddress: `demo${Math.floor(Math.random() * 10000)}@cyberforget.local`,
        accessToken: 'demo-token-' + Date.now(),
        domain: 'cyberforget.local',
        isActive: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        messageCount: 0
      };
      
      setTempEmail(mockEmail);
      setMessages([]);
      
      toast.warn('Demo mode: Backend not connected. Using mock email for testing.', {
        position: 'top-right',
        autoClose: 5000
      });
    } finally {
      setGenerating(false);
    }
  };

  // Copy email to clipboard
  const copyEmailToClipboard = () => {
    if (tempEmail?.emailAddress) {
      navigator.clipboard.writeText(tempEmail.emailAddress);
      toast.success('Email address copied to clipboard!', {
        position: 'top-right',
        autoClose: 2000
      });
    }
  };

  // Delete temporary email
  const deleteTempEmail = async () => {
    if (!tempEmail?.accessToken) return;

    try {
      // Check if we're in demo mode
      if (tempEmail.accessToken.startsWith('demo-token-')) {
        // Demo mode: simulate deletion
        setTempEmail(null);
        setMessages([]);
        if (socket) {
          socket.disconnect();
        }
        toast.success('Demo email deleted successfully!', {
          position: 'top-right',
          autoClose: 3000
        });
        
        // Don't auto-generate new email after delete
        return;
      }

      const response = await fetch(`${getApiUrl()}/api/v1/temp-email/${tempEmail.accessToken}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTempEmail(null);
        setMessages([]);
        if (socket) {
          socket.disconnect();
        }
        toast.success('Temporary email deleted successfully!', {
          position: 'top-right',
          autoClose: 3000
        });
      } else {
        throw new Error('Failed to delete email');
      }
    } catch (error) {
      console.error('Error deleting temp email:', error);
      toast.error('Failed to delete temporary email. Please try again.', {
        position: 'top-right',
        autoClose: 5000
      });
    }
  };

  // Load messages for specific email
  const loadMessagesForEmail = async (accessToken) => {
    if (!accessToken || accessToken.startsWith('demo-token-')) return;

    try {
      // First check for new Guerrilla Mail messages
      const guerrillaResponse = await fetch(`${getApiUrl()}/api/v1/temp-email/${accessToken}/check-guerrilla`, {
        method: 'POST'
      });
      
      if (guerrillaResponse.ok) {
        const guerrillaData = await guerrillaResponse.json();
        console.log('Guerrilla check result:', guerrillaData);
        
        if (guerrillaData.success && guerrillaData.data.newMessages > 0) {
          toast.success(`Found ${guerrillaData.data.newMessages} new message(s)!`, {
            position: 'top-right',
            autoClose: 3000
          });
        }
      }
      
      // Then load all messages
      const response = await fetch(`${getApiUrl()}/api/v1/temp-email/${accessToken}/messages`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Messages loaded for', accessToken, ':', data);
        setMessages(data.data?.messages || []);
        
        // Update temp email message count
        if (tempEmail && data.data?.messages) {
          setTempEmail(prev => ({
            ...prev,
            messageCount: data.data.messages.length
          }));
        }
      }
    } catch (error) {
      console.error('Error loading messages for', accessToken, ':', error);
    }
  };

  // Load messages
  const loadMessages = async () => {
    if (!tempEmail?.accessToken) return;

    setLoading(true);
    try {
      // Check if we're in demo mode
      if (tempEmail.accessToken.startsWith('demo-token-')) {
        // Demo mode: simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.info('Demo mode: No real messages in demo mode.', {
          position: 'top-right',
          autoClose: 3000
        });
        setLoading(false);
        return;
      }

      await loadMessagesForEmail(tempEmail.accessToken);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages. Please try again.', {
        position: 'top-right',
        autoClose: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  // View message
  const viewMessage = (message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
  };

  // Auto-check for messages every 30 seconds
  useEffect(() => {
    if (tempEmail?.accessToken && !tempEmail.accessToken.startsWith('demo-token-')) {
      const interval = setInterval(() => {
        console.log('Auto-checking for new messages...');
        loadMessagesForEmail(tempEmail.accessToken);
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [tempEmail]);

  // Generate initial email on component mount
  useEffect(() => {
    // Auto-generate email on first load
    generateTempEmail();
  }, []); // Empty dependency array to run only once on mount
  
  // Auto-refresh messages every 30 seconds
  useEffect(() => {
    if (tempEmail?.accessToken && !tempEmail.accessToken.startsWith('demo-token-')) {
      const interval = setInterval(() => {
        loadMessages();
      }, 30000); // Check every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [tempEmail?.accessToken]);

  return (
    <>
      <Helmet>
        <title>ForgetEmail - CyberForget | Anonymous Email Protection</title>
        <meta
          name="description"
          content="Generate anonymous, disposable email addresses that self-destruct. Protect your real inbox from spam and trackers with CyberForget's ForgetEmail."
        />
      </Helmet>
      
      <div className="temp-email-page">
        {/* Header */}
        <div className="temp-email-header">
          <div className="temp-email-logo">
            <FaEnvelope className="logo-icon" />
            <span className="logo-text">FORGET<span className="logo-accent">EMAIL</span></span>
          </div>
        </div>

        {/* Main Content */}
        <div className="temp-email-content">
          {tempEmail ? (
            <>
              {/* Email Display */}
              <div className="email-display-section">
                <h2 className="section-title">Your Temporary Email Address</h2>
                <div className="email-display">
                  <div className="email-address">
                    {tempEmail.emailAddress}
                  </div>
                  <button 
                    className="copy-button"
                    onClick={copyEmailToClipboard}
                    title="Copy to clipboard"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="email-description">
                <p>
                  Forget about spam, advertising mailings, hacking and
                  attacking robots. Keep your real mailbox clean and secure.
                  ForgetEmail provides temporary, secure, anonymous, free,
                  disposable email address.
                </p>
                {tempEmail?.accessToken?.startsWith('demo-token-') && (
                  <p className="demo-notice">
                    <strong>Demo Mode:</strong> This is a demonstration email. 
                    Real functionality requires backend connection.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button 
                  className="action-btn copy-btn"
                  onClick={copyEmailToClipboard}
                >
                  <FaCopy /> Copy
                </button>
                <button 
                  className="action-btn refresh-btn"
                  onClick={loadMessages}
                  disabled={loading}
                >
                  <FaSync className={loading ? 'spinning' : ''} /> Refresh
                </button>
                <button 
                  className="action-btn change-btn"
                  onClick={generateTempEmail}
                  disabled={generating}
                >
                  <FaEdit /> Change
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={deleteTempEmail}
                >
                  <FaTrash /> Delete
                </button>
              </div>

              {/* Inbox */}
              <div className="inbox-section">
                <div className="inbox-header">
                  <FaInbox className="inbox-icon" />
                  <h3>Inbox ({messages.length})</h3>
                </div>
                
                <div className="inbox-content">
                  {messages.length === 0 ? (
                    <div className="empty-inbox">
                      <FaInbox className="empty-icon" />
                      <p>No messages yet</p>
                      <span>Messages will appear here when received</span>
                    </div>
                  ) : (
                    <div className="messages-list">
                      {messages.map((message, index) => (
                        <div 
                          key={index} 
                          className={`message-item ${!message.isRead ? 'unread' : ''}`}
                          onClick={() => viewMessage(message)}
                        >
                          <div className="message-sender">{message.sender}</div>
                          <div className="message-subject">{message.subject}</div>
                          <div className="message-preview">
                            {message.body.length > 100 
                              ? `${message.body.substring(0, 100)}...`
                              : message.body
                            }
                            {message.body.length > 100 && (
                              <span style={{ 
                                color: '#00ffaa', 
                                fontSize: '12px', 
                                marginLeft: '4px',
                                fontWeight: '500'
                              }}>
                                Read more
                              </span>
                            )}
                          </div>
                          <div className="message-time">
                            {new Date(message.receivedAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : generating ? (
            <div className="loading-state">
              <FaSync className="spinning" />
              <p>Generating temporary email...</p>
            </div>
          ) : (
            <div className="generate-new-state">
              <FaEnvelope className="envelope-icon" />
              <p>Ready to create your temporary email</p>
              <button 
                className="generate-new-btn"
                onClick={generateTempEmail}
              >
                <FaEnvelope /> Generate New Email
              </button>
            </div>
          )}
        </div>

        {/* Message Modal */}
        {showMessageModal && selectedMessage && (
          <div className="message-modal-overlay" onClick={() => setShowMessageModal(false)}>
            <div className="message-modal" onClick={(e) => e.stopPropagation()}>
              <div className="message-modal-header">
                <h3>{selectedMessage.subject}</h3>
                <button 
                  className="close-modal"
                  onClick={() => setShowMessageModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="message-modal-meta">
                <span><strong>From:</strong> {selectedMessage.sender}</span>
                <span><strong>Date:</strong> {new Date(selectedMessage.receivedAt).toLocaleString()}</span>
              </div>
              <div className="message-modal-body">
                {selectedMessage.htmlBody ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedMessage.htmlBody }} />
                ) : (
                  <div className="message-text">
                    {selectedMessage.body}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TempEmailPage;