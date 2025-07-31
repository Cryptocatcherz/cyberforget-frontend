/**
 * Intelligent Tool Suggestions - Smart security tool recommendations
 * Powered by Gemini and security expert analysis
 */

import securityExpertSystem from './securityExpertSystem.js';

class IntelligentToolSuggestions {
  constructor() {
    this.toolRegistry = this.initializeToolRegistry();
    this.userJourney = {
      completedTools: [],
      currentRiskLevel: 'unknown',
      securityGoals: [],
      progressPath: []
    };
  }

  /**
   * Initialize comprehensive tool registry with smart suggestion logic
   */
  initializeToolRegistry() {
    return {
      // Entry-level tools (familiar to users)
      'password_checker': {
        name: 'Password Security Analyzer',
        category: 'authentication',
        complexity: 'beginner',
        timeToComplete: '2-3 minutes',
        triggers: [
          'password', 'login', 'security', 'hack', 'breach', 'compromise',
          'account', 'credential', 'authentication'
        ],
        prerequisites: [],
        followUpTools: ['email_breach', 'data_broker_scan'],
        securityImpact: 'high',
        userFriendliness: 'high',
        description: 'Analyze password strength, entropy, and check against 15+ billion breached passwords',
        benefits: [
          'Instant password strength analysis',
          'Breach database verification',
          'Crack time calculations',
          'Security recommendations'
        ]
      },

      'email_breach': {
        name: 'Email Breach Scanner',
        category: 'identity',
        complexity: 'beginner',
        timeToComplete: '1-2 minutes',
        triggers: [
          'email', 'breach', 'compromise', 'hack', 'spam', 'phishing',
          'account', 'identity', 'stolen'
        ],
        prerequisites: [],
        followUpTools: ['data_broker_scan', 'comprehensive_security'],
        securityImpact: 'high',
        userFriendliness: 'high',
        description: 'Scan your email against billions of compromised records from major breaches',
        benefits: [
          'Check 15+ billion breach records',
          'Identify specific breaches',
          'Risk assessment',
          'Remediation guidance'
        ]
      },

      // Privacy-focused tools
      'data_broker_scan': {
        name: 'Data Broker Discovery Scanner',
        category: 'privacy',
        complexity: 'intermediate',
        timeToComplete: '5-7 minutes',
        triggers: [
          'privacy', 'personal information', 'data broker', 'remove data',
          'online presence', 'digital footprint', 'exposure', 'security posture',
          'analyze my', 'analyze digital'
        ],
        prerequisites: [],
        followUpTools: ['comprehensive_security', 'account_deleter'],
        securityImpact: 'very_high',
        userFriendliness: 'medium',
        description: 'AI-powered scan of 500+ data broker sites to find your exposed information',
        benefits: [
          'Scan 500+ data broker sites',
          'Real-time discovery process',
          'Threat categorization',
          'Removal assistance'
        ]
      },

      'account_deleter': {
        name: 'Account Cleanup Assistant',
        category: 'privacy',
        complexity: 'intermediate',
        timeToComplete: '10-15 minutes',
        triggers: [
          'delete account', 'remove account', 'privacy', 'cleanup',
          'social media', 'old accounts', 'digital footprint'
        ],
        prerequisites: [],
        followUpTools: ['data_broker_scan'],
        securityImpact: 'medium',
        userFriendliness: 'high',
        description: 'Comprehensive guide to deleting accounts across major platforms',
        benefits: [
          'Platform-specific deletion guides',
          'Direct deletion links',
          'Data download assistance',
          'Privacy impact assessment'
        ]
      },

      // Security assessment tools
      'comprehensive_security': {
        name: 'Comprehensive Security Assessment',
        category: 'assessment',
        complexity: 'intermediate',
        timeToComplete: '8-12 minutes',
        triggers: [
          'comprehensive', 'assessment', 'audit', 'security posture',
          'full scan', 'complete analysis', 'security review'
        ],
        prerequisites: [],
        followUpTools: ['network_scan', 'ai_defense'],
        securityImpact: 'very_high',
        userFriendliness: 'medium',
        description: 'Gamified multi-vector security analysis with personalized insights',
        benefits: [
          'Multi-vector security analysis',
          'Gamified experience',
          'Personalized risk scoring',
          'Educational content'
        ]
      },

      'file_scan': {
        name: 'Malware Analysis Engine',
        category: 'threat_detection',
        complexity: 'beginner',
        timeToComplete: '3-5 minutes',
        triggers: [
          'file', 'virus', 'malware', 'scan', 'download', 'suspicious',
          'threat', 'attachment', 'infected'
        ],
        prerequisites: [],
        followUpTools: ['comprehensive_security'],
        securityImpact: 'high',
        userFriendliness: 'high',
        description: 'Multi-engine file analysis for malware, viruses, and threats',
        benefits: [
          'Multi-engine scanning',
          'Behavioral analysis',
          'Threat classification',
          'Safety recommendations'
        ]
      },

      // Advanced tools
      'network_scan': {
        name: 'Network Vulnerability Scanner',
        category: 'infrastructure',
        complexity: 'advanced',
        timeToComplete: '10-15 minutes',
        triggers: [
          'network', 'infrastructure', 'vulnerability', 'penetration test',
          'firewall', 'ports', 'security audit'
        ],
        prerequisites: ['comprehensive_security'],
        followUpTools: ['ai_defense'],
        securityImpact: 'very_high',
        userFriendliness: 'low',
        description: 'Advanced network infrastructure penetration testing and analysis',
        benefits: [
          'Network vulnerability assessment',
          'Port scanning analysis',
          'Firewall configuration review',
          'Infrastructure hardening'
        ]
      },

      'ai_defense': {
        name: 'AI Defense Strategy Generator',
        category: 'strategy',
        complexity: 'advanced',
        timeToComplete: '12-18 minutes',
        triggers: [
          'ai defense', 'strategy', 'cyber defense', 'protection framework',
          'security strategy', 'defense plan'
        ],
        prerequisites: ['comprehensive_security'],
        followUpTools: ['security_test_suite'],
        securityImpact: 'very_high',
        userFriendliness: 'medium',
        description: 'AI-powered personalized cybersecurity strategy and defense recommendations',
        benefits: [
          'AI-powered strategy generation',
          'Personalized recommendations',
          'Implementation roadmap',
          'Continuous monitoring setup'
        ]
      },

      // Utility tools
      'area_code_checker': {
        name: 'Phone Security Checker',
        category: 'communication',
        complexity: 'beginner',
        timeToComplete: '1-2 minutes',
        triggers: [
          'phone', 'scam', 'call', 'number', 'area code', 'suspicious call',
          'spam', 'fraud'
        ],
        prerequisites: [],
        followUpTools: ['comprehensive_security'],
        securityImpact: 'medium',
        userFriendliness: 'high',
        description: 'Verify phone numbers and detect potential scam calls',
        benefits: [
          'Scam database checking',
          'Area code analysis',
          'Risk assessment',
          'Blocking recommendations'
        ]
      },

      'security_test_suite': {
        name: 'Security Test Suite',
        category: 'testing',
        complexity: 'advanced',
        timeToComplete: '15-25 minutes',
        triggers: [
          'test suite', 'vulnerability test', 'security testing',
          'penetration test', 'assessment suite'
        ],
        prerequisites: ['comprehensive_security', 'network_scan'],
        followUpTools: [],
        securityImpact: 'very_high',
        userFriendliness: 'low',
        description: 'Comprehensive automated security testing across multiple attack vectors',
        benefits: [
          'Automated vulnerability testing',
          'Multi-vector analysis',
          'Detailed reporting',
          'Remediation prioritization'
        ]
      }
    };
  }

  /**
   * Smart tool suggestion based on conversation context and user journey
   */
  async suggestTools(userMessage, conversationHistory, userProfile) {
    console.log('🔧 Analyzing tools for message:', userMessage.substring(0, 50) + '...');
    
    // Get base suggestions from keyword matching
    const keywordSuggestions = this.getKeywordBasedSuggestions(userMessage);
    
    // Get contextual suggestions from expert system
    const contextualSuggestions = await this.getContextualSuggestions(userMessage, conversationHistory);
    
    // Get journey-based suggestions
    const journeySuggestions = this.getJourneyBasedSuggestions(userProfile);
    
    // Combine and rank suggestions
    const allSuggestions = [
      ...keywordSuggestions.map(s => ({ ...s, source: 'keyword' })),
      ...contextualSuggestions.map(s => ({ ...s, source: 'contextual' })),
      ...journeySuggestions.map(s => ({ ...s, source: 'journey' }))
    ];
    
    // Remove duplicates and rank by relevance
    const uniqueSuggestions = this.deduplicateAndRank(allSuggestions);
    
    // Apply user journey optimization
    const optimizedSuggestions = this.optimizeForUserJourney(uniqueSuggestions, userProfile);
    
    console.log('🎯 Final tool suggestions:', optimizedSuggestions.map(s => s.type));
    
    return optimizedSuggestions.slice(0, 3); // Return top 3 suggestions
  }

  /**
   * Get tool suggestions based on keyword matching
   */
  getKeywordBasedSuggestions(userMessage) {
    const messageLower = userMessage.toLowerCase();
    const suggestions = [];

    for (const [toolType, tool] of Object.entries(this.toolRegistry)) {
      let score = 0;
      let matchedTriggers = [];

      // Check trigger keywords
      for (const trigger of tool.triggers) {
        if (messageLower.includes(trigger)) {
          score += this.calculateKeywordScore(trigger, messageLower);
          matchedTriggers.push(trigger);
        }
      }

      if (score > 0) {
        suggestions.push({
          type: toolType,
          confidence: Math.min(score / 2, 1.0), // Normalize to 0-1
          triggers: matchedTriggers,
          tool: tool
        });
      }
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get contextual suggestions from security expert analysis
   */
  async getContextualSuggestions(userMessage, conversationHistory) {
    try {
      // Get security profile from expert system
      const userProfile = securityExpertSystem.getUserSecurityProfile();
      
      // Analyze message for security context
      const suggestions = [];
      
      // Check if this is a digital footprint/security posture analysis request
      const messageLower = userMessage.toLowerCase();
      const isDigitalFootprintRequest = messageLower.includes('digital footprint') || 
                                       messageLower.includes('security posture') ||
                                       (messageLower.includes('analyze') && 
                                        (messageLower.includes('my') || messageLower.includes('security')));
      
      if (isDigitalFootprintRequest) {
        // Prioritize data broker scan for digital footprint analysis
        suggestions.push(
          { type: 'data_broker_scan', confidence: 1.0, priority: 'high' }
        );
        return suggestions;
      }
      
      // Emergency scenarios - prioritize immediate tools
      if (this.isEmergencyScenario(userMessage)) {
        suggestions.push(
          { type: 'comprehensive_security', confidence: 1.0, urgency: 'critical' },
          { type: 'email_breach', confidence: 0.9, urgency: 'high' },
          { type: 'password_checker', confidence: 0.8, urgency: 'high' }
        );
      }
      
      // Risk-based suggestions
      else if (userProfile.riskLevel === 'high') {
        suggestions.push(
          { type: 'data_broker_scan', confidence: 0.9 },
          { type: 'comprehensive_security', confidence: 0.8 },
          { type: 'email_breach', confidence: 0.7 }
        );
      }
      
      // Privacy-focused suggestions
      else if (userProfile.securityGoals.includes('privacy_protection')) {
        suggestions.push(
          { type: 'data_broker_scan', confidence: 0.9 },
          { type: 'account_deleter', confidence: 0.7 }
        );
      }
      
      // Threat prevention focus
      else if (userProfile.securityGoals.includes('threat_prevention')) {
        suggestions.push(
          { type: 'file_scan', confidence: 0.8 },
          { type: 'comprehensive_security', confidence: 0.7 },
          { type: 'network_scan', confidence: 0.6 }
        );
      }

      return suggestions;
      
    } catch (error) {
      console.error('Error getting contextual suggestions:', error);
      return [];
    }
  }

  /**
   * Get suggestions based on user's journey and completed tools
   */
  getJourneyBasedSuggestions(userProfile) {
    const suggestions = [];
    const completedTools = userProfile.completedTools || [];
    
    // If no tools completed, suggest entry-level tools
    if (completedTools.length === 0) {
      suggestions.push(
        { type: 'password_checker', confidence: 0.7, reason: 'Great starting point' },
        { type: 'email_breach', confidence: 0.6, reason: 'Quick security check' }
      );
    }
    
    // Suggest follow-up tools based on completed ones
    for (const completedTool of completedTools) {
      const toolInfo = this.toolRegistry[completedTool];
      if (toolInfo && toolInfo.followUpTools) {
        for (const followUpTool of toolInfo.followUpTools) {
          if (!completedTools.includes(followUpTool)) {
            suggestions.push({
              type: followUpTool,
              confidence: 0.8,
              reason: `Recommended after ${toolInfo.name}`
            });
          }
        }
      }
    }
    
    // Progressive complexity suggestions
    const userLevel = this.determineUserLevel(completedTools);
    const appropriateTools = this.getToolsForLevel(userLevel);
    
    for (const tool of appropriateTools) {
      if (!completedTools.includes(tool.type)) {
        suggestions.push({
          type: tool.type,
          confidence: 0.6,
          reason: `Appropriate for your experience level`
        });
      }
    }

    return suggestions;
  }

  /**
   * Remove duplicate suggestions and rank by combined score
   */
  deduplicateAndRank(suggestions) {
    const toolMap = new Map();
    
    for (const suggestion of suggestions) {
      const existing = toolMap.get(suggestion.type);
      if (existing) {
        // Combine confidence scores from multiple sources
        existing.confidence = Math.max(existing.confidence, suggestion.confidence);
        existing.sources = [...(existing.sources || []), suggestion.source];
      } else {
        toolMap.set(suggestion.type, {
          ...suggestion,
          sources: [suggestion.source]
        });
      }
    }
    
    return Array.from(toolMap.values()).sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Optimize suggestions for user's current journey stage
   */
  optimizeForUserJourney(suggestions, userProfile) {
    const completedTools = userProfile.completedTools || [];
    const userLevel = this.determineUserLevel(completedTools);
    
    return suggestions.map(suggestion => {
      const tool = this.toolRegistry[suggestion.type];
      if (!tool) return suggestion;
      
      // Boost score for appropriate complexity level
      if (this.isAppropriateLevel(tool.complexity, userLevel)) {
        suggestion.confidence += 0.1;
      }
      
      // Boost score for high-impact tools
      if (tool.securityImpact === 'very_high') {
        suggestion.confidence += 0.05;
      }
      
      // Boost score for user-friendly tools for beginners
      if (userLevel === 'beginner' && tool.userFriendliness === 'high') {
        suggestion.confidence += 0.1;
      }
      
      // Add tool metadata for UI display
      suggestion.toolInfo = {
        name: tool.name,
        description: tool.description,
        timeToComplete: tool.timeToComplete,
        complexity: tool.complexity,
        benefits: tool.benefits
      };
      
      return suggestion;
    }).sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Calculate keyword relevance score
   */
  calculateKeywordScore(keyword, message) {
    const keywordLength = keyword.length;
    const messageLength = message.length;
    
    // Base score for keyword match
    let score = 0.3;
    
    // Boost for exact phrase matches
    if (message.includes(keyword)) {
      score += 0.4;
    }
    
    // Boost for longer, more specific keywords
    if (keywordLength > 8) {
      score += 0.2;
    }
    
    // Boost for keywords that appear multiple times
    const occurrences = (message.match(new RegExp(keyword, 'gi')) || []).length;
    score += (occurrences - 1) * 0.1;
    
    return Math.min(score, 1.0);
  }

  /**
   * Check if message indicates security emergency
   */
  isEmergencyScenario(userMessage) {
    const emergencyPatterns = [
      /hack.*right.*now/i,
      /being.*attack/i,
      /money.*stolen/i,
      /account.*compromise.*today/i,
      /urgent.*security/i,
      /emergency/i,
      /help.*immediately/i
    ];
    
    return emergencyPatterns.some(pattern => pattern.test(userMessage));
  }

  /**
   * Determine user's experience level based on completed tools
   */
  determineUserLevel(completedTools) {
    if (completedTools.length === 0) return 'beginner';
    if (completedTools.length <= 3) return 'intermediate';
    return 'advanced';
  }

  /**
   * Get tools appropriate for user's level
   */
  getToolsForLevel(userLevel) {
    const levelMap = {
      'beginner': ['password_checker', 'email_breach', 'file_scan', 'area_code_checker'],
      'intermediate': ['data_broker_scan', 'comprehensive_security', 'account_deleter'],
      'advanced': ['network_scan', 'ai_defense', 'security_test_suite']
    };
    
    const toolTypes = levelMap[userLevel] || [];
    return toolTypes.map(type => ({
      type,
      ...this.toolRegistry[type]
    }));
  }

  /**
   * Check if tool complexity is appropriate for user level
   */
  isAppropriateLevel(toolComplexity, userLevel) {
    const complexity = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3
    };
    
    const toolLevel = complexity[toolComplexity] || 1;
    const currentLevel = complexity[userLevel] || 1;
    
    // Tool should be at or slightly above user's level
    return toolLevel <= currentLevel + 1;
  }

  /**
   * Update user journey when tool is completed
   */
  updateUserJourney(toolType, result) {
    if (!this.userJourney.completedTools.includes(toolType)) {
      this.userJourney.completedTools.push(toolType);
    }
    
    this.userJourney.progressPath.push({
      tool: toolType,
      completedAt: new Date(),
      result: result
    });
    
    console.log('📈 Updated user journey:', this.userJourney);
  }

  /**
   * Get tool registry for external access
   */
  getToolRegistry() {
    return this.toolRegistry;
  }

  /**
   * Reset user journey for new session
   */
  resetUserJourney() {
    this.userJourney = {
      completedTools: [],
      currentRiskLevel: 'unknown',
      securityGoals: [],
      progressPath: []
    };
    console.log('🔄 User journey reset');
  }
}

// Export singleton instance
export default new IntelligentToolSuggestions();