// Enhanced useChat hook with seamless tool integration
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GEMINI_API_KEY, GEMINI_API_URL, GEMINI_MODEL } from '../config/constants';
import { getApiUrl, devLog } from '../config/environment';
import CyberForgetEmailWiper from '../services/breachService';
import conversationContext from '../services/conversationContext';
import intelligentSecurityAssistant from '../services/intelligentSecurityAssistant';

export const useSeamlessChat = () => {
    // Navigation hook
    const navigate = useNavigate();
    
    // State management
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [showWelcome, setShowWelcome] = useState(true);
    const [thinkingStage, setThinkingStage] = useState('');
    const [isAskingName, setIsAskingName] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // Generate unique ID for messages
    const generateMessageId = useCallback(() => 
        `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, 
    []);

    // Load messages from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('seamlessChatMessages');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    const messagesWithIds = parsed.map(msg => ({
                        ...msg,
                        id: msg.id || generateMessageId()
                    }));
                    setMessages(messagesWithIds);
                    setShowWelcome(false);
                }
            } catch (err) {
                console.error('Error loading chat messages:', err);
            }
        }
    }, [generateMessageId]);

    // Save messages to localStorage on update
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('seamlessChatMessages', JSON.stringify(messages));
        }
    }, [messages]);

    // Enhanced message handling with intelligent tool integration
    const handleSendMessage = useCallback(async (message) => {
        // Handle event objects passed from button clicks
        if (message && typeof message === 'object' && message.preventDefault) {
            message = undefined; // Reset to use userInput instead
        }
        
        // Use the message parameter if provided, otherwise use userInput
        const messageToSend = message || userInput;
        
        // Ensure messageToSend is a string before calling trim
        if (!messageToSend || typeof messageToSend !== 'string' || !messageToSend.trim()) return;

        // Add user message
        const userMessage = {
            id: generateMessageId(),
            role: 'user',
            content: messageToSend,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setShowWelcome(false);
        setIsTyping(true);

        try {
            // Get the most up-to-date messages including the user message we just added
            const currentMessages = [...messages, userMessage];
            
            // Use intelligent security assistant to process the message
            const response = await intelligentSecurityAssistant.processUserMessage(
                messageToSend, 
                currentMessages
            );

            // Create AI response
            const aiMessage = {
                id: generateMessageId(),
                role: 'assistant',
                content: response.content,
                timestamp: new Date(),
                nextActions: response.nextActions,
                securityInsights: response.securityInsights
            };

            const messagesToAdd = [aiMessage];

            // Create separate tool messages if any tools are suggested
            if (response.suggestedTools && response.suggestedTools.length > 0) {
                response.suggestedTools.forEach((tool, index) => {
                    const toolMessage = {
                        id: generateMessageId(),
                        role: 'tool',
                        toolType: tool.type,
                        toolData: { 
                            ...tool.data, 
                            autoOpen: tool.autoOpen || false // Don't auto-open for regular messages
                        },
                        timestamp: new Date(),
                        isFullWidth: true
                    };
                    messagesToAdd.push(toolMessage);
                });
            }

            setMessages(prev => [...prev, ...messagesToAdd]);
            
        } catch (error) {
            console.error('Error processing message:', error);
            
            // Fallback response
            const errorMessage = {
                id: generateMessageId(),
                role: 'assistant',
                content: `I apologize, but I encountered an error processing your request. This might be due to a temporary issue with my systems.

Let me try to help you with your security question in a different way. Could you please rephrase your question or let me know what specific security concern you have?`,
                timestamp: new Date(),
                error: true
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    }, [messages, generateMessageId, userInput]);

    // Handle tool completion and generate follow-up responses
    const handleToolResult = useCallback(async (toolResult) => {
        try {
            // Handle tool redirections
            if (toolResult.type === 'redirect_to_tool') {
                // Create a new assistant message that opens the target tool
                const redirectMessage = {
                    id: generateMessageId(),
                    role: 'assistant',
                    content: `I'll run the comprehensive security assessment for you now. Let me start the analysis to help protect your digital security.`,
                    timestamp: new Date(),
                    tool: toolResult.tool,
                    scanData: toolResult.data,
                    toolResult: {
                        ...toolResult,
                        type: toolResult.tool // Change type to the target tool name
                    },
                    isToolResult: true,
                    autoOpenTool: true // Flag to auto-open the tool
                };

                setMessages(prev => [...prev, redirectMessage]);
                return;
            }
            
            // Store the tool result in the message history for context
            const toolResultMessage = {
                id: generateMessageId(),
                role: 'assistant',
                content: toolResult.summary || `${toolResult.type} completed successfully.`,
                timestamp: new Date(),
                tool: toolResult.type,
                scanData: toolResult.data,
                toolResult: toolResult,
                isToolResult: true
            };

            setMessages(prev => [...prev, toolResultMessage]);
            
            // Don't automatically generate a follow-up message
            // Let the user ask questions and Gemini will respond with full context
            
        } catch (error) {
            console.error('Error processing tool result:', error);
            
            // Simple acknowledgment if follow-up fails
            const ackMessage = {
                id: generateMessageId(),
                role: 'assistant',
                content: `Thank you for using the security tool. The results have been processed. Is there anything else I can help you with regarding your digital security?`,
                timestamp: new Date(),
                toolFollowUp: true
            };

            setMessages(prev => [...prev, ackMessage]);
        }
    }, [generateMessageId]);

    // Handle pre-made question clicks
    const handlePreMadeQuestionClick = useCallback((question, options = {}) => {
        // Store info that this is a premade question for tool auto-opening
        const messageToSend = question;
        
        // Handle event objects passed from button clicks
        if (question && typeof question === 'object' && question.preventDefault) {
            return; // Invalid call
        }
        
        // Ensure messageToSend is a string before calling trim
        if (!messageToSend || typeof messageToSend !== 'string' || !messageToSend.trim()) return;

        // Add user message
        const userMessage = {
            id: generateMessageId(),
            role: 'user',
            content: messageToSend,
            timestamp: new Date(),
            isPremadeQuestion: true, // Flag to identify premade questions
            toolType: options.toolType // Pass through the expected tool type
        };

        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setShowWelcome(false);
        setIsTyping(true);

        // Process the premade question
        const processPremadeQuestion = async () => {
            try {
                // Get the most up-to-date messages including the user message we just added
                const currentMessages = [...messages, userMessage];
                
                // Use intelligent security assistant to process the message
                const response = await intelligentSecurityAssistant.processUserMessage(
                    messageToSend, 
                    currentMessages
                );

                // Create AI response with embedded tools and auto-open flag for premade questions
                const aiMessage = {
                    id: generateMessageId(),
                    role: 'assistant',
                    content: response.content,
                    timestamp: new Date(),
                    nextActions: response.nextActions,
                    securityInsights: response.securityInsights
                };

                const messagesToAdd = [aiMessage];

                // For premade questions, create only the specific tool that should auto-open
                // Don't create suggested tool cards since the main tool opens automatically
                if (options.toolType) {
                    const toolMessage = {
                        id: generateMessageId(),
                        role: 'tool',
                        toolType: options.toolType,
                        toolData: { 
                            autoOpen: true // Auto-open the specific tool from the premade question
                        },
                        timestamp: new Date(),
                        isFullWidth: true
                    };
                    messagesToAdd.push(toolMessage);
                }

                setMessages(prev => [...prev, ...messagesToAdd]);
                
            } catch (error) {
                console.error('Error processing premade question:', error);
                
                // Fallback response
                const errorMessage = {
                    id: generateMessageId(),
                    role: 'assistant',
                    content: `I apologize, but I encountered an error processing your request. Let me help you with your security analysis in a different way.`,
                    timestamp: new Date(),
                    error: true
                };

                setMessages(prev => [...prev, errorMessage]);
            } finally {
                setIsTyping(false);
            }
        };

        processPremadeQuestion();
    }, [messages, generateMessageId]);

    // Handle option clicks (for legacy compatibility)
    const handleOptionClick = useCallback((option) => {
        if (option.capability) {
            // Handle capability-based options
            const capabilityMessage = {
                id: generateMessageId(),
                role: 'assistant',
                content: generateCapabilityResponse(option.capability),
                timestamp: new Date(),
                capability: option.capability
            };
            
            setMessages(prev => [...prev, capabilityMessage]);
        } else if (option.url) {
            // Handle URL-based options
            navigate(option.url);
        }
    }, [navigate, generateMessageId]);

    // Generate capability responses
    const generateCapabilityResponse = (capability) => {
        const responses = {
            security_plan: `Here's a personalized security action plan:

**Immediate Actions:**
1. Change passwords on critical accounts
2. Enable two-factor authentication
3. Check for account breaches
4. Review privacy settings

**This Week:**
1. Clean up old accounts
2. Update software and apps
3. Review bank and credit card statements
4. Set up security monitoring

**Ongoing:**
1. Regular password updates
2. Monthly security reviews
3. Stay informed about new threats
4. Maintain good security habits

Would you like me to help you with any specific step?`,

            password_strategy: `Here's your personalized password strategy:

**Password Manager Setup:**
1. Choose a reputable password manager (1Password, Bitwarden, etc.)
2. Generate unique passwords for all accounts
3. Use 16+ characters with mixed complexity
4. Enable two-factor authentication

**Implementation Plan:**
1. Start with critical accounts (email, banking)
2. Update social media and shopping accounts
3. Replace any reused passwords
4. Set up security alerts

**Maintenance:**
1. Regular password audits
2. Update compromised passwords immediately
3. Review account activity monthly
4. Keep password manager updated

Would you like me to help you check your current passwords for breaches?`,

            privacy_checklist: `Here's your privacy protection checklist:

**Data Exposure Check:**
□ Scan data broker sites for your information
□ Check email addresses for breaches
□ Review social media privacy settings
□ Audit app permissions on devices

**Cleanup Actions:**
□ Remove unnecessary personal information online
□ Delete old, unused accounts
□ Opt out of data broker databases
□ Update privacy settings on all platforms

**Ongoing Protection:**
□ Use privacy-focused browsers and search engines
□ Enable two-factor authentication
□ Monitor credit reports regularly
□ Review and limit data sharing

Would you like me to help you start with any of these steps?`
        };

        return responses[capability] || 'I can help you with that. What would you like to know more about?';
    };

    // Handle email wiper scan (legacy compatibility)
    const handleEmailWiperScan = useCallback(async (email) => {
        try {
            const result = await CyberForgetEmailWiper.checkEmailBreaches(email);
            const report = CyberForgetEmailWiper.formatBreachReport(email, result);
            
            // Add scan result as message
            const scanMessage = {
                id: generateMessageId(),
                role: 'assistant',
                content: report,
                timestamp: new Date(),
                emailScanResult: result
            };
            
            setMessages(prev => [...prev, scanMessage]);
            
            return { report, result };
        } catch (error) {
            console.error('Email scan error:', error);
            throw error;
        }
    }, [generateMessageId]);

    // Handle new chat
    const handleNewChat = useCallback(() => {
        setMessages([]);
        setUserInput('');
        setShowWelcome(true);
        setIsTyping(false);
        setThinkingStage('');
        localStorage.removeItem('seamlessChatMessages');
        
        // Reset security expert system
        intelligentSecurityAssistant.handleNewChat();
        
        console.log('🆕 New chat started - localStorage and expert system cleared');
    }, []);

    // Return hook interface
    return {
        messages,
        userInput,
        showWelcome,
        thinkingStage,
        isAskingName,
        isTyping,
        setUserInput,
        handleSendMessage,
        handleOptionClick,
        handlePreMadeQuestionClick,
        handleNewChat,
        handleEmailWiperScan,
        handleToolResult
    };
};

export default useSeamlessChat;