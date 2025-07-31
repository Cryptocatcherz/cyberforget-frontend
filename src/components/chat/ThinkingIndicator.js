import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ThinkingIndicator.css';

const ThinkingIndicator = ({ stage }) => {
  const [currentStage, setCurrentStage] = useState('Analyzing your request...');
  const [insights, setInsights] = useState([]);
  
  const stages = [
    'Analyzing your security request...',
    'Evaluating threat landscape...',
    'Identifying relevant security tools...',
    'Preparing personalized recommendations...',
    'Finalizing security analysis...'
  ];
  
  const securityInsights = [
    { icon: '🔍', text: 'Threat Analysis' },
    { icon: '🛡️', text: 'Security Tools' },
    { icon: '📊', text: 'Risk Assessment' },
    { icon: '🔐', text: 'Protection Strategy' }
  ];
  
  useEffect(() => {
    if (stage) {
      setCurrentStage(stage);
    } else {
      // Cycle through stages if no specific stage is provided
      const interval = setInterval(() => {
        setCurrentStage(prev => {
          const currentIndex = stages.indexOf(prev);
          return stages[(currentIndex + 1) % stages.length];
        });
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [stage]);
  
  useEffect(() => {
    // Show insights progressively
    const timers = securityInsights.map((insight, index) => {
      return setTimeout(() => {
        setInsights(prev => [...prev, insight]);
      }, 500 + (index * 300));
    });
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);
  
  return (
    <motion.div
      className="thinking-indicator-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="thinking-indicator-wrapper">
        <div className="thinking-header">
          <div className="ai-avatar">
            <span>🤖</span>
          </div>
          <h3 className="thinking-title">CyberForget AI is thinking...</h3>
        </div>
        
        <div className="thinking-content">
          <div className="typing-dots-container">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="thinking-stage">{currentStage}</p>
          </div>
          
          <div className="thinking-progress">
            <div className="thinking-progress-bar"></div>
          </div>
          
          <AnimatePresence>
            {insights.length > 0 && (
              <motion.div 
                className="thinking-insights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    className="insight-chip"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="insight-chip-icon">{insight.icon}</span>
                    <span>{insight.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ThinkingIndicator;