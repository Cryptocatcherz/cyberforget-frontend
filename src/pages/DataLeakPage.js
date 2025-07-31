// src/pages/DataLeakPage.js

import { useState, useEffect, useRef } from "react";
import CyberForgetEmailWiper from '../services/breachService';
import "./DataLeakPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faShieldAlt, faExclamationTriangle, faCheckCircle, faTimesCircle,
    faEnvelope, faDatabase, faUsers, faCalendarAlt, faSearch, faFilter,
    faDownload, faEye, faEyeSlash, faLock, faUnlock, faUserShield,
    faClipboardList, faGraduationCap, faBell, faChartLine, faCog,
    faGamepad, faTrophy, faBookOpen, faQuestionCircle, faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://cleandata-test-app-961214fcb16c.herokuapp.com'
  : 'https://cleandata-test-app-961214fcb16c.herokuapp.com'; // Use working Heroku server in development too

const DataLeakPage = () => {
    // Email Leak Checker States
    const [email, setEmail] = useState("");
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailBreaches, setEmailBreaches] = useState([]);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [showEmailAnalysis, setShowEmailAnalysis] = useState(false);
    const [emailAnalysisStage, setEmailAnalysisStage] = useState(0);
    const [showMore, setShowMore] = useState(false);
    const [scanCompleted, setScanCompleted] = useState(false);

    // Enhanced Dashboard States
    const [threatLevel, setThreatLevel] = useState(null);
    const [riskScore, setRiskScore] = useState(null);
    const [securityScore, setSecurityScore] = useState(null);
    const [monitoredEmails, setMonitoredEmails] = useState([]);
    const [currentTip, setCurrentTip] = useState(0);
    const [animatedStats, setAnimatedStats] = useState({
        breaches: 0,
        pastes: 0,
        accounts: 0,
        recentBreaches: 0,
        darkWebMentions: 0
    });
    
    // New Interactive States
    const [threatMeterValue, setThreatMeterValue] = useState(null);
    const [animatedRiskScore, setAnimatedRiskScore] = useState(null);
    const [securityTipsExpanded, setSecurityTipsExpanded] = useState(false);
    const [timelineZoom, setTimelineZoom] = useState('1year');
    const [dashboardAnimation, setDashboardAnimation] = useState(false);

    // Filter and View States
    const [filterBy, setFilterBy] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [viewMode, setViewMode] = useState('cards');
    const [expandedBreaches, setExpandedBreaches] = useState(new Set());
    const [selectedBreaches, setSelectedBreaches] = useState(new Set());

    // Educational Content States
    const [activeTab, setActiveTab] = useState('dashboard');
    const [completedActions, setCompletedActions] = useState(new Set());
    const [badges, setBadges] = useState([]);
    const [securityTips, setSecurityTips] = useState([]);

    // Data Brokers Check States
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [brokerLoading, setBrokerLoading] = useState(false);
    const [brokerErrorMessage, setBrokerErrorMessage] = useState("");
    const [showBrokerAnalysis, setShowBrokerAnalysis] = useState(false);
    const [brokerAnalysisStage, setBrokerAnalysisStage] = useState(0);
    const [brokerInfoResult, setBrokerInfoResult] = useState(null);
    const [showDataBrokersSection, setShowDataBrokersSection] = useState(false);

    // Refs for animations and scrolling
    const statsRef = useRef(null);
    const riskMeterRef = useRef(null);
    const dataBrokerSectionRef = useRef(null);
    const resultsRef = useRef(null);

    const emailStages = [
        "🔍 Scanning 12+ billion stolen records...",
        "🌐 Checking dark web databases...",
        "⚡ Analyzing your digital footprint...",
        "🚨 Calculating your risk level...",
        "📊 Preparing your security report..."
    ];

    const brokerStages = [
        "🔍 Scanning 200+ data broker sites...",
        "📋 Checking public records databases...",
        "💰 Finding who's selling your data...",
        "🚨 Calculating exposure risk...",
        "📊 Generating removal plan..."
    ];

    const securityTipsData = [
        {
            icon: faLock,
            title: "Use Unique Passwords",
            description: "Never reuse passwords across multiple accounts. Each account should have a unique, strong password.",
            priority: "critical",
            action: "Generate unique passwords for all accounts",
            timeToComplete: "30 min"
        },
        {
            icon: faShieldAlt,
            title: "Enable Two-Factor Authentication",
            description: "Add an extra layer of security with 2FA on all important accounts, especially email and financial services.",
            priority: "high",
            action: "Enable 2FA on your most important accounts",
            timeToComplete: "15 min"
        },
        {
            icon: faEye,
            title: "Monitor Your Digital Footprint",
            description: "Regularly check what personal information is publicly available about you online.",
            priority: "medium",
            action: "Google yourself and check privacy settings",
            timeToComplete: "20 min"
        },
        {
            icon: faBell,
            title: "Set Up Breach Alerts",
            description: "Use monitoring services to get notified immediately when your data appears in new breaches.",
            priority: "high",
            action: "Subscribe to breach monitoring services",
            timeToComplete: "10 min"
        },
        {
            icon: faUserShield,
            title: "Review Privacy Settings",
            description: "Regularly audit privacy settings on social media and online accounts to minimize data exposure.",
            priority: "medium",
            action: "Review privacy settings on all platforms",
            timeToComplete: "25 min"
        },
        {
            icon: faDownload,
            title: "Backup Important Data",
            description: "Keep secure backups of important data to protect against ransomware and data loss.",
            priority: "high",
            action: "Set up automated secure backups",
            timeToComplete: "45 min"
        }
    ];

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Enhanced helper functions
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    const calculateSecurityScore = (breaches) => {
        console.log('calculateSecurityScore called with breaches:', breaches);
        
        if (!breaches || breaches.length === 0) {
            console.log('No breaches, returning 100');
            return 100; // Perfect score when no breaches
        }
        
        // More reasonable algorithm that doesn't immediately go to 0
        let securityDeduction = 0;
        
        // Base deduction scaling with diminishing returns 
        const breachCount = breaches.length;
        console.log('Breach count:', breachCount);
        
        if (breachCount <= 5) {
            securityDeduction += breachCount * 5; // 5 points per breach for first 5
            console.log(`First 5 breaches: ${breachCount} * 5 = ${breachCount * 5}`);
        } else if (breachCount <= 15) {
            securityDeduction += 25 + (breachCount - 5) * 3; // 3 points each for 6-15
            console.log(`6-15 breaches: 25 + ${breachCount - 5} * 3 = ${25 + (breachCount - 5) * 3}`);
        } else {
            securityDeduction += 55 + (breachCount - 15) * 1; // 1 point each for 16+
            console.log(`16+ breaches: 55 + ${breachCount - 15} * 1 = ${55 + (breachCount - 15) * 1}`);
        }
        
        console.log('Base deduction after breach count:', securityDeduction);
        
        // Additional factors for severity
        let severityBonus = 0;
        let hasRecentBreach = false;
        let hasSensitiveData = false;
        
        breaches.forEach((breach, index) => {
            console.log(`Processing breach ${index + 1}:`, breach.Name, breach.PwnCount);
            const pwnCount = breach.PwnCount || 0;
            
            // Size impact (much smaller penalties)
            if (pwnCount > 100000000) {
                severityBonus += 8; // Very massive
                console.log('Very massive breach (+8)');
            } else if (pwnCount > 10000000) {
                severityBonus += 5; // Large
                console.log('Large breach (+5)');
            } else if (pwnCount > 1000000) {
                severityBonus += 3; // Medium
                console.log('Medium breach (+3)');
            } else if (pwnCount > 100000) {
                severityBonus += 2; // Small-Medium
                console.log('Small-medium breach (+2)');
            }
            
            // Recent breach check
            const breachDate = new Date(breach.BreachDate);
            const daysSinceBreach = (Date.now() - breachDate.getTime()) / (1000 * 60 * 60 * 24);
            console.log(`Breach date: ${breach.BreachDate}, days since: ${daysSinceBreach}`);
            if (daysSinceBreach < 1095) { // Within 3 years
                hasRecentBreach = true;
                console.log('Recent breach detected');
            }
            
            // Sensitive data check
            const sensitiveTypes = ['passwords', 'password', 'financial', 'social security', 'credit card', 'bank', 'payment'];
            const hasSensitive = breach.DataClasses?.some(dataClass => 
                sensitiveTypes.some(sensitive => dataClass.toLowerCase().includes(sensitive))
            );
            console.log(`Data classes: ${JSON.stringify(breach.DataClasses)}, has sensitive: ${hasSensitive}`);
            if (hasSensitive) {
                hasSensitiveData = true;
            }
        });
        
        console.log('Severity bonus:', severityBonus);
        console.log('Has recent breach:', hasRecentBreach);
        console.log('Has sensitive data:', hasSensitiveData);
        
        // Apply severity bonuses
        securityDeduction += severityBonus;
        if (hasRecentBreach) securityDeduction += 10;
        if (hasSensitiveData) securityDeduction += 15;
        
        console.log('Total security deduction:', securityDeduction);
        
        // Calculate final score with a reasonable minimum
        const securityScore = Math.max(5, 100 - securityDeduction); // Minimum score of 5
        console.log('Final security score:', securityScore);
        return Math.round(securityScore);
    };

    const getThreatLevel = (riskScore) => {
        if (riskScore >= 80) return { level: 'critical', color: '#ff3b30', label: 'Critical Risk' };
        if (riskScore >= 60) return { level: 'high', color: '#ff9500', label: 'High Risk' };
        if (riskScore >= 40) return { level: 'medium', color: '#ffcc00', label: 'Medium Risk' };
        if (riskScore >= 20) return { level: 'low', color: '#34c759', label: 'Low Risk' };
        return { level: 'safe', color: '#00ff00', label: 'Secure' };
    };

    const getSecurityLevel = (securityScore) => {
        // Security score is 0-100 where 100 is perfect security
        if (securityScore >= 80) return { level: 'safe', color: '#00ff00', label: 'Excellent Security' };
        if (securityScore >= 60) return { level: 'low', color: '#34c759', label: 'Good Security' };
        if (securityScore >= 40) return { level: 'medium', color: '#ffcc00', label: 'Moderate Risk' };
        if (securityScore >= 20) return { level: 'high', color: '#ff9500', label: 'High Risk' };
        return { level: 'critical', color: '#ff3b30', label: 'Critical Risk' };
    };

    const categorizeDataTypes = (dataClasses) => {
        const categories = {
            personal: [],
            financial: [],
            security: [],
            social: [],
            other: []
        };
        
        dataClasses?.forEach(dataType => {
            const lower = dataType.toLowerCase();
            if (lower.includes('name') || lower.includes('email') || lower.includes('phone') || lower.includes('address')) {
                categories.personal.push(dataType);
            } else if (lower.includes('financial') || lower.includes('credit') || lower.includes('payment')) {
                categories.financial.push(dataType);
            } else if (lower.includes('password') || lower.includes('security') || lower.includes('token')) {
                categories.security.push(dataType);
            } else if (lower.includes('social') || lower.includes('profile') || lower.includes('bio')) {
                categories.social.push(dataType);
            } else {
                categories.other.push(dataType);
            }
        });
        
        return categories;
    };

    const getBreachRecencyWeight = (breachDate) => {
        const daysSince = (Date.now() - new Date(breachDate).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince < 30) return 'recent';
        if (daysSince < 365) return 'moderate';
        if (daysSince < 1095) return 'old';
        return 'ancient';
    };

    const formatNumber = (num) => {
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toString() || '0';
    };

    // Handler for Email Leak Checker
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setEmailErrorMessage("Please enter a valid email address.");
            return;
        }

        console.log("Email Submit Triggered");
        setEmailLoading(true);
        setEmailErrorMessage("");
        setShowEmailAnalysis(true);
        setEmailAnalysisStage(0);
        setEmailBreaches([]);
        setShowMore(false);
        setScanCompleted(false);

        try {
            // Simulate analysis stages
            for (let stage = 1; stage <= emailStages.length; stage++) {
                setEmailAnalysisStage(stage);
                await delay(500); // Simulate time taken for each stage
            }

            // Use the proper breach service
            const result = await CyberForgetEmailWiper.checkEmailBreaches(email);
            console.log('Email breach check result:', result);

            if (result.success) {
                if (result.breaches && result.breaches.length > 0) {
                    // Convert to the format expected by the UI
                    const formattedBreaches = result.breaches.map(breach => ({
                        Name: breach.name || breach.Name,
                        BreachDate: breach.date || breach.BreachDate,
                        PwnCount: breach.pwnCount || breach.PwnCount || 0,
                        DataClasses: breach.dataClasses || breach.DataClasses || []
                    }));
                    setEmailBreaches(formattedBreaches);
                    
                    // Calculate and set security score
                    console.log('=== SECURITY SCORE DEBUG ===');
                    console.log('Formatted breaches:', formattedBreaches);
                    console.log('Number of breaches:', formattedBreaches.length);
                    const calculatedScore = calculateSecurityScore(formattedBreaches);
                    console.log('Calculated security score:', calculatedScore);
                    setSecurityScore(calculatedScore);
                    console.log('Security score state should be set to:', calculatedScore);
                    setThreatMeterValue(100 - calculatedScore); // Risk score is inverse of security score
                } else {
                    setEmailBreaches([]);
                    setSecurityScore(100); // Perfect security score for clean email
                    setThreatMeterValue(0); // No risk for clean email
                }
                
                // Only show data brokers section after results are displayed
                setTimeout(() => {
                    setShowDataBrokersSection(true);
                    // Auto-scroll to data broker section after it becomes visible
                    setTimeout(() => {
                        if (dataBrokerSectionRef.current) {
                            dataBrokerSectionRef.current.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start',
                                inline: 'nearest'
                            });
                        }
                    }, 500); // Additional delay to ensure smooth rendering
                }, 1000); // Delay to show after breach results are visible
            } else {
                setEmailErrorMessage('Unable to check email. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching email breaches:', error);
            setEmailErrorMessage('Failed to fetch email breaches. Please try again later.');
        } finally {
            setEmailLoading(false);
            setShowEmailAnalysis(false);
            setScanCompleted(true);
            
            // Auto-scroll to results after scan completion
            setTimeout(() => {
                if (resultsRef.current) {
                    resultsRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'nearest'
                    });
                }
            }, 500); // Small delay to ensure DOM is updated
        }
    };

    // Handler for Data Brokers Check (Assuming similar proxy setup)
    const handleBrokerSubmit = async (e) => {
        e.preventDefault();
        if (!firstName || !lastName) {
            setBrokerErrorMessage("Please enter both first and last names.");
            return;
        }

        console.log("Broker Submit Triggered");
        setBrokerLoading(true);
        setBrokerErrorMessage("");
        setShowBrokerAnalysis(true);
        setBrokerAnalysisStage(0);
        setBrokerInfoResult(null);

        try {
            // Simulate analysis stages
            for (let stage = 1; stage <= brokerStages.length; stage++) {
                setBrokerAnalysisStage(stage);
                await delay(500); // Simulate time taken for each stage
            }

            // Construct the cleandata.me URL with the user's input
            const cleanDataUrl = `https://app.cleandata.me/location?first=${encodeURIComponent(firstName)}&last=${encodeURIComponent(lastName)}`;
            
            // Redirect to cleandata.me
            window.location.href = cleanDataUrl;

        } catch (error) {
            console.error('Error in broker check:', error);
            setBrokerErrorMessage('Failed to process your request. Please try again later.');
        } finally {
            setBrokerLoading(false);
        }
    };

    // Helper function to get breach threat level for individual breaches
    const getBreachThreatLevel = (pwnCount) => {
        if (pwnCount > 10000000) return 'critical';
        if (pwnCount > 1000000) return 'high';
        if (pwnCount > 100000) return 'medium';
        return 'low';
    };

    // Only animate stats after email scan is complete
    useEffect(() => {
        // Only run animation if we have scan results
        if (emailBreaches.length === 0 && !email) return;
        
        const targetStats = { 
            breaches: 821, 
            pastes: 115796, 
            accounts: 228000000,
            recentBreaches: 47,
            darkWebMentions: 2340
        };
        const duration = 2500;
        const steps = 80;
        let currentStep = 0;

        setDashboardAnimation(true);

        const interval = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setAnimatedStats({
                breaches: Math.floor(targetStats.breaches * easeOut),
                pastes: Math.floor(targetStats.pastes * easeOut),
                accounts: Math.floor(targetStats.accounts * easeOut),
                recentBreaches: Math.floor(targetStats.recentBreaches * easeOut),
                darkWebMentions: Math.floor(targetStats.darkWebMentions * easeOut)
            });

            if (currentStep >= steps) clearInterval(interval);
        }, duration / steps);

        return () => clearInterval(interval);
    }, [emailBreaches.length, email]);

    useEffect(() => {
        // Security tips carousel
        const tipInterval = setInterval(() => {
            setCurrentTip(prev => (prev + 1) % securityTipsData.length);
        }, 5000);

        return () => clearInterval(tipInterval);
    }, []);

    // Security score calculation with animation
    useEffect(() => {
        if (emailBreaches.length > 0) {
            const newSecurityScore = calculateSecurityScore(emailBreaches);
            const newRiskScore = 100 - newSecurityScore; // Risk is inverse of security
            
            let currentSecurityScore = 0;
            let currentRiskScore = 0;
            const animationDuration = 1500;

            const steps = 60;
            let step = 0;

            const scoreInterval = setInterval(() => {
                step++;
                const progress = step / steps;
                const easeOut = 1 - Math.pow(1 - progress, 2);
                
                currentSecurityScore = Math.floor(newSecurityScore * easeOut);
                currentRiskScore = Math.floor(newRiskScore * easeOut);
                
                setThreatLevel(currentRiskScore);
                setAnimatedRiskScore(currentRiskScore);
                setThreatMeterValue(currentSecurityScore);
                setRiskScore(currentRiskScore);

                if (step >= steps) clearInterval(scoreInterval);
            }, animationDuration / steps);
        } else {
            // Reset values when no breaches or no scan completed
            setThreatLevel(null);
            setAnimatedRiskScore(null);
            setThreatMeterValue(null);
            setRiskScore(null);
        }
    }, [emailBreaches]);

    // Filter and sort breaches
    const filteredBreaches = emailBreaches.filter(breach => {
        if (filterBy === 'all') return true;
        if (filterBy === 'recent') return getBreachRecencyWeight(breach.BreachDate) === 'recent';
        if (filterBy === 'high-risk') return getBreachThreatLevel(breach.PwnCount) === 'critical' || getBreachThreatLevel(breach.PwnCount) === 'high';
        return true;
    });

    const sortedBreaches = [...filteredBreaches].sort((a, b) => {
        if (sortBy === 'date') return new Date(b.BreachDate) - new Date(a.BreachDate);
        if (sortBy === 'severity') return b.PwnCount - a.PwnCount;
        if (sortBy === 'name') return a.Name.localeCompare(b.Name);
        return 0;
    });

    // Toggle expanded breach cards
    const toggleExpanded = (index) => {
        const newExpanded = new Set(expandedBreaches);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedBreaches(newExpanded);
    };

    // Enhanced Action Handlers
    const handleExportPDF = () => {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const generateComprehensiveReport = () => {
            const totalExposedAccounts = emailBreaches.reduce((sum, breach) => sum + (breach.PwnCount || 0), 0);
            const oldestBreach = emailBreaches.length > 0 ? 
                emailBreaches.reduce((oldest, breach) => 
                    new Date(breach.BreachDate) < new Date(oldest.BreachDate) ? breach : oldest
                ).BreachDate : null;
            
            const uniqueDataTypes = [...new Set(emailBreaches.flatMap(breach => breach.DataClasses || []))];
            
            return `
# 🛡️ CYBERFORGET SECURITY REPORT
**Comprehensive Data Breach Analysis**

---

## 📊 EXECUTIVE SUMMARY

**Email Analyzed:** ${email}
**Report Generated:** ${formattedDate}
**Scan Time:** ${currentDate.toLocaleTimeString()}

### 🎯 RISK ASSESSMENT
- **Overall Risk Score:** ${animatedRiskScore || securityScore || 0}/100
- **Threat Level:** ${getThreatLevel(animatedRiskScore || securityScore || 0).label}
- **Status:** ${emailBreaches.length > 0 ? '🚨 COMPROMISED' : '✅ SECURE'}

### 📈 BREACH STATISTICS
- **Total Breaches Found:** ${emailBreaches.length}
- **Total Accounts Exposed:** ${totalExposedAccounts.toLocaleString()}
- **Oldest Breach:** ${oldestBreach ? new Date(oldestBreach).getFullYear() : 'N/A'}
- **Data Types Compromised:** ${uniqueDataTypes.length} categories

---

## 🔍 DETAILED BREACH ANALYSIS

${emailBreaches.length > 0 ? emailBreaches.map((breach, index) => `
### ${index + 1}. ${breach.Name}
- **Date of Breach:** ${new Date(breach.BreachDate).toLocaleDateString()}
- **Accounts Affected:** ${(breach.PwnCount || 0).toLocaleString()}
- **Severity Level:** ${getBreachThreatLevel(breach.PwnCount)}
- **Data Compromised:** ${(breach.DataClasses || []).join(', ')}
- **Risk Impact:** ${breach.PwnCount > 10000000 ? 'CRITICAL - Mass exposure event' : 
                     breach.PwnCount > 1000000 ? 'HIGH - Major data breach' :
                     breach.PwnCount > 100000 ? 'MEDIUM - Significant exposure' : 'LOW - Limited exposure'}
`).join('\n') : '✅ **Good News!** No breaches were found for this email address in our database of 12+ billion compromised records.'}

---

## 🔒 DATA EXPOSURE ANALYSIS

### Categories of Information Potentially Compromised:
${uniqueDataTypes.length > 0 ? uniqueDataTypes.map(dataType => `- ${dataType}`).join('\n') : '- No data categories compromised'}

### Exposure Timeline:
${emailBreaches.length > 0 ? emailBreaches
    .sort((a, b) => new Date(a.BreachDate) - new Date(b.BreachDate))
    .map(breach => `- ${new Date(breach.BreachDate).getFullYear()}: ${breach.Name}`)
    .join('\n') : '- No exposure events found'}

---

## ⚠️ IMMEDIATE ACTION ITEMS

${emailBreaches.length > 0 ? `
### 🚨 CRITICAL ACTIONS (Do Today)
1. **Change Passwords Immediately**
   - Update password for this email account
   - Change passwords on all accounts using this email
   - Use unique, strong passwords (16+ characters)

2. **Enable Two-Factor Authentication**
   - Add 2FA to all critical accounts
   - Use authenticator apps (Google Auth, Authy)
   - Avoid SMS-based 2FA when possible

3. **Monitor Financial Accounts**
   - Check bank statements for unauthorized transactions
   - Review credit reports for suspicious activity
   - Consider placing fraud alerts with credit bureaus

### 🔒 ADDITIONAL SECURITY MEASURES
4. **Review Account Activity**
   - Check recent login activity on all accounts
   - Look for unfamiliar locations or devices
   - Log out all devices and re-authenticate

5. **Update Security Information**
   - Change security questions and answers
   - Update recovery email addresses
   - Verify phone numbers for account recovery
` : `
### ✅ PROACTIVE SECURITY MEASURES
1. **Maintain Strong Password Hygiene**
   - Continue using unique passwords for each account
   - Consider using a password manager
   - Enable two-factor authentication where available

2. **Regular Security Checkups**
   - Perform monthly breach checks
   - Review account activities regularly
   - Keep software and apps updated

3. **Monitor Your Digital Footprint**
   - Check what information is publicly available
   - Review privacy settings on social media
   - Be cautious about sharing personal information online
`}

---

## 📱 COMPREHENSIVE PROTECTION PLAN

### Phase 1: Immediate Response (Next 24 Hours)
- [ ] Change all passwords using this email
- [ ] Enable 2FA on critical accounts
- [ ] Check financial accounts for suspicious activity
- [ ] Review recent account activities

### Phase 2: Enhanced Security (Next Week)
- [ ] Implement password manager
- [ ] Audit all online accounts
- [ ] Update security questions and recovery info
- [ ] Set up account monitoring alerts

### Phase 3: Ongoing Protection (Monthly)
- [ ] Run regular breach checks
- [ ] Review credit reports
- [ ] Update software and security settings
- [ ] Monitor identity theft protection services

---

## 🎯 CYBERFORGET RECOMMENDATIONS

### Why This Matters
${emailBreaches.length > 0 ? `
Your email has been found in ${emailBreaches.length} data breach${emailBreaches.length > 1 ? 'es' : ''}, affecting over ${totalExposedAccounts.toLocaleString()} accounts. This puts you at significant risk for:

- **Identity Theft:** Criminals can use your exposed information to impersonate you
- **Financial Fraud:** Access to financial accounts and unauthorized transactions  
- **Account Takeovers:** Hackers can gain control of your online accounts
- **Phishing Attacks:** Targeted scams using your personal information
- **Privacy Violations:** Personal information sold on dark web markets
` : `
While your email appears clean in our breach database, staying protected requires ongoing vigilance. Cybersecurity threats evolve constantly, and new breaches occur daily.
`}

### Next Steps for Complete Protection
1. **Data Broker Removal:** Your personal information may still be sold by data brokers
2. **Continuous Monitoring:** Set up real-time alerts for new breaches
3. **Complete Privacy Audit:** Check all your personal information exposure
4. **Professional Protection:** Consider comprehensive identity protection services

---

## 📞 SUPPORT & RESOURCES

**CyberForget Security Team**
- Website: https://cyberforget.com
- Email Support: security@cyberforget.com
- Emergency Breach Response: Available 24/7

**Additional Resources:**
- FTC Identity Theft Guide: identitytheft.gov
- Credit Bureau Fraud Alerts: All three major bureaus
- FBI Internet Crime Complaint Center: ic3.gov

---

**Report Classification:** ${emailBreaches.length > 0 ? 'CONFIDENTIAL - Personal Security Information' : 'GENERAL - Security Assessment'}
**Generated By:** CyberForget Security Platform
**Report ID:** CF-${currentDate.getTime()}
**Version:** 2.1

*This report contains sensitive security information. Please store securely and do not share unnecessarily.*

---

🛡️ **Stay Protected with CyberForget** 🛡️
*Your Privacy. Our Priority.*
            `.trim();
        };

        const reportContent = generateComprehensiveReport();
        const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute("download", `CyberForget-Security-Report-${new Date().toISOString().split('T')[0]}.md`);
        downloadAnchorNode.style.display = 'none';
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        document.body.removeChild(downloadAnchorNode);
        URL.revokeObjectURL(url);
        
        // Show confirmation message
        const confirmationMessage = emailBreaches.length > 0 ? 
            `🚨 CRITICAL SECURITY REPORT DOWNLOADED\n\nYour comprehensive security report shows ${emailBreaches.length} data breach${emailBreaches.length > 1 ? 'es' : ''} affecting your email.\n\nPlease review the immediate action items in your report and take protective measures today.` :
            `✅ SECURITY REPORT DOWNLOADED\n\nGood news! Your email appears secure. Your report includes proactive security recommendations to keep you protected.`;
            
        alert(confirmationMessage);
    };

    const handleEnableMonitoring = () => {
        // Redirect to pricing page for monitoring subscription
        window.location.href = '/pricing';
    };

    const handleShareResults = () => {
        const summaryText = `Security Scan Results:\n• Risk Score: ${animatedRiskScore}/100\n• Breaches Found: ${emailBreaches.length}\n• Threat Level: ${getThreatLevel(animatedRiskScore).label}\n\nGenerated by CleanData Security Scanner`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Security Scan Results',
                text: summaryText,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(summaryText);
            alert('Summary copied to clipboard!');
        }
    };

    const handleScheduleReport = () => {
        alert('Scheduled scanning feature would be implemented here. This would set up regular email monitoring.');
    };

    const handleCopyResults = () => {
        const summaryText = `Security Assessment Summary\n\nEmail: ${email}\nScan Date: ${new Date().toLocaleDateString()}\nRisk Score: ${animatedRiskScore}/100\nThreat Level: ${getThreatLevel(animatedRiskScore).label}\nBreaches Found: ${emailBreaches.length}\n\nBreach Details:\n${emailBreaches.map(b => `• ${b.Name} (${new Date(b.BreachDate).getFullYear()}) - ${formatNumber(b.PwnCount)} accounts`).join('\n')}`;
        
        navigator.clipboard.writeText(summaryText);
        alert('Report summary copied to clipboard!');
    };

    const handleEmailReport = () => {
        const subject = encodeURIComponent(`Security Scan Report - ${getThreatLevel(animatedRiskScore).label} Risk Level`);
        const body = encodeURIComponent(`Security scan completed for email: ${email}\n\nRisk Score: ${animatedRiskScore}/100\nBreaches Found: ${emailBreaches.length}\n\nView full report: ${window.location.href}`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
    };

    return (
        <div className="enhanced-data-leak-page">
            {/* Navbar */}
            <Navbar />
            <MobileNavbar />

            {/* Mobile-First User-Centric Container */}
            <div className="user-focused-container">
                {/* Hero Section with Clear Value Prop */}
                <div className="hero-section">
                    <div className="hero-content">
                        <div className="urgency-badge">
                            <span className="urgent-icon">🚨</span>
                            <span>12+ BILLION Records Exposed</span>
                        </div>
                        <FontAwesomeIcon icon={faEnvelope} className="hero-icon" />
                        <h1>Is Your Email Being Sold on the Dark Web?</h1>
                        <p className="hero-subtitle"><strong>FREE instant check</strong> reveals if hackers have stolen your email and personal data</p>
                        <div className="social-proof">
                            <span className="check-count">✓ Over 2.3 million emails checked</span>
                            <span className="threat-count">⚠️ 847,000+ found in breaches</span>
                        </div>
                    </div>
                </div>

                {/* Primary Email Scanner - Most Prominent */}
                <div className="primary-email-scanner">
                    <form onSubmit={handleEmailSubmit} className="primary-email-form">
                        <div className="primary-input-group">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setScanCompleted(false);
                                }}
                                required
                                className="primary-email-input"
                                aria-label="Email Address"
                            />
                            <button
                                type="submit"
                                className="primary-scan-button"
                                disabled={emailLoading}
                                aria-label="Check for Data Breaches"
                                onMouseEnter={() => !emailLoading && setIsButtonHovered(true)}
                                onMouseLeave={() => setIsButtonHovered(false)}
                                style={{
                                    background: emailLoading 
                                        ? 'rgba(74, 144, 226, 0.7)' 
                                        : isButtonHovered 
                                            ? 'linear-gradient(135deg, #5BA3F5 0%, #4A90E2 100%)'
                                            : 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
                                    backgroundColor: emailLoading 
                                        ? 'rgba(74, 144, 226, 0.7)' 
                                        : isButtonHovered 
                                            ? '#5BA3F5' 
                                            : '#4A90E2',
                                    color: '#000000',
                                    border: 'none',
                                    borderRadius: '14px',
                                    padding: '18px 20px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    cursor: emailLoading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    width: '100%',
                                    minHeight: '58px',
                                    boxShadow: isButtonHovered && !emailLoading 
                                        ? '0 10px 30px rgba(74, 144, 226, 0.4)' 
                                        : '0 6px 20px rgba(74, 144, 226, 0.3)',
                                    transition: 'all 0.3s ease',
                                    transform: isButtonHovered && !emailLoading ? 'translateY(-2px)' : 'none',
                                    fontFamily: 'inherit',
                                    lineHeight: '1.2',
                                    textTransform: 'none',
                                    textDecoration: 'none',
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'none',
                                    appearance: 'none'
                                }}
                            >
                                {emailLoading ? (
                                    <>
                                        <div className="primary-spinner" />
                                        <span>Scanning Dark Web...</span>
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faSearch} />
                                        <span>Check if I've Been Hacked</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Privacy Note */}
                    <div className="privacy-and-stats">
                        <p className="privacy-note">
                            <FontAwesomeIcon icon={faLock} />
                            We never save your email. This check is completely private and secure.
                        </p>
                        <div className="live-stats">
                            <div className="stat-item">
                                <span className="stat-number">12.4B+</span>
                                <span className="stat-label">Records Scanned</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">847K+</span>
                                <span className="stat-label">Breaches Found</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">$1.8B</span>
                                <span className="stat-label">Fraud Prevented</span>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {emailErrorMessage && (
                        <div className="simple-error">
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                            <span>{emailErrorMessage}</span>
                        </div>
                    )}

                    {/* Simplified Loading */}
                    {showEmailAnalysis && (
                        <div className="simple-loading">
                            <div className="loading-animation">
                                <div className="loading-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <p>{emailStages[emailAnalysisStage - 1] || "Preparing scan..."}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Section - All content after scan completion */}
                {scanCompleted && (
                    <div ref={resultsRef}>
                                {emailBreaches.length > 0 && (
                            <div className="security-summary-card">
                        <div className="summary-header">
                            <h3>
                                <FontAwesomeIcon icon={faShieldAlt} />
                                Your Privacy Report
                            </h3>
                        </div>
                        <div className="summary-content">
                            <div className="score-section">
                                <div className="score-display">
                                    <span className="score-number">{securityScore !== null && securityScore !== undefined ? securityScore : 100}</span>
                                    <span className="score-label">Privacy Score</span>
                                </div>
                                <div className={`risk-status ${getSecurityLevel(securityScore || 100).level}`}>
                                    <FontAwesomeIcon icon={faShieldAlt} />
                                    <span>{getSecurityLevel(securityScore || 100).label}</span>
                                </div>
                            </div>
                            
                            <div className="breach-summary">
                                <div className="summary-stats">
                                    <div className="stat-item">
                                        <span className="stat-number">{emailBreaches.length}</span>
                                        <span className="stat-label">{emailBreaches.length === 1 ? 'Breach' : 'Breaches'} Found</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">{emailBreaches.reduce((total, breach) => total + (breach.PwnCount || 0), 0).toLocaleString()}</span>
                                        <span className="stat-label">Accounts Affected</span>
                                    </div>
                                </div>
                                
                                <div className="leaked-data-summary">
                                    <h4>Data Types Exposed:</h4>
                                    <div className="data-types-grid">
                                        {Array.from(new Set(emailBreaches.flatMap(breach => breach.DataClasses || []))).slice(0, 8).map((dataType, i) => (
                                            <span key={i} className="data-type-tag">{dataType}</span>
                                        ))}
                                        {Array.from(new Set(emailBreaches.flatMap(breach => breach.DataClasses || []))).length > 8 && (
                                            <span className="more-data-types">+{Array.from(new Set(emailBreaches.flatMap(breach => breach.DataClasses || []))).length - 8} more</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Action Recommendations */}
                {scanCompleted && emailBreaches.length > 0 && (
                    <div className="quick-actions-card">
                        <h3>🚨 What You Need to Do Right Now</h3>
                        <div className="priority-actions">
                            <div className="action-item urgent">
                                <FontAwesomeIcon icon={faLock} />
                                <div>
                                    <h4>Change Your Passwords Now</h4>
                                    <p>Create new passwords for accounts that were hacked</p>
                                </div>
                            </div>
                            <div className="action-item high">
                                <FontAwesomeIcon icon={faShieldAlt} />
                                <div>
                                    <h4>Turn On Two-Step Login</h4>
                                    <p>Add a second step when logging in to keep hackers out</p>
                                </div>
                            </div>
                            <div className="action-item medium">
                                <FontAwesomeIcon icon={faBell} />
                                <div>
                                    <h4>Watch Your Accounts</h4>
                                    <p>Check for any strange activity or logins you didn't make</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile-First Breach Results */}
                {emailBreaches.length > 0 && (
                    <div className="mobile-breach-results">

                        {/* Enhanced Data Broker & Dark Web Analysis */}
                        <div className="comprehensive-threat-section" ref={dataBrokerSectionRef}>
                            {/* Major Company Breaches Preview */}
                            <div className="major-breaches-preview">
                                <h3>⚠️ Your Information Was Stolen From These Companies</h3>
                                <p>Hackers got your data when they broke into these companies:</p>
                                <div className="major-companies-grid">
                                    {emailBreaches
                                        .filter(breach => {
                                            const majorCompanies = ['Facebook', 'LinkedIn', 'Adobe', 'Yahoo', 'Equifax', 'Twitter', 'Instagram', 'Spotify', 'Dropbox', 'Canva', 'Zomato', 'MyFitnessPal', 'Zynga'];
                                            return majorCompanies.some(company => breach.Name.toLowerCase().includes(company.toLowerCase()));
                                        })
                                        .slice(0, 6)
                                        .map((breach, index) => (
                                            <div key={index} className="major-company-card">
                                                <div className="company-info">
                                                    <h4>{breach.Name}</h4>
                                                    <span className="breach-year">{new Date(breach.BreachDate).getFullYear()}</span>
                                                </div>
                                                <div className="impact-indicator">
                                                    <span className="affected-count">{formatNumber(breach.PwnCount)}</span>
                                                    <span className="accounts-label">accounts</span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                {emailBreaches.filter(breach => {
                                    const majorCompanies = ['Facebook', 'LinkedIn', 'Adobe', 'Yahoo', 'Equifax', 'Twitter', 'Instagram', 'Spotify', 'Dropbox', 'Canva', 'Zomato', 'MyFitnessPal', 'Zynga'];
                                    return majorCompanies.some(company => breach.Name.toLowerCase().includes(company.toLowerCase()));
                                }).length > 6 && (
                                    <div className="more-companies">
                                        +{emailBreaches.filter(breach => {
                                            const majorCompanies = ['Facebook', 'LinkedIn', 'Adobe', 'Yahoo', 'Equifax', 'Twitter', 'Instagram', 'Spotify', 'Dropbox', 'Canva', 'Zomato', 'MyFitnessPal', 'Zynga'];
                                            return majorCompanies.some(company => breach.Name.toLowerCase().includes(company.toLowerCase()));
                                        }).length - 6} more major companies
                                    </div>
                                )}
                            </div>

                            {/* Dark Web & Data Broker Analysis */}
                            <div className="enhanced-broker-section">
                                <div className="threat-analysis-header">
                                    <div className="threat-icons">
                                        <span className="threat-icon darkweb">🕸️</span>
                                        <span className="threat-icon brokers">🔍</span>
                                    </div>
                                    <div className="threat-titles">
                                        <h3>Check if Your Info is Being Sold Online</h3>
                                        <p>See if criminals or data companies are selling your personal information</p>
                                    </div>
                                </div>

                                <div className="threat-summary-stats">
                                    <div className="stat-card breaches">
                                        <div className="stat-number">{emailBreaches.length}</div>
                                        <div className="stat-label">Data Breaches</div>
                                        <div className="stat-description">Times your email was stolen</div>
                                    </div>
                                    <div className="stat-card data-types">
                                        <div className="stat-number">{Array.from(new Set(emailBreaches.flatMap(breach => breach.DataClasses || []))).length}</div>
                                        <div className="stat-label">Data Types</div>
                                        <div className="stat-description">Types of info stolen</div>
                                    </div>
                                    <div className="stat-card accounts">
                                        <div className="stat-number">{formatNumber(emailBreaches.reduce((total, breach) => total + (breach.PwnCount || 0), 0))}</div>
                                        <div className="stat-label">Total Accounts</div>
                                        <div className="stat-description">Total accounts hacked</div>
                                    </div>
                                </div>

                                <div className="dark-web-indicators">
                                    <h4>🕸️ What Criminals Might Have</h4>
                                    <div className="risk-indicators-grid">
                                        <div className="risk-indicator high">
                                            <span className="indicator-icon">💳</span>
                                            <div className="indicator-text">
                                                <strong>Financial Data</strong>
                                                <p>{emailBreaches.some(breach => breach.DataClasses?.some(dc => dc.toLowerCase().includes('credit') || dc.toLowerCase().includes('payment'))) ? 'Your payment info was stolen' : 'Your payment info is safe'}</p>
                                            </div>
                                        </div>
                                        <div className="risk-indicator medium">
                                            <span className="indicator-icon">🔑</span>
                                            <div className="indicator-text">
                                                <strong>Passwords</strong>
                                                <p>{emailBreaches.some(breach => breach.DataClasses?.some(dc => dc.toLowerCase().includes('password'))) ? 'Your passwords were stolen' : 'Your passwords are safe'}</p>
                                            </div>
                                        </div>
                                        <div className="risk-indicator low">
                                            <span className="indicator-icon">📞</span>
                                            <div className="indicator-text">
                                                <strong>Personal Details</strong>
                                                <p>{emailBreaches.some(breach => breach.DataClasses?.some(dc => dc.toLowerCase().includes('phone') || dc.toLowerCase().includes('address'))) ? 'Your contact info was stolen' : 'Your contact info is safe'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="broker-explanation">
                                    <div className="explanation-card">
                                        <h4>🔍 Why Check if Your Info is Being Sold?</h4>
                                        <p>Your email was stolen in <strong>{emailBreaches.length} data breaches</strong>. Companies collect this stolen information and sell everything about you, including:</p>
                                        
                                        <div className="exposed-data-categories">
                                            {Array.from(new Set(emailBreaches.flatMap(breach => breach.DataClasses || []))).slice(0, 8).map((dataType, i) => (
                                                <span key={i} className="data-category-pill">{dataType}</span>
                                            ))}
                                            {Array.from(new Set(emailBreaches.flatMap(breach => breach.DataClasses || []))).length > 8 && (
                                                <span className="more-categories">+{Array.from(new Set(emailBreaches.flatMap(breach => breach.DataClasses || []))).length - 8} more</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleBrokerSubmit} className="enhanced-broker-form">
                                <div className="broker-form-header">
                                    <div className="value-prop-badge">
                                        <span>🎯 MOST IMPORTANT CHECK</span>
                                    </div>
                                    <h4>💰 Companies Are Making Money Selling YOUR Data</h4>
                                    <p><strong>Even if your email is clean, data brokers are LEGALLY selling your name, address, phone number, and more.</strong></p>
                                    <p className="urgency-text">This puts you at risk of identity theft, spam calls, and targeted scams. Find out WHO is selling your information right now:</p>
                                </div>
                                
                                <div className="name-inputs-enhanced">
                                    <div className="input-group">
                                        <label htmlFor="firstName">First Name</label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            placeholder="Enter first name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                            className="enhanced-name-input"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="lastName">Last Name</label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            placeholder="Enter last name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                            className="enhanced-name-input"
                                        />
                                    </div>
                                </div>
                                
                                <button
                                    type="submit"
                                    className="enhanced-broker-button"
                                    disabled={brokerLoading}
                                >
                                    {brokerLoading ? (
                                        <>
                                            <div className="broker-spinner" />
                                            <span>Checking if your info is for sale...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faSearch} />
                                            <span>💰 Show Me Who's Selling My Data</span>
                                        </>
                                    )}
                                </button>
                                
                                <div className="privacy-assurance">
                                    <FontAwesomeIcon icon={faLock} />
                                    <span>We don't save your name. This search is completely private</span>
                                </div>
                            </form>

                            {brokerErrorMessage && (
                                <div className="broker-error">
                                    <FontAwesomeIcon icon={faExclamationTriangle} />
                                    <span>{brokerErrorMessage}</span>
                                </div>
                            )}

                            {showBrokerAnalysis && (
                                <div className="broker-loading">
                                    <div className="loading-animation">
                                        <div className="loading-dots">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                        <p>{brokerStages[brokerAnalysisStage - 1] || "Initializing broker scan..."}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile-Optimized Breach Cards */}
                        <div className="mobile-breach-list">
                            {sortedBreaches.map((breach, index) => {
                                const categories = categorizeDataTypes(breach.DataClasses);
                                const recencyWeight = getBreachRecencyWeight(breach.BreachDate);
                                const threatLevel = getBreachThreatLevel(breach.PwnCount);
                                const isExpanded = expandedBreaches.has(index);
                                
                                return (
                                    <div key={index} className={`mobile-breach-card ${threatLevel}`}>
                                        <div className="breach-card-summary" onClick={() => toggleExpanded(index)}>
                                            <div className="breach-main-info">
                                                <div className="breach-name-row">
                                                    <h3>{breach.Name}</h3>
                                                    <span className={`risk-badge ${threatLevel}`}>
                                                        {threatLevel === 'critical' ? '🔴' : threatLevel === 'high' ? '🟠' : threatLevel === 'medium' ? '🟡' : '🟢'}
                                                    </span>
                                                </div>
                                                <div className="breach-details-row">
                                                    <span className="breach-date">
                                                        📅 {new Date(breach.BreachDate).getFullYear()}
                                                    </span>
                                                    <span className="affected-count">
                                                        👥 {formatNumber(breach.PwnCount)}
                                                    </span>
                                                </div>
                                                <div className="data-preview">
                                                    {breach.DataClasses?.slice(0, 2).map((dataType, i) => (
                                                        <span key={i} className="data-chip">{dataType}</span>
                                                    ))}
                                                    {breach.DataClasses?.length > 2 && (
                                                        <span className="more-data">+{breach.DataClasses.length - 2} more</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="expand-button">
                                                <FontAwesomeIcon icon={isExpanded ? faEyeSlash : faEye} />
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="mobile-breach-details">
                                                <div className="detail-section">
                                                    <h4>📊 Impact Level: {threatLevel.toUpperCase()}</h4>
                                                    <p>{formatNumber(breach.PwnCount)} accounts were compromised in this breach.</p>
                                                </div>
                                                
                                                <div className="detail-section">
                                                    <h4>🗂️ Data Compromised</h4>
                                                    <div className="data-types-list">
                                                        {breach.DataClasses?.map((dataType, i) => (
                                                            <span key={i} className="data-type-pill">{dataType}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                
                                                <div className="detail-section">
                                                    <h4>⚡ What You Should Do</h4>
                                                    <div className="action-buttons">
                                                        <button className="action-btn primary">
                                                            <FontAwesomeIcon icon={faLock} />
                                                            Change Password
                                                        </button>
                                                        <button className="action-btn secondary">
                                                            <FontAwesomeIcon icon={faShieldAlt} />
                                                            Enable 2FA
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Mobile-First Action Section */}
                        <div className="mobile-actions-section">
                            <h3>🛡️ Protect Yourself</h3>
                            <p>Take these important steps to secure your accounts</p>
                            
                            <div className="mobile-action-cards">
                                <div className="mobile-action-card" onClick={() => handleExportPDF()}>
                                    <div className="action-card-content">
                                        <span className="action-emoji">📄</span>
                                        <div className="action-text">
                                            <h4>Download Report</h4>
                                            <p>Save detailed security report</p>
                                        </div>
                                    </div>
                                    <FontAwesomeIcon icon={faDownload} className="action-arrow" />
                                </div>
                                
                                <div className="mobile-action-card" onClick={() => handleEnableMonitoring()}>
                                    <div className="action-card-content">
                                        <span className="action-emoji">🔔</span>
                                        <div className="action-text">
                                            <h4>Enable Monitoring</h4>
                                            <p>Get alerts for new breaches</p>
                                        </div>
                                    </div>
                                    <FontAwesomeIcon icon={faBell} className="action-arrow" />
                                </div>
                                
                                <div className="mobile-action-card" onClick={() => handleCopyResults()}>
                                    <div className="action-card-content">
                                        <span className="action-emoji">📋</span>
                                        <div className="action-text">
                                            <h4>Copy Results</h4>
                                            <p>Share with your security team</p>
                                        </div>
                                    </div>
                                    <FontAwesomeIcon icon={faDownload} className="action-arrow" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                        {/* Educational Hub - Only show after scan completes */}
                        <div className="simple-education-section">
                        <h3>💡 How to Protect Yourself</h3>
                        
                        {emailBreaches.length > 0 ? (
                            <div className="action-tips">
                                <div className="tip-item urgent">
                                    <FontAwesomeIcon icon={faLock} />
                                    <div>
                                        <h4>Change Your Passwords</h4>
                                        <p>Make new, strong passwords for the accounts that were hacked</p>
                                    </div>
                                </div>
                                <div className="tip-item">
                                    <FontAwesomeIcon icon={faShieldAlt} />
                                    <div>
                                        <h4>Turn On Two-Step Login</h4>
                                        <p>Add a second security step when you log in</p>
                                    </div>
                                </div>
                                <div className="tip-item">
                                    <FontAwesomeIcon icon={faBell} />
                                    <div>
                                        <h4>Check Your Accounts Regularly</h4>
                                        <p>Look for any strange activity or logins you didn't make</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="clean-scan-tips">
                                <div className="clean-message">
                                    <FontAwesomeIcon icon={faCheckCircle} className="clean-icon" />
                                    <h4>Good news! Your email hasn't been stolen.</h4>
                                    <p>We didn't find your email in any known data breaches.</p>
                                </div>
                                <div className="preventive-tips">
                                    <h4>Stay Protected:</h4>
                                    <ul>
                                        <li>Use unique passwords for each account</li>
                                        <li>Enable two-factor authentication</li>
                                        <li>Check regularly for new breaches</li>
                                        <li>Keep your software updated</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                        </div>
                    </div>
                )}

                {/* This section moved to appear right after risk factor above */}
            </div>
        </div>
    );
};

export default DataLeakPage;
