import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GEMINI_API_KEY, GEMINI_API_URL, GEMINI_MODEL, SECURITY_TOOLS } from '../config/constants';
import { getApiUrl, devLog } from '../config/environment';
import CyberForgetEmailWiper from '../services/breachService';
import conversationContext from '../services/conversationContext';
import intelligentToolRecommendation from '../services/intelligentToolRecommendation';

export const useChat = () => {
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

    // Get recent tool results from chat history
    const getRecentToolResults = useCallback(() => {
        // Look for tool results in the last 10 messages
        const recentMessages = messages.slice(-10);
        const toolResults = [];
        
        for (const message of recentMessages) {
            if (message.role === 'assistant' && message.tool) {
                if (message.tool === 'data_broker_scan' && message.scanData) {
                    toolResults.push({
                        type: 'data_broker_scan',
                        timestamp: message.timestamp || Date.now(),
                        summary: `Data broker scan found ${message.scanData.sitesFound} sites with user's information. Risk level: ${message.scanData.cyberforgetRisk}. Sites included: ${message.scanData.threatCategories.map(cat => `${cat.name} (${cat.count})`).join(', ')}.`,
                        data: message.scanData
                    });
                } else if (message.isEmailScanResult && message.emailScanData) {
                    toolResults.push({
                        type: 'email_scan',
                        timestamp: message.timestamp || Date.now(),
                        summary: `Email scan completed. Status: ${message.emailScanData.isCompromised ? 'COMPROMISED' : 'CLEAN'}. ${message.emailScanData.isCompromised ? `Found in ${message.emailScanData.breachCount} breaches.` : 'No breaches found.'}`,
                        data: message.emailScanData
                    });
                }
            }
        }
        
        return toolResults;
    }, [messages]);

    // Load messages and context from localStorage on mount
    useEffect(() => {
        // Load conversation context
        const savedContext = localStorage.getItem('conversationContext');
        if (savedContext) {
            try {
                conversationContext.importContext(savedContext);
            } catch (err) {
                console.error('Error loading conversation context:', err);
            }
        }
        
        // Load messages
        const saved = localStorage.getItem('chatMessages');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    // Ensure all loaded messages have IDs
                    const messagesWithIds = parsed.map(msg => ({
                        ...msg,
                        id: msg.id || generateMessageId()
                    }));
                    setMessages(messagesWithIds);
                    setShowWelcome(false);
                }
            } catch (err) {
                console.error('Error loading chatMessages:', err);
            }
        }
    }, [generateMessageId]);

    // Save messages and context to localStorage on update
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('chatMessages', JSON.stringify(messages));
            // Also save conversation context
            localStorage.setItem('conversationContext', conversationContext.exportContext());
        }
    }, [messages]);

    // System prompt for AI (currently unused but kept for future use)
    // eslint-disable-next-line no-unused-vars
    const getSystemPrompt = () => {
        const conversationContext = messages
            .slice(-4)
            .map(m => `${m.role}: ${m.content}`)
            .join('\n');

        return `You are CyberForget AI, a world-class cybersecurity and fraud prevention expert. Your responses should:
- Focus exclusively on security, scams, fraud prevention, and data protection
- Be authoritative and precise, drawing from expert knowledge
- Provide actionable, specific advice
- Stay strictly within the security/fraud prevention domain
- Reference legitimate security tools and practices
- Maintain a professional, security-focused tone
- Use security-specific terminology appropriately
- Never discuss topics outside your security expertise
- Never repeat previous responses verbatim
- Provide new, contextual information based on the user's latest message
- If the user provides more details about a situation, analyze those specific details and adjust your advice accordingly
- Use a more urgent and focused tone when responding to immediate threats
- Include specific examples and scenarios when relevant

Important: If this is a follow-up message to a previous question, provide new insights and advice based on the additional information. Do not repeat your previous response.

Current conversation context: ${conversationContext}

Remember: Each response should build upon the conversation and provide fresh, relevant insights based on any new information provided.`;
    };

    const findMostRelevantTool = (message) => {
        const messageLower = message.toLowerCase();
        
        // Get context-aware tool recommendations first
        const contextRecommendations = conversationContext.getSmartToolRecommendations();
        
        // If we have high-priority context recommendations, use them
        if (contextRecommendations.length > 0 && contextRecommendations[0].priority === 'high') {
            const recommendation = contextRecommendations[0];
            const toolKey = Object.keys(SECURITY_TOOLS).find(key => 
                SECURITY_TOOLS[key].name.toLowerCase().includes(recommendation.tool.replace('_', ' '))
            );
            
            if (toolKey) {
                const tool = SECURITY_TOOLS[toolKey];
                return {
                    text: `${recommendation.reason} - Try our ${tool.name}`,
                    icon: tool.icon,
                    url: tool.url,
                    capability: null,
                    contextReason: recommendation.reason
                };
            }
        }
        
        // Fall back to keyword matching with context boosting
        let bestMatch = null;
        let highestScore = 0;

        Object.values(SECURITY_TOOLS).forEach(tool => {
            let score = tool.keywords.reduce((acc, keyword) => {
                const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi');
                const matches = (messageLower.match(regex) || []).length;
                return acc + matches;
            }, 0);
            
            // Boost score based on context
            const userThreats = conversationContext.getContext().securityState.currentThreats;
            const userPreferences = conversationContext.getContext().userProfile.preferredTools;
            
            // Boost if tool matches current threats
            if (userThreats.some(threat => tool.keywords.some(keyword => 
                threat.includes(keyword.replace(/\s+/g, '_'))))) {
                score += 3;
            }
            
            // Boost if user has shown interest in this tool before
            if (userPreferences.some(pref => tool.name.toLowerCase().includes(pref.toLowerCase()))) {
                score += 2;
            }

            if (score > highestScore) {
                highestScore = score;
                bestMatch = tool;
            }
        });

        if (bestMatch) {
            return {
                text: `Try our ${bestMatch.name} - ${bestMatch.description}`,
                icon: bestMatch.icon,
                url: bestMatch.url,
                capability: null
            };
        }
        return null;
    };

    const generateAIPrompt = (capability, context) => {
        const prompts = {
            security_plan: {
                sections: ['Immediate Actions', 'Investigation Steps', 'Recovery Process', 'Future Prevention'],
                format: `
IMMEDIATE ACTIONS:
- List critical steps to take right now
- Include specific security measures
TIP: Enable 2FA where available

INVESTIGATION STEPS:
- Detail how to identify compromised data
- Include verification methods
WARNING: Document everything for potential legal needs

RECOVERY PROCESS:
- Step-by-step account recovery
- Data restoration procedures
IMPORTANT: Prioritize sensitive accounts first

FUTURE PREVENTION:
- Long-term security improvements
- Monitoring recommendations
TIP: Consider using a password manager`
            },
            password_strategy: {
                sections: ['Password Creation Guidelines', 'Storage Best Practices', 'Regular Maintenance', 'Additional Security Layers'],
                format: `
PASSWORD CREATION GUIDELINES:
- Specific requirements for strong passwords
- Common patterns to avoid
TIP: Use passphrases instead of complex passwords

STORAGE BEST PRACTICES:
- Secure password management methods
- Backup procedures
WARNING: Never store passwords in plain text

REGULAR MAINTENANCE:
- Password rotation schedule
- Audit procedures
IMPORTANT: Set calendar reminders for updates

ADDITIONAL SECURITY LAYERS:
- Multi-factor authentication setup
- Recovery options
TIP: Use authenticator apps over SMS`
            },
            privacy_checklist: {
                sections: ['Digital Footprint Audit', 'Account Security', 'Data Protection', 'Ongoing Monitoring'],
                format: `
DIGITAL FOOTPRINT AUDIT:
- Online presence assessment
- Data exposure check
ACTION: Search for your information online

ACCOUNT SECURITY:
- Security settings review
- Privacy configurations
VERIFY: Check all connected apps

DATA PROTECTION:
- Encryption methods
- Backup strategies
WARNING: Regularly update privacy settings

ONGOING MONITORING:
- Alert systems setup
- Regular check schedule
TIP: Set up Google Alerts for your name`
            },
            threat_analysis: {
                sections: ['Current Vulnerabilities', 'Potential Risks', 'Mitigation Strategies', 'Monitoring Plan'],
                format: `
CURRENT VULNERABILITIES:
- Immediate security gaps
- System weaknesses
ACTION: Run security scans

POTENTIAL RISKS:
- Future threat scenarios
- Impact assessment
WARNING: Consider both direct and indirect risks

MITIGATION STRATEGIES:
- Specific countermeasures
- Implementation steps
IMPORTANT: Prioritize based on risk level

MONITORING PLAN:
- Ongoing detection methods
- Response procedures
TIP: Automate where possible`
            },
            security_assessment: {
                sections: ['Current Security Status', 'Identified Risks', 'Recommended Actions', 'Priority Timeline'],
                format: `
CURRENT SECURITY STATUS:
- Overall security posture
- Existing protections
VERIFY: List active security measures

IDENTIFIED RISKS:
- Specific vulnerabilities
- Exposure points
WARNING: Include both technical and human factors

RECOMMENDED ACTIONS:
- Prioritized improvements
- Implementation steps
ACTION: Start with quick wins

PRIORITY TIMELINE:
- Implementation schedule
- Milestone targets
TIP: Break down into manageable phases`
            },
            security_action_plan: {
                sections: ['Immediate Steps', 'Short-term Goals', 'Long-term Strategy', 'Success Metrics'],
                format: `
IMMEDIATE STEPS:
- Critical actions needed now
- Quick security wins
ACTION: Focus on highest impact items

SHORT-TERM GOALS:
- 30-day objectives
- Implementation plan
IMPORTANT: Set realistic deadlines

LONG-TERM STRATEGY:
- Sustainable security practices
- Future-proofing methods
TIP: Build security into routine

SUCCESS METRICS:
- Progress indicators
- Verification methods
VERIFY: Regular security assessments`
            },
            privacy_plan: {
                sections: ['Immediate Actions', 'Ongoing Protection', 'Monitoring & Alerts', 'Long-term Privacy'],
                format: `
IMMEDIATE ACTIONS:
- Run CleanData's Data Broker Scanner
- Review exposed information
- Start removal process with our service
ACTION: Begin with comprehensive scan

ONGOING PROTECTION:
- Use CleanData's continuous monitoring
- Regular privacy assessments
- Automated removal requests
IMPORTANT: Maintain consistent protection

MONITORING & ALERTS:
- 24/7 dark web monitoring
- Real-time exposure alerts
- Regular scan reports
TIP: Stay informed of new exposures

LONG-TERM PRIVACY:
- Regular privacy audits
- Proactive data removal
- Privacy-first practices
VERIFY: Continuous protection`
            }
        };

        const selectedPrompt = prompts[capability] || prompts.security_assessment;
        return `As a cybersecurity expert, create a detailed ${capability.replace(/_/g, ' ')} following this structure:

${selectedPrompt.format}

Context: ${context}
Focus on practical, actionable steps that can be implemented immediately.`;
    };

    const generateAICapabilityOption = (message, aiResponse) => {
        // Define different AI capabilities based on context
        const capabilities = [
            {
                keywords: ['hack', 'breach', 'leak', 'exposed', 'compromised', 'stolen data', 'identity theft'],
                text: "Create a personalized data breach response plan",
                icon: "📋",
                capability: "security_plan"
            },
            {
                keywords: ['password', 'login', 'authentication', 'account security', 'weak password'],
                text: "Generate a comprehensive password security strategy",
                icon: "🔐",
                capability: "password_strategy"
            },
            {
                keywords: ['privacy', 'personal information', 'data broker', 'location', 'name', 'address'],
                text: "Build a custom privacy protection checklist",
                icon: "🛡️",
                capability: "privacy_checklist"
            },
            {
                keywords: ['scam', 'fraud', 'suspicious', 'phishing', 'fake', 'call', 'phone'],
                text: "Analyze potential security threats",
                icon: "🔍",
                capability: "threat_analysis"
            },
            {
                keywords: ['delete', 'remove', 'old account', 'unused account', 'deactivate'],
                text: "Create an account cleanup action plan",
                icon: "🗑️",
                capability: "security_action_plan"
            },
            {
                keywords: ['file', 'attachment', 'download', 'virus', 'malware', 'scan'],
                text: "Generate a file security assessment guide",
                icon: "⚡",
                capability: "threat_analysis"
            }
        ];

        const combinedText = (message + " " + aiResponse).toLowerCase();
        const matchedCapability = capabilities.find(cap => 
            cap.keywords.some(keyword => combinedText.includes(keyword.toLowerCase()))
        );

        return matchedCapability || {
            text: "Create a comprehensive security assessment",
            icon: "📊",
            capability: "security_assessment"
        };
    };

    // Generate AI strategy response for specific capabilities
    const generateAIStrategyResponse = async (userMessage, capability) => {
        const strategies = {
            security_plan: {
                sections: ['Immediate Actions', 'Account Security', 'Ongoing Protection', 'Recovery Steps'],
                format: `
🛡️ **DATA BREACH RESPONSE PLAN**

Based on your email breach concern, here's your personalized security response:

**IMMEDIATE ACTIONS:**
🚨 Change passwords on all accounts linked to this email
🚨 Check for unauthorized account access
ACTION: Start with your most critical accounts (banking, email, social media)

**ACCOUNT SECURITY:**
🔒 Enable two-factor authentication everywhere
🔒 Review recent login activity
ACTION: Secure all accounts with unique, strong passwords

**ONGOING PROTECTION:**
👁️ Monitor accounts for suspicious activity
👁️ Set up breach alerts and notifications
ACTION: Use identity monitoring services

**RECOVERY STEPS:**
📧 Check what data was compromised in the breach
📧 Contact affected services to report the breach
ACTION: Document everything and follow up on security measures`
            },
            privacy_checklist: {
                sections: ['Digital Footprint Audit', 'Account Security', 'Data Protection', 'Ongoing Monitoring'],
                format: `
🕵️ **PRIVACY PROTECTION CHECKLIST**

Based on your concern about contractor fraud, here's a comprehensive privacy protection plan:

**DIGITAL FOOTPRINT AUDIT:**
✓ Online presence assessment
✓ Data exposure check
ACTION: Search for your information online

**ACCOUNT SECURITY:**
✓ Security settings review
✓ Privacy configurations
ACTION: Enable two-factor authentication everywhere

**DATA PROTECTION:**
✓ Information sharing review
✓ Third-party access audit
ACTION: Limit data broker access

**ONGOING MONITORING:**
✓ Regular security checks
✓ Alert system setup
ACTION: Set up identity monitoring`
            },
            password_strategy: {
                sections: ['Password Assessment', 'Secure Generation', 'Management Tools', 'Additional Security'],
                format: `
🔐 **PASSWORD SECURITY STRATEGY**

CURRENT PASSWORD ASSESSMENT:
- Strength evaluation
- Reuse detection
ACTION: Identify weak passwords

SECURE PASSWORD GENERATION:
- Length requirements (12+ characters)
- Complexity rules
ACTION: Create unique passwords for each account

PASSWORD MANAGEMENT TOOLS:
- Password manager selection
- Secure storage setup
ACTION: Install and configure password manager

ADDITIONAL SECURITY LAYERS:
- Multi-factor authentication setup
- Recovery options
TIP: Use authenticator apps over SMS`
            },
            threat_analysis: {
                sections: ['Threat Assessment', 'Immediate Actions', 'Prevention Measures', 'Recovery Steps'],
                format: `
🔍 **SECURITY THREAT ANALYSIS**

Based on your suspicious phone call concern, here's your threat assessment:

**IMMEDIATE THREAT ASSESSMENT:**
⚠️ Phone scam detection
⚠️ Social engineering attempt
ACTION: Do not provide any personal information

**IMMEDIATE ACTIONS:**
🚨 End the call immediately
🚨 Do not call back
ACTION: Block the number and report to authorities

**PREVENTION MEASURES:**
🛡️ Screen unknown numbers
🛡️ Never share personal info over phone
ACTION: Set up call screening and verification protocols

**RECOVERY STEPS:**
🔒 Monitor accounts for unusual activity
🔒 Alert banks/credit cards if info was shared
ACTION: Implement identity monitoring`
            },
            security_action_plan: {
                sections: ['Assessment', 'Priority Actions', 'Implementation', 'Monitoring'],
                format: `
🗑️ **SECURITY ACTION PLAN**

Comprehensive security cleanup and protection strategy:

**CURRENT SITUATION ASSESSMENT:**
📊 Security audit
📊 Risk evaluation
ACTION: Identify vulnerabilities

**PRIORITY ACTIONS:**
🎯 Critical security fixes
🎯 Account cleanup
ACTION: Address high-risk items first

**IMPLEMENTATION STEPS:**
⚡ Systematic execution
⚡ Progress tracking
ACTION: Follow structured approach

**ONGOING MONITORING:**
👁️ Continuous surveillance
👁️ Regular reviews
ACTION: Maintain security hygiene`
            }
        };

        const strategy = strategies[capability];
        if (!strategy) {
            return {
                mainResponse: "I apologize, but I couldn't generate the specific strategy you requested. Let me help you with general security advice instead.",
                isStrategy: false,
                followUpOptions: []
            };
        }

        return {
            mainResponse: strategy.format,
            isStrategy: true,
            followUpOptions: []
        };
    };

    const formatAIStrategy = (strategy, type) => {
        const icons = {
            check: '✓',
            important: '🚨',
            tip: '💡',
            action: '⚡',
            shield: '🛡️',
            key: '🔑',
            warning: '⚠️',
            save: '💾',
            copy: '📋'
        };

        // More concise, mobile-friendly sections
        const headers = {
            security_plan: {
                title: '🛡️ Breach Response Plan',
                subtitle: 'Immediate steps to secure your accounts',
                urgency: 'HIGH PRIORITY'
            },
            password_strategy: {
                title: '🔐 Password Security Guide',
                subtitle: 'Build unbreakable password protection',
                urgency: 'ESSENTIAL'
            },
            privacy_checklist: {
                title: '🕵️ Privacy Protection Plan',
                subtitle: 'Take control of your digital footprint',
                urgency: 'RECOMMENDED'
            },
            threat_analysis: {
                title: '🔍 Security Threat Assessment',
                subtitle: 'Identify and neutralize risks',
                urgency: 'URGENT'
            },
            security_assessment: {
                title: '📊 Complete Security Audit',
                subtitle: 'Your personalized security roadmap',
                urgency: 'IMPORTANT'
            },
            security_action_plan: {
                title: '⚡ Security Action Plan',
                subtitle: 'Step-by-step security improvements',
                urgency: 'RECOMMENDED'
            }
        };

        // Generate better structured content
        const generateActionItems = (type) => {
            const actionSets = {
                security_plan: [
                    "Change passwords on all critical accounts immediately",
                    "Enable two-factor authentication where available", 
                    "Review recent account activity and login logs",
                    "Run a full antivirus scan on all devices",
                    "Check credit reports for unauthorized activity",
                    "Update security questions and recovery emails",
                    "Document all suspicious activity with timestamps",
                    "Contact financial institutions to alert them of potential compromise"
                ],
                password_strategy: [
                    "Install a reputable password manager (1Password, Bitwarden, etc.)",
                    "Generate unique 16+ character passwords for all accounts",
                    "Enable two-factor authentication on critical accounts",
                    "Update passwords on high-priority accounts first (email, banking, work)",
                    "Review and remove access to unused apps and services",
                    "Set up security alerts for login attempts on important accounts",
                    "Create secure backup codes and store them safely",
                    "Schedule monthly password security reviews"
                ],
                privacy_checklist: [
                    "🔍 **SCAN YOUR DATA EXPOSURE**: Run a comprehensive data broker scan to see what personal information is being sold online about you",
                    "📧 **CHECK EMAIL BREACHES**: Verify if your email addresses appear in any known data breaches using our email checker",
                    "🔒 **SOCIAL MEDIA AUDIT**: Review and tighten privacy settings on Facebook, Instagram, Twitter, LinkedIn, and other platforms",
                    "📱 **MOBILE PRIVACY**: Review app permissions on your phone and remove unnecessary access to contacts, location, camera, etc.",
                    "🌐 **BROWSER SECURITY**: Switch to privacy-focused browsers (Firefox, Brave) and search engines (DuckDuckGo)",
                    "📍 **LOCATION TRACKING**: Disable location sharing in apps and services unless absolutely necessary",
                    "☁️ **CLOUD STORAGE**: Audit Google/Apple/Microsoft data collection and sharing preferences in your accounts",
                    "🏠 **SMART DEVICES**: Enable privacy controls on smart TVs, speakers, and IoT products in your home",
                    "🔐 **VPN PROTECTION**: Set up VPN for public Wi-Fi usage and general browsing privacy",
                    "🗑️ **DATA BROKER REMOVAL**: Systematically opt out of data broker services and people search sites that expose your information"
                ],
                threat_analysis: [
                    "Conduct immediate security scan of all connected devices",
                    "Review network traffic for suspicious connections or data transfers",
                    "Check for unauthorized software installations or browser extensions",
                    "Analyze recent email and message history for phishing attempts",
                    "Verify integrity of important files and backup systems",
                    "Review access logs for cloud storage and online accounts",
                    "Implement network segmentation for IoT devices if possible",
                    "Set up monitoring alerts for future suspicious activity"
                ],
                security_assessment: [
                    "Inventory all devices, accounts, and digital assets",
                    "Rate current security measures from 1-10 across all platforms",
                    "Identify the top 5 most vulnerable areas requiring immediate attention",
                    "Test backup and recovery procedures for critical data",
                    "Evaluate current cybersecurity tools and their effectiveness",
                    "Review and update incident response procedures",
                    "Assess third-party service security (cloud storage, email providers)",
                    "Create timeline for implementing security improvements by priority"
                ],
                security_action_plan: [
                    "Prioritize security tasks by risk level and impact",
                    "Set specific deadlines for each security improvement",
                    "Assign responsible parties for each action item (if applicable)",
                    "Allocate budget for security tools and services needed",
                    "Schedule regular security reviews and maintenance tasks",
                    "Create incident response plan with clear escalation procedures",
                    "Establish ongoing security training and awareness programs",
                    "Set up metrics to track security improvement progress"
                ]
            };
            
            return actionSets[type] || actionSets.security_plan;
        };

        const header = headers[type] || headers.security_assessment;
        const actionItems = generateActionItems(type);
        const strategyId = `strategy-${Date.now()}`;
        
        return `
<div class="ai-strategy-modern" id="${strategyId}">
    <div class="strategy-header-modern">
        <div class="strategy-title-row">
            <h2>${header.title}</h2>
            <span class="urgency-badge urgency-${header.urgency.toLowerCase().replace(' ', '-')}">${header.urgency}</span>
        </div>
        <p class="strategy-subtitle">${header.subtitle}</p>
    </div>

    <div class="strategy-quick-actions">
        <div class="quick-action-header">
            <span class="icon">${icons.action}</span>
            Action Plan
            <div class="action-controls">
                <button class="copy-strategy-btn" onclick="copyStrategyToClipboard('${strategyId}')">
                    <span>${icons.copy}</span> Copy Plan
                </button>
            </div>
        </div>
        <div class="quick-actions-grid">
            ${actionItems.map((action, index) => `
                <div class="quick-action-item">
                    <span class="action-number">${index + 1}</span>
                    <span class="action-text">${action}</span>
                </div>
            `).join('')}
        </div>
    </div>

    <div class="strategy-engagement">
        <div class="engagement-prompt">
            <span class="icon">${icons.tip}</span>
            <div class="engagement-text">
                <strong>Save this plan!</strong> Copy it to your clipboard and implement these steps in order. 
                Ask me about any specific step for detailed guidance.
            </div>
        </div>
    </div>

    <script>
        window.copyStrategyToClipboard = function(strategyId) {
            const element = document.getElementById(strategyId);
            const title = element.querySelector('h2').textContent;
            const subtitle = element.querySelector('.strategy-subtitle').textContent;
            const actions = Array.from(element.querySelectorAll('.action-text')).map((el, i) => 
                \`\${i + 1}. \${el.textContent}\`
            ).join('\\n');
            
            const text = \`\${title}\\n\${subtitle}\\n\\nAction Items:\\n\${actions}\\n\\nGenerated by CleanData AI Security Expert\`;
            
            navigator.clipboard.writeText(text).then(() => {
                const btn = element.querySelector('.copy-strategy-btn');
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<span>✅</span> Copied!';
                btn.style.background = 'rgba(66, 255, 181, 0.2)';
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
                alert('Copy failed. Please select and copy the text manually.');
            });
        };
    </script>
</div>`;
    };

    // Fetch response from Gemini API
    const fetchGeminiResponse = async (userMessage) => {

        if (!GEMINI_API_KEY) {
            console.error('Gemini API key is not configured');
            return getFallbackResponse(userMessage);
        }

        // Analyze message for context
        conversationContext.analyzeMessage(userMessage, 'user');
        
        // Generate context-aware prompt
        const contextPrompt = conversationContext.generateContextPrompt();
        const contextSummary = conversationContext.generateContextSummary();
        
        // Include recent tool results in context
        const recentToolResults = getRecentToolResults();
        
        let expertPrompt = `${contextPrompt}

        Current conversation context:
        - User's technical level: ${contextSummary.userProfile.techLevel}
        - Current mood: ${contextSummary.conversationSummary.mood}
        - Security risk level: ${contextSummary.securitySummary.riskLevel}
        - Conversation stage: ${contextSummary.conversationSummary.stage}`;
        
        if (contextSummary.securitySummary.currentThreats.length > 0) {
            expertPrompt += `
        - Active security concerns: ${contextSummary.securitySummary.currentThreats.join(', ')}`;
        }
        
        if (contextSummary.conversationSummary.currentFocus) {
            expertPrompt += `
        - Current focus: ${contextSummary.conversationSummary.currentFocus}`;
        }
        
        // Include recent tool results in the context
        if (recentToolResults.length > 0) {
            expertPrompt += `
        
        Recent security tool results:`;
            recentToolResults.forEach(result => {
                expertPrompt += `
        - ${result.type}: ${result.summary}`;
            });
            expertPrompt += `
        
        Use these results to provide context-aware responses. If the user asks follow-up questions about these results, reference the specific findings and provide actionable advice.`;
        }
        
        expertPrompt += `

        Available tools for recommendations:
        - /location: Free Broker Scan - Find potential scams and threats in user's location
        - /data-leak: Check Your Email - Check if email addresses appear in data breaches
        - /password-check: Password Checker - Analyze password strength and security
        - /area-codes: Phone Number Checker - Check area codes for scam patterns
        - /delete-account: Account Deleter - Help delete accounts from various platforms
        - /file-scan: Virus Scanner - Scan files for malware and threats
        
        You must respond with a valid JSON object with the following structure:
        {
            "response": "Your helpful response text here",
            "tldr": "Brief one-line summary",
            "recommendedTool": "/location" | "/data-leak" | "/password-check" | "/area-codes" | "/delete-account" | "/file-scan" | null,
            "toolReason": "Why this tool is recommended based on their question"
        }
        
        Choose the most relevant tool based on the user's question:
        - Use "/data-leak" if they mention emails, breaches, data leaks, account security, or want to check if their information was compromised
        - Use "/location" if they mention local threats, broker scans, location-based security, or regional concerns
        - Use "/password-check" if they mention passwords, password security, strength checking, or credential concerns
        - Use "/area-codes" if they mention phone calls, area codes, phone scams, suspicious numbers, or telemarketing
        - Use "/delete-account" if they mention deleting accounts, removing profiles, or cleaning up their online presence
        - Use "/file-scan" if they mention files, downloads, malware, viruses, or suspicious attachments
        - Use null if no specific tool is particularly relevant
        
        Query: ${userMessage}`;

        try {
            devLog('Making Gemini API request via backend...');
            const response = await fetch(getApiUrl('/api/chat'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: expertPrompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Gemini API error response:', errorText);
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }

            // Get the response as text first
            const responseText = await response.text();

            // Try to parse the response text
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse response as JSON:', parseError);
                throw new Error('Invalid JSON response from API');
            }
            
            if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                throw new Error('Invalid response format from Gemini API');
            }

            const aiResponseText = data.candidates[0].content.parts[0].text;
            
            // Parse the structured JSON response
            let structuredResponse;
            try {
                // Clean the response text in case there are markdown code blocks
                const cleanedResponse = aiResponseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                structuredResponse = JSON.parse(cleanedResponse);
            } catch (parseError) {
                console.error('Failed to parse structured response:', parseError);
                // Fallback to original behavior if JSON parsing fails
                structuredResponse = {
                    response: aiResponseText,
                    tldr: null,
                    recommendedTool: null,
                    toolReason: null
                };
            }
            
            // Check if this is a strategy request
            const isStrategy = userMessage.includes('create a') || 
                             userMessage.includes('generate a') || 
                             userMessage.includes('develop a') ||
                             userMessage.includes('make a plan');
                             
            const formattedResponse = isStrategy ? 
                formatAIStrategy(structuredResponse.response, determineStrategyType(userMessage)) : 
                structuredResponse.response;

            const options = [];
            
            // Add Gemini's structured tool recommendation first if available
            if (structuredResponse.recommendedTool) {
                const toolMapping = {
                    '/email-scan': {
                        text: `🔍 Check Your Email - ${structuredResponse.toolReason}`,
                        icon: '📧',
                        url: '/email-scan',
                        capability: null,
                        urgency: 'high',
                        confidence: 'high',
                        reasons: [structuredResponse.toolReason]
                    },
                    '/location': {
                        text: `📍 Location Scanner - ${structuredResponse.toolReason}`,
                        icon: '📍',
                        url: '/location',
                        capability: null,
                        urgency: 'high',
                        confidence: 'high',
                        reasons: [structuredResponse.toolReason]
                    }
                };
                
                const recommendedTool = toolMapping[structuredResponse.recommendedTool];
                if (recommendedTool) {
                    options.push(recommendedTool);
                }
            }
            
            // Get intelligent tool recommendations as backup
            const intelligentRecommendations = intelligentToolRecommendation.getRecommendations(
                conversationContext, 
                userMessage + " " + structuredResponse.response, 
                2
            );
            
            // Filter out current page's tool (don't suggest RavenAI when on /scamai)
            const currentPath = window.location.pathname;
            
            const filteredRecommendations = intelligentRecommendations.filter(rec => {
                // Skip CleanData AI suggestions - they're already using CleanData AI
                const isCleanDataAI = rec.tool.name.toLowerCase().includes('cleandata') || 
                                     rec.tool.url === '/scamai' ||
                                     rec.tool.name.toLowerCase().includes('scam ai') ||
                                     rec.toolKey === 'scamai' ||
                                     rec.toolKey === 'cleandata' ||
                                     rec.toolKey === 'scamAI' ||
                                     rec.tool.name === 'CleanData AI';
                
                // Always filter out CleanData AI since user is already using it
                if (isCleanDataAI) {
                    return false;
                }
                
                // Also filter out if the tool URL matches current path
                if (rec.tool.url === currentPath) {
                    return false;
                }
                
                return true;
            });
            
            // Add intelligent recommendations with deduplication
            filteredRecommendations.forEach(rec => {
                const newOption = {
                    text: rec.personalizedMessage,
                    icon: rec.tool.icon,
                    url: rec.tool.url,
                    capability: null,
                    urgency: rec.urgency,
                    confidence: rec.confidence,
                    reasons: rec.reasons
                };
                
                // Check for duplicates by URL and similar text
                const isDuplicate = options.some(opt => 
                    opt.url === newOption.url || 
                    opt.text === newOption.text ||
                    (opt.text && newOption.text && opt.text.toLowerCase().includes(rec.tool.name.toLowerCase()))
                );
                
                if (!isDuplicate) {
                    options.push(newOption);
                }
            });
            
            // Parse embedded tool suggestions from AI response text
            const embeddedSuggestions = parseEmbeddedToolSuggestions(structuredResponse.response);
            const filteredEmbeddedSuggestions = embeddedSuggestions.filter(suggestion => {
                // Skip suggestions for the current page
                if (currentPath === suggestion.url) {
                    return false;
                }
                return true;
            });
            
            filteredEmbeddedSuggestions.forEach(suggestion => {
                // Avoid duplicates by URL and text
                if (!options.some(opt => opt.url === suggestion.url || opt.text === suggestion.text)) {
                    options.push(suggestion);
                }
            });
            
            // Fallback to basic tool finding if no recommendations yet
            if (options.length === 0) {
                const relevantTool = findMostRelevantTool(userMessage + " " + structuredResponse.response);
                if (relevantTool) {
                    options.push(relevantTool);
                }
            }

            // Final deduplication step - remove any remaining duplicates
            const uniqueOptions = [];
            const seenUrls = new Set();
            const seenTexts = new Set();
            const seenToolNames = new Set();
            
            options.forEach(option => {
                const textLower = option.text ? option.text.toLowerCase() : '';
                
                // Extract tool name from text (usually after "Try our" or at beginning)
                let toolName = '';
                const tryOurMatch = textLower.match(/try our ([^-]+)/);
                if (tryOurMatch) {
                    toolName = tryOurMatch[1].trim();
                } else {
                    // Look for common tool names
                    const toolNameMatch = textLower.match(/(check your email|free broker scan|password checker|phone number checker|account deleter|virus scanner|cleandata ai)/);
                    if (toolNameMatch) {
                        toolName = toolNameMatch[1].trim();
                    }
                }
                
                const isUrlDuplicate = option.url && seenUrls.has(option.url);
                const isTextDuplicate = textLower && seenTexts.has(textLower);
                const isToolNameDuplicate = toolName && seenToolNames.has(toolName);
                
                if (!isUrlDuplicate && !isTextDuplicate && !isToolNameDuplicate) {
                    if (option.url) seenUrls.add(option.url);
                    if (textLower) seenTexts.add(textLower);
                    if (toolName) seenToolNames.add(toolName);
                    uniqueOptions.push(option);
                }
            });

            const aiCapability = generateAICapabilityOption(userMessage, structuredResponse.response);
            uniqueOptions.push(aiCapability);

            return {
                mainResponse: formattedResponse,
                followUpOptions: convertBackendUrlsToFrontend(uniqueOptions),
                isStrategy,
                structuredData: {
                    tldr: structuredResponse.tldr,
                    recommendedTool: structuredResponse.recommendedTool,
                    toolReason: structuredResponse.toolReason
                }
            };
        } catch (err) {
            console.error("Gemini fetch error:", err);
            return {
                mainResponse: 'I apologize, but I encountered an error processing your request. Please try again in a few moments.',
                followUpOptions: convertBackendUrlsToFrontend([]),
                isStrategy: false,
                structuredData: {
                    tldr: null,
                    recommendedTool: null,
                    toolReason: null
                }
            };
        }
    };

    const determineStrategyType = (message) => {
        const typeMatches = {
            'breach': 'security_plan',
            'password': 'password_strategy',
            'privacy': 'privacy_checklist',
            'threat': 'threat_analysis',
            'assessment': 'security_assessment',
            'action plan': 'security_action_plan'
        };

        return Object.entries(typeMatches)
            .find(([key]) => message.toLowerCase().includes(key))?.[1] 
            || 'security_assessment';
    };

    // Generate dynamic options based on context
    const generateDynamicOptions = async (lastMessage) => {
        if (!GEMINI_API_KEY) return null;

        // Get conversation context for better question generation
        const contextSummary = conversationContext.generateContextSummary();
        
        // Generate context-aware prompt for follow-up questions
        let contextPrompt = `Based on this cybersecurity conversation, generate 3 logical follow-up questions.
        
        User Context:
        - Technical level: ${contextSummary.userProfile.techLevel}
        - Current mood: ${contextSummary.conversationSummary.mood}
        - Risk level: ${contextSummary.securitySummary.riskLevel}
        - Stage: ${contextSummary.conversationSummary.stage}`;
        
        if (contextSummary.securitySummary.currentThreats.length > 0) {
            contextPrompt += `
        - Active concerns: ${contextSummary.securitySummary.currentThreats.join(', ')}`;
        }
        
        if (contextSummary.securitySummary.compromisedEmails > 0) {
            contextPrompt += `
        - Has ${contextSummary.securitySummary.compromisedEmails} compromised email(s)`;
        }

        try {
            const response = await fetch(getApiUrl('/api/chat'), {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${contextPrompt}

                            AI Assistant's last message: "${lastMessage}"
                            
                            Generate 3 possible user responses in this exact JSON format. Return ONLY the raw JSON with no markdown formatting, no code blocks, and no additional text:
                            {
                                "positive": {
                                    "text": "a positive/agreeing response",
                                    "icon": "✅"
                                },
                                "negative": {
                                    "text": "a negative/disagreeing response",
                                    "icon": "❌"
                                },
                                "moreInfo": {
                                    "text": "a response asking for clarification or more details",
                                    "icon": "❓"
                                }
                            }
                            
                            Rules:
                            1. Make responses natural and conversational
                            2. Make responses specific to the context of the message
                            3. Keep each response under 60 characters
                            4. Don't use generic responses
                            5. Return ONLY the JSON object with no additional text or formatting
                            6. Do not include any markdown code blocks or backticks`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.8,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 512
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                })
            });

            if (!response.ok) return null;

            const data = await response.json();
            const responseText = data.candidates[0].content.parts[0].text.trim();
            
            // Clean up the response text to ensure it's valid JSON
            const cleanedText = responseText
                .replace(/```json\s*|\s*```/g, '') // Remove code block markers
                .replace(/`/g, '')                 // Remove any backticks
                .trim();                           // Remove extra whitespace
            
            // Try to find the JSON object in the text
            const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.error('No valid JSON object found in response');
                return null;
            }

            const jsonStr = jsonMatch[0];
            
            try {
                const options = JSON.parse(jsonStr);
                return [
                    options.positive,
                    options.negative,
                    options.moreInfo
                ];
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                return null;
            }
        } catch (error) {
            console.error('Error generating options:', error);
            return null;
        }
    };

    // Process user message and get AI response
    const processMessage = useCallback(async (userMessage, capability = null) => {
        if (!userMessage.trim()) return;

        const userMessageObj = {
            id: generateMessageId(),
            role: 'user',
            content: userMessage // Keep original user message for better context
        };
        setMessages(prev => [...prev, userMessageObj]);
        setUserInput('');

        // Check for email in message first (highest priority)
        const emailFound = detectEmailInMessage(userMessage);
        
        if (emailFound && !capability) {
            const typingMessageId = generateMessageId();
            setMessages(prev => [...prev, {
                id: typingMessageId,
                role: 'assistant',
                content: '',
                isTyping: true
            }]);
            setIsTyping(true);

            try {
                const result = await CyberForgetEmailWiper.checkEmailBreaches(emailFound);
                const report = CyberForgetEmailWiper.formatBreachReport(emailFound, result);
                
                // Update conversation context with email scan results
                conversationContext.addCompromisedEmail(emailFound, result.count || 0);
                if (result.status === 'compromised') {
                    conversationContext.addSecurityConcern('email_breach');
                    conversationContext.addTopic('email_security', 'high');
                }
                
                // Generate context-aware follow-up questions
                const contextSummary = conversationContext.generateContextSummary();
                let followUpQuestions;
                
                if (result.status === 'compromised') {
                    followUpQuestions = [
                        "What's a data broker scan?",
                        "How do I secure my accounts?", 
                        "Should I check another email?"
                    ];
                    
                    // Add urgent questions if high risk
                    if (contextSummary.securitySummary.riskLevel === 'critical') {
                        followUpQuestions.unshift("What should I do immediately?");
                    }
                } else {
                    followUpQuestions = [
                        "How do I secure my accounts?",
                        "What should I do next?",
                        "Check another email?"
                    ];
                    
                    // Add preventive questions for clean emails
                    if (contextSummary.userProfile.techLevel === 'beginner') {
                        followUpQuestions.push("How can I stay protected?");
                    }
                }
                
                setMessages(prev => {
                    const filtered = prev.filter(msg => msg.id !== typingMessageId);
                    return [...filtered, {
                        id: generateMessageId(),
                        role: 'assistant',
                        content: `Email scan completed for ${emailFound}`, // Simple string content
                        tool: 'email_wiper',
                        isEmailScanResult: true, // Flag to identify email scan results
                        emailScanData: report, // Store the actual scan data for EmailScanResult component
                        followUpQuestions: followUpQuestions
                    }];
                });
                return;
            } catch (error) {
                console.error('Email wiper error:', error);
                setMessages(prev => {
                    const filtered = prev.filter(msg => msg.id !== typingMessageId);
                    return [...filtered, {
                        id: generateMessageId(),
                        role: 'assistant',
                        content: `Sorry, I couldn't scan that email right now. Please try again or contact support if the issue persists.`
                    }];
                });
                return;
            } finally {
                setIsTyping(false);
            }
        }

        // Check for password safety requests
        if (detectPasswordRequest(userMessage) && !capability) {
            const response = {
                id: generateMessageId(),
                role: 'assistant',
                content: generatePasswordCheckIntro(),
                options: [{
                    text: "Check Password Strength & Safety",
                    icon: "🔐",
                    url: SECURITY_TOOLS.password_check.url,
                    capability: null
                }],
                followUpQuestions: [
                    "What makes a password strong?",
                    "Best password managers?",
                    "How to enable 2FA?"
                ]
            };
            setMessages(prev => [...prev, response]);
            return;
        }

        const typingMessageId = generateMessageId();
        setMessages(prev => [...prev, {
            id: typingMessageId,
            role: 'assistant',
            content: '',
            isTyping: true
        }]);
        setIsTyping(true);

        try {
            let response;
            
            // Check if this is a capability request (AI strategy generation)
            if (capability) {
                response = await generateAIStrategyResponse(userMessage, capability);
            } else {
                // Use fetchGeminiResponse for regular AI responses
                response = await fetchGeminiResponse(userMessage);
            }
            
            // Generate dynamic options for the response (skip for strategies)
            const dynamicOptions = (capability || response.isStrategy) ? [] : await generateDynamicOptions(response.mainResponse);
            
            setMessages(prev => {
                const filtered = prev.filter(msg => msg.id !== typingMessageId);
                return [...filtered, {
                    id: generateMessageId(),
                    role: 'assistant',
                    content: response.mainResponse,
                    options: response.isStrategy ? [] : response.followUpOptions,
                    followUpQuestions: dynamicOptions || [],
                    isStrategy: response.isStrategy,
                    suggestedTools: response.suggestedTools || []
                }];
            });
        } catch (error) {
            console.error('Error processing message:', error);
            const fallbackResponse = getFallbackResponse(userMessage);
            setMessages(prev => {
                const filtered = prev.filter(msg => msg.id !== typingMessageId);
                return [...filtered, {
                    id: generateMessageId(),
                    role: 'assistant',
                    content: fallbackResponse.mainResponse,
                    options: fallbackResponse.followUpOptions,
                    isStrategy: false
                }];
            });
        } finally {
            setIsTyping(false);
        }
    }, [generateMessageId, fetchGeminiResponse, generateDynamicOptions]);

    // Handle sending message
    const handleSendMessage = useCallback(async () => {
        if (!userInput.trim()) return;
        await processMessage(userInput);
    }, [userInput, processMessage]);

    // Handle pre-made question click with enhanced tool matching
    const handlePreMadeQuestionClick = useCallback(async (question, options) => {
        console.log('🔧 handlePreMadeQuestionClick called:', { question, options });
        
        // Check if this is a premade question that should auto-navigate to a tool
        if (options && options.toolType) {
            console.log('✅ Found toolType:', options.toolType);
            
            const toolMapping = {
                'data_broker_scan': '/location',
                'email_breach': '/data-leak',
                'password_checker': '/password-check',
                'comprehensive_security': '/location', // Default to location scan
                'ai_defense': '/scamai',
                'network_scan': '/location'
            };
            
            const targetUrl = toolMapping[options.toolType];
            console.log('🎯 Target URL:', targetUrl);
            
            if (targetUrl) {
                console.log('🚀 Auto-navigating to:', targetUrl);
                
                // Add the user message to chat history but skip AI response
                const userMessageObj = {
                    id: generateMessageId(),
                    role: 'user',
                    content: question
                };
                setMessages(prev => [...prev, userMessageObj]);
                
                // Auto-navigate to the tool without AI response
                navigate(targetUrl);
                return;
            }
        } else {
            console.log('❌ No toolType found, using regular flow');
        }
        
        // Enhanced tool matching for premade questions
        const enhancedQuestion = enhanceQuestionWithContext(question);
        await processMessage(enhancedQuestion);
    }, [processMessage, navigate, generateMessageId, setMessages]);

    // Enhance premade questions with better context for tool matching
    const enhanceQuestionWithContext = (question) => {
        const questionLower = question.toLowerCase();
        
        // Map specific premade questions to enhanced versions with keywords
        if (questionLower.includes('door') && questionLower.includes('charged')) {
            return question + ' door to door scam contractor fraud overcharged';
        }
        if (questionLower.includes('call') && questionLower.includes('number')) {
            return question + ' phone suspicious call scam area code';
        }
        if (questionLower.includes('email') && questionLower.includes('leaked')) {
            return question + ' email breach data leak compromised';
        }
        if (questionLower.includes('old accounts') && questionLower.includes('delete')) {
            return question + ' delete account remove profile close account';
        }
        if (questionLower.includes('virus scanner') && questionLower.includes('link')) {
            return question + ' file scan virus malware suspicious file';
        }
        if (questionLower.includes('password') && questionLower.includes('compromised')) {
            return question + ' password strength secure check password';
        }
        if (questionLower.includes('data broker') && questionLower.includes('remove')) {
            return question + ' data broker personal information remove data';
        }
        if (questionLower.includes('email') && questionLower.includes('breaches')) {
            return question + ' email breach compromised scan email';
        }
        
        return question;
    };

    // Handle starting new chat
    const handleNewChat = useCallback(() => {
        setIsTyping(false);
        setMessages([]);
        
        // Preserve important context but reset conversation flow
        const currentContext = conversationContext.getContext();
        conversationContext.reset();
        
        // Preserve user profile and known security issues for continuity
        if (currentContext.userProfile.techLevel !== 'unknown') {
            conversationContext.updateUserProfile({
                techLevel: currentContext.userProfile.techLevel,
                preferredTools: currentContext.userProfile.preferredTools
            });
        }
        
        // Keep compromised emails in context for ongoing security awareness
        currentContext.securityState.knownCompromisedEmails.forEach(email => {
            conversationContext.addCompromisedEmail(email.email, email.breachCount);
        });
        
        setTimeout(() => {
            setShowWelcome(true);
            setThinkingStage('');
            setIsAskingName(false);
            setUserInput('');
            localStorage.removeItem('chatMessages');
        }, 0);
    }, []);

    // Handle option click with URL support
    const handleOptionClick = useCallback(async (optionText, url, capability) => {
        if (url) {
            // Track tool usage for learning
            const toolName = url.split('/').pop(); // Extract tool name from URL
            intelligentToolRecommendation.trackToolUsage(toolName, true);
            
            // Update conversation context
            conversationContext.getContext().session.toolsUsed.push({
                tool: toolName,
                timestamp: Date.now(),
                successful: true
            });
            
            // Navigate in same tab for internal tools
            navigate(url);
        } else if (capability) {
            // The context for the prompt is the last user message
            const lastUserMessage = messages.slice().reverse().find(m => m.role === 'user');
            const context = lastUserMessage ? lastUserMessage.content : optionText;
            await processMessage(context, capability);
        } else {
            await processMessage(optionText);
        }
    }, [messages, processMessage, navigate]);

    const generateFollowUpQuestions = async (lastMessage, aiResponse) => {
        if (!GEMINI_API_KEY) return [];
        
        try {
            const prompt = `Based on this cybersecurity conversation, generate 3 logical follow-up questions that a user might want to ask next.

User's last message: "${lastMessage}"
AI's response: "${aiResponse.substring(0, 500)}..."

Requirements:
1. Questions should be specific to cybersecurity/privacy/fraud prevention
2. They should build logically on the current conversation
3. Each question should be 3-10 words maximum
4. Make them actionable and specific
5. Return as a JSON array of strings

Example format: ["How do I set up 2FA?", "What are data breach signs?", "Best password managers?"]

Generate follow-up questions:`;

            const response = await fetch(getApiUrl('/api/chat'), {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.8,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 512
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                })
            });

            if (!response.ok) return [];

            const data = await response.json();
            const responseText = data.candidates[0].content.parts[0].text.trim();
            
            // Extract JSON array from response
            const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
            if (!jsonMatch) return [];

            const questions = JSON.parse(jsonMatch[0]);
            return Array.isArray(questions) ? questions.slice(0, 3) : [];
        } catch (error) {
            console.error('Error generating follow-up questions:', error);
            return [];
        }
    };

    // Email detection and validation
    const detectEmailInMessage = (message) => {
        const trimmedMessage = message.trim();
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
        
        // Only trigger email scan if the entire message is just an email
        if (emailRegex.test(trimmedMessage)) {
            return trimmedMessage;
        }
        
        return null;
    };

    // Password detection in messages (basic patterns)
    const detectPasswordRequest = (message) => {
        const passwordPatterns = [
            /check.*password/i,
            /password.*safe/i,
            /password.*secure/i,
            /is.*password.*good/i,
            /password.*compromised/i,
            /password.*pwned/i,
            /password.*breach/i
        ];
        
        return passwordPatterns.some(pattern => pattern.test(message));
    };

    // Handle CleanData Email Wiper scan
    const handleEmailWiperScan = async (email) => {
        const result = await CyberForgetEmailWiper.checkEmailBreaches(email);
        const report = CyberForgetEmailWiper.formatBreachReport(email, result);
        
        // Generate appropriate follow-up options based on results
        const options = [];
        
        if (result.success && result.status === 'compromised') {
            // If email is compromised, strongly suggest data broker scan
            options.push({
                text: "Run Data Broker Scanner - See what else is exposed",
                icon: "🔍", 
                url: SECURITY_TOOLS.data_broker_scan.url,
                capability: null
            });
            options.push({
                text: "Create Security Recovery Plan",
                icon: "🛡️",
                capability: "security_plan"
            });
        } else if (result.success && result.status === 'clean') {
            // If email is clean, suggest proactive scanning
            options.push({
                text: "Run Data Broker Scanner - Check personal info exposure",
                icon: "🔍",
                url: SECURITY_TOOLS.data_broker_scan.url, 
                capability: null
            });
            options.push({
                text: "Set up monitoring alerts",
                icon: "📊",
                capability: "security_assessment"
            });
        }
        
        return { report, options };
    };

    // Handle password safety check
    // eslint-disable-next-line no-unused-vars
    const handlePasswordCheck = async (password) => {
        const result = await CyberForgetEmailWiper.checkPasswordSafety(password);
        const report = CyberForgetEmailWiper.formatPasswordReport(result);
        
        const options = [];
        if (result.success && result.status === 'pwned') {
            options.push({
                text: "Create Strong Password Strategy",
                icon: "🔐",
                capability: "password_strategy"
            });
            options.push({
                text: "Check Password Manager Options", 
                icon: "🛡️",
                url: SECURITY_TOOLS.password_check.url,
                capability: null
            });
        }
        
        return { report, options };
    };

    // Add a fallback response generator
    const getFallbackResponse = (userMessage) => {
        const defaultResponse = {
            mainResponse: "I apologize, but I'm having trouble connecting to my knowledge base right now. " +
                         "While I work on fixing this, here are some general security tips:\n\n" +
                         "1. Always use strong, unique passwords\n" +
                         "2. Enable two-factor authentication when possible\n" +
                         "3. Be cautious of unexpected emails or messages\n" +
                         "4. Keep your software and systems updated\n\n" +
                         "Please try your question again in a few moments.",
            followUpOptions: [],
            isStrategy: false
        };

        // Add some context-aware options
        if (userMessage.toLowerCase().includes('password')) {
            defaultResponse.followUpOptions.push({
                text: "Check Password Strength",
                icon: "🔐",
                url: SECURITY_TOOLS.password_check.url
            });
        }
        
        if (userMessage.toLowerCase().includes('email') || userMessage.toLowerCase().includes('breach')) {
            defaultResponse.followUpOptions.push({
                text: "Scan Email for Breaches",
                icon: "📧",
                capability: "email_scan"
            });
        }

        // Filter out current page tools
        const currentPath = window.location.pathname;
        defaultResponse.followUpOptions = defaultResponse.followUpOptions.filter(option => 
            option.url !== currentPath
        );

        // Apply URL conversion before returning
        defaultResponse.followUpOptions = convertBackendUrlsToFrontend(defaultResponse.followUpOptions);
        return defaultResponse;
    };

    const generateAIResponse = async (userMessage) => {
        // Check if the message is about data broker removal
        const isDataBrokerQuery = userMessage.toLowerCase().includes('data broker') || 
                                 userMessage.includes('remove info') ||
                                 userMessage.includes('remove my information') ||
                                 userMessage.includes('found my info');

        if (isDataBrokerQuery) {
            const options = [
                {
                    text: "Run Data Broker Scanner Now",
                    icon: "🔍",
                    url: SECURITY_TOOLS.data_broker_scan.url
                },
                {
                    text: "Create Privacy Protection Plan",
                    icon: "🛡️",
                    capability: "privacy_plan"
                }
            ];
            
            // Filter out current page tools
            const currentPath = window.location.pathname;
            const filteredOptions = options.filter(option => option.url !== currentPath);
            
            return {
                mainResponse: `I understand your concern about your information being on data broker sites. The good news is that we can help you remove it quickly and effectively using our comprehensive data removal service.

Here's what you need to know:

1. Our service scans 150+ major data brokers
2. We have a 95% success rate in data removal
3. We provide continuous monitoring and protection
4. We handle the entire removal process for you

The first step is to run our Data Broker Scanner to see exactly where your information is being exposed. This will give us a complete picture of your digital exposure and allow us to start the removal process.

🔍 TLDR: Use our Data Broker Scanner to find and remove your exposed information from 150+ data broker sites.`,
                followUpOptions: convertBackendUrlsToFrontend(filteredOptions),
                isStrategy: false
            };
        }

        // ... rest of the existing code ...
    };

    const generatePasswordCheckIntro = () => {
        return `<div class="password-check-section">
            <div class="password-check-header">
                I can help you check if a password has been compromised in data breaches.
            </div>

            <div class="password-check-note">
                Please note: For your security, only enter passwords you're considering using, not your current passwords.
            </div>

            <div class="check-list-section">
                <div class="check-list-title">How CleanData Password Check works:</div>
                <div class="check-list">
                    <div class="check-list-item">Uses advanced k-anonymity protection</div>
                    <div class="check-list-item">Your password is never sent in full to any server</div>
                    <div class="check-list-item">Only the first 5 characters of the password hash are checked</div>
                    <div class="check-list-item">Same security method used by major password managers</div>
                </div>
            </div>

            <div class="check-list-section">
                <div class="check-list-title">What we check against:</div>
                <div class="check-list">
                    <div class="check-list-item">Database of 12+ billion compromised passwords</div>
                    <div class="check-list-item">Known data breaches and password dumps</div>
                    <div class="check-list-item">Real-time security threat intelligence</div>
                </div>
            </div>

            <div>Would you like to check a password for safety?</div>
        </div>`;
    };

    // Convert backend URLs to frontend routes for tool options
    const convertBackendUrlsToFrontend = (options) => {
        if (!options || !Array.isArray(options)) return options;
        
        // Exact route mappings from Navbar.js
        const urlMappings = {
            '/scamai': '/scamai',
            '/location': '/location',
            '/data-leak': '/data-leak', 
            '/email-scan': '/data-leak', // Email checker goes to data-leak page
            '/password-check': '/password-check',
            '/area-codes': '/area-codes',
            '/delete-account': '/delete-account',
            '/file-scan': '/file-scan'
        };
        
        // Tool name to route mappings based on Navbar.js
        const toolNameMappings = {
            'cleandata ai': '/scamai',
            'scam ai': '/scamai',
            'free broker scan': '/location',
            'data broker scan': '/location',
            'location scan': '/location',
            'identity scan': '/location',
            'broker scan': '/location',
            'check your email': '/data-leak',
            'email wiper': '/data-leak',
            'email scan': '/data-leak',
            'data leak scanner': '/data-leak',
            'data leak': '/data-leak',
            'leak scanner': '/data-leak',
            'cleandata email wiper': '/data-leak',
            'password checker': '/password-check',
            'password check': '/password-check',
            'password strength': '/password-check',
            'password analyzer': '/password-check',
            'phone number checker': '/area-codes',
            'area code': '/area-codes',
            'call checker': '/area-codes',
            'suspicious call': '/area-codes',
            'account deleter': '/delete-account',
            'account deletion guide': '/delete-account',
            'delete account': '/delete-account',
            'deletion guide': '/delete-account',
            'virus scanner': '/file-scan',
            'file scanner': '/file-scan',
            'security file': '/file-scan'
        };
        
        return options.map(option => {
            if (option && option.url) {
                // Check if URL is from backend server (any backend domain)
                if (option.url.includes('cleandata-test-app-961214fcb16c.herokuapp.com') || 
                    option.url.includes('cleandata.herokuapp.com') ||
                    option.url.includes('api.cleandata') ||
                    (option.url.startsWith('http') && !option.url.includes('localhost'))) {
                    
                    try {
                        const url = new URL(option.url);
                        const path = url.pathname;
                        
                        // Map to frontend route if available
                        const frontendRoute = urlMappings[path] || path;
                        
                        return {
                            ...option,
                            url: frontendRoute
                        };
                    } catch (e) {
                        console.warn('Error parsing URL:', option.url);
                        // If URL parsing fails, try to extract tool from text
                        const optionTextLower = option.text?.toLowerCase() || '';
                        const matchedRoute = Object.entries(toolNameMappings).find(([toolName]) => 
                            optionTextLower.includes(toolName)
                        );
                        
                        if (matchedRoute) {
                            return {
                                ...option,
                                url: matchedRoute[1]
                            };
                        }
                    }
                }
            } else if (option && option.text) {
                // If no URL, try to map based on text content
                const optionTextLower = option.text.toLowerCase();
                const matchedRoute = Object.entries(toolNameMappings).find(([toolName]) => 
                    optionTextLower.includes(toolName)
                );
                
                if (matchedRoute) {
                    return {
                        ...option,
                        url: matchedRoute[1]
                    };
                }
            }
            return option;
        });
    };

    // Parse AI response text for embedded tool suggestions
    const parseEmbeddedToolSuggestions = (aiResponseText) => {
        const suggestions = [];
        
        // Common patterns for tool suggestions in AI responses
        const patterns = [
            /🗑️[\s\S]*?Try our (Account Deletion Guide|Delete Account|Deletion Guide|Account Deleter)[\s\S]*?Try Tool →/gi,
            /📧[\s\S]*?Try our (CleanData Email Wiper|Email Wiper|Email Scan|Check Your Email)[\s\S]*?Try Tool →/gi,
            /🛡️[\s\S]*?Try our (Data Leak Scanner|Data Leak|Leak Scanner)[\s\S]*?Try Tool →/gi,
            /🔍[\s\S]*?Try our (Location.*?Scan|Identity.*?Scan|Data Broker|Free Broker Scan|Broker Scan)[\s\S]*?Try Tool →/gi,
            /🔐[\s\S]*?Try our (Password.*?Check|Password.*?Analyzer|Password Checker)[\s\S]*?Try Tool →/gi,
            /📞[\s\S]*?Try our (Area.*?Code|Call.*?Checker|Suspicious Call|Phone Number Checker)[\s\S]*?Try Tool →/gi,
            /🛡️[\s\S]*?Try our (File.*?Scanner|Security.*?File|Virus Scanner)[\s\S]*?Try Tool →/gi,
            /🤖[\s\S]*?Try our (RavenAI|Raven AI|Scam AI)[\s\S]*?Try Tool →/gi
        ];
        
        const toolMappings = {
            'account deletion guide': { url: '/delete-account', icon: '🗑️' },
            'delete account': { url: '/delete-account', icon: '🗑️' },
            'deletion guide': { url: '/delete-account', icon: '🗑️' },
            'account deleter': { url: '/delete-account', icon: '🗑️' },
            'cleandata email wiper': { url: '/data-leak', icon: '📧' },
            'email wiper': { url: '/data-leak', icon: '📧' },
            'email scan': { url: '/data-leak', icon: '📧' },
            'check your email': { url: '/data-leak', icon: '📧' },
            'data leak scanner': { url: '/data-leak', icon: '🛡️' },
            'data leak': { url: '/data-leak', icon: '🛡️' },
            'leak scanner': { url: '/data-leak', icon: '🛡️' },
            'location scan': { url: '/location', icon: '🔍' },
            'identity scan': { url: '/location', icon: '🔍' },
            'data broker': { url: '/location', icon: '🔍' },
            'free broker scan': { url: '/location', icon: '🔍' },
            'broker scan': { url: '/location', icon: '🔍' },
            'password check': { url: '/password-check', icon: '🔐' },
            'password analyzer': { url: '/password-check', icon: '🔐' },
            'password checker': { url: '/password-check', icon: '🔐' },
            'area code': { url: '/area-codes', icon: '📞' },
            'call checker': { url: '/area-codes', icon: '📞' },
            'suspicious call': { url: '/area-codes', icon: '📞' },
            'phone number checker': { url: '/area-codes', icon: '📞' },
            'file scanner': { url: '/file-scan', icon: '🛡️' },
            'security file': { url: '/file-scan', icon: '🛡️' },
            'virus scanner': { url: '/file-scan', icon: '🛡️' },
            'cleandata ai': { url: '/scamai', icon: '🤖' },
            'scam ai': { url: '/scamai', icon: '🤖' }
        };
        
        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(aiResponseText)) !== null) {
                const toolName = match[1];
                const toolKey = toolName.toLowerCase();
                
                // Find the best matching tool
                const matchedTool = Object.entries(toolMappings).find(([key]) => 
                    toolKey.includes(key) || key.includes(toolKey.replace(/\s+/g, ' '))
                );
                
                if (matchedTool) {
                    const [, toolConfig] = matchedTool;
                    suggestions.push({
                        text: `Try our ${toolName}`,
                        icon: toolConfig.icon,
                        url: toolConfig.url,
                        capability: null
                    });
                }
            }
        });
        
        return suggestions;
    };

    return {
        messages,
        userInput,
        showWelcome,
        thinkingStage,
        isAskingName,
        isTyping,
        setUserInput,
        handleSendMessage,
        handlePreMadeQuestionClick,
        handleNewChat,
        handleOptionClick,
        handleEmailWiperScan
    };
}; 