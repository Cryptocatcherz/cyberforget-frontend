import React, { useRef, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ChatHeader from '../components/chat/ChatHeader';
import WelcomeMessage from '../components/chat/WelcomeMessage';
import SeamlessChatMessages from '../components/chat/SeamlessChatMessages';
import ChatInput from '../components/chat/ChatInput';
import ThinkingIndicator from '../components/chat/ThinkingIndicator';
import ChatToolManager, { createToolSuggestion, extractToolCommand } from '../components/chat/ChatToolManager';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';
import DebugContext from '../components/DebugContext';
import SignUpModal from '../components/auth/SignUpModal';
import { useSeamlessChat } from '../hooks/useSeamlessChat';
import useSignUpFlow from '../hooks/useSignUpFlow';
import { shouldShowComponent } from '../config/environment';
import { scamKeywords, preMadeQuestions } from '../config/chatConstants';
import './ChatPage.css';
import './EmailScan.css';
import useWindowSize from '../hooks/useWindowSize';

const ChatPage = () => {
    const [toolTrigger, setToolTrigger] = useState(null);
    const [showToolManager, setShowToolManager] = useState(false);
    
    // Initialize signup flow hook
    const {
        signUpModal,
        shouldShowSignUpTriggers,
        openSignUpModal,
        closeSignUpModal,
        autoTriggerSignUp,
        requiresSignUp,
        getFeatureSignUpTrigger
    } = useSignUpFlow();
    
    useEffect(() => {
        document.body.classList.add('chat-page-active');
        return () => {
            document.body.classList.remove('chat-page-active');
        };
    }, []);

    const {
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
    } = useSeamlessChat();

    const welcomeMessageRef = useRef(null);
    const chatContainerRef = useRef(null);
    const { width } = useWindowSize();

    useEffect(() => {
        if (showWelcome && welcomeMessageRef.current) {
            welcomeMessageRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    }, [showWelcome]);

    // Check for signup triggers when new messages are added
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'user') {
                // Auto-trigger signup based on user's message content
                autoTriggerSignUp(lastMessage.content);
            }
        }
    }, [messages, autoTriggerSignUp]);

    // Enhanced handleOptionClick to check for premium features
    const handleOptionClickWithSignup = (option) => {
        // Check if this option requires signup
        if (requiresSignUp(option.feature)) {
            const triggerData = getFeatureSignUpTrigger(option.feature);
            openSignUpModal(triggerData.trigger, triggerData.name);
            return;
        }
        
        // Call original handler
        handleOptionClick(option);
    };

    // Tool result handler is now integrated into the useSeamlessChat hook
    // No need for separate tool management - tools are embedded in messages

    return (
        <div className="chat-page">
            {/* Navigation */}
            {width > 768 ? <Navbar /> : <MobileNavbar />}
            {/* Header section */}
            <ChatHeader onNewChat={handleNewChat} />
            {/* Main chat container */}
            <div className="chat-container" ref={chatContainerRef}>
                <AnimatePresence mode="popLayout">
                    {showWelcome && messages.length === 0 && (
                        <WelcomeMessage 
                            key="welcome"
                            ref={welcomeMessageRef}
                            preMadeQuestions={preMadeQuestions}
                            onQuestionClick={handlePreMadeQuestionClick}
                            handleEmailScanClick={handleEmailWiperScan}
                        />
                    )}
                    <SeamlessChatMessages 
                        key="messages"
                        messages={messages}
                        scamKeywords={scamKeywords}
                        isTyping={isTyping}
                        onOptionClick={handleOptionClickWithSignup}
                        onEmailScan={handleEmailWiperScan}
                        onToolResult={handleToolResult}
                        shouldShowSignUpTriggers={shouldShowSignUpTriggers}
                        onSignUpClick={openSignUpModal}
                    />
                    {thinkingStage && <ThinkingIndicator key="thinking" stage={thinkingStage} />}
                    
                    {/* Legacy Tool Manager - now tools are seamlessly integrated */}
                    {/* Tools are now embedded directly in chat messages */}
                </AnimatePresence>
            </div>
            {/* Input Area */}
            <ChatInput
                value={userInput}
                onChange={setUserInput}
                onSend={handleSendMessage}
                disabled={isAskingName || isTyping}
                placeholder="Ask me anything about your digital security..."
            />
            {/* Tools are now seamlessly integrated into chat messages */}
            {/* Debug Context (only in development) */}
            {shouldShowComponent('debugProfile') && <DebugContext />}
            
            {/* SignUp Modal */}
            <SignUpModal
                isOpen={signUpModal.isOpen}
                onClose={closeSignUpModal}
                trigger={signUpModal.trigger}
                featureName={signUpModal.featureName}
            />
        </div>
    );
};

export default ChatPage;
