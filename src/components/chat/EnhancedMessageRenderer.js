// Enhanced Message Renderer - Automatically embeds tools in AI responses
import React from 'react';
import ReactMarkdown from 'react-markdown';
import InlineToolRenderer from './InlineToolRenderer';
import conversationalToolDetector from '../../services/conversationalToolDetector';
import './EnhancedMessageRenderer.css';

const EnhancedMessageRenderer = ({ 
  message, 
  conversationHistory = [],
  onToolResult,
  className = '' 
}) => {
  // Parse the message content for tool suggestions
  const parseMessageForTools = (content) => {
    // Check if the AI should suggest tools based on the conversation
    const toolSuggestions = conversationalToolDetector.detectToolsInMessage(
      content, 
      conversationHistory
    );

    return toolSuggestions.filter(tool => tool.confidence > 0.7); // Only high-confidence suggestions
  };

  // Enhanced content processing for AI responses
  const processAIResponse = (content) => {
    // If this is an AI response, check if we should suggest tools
    if (message.role === 'assistant') {
      // First check if the message already has suggested tools from the intelligent security assistant
      if (message.suggestedTools && message.suggestedTools.length > 0) {
        return message.suggestedTools;
      }

      // Fallback: Look at the last user message to determine tool suggestions
      const lastUserMessage = conversationHistory
        .slice()
        .reverse()
        .find(msg => msg.role === 'user');

      if (lastUserMessage) {
        const suggestions = conversationalToolDetector.detectToolsInMessage(
          lastUserMessage.content,
          conversationHistory.slice(0, -1) // Exclude the last message to avoid circular reference
        );

        // Only suggest if confidence is high and content is relevant
        return suggestions.filter(tool => 
          tool.confidence > 0.75 && 
          isToolRelevantToResponse(tool, content)
        );
      }
    }

    return [];
  };

  // Check if a tool suggestion is relevant to the AI's response
  const isToolRelevantToResponse = (tool, responseContent) => {
    const relevanceKeywords = {
      password_checker: ['password', 'security', 'strength', 'compromise', 'crack', 'vulnerabilities'],
      email_breach: ['email', 'breach', 'compromise', 'data leak', 'hack', 'breaches'],
      data_broker_scan: ['privacy', 'personal info', 'data broker', 'online presence', 'digital footprint', 'security posture'],
      file_scan: ['file', 'virus', 'malware', 'scan', 'security', 'threat'],
      account_deleter: ['account', 'delete', 'remove', 'privacy', 'social media'],
      area_code_checker: ['phone', 'number', 'scam', 'call', 'area code'],
      comprehensive_security: ['comprehensive', 'assessment', 'security', 'analysis', 'audit', 'threat intelligence'],
      ai_defense: ['ai', 'defense', 'strategy', 'cyber defense', 'protection'],
      network_scan: ['network', 'vulnerability', 'infrastructure', 'exposure']
    };

    const keywords = relevanceKeywords[tool.type] || [];
    const contentLower = responseContent.toLowerCase();
    
    return keywords.some(keyword => contentLower.includes(keyword));
  };

  // Render tool suggestions as interactive cards
  const renderToolSuggestions = (suggestions) => {
    return suggestions.map((suggestion, index) => (
      <InlineToolRenderer
        key={`tool-${suggestion.type}-${index}`}
        toolType={suggestion.type}
        toolData={suggestion.data}
        onToolResult={onToolResult}
        className="ai-suggested-tool"
      />
    ));
  };

  // Custom markdown renderers for enhanced content
  const markdownComponents = {
    // Custom paragraph renderer that can inject tools
    p: ({ children, ...props }) => {
      const text = children?.toString() || '';
      
      // Check if this paragraph should trigger a tool suggestion
      if (text.includes('**TOOL_SUGGESTION**')) {
        return null; // Remove the marker, tools will be rendered separately
      }
      
      return <p {...props}>{children}</p>;
    },
    
    // Enhanced link rendering
    a: ({ href, children, ...props }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="message-link"
        {...props}
      >
        {children}
      </a>
    ),
    
    // Code block styling
    code: ({ inline, children, ...props }) => (
      <code 
        className={inline ? 'inline-code' : 'code-block'} 
        {...props}
      >
        {children}
      </code>
    ),
    
    // Enhanced list rendering
    ul: ({ children, ...props }) => (
      <ul className="message-list" {...props}>{children}</ul>
    ),
    
    li: ({ children, ...props }) => (
      <li className="message-list-item" {...props}>{children}</li>
    )
  };

  // Main render logic
  const renderContent = () => {
    const content = message.content || '';
    
    // Check if this is a response to a premade question
    const lastUserMessage = conversationHistory
      .slice()
      .reverse()
      .find(msg => msg.role === 'user');
    
    const isResponseToPremadeQuestion = lastUserMessage?.isPremadeQuestion;
    
    // Don't show tool suggestions if this is a response to a premade question
    // since the tool will auto-open separately
    const toolSuggestions = isResponseToPremadeQuestion ? [] : processAIResponse(content);
    
    // Check if we should add conversational tool offers
    const shouldOfferTools = message.role === 'assistant' && toolSuggestions.length > 0 && !isResponseToPremadeQuestion;
    
    return (
      <div className={`enhanced-message-content ${className}`}>
        {/* Main message content */}
        <div className="message-text">
          <ReactMarkdown components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </div>
        
        {/* Tool suggestions (only for AI responses with high confidence) */}
        {shouldOfferTools && (
          <div className="tool-suggestions-section">
            {renderToolSuggestions(toolSuggestions)}
          </div>
        )}
        
        {/* Handle tool results and redirections */}
        {message.toolResult && (
          <div className="tool-result-section">
            {message.autoOpenTool && message.tool ? (
              // Auto-open the target tool for redirections
              <InlineToolRenderer
                key={`redirect-tool-${message.tool}`}
                toolType={message.tool}
                toolData={{
                  ...message.scanData,
                  autoOpen: true
                }}
                onToolResult={onToolResult}
                className="redirected-tool auto-open"
              />
            ) : (
              // Show legacy tool result summary
              <div className="tool-result-summary">
                ✅ Tool completed: {message.toolResult.summary || message.content}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return renderContent();
};

// Higher-order component for seamless tool integration
export const withSeamlessTools = (MessageComponent) => {
  return (props) => {
    const { message, conversationHistory, onToolResult, ...otherProps } = props;
    
    // If this is a message that could benefit from tool integration
    if (message.role === 'assistant' || message.role === 'user') {
      return (
        <EnhancedMessageRenderer
          message={message}
          conversationHistory={conversationHistory}
          onToolResult={onToolResult}
          {...otherProps}
        />
      );
    }
    
    // Fallback to original component
    return <MessageComponent {...props} />;
  };
};

export default EnhancedMessageRenderer;