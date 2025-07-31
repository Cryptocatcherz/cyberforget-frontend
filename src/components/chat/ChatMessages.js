import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { environment } from '../../config/environment';
import SecurityTools from './SecurityTools';
import EmailScanPopup from '../EmailScanPopup';
import EmailScanResult from '../EmailScanResult';

const messageVariants = {
    initial: { 
        opacity: 0, 
        y: 15,
        scale: 0.98
    },
    animate: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
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

// eslint-disable-next-line no-unused-vars
const textVariants = {
    initial: { opacity: 0 },
    animate: { 
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

// eslint-disable-next-line no-unused-vars
const formatMessageContent = (content) => {
    if (!content) return { mainText: '', tldr: '' };
    
    const parts = content.split('TLDR:');
    if (parts.length === 2) {
        return {
            mainText: parts[0].trim(),
            tldr: parts[1].trim()
        };
    }
    return {
        mainText: content,
        tldr: ''
    };
};

const MultipleChoiceAnswers = ({ options, onOptionClick }) => {
    const navigate = useNavigate();
    
    if (!options || !Array.isArray(options)) return null;
    
    const handleOptionClick = (option) => {
        if (option.url) {
            // Check if it's a frontend route (starts with "/") or external URL
            if (option.url.startsWith('/')) {
                // Internal frontend route - navigate within the app
                navigate(option.url);
            } else {
                // External URL - open in new tab
                window.open(option.url, '_blank');
            }
        } else {
            // No URL - handle as chat option
            onOptionClick(option.text, option.url, option.capability);
        }
    };
    
    return (
        <motion.div 
            className="multiple-choice-answers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
        >
            <div className="follow-up-title">Suggested Next Steps:</div>
            {options.map((option, index) => (
                <div className="glass-card" key={index}>
                    <motion.button
                        className={`option-button ${option.url ? 'with-tool' : option.capability ? 'with-ai' : ''}`}
                        onClick={() => handleOptionClick(option)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                        whileHover={{ 
                            scale: 1.02,
                            backgroundColor: 'transparent',
                            transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.98 }}
                        style={{ background: 'transparent', boxShadow: 'none', border: 'none', width: '100%', padding: 0 }}
                    >
                        <span className="option-icon">{option.icon}</span>
                        <span className="option-text">{option.text}</span>
                        {option.url && (
                            <motion.span 
                                className="tool-indicator"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 + 0.6 }}
                            >
                                Try Tool →
                            </motion.span>
                        )}
                        {option.capability && (
                            <motion.span 
                                className="ai-indicator"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 + 0.6 }}
                            >
                                AI Plan →
                            </motion.span>
                        )}
                    </motion.button>
                </div>
            ))}
        </motion.div>
    );
};

const TypingIndicator = () => {
    const [currentStep, setCurrentStep] = React.useState(0);
    
    const thinkingSteps = [
        {
            status: "Loading neural pathways...",
            code: [
                "import { SecurityAnalyzer } from '@raven/neural-core';",
                "const analyzer = new SecurityAnalyzer({",
                "  threatDetection: 'advanced',",
                "  patterns: userQuery.parseContext()",
                "});"
            ]
        },
        {
            status: "Scanning threat vectors...", 
            code: [
                "// Analyzing digital footprint",
                "async function assessRisk(userInput) {",
                "  const threats = await scanVulnerabilities();",
                "  return calculateRiskMatrix(threats);",
                "}"
            ]
        },
        {
            status: "Consulting security databases...",
            code: [
                "const securityDB = connectTo('NIST_Framework');",
                "const recommendations = await Promise.all([",
                "  securityDB.getBestPractices(),",
                "  threatIntel.getLatestVectors()",
                "]);"
            ]
        },
        {
            status: "Generating defense strategies...",
            code: [
                "const strategy = {",
                "  priority: calculateUrgency(threats),",
                "  actions: generateActionPlan(),",
                "  timeline: optimizeImplementation()",
                "};"
            ]
        },
        {
            status: "Optimizing recommendations...",
            code: [
                "// Personalizing security measures",
                "recommendations.filter(r => r.applicable)",
                "  .sort((a, b) => b.impact - a.impact)",
                "  .map(r => ({ ...r, personalized: true }));"
            ]
        }
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep(prev => (prev + 1) % thinkingSteps.length);
        }, 2000); // Slower transition for better readability
        
        return () => clearInterval(interval);
    }, [thinkingSteps.length]);

    return (
        <div className="typing-indicator-enhanced">
            <div className="ai-thinking">
                <div className="thinking-header">
                    <div>
                        <span className="thinking-icon">🧠</span>
                        <span>CyberForget AI Processing</span>
                    </div>
                    <div className="thinking-status">{thinkingSteps[currentStep].status}</div>
                </div>
                <div className="pseudo-code">
                    {thinkingSteps[currentStep].code.map((line, index) => (
                        <motion.div 
                            key={`${currentStep}-${index}`}
                            className="code-line"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {line.startsWith('//') ? (
                                <span className="code-comment">{line}</span>
                            ) : line.includes('import') || line.includes('const') || line.includes('async') ? (
                                <>
                                    <span className="code-keyword">
                                        {line.match(/(import|const|async|function|await|return)/g)?.[0] || ''}
                                    </span>
                                    <span className="code-text">
                                        {line.replace(/(import|const|async|function|await|return)/, '')}
                                    </span>
                                </>
                            ) : line.includes("'") || line.includes('"') ? (
                                <span className="code-string">{line}</span>
                            ) : line.includes('.') && (line.includes('(') || line.includes('[')) ? (
                                <span className="code-method">{line}</span>
                            ) : (
                                <span className="code-text">{line}</span>
                            )}
                        </motion.div>
                    ))}
                </div>
                <div className="ai-progress">
                    <div className="progress-bar">
                        <motion.div 
                            className="progress-fill"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                        />
                    </div>
                    <div className="loading-dots">
                        <motion.span
                            initial={{ opacity: 0.3 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        />
                        <motion.span
                            initial={{ opacity: 0.3 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
                        />
                        <motion.span
                            initial={{ opacity: 0.3 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.4 }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Component for gradual text appearance at 6 words per second
const GradualText = ({ content, isComplete, onComplete }) => {
    const [displayedWords, setDisplayedWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const words = content.split(' ');
    const wordsPerSecond = 9;
    const intervalTime = 1000 / wordsPerSecond; // ~111ms per word (50% faster)
    
    useEffect(() => {
        if (isComplete) {
            // If message is complete, show all words immediately
            setDisplayedWords(words);
            setCurrentIndex(words.length);
            if (onComplete) onComplete();
            return;
        }
        
        if (currentIndex < words.length) {
            const timer = setTimeout(() => {
                setDisplayedWords(prev => [...prev, words[currentIndex]]);
                setCurrentIndex(prev => prev + 1);
            }, intervalTime);
            
            return () => clearTimeout(timer);
        } else if (onComplete && currentIndex === words.length) {
            onComplete();
        }
    }, [currentIndex, words, intervalTime, isComplete, onComplete]);
    
    // Reset when content changes
    useEffect(() => {
        setDisplayedWords([]);
        setCurrentIndex(0);
    }, [content]);
    
    return (
        <span>
            {displayedWords.map((word, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ marginRight: '0.25em' }}
                >
                    {word}
                </motion.span>
            ))}
            {currentIndex < words.length && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ marginLeft: '0.1em' }}
                >
                    |
                </motion.span>
            )}
        </span>
    );
};

const MessageContent = ({ content, isStrategy, isAssistant, isComplete = false, onTextComplete }) => {
    const [textComplete, setTextComplete] = useState(isComplete);
    
    if (isStrategy) {
        return (
            <div className="message-content">
                {isAssistant && !isComplete ? (
                    <GradualText 
                        content={content}
                        isComplete={isComplete}
                        onComplete={() => {
                            setTextComplete(true);
                            if (onTextComplete) onTextComplete();
                        }}
                    />
                ) : (
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({children}) => <p>{children}</p>,
                            strong: ({children}) => <strong>{children}</strong>,
                            em: ({children}) => <em>{children}</em>,
                            ul: ({children}) => <ul>{children}</ul>,
                            ol: ({children}) => <ol>{children}</ol>,
                            li: ({children}) => <li>{children}</li>,
                            code: ({children}) => <code>{children}</code>,
                            blockquote: ({children}) => <blockquote>{children}</blockquote>,
                            h1: ({children}) => <h1>{children}</h1>,
                            h2: ({children}) => <h2>{children}</h2>,
                            h3: ({children}) => <h3>{children}</h3>,
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                )}
            </div>
        );
    }

    // Handle non-string content (like email scan results)
    if (typeof content !== 'string') {
        console.error('MessageContent received non-string content:', content);
        return <div className="message-content">Unable to display this content.</div>;
    }

    const tldrIndex = content.indexOf('TLDR:');
    
    if (tldrIndex === -1) {
        return (
            <div className="message-content">
                {isAssistant && !isComplete ? (
                    <GradualText 
                        content={content}
                        isComplete={isComplete}
                        onComplete={() => {
                            setTextComplete(true);
                            if (onTextComplete) onTextComplete();
                        }}
                    />
                ) : (
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({children}) => <p>{children}</p>,
                            strong: ({children}) => <strong>{children}</strong>,
                            em: ({children}) => <em>{children}</em>,
                            ul: ({children}) => <ul>{children}</ul>,
                            ol: ({children}) => <ol>{children}</ol>,
                            li: ({children}) => <li>{children}</li>,
                            code: ({children}) => <code>{children}</code>,
                            blockquote: ({children}) => <blockquote>{children}</blockquote>,
                            h1: ({children}) => <h1>{children}</h1>,
                            h2: ({children}) => <h2>{children}</h2>,
                            h3: ({children}) => <h3>{children}</h3>,
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                )}
            </div>
        );
    }

    const mainContent = content.substring(0, tldrIndex).trim();
    const tldrContent = content.substring(tldrIndex).trim();

    return (
        <div className="message-content">
            {isAssistant && !isComplete ? (
                <GradualText 
                    content={mainContent}
                    isComplete={isComplete}
                    onComplete={() => {
                        setTextComplete(true);
                        if (onTextComplete) onTextComplete();
                    }}
                />
            ) : (
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                        p: ({children}) => <p>{children}</p>,
                        strong: ({children}) => <strong>{children}</strong>,
                        em: ({children}) => <em>{children}</em>,
                        ul: ({children}) => <ul>{children}</ul>,
                        ol: ({children}) => <ol>{children}</ol>,
                        li: ({children}) => <li>{children}</li>,
                        code: ({children}) => <code>{children}</code>,
                        blockquote: ({children}) => <blockquote>{children}</blockquote>,
                    }}
                >
                    {mainContent}
                </ReactMarkdown>
            )}
            
            {(textComplete || isComplete || !isAssistant) && (
                <motion.div 
                    className="tldr-section"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <span className="tldr-label">🔍 TLDR</span>
                    <div className="tldr-content">
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({children}) => <p>{children}</p>,
                                strong: ({children}) => <strong>{children}</strong>,
                            }}
                        >
                            {tldrContent.replace('TLDR:', '').trim()}
                        </ReactMarkdown>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const ChatMessage = React.forwardRef(({ message, onOptionClick, isTyping, isLatest }, ref) => {
    const isAssistant = message.role === 'assistant';
    const [showFollowUps, setShowFollowUps] = useState(!isLatest || !isAssistant);
    const [showOptions, setShowOptions] = useState(!isLatest || !isAssistant);
    const [textComplete, setTextComplete] = useState(!isLatest || !isAssistant);
    
    // For strategy messages, show options immediately
    const [strategyOptionsVisible, setStrategyOptionsVisible] = useState(true);

    // Only use gradual text for the latest assistant message, but NOT for strategy messages
    const shouldUseGradualText = isAssistant && isLatest && !isTyping && !message.isStrategy;

    // Reset states when message changes
    useEffect(() => {
        if (shouldUseGradualText) {
            setShowFollowUps(false);
            setShowOptions(false);
            setTextComplete(false);
        } else {
            setShowFollowUps(true);
            setShowOptions(true);
            setTextComplete(true);
        }
        
        // Strategy messages always show options immediately
        if (message.isStrategy) {
            setStrategyOptionsVisible(true);
            setShowOptions(true);
            setTextComplete(true);
        }
    }, [message.id, shouldUseGradualText, message.isStrategy]);

    const handleTextComplete = () => {
        console.log('Text completion triggered for message:', message.id);
        setTextComplete(true);
        
        // For strategy messages, show options after typing completes
        if (message.isStrategy) {
            setTimeout(() => {
                setStrategyOptionsVisible(true);
            }, 500);
        }
        
        // Show follow-ups after a delay
        setTimeout(() => {
            console.log('Showing follow-ups for message:', message.id);
            setShowFollowUps(true);
            
            // Show options after another delay
            setTimeout(() => {
                console.log('Showing options for message:', message.id);
                setShowOptions(true);
            }, 500);
        }, 300);
    };

    if (isTyping && isAssistant && !message.content) {
        return (
            <motion.div
                className="bot-response typing"
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
                ref={ref}
            >
                <TypingIndicator />
            </motion.div>
        );
    }
    
    return (
        <motion.div
            key={message.id}
            className={`${isAssistant ? 'bot-response' : 'user-message'}`}
            data-tool={message.tool || ''}
            data-strategy={message.isStrategy ? 'true' : 'false'}
            variants={messageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            layout
            ref={ref}
        >
            {isAssistant && (
                <motion.div 
                    className="bot-header"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <FaShieldAlt className="bot-icon" />
                    <span>CyberForget AI Security Expert</span>
                </motion.div>
            )}
            
            {/* Handle email scan results specially */}
            {message.isEmailScanResult && message.emailScanData ? (
                <EmailScanResult 
                    result={message.emailScanData}
                    onActionClick={(action) => {
                        console.log('Email scan action:', action);
                    }}
                />
            ) : (
                <MessageContent 
                    content={message.content} 
                    isStrategy={message.isStrategy} 
                    isAssistant={isAssistant} 
                    isComplete={!shouldUseGradualText}
                    onTextComplete={shouldUseGradualText ? handleTextComplete : undefined}
                />
            )}
            
            {/* Follow-up questions appear after text is complete */}
            {showFollowUps && message.followUpQuestions && message.followUpQuestions.length > 0 && (
                <FollowUpQuestions 
                    questions={message.followUpQuestions} 
                    onQuestionClick={(question) => onOptionClick(question)} 
                />
            )}
            
            {/* Then action buttons (tools and AI capabilities) */}
            {(message.isStrategy ? strategyOptionsVisible : showOptions) && message.options && message.options.length > 0 && (
                <MultipleChoiceAnswers 
                    options={message.options} 
                    onOptionClick={onOptionClick} 
                />
            )}
        </motion.div>
    );
});

ChatMessage.displayName = 'ChatMessage';

const FollowUpQuestions = ({ questions, onQuestionClick }) => {
    if (!questions || !Array.isArray(questions) || questions.length === 0) return null;
    
    return (
        <motion.div 
            className="follow-up-questions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
        >
            <div className="follow-up-title">💡 Continue the conversation:</div>
            <div className="question-chips">
                {questions.map((question, index) => {
                    // Handle both string and object formats
                    const questionText = typeof question === 'string' ? question : question.text;
                    const questionIcon = typeof question === 'object' ? question.icon : null;
                    
                    return (
                        <motion.button
                            key={index}
                            className="question-chip"
                            onClick={() => onQuestionClick(questionText)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.6 }}
                            whileHover={{ 
                                scale: 1.05,
                                backgroundColor: 'rgba(66, 255, 181, 0.15)',
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {questionIcon && <span className="question-icon">{questionIcon}</span>}
                            <span className="question-text">{questionText}</span>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
};

const ChatMessages = ({ messages, isTyping, onOptionClick, onEmailScan }) => {
    const endOfMessagesRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [userScrolledUp, setUserScrolledUp] = useState(false);
    const [showEmailPopup, setShowEmailPopup] = useState(false);
    const [emailScanResult, setEmailScanResult] = useState(null);
    const [lastMessageId, setLastMessageId] = useState(null);

    const handleEmailScan = async (email) => {
        if (onEmailScan) {
            const result = await onEmailScan(email);
            setEmailScanResult(result);
        }
    };

    const handleEmailPopupOpen = () => {
        setShowEmailPopup(true);
    };

    const handleEmailPopupClose = () => {
        setShowEmailPopup(false);
    };

    // Track the latest message to apply gradual text only to new assistant messages
    useEffect(() => {
        if (messages.length > 0) {
            const latestMessage = messages[messages.length - 1];
            if (latestMessage.role === 'assistant' && latestMessage.id !== lastMessageId) {
                setLastMessageId(latestMessage.id);
            }
        }
    }, [messages, lastMessageId]);



    // Expose email popup handler globally for welcome message
    useEffect(() => {
        window.openEmailScanPopup = handleEmailPopupOpen;
        return () => {
            delete window.openEmailScanPopup;
        };
    }, []);

    const isNearBottom = useCallback(() => {
        if (!chatContainerRef.current) return true;
        
        const container = chatContainerRef.current;
        const threshold = 150; // pixels from bottom
        
        return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    }, []);

    const scrollToBottomSmooth = useCallback(() => {
        if (!endOfMessagesRef.current) return;
        // Always autoscroll for enterprise UX
        endOfMessagesRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end',
            inline: 'nearest'
        });
    }, []);

    // Detect user scrolling
    useEffect(() => {
        if (!chatContainerRef.current) return;

        const container = chatContainerRef.current;
        let isScrolling = false;

        const handleScroll = () => {
            if (!isScrolling) {
                // User initiated scroll
                const isNearBottomNow = isNearBottom();
                setUserScrolledUp(!isNearBottomNow);
            }
        };

        const handleWheel = () => {
            isScrolling = true;
            setTimeout(() => { isScrolling = false; }, 100);
        };

        container.addEventListener('scroll', handleScroll);
        container.addEventListener('wheel', handleWheel);
        
        return () => {
            container.removeEventListener('scroll', handleScroll);
            container.removeEventListener('wheel', handleWheel);
        };
    }, [isNearBottom]);

    useEffect(() => {
        // Reset scroll behavior when new messages come in or typing state changes
        if (messages.length > 0 || isTyping) {
            const timer = setTimeout(() => {
                scrollToBottomSmooth();
            }, isTyping ? 100 : 200); // Faster scroll during typing
            
            return () => clearTimeout(timer);
        }
    }, [messages, isTyping, scrollToBottomSmooth]);

    // Additional effect specifically for typing state changes
    useEffect(() => {
        if (isTyping) {
            // Immediately scroll when typing starts
            scrollToBottomSmooth();
            
            // Set up interval to keep scrolling during typing
            const scrollInterval = setInterval(() => {
                scrollToBottomSmooth();
            }, 500);
            
            return () => clearInterval(scrollInterval);
        }
    }, [isTyping, scrollToBottomSmooth]);

    // Find the chat container parent
    useEffect(() => {
        const container = document.querySelector('.chat-history');
        if (container) {
            chatContainerRef.current = container.parentElement;
        }
    }, []);

    if (!messages || !Array.isArray(messages)) return null;

    const exchanges = messages.reduce((count, message, index) => {
        if (message.role === 'assistant' && index > 0 && messages[index - 1].role === 'user') {
            return count + 1;
        }
        return count;
    }, 0);

    const showTools = environment.features.autoScroll && exchanges >= 2;

    return (
        <div className="chat-history" ref={chatContainerRef}>
            <AnimatePresence mode="popLayout" initial={false}>
                {messages.map((message, index) => {
                    if (!message) return null;
                    
                    return (
                        <ChatMessage 
                            key={message.id || `message-${index}-${Date.now()}`}
                            message={message}
                            onOptionClick={onOptionClick}
                            isTyping={isTyping && index === messages.length - 1}
                            isLatest={index === messages.length - 1}
                        />
                    );
                })}

                {showTools && !isTyping && messages.length > 0 && (
                    <motion.div
                        className="security-tools-container"
                        key="security-tools"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                    >
                        <SecurityTools />
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Scroll to bottom button */}
            {userScrolledUp && (
                <motion.button
                    className="scroll-to-bottom-btn"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                        setUserScrolledUp(false);
                        endOfMessagesRef.current?.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'end'
                        });
                    }}
                >
                    <span>↓</span>
                    New messages
                </motion.button>
            )}
            
            <div ref={endOfMessagesRef} />
            
            {/* Email Scan Popup */}
            <EmailScanPopup 
                isOpen={showEmailPopup}
                onClose={handleEmailPopupClose}
                onScan={handleEmailScan}
            />
            
            {/* Email Scan Result */}
            {emailScanResult && (
                <EmailScanResult 
                    result={emailScanResult}
                    onActionClick={(action) => {
                        // Handle action clicks if needed
                        console.log('Email scan action:', action);
                    }}
                />
            )}
        </div>
    );
};

export default React.memo(ChatMessages); 