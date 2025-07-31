/**
 * Intelligent Tool Recommendation Engine
 * Analyzes user behavior, conversation context, and security state to recommend the most relevant tools
 */

import { SECURITY_TOOLS } from '../config/constants';

class IntelligentToolRecommendation {
    constructor() {
        this.toolUsageHistory = [];
        this.contextWeights = {
            urgency: 3.0,
            relevance: 2.5,
            userExperience: 2.0,
            previousSuccess: 1.5,
            conversationFlow: 1.0
        };
    }

    /**
     * Get personalized tool recommendations based on comprehensive analysis
     */
    getRecommendations(conversationContext, message = '', limit = 3) {
        const context = conversationContext.getContext();
        const recommendations = [];

        // Analyze each available tool
        Object.entries(SECURITY_TOOLS).forEach(([toolKey, tool]) => {
            const score = this.calculateToolScore(tool, context, message);
            
            if (score > 0) {
                recommendations.push({
                    toolKey,
                    tool,
                    score,
                    reasons: this.getRecommendationReasons(tool, context, message),
                    urgency: this.calculateUrgency(tool, context),
                    confidence: this.calculateConfidence(tool, context)
                });
            }
        });

        // Sort by score and return top recommendations
        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(rec => ({
                ...rec,
                personalizedMessage: this.generatePersonalizedMessage(rec, context)
            }));
    }

    /**
     * Calculate comprehensive score for a tool based on multiple factors
     */
    calculateToolScore(tool, context, message) {
        let score = 0;
        
        // Factor 1: Direct keyword relevance
        score += this.calculateKeywordRelevance(tool, message) * this.contextWeights.relevance;
        
        // Factor 2: Context-based urgency
        score += this.calculateContextUrgency(tool, context) * this.contextWeights.urgency;
        
        // Factor 3: User experience level match
        score += this.calculateExperienceMatch(tool, context) * this.contextWeights.userExperience;
        
        // Factor 4: Previous tool success
        score += this.calculatePreviousSuccess(tool, context) * this.contextWeights.previousSuccess;
        
        // Factor 5: Conversation flow appropriateness
        score += this.calculateConversationFlow(tool, context) * this.contextWeights.conversationFlow;

        return Math.max(0, score);
    }

    /**
     * Calculate keyword relevance score
     */
    calculateKeywordRelevance(tool, message) {
        if (!message) return 0;
        
        const messageLower = message.toLowerCase();
        const keywordMatches = tool.keywords.reduce((acc, keyword) => {
            const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi');
            const matches = (messageLower.match(regex) || []).length;
            return acc + matches;
        }, 0);
        
        return Math.min(keywordMatches * 2, 10); // Cap at 10
    }

    /**
     * Calculate urgency based on context
     */
    calculateContextUrgency(tool, context) {
        let urgencyScore = 0;
        const threats = context.securityState.currentThreats;
        const riskLevel = context.securityState.riskLevel;
        const mood = context.conversationFlow.mood;

        // High urgency for specific threat-tool matches
        const threatToolMap = {
            'email_breach': ['email_wiper', 'data_leak'],
            'identity_theft': ['data_broker_scan', 'location_scan'],
            'password_security': ['password_check'],
            'phone_scam': ['area_codes'],
            'malware': ['file_scan'],
            'financial_fraud': ['password_check', 'data_broker_scan']
        };

        threats.forEach(threat => {
            const relevantTools = threatToolMap[threat] || [];
            if (relevantTools.some(toolName => tool.name.toLowerCase().includes(toolName.replace('_', ' ')))) {
                urgencyScore += 5;
            }
        });

        // Risk level multiplier
        const riskMultiplier = {
            'critical': 3,
            'high': 2,
            'medium': 1,
            'low': 0.5
        };
        urgencyScore *= riskMultiplier[riskLevel] || 1;

        // Mood urgency
        if (mood === 'stressed') urgencyScore += 3;
        else if (mood === 'concerned') urgencyScore += 1;

        return Math.min(urgencyScore, 15); // Cap at 15
    }

    /**
     * Calculate how well tool matches user's experience level
     */
    calculateExperienceMatch(tool, context) {
        const techLevel = context.userProfile.techLevel;
        
        // Tool complexity mapping
        const toolComplexity = {
            'CleanData AI': 'beginner',
            'Free Broker Scan': 'beginner',
            'Check Your Email': 'beginner',
            'Password Checker': 'beginner',
            'Phone Number Checker': 'beginner',
            'Account Deleter': 'intermediate',
            'Virus Scanner': 'intermediate'
        };

        const complexity = toolComplexity[tool.name] || 'intermediate';
        
        // Experience level matching
        const experienceMatch = {
            'beginner': { 'beginner': 5, 'intermediate': 3, 'advanced': 1 },
            'intermediate': { 'beginner': 3, 'intermediate': 5, 'advanced': 4 },
            'advanced': { 'beginner': 2, 'intermediate': 4, 'advanced': 5 }
        };

        if (techLevel === 'unknown') return 3; // Neutral score
        return experienceMatch[techLevel][complexity] || 3;
    }

    /**
     * Calculate score based on previous tool usage success
     */
    calculatePreviousSuccess(tool, context) {
        const preferredTools = context.userProfile.preferredTools;
        const toolsUsed = context.session.toolsUsed;

        let score = 0;

        // Boost if user has shown preference
        if (preferredTools.some(pref => tool.name.toLowerCase().includes(pref.toLowerCase()))) {
            score += 3;
        }

        // Boost if tool was used successfully before
        if (toolsUsed.some(used => used.tool === tool.name && used.successful)) {
            score += 2;
        }

        return score;
    }

    /**
     * Calculate appropriateness for current conversation flow
     */
    calculateConversationFlow(tool, context) {
        const stage = context.conversationFlow.stage;
        const currentFocus = context.conversationFlow.currentFocus;
        const messageCount = context.session.messageCount;

        let score = 0;

        // Stage-appropriate tools
        const stageTools = {
            'initial': ['email_wiper', 'data_broker_scan'],
            'investigating': ['password_check', 'file_scan', 'area_codes'],
            'acting': ['delete_account', 'data_broker_scan'],
            'urgent': ['email_wiper', 'password_check', 'data_broker_scan']
        };

        const appropriateTools = stageTools[stage] || [];
        if (appropriateTools.some(toolName => tool.name.toLowerCase().includes(toolName.replace('_', ' ')))) {
            score += 3;
        }

        // Focus alignment
        if (currentFocus && tool.keywords.some(keyword => 
            currentFocus.includes(keyword.replace(/\s+/g, '_')))) {
            score += 2;
        }

        // Progressive disclosure - don't overwhelm beginners early
        if (messageCount < 3 && context.userProfile.techLevel === 'beginner') {
            const beginnerFriendlyTools = ['email_wiper', 'password_check', 'data_broker_scan'];
            if (!beginnerFriendlyTools.some(toolName => 
                tool.name.toLowerCase().includes(toolName.replace('_', ' ')))) {
                score -= 2;
            }
        }

        return score;
    }

    /**
     * Calculate urgency level for a recommendation
     */
    calculateUrgency(tool, context) {
        const riskLevel = context.securityState.riskLevel;
        const mood = context.conversationFlow.mood;
        const compromisedEmails = context.securityState.knownCompromisedEmails.length;

        if ((riskLevel === 'critical' || mood === 'stressed') && compromisedEmails > 0) {
            return 'immediate';
        } else if (riskLevel === 'high' || mood === 'concerned') {
            return 'high';
        } else if (riskLevel === 'medium') {
            return 'medium';
        } else {
            return 'low';
        }
    }

    /**
     * Calculate confidence in recommendation
     */
    calculateConfidence(tool, context) {
        const factors = [
            context.userProfile.techLevel !== 'unknown',
            context.securityState.currentThreats.length > 0,
            context.conversationFlow.currentFocus !== null,
            context.session.messageCount > 2
        ];

        const confidenceScore = factors.filter(Boolean).length / factors.length;
        
        if (confidenceScore >= 0.75) return 'high';
        else if (confidenceScore >= 0.5) return 'medium';
        else return 'low';
    }

    /**
     * Get human-readable reasons for recommendation
     */
    getRecommendationReasons(tool, context, message) {
        const reasons = [];

        // Context-based reasons
        if (context.securityState.currentThreats.length > 0) {
            const relevantThreats = context.securityState.currentThreats.filter(threat => 
                tool.keywords.some(keyword => threat.includes(keyword.replace(/\s+/g, '_')))
            );
            if (relevantThreats.length > 0) {
                // Format threat names properly by replacing underscores with spaces and capitalizing
                const formattedThreats = relevantThreats.map(threat => 
                    threat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                );
                reasons.push(`Addresses your ${formattedThreats.join(', ')} concerns`);
            }
        }

        // Risk level reasons
        if (context.securityState.riskLevel === 'critical') {
            reasons.push('Critical security situation detected');
        } else if (context.securityState.riskLevel === 'high') {
            reasons.push('High risk level requires immediate attention');
        }

        // Experience level reasons
        if (context.userProfile.techLevel === 'beginner' && 
            ['email_wiper', 'password_check', 'data_broker_scan'].some(simple => 
                tool.name.toLowerCase().includes(simple.replace('_', ' ')))) {
            reasons.push('Beginner-friendly tool');
        }

        // Compromised email reasons
        if (context.securityState.knownCompromisedEmails.length > 0 && 
            tool.name.toLowerCase().includes('data broker')) {
            reasons.push('You have compromised emails - check what else might be exposed');
        }

        return reasons.length > 0 ? reasons : ['Relevant to your security needs'];
    }

    /**
     * Generate personalized message for tool recommendation
     */
    generatePersonalizedMessage(recommendation, context) {
        const { tool, urgency, confidence, reasons } = recommendation;
        let message = '';

        // Urgency prefix
        if (urgency === 'immediate') {
            message += '🚨 URGENT: ';
        } else if (urgency === 'high') {
            message += '⚠️ HIGH PRIORITY: ';
        } else if (urgency === 'medium') {
            message += '🔍 RECOMMENDED: ';
        }

        // Main recommendation
        message += `Try our ${tool.name}`;

        // Add primary reason
        if (reasons.length > 0) {
            message += ` - ${reasons[0]}`;
        }

        // Confidence indicator
        if (confidence === 'high') {
            message += ' (Highly recommended for your situation)';
        } else if (confidence === 'low') {
            message += ' (May be helpful)';
        }

        return message;
    }

    /**
     * Track tool usage for learning
     */
    trackToolUsage(toolName, successful = true, userFeedback = null) {
        this.toolUsageHistory.push({
            tool: toolName,
            timestamp: Date.now(),
            successful,
            userFeedback
        });

        // Keep only recent history (last 50 uses)
        if (this.toolUsageHistory.length > 50) {
            this.toolUsageHistory = this.toolUsageHistory.slice(-50);
        }
    }

    /**
     * Get learning insights for improving recommendations
     */
    getLearningInsights() {
        const insights = {
            mostSuccessfulTools: [],
            leastSuccessfulTools: [],
            userPreferences: {},
            improvementAreas: []
        };

        // Analyze tool success rates
        const toolStats = {};
        this.toolUsageHistory.forEach(usage => {
            if (!toolStats[usage.tool]) {
                toolStats[usage.tool] = { total: 0, successful: 0 };
            }
            toolStats[usage.tool].total++;
            if (usage.successful) {
                toolStats[usage.tool].successful++;
            }
        });

        // Sort by success rate
        const sortedTools = Object.entries(toolStats)
            .map(([tool, stats]) => ({
                tool,
                successRate: stats.successful / stats.total,
                total: stats.total
            }))
            .filter(item => item.total >= 3) // Only include tools with sufficient data
            .sort((a, b) => b.successRate - a.successRate);

        insights.mostSuccessfulTools = sortedTools.slice(0, 3);
        insights.leastSuccessfulTools = sortedTools.slice(-3);

        return insights;
    }
}

// Create singleton instance
const intelligentToolRecommendation = new IntelligentToolRecommendation();

export default intelligentToolRecommendation;