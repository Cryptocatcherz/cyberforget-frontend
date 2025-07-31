/**
 * Security Expert System - Gemini-powered cybersecurity AI assistant
 * Transforms CyberForget into a true security expert rather than template responses
 */

import { GEMINI_API_KEY, GEMINI_API_URL, GEMINI_MODEL } from '../config/constants.js';
import conversationalToolDetector from './conversationalToolDetector.js';
import intelligentToolSuggestions from './intelligentToolSuggestions.js';

class SecurityExpertSystem {
  constructor() {
    this.conversationMemory = [];
    this.userSecurityProfile = {
      riskLevel: 'unknown',
      completedTools: [],
      knownVulnerabilities: [],
      securityGoals: [],
      industryContext: 'general'
    };
    this.threatIntelligence = this.initializeThreatIntelligence();
  }

  /**
   * Initialize current threat intelligence and security landscape
   */
  initializeThreatIntelligence() {
    return {
      currentThreats: [
        'Password spraying attacks targeting business accounts',
        'Data broker exploitation increasing 300% in 2024',
        'AI-powered phishing campaigns using deepfake technology',
        'Supply chain attacks through compromised browser extensions',
        'SIM swap attacks targeting 2FA bypass',
        'Business email compromise (BEC) scams using ChatGPT'
      ],
      criticalCVEs: [
        'CVE-2024-6387: OpenSSH vulnerability affecting Linux servers',
        'CVE-2024-4577: PHP CGI vulnerability allowing RCE',
        'CVE-2024-5806: Chrome V8 engine type confusion vulnerability'
      ],
      emergingTrends: [
        'AI-generated malware becoming undetectable by traditional AV',
        'Quantum computing threat to current encryption standards',
        'IoT botnet recruitment through default credentials',
        'Cryptocurrency wallet draining via malicious browser extensions'
      ],
      industryAlerts: {
        healthcare: 'HIPAA breach notifications up 87% due to ransomware',
        finance: 'RegTech compliance failures costing average $14.8M per incident',
        retail: 'E-commerce platform vulnerabilities exposing customer payment data',
        technology: 'Software supply chain attacks targeting CI/CD pipelines'
      }
    };
  }

  /**
   * Create comprehensive security expert system prompt
   */
  createSecurityExpertPrompt(userMessage, conversationHistory, userProfile) {
    const contextualPrompt = `You are CyberForget AI, the world's most advanced cybersecurity expert and digital security advisor. You possess comprehensive knowledge of:

🔒 **EXPERTISE AREAS:**
- Threat intelligence and cyber warfare tactics
- Digital forensics and incident response  
- Privacy protection and data broker networks
- Advanced persistent threats (APTs) and state-sponsored attacks
- Zero-day vulnerabilities and exploit development
- Cryptocurrency security and blockchain analysis
- IoT security and industrial control systems
- Cloud security architecture and DevSecOps
- Regulatory compliance (GDPR, HIPAA, SOX, PCI-DSS)
- Security awareness training and human factor analysis

🎯 **YOUR PERSONALITY:**
- Authoritative yet approachable cybersecurity expert
- Direct and actionable advice with urgency when needed
- Uses technical terminology but explains complex concepts clearly
- Provides specific, measurable recommendations
- Always includes threat context and "why" behind recommendations
- Maintains professional confidence while acknowledging unknowns

🛡️ **CURRENT THREAT LANDSCAPE (${new Date().toLocaleDateString()}):**
${this.threatIntelligence.currentThreats.map(threat => `• ${threat}`).join('\n')}

⚠️ **CRITICAL VULNERABILITIES:**
${this.threatIntelligence.criticalCVEs.map(cve => `• ${cve}`).join('\n')}

📊 **USER'S SECURITY PROFILE:**
- Risk Level: ${userProfile.riskLevel}
- Completed Assessments: ${userProfile.completedTools.join(', ') || 'None'}
- Known Vulnerabilities: ${userProfile.knownVulnerabilities.join(', ') || 'Unknown'}
- Industry Context: ${userProfile.industryContext}

🔧 **AVAILABLE SECURITY TOOLS:**
1. **Password Security Analyzer** - Checks strength, entropy, and breach status
2. **Email Breach Scanner** - Scans against 15+ billion compromised records
3. **Data Broker Discovery** - AI-powered scan of 500+ data broker networks
4. **Malware Analysis Engine** - Multi-engine file scanning and behavioral analysis
5. **Account Cleanup Assistant** - Platform account deletion and privacy management
6. **Phone Security Checker** - Scam detection and caller ID verification
7. **Network Vulnerability Scanner** - Infrastructure penetration testing
8. **AI Defense Strategy Generator** - Personalized cyber defense recommendations
9. **Comprehensive Security Assessment** - Multi-vector security audit
10. **Security Test Suite** - Automated vulnerability testing framework

💬 **CONVERSATION HISTORY:**
${conversationHistory.slice(-3).map(msg => `${msg.role}: ${msg.content.substring(0, 200)}...`).join('\n')}

👤 **CURRENT USER MESSAGE:** "${userMessage}"

🎯 **RESPONSE REQUIREMENTS:**
1. **Analyze the security context** - What is the user's specific concern?
2. **Provide expert assessment** - Technical analysis with threat intelligence context
3. **Recommend specific actions** - Prioritized steps with urgency levels
4. **Suggest relevant tools** - Which of the 10 security tools would help most?
5. **Include threat context** - Why is this important given current threat landscape?
6. **Ask intelligent follow-up** - What additional information would help provide better protection?

**SPECIAL FOR COMPREHENSIVE SECURITY ASSESSMENT:**
If the user is asking for a comprehensive security assessment, keep it SHORT and mobile-friendly! 📱
- Max 3-4 sentences total
- One simple action item 
- Build excitement but be concise
- No long lists or detailed explanations
- Just tell them the assessment tool is opening and why it's awesome! 🚀

**CRITICAL:** Always respond as a seasoned cybersecurity expert who understands the real-world implications of digital threats. Include specific metrics, timelines, and actionable intelligence wherever possible.

**TONE & PERSONALITY:** 
- Be enthusiastic and fun while maintaining security expertise
- Use emojis generously to make content engaging 🎉
- Think "friendly security ninja" not "corporate consultant"
- Make complex security concepts accessible and exciting
- Use analogies, metaphors, and playful language
- Build excitement about protecting digital life
- Be encouraging and empowering, not intimidating
- Make users feel like cybersecurity heroes on a mission

**FORMAT:** 
- Keep responses SHORT for mobile users 📱
- Max 2-3 short paragraphs
- No long bullet point lists
- Use simple, punchy sentences
- Get to the point quickly
- Be enthusiastic but concise! 🚀🛡️`;

    return contextualPrompt;
  }

  /**
   * Process user message through Gemini with security expert context
   */
  async processSecurityQuery(userMessage, conversationHistory = []) {
    try {
      // Update conversation memory
      this.conversationMemory = [...conversationHistory, { role: 'user', content: userMessage }];
      
      // Update user security profile based on conversation
      this.updateUserProfile(userMessage, conversationHistory);
      
      // Check for immediate security emergencies
      const emergencyResponse = this.checkForSecurityEmergency(userMessage);
      if (emergencyResponse) {
        return emergencyResponse;
      }

      // Generate security expert prompt
      const expertPrompt = this.createSecurityExpertPrompt(
        userMessage, 
        conversationHistory, 
        this.userSecurityProfile
      );

      console.log('🤖 Sending security query to Gemini:', userMessage.substring(0, 100) + '...');

      // Call Gemini API with expert context
      const geminiUrl = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: expertPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
            candidateCount: 1
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error:', errorText);
        throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const expertResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        'I apologize, but I encountered an issue generating a security analysis. Please try rephrasing your question.';

      console.log('✅ Got expert response length:', expertResponse.length);

      // Get intelligent tool suggestions
      const suggestedTools = await intelligentToolSuggestions.suggestTools(
        userMessage, 
        conversationHistory, 
        this.userSecurityProfile
      );
      
      // Update conversation memory with AI response
      this.conversationMemory.push({ role: 'assistant', content: expertResponse });

      return {
        content: expertResponse,
        suggestedTools: suggestedTools,
        securityInsights: this.generateSecurityInsights(userMessage, expertResponse),
        nextActions: this.extractNextActions(expertResponse),
        riskLevel: this.assessRiskLevel(userMessage, expertResponse),
        threatContext: this.getRelevantThreatContext(userMessage)
      };

    } catch (error) {
      console.error('Security Expert System error:', error);
      
      // Fallback to emergency response system
      return this.generateEmergencyResponse(userMessage, error);
    }
  }

  /**
   * Check for immediate security emergencies requiring urgent response
   */
  checkForSecurityEmergency(userMessage) {
    const emergencyPatterns = [
      /active.*attack/i,
      /being.*hack.*right.*now/i,
      /money.*stolen/i,
      /account.*lock/i,
      /password.*changed.*me/i,
      /ransomware/i,
      /computer.*infected/i,
      /suspicious.*charges/i,
      /identity.*stolen/i
    ];

    const isEmergency = emergencyPatterns.some(pattern => pattern.test(userMessage));
    
    if (isEmergency) {
      return {
        content: `🚨 **SECURITY EMERGENCY DETECTED** 🚨

I detect this may be an active security incident. **Time is critical.**

**IMMEDIATE ACTIONS (Do these RIGHT NOW):**

1. **Disconnect from internet** - Unplug ethernet or disable WiFi
2. **Do NOT pay any ransom** - Contact authorities first
3. **Take photos** - Document what you're seeing on screen
4. **Contact your bank** - Report any financial account concerns immediately
5. **Call cybersecurity hotline**: 1-855-292-3642 (CISA)

**NEXT 30 MINUTES:**
- Change passwords on critical accounts from a DIFFERENT device
- Enable 2FA on all financial accounts
- Contact your IT department if this is a work device
- File reports with FBI IC3 (ic3.gov) for financial crimes

**I'm here to help guide you through this crisis.** What specific symptoms are you seeing right now?`,
        
        suggestedTools: [
          { type: 'comprehensive_security', confidence: 1.0, urgency: 'critical' },
          { type: 'email_breach', confidence: 1.0, urgency: 'high' }
        ],
        riskLevel: 'critical',
        isEmergency: true
      };
    }

    return null;
  }

  /**
   * Update user security profile based on conversation patterns
   */
  updateUserProfile(userMessage, conversationHistory) {
    const messageLower = userMessage.toLowerCase();
    
    // Detect industry context
    const industryKeywords = {
      healthcare: ['hospital', 'patient', 'hipaa', 'medical', 'healthcare'],
      finance: ['bank', 'trading', 'fintech', 'payment', 'financial'],
      retail: ['ecommerce', 'shopping', 'customer data', 'retail'],
      technology: ['developer', 'software', 'api', 'cloud', 'saas']
    };

    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        this.userSecurityProfile.industryContext = industry;
        break;
      }
    }

    // Detect security goals
    const goalPatterns = {
      'privacy_protection': /privacy|personal.*data|hide.*information/i,
      'threat_prevention': /malware|virus|hack|attack|threat/i,
      'compliance': /compliance|regulation|audit|gdpr|hipaa/i,
      'incident_response': /breach|incident|compromise|forensic/i
    };

    for (const [goal, pattern] of Object.entries(goalPatterns)) {
      if (pattern.test(userMessage) && !this.userSecurityProfile.securityGoals.includes(goal)) {
        this.userSecurityProfile.securityGoals.push(goal);
      }
    }

    // Update risk level based on conversation content
    const riskIndicators = [
      /never.*update.*password/i,
      /same.*password.*everywhere/i, 
      /click.*suspicious.*link/i,
      /download.*unknown.*file/i,
      /public.*wifi.*banking/i
    ];

    const riskScore = riskIndicators.reduce((score, pattern) => {
      return score + (pattern.test(messageLower) ? 1 : 0);
    }, 0);

    if (riskScore >= 3) {
      this.userSecurityProfile.riskLevel = 'high';
    } else if (riskScore >= 1) {
      this.userSecurityProfile.riskLevel = 'medium';
    } else if (this.userSecurityProfile.riskLevel === 'unknown') {
      this.userSecurityProfile.riskLevel = 'low';
    }
  }

  /**
   * Detect relevant security tools based on conversation context
   */
  detectRelevantTools(userMessage, expertResponse, conversationHistory) {
    // Use existing conversational tool detector as base
    const baseTools = conversationalToolDetector.detectToolsInMessage(userMessage, conversationHistory);
    
    // Enhance with expert analysis
    const expertToolSuggestions = this.analyzeExpertToolNeeds(userMessage, expertResponse);
    
    // Combine and deduplicate
    const allTools = [...baseTools, ...expertToolSuggestions];
    const uniqueTools = allTools.filter((tool, index, array) => 
      array.findIndex(t => t.type === tool.type) === index
    );

    // Sort by relevance and confidence
    return uniqueTools
      .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
      .slice(0, 3); // Limit to top 3 most relevant tools
  }

  /**
   * Analyze expert response to suggest relevant tools
   */
  analyzeExpertToolNeeds(userMessage, expertResponse) {
    const suggestions = [];
    const responseLower = expertResponse.toLowerCase();
    const messageLower = userMessage.toLowerCase();

    // Tool suggestion patterns based on expert analysis
    const toolPatterns = {
      'password_checker': [
        /password.*strength/i, /password.*security/i, /credential.*analysis/i
      ],
      'email_breach': [
        /email.*breach/i, /compromised.*account/i, /haveibeenpwned/i
      ],
      'data_broker_scan': [
        /data.*broker/i, /personal.*information.*online/i, /privacy.*scan/i
      ],
      'comprehensive_security': [
        /comprehensive.*assessment/i, /full.*security.*audit/i, /complete.*analysis/i
      ],
      'network_scan': [
        /network.*vulnerability/i, /infrastructure.*security/i, /penetration.*test/i
      ],
      'ai_defense': [
        /defense.*strategy/i, /security.*framework/i, /cyber.*defense/i
      ]
    };

    for (const [toolType, patterns] of Object.entries(toolPatterns)) {
      const confidence = patterns.reduce((score, pattern) => {
        const messageMatch = pattern.test(messageLower) ? 0.4 : 0;
        const responseMatch = pattern.test(responseLower) ? 0.6 : 0;
        return Math.max(score, messageMatch + responseMatch);
      }, 0);

      if (confidence > 0.5) {
        suggestions.push({
          type: toolType,
          confidence: confidence,
          trigger: 'expert_analysis',
          reasoning: `Expert analysis suggests ${toolType.replace('_', ' ')} would provide valuable insights`
        });
      }
    }

    return suggestions;
  }

  /**
   * Generate security insights based on expert analysis
   */
  generateSecurityInsights(userMessage, expertResponse) {
    const insights = [];
    
    // Extract key security concepts from response
    const securityConcepts = this.extractSecurityConcepts(expertResponse);
    
    if (securityConcepts.length > 0) {
      insights.push({
        type: 'expert_analysis',
        message: `Expert analysis identified ${securityConcepts.length} key security areas for your attention`,
        priority: 'high',
        concepts: securityConcepts
      });
    }

    // Add threat intelligence context
    const relevantThreats = this.getRelevantThreatContext(userMessage);
    if (relevantThreats.length > 0) {
      insights.push({
        type: 'threat_intelligence',
        message: `Current threat landscape shows ${relevantThreats.length} relevant risks to your situation`,
        priority: 'medium',
        threats: relevantThreats
      });
    }

    return insights;
  }

  /**
   * Extract actionable next steps from expert response
   */
  extractNextActions(expertResponse) {
    const actions = [];
    const actionPatterns = [
      /(?:1\.|first|immediately|step 1).*?([^.!?]+[.!?])/gi,
      /(?:2\.|second|next|step 2).*?([^.!?]+[.!?])/gi,
      /(?:3\.|third|then|step 3).*?([^.!?]+[.!?])/gi
    ];

    actionPatterns.forEach((pattern, index) => {
      const matches = expertResponse.match(pattern);
      if (matches && matches[0]) {
        actions.push({
          step: index + 1,
          action: matches[0].replace(/^\d+\.\s*/, '').trim(),
          priority: index === 0 ? 'high' : 'medium'
        });
      }
    });

    return actions.slice(0, 5); // Limit to top 5 actions
  }

  /**
   * Assess risk level from expert analysis
   */
  assessRiskLevel(userMessage, expertResponse) {
    const urgencyKeywords = [
      'critical', 'urgent', 'immediate', 'emergency', 'severe', 'high risk'
    ];
    
    const responseText = expertResponse.toLowerCase();
    const urgentMatches = urgencyKeywords.filter(keyword => 
      responseText.includes(keyword)
    ).length;

    if (urgentMatches >= 3) return 'critical';
    if (urgentMatches >= 2) return 'high';
    if (urgentMatches >= 1) return 'medium';
    return 'low';
  }

  /**
   * Get relevant threat context for user's situation
   */
  getRelevantThreatContext(userMessage) {
    const messageLower = userMessage.toLowerCase();
    const relevantThreats = [];

    // Check current threats for relevance
    this.threatIntelligence.currentThreats.forEach(threat => {
      const threatKeywords = threat.toLowerCase().split(/\s+/);
      const relevanceScore = threatKeywords.reduce((score, keyword) => {
        return score + (messageLower.includes(keyword) ? 1 : 0);
      }, 0);

      if (relevanceScore > 0) {
        relevantThreats.push({
          threat: threat,
          relevance: relevanceScore,
          category: 'current_threat'
        });
      }
    });

    // Add industry-specific threats
    const industryThreats = this.threatIntelligence.industryAlerts[this.userSecurityProfile.industryContext];
    if (industryThreats) {
      relevantThreats.push({
        threat: industryThreats,
        relevance: 1,
        category: 'industry_specific'
      });
    }

    return relevantThreats.sort((a, b) => b.relevance - a.relevance).slice(0, 3);
  }

  /**
   * Extract security concepts from expert response
   */
  extractSecurityConcepts(expertResponse) {
    const concepts = [];
    const conceptPatterns = [
      /(two-factor authentication|2FA|multi-factor)/gi,
      /(password manager|credential management)/gi,
      /(encryption|cryptographic)/gi,
      /(firewall|network security)/gi,
      /(backup|data recovery)/gi,
      /(phishing|social engineering)/gi,
      /(malware|virus|trojan)/gi,
      /(vpn|virtual private network)/gi
    ];

    conceptPatterns.forEach(pattern => {
      const matches = expertResponse.match(pattern);
      if (matches) {
        concepts.push(matches[0].toLowerCase());
      }
    });

    return [...new Set(concepts)]; // Remove duplicates
  }

  /**
   * Generate emergency fallback response when Gemini fails
   */
  generateEmergencyResponse(userMessage, error) {
    console.error('Security Expert System fallback triggered:', error);
    
    // Check if this is about digital footprint/data broker scanning
    const messageLower = userMessage.toLowerCase();
    const isDataBrokerRequest = messageLower.includes('digital footprint') || 
                               messageLower.includes('security posture') ||
                               messageLower.includes('analyze') ||
                               messageLower.includes('data broker');
    
    if (isDataBrokerRequest) {
      return {
        content: `I'll help you analyze your digital footprint and security posture. Your digital footprint consists of all the personal information about you that's publicly available online - from social media posts to data broker records. 

I'm opening the Data Broker Scanner tool for you now, which will scan networks to see what information about you is currently exposed. This will give us a baseline understanding of your digital exposure and help identify potential security risks.`,
        
        riskLevel: 'medium',
        isEmergency: false,
        fallbackUsed: true
      };
    }
    
    // General fallback for other requests
    return {
      content: `I'll help you with your cybersecurity needs. Let me analyze your request and provide the best security tools for your situation.`,
      
      suggestedTools: [
        { type: 'data_broker_scan', confidence: 0.9 },
        { type: 'email_breach', confidence: 0.8 }
      ],
      riskLevel: 'medium',
      isEmergency: false,
      fallbackUsed: true
    };
  }

  /**
   * Get user's security profile for analytics
   */
  getUserSecurityProfile() {
    return { ...this.userSecurityProfile };
  }

  /**
   * Reset conversation and profile (for new chat)
   */
  resetSession() {
    this.conversationMemory = [];
    this.userSecurityProfile = {
      riskLevel: 'unknown',
      completedTools: [],
      knownVulnerabilities: [],
      securityGoals: [],
      industryContext: 'general'
    };
    
    // Reset intelligent tool suggestions
    intelligentToolSuggestions.resetUserJourney();
    
    console.log('🔄 Security Expert System session reset');
  }
}

// Export singleton instance
export default new SecurityExpertSystem();