// API Configuration
export const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
export const GEMINI_MODEL = 'gemini-2.0-flash';

export const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://cleandata-test-app-961214fcb16c.herokuapp.com' 
    : 'http://localhost:5002';

// Security Tools Configuration - Updated to remove duplicates
export const SECURITY_TOOLS = {
    data_leak: {
        name: "Email Breach Scanner", 
        description: "Check if your email was exposed in data breaches",
        icon: "📧",
        url: "/data-leak",
        keywords: ["data leak", "breach", "email", "compromised", "exposed", "hack", "stolen data", "security breach", "check your email"]
    },
    location_scan: {
        name: "Data Broker Scan",
        description: "Scan data brokers for your personal info",
        icon: "🔍",
        url: "/location",
        keywords: ["location", "identity", "personal info", "address", "name", "phone", "data broker", "exposed", "publicly available", "free broker scan"]
    },
    password_check: {
        name: "Password Checker",
        description: "Test password strength & get secure suggestions", 
        icon: "🔐",
        url: "/password-check",
        keywords: ["password", "strength", "secure", "weak", "strong password", "password security", "check password", "password checker"]
    },
    area_codes: {
        name: "Phone Number Checker",
        description: "Identify suspicious phone numbers and their origin",
        icon: "📞", 
        url: "/area-codes",
        keywords: ["phone", "call", "number", "suspicious", "scam call", "spam", "area code", "caller id", "phone number checker"]
    },
    delete_account: {
        name: "Account Deleter",
        description: "Step-by-step guide to remove old accounts",
        icon: "🗑️",
        url: "/delete-account", 
        keywords: ["delete", "remove", "account", "close account", "delete profile", "remove data", "account removal", "account deleter"]
    },
    file_scan: {
        name: "Virus Scanner",
        description: "Analyze suspicious files for threats",
        icon: "🛡️",
        url: "/file-scan",
        keywords: ["file", "scan", "virus", "malware", "suspicious file", "security scan", "file analysis", "virus scanner"]
    }
};

// Chat Configuration
export const scamKeywords = [
    'urgent',
    'immediate action',
    'account suspended',
    'verify your account',
    'suspicious activity',
    'password expired',
    'security breach',
    'unauthorized access',
    'limited time',
    'act now',
    'click here',
    'confirm your identity',
    'update your information',
    'payment declined',
    'win',
    'prize',
    'lottery',
    'inheritance',
    'money transfer',
    'bank details',
    'cryptocurrency',
    'investment opportunity',
    'guaranteed returns',
    'work from home',
    'make money fast',
    'business opportunity',
    'free gift',
    'exclusive offer',
    'congratulations',
    'selected winner',
    'claim your reward',
    'verify now',
    'account locked',
    'security alert',
    'unusual activity',
    'password reset',
    'login attempt',
    'account access',
    'secure your account',
    'update required',
    'important notice',
    'final warning',
    'payment pending',
    'refund available',
    'tax refund',
    'government grant',
    'unclaimed funds',
    'bitcoin',
    'crypto',
    'investment',
    'trading platform',
    'forex',
    'binary options',
    'high yield',
    'passive income',
    'earn from home',
    'side hustle',
    'quick cash',
    'easy money',
    'get rich',
    'financial freedom'
];

export const preMadeQuestions = [
    {
        text: "Someone knocked on my door and charged me too much for work. What should I do?",
        icon: "🚪"
    },
    {
        text: "I received a call from this number. How do I check if it's a scam?",
        icon: "📞"
    },
    {
        text: "I suspect my email was leaked. What should I do?",
        icon: "📧"
    },
    {
        text: "I'm worried about old accounts I'm not using anymore. Should I delete them?",
        icon: "🗑️"
    },
    {
        text: "Someone sent me a link to a virus scanner. Is it safe?",
        icon: "🔍"
    },
    {
        text: "I got a notification that my password might be compromised. How do I check?",
        icon: "🔒"
    },
    {
        text: "Someone claims they found my info on a data broker site. How do I remove it?",
        icon: "🛡️"
    }
]; 