// Conversational Tool Detector - Intelligently detects when to suggest tools in natural conversation
import { devLog } from '../config/environment';

class ConversationalToolDetector {
  constructor() {
    // Tool detection patterns for natural conversation
    this.toolPatterns = {
      password_checker: {
        triggers: [
          // Questions about password security
          /how (safe|secure|strong) is (my|this|the) password/i,
          /is (my|this|the) password (safe|secure|strong|good)/i,
          /check (my|this|the) password/i,
          /password (strength|security|safety)/i,
          
          // Password compromise questions
          /has (my|this|the) password been (hacked|compromised|breached)/i,
          /is (my|this|the) password compromised/i,
          /password (breach|hack|compromise)/i,
          
          // Time to crack questions
          /how long (would it take|to crack|to hack) (my|this|the) password/i,
          /time to (crack|hack|break) (my|this|the) password/i,
          /how fast can.*crack.*password/i,
          
          // Password mentions with security context
          /password.*security/i,
          /secure.*password/i,
          /strong.*password/i
        ],
        extractData: (message) => {
          // Try to extract password from quotes or context
          const quotedPassword = message.match(/["'](.+?)["']/);
          const asteriskPassword = message.match(/\*+/);
          
          return {
            suggestedPassword: quotedPassword ? quotedPassword[1] : null,
            hasPasswordIndicator: !!(quotedPassword || asteriskPassword),
            context: this.getPasswordContext(message)
          };
        }
      },

      email_breach: {
        triggers: [
          // Email breach questions
          /has (my|this|the) email been (hacked|compromised|breached)/i,
          /is (my|this|the) email (safe|secure|compromised)/i,
          /email (breach|hack|compromise|leak)/i,
          /check (my|this|the) email/i,
          
          // Data breach questions
          /data breach.*email/i,
          /email.*data breach/i,
          /breach.*email/i,
          
          // Email security
          /email (security|safety)/i,
          /secure.*email/i,
          /(my|this|the) email.*safe/i
        ],
        extractData: (message) => {
          // Try to extract email from the message
          const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
          const emailMatch = message.match(emailRegex);
          
          return {
            suggestedEmail: emailMatch ? emailMatch[1] : null,
            hasEmailIndicator: !!emailMatch,
            context: this.getEmailContext(message)
          };
        }
      },

      data_broker_scan: {
        triggers: [
          // Data broker and privacy questions
          /what.*information.*(online|internet|web)/i,
          /(personal|private) (data|info|information).*(online|sold|available)/i,
          /who has (my|personal) (data|information)/i,
          /data broker/i,
          /remove (my|personal) (data|info|information)/i,
          
          // Privacy concerns
          /(my|personal) (info|information|data).*(exposed|public|visible)/i,
          /privacy (scan|check)/i,
          /find (my|personal) (data|info|information)/i,
          
          // Digital footprint and security posture analysis
          /digital footprint/i,
          /analyze.*(my|digital|security)/i,
          /(security posture|footprint).*analy/i,
          
          // Location-based privacy
          /address.*online/i,
          /phone number.*online/i,
          /(my|personal).*(address|phone|name).*internet/i
        ],
        extractData: (message) => {
          // Extract names if mentioned
          const namePattern = /(my name is|i'm|i am) ([a-z]+ [a-z]+)/i;
          const nameMatch = message.match(namePattern);
          
          return {
            suggestedName: nameMatch ? nameMatch[2] : null,
            context: this.getDataBrokerContext(message)
          };
        }
      },

      file_scan: {
        triggers: [
          // File security questions
          /is this file (safe|secure|clean)/i,
          /file.*(virus|malware|safe|secure)/i,
          /scan (this|the) file/i,
          /check file/i,
          
          // Virus/malware concerns
          /(virus|malware) (scan|check)/i,
          /file.*infected/i,
          /safe to (open|download|run)/i,
          
          // Download safety
          /download.*safe/i,
          /attachment.*safe/i,
          /suspicious file/i
        ],
        extractData: (message) => {
          return {
            context: this.getFileContext(message)
          };
        }
      },

      account_deleter: {
        triggers: [
          // Account deletion questions
          /delete (my|account|profile)/i,
          /remove (my|account|profile)/i,
          /close (my|account)/i,
          /deactivate.*account/i,
          
          // Platform-specific deletions
          /(facebook|instagram|twitter|linkedin|tiktok).*delete/i,
          /delete.*(facebook|instagram|twitter|linkedin|tiktok)/i,
          
          // Privacy cleanup
          /clean up (my|online) presence/i,
          /remove (my|online) (accounts|profiles)/i,
          /digital (cleanup|detox)/i
        ],
        extractData: (message) => {
          // Extract platform names
          const platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'snapchat', 'pinterest'];
          const mentionedPlatforms = platforms.filter(platform => 
            message.toLowerCase().includes(platform)
          );
          
          return {
            suggestedPlatforms: mentionedPlatforms,
            context: this.getAccountContext(message)
          };
        }
      },

      area_code_checker: {
        triggers: [
          // Phone number questions
          /phone number.*(safe|scam|legitimate)/i,
          /(area code|phone).*(scam|spam|fake)/i,
          /is this number (safe|real|scam)/i,
          /check.*phone number/i,
          
          // Scam call questions
          /scam call/i,
          /spam call/i,
          /suspicious.*call/i,
          /unknown number/i,
          
          // Phone security
          /phone.*(security|safety)/i,
          /caller.*legitimate/i
        ],
        extractData: (message) => {
          // Extract phone numbers
          const phoneRegex = /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/;
          const phoneMatch = message.match(phoneRegex);
          
          return {
            suggestedPhone: phoneMatch ? phoneMatch[1] : null,
            context: this.getPhoneContext(message)
          };
        }
      },

      ai_defense: {
        triggers: [
          // AI defense and strategy questions
          /ai.*defense/i,
          /cyber.*defense/i,
          /security.*strategy/i,
          /defense.*strategy/i,
          /protection.*plan/i,
          /ai.*security/i,
          /cybersecurity.*plan/i,
          /automated.*defense/i,
          /intelligent.*security/i,
          /deploy.*defense/i
        ],
        extractData: (message) => {
          return {
            context: this.getAIDefenseContext(message)
          };
        }
      },

      comprehensive_security: {
        triggers: [
          // Comprehensive security assessment
          /comprehensive.*security/i,
          /security.*assessment/i,
          /full.*security.*scan/i,
          /complete.*security/i,
          /security.*audit/i,
          /multi.*vector.*scan/i,
          /overall.*security/i,
          /enterprise.*security/i,
          /advanced.*security/i
          // Removed /security.*posture/i to avoid conflict with data_broker_scan for digital footprint requests
        ],
        extractData: (message) => {
          return {
            context: this.getComprehensiveSecurityContext(message)
          };
        }
      },

      security_test_suite: {
        triggers: [
          // Security testing and vulnerability assessment
          /security.*test/i,
          /vulnerability.*test/i,
          /penetration.*test/i,
          /pen.*test/i,
          /security.*scan/i,
          /port.*scan/i,
          /network.*scan/i,
          /ddos.*test/i,
          /malware.*scan/i,
          /virus.*scan/i,
          /ssl.*test/i,
          /wifi.*security.*test/i,
          /data.*leak.*test/i,
          /privacy.*audit/i,
          /identity.*theft.*check/i,
          /server.*security.*test/i,
          /web.*vulnerability/i,
          /open.*port/i,
          /run.*security.*test/i,
          /test.*my.*security/i,
          /check.*vulnerabilities/i
        ],
        extractData: (message) => {
          return {
            context: this.getSecurityTestContext(message)
          };
        }
      }
    };
  }

  // Main detection method
  detectToolsInMessage(message, conversationHistory = []) {
    const detectedTools = [];
    const messageLower = message.toLowerCase();
    
    devLog('Analyzing message for tool suggestions:', message);

    // Check each tool pattern
    for (const [toolType, config] of Object.entries(this.toolPatterns)) {
      for (const trigger of config.triggers) {
        if (trigger.test(message)) {
          const toolData = config.extractData(message);
          const confidence = this.calculateConfidence(message, trigger, conversationHistory);
          
          detectedTools.push({
            type: toolType,
            confidence,
            data: toolData,
            trigger: trigger.source,
            contextualRelevance: this.getContextualRelevance(toolType, conversationHistory)
          });
          
          devLog(`Detected tool: ${toolType} (confidence: ${confidence})`);
          break; // Only match first trigger per tool
        }
      }
    }

    // Sort by confidence and contextual relevance
    return detectedTools
      .sort((a, b) => (b.confidence + b.contextualRelevance) - (a.confidence + a.contextualRelevance))
      .slice(0, 2); // Return top 2 suggestions max
  }

  // Calculate confidence based on trigger strength and context
  calculateConfidence(message, trigger, conversationHistory) {
    let confidence = 0.6; // Base confidence

    // Boost confidence for direct questions
    if (/\?/.test(message)) confidence += 0.1;
    
    // Boost for specific words
    if (/check|scan|analyze|test/.test(message.toLowerCase())) confidence += 0.1;
    
    // Boost for personal pronouns
    if (/\b(my|i|me)\b/.test(message.toLowerCase())) confidence += 0.1;
    
    // Boost for security-related words
    if (/(secure|safe|protection|privacy|threat)/.test(message.toLowerCase())) confidence += 0.1;
    
    // Context boost from conversation history
    const recentMessages = conversationHistory.slice(-3);
    const hasSecurityContext = recentMessages.some(msg => 
      /(security|privacy|breach|hack|safe|protect)/.test(msg.content?.toLowerCase() || '')
    );
    
    if (hasSecurityContext) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  // Get contextual relevance based on conversation history
  getContextualRelevance(toolType, conversationHistory) {
    const recentMessages = conversationHistory.slice(-5).map(m => m.content?.toLowerCase() || '').join(' ');
    
    const contextMap = {
      password_checker: /(password|credential|login|authentication)/,
      email_breach: /(email|breach|data leak|compromise)/,
      data_broker_scan: /(privacy|personal info|data broker|remove data)/,
      file_scan: /(file|download|attachment|virus|malware)/,
      account_deleter: /(delete|remove|account|profile|social media)/,
      area_code_checker: /(phone|call|number|scam|spam)/
    };

    const pattern = contextMap[toolType];
    return pattern && pattern.test(recentMessages) ? 0.2 : 0;
  }

  // Context extractors for each tool type
  getPasswordContext(message) {
    const contexts = [];
    if (/weak|simple|easy/.test(message.toLowerCase())) contexts.push('weak_password_concern');
    if (/old|used for years/.test(message.toLowerCase())) contexts.push('old_password');
    if (/(same|similar) password/.test(message.toLowerCase())) contexts.push('password_reuse');
    if (/forgot|remember/.test(message.toLowerCase())) contexts.push('password_management');
    return contexts;
  }

  getEmailContext(message) {
    const contexts = [];
    if (/(work|business|company) email/.test(message.toLowerCase())) contexts.push('work_email');
    if (/(personal|private) email/.test(message.toLowerCase())) contexts.push('personal_email');
    if (/(old|unused) email/.test(message.toLowerCase())) contexts.push('old_email');
    if (/(shopping|accounts) email/.test(message.toLowerCase())) contexts.push('accounts_email');
    return contexts;
  }

  getDataBrokerContext(message) {
    const contexts = [];
    if (/(address|location)/.test(message.toLowerCase())) contexts.push('location_privacy');
    if (/(phone|number)/.test(message.toLowerCase())) contexts.push('phone_privacy');
    if (/(family|relatives)/.test(message.toLowerCase())) contexts.push('family_privacy');
    if (/(remove|delete|opt out)/.test(message.toLowerCase())) contexts.push('removal_intent');
    return contexts;
  }

  getFileContext(message) {
    const contexts = [];
    if (/(download|downloaded)/.test(message.toLowerCase())) contexts.push('downloaded_file');
    if (/(email|attachment)/.test(message.toLowerCase())) contexts.push('email_attachment');
    if (/(usb|flash drive)/.test(message.toLowerCase())) contexts.push('external_media');
    if (/(suspicious|weird|strange)/.test(message.toLowerCase())) contexts.push('suspicious_file');
    return contexts;
  }

  getAccountContext(message) {
    const contexts = [];
    if (/(all|multiple) accounts/.test(message.toLowerCase())) contexts.push('bulk_deletion');
    if (/(old|unused) account/.test(message.toLowerCase())) contexts.push('cleanup');
    if (/(privacy|personal) reason/.test(message.toLowerCase())) contexts.push('privacy_focused');
    if (/(social media|platforms)/.test(message.toLowerCase())) contexts.push('social_media_focus');
    return contexts;
  }

  getPhoneContext(message) {
    const contexts = [];
    if (/(unknown|strange) (number|call)/.test(message.toLowerCase())) contexts.push('unknown_caller');
    if (/(repeated|multiple) call/.test(message.toLowerCase())) contexts.push('persistent_caller');
    if (/(scam|spam|fraud)/.test(message.toLowerCase())) contexts.push('suspected_scam');
    if (/(area code|prefix)/.test(message.toLowerCase())) contexts.push('area_code_focus');
    return contexts;
  }

  getAIDefenseContext(message) {
    const contexts = [];
    if (/(automated|ai|intelligent)/.test(message.toLowerCase())) contexts.push('ai_focus');
    if (/(enterprise|business|corporate)/.test(message.toLowerCase())) contexts.push('enterprise_security');
    if (/(strategy|plan|framework)/.test(message.toLowerCase())) contexts.push('strategic_planning');
    if (/(advanced|sophisticated|complex)/.test(message.toLowerCase())) contexts.push('advanced_security');
    return contexts;
  }

  getComprehensiveSecurityContext(message) {
    const contexts = [];
    if (/(complete|full|comprehensive)/.test(message.toLowerCase())) contexts.push('full_assessment');
    if (/(enterprise|business|corporate)/.test(message.toLowerCase())) contexts.push('enterprise_grade');
    if (/(audit|assessment|analysis)/.test(message.toLowerCase())) contexts.push('security_audit');
    if (/(multi|multiple|all)/.test(message.toLowerCase())) contexts.push('multi_vector');
    return contexts;
  }

  getSecurityTestContext(message) {
    const contexts = [];
    if (/(test|testing|scan|scanning)/.test(message.toLowerCase())) contexts.push('active_testing');
    if (/(vulnerability|vulnerabilities)/.test(message.toLowerCase())) contexts.push('vuln_assessment');
    if (/(penetration|pen test)/.test(message.toLowerCase())) contexts.push('penetration_testing');
    if (/(port|network|ddos|malware|ssl|wifi)/.test(message.toLowerCase())) contexts.push('technical_testing');
    if (/(all|multiple|comprehensive)/.test(message.toLowerCase())) contexts.push('full_test_suite');
    return contexts;
  }

  // Generate conversational tool suggestions for AI responses
  generateToolSuggestions(detectedTools, userMessage) {
    if (detectedTools.length === 0) return [];

    const suggestions = detectedTools.map(tool => {
      return {
        toolType: tool.type,
        toolData: tool.data,
        confidence: tool.confidence,
        suggestion: this.generateSuggestionText(tool, userMessage)
      };
    });

    return suggestions;
  }

  generateSuggestionText(tool, userMessage) {
    const templates = {
      password_checker: [
        "I can help you check if that password has been compromised and see how secure it is.",
        "Let me analyze the strength of your password and check if it's been in any data breaches.",
        "I can test how long it would take to crack that password and check its security."
      ],
      email_breach: [
        "I can scan your email address against known data breaches to see if it's been compromised.",
        "Let me check if that email has appeared in any security breaches.",
        "I can search through breach databases to see if your email is at risk."
      ],
      data_broker_scan: [
        "I can scan data broker sites to see what personal information about you is available online.",
        "Let me check what data brokers have on file about you and help you remove it.",
        "I can find out what personal information is being sold about you online."
      ],
      file_scan: [
        "I can scan that file for viruses and malware to make sure it's safe.",
        "Let me check if that file contains any threats or malicious code.",
        "I can analyze the file for security risks before you open it."
      ],
      account_deleter: [
        "I can help you delete accounts from various platforms and clean up your online presence.",
        "Let me show you how to properly delete accounts from social media and other services.",
        "I can guide you through removing your accounts and protecting your privacy."
      ],
      area_code_checker: [
        "I can check if that phone number is associated with scams or spam calls.",
        "Let me verify if that number is legitimate or if it's been reported as suspicious.",
        "I can analyze that area code and phone number for scam patterns."
      ],
      ai_defense: [
        "I can generate a comprehensive AI-powered cybersecurity defense strategy tailored to your needs.",
        "Let me create a personalized security framework using advanced AI threat intelligence.",
        "I can deploy intelligent security recommendations based on your risk profile and threat environment."
      ],
      comprehensive_security: [
        "I can run a complete multi-vector security assessment across all your digital assets.",
        "Let me conduct a comprehensive enterprise-grade security audit of your entire digital footprint.",
        "I can perform an advanced security analysis covering all threat vectors and vulnerabilities."
      ],
      security_test_suite: [
        "I can run a comprehensive security test suite including vulnerability scans, port tests, and malware detection.",
        "Let me perform penetration testing and security assessments across multiple attack vectors.",
        "I can conduct technical security tests including network scans, SSL checks, and privacy audits."
      ]
    };

    const options = templates[tool.type] || ["I can help you with that."];
    return options[Math.floor(Math.random() * options.length)];
  }
}

// Export singleton instance
export default new ConversationalToolDetector();