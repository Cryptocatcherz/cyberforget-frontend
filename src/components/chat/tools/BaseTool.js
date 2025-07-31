// Base Tool Component - Foundation for all chat-integrated tools
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BaseTool.css';

const BaseTool = ({ 
  toolName,
  toolIcon,
  toolDescription,
  onComplete,
  onClose,
  children,
  className = '',
  showHeader = true
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  };

  const handleComplete = (result) => {
    onComplete && onComplete(result);
  };

  return (
    <AnimatePresence>
      {!isClosing && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`chat-tool-container ${className} ${isMinimized ? 'minimized' : ''}`}
        >
          {showHeader && (
            <div className="chat-tool-header">
              <div className="tool-info">
                <span className="tool-icon">{toolIcon}</span>
                <div className="tool-text">
                  <h3 className="tool-name">{toolName}</h3>
                  <p className="tool-description">{toolDescription}</p>
                </div>
              </div>
              <div className="tool-controls">
                <button 
                  className="tool-control-btn minimize-btn"
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? '▼' : '▲'}
                </button>
                <button 
                  className="tool-control-btn close-btn"
                  onClick={handleClose}
                  title="Close tool"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="chat-tool-content"
              >
                {React.cloneElement(children, { onComplete: handleComplete })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Tool Result Component for consistent result display
export const ToolResult = ({ 
  status, 
  title, 
  message, 
  details, 
  actions,
  className = '' 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📊';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`tool-result ${status} ${className}`}
    >
      <div className="result-header">
        <span className="result-icon">{getStatusIcon()}</span>
        <h4 className="result-title">{title}</h4>
      </div>
      
      {message && (
        <p className="result-message">{message}</p>
      )}
      
      {details && (
        <div className="result-details">
          {details}
        </div>
      )}
      
      {actions && actions.length > 0 && (
        <div className="result-actions">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`result-action-btn ${action.variant || 'primary'}`}
              onClick={action.onClick}
            >
              {action.icon && <span className="action-icon">{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Loading State Component
export const ToolLoading = ({ message = 'Processing...' }) => {
  return (
    <div className="tool-loading">
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

// Error State Component  
export const ToolError = ({ error, onRetry }) => {
  return (
    <div className="tool-error">
      <span className="error-icon">❌</span>
      <p className="error-message">{error}</p>
      {onRetry && (
        <button className="retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default BaseTool;