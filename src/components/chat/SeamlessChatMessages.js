// Seamless Chat Messages - Enhanced ChatMessages with automatic tool integration
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaUser, FaRobot } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import EnhancedMessageRenderer from './EnhancedMessageRenderer';
import InlineToolRenderer from './InlineToolRenderer';
import SecurityTools from './SecurityTools';
import EmailScanPopup from '../EmailScanPopup';
import EmailScanResult from '../EmailScanResult';
import PremiumFeatureResponse from './PremiumFeatureResponse';
import ThinkingIndicator from './ThinkingIndicator';
import conversationalToolDetector from '../../services/conversationalToolDetector';
import { environment } from '../../config/environment';
import './SeamlessChatMessages.css';

const messageVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

// AI-specific animation with thinking effect
const aiMessageVariants = {
  initial: { 
    opacity: 0, 
    y: 30,
    scale: 0.9
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.3
    }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

const SeamlessChatMessages = ({ 
  messages, 
  scamKeywords, 
  isTyping, 
  onOptionClick, 
  onEmailScan,
  onToolResult,
  shouldShowSignUpTriggers,
  onSignUpClick
}) => {
  const [showEmailScanPopup, setShowEmailScanPopup] = useState(false);
  const [emailScanResult, setEmailScanResult] = useState(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Auto-scroll behavior - scroll to start of newest assistant message when thinking finishes
  useEffect(() => {
    if (messages.length > 0 && !isTyping) {
      // When thinking finishes (isTyping becomes false), scroll to the most recent assistant message
      const lastAssistantMessage = messages.slice().reverse().find(msg => msg.role === 'assistant');
      if (lastAssistantMessage) {
        // Small delay to ensure the message is fully rendered
        setTimeout(() => {
          const messageElement = document.querySelector(`[data-message-id="${lastAssistantMessage.id}"]`);
          if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
    
    // Only scroll to bottom during typing
    if (isTyping && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Handle tool results from embedded tools
  const handleToolResult = useCallback((result) => {
    if (onToolResult) {
      onToolResult(result);
    }
    
    // Optionally add tool result as a new message
    if (result.summary) {
      const toolMessage = {
        id: `tool_result_${Date.now()}`,
        role: 'assistant',
        content: `✅ **Tool Result**: ${result.summary}`,
        timestamp: new Date(),
        toolResult: result
      };
      
      // This would need to be handled by the parent component
      // For now, just log it
      console.log('Tool completed:', result);
    }
  }, [onToolResult]);

  // Enhanced message processing with tool detection
  const processMessage = useCallback((message, index) => {
    // Create conversation history for context
    const conversationHistory = messages.slice(0, index);
    
    return {
      ...message,
      conversationHistory,
      shouldShowTools: message.role === 'assistant' && !message.toolResult
    };
  }, [messages]);

  // Handle email scanning (legacy support)
  const handleEmailScanClick = useCallback(async (email) => {
    setShowEmailScanPopup(true);
    
    try {
      const result = await onEmailScan(email);
      setEmailScanResult(result);
      setShowEmailScanPopup(false);
    } catch (error) {
      console.error('Email scan failed:', error);
      setShowEmailScanPopup(false);
    }
  }, [onEmailScan]);

  // Message role styling
  const getMessageRoleClass = (role) => {
    switch (role) {
      case 'user':
        return 'user-message';
      case 'assistant':
        return 'assistant-message';
      case 'system':
        return 'system-message';
      default:
        return 'default-message';
    }
  };

  // Message avatar
  const getMessageAvatar = (role) => {
    switch (role) {
      case 'user':
        return <FaUser className="message-avatar user-avatar" />;
      case 'assistant':
        return <FaRobot className="message-avatar assistant-avatar" />;
      case 'system':
        return <FaShieldAlt className="message-avatar system-avatar" />;
      default:
        return null;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Detect premium features in message content
  const detectPremiumFeature = useCallback((messageContent) => {
    if (!shouldShowSignUpTriggers || !messageContent) return null;

    const content = messageContent.toLowerCase();
    
    // Premium feature patterns
    const featurePatterns = {
      'data_removal': [
        'data removal', 'remove data', 'delete information', 'data brokers',
        'opt out', 'privacy removal', 'erase data', 'broker sites'
      ],
      'vpn_access': [
        'vpn', 'virtual private network', 'secure connection', 'hide ip',
        'encrypted connection', 'bypass restrictions', 'vpn protection'
      ],
      'monitoring': [
        'monitoring', 'alerts', 'notifications', '24/7', 'real-time',
        'continuous protection', 'threat detection', 'identity monitoring'
      ],
      'unlimited_scans': [
        'scan limit', 'more scans', 'unlimited scans', 'scan quota',
        'additional scans', 'scan more', 'comprehensive scan'
      ],
      'comprehensive_scan': [
        'comprehensive', 'detailed report', 'advanced scan', 'deep scan',
        'full analysis', 'complete scan', 'thorough scan'
      ]
    };

    // Check for feature matches
    for (const [feature, keywords] of Object.entries(featurePatterns)) {
      if (keywords.some(keyword => content.includes(keyword))) {
        return feature;
      }
    }

    // Check for general premium keywords
    const premiumKeywords = [
      'premium', 'upgrade', 'advanced', 'unlimited', 'full access',
      'priority support', 'enterprise', 'pro version'
    ];
    
    if (premiumKeywords.some(keyword => content.includes(keyword))) {
      return 'comprehensive_scan';
    }

    return null;
  }, [shouldShowSignUpTriggers]);

  // Render individual message
  const renderMessage = (message, index) => {
    const processedMessage = processMessage(message, index);
    const isLastMessage = index === messages.length - 1;
    
    // Handle tool messages specially
    if (message.role === 'tool') {
      return (
        <motion.div
          key={message.id}
          data-message-id={message.id}
          className="tool-message-container"
          variants={messageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          layout
        >
          <InlineToolRenderer
            toolType={message.toolType}
            toolData={message.toolData}
            onToolResult={handleToolResult}
            className="tool-message-renderer"
          />
        </motion.div>
      );
    }
    
    // Detect premium features for assistant messages
    const detectedFeature = message.role === 'assistant' ? detectPremiumFeature(message.content) : null;
    
    return (
      <motion.div
        key={message.id}
        data-message-id={message.id}
        className={`message-container ${getMessageRoleClass(message.role)} ${
          highlightedMessageId === message.id ? 'highlighted' : ''
        }`}
        variants={message.role === 'assistant' ? aiMessageVariants : messageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        layout
      >
        <div className="message-content">
          <div className="message-header">
            {getMessageAvatar(message.role)}
            <div className="message-meta">
              <span className="message-sender">
                {message.role === 'user' ? 'You' : 'CyberForget AI'}
              </span>
              <span className="message-time">
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
          </div>
          
          <div className="message-body">
            <EnhancedMessageRenderer
              message={processedMessage}
              conversationHistory={processedMessage.conversationHistory}
              onToolResult={handleToolResult}
              className="seamless-message-content"
            />
          </div>
        </div>
        
        {/* Premium Feature Response - temporarily disabled to fix duplicates */}
        {false && detectedFeature && shouldShowSignUpTriggers && (
          <PremiumFeatureResponse
            feature={detectedFeature}
            response={message.content}
            onSignUpClick={onSignUpClick}
            className={`${detectedFeature}-variant`}
          />
        )}
        
        {/* Legacy security tools integration */}
        {message.securityTools && (
          <SecurityTools
            tools={message.securityTools}
            onOptionClick={onOptionClick}
            messageId={message.id}
          />
        )}
      </motion.div>
    );
  };

  // Render enhanced thinking indicator
  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    
    return (
      <ThinkingIndicator 
        key="enhanced-thinking"
        stage="Analyzing your security request..."
      />
    );
  };

  return (
    <div className="seamless-chat-messages">
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => renderMessage(message, index))}
        {renderTypingIndicator()}
      </AnimatePresence>
      
      {/* Email scan popup (legacy support) */}
      {showEmailScanPopup && (
        <EmailScanPopup
          isOpen={showEmailScanPopup}
          onClose={() => setShowEmailScanPopup(false)}
        />
      )}
      
      {/* Email scan result (legacy support) */}
      {emailScanResult && (
        <EmailScanResult
          result={emailScanResult}
          onClose={() => setEmailScanResult(null)}
        />
      )}
      
      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default SeamlessChatMessages;