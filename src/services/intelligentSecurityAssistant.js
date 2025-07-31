// Intelligent Security Assistant - Seamlessly integrates all security tools into natural conversation
import conversationalToolDetector from './conversationalToolDetector';
import securityExpertSystem from './securityExpertSystem';
import { getApiUrl } from '../config/environment';

class IntelligentSecurityAssistant {
  constructor() {
    this.conversationMemory = [];
    this.userProfile = {
      securityConcerns: [],
      previousScans: [],
      riskLevel: 'unknown',
      toolsUsed: []
    };
  }

  // Main method to process user messages and generate AI responses with integrated tools
  async processUserMessage(userMessage, conversationHistory = []) {
    // Update conversation memory
    this.conversationMemory = [...conversationHistory, { role: 'user', content: userMessage }];
    
    console.log('🔍 processUserMessage called with:', {
      userMessage: userMessage.substring(0, 50) + '...',
      historyLength: conversationHistory.length,
      lastMessage: conversationHistory[conversationHistory.length - 1]?.content?.substring(0, 50) + '...'
    });
    
    // Check for recent tool results in conversation history
    const recentToolResults = this.getRecentToolResults(conversationHistory);
    console.log('🔍 Checking for tool results:', recentToolResults.length, recentToolResults);
    
    // If there are recent tool results, use Gemini for dynamic responses with tool context
    if (recentToolResults.length > 0) {
      console.log('✅ Using Gemini with tool context for:', userMessage);
      return await this.generateGeminiResponseWithToolContext(userMessage, conversationHistory, recentToolResults);
    }
    
    // 🚀 NEW: Use Security Expert System for ALL responses
    console.log('🤖 Routing to Security Expert System for expert analysis');
    let expertResponse = null;
    
    try {
      expertResponse = await securityExpertSystem.processSecurityQuery(userMessage, conversationHistory);
      
      // Add AI response to memory
      this.conversationMemory.push({ role: 'assistant', content: expertResponse.content });
      
      return {
        content: expertResponse.content,
        suggestedTools: expertResponse.suggestedTools || [],
        nextActions: expertResponse.nextActions || [],
        securityInsights: expertResponse.securityInsights || [],
        riskLevel: expertResponse.riskLevel,
        threatContext: expertResponse.threatContext,
        isEmergency: expertResponse.isEmergency
      };
      
    } catch (error) {
      console.error('Security Expert System failed, returning the error response directly:', error);
      
      // If the expert system already provided a fallback response, use it directly
      if (expertResponse && expertResponse.fallbackUsed) {
        return expertResponse;
      }
      
      // Otherwise, provide a simple fallback response without duplicating
      const messageLower = userMessage.toLowerCase();
      const isDataBrokerRequest = messageLower.includes('digital footprint') || 
                                 messageLower.includes('security posture') ||
                                 messageLower.includes('analyze');
      
      if (isDataBrokerRequest) {
        return {
          content: `I'll help you analyze your digital footprint and security posture. I'm opening the Data Broker Scanner tool for you now to see what information about you is currently exposed online.`,
          nextActions: [],
          securityInsights: [],
          fallbackUsed: true
        };
      }
      
      return {
        content: `I'll help you with your cybersecurity needs. Let me analyze your request and provide the best security tools for your situation.`,
        suggestedTools: [
          { type: 'data_broker_scan', confidence: 0.9 },
          { type: 'email_breach', confidence: 0.8 }
        ],
        nextActions: [],
        securityInsights: [],
        fallbackUsed: true
      };
    }
  }

  // Get recent tool results from conversation history
  getRecentToolResults(conversationHistory) {
    const toolResults = [];
    const recentMessages = conversationHistory.slice(-10); // Look at last 10 messages
    
    console.log('🔍 Looking for tool results in', recentMessages.length, 'recent messages');
    console.log('🔍 Full conversation history length:', conversationHistory.length);
    
    for (const message of recentMessages) {
      console.log('📝 Message:', {
        role: message.role,
        tool: message.tool,
        hasScanData: !!message.scanData,
        isToolResult: !!message.isToolResult,
        content: message.content?.substring(0, 50) + '...'
      });
      
      if (message.role === 'assistant' && (message.tool || message.isToolResult || message.scanData)) {
        console.log('🎯 Found tool message:', message.tool, !!message.scanData);
        
        if (message.tool === 'data_broker_scan' && message.scanData) {
          const scanData = message.scanData;
          console.log('🔍 Scan data details:', {
            sitesFound: scanData.sitesFound,
            risk: scanData.cyberforgetRisk,
            threatCategories: scanData.threatCategories?.length
          });
          
          toolResults.push({
            type: 'data_broker_scan',
            timestamp: message.timestamp || Date.now(),
            summary: `Data broker scan found ${scanData.sitesFound} sites with user's information. Risk level: ${scanData.cyberforgetRisk}. Categories found: ${scanData.threatCategories?.map(cat => `${cat.name} (${cat.count})`).join(', ') || 'none'}.`,
            data: scanData
          });
          console.log('✅ Added data broker scan result');
        } else if (message.isEmailScanResult && message.emailScanData) {
          toolResults.push({
            type: 'email_scan',
            timestamp: message.timestamp || Date.now(),
            summary: `Email scan completed. Status: ${message.emailScanData.isCompromised ? 'COMPROMISED' : 'CLEAN'}. ${message.emailScanData.isCompromised ? `Found in ${message.emailScanData.breachCount} breaches.` : 'No breaches found.'}`,
            data: message.emailScanData
          });
          console.log('✅ Added email scan result');
        }
      }
    }
    
    console.log('📊 Total tool results found:', toolResults.length);
    return toolResults;
  }

  // Generate Gemini response with tool context
  async generateGeminiResponseWithToolContext(userMessage, conversationHistory, toolResults) {
    try {
      // Import Gemini configuration directly
      const { GEMINI_API_KEY, GEMINI_API_URL, GEMINI_MODEL } = await import('../config/constants.js');
      
      if (!GEMINI_API_KEY) {
        console.warn('⚠️ No Gemini API key found, using fallback response');
        throw new Error('Gemini API key not configured');
      }

      // Build context prompt with tool results
      let contextPrompt = `You are CyberForget AI, a cybersecurity expert assistant. You help users understand and improve their digital security.

Recent security tool results:`;

      toolResults.forEach(result => {
        contextPrompt += `\n- ${result.type}: ${result.summary}`;
      });

      contextPrompt += `\n\nUser's current message: "${userMessage}"

Based on the recent security scan results above, provide a helpful, conversational response. Be specific about the findings and offer actionable advice. Keep the tone friendly but professional. If the user is asking follow-up questions about the scan results, reference the specific findings and provide personalized recommendations.

IMPORTANT: Always end your response with an engaging question to keep the conversation going. Ask if they need help with specific next steps, want guidance on a particular aspect, or would like assistance with implementation. Examples:
- "Would you like me to help you find the opt-out page for that specific data broker?"
- "Should I walk you through the removal process step-by-step?"
- "Do you want me to explain what other types of information might be exposed?"
- "Would you like guidance on preventing this in the future?"

Respond directly with your answer - no JSON format needed for this context-aware response.`;

      console.log('🤖 Sending to Gemini directly with context:', contextPrompt.substring(0, 200) + '...');
      
      // Call Gemini API directly
      const geminiUrl = `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: contextPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        })
      });
      
      console.log('📡 Gemini API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I encountered an issue generating a response. Please try again.';

      console.log('✅ Got Gemini response:', aiResponseText.substring(0, 200) + '...');
      console.log('📤 Returning AI response object with content length:', aiResponseText.length);

      return {
        content: aiResponseText,
        suggestedTools: [],
        nextActions: [],
        securityInsights: []
      };

    } catch (error) {
      console.error('Error generating Gemini response:', error);
      // Fallback to a basic response
      return {
        content: `I can see that you've recently completed a security scan. Based on the results, I'm here to help you understand what was found and what steps you should take next. What specific questions do you have about your scan results?`,
        suggestedTools: [],
        nextActions: [],
        securityInsights: []
      };
    }
  }

  // Ensure tools are available for pre-made questions
  ensureToolsForPreMadeQuestion(userMessage, messageIntent, detectedTools) {
    const messageLower = userMessage.toLowerCase();
    
    // Create mock tool suggestions for pre-made questions
    const mockTools = {
      'analyze my digital footprint and security posture': [
        { type: 'data_broker_scan', confidence: 1.0, data: {}, trigger: 'pre-made-question' }
      ],
      'conduct advanced threat intelligence analysis': [
        { type: 'comprehensive_security', confidence: 1.0, data: {}, trigger: 'pre-made-question' }
      ],
      'scan my email for data breaches and compromises': [
        { type: 'email_breach', confidence: 1.0, data: {}, trigger: 'pre-made-question' }
      ],
      'perform comprehensive security assessment': [
        { type: 'comprehensive_security', confidence: 1.0, data: {}, trigger: 'pre-made-question' }
      ],
      'monitor my digital presence for threats': [
        { type: 'data_broker_scan', confidence: 1.0, data: {}, trigger: 'pre-made-question' }
      ],
      'evaluate my password security and vulnerabilities': [
        { type: 'password_checker', confidence: 1.0, data: {}, trigger: 'pre-made-question' }
      ],
      'deploy ai-powered cyber defense strategies': [
        { type: 'ai_defense', confidence: 1.0, data: {}, trigger: 'pre-made-question' }
      ],
      'analyze network vulnerabilities and exposure': [
        { type: 'network_scan', confidence: 1.0, data: {}, trigger: 'pre-made-question' }
      ]
    };

    const tools = mockTools[messageLower];
    return tools || detectedTools;
  }

  // Generate AI response with naturally integrated tool suggestions
  async generateContextualResponse(userMessage, detectedTools, conversationHistory, messageIntent = null) {
    if (!messageIntent) {
      messageIntent = this.analyzeSecurityIntent(userMessage);
    }
    
    // Create response based on security topic
    let response = '';
    let suggestedTools = [];
    let nextActions = [];
    let securityInsights = [];

    switch (messageIntent.primaryConcern) {
      case 'password_security':
        response = this.generatePasswordSecurityResponse(userMessage, messageIntent);
        suggestedTools = this.getPasswordSecurityTools(detectedTools);
        break;
        
      case 'email_security':
        response = this.generateEmailSecurityResponse(userMessage, messageIntent);
        suggestedTools = this.getEmailSecurityTools(detectedTools);
        break;
        
      case 'privacy_protection':
        response = this.generatePrivacyProtectionResponse(userMessage, messageIntent);
        suggestedTools = this.getPrivacyProtectionTools(detectedTools);
        break;
        
      case 'digital_threats':
        response = this.generateDigitalThreatsResponse(userMessage, messageIntent);
        suggestedTools = this.getDigitalThreatsTools(detectedTools);
        break;
        
      case 'account_security':
        response = this.generateAccountSecurityResponse(userMessage, messageIntent);
        suggestedTools = this.getAccountSecurityTools(detectedTools);
        break;
        
      case 'phone_security':
        response = this.generatePhoneSecurityResponse(userMessage, messageIntent);
        suggestedTools = this.getPhoneSecurityTools(detectedTools);
        break;

      case 'comprehensive_security':
        response = this.generateComprehensiveSecurityResponse(userMessage, messageIntent);
        suggestedTools = this.getComprehensiveSecurityTools(detectedTools);
        break;

      case 'ai_defense':
        response = this.generateAIDefenseResponse(userMessage, messageIntent);
        suggestedTools = this.getAIDefenseTools(detectedTools);
        break;

      case 'network_security':
        response = this.generateNetworkSecurityResponse(userMessage, messageIntent);
        suggestedTools = this.getNetworkSecurityTools(detectedTools);
        break;
        
      case 'general_security':
        response = this.generateGeneralSecurityResponse(userMessage, messageIntent);
        suggestedTools = this.getGeneralSecurityTools(detectedTools);
        break;
        
      default:
        response = this.generateFallbackResponse(userMessage, detectedTools);
        suggestedTools = detectedTools.slice(0, 2);
    }

    // Add security insights
    securityInsights = this.generateSecurityInsights(messageIntent, detectedTools);
    
    // Add next actions
    nextActions = this.generateNextActions(messageIntent, detectedTools);

    return {
      content: response,
      suggestedTools: suggestedTools,
      nextActions: nextActions,
      securityInsights: securityInsights
    };
  }

  // Analyze user message to determine security intent
  analyzeSecurityIntent(message) {
    const messageLower = message.toLowerCase();
    
    // Check for specific pre-made questions first
    const preMadeQuestions = {
      'analyze my digital footprint and security posture': 'privacy_protection',
      'conduct advanced threat intelligence analysis': 'comprehensive_security',
      'scan my email for data breaches and compromises': 'email_security',
      'perform comprehensive security assessment': 'comprehensive_security',
      'monitor my digital presence for threats': 'privacy_protection',
      'evaluate my password security and vulnerabilities': 'password_security',
      'deploy ai-powered cyber defense strategies': 'ai_defense',
      'analyze network vulnerabilities and exposure': 'network_security'
    };

    // Check if this is a pre-made question
    for (const [questionText, intent] of Object.entries(preMadeQuestions)) {
      if (messageLower === questionText.toLowerCase()) {
        return {
          primaryConcern: intent,
          confidence: 1.0,
          urgency: 'medium',
          specificMentions: [],
          isPreMadeQuestion: true
        };
      }
    }
    
    const intentPatterns = {
      // Put account_security first to prioritize hacked account scenarios
      account_security: [
        /account.*hack/i, /been.*hack/i, /think.*hack/i,
        /account.*compromise/i, /account.*stolen/i, /unauthorized.*access/i,
        /suspicious.*login/i, /strange.*activity/i, /someone.*access/i,
        /account.*secure/i, /delete.*account/i, /remove.*account/i,
        /social.*media/i, /online.*account/i
      ],
      password_security: [
        /password.*secure/i, /password.*safe/i, /password.*strong/i,
        /password.*crack/i, /password.*hack/i, /password.*breach/i,
        /how long.*password/i, /password.*time/i, /evaluate.*password/i,
        /password.*vulnerabilities/i
      ],
      email_security: [
        /email.*breach/i, /email.*hack/i, /email.*compromise/i,
        /email.*safe/i, /email.*secure/i, /data.*breach.*email/i,
        /scan.*email/i, /email.*data.*breach/i
      ],
      privacy_protection: [
        /privacy/i, /personal.*data/i, /information.*online/i,
        /data.*broker/i, /remove.*data/i, /online.*presence/i,
        /digital.*footprint/i, /security.*posture/i, /monitor.*digital.*presence/i
      ],
      digital_threats: [
        /threat/i, /malware/i, /virus/i, /scan.*file/i,
        /suspicious.*file/i, /download.*safe/i, /threat.*intelligence/i,
        /advanced.*threat/i
      ],
      phone_security: [
        /phone.*scam/i, /phone.*safe/i, /number.*legitimate/i,
        /area.*code/i, /call.*suspicious/i, /spam.*call/i
      ],
      comprehensive_security: [
        /comprehensive.*security/i, /security.*assessment/i, /threat.*intelligence.*analysis/i,
        /advanced.*threat.*intelligence/i, /perform.*comprehensive/i
      ],
      ai_defense: [
        /ai.*powered.*cyber.*defense/i, /deploy.*ai/i, /ai.*defense.*strategies/i,
        /cyber.*defense.*strategies/i
      ],
      network_security: [
        /network.*vulnerabilities/i, /network.*exposure/i, /analyze.*network/i
      ],
      general_security: [
        /security/i, /protect/i, /cyber/i, /digital.*security/i,
        /online.*safety/i
      ]
    };

    let primaryConcern = 'general_security';
    let confidence = 0;

    for (const [concern, patterns] of Object.entries(intentPatterns)) {
      for (const pattern of patterns) {
        if (pattern.test(messageLower)) {
          const newConfidence = this.calculatePatternConfidence(messageLower, pattern);
          if (newConfidence > confidence) {
            confidence = newConfidence;
            primaryConcern = concern;
          }
        }
      }
    }

    return {
      primaryConcern,
      confidence,
      urgency: this.calculateUrgency(messageLower),
      specificMentions: this.extractSpecificMentions(messageLower)
    };
  }

  // Generate password security response
  generatePasswordSecurityResponse(userMessage, intent) {
    if (intent.isPreMadeQuestion) {
      return `I'll evaluate your password security and identify vulnerabilities using advanced cryptographic analysis and breach detection.

🔐 **Password Security Analysis:**
- Strength assessment (length, complexity, entropy)
- Breach database checking against known compromised passwords
- Time-to-crack calculations using current attack methods
- Pattern analysis for common vulnerability indicators
- Dictionary and common password matching
- Recommendations for improvement and protection

**Security Evaluation Includes:**
- Character composition analysis (uppercase, lowercase, numbers, symbols)
- Entropy calculation and randomness assessment
- Comparison against billions of known breached passwords
- Estimated cracking time using modern hardware
- Best practice compliance checking

This analysis helps you understand if your passwords meet modern security standards and identifies specific vulnerabilities that need immediate attention.`;
    }

    const responses = {
      strength: `Password strength depends on several factors: length, complexity, and unpredictability. A strong password should be at least 12 characters long, include uppercase and lowercase letters, numbers, and special characters.

Most importantly, it should never have appeared in a data breach. Even complex passwords can be compromised if they've been stolen from other services.`,

      cracking: `The time to crack a password depends on its complexity and length. Simple passwords can be cracked in seconds, while truly random 16-character passwords would take trillions of years with current technology.

However, if your password has been breached before, it doesn't matter how complex it is - it's already compromised.`,

      breach: `Password breaches happen when hackers steal password databases from companies. Even if your password is strong, it could be compromised if it appeared in breaches from services like LinkedIn, Adobe, or Yahoo.

The most important thing is checking if your specific password has been found in any known breaches.`,

      general: `Password security is crucial for protecting your online accounts. The biggest risks are using weak passwords, reusing passwords across multiple sites, and using passwords that have been previously breached.

Let me help you check if your password meets modern security standards.`
    };

    if (intent.specificMentions.includes('crack') || intent.specificMentions.includes('time')) {
      return responses.cracking;
    } else if (intent.specificMentions.includes('breach') || intent.specificMentions.includes('compromise')) {
      return responses.breach;
    } else if (intent.specificMentions.includes('strong') || intent.specificMentions.includes('strength')) {
      return responses.strength;
    } else {
      return responses.general;
    }
  }

  // Generate email security response
  generateEmailSecurityResponse(userMessage, intent) {
    if (intent.isPreMadeQuestion) {
      return `I'll scan your email address against billions of breach records to identify if it has been compromised in any known data breaches.

📧 **Email Breach Analysis:**
- Comprehensive scan against breach databases
- Identification of specific breaches where your email appeared  
- Assessment of exposed data types (passwords, personal info, etc.)
- Risk evaluation based on breach severity and recency
- Timeline analysis of when breaches occurred
- Recommendations for immediate security actions

**What This Reveals:**
Your email may have been exposed in breaches from major services like Yahoo, LinkedIn, Equifax, or hundreds of other companies. When breached, your email is often bundled with passwords, personal information, and other sensitive data that can be sold on the dark web.

This scan helps you understand your current exposure and take appropriate protective measures.`;
    }

    const responses = {
      breach: `Email breaches are unfortunately common. Your email address may have been exposed in data breaches from companies like Equifax, Yahoo, LinkedIn, or hundreds of other services.

When your email is breached, it often includes associated passwords, personal information, and other sensitive data. This can lead to identity theft, account takeovers, and targeted phishing attacks.`,

      safety: `Email security involves several layers of protection. Beyond checking for breaches, you should use unique passwords for each account, enable two-factor authentication, and be cautious about phishing emails.

The first step is understanding if your email has already been compromised in known data breaches.`,

      general: `Your email address is often the key to your digital identity. If it's been compromised in a data breach, hackers may have access to not just your email, but passwords and personal information associated with it.

Let me help you check if your email has appeared in any known security breaches.`
    };

    if (intent.specificMentions.includes('breach') || intent.specificMentions.includes('compromise')) {
      return responses.breach;
    } else if (intent.specificMentions.includes('safe') || intent.specificMentions.includes('secure')) {
      return responses.safety;
    } else {
      return responses.general;
    }
  }

  // Generate privacy protection response
  generatePrivacyProtectionResponse(userMessage, intent) {
    if (intent.isPreMadeQuestion && userMessage.toLowerCase().includes('digital footprint')) {
      return `🔍 **What can strangers find about you in 30 seconds?** Let me show you exactly what's publicly available.

**⚡ DISCOVER YOUR EXPOSURE:**
• **500+ data broker sites** collect and share personal info
• **2.3M people** already discovered their exposure  
• **Average person** appears on 47+ sites

**🎯 INSTANT SCAN REVEALS:**
Your name, address, phone, family, income estimates, shopping habits

Ready to see what's publicly available about you?`;
    }
    
    return `Your personal information is likely being collected and sold by data brokers without your knowledge. These companies gather data from public records, social media, online purchases, and other sources to create detailed profiles about you.

This information can include your name, address, phone number, email, age, family members, income estimates, and even your interests and habits. This data is then sold to marketers, employers, landlords, and sometimes even criminals.

Data brokers operate in a legal gray area, but you have the right to request removal of your information from their databases. Let me help you discover what information is being sold about you online.`;
  }

  // Generate digital threats response
  generateDigitalThreatsResponse(userMessage, intent) {
    return `Digital threats come in many forms: malware, viruses, ransomware, spyware, and trojans. These can infect your devices through email attachments, downloads, malicious websites, or infected USB drives.

Modern threats are sophisticated and can steal your personal information, monitor your activities, encrypt your files for ransom, or use your computer for illegal activities.

The best defense is prevention - scanning files before opening them, avoiding suspicious downloads, and keeping your software updated. Let me help you check if that file is safe to open.`;
  }

  // Generate account security response
  generateAccountSecurityResponse(userMessage, intent) {
    const messageLower = userMessage.toLowerCase();
    
    // Check if this is about a compromised/hacked account
    if (messageLower.includes('hack') || messageLower.includes('compromise') || 
        messageLower.includes('stolen') || messageLower.includes('unauthorized') ||
        messageLower.includes('suspicious')) {
      
      return `🚨 **IMMEDIATE ACTION REQUIRED** - If you suspect your account has been compromised, time is critical.

**🔴 URGENT STEPS (Do these RIGHT NOW):**

1. **Change your password immediately** on the compromised account
2. **Enable 2-Factor Authentication** if not already active  
3. **Check recent login activity** for unauthorized access
4. **Review account settings** for unauthorized changes
5. **Check connected apps** and revoke suspicious permissions

**⚡ CRITICAL FOLLOW-UP ACTIONS:**

📧 **If it's your email account:**
- Change passwords on ALL other accounts (banking, social media, shopping)
- Check sent folder for emails you didn't send
- Update recovery email/phone if compromised

💳 **If it's financial/shopping:**
- Check recent transactions immediately
- Contact your bank/credit card company
- Consider freezing accounts temporarily

🔍 **Security Assessment:**
- Scan your email for breaches to see how they got in
- Check if other accounts use the same password
- Review what personal information might be exposed

**The first 24 hours are crucial** - hackers often act fast to maximize damage. What type of account do you think was compromised?`;
    }
    
    // Default account security response for general inquiries
    return `Account security involves both protecting your existing accounts and properly removing accounts you no longer use. Old, unused accounts are security vulnerabilities - they often have weak passwords and aren't monitored for suspicious activity.

Many people have accounts they've forgotten about across hundreds of services. These dormant accounts can be compromised and used for identity theft or as stepping stones to access your more important accounts.

Cleaning up your digital footprint by deleting unused accounts is an important security practice. Let me help you identify and remove accounts you no longer need.`;
  }

  // Generate phone security response
  generatePhoneSecurityResponse(userMessage, intent) {
    return `Phone scams are increasingly sophisticated. Scammers use various techniques including caller ID spoofing, robocalls, and social engineering to trick people into revealing personal information or sending money.

Certain area codes and number patterns are more commonly associated with scam calls. Additionally, your phone number may be listed in databases that scammers purchase, making you a target for fraud.

Before answering unknown calls or providing any information, it's wise to verify if the number is legitimate. Let me help you check if that number has been reported as suspicious.`;
  }

  // Generate comprehensive security response
  generateComprehensiveSecurityResponse(userMessage, intent) {
    if (intent.isPreMadeQuestion) {
      return `🛡️ **ENTERPRISE-GRADE SECURITY ASSESSMENT** - Complete digital threat analysis with actionable intelligence.

**🎯 COMPREHENSIVE THREAT VECTORS:**

🔴 **CRITICAL EXPOSURE ANALYSIS:**
• **Data Broker Networks**: Scan 500+ sites selling your personal information
• **Breach Intelligence**: Check 15+ billion stolen records for your accounts
• **Dark Web Monitoring**: Search criminal marketplaces for your data
• **Social Engineering Vectors**: Identify information that could be used against you

🔐 **SECURITY INFRASTRUCTURE AUDIT:**
• **Password Vulnerability Assessment**: Check for compromised credentials
• **Account Security Analysis**: Evaluate 2FA status and login vulnerabilities  
• **Communication Security**: Verify phone numbers against scam databases
• **File Security Scanning**: Detect malware and suspicious downloads

🎖️ **EXECUTIVE SECURITY REPORT:**
• **Risk Score Calculation**: Overall security rating with priority actions
• **Threat Landscape Assessment**: Personalized risk factors and attack vectors
• **Remediation Roadmap**: Step-by-step protection implementation plan
• **Continuous Monitoring**: Ongoing threat detection recommendations

**⚡ IMMEDIATE INTELLIGENCE:**
This isn't just a scan - it's a complete security transformation. You'll get a personalized threat assessment that reveals exactly where you're vulnerable and how to fix it.

Ready for your complete security makeover?`;
    }
    
    return `A comprehensive security assessment analyzes all aspects of your digital security - from passwords and email to personal data exposure and account vulnerabilities.

This type of analysis helps identify your biggest security risks and provides a prioritized action plan for protection. Let me run a complete security assessment to give you a full picture of your current security posture.`;
  }

  // Generate AI defense response
  generateAIDefenseResponse(userMessage, intent) {
    if (intent.isPreMadeQuestion) {
      return `I'll generate a personalized AI-powered cybersecurity defense strategy tailored to your specific risk profile and threat environment.

🤖 **AI Strategy Components:**
- Threat landscape analysis and risk assessment
- Personalized security framework design  
- Immediate action prioritization
- Advanced defense measure recommendations
- Automated monitoring and response protocols
- Enterprise-grade protection strategies

The AI will analyze your security profile and generate a comprehensive defense plan with specific implementation steps and effectiveness ratings.`;
    }
    
    return `AI-powered cyber defense strategies use advanced algorithms to analyze your specific risk profile and generate personalized protection frameworks.

These strategies consider your digital footprint, threat environment, and security goals to create comprehensive defense plans with prioritized actions and automated monitoring capabilities.`;
  }

  // Generate network security response
  generateNetworkSecurityResponse(userMessage, intent) {
    if (intent.isPreMadeQuestion) {
      return `I'll analyze your network infrastructure for vulnerabilities and exposure risks that could compromise your digital security.

🌐 **Network Analysis Areas:**
- Network configuration vulnerabilities
- Exposed services and open ports
- Encryption protocol weaknesses  
- Access control gaps
- Intrusion detection effectiveness
- Network monitoring capabilities

This analysis identifies potential entry points that attackers could exploit and provides recommendations for strengthening your network defenses.`;
    }
    
    return `Network vulnerability analysis examines your internet infrastructure for security weaknesses that could be exploited by attackers.

This includes checking for exposed services, weak encryption, misconfigured firewalls, and other network-level vulnerabilities that could compromise your digital security.`;
  }

  // Generate general security response
  generateGeneralSecurityResponse(userMessage, intent) {
    return `Digital security is multi-layered and involves protecting your passwords, email, personal information, accounts, and devices. Modern cyber threats target all aspects of your digital life.

The most common vulnerabilities are weak or reused passwords, compromised email addresses, exposed personal information, and malicious files. A comprehensive security approach addresses each of these areas systematically.

Let me help you assess your current security posture and identify the areas that need immediate attention.`;
  }

  // Generate fallback response
  generateFallbackResponse(userMessage, detectedTools) {
    return `I understand you're concerned about your digital security. Cybersecurity involves protecting multiple aspects of your online presence - from passwords and email to personal information and digital accounts.

Let me help you address your specific security concerns with the right tools and guidance.`;
  }

  // Get password security tools
  getPasswordSecurityTools(detectedTools) {
    return detectedTools.filter(tool => tool.type === 'password_checker');
  }

  // Get email security tools
  getEmailSecurityTools(detectedTools) {
    return detectedTools.filter(tool => tool.type === 'email_breach');
  }

  // Get privacy protection tools
  getPrivacyProtectionTools(detectedTools) {
    return detectedTools.filter(tool => tool.type === 'data_broker_scan');
  }

  // Get digital threats tools
  getDigitalThreatsTools(detectedTools) {
    return detectedTools.filter(tool => tool.type === 'file_scan');
  }

  // Get account security tools
  getAccountSecurityTools(detectedTools) {
    return detectedTools.filter(tool => tool.type === 'account_deleter');
  }

  // Get phone security tools
  getPhoneSecurityTools(detectedTools) {
    return detectedTools.filter(tool => tool.type === 'area_code_checker');
  }

  // Get comprehensive security tools
  getComprehensiveSecurityTools(detectedTools) {
    return detectedTools.filter(tool => tool.type === 'comprehensive_security');
  }

  // Get AI defense tools
  getAIDefenseTools(detectedTools) {
    return detectedTools.filter(tool => tool.type === 'ai_defense');
  }

  // Get network security tools
  getNetworkSecurityTools(detectedTools) {
    return detectedTools.filter(tool => tool.type === 'network_scan');
  }

  // Get general security tools
  getGeneralSecurityTools(detectedTools) {
    return detectedTools.slice(0, 2); // Return top 2 most relevant tools
  }

  // Helper methods
  calculatePatternConfidence(message, pattern) {
    const matches = message.match(pattern);
    if (!matches) return 0;
    
    // Higher confidence for urgent security patterns
    const urgentPatterns = [
      /account.*hack/i, /been.*hack/i, /think.*hack/i, /account.*compromise/i,
      /unauthorized.*access/i, /suspicious.*login/i, /account.*stolen/i
    ];
    
    const isUrgentPattern = urgentPatterns.some(urgentPattern => urgentPattern.test(message));
    return isUrgentPattern ? 0.95 : 0.8;
  }

  calculateUrgency(message) {
    const urgentWords = /urgent|immediate|emergency|hack|breach|compromise|stolen|fraud/i;
    return urgentWords.test(message) ? 'high' : 'medium';
  }

  extractSpecificMentions(message) {
    const mentions = [];
    const patterns = {
      'crack': /crack|break|decrypt/i,
      'time': /time|long|fast|quick/i,
      'breach': /breach|leak|compromise/i,
      'strength': /strong|strength|secure/i,
      'safe': /safe|safety|secure/i
    };

    for (const [mention, pattern] of Object.entries(patterns)) {
      if (pattern.test(message)) {
        mentions.push(mention);
      }
    }

    return mentions;
  }

  // Handle new chat - reset expert system
  handleNewChat() {
    this.conversationMemory = [];
    this.userProfile = {
      securityConcerns: [],
      previousScans: [],
      riskLevel: 'unknown',
      toolsUsed: []
    };
    
    // Reset security expert system
    securityExpertSystem.resetSession();
    console.log('🆕 Intelligent Security Assistant reset for new chat');
  }

  generateSecurityInsights(intent, detectedTools) {
    const insights = [];
    
    if (intent.urgency === 'high') {
      insights.push({
        type: 'urgent',
        message: 'Your message indicates a potential security issue that needs immediate attention.',
        priority: 'high'
      });
    }

    if (detectedTools.length > 0) {
      insights.push({
        type: 'tools_available',
        message: `I can help you with ${detectedTools.length} security tool${detectedTools.length > 1 ? 's' : ''} relevant to your concern.`,
        priority: 'medium'
      });
    }

    return insights;
  }

  generateNextActions(intent, detectedTools) {
    const actions = [];
    
    if (intent.primaryConcern === 'password_security') {
      actions.push('Check password strength and breach status');
      actions.push('Generate a stronger password if needed');
      actions.push('Consider using a password manager');
    }

    if (intent.primaryConcern === 'email_security') {
      actions.push('Scan email for known breaches');
      actions.push('Enable two-factor authentication');
      actions.push('Check for suspicious account activity');
    }

    if (intent.primaryConcern === 'privacy_protection') {
      actions.push('Scan data broker sites for your information');
      actions.push('Request removal from data broker databases');
      actions.push('Review privacy settings on social media');
    }

    return actions;
  }

  // Method to handle tool results and continue conversation
  processToolResult(toolResult, originalMessage) {
    const followUpResponse = this.generateFollowUpResponse(toolResult, originalMessage);
    return followUpResponse;
  }

  generateFollowUpResponse(toolResult, originalMessage) {
    switch (toolResult.type) {
      case 'password_checker':
        return this.generatePasswordFollowUp(toolResult.data);
      case 'email_breach':
        return this.generateEmailFollowUp(toolResult.data);
      case 'data_broker_scan':
        return this.generateDataBrokerFollowUp(toolResult.data);
      case 'file_scan':
        return this.generateFileScanFollowUp(toolResult.data);
      case 'account_deleter':
        return this.generateAccountDeletionFollowUp(toolResult.data);
      case 'area_code_checker':
        return this.generatePhoneCheckFollowUp(toolResult.data);
      default:
        return 'Thank you for using the security tool. Is there anything else I can help you with?';
    }
  }

  generatePasswordFollowUp(data) {
    if (data.breached) {
      return `⚠️ **Critical Security Alert**: Your password has been found in ${data.breachCount} data breaches. This password should never be used again.

**Immediate Actions Required:**
1. Change this password immediately on all accounts
2. Enable two-factor authentication where possible
3. Consider using a password manager for unique passwords

Would you like me to help you scan for other security issues or check if your email has also been compromised?`;
    } else {
      return `✅ **Good News**: Your password hasn't been found in known breaches. However, password strength is ${data.strength.level}.

**Recommendations:**
- Use unique passwords for each account
- Enable two-factor authentication
- Consider using a password manager

Would you like me to help you check your email security or scan for other privacy issues?`;
    }
  }

  generateEmailFollowUp(data) {
    if (data.isCompromised) {
      return `🚨 **Email Compromised**: Your email was found in ${data.breachCount} data breaches. This significantly increases your risk of targeted attacks.

**Immediate Actions:**
1. Change passwords on all important accounts
2. Enable two-factor authentication
3. Monitor accounts for suspicious activity
4. Consider getting a new email for sensitive accounts

The breaches occurred across multiple services, which means your personal information may be circulating in criminal networks. Would you like me to help you run a comprehensive privacy scan to see what other information might be exposed?`;
    } else {
      return `✅ **Email Status**: Your email wasn't found in known breaches, which is good news for your security.

**Preventive Measures:**
- Use unique passwords for each account
- Enable two-factor authentication
- Be cautious of phishing emails
- Regularly monitor account activity

Would you like me to help you check other aspects of your digital security, such as what personal information might be available online?`;
    }
  }

  generateDataBrokerFollowUp(data) {
    return `📊 **Privacy Scan Results**: Found ${data.sitesFound} data broker sites with your information.

**Exposed Information May Include:**
- Name and address
- Phone number
- Email address
- Age and relatives
- Employment history
- Property records

**Next Steps:**
1. Review the full list of sites
2. Submit removal requests to each site
3. Monitor for new appearances
4. Consider ongoing privacy protection

This level of exposure (${data.exposureLevel}) is unfortunately common. Would you like me to help you with account cleanup or check if your phone number is being used for scam calls?`;
  }

  generateFileScanFollowUp(data) {
    if (data.threatFound) {
      return `🚨 **Threat Detected**: The file "${data.fileName}" contains potential malware or suspicious code.

**Immediate Actions:**
1. Do NOT open or run this file
2. Delete the file from your system
3. Run a full antivirus scan
4. If already opened, change important passwords

**File Details:**
- File: ${data.fileName}
- Size: ${(data.fileSize / 1024).toFixed(1)}KB
- Threat Level: High

Would you like me to help you with other security measures, such as checking if your accounts have been compromised?`;
    } else {
      return `✅ **File is Clean**: "${data.fileName}" appears to be safe with no detected threats.

**Security Best Practices:**
- Always scan files before opening
- Keep antivirus software updated
- Be cautious with email attachments
- Avoid downloading from untrusted sources

Is there anything else I can help you with regarding your digital security?`;
    }
  }

  generateAccountDeletionFollowUp(data) {
    return `📝 **Account Deletion Plan**: Created deletion guide for ${data.totalPlatforms} platform${data.totalPlatforms > 1 ? 's' : ''}.

**Next Steps:**
1. Follow the deletion links provided
2. Download any data you want to keep first
3. Update any apps or services that use these accounts
4. Monitor for confirmation emails

**Security Benefits:**
- Reduced attack surface
- Less personal data exposure
- Improved privacy protection
- Simplified account management

Would you like me to help you with additional privacy protection measures, such as checking what personal information is available about you online?`;
  }

  generatePhoneCheckFollowUp(data) {
    if (data.riskLevel === 'high') {
      return `⚠️ **High Risk Number**: This number has been reported for scam activity.

**Recommendations:**
1. Do NOT answer calls from this number
2. Block the number on your device
3. Report to your carrier's spam protection
4. Never provide personal information

**Risk Factors:**
- ${data.scamReports} recent scam reports
- Area code: ${data.areaCode} (${data.location})
- Known for: ${data.recommendation}

Would you like me to help you with other security measures, such as checking if your personal information is being sold online?`;
    } else {
      return `✅ **Number Check**: This appears to be a legitimate number with low risk indicators.

**Details:**
- Area code: ${data.areaCode} (${data.location})
- Risk level: ${data.riskLevel}
- Recent reports: ${data.scamReports}

**General Phone Security:**
- Be cautious with unknown numbers
- Never give personal info over the phone
- Use call blocking features
- Report suspicious calls

Is there anything else I can help you with regarding your digital security?`;
    }
  }
}

// Export singleton instance
export default new IntelligentSecurityAssistant();