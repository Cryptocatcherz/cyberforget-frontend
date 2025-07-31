// Tool Registry - Central registry for all chat-integrated tools
import PasswordCheckerTool from './PasswordCheckerTool';
import EmailBreachTool from './EmailBreachTool';
import DataBrokerScanTool from './DataBrokerScanTool';
import FileScanTool from './FileScanTool';
import AccountDeleterTool from './AccountDeleterTool';
import AreaCodeCheckerTool from './AreaCodeCheckerTool';
import AIDefenseTool from './AIDefenseTool';
import ComprehensiveSecurityTool from './ComprehensiveSecurityTool';
import NetworkScanTool from './NetworkScanTool';

// Tool configuration
const TOOL_REGISTRY = {
  '/password-check': {
    component: PasswordCheckerTool,
    name: 'Password Checker',
    description: 'Check if your password has been compromised',
    icon: '🔐',
    triggers: ['password', 'pwd', 'credential', 'password check', 'check password', 'password strength'],
    command: '/password-check'
  },
  '/email-breach': {
    component: EmailBreachTool,
    name: 'Email Breach Scanner',
    description: 'Check if your email appears in data breaches',
    icon: '📧',
    triggers: ['email', 'breach', 'data leak', 'check email', 'email scan', 'compromised email'],
    command: '/email-breach'
  },
  '/data-broker-scan': {
    component: DataBrokerScanTool,
    name: 'Data Broker Scanner',
    description: 'Scan for your personal info on data broker sites',
    icon: '🔍',
    triggers: ['broker', 'scan', 'personal info', 'data broker', 'privacy scan', 'location scan'],
    command: '/data-broker-scan'
  },
  '/file-scan': {
    component: FileScanTool,
    name: 'File Scanner',
    description: 'Scan files for viruses and malware',
    icon: '🛡️',
    triggers: ['file', 'virus', 'malware', 'scan file', 'virus scan', 'file check'],
    command: '/file-scan'
  },
  '/delete-account': {
    component: AccountDeleterTool,
    name: 'Account Deleter',
    description: 'Get help deleting accounts from various platforms',
    icon: '🗑️',
    triggers: ['delete account', 'remove account', 'close account', 'account deletion'],
    command: '/delete-account'
  },
  '/area-code': {
    component: AreaCodeCheckerTool,
    name: 'Area Code Checker',
    description: 'Check phone numbers and area codes for scams',
    icon: '📞',
    triggers: ['phone', 'area code', 'phone number', 'call', 'scam call', 'check number'],
    command: '/area-code'
  },
  '/ai-defense': {
    component: AIDefenseTool,
    name: 'AI Cyber Defense Strategist',
    description: 'Generate AI-powered cybersecurity defense strategies',
    icon: '🤖',
    triggers: ['defense', 'strategy', 'ai defense', 'cyber defense', 'security plan', 'protection strategy'],
    command: '/ai-defense'
  },
  '/comprehensive-security': {
    component: ComprehensiveSecurityTool,
    name: 'Comprehensive Security Assessment',
    description: 'Complete multi-vector security analysis',
    icon: '🛡️',
    triggers: ['comprehensive', 'assessment', 'security assessment', 'full scan', 'complete scan', 'security audit'],
    command: '/comprehensive-security'
  },
  '/network-scan': {
    component: NetworkScanTool,
    name: 'Network Vulnerability Scanner',
    description: 'Advanced network infrastructure security analysis',
    icon: '🌐',
    triggers: ['network', 'vulnerability', 'network scan', 'port scan', 'network security', 'infrastructure'],
    command: '/network-scan'
  }
};

// Helper functions
export const getToolByCommand = (command) => {
  return TOOL_REGISTRY[command] || null;
};

export const findToolByMessage = (message) => {
  const messageLower = message.toLowerCase();
  
  // Check for explicit commands first
  for (const [command, tool] of Object.entries(TOOL_REGISTRY)) {
    if (messageLower.startsWith(command)) {
      return tool;
    }
  }
  
  // Then check for trigger words
  for (const [command, tool] of Object.entries(TOOL_REGISTRY)) {
    for (const trigger of tool.triggers) {
      if (messageLower.includes(trigger)) {
        return tool;
      }
    }
  }
  
  return null;
};

export const getAllTools = () => {
  return Object.entries(TOOL_REGISTRY).map(([command, tool]) => ({
    ...tool,
    command
  }));
};

export const getToolSuggestions = (context) => {
  // Return tools based on conversation context
  const suggestions = [];
  
  if (context.includes('security') || context.includes('safe')) {
    suggestions.push(TOOL_REGISTRY['/password-check']);
    suggestions.push(TOOL_REGISTRY['/email-breach']);
  }
  
  if (context.includes('privacy') || context.includes('data')) {
    suggestions.push(TOOL_REGISTRY['/data-broker-scan']);
    suggestions.push(TOOL_REGISTRY['/delete-account']);
  }
  
  return suggestions.slice(0, 3); // Return top 3 suggestions
};

export default TOOL_REGISTRY;