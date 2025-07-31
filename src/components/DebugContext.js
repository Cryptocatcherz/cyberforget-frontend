import React, { useState, useEffect } from 'react';
import conversationContext from '../services/conversationContext';

const DebugContext = () => {
    const [context, setContext] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setContext(conversationContext.getContext());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!context || !isVisible) {
        return (
            <div style={{
                position: 'fixed',
                top: '10px',
                right: '10px',
                zIndex: 9999,
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '5px',
                fontSize: '12px',
                cursor: 'pointer'
            }} onClick={() => setIsVisible(true)}>
                🧠 Debug
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            width: '300px',
            maxHeight: '400px',
            overflow: 'auto',
            zIndex: 9999,
            background: 'rgba(0,0,0,0.9)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '11px',
            fontFamily: 'monospace'
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '10px',
                borderBottom: '1px solid #333',
                paddingBottom: '5px'
            }}>
                <strong>🧠 Context Debug</strong>
                <button 
                    onClick={() => setIsVisible(false)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    ✕
                </button>
            </div>

            <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#4ade80' }}>User Profile:</strong>
                <div>Tech Level: {context.userProfile.techLevel}</div>
                <div>Risk Tolerance: {context.userProfile.riskTolerance}</div>
                <div>Mood: {context.conversationFlow.mood}</div>
            </div>

            <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#f59e0b' }}>Security State:</strong>
                <div>Risk Level: {context.securityState.riskLevel}</div>
                <div>Compromised Emails: {context.securityState.knownCompromisedEmails.length}</div>
                <div>Current Threats: {context.securityState.currentThreats.length}</div>
            </div>

            <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#8b5cf6' }}>Conversation:</strong>
                <div>Stage: {context.conversationFlow.stage}</div>
                <div>Focus: {context.conversationFlow.currentFocus || 'None'}</div>
                <div>Messages: {context.session.messageCount}</div>
            </div>

            {context.securityState.currentThreats.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#ef4444' }}>Active Threats:</strong>
                    {context.securityState.currentThreats.map((threat, i) => (
                        <div key={i}>• {threat}</div>
                    ))}
                </div>
            )}

            {context.userProfile.preferredTools.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#06b6d4' }}>Preferred Tools:</strong>
                    {context.userProfile.preferredTools.map((tool, i) => (
                        <div key={i}>• {tool}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DebugContext;