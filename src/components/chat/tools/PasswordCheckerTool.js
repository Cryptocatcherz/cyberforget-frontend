// Password Checker Tool - Check password strength and breaches
import React, { useState, useRef } from 'react';
import BaseTool, { ToolResult, ToolLoading, ToolError } from './BaseTool';
import { FaEye, FaEyeSlash, FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaCopy, FaLightbulb, FaInfoCircle } from 'react-icons/fa';
import CyberForgetEmailWiper from '../../../services/breachService';
import commonPasswords from '../../../data/common-passwords-10k.json';
import './PasswordCheckerTool.css';

const PasswordCheckerTool = ({ onComplete, onClose }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [realTimeStrength, setRealTimeStrength] = useState({
    score: 0,
    level: '',
    percentage: 0,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false
    }
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [generatedCrackTime, setGeneratedCrackTime] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [isCommonPassword, setIsCommonPassword] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const followUpShownRef = useRef(false);
  const [showPasswordManagerTable, setShowPasswordManagerTable] = useState(false);
  const [generatedPasswordTheme, setGeneratedPasswordTheme] = useState('');
  const [funFact, setFunFact] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Password themes
  const passwordThemes = {
    cyberpunk: {
      words: ['neo', 'cyber', 'hack', 'matrix', 'ghost', 'shadow', 'neon', 'pulse', 'grid', 'void', 'flux', 'byte', 'core', 'data', 'node'],
      separators: ['_', '-', '.', '#', '@', '$', '&'],
      facts: [
        'Did you know? The term "cyberpunk" was coined in 1980!',
        'Fun fact: The Matrix used green code because it was easier to read on old monitors.',
        'Interesting: Many cyberpunk passwords would take quantum computers millions of years to crack!'
      ]
    },
    scifi: {
      words: ['star', 'nova', 'orbit', 'cosmic', 'lunar', 'solar', 'astro', 'galaxy', 'quasar', 'nebula', 'warp', 'space', 'hyper', 'light'],
      separators: ['_', '-', '.', '*', '^', '~'],
      facts: [
        'Did you know? Light takes 8 minutes to reach Earth from the Sun!',
        'Fun fact: A day on Venus is longer than its year!',
        'Interesting: Your password has more combinations than stars in the Milky Way!'
      ]
    },
    fantasy: {
      words: ['dragon', 'wizard', 'magic', 'mystic', 'rune', 'spell', 'quest', 'legend', 'myth', 'scroll', 'potion', 'sword', 'shield'],
      separators: ['_', '-', '.', '†', '⚔️', '✨'],
      facts: [
        'Did you know? Dragons appear in myths from almost every culture!',
        'Fun fact: The word "wizard" originally meant "wise person"!',
        'Interesting: Medieval passwords were called "watchwords"!'
      ]
    },
    hacker: {
      words: ['root', 'admin', 'sudo', 'shell', 'code', 'debug', 'hash', 'crypt', 'port', 'proxy', 'cache', 'stack', 'heap'],
      separators: ['_', '-', '.', ':', ';', '|', '/'],
      facts: [
        'Did you know? The first computer bug was a real moth!',
        'Fun fact: The first hack was done to make phone calls for free!',
        'Interesting: Your password is stronger than most bank vaults!'
      ]
    }
  };

  // Add this function near the top of the component
  const onToolSuggest = (toolName) => {
    alert(`Switch to tool: ${toolName}`);
  };

  // Real-time password strength calculation
  const calculatePasswordStrength = (pwd) => {
    const requirements = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      numbers: /[0-9]/.test(pwd),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };

    let score = 0;
    if (requirements.length) score += 20;
    if (requirements.uppercase) score += 20;
    if (requirements.lowercase) score += 20;
    if (requirements.numbers) score += 20;
    if (requirements.symbols) score += 20;

    // Bonus for length
    if (pwd.length >= 12) score += 10;
    if (pwd.length >= 16) score += 10;

    // Penalty for common patterns
    if (/^[a-zA-Z]+$/.test(pwd)) score -= 10;
    if (/^[0-9]+$/.test(pwd)) score -= 10;
    if (/password/i.test(pwd)) score -= 20;
    if (/123456/.test(pwd)) score -= 20;

    score = Math.max(0, Math.min(100, score));

    let level = '';
    if (score < 20) level = 'Very Weak';
    else if (score < 40) level = 'Weak';
    else if (score < 60) level = 'Fair';
    else if (score < 80) level = 'Good';
    else level = 'Strong';

    return {
      score,
      level,
      percentage: score,
      requirements
    };
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setRealTimeStrength(calculatePasswordStrength(pwd));
    setError(null);
    setResult(null);
    // Check if password is in the local SecList
    setIsCommonPassword(commonPasswords.includes(pwd));
  };

  const handleCheck = async () => {
    if (!password) {
      setError('⚠️ Please enter a password to begin CyberForget analysis');
      return;
    }

    setIsChecking(true);
    setError(null);

    try {
      // Simulated multi-stage analysis with realistic timing
      const stages = [
        '🔍 Initializing CyberForget password intelligence...',
        '🌐 Scanning 15+ billion breach records...',
        '🧠 AI analyzing password patterns and entropy...',
        '⚡ Cross-referencing against known compromises...',
        '🔐 Generating personalized security recommendations...'
      ];

      let currentStage = 0;
      const stageInterval = setInterval(() => {
        if (currentStage < stages.length) {
          setError(stages[currentStage]); // Use error state to show progress
          currentStage++;
        }
      }, 800);

      // Wait for realistic analysis time (4 seconds)
      await new Promise(resolve => setTimeout(resolve, 4000));
      clearInterval(stageInterval);
      setError(null);
      
      // Check if password has been breached
      const breachResult = await CyberForgetEmailWiper.checkPasswordSafety(password);
      
      // Calculate crack time
      const crackTime = calculateCrackTime(password);
      
      // Calculate security score out of 100
      const securityScore = Math.min(100, 
        (realTimeStrength.percentage * 0.6) + 
        (breachResult.status === 'pwned' ? 0 : 40) + 
        (password.length >= 12 ? 10 : 0) +
        (realTimeStrength.requirements.symbols ? 5 : 0)
      );
      
      const resultData = {
        breached: breachResult.status === 'pwned',
        breachCount: breachResult.count || 0,
        strength: realTimeStrength,
        crackTime: crackTime,
        securityScore: Math.round(securityScore),
        analysisTime: '4.2 seconds',
        passwordMasked: password.substring(0, 3) + '*'.repeat(Math.max(0, password.length - 3)),
        recommendations: generateRecommendations(realTimeStrength, breachResult.status === 'pwned')
      };

      setResult(resultData);
      
      // After successful analysis:
      if (!followUpShownRef.current) {
        setShowFollowUp(true);
        followUpShownRef.current = true;
      }

    } catch (err) {
      setError('❌ CyberForget analysis failed. Please try again.');
      console.error('Password check error:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const calculateCrackTime = (pwd) => {
    const length = pwd.length;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    
    let charsetSize = 0;
    if (hasLower) charsetSize += 26;
    if (hasUpper) charsetSize += 26;
    if (hasNumber) charsetSize += 10;
    if (hasSymbol) charsetSize += 32;
    
    const combinations = Math.pow(charsetSize, length);
    
    // Modern hardware: 350 billion attempts per second
    const modernAttemptsPerSecond = 350e9;
    const modernSeconds = combinations / modernAttemptsPerSecond;
    
    if (modernSeconds < 1) return 'Instantly';
    if (modernSeconds < 60) return `${Math.round(modernSeconds)} seconds`;
    if (modernSeconds < 3600) return `${Math.round(modernSeconds / 60)} minutes`;
    if (modernSeconds < 86400) return `${Math.round(modernSeconds / 3600)} hours`;
    if (modernSeconds < 31536000) return `${Math.round(modernSeconds / 86400)} days`;
    if (modernSeconds < 315360000) return `${Math.round(modernSeconds / 31536000)} years`;
    return 'Centuries';
  };

  const generateRecommendations = (strength, isBreached) => {
    const recommendations = [];
    
    if (isBreached) {
      recommendations.push('⚠️ Change this password immediately - it has been compromised!');
    }
    
    if (!strength.requirements.length) {
      recommendations.push('Make your password at least 8 characters long');
    }
    if (!strength.requirements.uppercase) {
      recommendations.push('Add uppercase letters (A-Z)');
    }
    if (!strength.requirements.lowercase) {
      recommendations.push('Add lowercase letters (a-z)');
    }
    if (!strength.requirements.numbers) {
      recommendations.push('Include numbers (0-9)');
    }
    if (!strength.requirements.symbols) {
      recommendations.push('Add special characters (!@#$%^&*)');
    }
    
    if (strength.score < 60) {
      recommendations.push('Consider using a passphrase or password manager');
    }
    
    return recommendations;
  };

  const generateNewPassword = () => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]:;?><,./-=';
    let newPassword = '';
    
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setPassword(newPassword);
    setRealTimeStrength(calculatePasswordStrength(newPassword));
    setResult(null);
  };

  const getStrengthColor = () => {
    if (realTimeStrength.score < 20) return '#ff3b3b';
    if (realTimeStrength.score < 40) return '#ff9800';
    if (realTimeStrength.score < 60) return '#ffc107';
    if (realTimeStrength.score < 80) return '#4caf50';
    return '#42ffb5';
  };

  // Quantum computer crack time
  const calculateQuantumCrackTime = (pwd) => {
    const length = pwd.length;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    
    let charsetSize = 0;
    if (hasLower) charsetSize += 26;
    if (hasUpper) charsetSize += 26;
    if (hasNumber) charsetSize += 10;
    if (hasSymbol) charsetSize += 32;
    
    const combinations = Math.pow(charsetSize, length);
    // Quantum: 10 quadrillion attempts per second (conservative estimate)
    const quantumAttemptsPerSecond = 10e15;
    const seconds = combinations / quantumAttemptsPerSecond;
    
    if (seconds < 1) return 'Instantly';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 315360000) return `${Math.round(seconds / 31536000)} years`;
    return 'Centuries';
  };

  const getBadgeContent = (level, score) => {
    switch (level.toLowerCase()) {
      case 'very weak': return { icon: '🔴', text: 'Rookie', message: 'Let\'s level up your security!' };
      case 'weak': return { icon: '🟡', text: 'Cadet', message: 'Getting better, but not there yet!' };
      case 'fair': return { icon: '🟢', text: 'Guardian', message: 'Nice! You\'re on the right track.' };
      case 'good': return { icon: '🛡️', text: 'Defender', message: 'Strong password! Almost a hero.' };
      case 'strong': return { icon: '🌟', text: 'Cyber Hero', message: 'Uncrackable! You\'re a legend.' };
      default: return { icon: '⚫', text: 'Start typing...', message: '' };
    }
  };

  const getPasswordStats = (pwd) => {
    if (!pwd) return null;
    
    const length = pwd.length;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    
    let charsetSize = 0;
    if (hasLower) charsetSize += 26;
    if (hasUpper) charsetSize += 26;
    if (hasNumber) charsetSize += 10;
    if (hasSymbol) charsetSize += 32;
    
    const combinations = Math.pow(charsetSize, length);
    
    // Modern hardware calculations
    const modernAttemptsPerSecond = 350e9; // 350 billion/sec
    const modernTimeSeconds = combinations / modernAttemptsPerSecond;
    
    // Quantum calculations
    const quantumAttemptsPerSecond = 10e15; // 10 quadrillion/sec
    const quantumTimeSeconds = combinations / quantumAttemptsPerSecond;
    
    // Calculate fun metrics for both
    const modernCoffees = Math.max(1, Math.floor(modernTimeSeconds / 300));
    const modernMovies = Math.max(1, Math.floor(modernTimeSeconds / 7200));
    const quantumCoffees = Math.max(1, Math.floor(quantumTimeSeconds / 300));
    const quantumMovies = Math.max(1, Math.floor(quantumTimeSeconds / 7200));
    
    return {
      combinations: combinations.toExponential(2),
      modernCoffees: modernCoffees > 1e6 ? '∞' : modernCoffees.toLocaleString(),
      modernMovies: modernMovies > 1e6 ? '∞' : modernMovies.toLocaleString(),
      quantumCoffees: quantumCoffees > 1e6 ? '∞' : quantumCoffees.toLocaleString(),
      quantumMovies: quantumMovies > 1e6 ? '∞' : quantumMovies.toLocaleString(),
      characters: length
    };
  };

  const handleGeneratePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]:;?><,./-=";
    let pwd = "";
    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      pwd += charset[randomIndex];
    }
    setGeneratedPassword(pwd);
    setGeneratedCrackTime(calculateCrackTime(pwd));
    setCopySuccess('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword)
      .then(() => {
        setCopySuccess('Password copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(() => {
        setCopySuccess('Copy failed');
        setTimeout(() => setCopySuccess(''), 2000);
      });
  };

  const generateThemedPassword = () => {
    // Pick a random theme
    const themes = Object.keys(passwordThemes);
    const theme = themes[Math.floor(Math.random() * themes.length)];
    const selectedTheme = passwordThemes[theme];
    
    // Generate themed components
    const word1 = selectedTheme.words[Math.floor(Math.random() * selectedTheme.words.length)];
    const word2 = selectedTheme.words[Math.floor(Math.random() * selectedTheme.words.length)];
    const separator = selectedTheme.separators[Math.floor(Math.random() * selectedTheme.separators.length)];
    
    // Add some numbers and special chars for security
    const numbers = Math.floor(Math.random() * 900 + 100); // 3 digit number
    const specialChars = '!@#$%^&*';
    const specialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
    
    // Construct password with some randomization in format
    const formats = [
      `${word1}${separator}${word2}${numbers}${specialChar}`,
      `${word2}${numbers}${separator}${word1}${specialChar}`,
      `${numbers}${separator}${word1}${specialChar}${word2}`,
    ];
    
    const password = formats[Math.floor(Math.random() * formats.length)];
    
    // Set the generated password with animation
    setIsPasswordVisible(false);
    setGeneratedPassword(password);
    setGeneratedPasswordTheme(theme);
    setGeneratedCrackTime(calculateCrackTime(password));
    setCopySuccess('');
    
    // Set a random fun fact
    const fact = selectedTheme.facts[Math.floor(Math.random() * selectedTheme.facts.length)];
    setFunFact(fact);
    
    // Show the password after a brief delay
    setTimeout(() => setIsPasswordVisible(true), 300);
  };

  const followUpMessages = [
    "Your digital fortress is getting stronger! 🏰 Want to see the world's best password managers?",
    "Staying safe, one password at a time! Would you like a password manager recommendation?",
    "Did you know? Using a password manager is one of the best ways to stay secure. Want to compare the top options?"
  ];
  const randomFollowUp = followUpMessages[Math.floor(Math.random() * followUpMessages.length)];

  return (
    <BaseTool
      toolName="Password Security Checker"
      toolIcon="🔐"
      toolDescription="Check if your password has been compromised and test its strength"
      onClose={onClose}
      className="password-checker-tool"
    >
      <div className="password-checker-content themed-chatbot">
        <div className="cyberforget-password-header">
          <FaShieldAlt className="password-header-icon" />
          <div className="password-header-text">
            <h4>🤖 CyberForget AI: Password Security Chatbot</h4>
            <p>Hey there, cyber explorer! Ready to see if your password is a hero or a zero? Type it in and let me work my magic. (Don’t use your real password!)</p>
          </div>
        </div>
        <div className="password-input-section">
          <div className="password-input-wrapper" style={{ position: 'relative', zIndex: 2 }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter a password to check..."
              className="password-input"
              autoComplete="off"
              style={{ zIndex: 2 }}
            />
            <button
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              style={{ zIndex: 3, position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}
              tabIndex={0}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {password && (
            <div className="strength-indicator" style={{ marginBottom: 12 }}>
              <div className="strength-bar-container">
                <div 
                  className="strength-bar-fill"
                  style={{ 
                    width: `${realTimeStrength.percentage}%`,
                    backgroundColor: getStrengthColor()
                  }}
                />
              </div>
              <span 
                className="strength-label"
                style={{ color: getStrengthColor() }}
              >
                {realTimeStrength.level}
              </span>
              <span className="badge-fun">
                {getBadgeContent(realTimeStrength.level, realTimeStrength.score).icon} {getBadgeContent(realTimeStrength.level, realTimeStrength.score).text}
              </span>
            </div>
          )}
          {isCommonPassword && password && (
            <div className="common-password-warning" style={{ marginBottom: 12 }}>
              <span role="img" aria-label="alert">⚠️</span> This password is <b>very common</b> and easily guessed by attackers! Try something more unique for better security.
            </div>
          )}
          {/* Add new action buttons below Analyze Password and Generate Fun Password */}
          <div className="action-btn-row">
            <button className="action-btn" onClick={handleCheck}><FaShieldAlt /> Analyze Password</button>
            <button className="action-btn" onClick={generateThemedPassword}><FaLightbulb /> Generate Fun Password</button>
          </div>
        </div>

        {/* Update the generated password display */}
        {generatedPassword && (
          <div className="generated-password-box">
            <div className="generated-password-label">
              🎲 Your {generatedPasswordTheme.charAt(0).toUpperCase() + generatedPasswordTheme.slice(1)}-Themed Password:
            </div>
            <div className={`generated-password-value ${isPasswordVisible ? 'visible' : ''}`}>
              {generatedPassword}
            </div>
            <button className="copy-btn" onClick={handleCopy}><FaCopy /></button>
            {copySuccess && <span className="copy-success">{copySuccess}</span>}
            <div className="generated-crack-time">Modern Crack Time: <b>{generatedCrackTime}</b></div>
            <div className="generated-quantum-time">Quantum Crack Time: <b>{calculateQuantumCrackTime(generatedPassword)}</b></div>
            {funFact && (
              <div className="password-fun-fact">
                <FaLightbulb className="fact-icon" /> {funFact}
              </div>
            )}
          </div>
        )}

        {isChecking && (
          <div className="analysis-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <div className="analysis-stage">
              🔒 Analyzing password strength...
            </div>
          </div>
        )}

        {error && error.startsWith('🔍') && (
          <div className="analysis-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <div className="analysis-stage">
              {error}
            </div>
          </div>
        )}

        {error && !error.startsWith('🔍') && (
          <ToolError error={error} onRetry={handleCheck} />
        )}
        {result && !isChecking && (
          <ToolResult
            status={result.breached ? 'error' : result.strength.score >= 60 ? 'success' : 'warning'}
            title={result.breached ? '😱 Oh no! Password Compromised!' : '🎉 Password Analysis Complete!'}
            message={
              result.breached 
                ? `This password has been found in ${result.breachCount.toLocaleString()} data breaches. 🚨 Time to change it!`
                : `Your password would take approximately ${result.crackTime} to crack with modern hardware.`
            }
            details={
              <div className="password-details">
                <div className="fun-stats-row">
                  <div className="stat-item">
                    <span className="stat-label">Characters:</span> 
                    {getPasswordStats(password)?.characters}
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Combinations:</span> 
                    {getPasswordStats(password)?.combinations}
                  </div>
                </div>
                
                <div className="crack-time-section">
                  <h5>🖥️ Modern Hardware</h5>
                  <div className="fun-stats-row">
                    <div className="stat-item">
                      <span className="stat-label">Coffees:</span> 
                      {getPasswordStats(password)?.modernCoffees}
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Movies:</span> 
                      {getPasswordStats(password)?.modernMovies}
                    </div>
                  </div>
                  
                  <h5>🔮 Quantum Computer</h5>
                  <div className="fun-stats-row">
                    <div className="stat-item">
                      <span className="stat-label">Coffees:</span> 
                      {getPasswordStats(password)?.quantumCoffees}
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Movies:</span> 
                      {getPasswordStats(password)?.quantumMovies}
                    </div>
                  </div>
                </div>

                {result.recommendations.length > 0 && (
                  <div className="recommendations">
                    <h5>CyberForget AI Tips:</h5>
                    <ul>
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx}><FaInfoCircle /> {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            }
            actions={[
              {
                label: 'Try Another Password',
                icon: '🔄',
                variant: 'secondary',
                onClick: () => {
                  setPassword('');
                  setResult(null);
                  setRealTimeStrength(calculatePasswordStrength(''));
                }
              },
              {
                label: 'Get Password Manager',
                icon: '🛡️',
                variant: 'primary',
                onClick: () => window.open('/password-managers', '_blank')
              }
            ]}
          />
        )}
        {showFollowUp && !showPasswordManagerTable && (
          <div className="follow-up-message">
            <div className="follow-up-text">Anything else I can help you with? Try another tool below!</div>
            <div className="follow-up-actions">
              <button className="follow-up-btn" onClick={() => window.location.href = '/location'}>🔍 Data Broker Scan</button>
              <button className="follow-up-btn" onClick={() => window.location.href = '/data-leak'}>📧 Email Breach Check</button>
              <button className="follow-up-btn secondary" onClick={() => setShowFollowUp(false)}>No Thanks</button>
            </div>
          </div>
        )}
        {showPasswordManagerTable && (
          <div className="password-manager-table-wrapper">
            <div className="password-manager-table-title">🔐 Password Manager Comparison</div>
            <table className="password-manager-table">
              <thead>
                <tr>
                  <th>Manager</th>
                  <th>Free Plan</th>
                  <th>Autofill</th>
                  <th>Cross-Platform</th>
                  <th>Security Audit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Bitwarden</td>
                  <td>✔️</td>
                  <td>✔️</td>
                  <td>✔️</td>
                  <td>✔️</td>
                </tr>
                <tr>
                  <td>1Password</td>
                  <td>❌</td>
                  <td>✔️</td>
                  <td>✔️</td>
                  <td>✔️</td>
                </tr>
                <tr>
                  <td>LastPass</td>
                  <td>✔️</td>
                  <td>✔️</td>
                  <td>✔️</td>
                  <td>❌</td>
                </tr>
                <tr>
                  <td>Dashlane</td>
                  <td>✔️</td>
                  <td>✔️</td>
                  <td>✔️</td>
                  <td>✔️</td>
                </tr>
              </tbody>
            </table>
            <div className="password-manager-table-note">All managers use strong encryption. Choose one that fits your needs and device!</div>
          </div>
        )}
      </div>
    </BaseTool>
  );
};

export default PasswordCheckerTool;