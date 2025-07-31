// Inline Tool Renderer - Embeds tools seamlessly within chat messages
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PasswordCheckerTool from './tools/PasswordCheckerTool';
import EmailBreachTool from './tools/EmailBreachTool';
import DataBrokerScanTool from './tools/DataBrokerScanTool';
import FileScanTool from './tools/FileScanTool';
import AccountDeleterTool from './tools/AccountDeleterTool';
import AreaCodeCheckerTool from './tools/AreaCodeCheckerTool';
import AIDefenseTool from './tools/AIDefenseTool';
import ComprehensiveSecurityTool from './tools/ComprehensiveSecurityTool';
import NetworkScanTool from './tools/NetworkScanTool';
import SecurityTestTool from './tools/SecurityTestTool';
import './InlineToolRenderer.css';

const InlineToolRenderer = ({ toolType, toolData, onToolResult, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-open tool if autoOpen flag is set
  useEffect(() => {
    if (toolData?.autoOpen) {
      setIsExpanded(true);
      setHasInteracted(true);
    }
  }, [toolData]);

  // Map tool types to components
  const toolComponents = {
    'password_checker': PasswordCheckerTool,
    'email_breach': EmailBreachTool,
    'data_broker_scan': DataBrokerScanTool,
    'file_scan': FileScanTool,
    'account_deleter': AccountDeleterTool,
    'area_code_checker': AreaCodeCheckerTool,
    'ai_defense': AIDefenseTool,
    'comprehensive_security': ComprehensiveSecurityTool,
    'network_scan': NetworkScanTool,
    'security_test_suite': SecurityTestTool
  };

  // Tool metadata for display
  const toolMeta = {
    'password_checker': {
      icon: '🔐',
      title: 'Password Security Check',
      description: 'Check if your password has been compromised',
      cta: 'Check Password Security'
    },
    'email_breach': {
      icon: '📧',
      title: 'Email Breach Scanner',
      description: 'See if your email appears in data breaches',
      cta: 'Scan Email for Breaches'
    },
    'data_broker_scan': {
      icon: '🔍',
      title: 'Data Broker Scanner',
      description: 'Find your personal info on data broker sites',
      cta: 'Scan Data Brokers'
    },
    'file_scan': {
      icon: '🛡️',
      title: 'File Security Scanner',
      description: 'Scan files for viruses and malware',
      cta: 'Scan File for Threats'
    },
    'account_deleter': {
      icon: '🗑️',
      title: 'Account Deletion Assistant',
      description: 'Get help deleting accounts from platforms',
      cta: 'Delete Accounts'
    },
    'area_code_checker': {
      icon: '📞',
      title: 'Phone Number Checker',
      description: 'Check phone numbers for scam patterns',
      cta: 'Check Phone Number'
    },
    'ai_defense': {
      icon: '🤖',
      title: 'AI Cyber Defense Strategist',
      description: 'Generate AI-powered cybersecurity strategies',
      cta: 'Generate Defense Strategy'
    },
    'comprehensive_security': {
      icon: '🛡️',
      title: 'Comprehensive Security Assessment',
      description: 'Complete multi-vector security analysis',
      cta: 'Run Security Assessment'
    },
    'network_scan': {
      icon: '🌐',
      title: 'Network Vulnerability Scanner',
      description: 'Analyze network infrastructure security',
      cta: 'Scan Network'
    },
    'security_test_suite': {
      icon: '🛡️',
      title: 'Security Test Suite',
      description: 'Comprehensive vulnerability testing and security analysis',
      cta: 'Run Security Tests'
    }
  };

  const ToolComponent = toolComponents[toolType];
  const meta = toolMeta[toolType];

  if (!ToolComponent || !meta) {
    return null;
  }

  const handleToolComplete = (result) => {
    setHasInteracted(true);
    onToolResult && onToolResult(result);
  };

  const handleToolClose = () => {
    setIsExpanded(false);
  };

  const handleExpand = () => {
    setIsExpanded(true);
    setHasInteracted(true);
  };

  return (
    <div className={`inline-tool-renderer ${className}`}>
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Collapsed state - shows as an interactive card in the chat
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`tool-card ${hasInteracted ? 'used' : ''}`}
            data-tool={toolType}
            onClick={handleExpand}
          >
            <div className="tool-card-header">
              <span className="tool-icon">{meta.icon}</span>
              <div className="tool-info">
                <h4 className="tool-title">{meta.title}</h4>
                <p className="tool-description">{meta.description}</p>
              </div>
              <button className="expand-btn">
                {meta.cta} →
              </button>
            </div>
            
            {toolData && (
              <div className="tool-preview">
                {/* Show contextual preview based on toolData */}
                {toolType === 'password_checker' && toolData.suggestedPassword && (
                  <p className="preview-text">
                    💡 I can check if "{toolData.suggestedPassword}" is secure
                  </p>
                )}
                {toolType === 'email_breach' && toolData.suggestedEmail && (
                  <p className="preview-text">
                    💡 I can scan {toolData.suggestedEmail} for breaches
                  </p>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          // Expanded state - shows the full tool
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="tool-expanded"
          >
            <ToolComponent
              onComplete={handleToolComplete}
              onClose={handleToolClose}
              initialData={toolData}
              isInline={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InlineToolRenderer;