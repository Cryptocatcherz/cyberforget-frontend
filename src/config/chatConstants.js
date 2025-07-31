import { FaBrain, FaSearch, FaEnvelope, FaShieldAlt, FaEye, FaLock, FaRobot, FaNetworkWired, FaFileAlt, FaTrash, FaPhoneAlt } from 'react-icons/fa';

export const scamKeywords = [
  'scam', 'fraud', 'phishing', 'malware', 'virus',
  'hack', 'breach', 'leak', 'stolen', 'compromise',
  'suspicious', 'fake', 'unauthorized', 'identity theft'
];

export const iconComponents = {
  FaBrain,
  FaSearch,
  FaEnvelope,
  FaShieldAlt,
  FaEye,
  FaLock,
  FaRobot,
  FaNetworkWired,
  FaFileAlt,
  FaTrash,
  FaPhoneAlt
};

export const preMadeQuestions = [
  {
    iconName: "FaBrain",
    text: "Analyze my digital footprint and security posture",
    toolType: "data_broker_scan",
    description: "AI-powered scanner checking 50+ data broker sites for personal information exposure",
    requiresUserInput: true,
    inputType: "name_location"
  },
  {
    iconName: "FaEnvelope",
    text: "Scan my email for data breaches and compromises",
    toolType: "email_breach",
    description: "Check against 15+ billion breach records from Equifax, Yahoo, LinkedIn, and 500+ breaches",
    requiresUserInput: true,
    inputType: "email",
    isEmailScan: true
  },
  {
    iconName: "FaShieldAlt",
    text: "Perform comprehensive security assessment",
    toolType: "comprehensive_security",
    description: "Interactive multi-step security evaluation with gamified scoring system",
    requiresUserInput: false,
    inputType: "multi"
  },
  {
    iconName: "FaRobot",
    text: "Deploy AI-powered cyber defense strategies",
    toolType: "ai_defense",
    description: "20-step network security analysis testing router vulnerabilities and IoT exposure",
    requiresUserInput: false,
    inputType: "conversation"
  },
  {
    iconName: "FaLock",
    text: "Evaluate my password security and vulnerabilities",
    toolType: "password_checker",
    description: "Real-time strength scoring against 10,000+ common passwords with breach detection",
    requiresUserInput: true,
    inputType: "password"
  },
  {
    iconName: "FaSearch",
    text: "Run advanced security penetration tests",
    toolType: "security_test_suite",
    description: "Comprehensive vulnerability testing: network, authentication, database, and XSS testing",
    requiresUserInput: false,
    inputType: "testing"
  },
  {
    iconName: "FaNetworkWired",
    text: "Analyze network vulnerabilities and exposure",
    toolType: "network_scan",
    description: "Network topology discovery with port scanning and encryption protocol evaluation",
    requiresUserInput: false,
    inputType: "network"
  },
  {
    iconName: "FaFileAlt",
    text: "Scan files for malware and security threats",
    toolType: "file_scan",
    description: "Enterprise-grade multi-phase scanning: signature, behavioral, and heuristic analysis",
    requiresUserInput: true,
    inputType: "file"
  },
  {
    iconName: "FaTrash",
    text: "Help me delete online accounts and reduce my digital footprint",
    toolType: "account_deleter",
    description: "Deletion instructions for Facebook, Instagram, Twitter/X, LinkedIn, TikTok, and 100+ platforms",
    requiresUserInput: false,
    inputType: "platforms"
  },
  {
    iconName: "FaPhoneAlt",
    text: "Check phone numbers for scams and fraud",
    toolType: "area_code_checker",
    description: "Phone number scam detection with area code verification and probability scoring",
    requiresUserInput: true,
    inputType: "phone"
  }
]; 