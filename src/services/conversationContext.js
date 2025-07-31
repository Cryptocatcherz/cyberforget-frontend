/**
 * Conversation Context Manager
 * Tracks user conversation state, security concerns, and preferences for intelligent responses
 */

class ConversationContext {
    constructor() {
        this.reset();
    }

    reset() {
        this.context = {
            // User Profile
            userProfile: {
                techLevel: 'unknown', // unknown, beginner, intermediate, advanced
                riskTolerance: 'unknown', // low, medium, high
                primaryConcerns: [], // array of security concerns
                preferredTools: [], // tools user has shown interest in
                communicationStyle: 'unknown' // formal, casual, technical
            },

            // Security State
            securityState: {
                knownCompromisedEmails: [],
                suspiciousActivities: [],
                completedScans: [],
                riskLevel: 'unknown', // low, medium, high, critical
                urgentActions: [],
                currentThreats: []
            },

            // Conversation Flow
            conversationFlow: {
                topics: [], // array of discussed topics
                currentFocus: null, // current main topic
                mood: 'neutral', // stressed, concerned, curious, satisfied
                stage: 'initial', // initial, investigating, acting, resolved
                lastToolSuggested: null,
                followUpNeeded: []
            },

            // Session Data
            session: {
                messageCount: 0,
                startTime: Date.now(),
                lastActivity: Date.now(),
                toolsUsed: [],
                questionsAsked: [],
                actionsTaken: []
            }
        };
    }

    // Update user profile based on conversation
    updateUserProfile(updates) {
        this.context.userProfile = { ...this.context.userProfile, ...updates };
        this.context.session.lastActivity = Date.now();
    }

    // Track security concerns and incidents
    addSecurityConcern(concern) {
        if (!this.context.securityState.currentThreats.includes(concern)) {
            this.context.securityState.currentThreats.push(concern);
        }
        this.updateRiskLevel();
    }

    // Add compromised email to tracking
    addCompromisedEmail(email, breachCount = 0) {
        const existingEmail = this.context.securityState.knownCompromisedEmails.find(e => e.email === email);
        if (!existingEmail) {
            this.context.securityState.knownCompromisedEmails.push({
                email,
                breachCount,
                discoveredAt: Date.now(),
                status: breachCount > 0 ? 'compromised' : 'clean'
            });
        }
        this.updateRiskLevel();
    }

    // Track conversation topics
    addTopic(topic, importance = 'medium') {
        this.context.conversationFlow.topics.push({
            topic,
            importance,
            timestamp: Date.now(),
            resolved: false
        });
        
        // Update current focus if high importance
        if (importance === 'high') {
            this.context.conversationFlow.currentFocus = topic;
        }
    }

    // Analyze message for context clues
    analyzeMessage(message, messageType = 'user') {
        this.context.session.messageCount++;
        
        const messageLower = message.toLowerCase();
        
        // Detect technical level
        this.detectTechLevel(messageLower);
        
        // Detect urgency and mood
        this.detectMoodAndUrgency(messageLower);
        
        // Extract security concerns
        this.extractSecurityConcerns(messageLower);
        
        // Track tools mentioned
        this.trackToolMentions(messageLower);
        
        this.context.session.lastActivity = Date.now();
    }

    // Detect user's technical expertise level
    detectTechLevel(message) {
        const techIndicators = {
            beginner: ['help me', 'i don\'t know', 'what is', 'how do i', 'not sure', 'confused'],
            intermediate: ['password manager', '2fa', 'vpn', 'malware', 'phishing'],
            advanced: ['dns', 'encryption', 'vulnerability', 'penetration test', 'zero-day', 'api', 'hash']
        };

        let maxScore = 0;
        let detectedLevel = this.context.userProfile.techLevel;

        Object.entries(techIndicators).forEach(([level, indicators]) => {
            const score = indicators.reduce((acc, indicator) => {
                return acc + (message.includes(indicator) ? 1 : 0);
            }, 0);
            
            if (score > maxScore) {
                maxScore = score;
                detectedLevel = level;
            }
        });

        if (maxScore > 0 && detectedLevel !== 'unknown') {
            this.context.userProfile.techLevel = detectedLevel;
        }
    }

    // Detect mood and urgency from message
    detectMoodAndUrgency(message) {
        const moodIndicators = {
            stressed: ['urgent', 'emergency', 'asap', 'immediately', 'panicking', 'worried sick'],
            concerned: ['worried', 'concerned', 'suspicious', 'unsure', 'might be'],
            curious: ['wondering', 'curious', 'interesting', 'learn more', 'tell me about'],
            satisfied: ['thank you', 'thanks', 'helpful', 'great', 'perfect', 'solved']
        };

        Object.entries(moodIndicators).forEach(([mood, indicators]) => {
            if (indicators.some(indicator => message.includes(indicator))) {
                this.context.conversationFlow.mood = mood;
                
                // Update conversation stage based on mood
                if (mood === 'stressed') {
                    this.context.conversationFlow.stage = 'urgent';
                } else if (mood === 'satisfied') {
                    this.context.conversationFlow.stage = 'resolved';
                }
            }
        });
    }

    // Extract security concerns from message
    extractSecurityConcerns(message) {
        const securityConcerns = {
            'email_breach': ['email', 'breach', 'compromised', 'leaked', 'exposed'],
            'password_security': ['password', 'login', 'account', 'credential'],
            'identity_theft': ['identity', 'personal info', 'data broker', 'ssn', 'address'],
            'phone_scam': ['call', 'phone', 'scam', 'suspicious number'],
            'malware': ['virus', 'malware', 'suspicious file', 'download'],
            'financial_fraud': ['bank', 'credit card', 'payment', 'financial'],
            'social_media': ['facebook', 'instagram', 'social media', 'profile']
        };

        Object.entries(securityConcerns).forEach(([concern, keywords]) => {
            if (keywords.some(keyword => message.includes(keyword))) {
                this.addSecurityConcern(concern);
                this.addTopic(concern, 'high');
            }
        });
    }

    // Track tool mentions and interest
    trackToolMentions(message) {
        const tools = [
            'email scan', 'password check', 'data broker', 'virus scan', 
            'phone check', 'account delete', 'location scan'
        ];

        tools.forEach(tool => {
            if (message.includes(tool.toLowerCase())) {
                if (!this.context.userProfile.preferredTools.includes(tool)) {
                    this.context.userProfile.preferredTools.push(tool);
                }
            }
        });
    }

    // Calculate overall risk level
    updateRiskLevel() {
        let riskScore = 0;
        
        // Email breaches contribute to risk
        this.context.securityState.knownCompromisedEmails.forEach(email => {
            if (email.status === 'compromised') {
                riskScore += Math.min(email.breachCount * 0.5, 5);
            }
        });
        
        // Active threats contribute to risk
        riskScore += this.context.securityState.currentThreats.length * 2;
        
        // Mood affects perceived risk
        if (this.context.conversationFlow.mood === 'stressed') {
            riskScore += 3;
        }
        
        // Determine risk level
        if (riskScore >= 8) {
            this.context.securityState.riskLevel = 'critical';
        } else if (riskScore >= 5) {
            this.context.securityState.riskLevel = 'high';
        } else if (riskScore >= 2) {
            this.context.securityState.riskLevel = 'medium';
        } else {
            this.context.securityState.riskLevel = 'low';
        }
    }

    // Generate conversation summary for AI context
    generateContextSummary() {
        const summary = {
            userProfile: this.context.userProfile,
            securitySummary: {
                riskLevel: this.context.securityState.riskLevel,
                compromisedEmails: this.context.securityState.knownCompromisedEmails.length,
                currentThreats: this.context.securityState.currentThreats,
                urgentActions: this.context.securityState.urgentActions
            },
            conversationSummary: {
                stage: this.context.conversationFlow.stage,
                mood: this.context.conversationFlow.mood,
                currentFocus: this.context.conversationFlow.currentFocus,
                recentTopics: this.context.conversationFlow.topics.slice(-3),
                messageCount: this.context.session.messageCount
            }
        };

        return summary;
    }

    // Generate context-aware system prompt
    generateContextPrompt() {
        const context = this.generateContextSummary();
        
        let prompt = "You are CyberForget AI, a world-class cybersecurity expert. ";
        
        // Adjust tone based on user's technical level
        if (context.userProfile.techLevel === 'beginner') {
            prompt += "Explain things in simple, non-technical terms. ";
        } else if (context.userProfile.techLevel === 'advanced') {
            prompt += "You can use technical terminology and provide detailed explanations. ";
        }
        
        // Adjust urgency based on mood and risk level
        if (context.conversationSummary.mood === 'stressed' || context.securitySummary.riskLevel === 'critical') {
            prompt += "The user seems stressed about security issues. Prioritize immediate, actionable advice. ";
        }
        
        // Add conversation context
        if (context.securitySummary.compromisedEmails > 0) {
            prompt += `The user has ${context.securitySummary.compromisedEmails} compromised email(s). `;
        }
        
        if (context.securitySummary.currentThreats.length > 0) {
            prompt += `Current security concerns: ${context.securitySummary.currentThreats.join(', ')}. `;
        }
        
        if (context.conversationSummary.currentFocus) {
            prompt += `Focus on helping with: ${context.conversationSummary.currentFocus}. `;
        }
        
        prompt += "Provide specific, actionable security advice and recommend appropriate tools when relevant.";
        
        return prompt;
    }

    // Get smart tool recommendations based on context
    getSmartToolRecommendations() {
        const context = this.generateContextSummary();
        const recommendations = [];
        
        // Prioritize based on current threats and conversation
        if (context.securitySummary.currentThreats.includes('email_breach')) {
            recommendations.push({
                tool: 'email_scan',
                priority: 'high',
                reason: 'Email security concern detected'
            });
        }
        
        if (context.securitySummary.currentThreats.includes('identity_theft')) {
            recommendations.push({
                tool: 'data_broker_scan',
                priority: 'high',
                reason: 'Identity protection needed'
            });
        }
        
        if (context.securitySummary.currentThreats.includes('password_security')) {
            recommendations.push({
                tool: 'password_check',
                priority: 'medium',
                reason: 'Password security concern'
            });
        }
        
        return recommendations.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    // Get current context
    getContext() {
        return this.context;
    }

    // Export context for persistence
    exportContext() {
        return JSON.stringify(this.context);
    }

    // Import context from storage
    importContext(contextString) {
        try {
            this.context = JSON.parse(contextString);
            return true;
        } catch (error) {
            console.error('Failed to import context:', error);
            return false;
        }
    }
}

// Create singleton instance
const conversationContext = new ConversationContext();

export default conversationContext;