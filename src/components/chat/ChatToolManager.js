// Chat Tool Manager - Manages embedded tools in chat interface
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TOOL_REGISTRY, { findToolByMessage, getToolByCommand } from './tools/ToolRegistry';
import './ChatToolManager.css';

const ChatToolManager = ({ 
  onToolResult, 
  onToolTrigger,
  toolTrigger = null,
  className = '' 
}) => {
  const [activeTool, setActiveTool] = useState(null);
  const [toolHistory, setToolHistory] = useState([]);

  // Handle tool trigger from parent component (chat)
  useEffect(() => {
    if (toolTrigger) {
      const tool = getToolByCommand(toolTrigger.command);
      if (tool) {
        openTool(tool, toolTrigger.context);
      }
    }
  }, [toolTrigger]);

  const openTool = useCallback((toolConfig, context = null) => {
    const newTool = {
      id: `tool_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      config: toolConfig,
      context: context,
      openedAt: new Date()
    };

    setActiveTool(newTool);
    
    // Add to history
    setToolHistory(prev => [newTool, ...prev.slice(0, 9)]); // Keep last 10 tools
    
    // Notify parent that tool was opened
    onToolTrigger && onToolTrigger({
      type: 'tool_opened',
      tool: toolConfig.command,
      context: context
    });
  }, [onToolTrigger]);

  const closeTool = useCallback(() => {
    if (activeTool) {
      // Notify parent that tool was closed
      onToolTrigger && onToolTrigger({
        type: 'tool_closed',
        tool: activeTool.config.command
      });
      
      setActiveTool(null);
    }
  }, [activeTool, onToolTrigger]);

  const handleToolComplete = useCallback((result) => {
    // Send result back to chat
    onToolResult && onToolResult({
      toolId: activeTool?.id,
      toolName: activeTool?.config.name,
      toolCommand: activeTool?.config.command,
      result: result,
      timestamp: new Date()
    });

    // Handle special result types
    if (result.type === 'trigger_tool') {
      // One tool triggered another
      const nextTool = getToolByCommand(result.tool);
      if (nextTool) {
        setTimeout(() => {
          openTool(nextTool, result.context);
        }, 500);
      }
    }
  }, [activeTool, onToolResult, openTool]);

  // Function to suggest tools based on message
  const suggestTool = useCallback((message) => {
    const tool = findToolByMessage(message);
    if (tool) {
      return {
        suggestion: tool,
        confidence: calculateConfidence(message, tool)
      };
    }
    return null;
  }, []);

  const calculateConfidence = (message, tool) => {
    const messageLower = message.toLowerCase();
    let confidence = 0;
    
    // Check for exact command match
    if (messageLower.startsWith(tool.command)) {
      confidence = 0.9;
    } else {
      // Check trigger words
      const matchedTriggers = tool.triggers.filter(trigger => 
        messageLower.includes(trigger)
      );
      confidence = Math.min(0.8, matchedTriggers.length * 0.2);
    }
    
    return confidence;
  };

  // Quick access panel component
  const QuickAccessPanel = () => {
    const recentTools = toolHistory.slice(0, 3);
    
    return (
      <div className="quick-access-panel">
        <h4>Quick Access Tools</h4>
        <div className="quick-tools-grid">
          {Object.entries(TOOL_REGISTRY).slice(0, 6).map(([command, tool]) => (
            <button
              key={command}
              className="quick-tool-btn"
              onClick={() => openTool(tool)}
              title={tool.description}
            >
              <span className="tool-icon">{tool.icon}</span>
              <span className="tool-name">{tool.name}</span>
            </button>
          ))}
        </div>
        
        {recentTools.length > 0 && (
          <div className="recent-tools">
            <h5>Recently Used</h5>
            <div className="recent-tools-list">
              {recentTools.map((tool) => (
                <button
                  key={tool.id}
                  className="recent-tool-btn"
                  onClick={() => openTool(tool.config, tool.context)}
                >
                  <span className="tool-icon">{tool.config.icon}</span>
                  {tool.config.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Tool suggestion component
  const ToolSuggestion = ({ suggestion, onAccept, onDismiss }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="tool-suggestion"
    >
      <div className="suggestion-content">
        <span className="suggestion-icon">{suggestion.icon}</span>
        <div className="suggestion-text">
          <strong>{suggestion.name}</strong>
          <p>{suggestion.description}</p>
        </div>
      </div>
      <div className="suggestion-actions">
        <button className="accept-btn" onClick={onAccept}>
          Use Tool
        </button>
        <button className="dismiss-btn" onClick={onDismiss}>
          ×
        </button>
      </div>
    </motion.div>
  );

  // Render active tool
  const renderActiveTool = () => {
    if (!activeTool) return null;

    const ToolComponent = activeTool.config.component;
    
    return (
      <motion.div
        key={activeTool.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="active-tool-container"
      >
        <ToolComponent
          onComplete={handleToolComplete}
          onClose={closeTool}
          context={activeTool.context}
        />
      </motion.div>
    );
  };

  return (
    <div className={`chat-tool-manager ${className}`}>
      <AnimatePresence mode="wait">
        {activeTool ? (
          renderActiveTool()
        ) : (
          <motion.div
            key="quick-access"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuickAccessPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Export the suggestion function for use in chat
export const createToolSuggestion = (message) => {
  const tool = findToolByMessage(message);
  if (tool) {
    return {
      type: 'tool_suggestion',
      tool: tool,
      message: `I can help you with that using the ${tool.name}. Would you like me to open it?`
    };
  }
  return null;
};

// Export function to check if message contains tool commands
export const extractToolCommand = (message) => {
  const messageLower = message.toLowerCase().trim();
  
  for (const [command, tool] of Object.entries(TOOL_REGISTRY)) {
    if (messageLower.startsWith(command)) {
      return {
        command: command,
        tool: tool,
        parameters: messageLower.replace(command, '').trim()
      };
    }
  }
  
  return null;
};

export default ChatToolManager;