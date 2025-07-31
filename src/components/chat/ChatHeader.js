import React from 'react';
import { FaBrain } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ModelSelector from './ModelSelector';

const ChatHeader = ({ onNewChat }) => {
  return (
    <div className="top-section">
      <div className="cyberforget-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div className="cyberforget-logo-section">
          <FaBrain className="cyberforget-icon" />
          <div className="cyberforget-text">
            <h1 className="cyberforget-title">CyberForget AI</h1>
            <p className="cyberforget-subtitle">Advanced Cyber Intelligence Platform</p>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <ModelSelector />
        </div>
        <motion.button
          className="new-chat-button"
          onClick={onNewChat}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + New Chat
        </motion.button>
      </div>
    </div>
  );
};

export default ChatHeader; 