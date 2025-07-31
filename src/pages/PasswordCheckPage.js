import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet'; // For adding meta tags
import './PasswordCheckPage.css';
import { 
    FaEye, 
    FaEyeSlash, 
    FaCopy, 
    FaShieldAlt, 
    FaLightbulb, 
    FaInfoCircle
} from 'react-icons/fa';
import MobileNavbar from '../components/MobileNavbar';
import Navbar from '../components/Navbar';
import useWindowSize from '../hooks/useWindowSize';
import { useLocation } from 'react-router-dom';

const PasswordCheckPage = () => {
    const location = useLocation();
    
    useEffect(() => {
        // Only scroll to top on initial mount for this specific page
        if (location.pathname === '/password-check') {
            window.scrollTo({
                top: 0,
                behavior: 'instant' // Use 'instant' instead of 'smooth' to prevent animation issues
            });
        }
    }, [location.pathname]); // Only run when pathname changes

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [attackTypes, setAttackTypes] = useState([]);
    const [bruteForceTime, setBruteForceTime] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [generatedBruteForceTime, setGeneratedBruteForceTime] = useState('');
    const [showInfoCheck, setShowInfoCheck] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const { width } = useWindowSize();
    const [safetyScore, setSafetyScore] = useState(0);
    const [copySuccess, setCopySuccess] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    // Real-time password strength states
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

    // Tab system state
    const [activeTab, setActiveTab] = useState('tips');

    // Interactive examples data
    const passwordExamples = [
        {
            password: 'password123',
            level: 'weak',
            score: 15,
            time: 'Instantly cracked',
            description: 'Common word + numbers'
        },
        {
            password: 'P@ssw0rd!',
            level: 'fair',
            score: 45,
            time: '3 hours',
            description: 'Basic substitution'
        },
        {
            password: 'MyDog&Coffee2024',
            level: 'good',
            score: 75,
            time: '2.3 million years',
            description: 'Memorable + secure'
        },
        {
            password: 'K8#mQ$vL9@nR3*pX',
            level: 'strong',
            score: 95,
            time: '46 trillion years',
            description: 'Random + complex'
        }
    ];

    // Password manager recommendations
    const passwordManagers = [
        {
            name: '1Password',
            price: '$2.99/month',
            icon: '1️⃣',
            features: ['Unlimited passwords', 'Family sharing', 'Travel mode'],
            link: 'https://1password.com/'
        },
        {
            name: 'Bitwarden',
            price: 'Free / $3/month',
            icon: '🔐',
            features: ['Open source', 'Cross-platform', 'Secure sharing'],
            link: 'https://bitwarden.com/'
        },
        {
            name: 'LastPass',
            price: 'Free / $3/month',
            icon: '🔑',
            features: ['Auto-fill', 'Password audit', 'Dark web monitoring'],
            link: 'https://lastpass.com/'
        }
    ];

    const guessesPerSecond = 1e12; // 1 trillion guesses per second

    const roundTime = (time) => {
        if (time < 1) {
            return `${(time * 60).toFixed(2)} minutes`;
        }
        if (time < 24) {
            return `${time.toFixed(2)} hours`;
        }
        const days = time / 24;
        if (days < 365) {
            return `${days.toFixed(2)} days`;
        }
        const years = days / 365;
        return `${years.toFixed(2)} years`;
    };

    const isCommonPassword = (pwd) => ['password', '123456', 'qwerty'].includes(pwd.toLowerCase());

    const estimateBruteForceTime = (pwd) => {
        const possibleCombinations = Math.pow(95, pwd.length); 
        const timeInSeconds = possibleCombinations / guessesPerSecond;
        const timeInHours = timeInSeconds / 3600;
        return roundTime(timeInHours);
    };

    const generateSuggestions = (pwd) => {
        const suggestions = [];
        if (pwd.length < 12) suggestions.push('Use at least 12 characters.');
        if (!/[A-Z]/.test(pwd)) suggestions.push('Include uppercase letters.');
        if (!/[a-z]/.test(pwd)) suggestions.push('Include lowercase letters.');
        if (!/[0-9]/.test(pwd)) suggestions.push('Include numbers.');
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) suggestions.push('Include special characters.');
        if (isCommonPassword(pwd)) suggestions.push('Avoid using common passwords.');
        return suggestions;
    };

    const generateStrongPassword = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]:;?><,./-=";
        let pwd = "";
        for (let i = 0; i < 16; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            pwd += charset[randomIndex];
        }
        return pwd;
    };

    const calculateSafetyScore = (pwd) => {
        let score = 0;
        if (pwd.length >= 15) {
            score += 40;
        } else if (pwd.length >= 11) {
            score += 20;
        } else if (pwd.length >= 8) {
            score += 10;
        }

        let varietyPoints = 0;
        if (/[A-Z]/.test(pwd)) varietyPoints += 10; // Uppercase
        if (/[a-z]/.test(pwd)) varietyPoints += 10; // Lowercase
        if (/[\d]/.test(pwd)) varietyPoints += 10; // Numbers
        if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) varietyPoints += 10; // Special Characters
        score += varietyPoints;

        if (!isCommonPassword(pwd)) {
            score += 20;
        }

        if (score > 100) score = 100;

        return score;
    };

    // Real-time password strength calculation
    const calculateRealTimeStrength = (pwd) => {
        if (!pwd) {
            return {
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
            };
        }

        const requirements = {
            length: pwd.length >= 12,
            uppercase: /[A-Z]/.test(pwd),
            lowercase: /[a-z]/.test(pwd),
            numbers: /[0-9]/.test(pwd),
            symbols: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
        };

        let score = 0;
        
        // Length scoring
        if (pwd.length >= 16) score += 30;
        else if (pwd.length >= 12) score += 20;
        else if (pwd.length >= 8) score += 10;
        else if (pwd.length >= 6) score += 5;

        // Character variety scoring
        if (requirements.uppercase) score += 15;
        if (requirements.lowercase) score += 15;
        if (requirements.numbers) score += 15;
        if (requirements.symbols) score += 15;

        // Bonus for meeting all requirements
        const allRequirementsMet = Object.values(requirements).every(Boolean);
        if (allRequirementsMet) score += 10;

        score = Math.min(score, 100);

        let level = '';
        if (score < 25) level = 'weak';
        else if (score < 50) level = 'fair';
        else if (score < 75) level = 'good';
        else level = 'strong';

        return {
            score,
            level,
            percentage: score,
            requirements
        };
    };

    // Update real-time strength when password changes
    useEffect(() => {
        const strength = calculateRealTimeStrength(password);
        setRealTimeStrength(strength);
    }, [password]);

    // Gamification badge component
    const getBadgeContent = (level, score) => {
        switch (level) {
            case 'weak':
                return { icon: '🔴', text: 'Rookie Level', message: 'Need more protection!' };
            case 'fair':
                return { icon: '🟡', text: 'Cadet Level', message: 'Getting better!' };
            case 'good':
                return { icon: '🟢', text: 'Guardian Level', message: 'Well protected!' };
            case 'strong':
                return { icon: '🛡️', text: 'Cyber Hero', message: 'Maximum security!' };
            default:
                return { icon: '⚫', text: 'Start typing...', message: '' };
        }
    };

    // Fun stats about password security
    const getPasswordStats = (password) => {
        if (!password) return null;
        
        const combinations = Math.pow(95, password.length);
        const timeSeconds = combinations / guessesPerSecond;
        const coffees = Math.floor(timeSeconds / 300); // 5 minutes per coffee
        const movies = Math.floor(timeSeconds / 7200); // 2 hours per movie
        
        return {
            combinations: combinations.toExponential(2),
            coffees: coffees > 1000000 ? '∞' : coffees.toLocaleString(),
            movies: movies > 1000000 ? '∞' : movies.toLocaleString(),
            characters: password.length
        };
    };

    // Handle example password click
    const handleExampleClick = (examplePassword) => {
        setPassword(examplePassword);
        // Auto-scroll to input
        document.querySelector('.password-input').focus();
    };

    const handleCheckPassword = () => {
        if (!password) {
            setError('Please enter a password.');
            return;
        }
        setError('');
        setIsAnalyzing(true);
        
        // Simulate analysis
        setTimeout(() => {
            const attacks = isCommonPassword(password) ? ['Dictionary Attack', 'Brute Force Attack'] : ['Brute Force Attack'];
            const bruteTime = estimateBruteForceTime(password);
            const pwdSuggestions = generateSuggestions(password);
            const score = calculateSafetyScore(password);

            setAttackTypes(attacks);
            setBruteForceTime(bruteTime);
            setSuggestions(pwdSuggestions);
            setSafetyScore(score);
            setShowInfoCheck(true);
            setIsAnalyzing(false);
        }, 3000); // 3 seconds of "analysis"
    };

    const handleGeneratePassword = () => {
        const strongPwd = generateStrongPassword();
        setGeneratedPassword(strongPwd);
        setGeneratedBruteForceTime(estimateBruteForceTime(strongPwd));
        // Don't show analysis results for generated passwords
        // Users can copy and test them in the input above if they want
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedPassword)
            .then(() => {
                setCopySuccess('Password copied to clipboard!');
                setTimeout(() => setCopySuccess(''), 3000);
            })
            .catch(() => {
                setCopySuccess('Failed to copy password.');
                setTimeout(() => setCopySuccess(''), 3000);
            });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const redirectUrl = `https://app.cleandata.me/location?first=${encodeURIComponent(firstName)}&last=${encodeURIComponent(lastName)}`;
        window.location.href = redirectUrl;
    };

    const convertTimeToFun = (time) => {
        const years = parseFloat(time);
        if (years < 1) {
            const days = years * 365;
            return `${days.toFixed(1)} days (about ${Math.ceil(days / 7)} weekends)`;
        }
        if (years < 100) {
            return `${years.toFixed(1)} years (${Math.floor(years)} trips around the sun)`;
        }
        if (years < 1000) {
            return `${years.toFixed(1)} years (${Math.floor(years / 100)} centuries)`;
        }
        return `${years.toFixed(1)} years (${Math.floor(years / 1000)} millennia)`;
    };

    const AnalysisAnimation = () => (
        <div className="analysis-animation">
            <p>Analyzing password strength...</p>
            <div className="progress-bar">
                <div className="progress"></div>
            </div>
        </div>
    );

    return (
        <div className="password-check-page">
            <Helmet>
                <title>Is Your Password Secure? | Password Strength Checker</title>
                <meta name="description" content="Check your password strength with our advanced analyzer. Learn how to create secure passwords and protect your online accounts." />
            </Helmet>

            {/* Navbar */}
            {width > 768 && <Navbar />}
            {width <= 768 && <MobileNavbar />}

            <main className="content-wrapper">
                <section className="header-section">
                    <h1>Is Your Password Putting You at Risk?</h1>
                    <h2>Weak passwords are the #1 way hackers steal your identity. Test your password strength and discover what else they might already know about you.</h2>
                    <p className="security-notice">
                        ⚠️ For your security, please don't enter your actual passwords. Try similar patterns to test password strength.
                    </p>
                    
                    <div className="password-check-form">
                        <div className="input-group">
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="password-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    aria-label="Password input"
                                />
                                <button
                                    className="toggle-visibility-button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            
                            {/* Real-time Password Strength Meter */}
                            {password && (
                                <div className="password-strength-meter">
                                    <div className="strength-bar">
                                        <div 
                                            className={`strength-progress ${realTimeStrength.level}`}
                                            style={{ width: `${realTimeStrength.percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="strength-label">
                                        <span className={`strength-text ${realTimeStrength.level}`}>
                                            {realTimeStrength.level ? realTimeStrength.level.charAt(0).toUpperCase() + realTimeStrength.level.slice(1) : ''}
                                        </span>
                                        <span>{realTimeStrength.score}%</span>
                                    </div>
                                    
                                    {/* Gamification Badge */}
                                    {password && realTimeStrength.level && (
                                        <div className={`strength-badge ${realTimeStrength.level}`}>
                                            <span>{getBadgeContent(realTimeStrength.level, realTimeStrength.score).icon}</span>
                                            <span>{getBadgeContent(realTimeStrength.level, realTimeStrength.score).text}</span>
                                            <span>• {getBadgeContent(realTimeStrength.level, realTimeStrength.score).message}</span>
                                        </div>
                                    )}
                                    <ul className="requirements-list">
                                        <li className={`requirement-item ${realTimeStrength.requirements.length ? 'met' : ''}`}>
                                            <span className="requirement-icon">
                                                {realTimeStrength.requirements.length ? '✓' : '○'}
                                            </span>
                                            At least 12 characters
                                        </li>
                                        <li className={`requirement-item ${realTimeStrength.requirements.uppercase ? 'met' : ''}`}>
                                            <span className="requirement-icon">
                                                {realTimeStrength.requirements.uppercase ? '✓' : '○'}
                                            </span>
                                            Uppercase letter
                                        </li>
                                        <li className={`requirement-item ${realTimeStrength.requirements.lowercase ? 'met' : ''}`}>
                                            <span className="requirement-icon">
                                                {realTimeStrength.requirements.lowercase ? '✓' : '○'}
                                            </span>
                                            Lowercase letter
                                        </li>
                                        <li className={`requirement-item ${realTimeStrength.requirements.numbers ? 'met' : ''}`}>
                                            <span className="requirement-icon">
                                                {realTimeStrength.requirements.numbers ? '✓' : '○'}
                                            </span>
                                            Number
                                        </li>
                                        <li className={`requirement-item ${realTimeStrength.requirements.symbols ? 'met' : ''}`}>
                                            <span className="requirement-icon">
                                                {realTimeStrength.requirements.symbols ? '✓' : '○'}
                                            </span>
                                            Special character
                                        </li>
                                    </ul>
                                </div>
                            )}
                            
                            <button className="check-button" onClick={handleCheckPassword} disabled={isAnalyzing}>
                                {isAnalyzing ? 'Analyzing...' : 'Check Password'}
                            </button>
                        </div>
                        {isAnalyzing && <AnalysisAnimation />}
                        {error && <div className="error-message">{error}</div>}
                    </div>

                    {/* Analysis Results */}
                    {showInfoCheck && (
                        <div className="analysis-results">
                            <h2><FaShieldAlt className="section-icon" /> Analysis Results</h2>
                            
                            {/* Safety Score Section */}
                            <div className="safety-score-section">
                                <div className="score-label">
                                    <span>Safety Score: {safetyScore}%</span>
                                    <span className="score-icon">
                                        {safetyScore < 50 && <FaInfoCircle title="Weak Password" />}
                                        {safetyScore >= 50 && safetyScore < 75 && <FaInfoCircle title="Moderate Password" />}
                                        {safetyScore >= 75 && <FaInfoCircle title="Strong Password" />}
                                    </span>
                                </div>
                                <div className="strength-label">
                                    {safetyScore < 50 && 'Weak'}
                                    {safetyScore >= 50 && safetyScore < 75 && 'Moderate'}
                                    {safetyScore >= 75 && 'Strong'}
                                </div>
                            </div>

                            {/* Possible Attacks */}
                            <div className="result-box">
                                <h3><FaInfoCircle className="subsection-icon" /> Possible Attacks:</h3>
                                <ul className="result-list">
                                    {attackTypes.map((attack, index) => (
                                        <li key={index} className={`attack-badge ${attack.toLowerCase().replace(' ', '-')}`}>
                                            {attack}
                                            <FaInfoCircle 
                                                className="tooltip-icon" 
                                                title={attack === 'Dictionary Attack' ? 'An attack using a list of common words.' : 'An attack trying all possible combinations.'} 
                                            />
                                        </li>
                                    ))}
                                </ul>
                                <p><strong>Estimated time to crack via brute force:</strong> <span className="crack-time">{convertTimeToFun(bruteForceTime)}</span></p>
                            </div>

                            {/* Suggestions */}
                            {suggestions.length > 0 && (
                                <div className="result-box">
                                    <h3><FaLightbulb className="subsection-icon" /> Suggestions to Improve Your Password:</h3>
                                    <ul className="suggestions-list">
                                        {suggestions.map((suggestion, index) => (
                                            <li key={index}>{suggestion}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Fun Password Stats */}
                    {password && getPasswordStats(password) && (
                        <div className="fun-stats">
                            <div className="stat-item">
                                <span className="stat-number">{getPasswordStats(password).characters}</span>
                                <div className="stat-label">Characters Used</div>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{getPasswordStats(password).combinations}</span>
                                <div className="stat-label">Possible Combinations</div>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{getPasswordStats(password).coffees}</span>
                                <div className="stat-label">Coffees While Cracking</div>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{getPasswordStats(password).movies}</span>
                                <div className="stat-label">Movies While Cracking</div>
                            </div>
                        </div>
                    )}

                    <div className="cta-message">
                        <p><strong>💡 Pro Tip:</strong> Even if your password is strong, hackers can still find you through data brokers who sell your personal information online.</p>
                        <p><strong>Scroll down to check if your name and details are being sold right now.</strong></p>
                    </div>
                    <p className="privacy-statement">
                        Your privacy is our priority. All entries are completely secure, never stored, and never shared. Guaranteed.
                    </p>
                </section>

                {/* Tabbed Content System */}
                <section className="content-tabs">
                    <div className="tab-navigation">
                        <button 
                            className={`tab-button ${activeTab === 'tips' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tips')}
                        >
                            💡 Tips & Best Practices
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'examples' ? 'active' : ''}`}
                            onClick={() => setActiveTab('examples')}
                        >
                            🎮 Interactive Examples
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'tools' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tools')}
                        >
                            🔧 Password Managers
                        </button>
                        <button 
                            className={`tab-button ${activeTab === 'faq' ? 'active' : ''}`}
                            onClick={() => setActiveTab('faq')}
                        >
                            ❓ FAQ & Security
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'tips' && (
                            <div className="card">
                                <h2>🔐 Password Protection Mastery</h2>
                                <div className="create-secure-password-section">
                                    <h3>The Password Formula That Stops Hackers</h3>
                                    <p><strong>Most people's passwords are cracked in under 2 minutes.</strong> Here's how to make yours virtually unbreakable:</p>
                                    <ul className="best-practices-list">
                                        <li><strong>Length Beats Complexity:</strong> A 15-character passphrase like "BlueCoffee2024Sunrise!" is stronger than "P@ssw0rd!" and easier to remember.</li>
                                        <li><strong>Use the "4 Random Words" Method:</strong> Combine unexpected words: "Elephant-Thunder-Pizza-River" is incredibly secure.</li>
                                        <li><strong>One Password Per Account:</strong> Reusing passwords is like using the same key for your house, car, and office.</li>
                                        <li><strong>Avoid Personal Info:</strong> Your name, birthday, or pet's name are the first things hackers try.</li>
                                        <li><strong>Add Symbols Strategically:</strong> Instead of replacing letters, add symbols between words: "Blue!Coffee@2024#Sunrise"</li>
                                    </ul>
                                </div>

                                <div className="importance-password-security-section">
                                    <h3>⚠️ What Happens When Hackers Get In</h3>
                                    <p><strong>A stolen password isn't just about one account - it's the key to your entire digital life:</strong></p>
                                    <ul className="consequences-list">
                                        <li><strong>Financial Devastation:</strong> Average identity theft victim loses $1,343 and spends 7 months recovering.</li>
                                        <li><strong>Privacy Invasion:</strong> Access to photos, messages, location data, and even home security cameras.</li>
                                        <li><strong>Reputation Damage:</strong> Fake posts, messages sent to contacts, or embarrassing information leaked.</li>
                                        <li><strong>The Domino Effect:</strong> One compromised account leads to others through password reuse and recovery emails.</li>
                                    </ul>
                                    <div style={{marginTop: '20px', padding: '15px', background: 'rgba(74, 144, 226, 0.1)', borderRadius: '8px'}}>
                                        <p><strong>💡 Remember:</strong> Even the strongest password won't protect you if your personal information is being sold by data brokers. <strong>Scroll down to check if your data is for sale!</strong></p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'examples' && (
                            <div className="card">
                                <h2>🎮 Try These Password Examples</h2>
                                <p>Click any example below to test it in the password checker above and see how different approaches affect security:</p>
                                
                                <div className="example-grid">
                                    {passwordExamples.map((example, index) => (
                                        <div 
                                            key={index}
                                            className={`example-card ${example.level}`}
                                            onClick={() => handleExampleClick(example.password)}
                                        >
                                            <div className="example-password">{example.password}</div>
                                            <div className="example-strength">{example.level.toUpperCase()} - {example.score}%</div>
                                            <div className="example-time">Time to crack: {example.time}</div>
                                            <p style={{marginTop: '8px', fontSize: '0.8rem', color: '#9ca3af'}}>{example.description}</p>
                                        </div>
                                    ))}
                                </div>

                                <div style={{marginTop: '30px', padding: '20px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px'}}>
                                    <h3>🎯 Key Takeaways</h3>
                                    <ul style={{color: '#d1d5db', lineHeight: '1.6'}}>
                                        <li><strong>Length matters most:</strong> A longer passphrase beats complex short passwords</li>
                                        <li><strong>Avoid predictable patterns:</strong> Substitutions like @ for 'a' are easily cracked</li>
                                        <li><strong>Randomness is king:</strong> Truly random passwords offer maximum protection</li>
                                        <li><strong>Memorable can be secure:</strong> Use unexpected word combinations</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === 'tools' && (
                            <div className="card">
                                <h2>🔧 Recommended Password Managers</h2>
                                <p>Password managers are the best way to generate, store, and manage strong passwords. Here are our top recommendations:</p>
                                
                                <div className="password-managers">
                                    {passwordManagers.map((manager, index) => (
                                        <div key={index} className="manager-card">
                                            <div className="manager-logo">{manager.icon}</div>
                                            <div className="manager-name">{manager.name}</div>
                                            <div className="manager-price">{manager.price}</div>
                                            <ul className="manager-features">
                                                {manager.features.map((feature, i) => (
                                                    <li key={i}>{feature}</li>
                                                ))}
                                            </ul>
                                            <a href={manager.link} target="_blank" rel="noopener noreferrer" className="manager-link">
                                                Learn More
                                            </a>
                                        </div>
                                    ))}
                                </div>

                                <div style={{marginTop: '30px', padding: '20px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px'}}>
                                    <h3>Why Use a Password Manager?</h3>
                                    <ul style={{color: '#d1d5db', lineHeight: '1.6'}}>
                                        <li><strong>Generate strong passwords:</strong> Create unique passwords for every account</li>
                                        <li><strong>Remember everything:</strong> No need to memorize dozens of passwords</li>
                                        <li><strong>Auto-fill forms:</strong> Save time with automatic login</li>
                                        <li><strong>Sync across devices:</strong> Access your passwords anywhere</li>
                                        <li><strong>Security alerts:</strong> Get notified of breaches and weak passwords</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === 'faq' && (
                            <div className="card">
                                <h2>❓ Frequently Asked Questions</h2>
                                <dl itemScope itemType="https://schema.org/FAQPage">
                                    <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question" style={{marginBottom: '20px'}}>
                                        <dt itemProp="name" style={{fontSize: '1.1rem', fontWeight: '600', color: '#D8FF60', marginBottom: '8px'}}>What is the most secure password?</dt>
                                        <dd itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                                            <div itemProp="text" style={{color: '#d1d5db'}}>
                                                A highly secure password typically includes a combination of uppercase and lowercase letters, numbers, and special characters, and is at least 16 characters long. Even better is a passphrase with unexpected word combinations.
                                            </div>
                                        </dd>
                                    </div>
                                    <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question" style={{marginBottom: '20px'}}>
                                        <dt itemProp="name" style={{fontSize: '1.1rem', fontWeight: '600', color: '#D8FF60', marginBottom: '8px'}}>How secure is a 12-character password?</dt>
                                        <dd itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                                            <div itemProp="text" style={{color: '#d1d5db'}}>
                                                A 12-character password with mixed character types would take a modern computer approximately 34,000 years to crack through brute force. However, 16+ characters is recommended for maximum security.
                                            </div>
                                        </dd>
                                    </div>
                                    <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question" style={{marginBottom: '20px'}}>
                                        <dt itemProp="name" style={{fontSize: '1.1rem', fontWeight: '600', color: '#D8FF60', marginBottom: '8px'}}>Should I change my passwords regularly?</dt>
                                        <dd itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                                            <div itemProp="text" style={{color: '#d1d5db'}}>
                                                Modern security experts recommend only changing passwords when there's evidence of a breach. Regular changes can lead to weaker passwords and user fatigue. Focus on using unique, strong passwords for each account instead.
                                            </div>
                                        </dd>
                                    </div>
                                    <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question" style={{marginBottom: '20px'}}>
                                        <dt itemProp="name" style={{fontSize: '1.1rem', fontWeight: '600', color: '#D8FF60', marginBottom: '8px'}}>What are the five most common passwords?</dt>
                                        <dd itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                                            <div itemProp="text" style={{color: '#d1d5db'}}>
                                                The most common (and dangerous) passwords include <strong>123456</strong>, <strong>password</strong>, <strong>qwerty</strong>, <strong>123456789</strong>, and <strong>12345678</strong>. Never use these!
                                            </div>
                                        </dd>
                                    </div>
                                </dl>

                                <div style={{marginTop: '30px', padding: '20px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px'}}>
                                    <h3>🛡️ Additional Security Measures</h3>
                                    <ul style={{color: '#d1d5db', lineHeight: '1.6'}}>
                                        <li><strong>Enable 2FA:</strong> Add an extra layer of security with two-factor authentication</li>
                                        <li><strong>Use a VPN:</strong> Protect your online activity and hide your IP address</li>
                                        <li><strong>Keep software updated:</strong> Regular updates patch security vulnerabilities</li>
                                        <li><strong>Monitor accounts:</strong> Regular check your accounts for suspicious activity</li>
                                        <li><strong>Backup important data:</strong> Regular backups protect against ransomware</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </section>



                {/* Quick Password Generator */}
                <section className="generate-password-instantly-section card">
                    <h2>🎯 Generate a Bulletproof Password</h2>
                    <p>
                        <strong>Create an uncrackable password in seconds.</strong> But remember - even the strongest password won't protect you if your personal information is already being sold online.
                    </p>
                    <button className="generate-password-button" onClick={handleGeneratePassword}>⚡ Generate Strong Password</button>
                    {generatedPassword && (
                        <div className="generated-password-box">
                            <p className="generated-password">{generatedPassword}</p>
                            <button className="copy-button" onClick={handleCopy} aria-label="Copy password to clipboard">
                                <FaCopy />
                            </button>
                        </div>
                    )}
                    {copySuccess && <div className="copy-success">{copySuccess}</div>}
                    {generatedBruteForceTime && (
                        <div className="crack-time-display">
                            <p><strong>Estimated time to crack:</strong> <span className="crack-time">{convertTimeToFun(generatedBruteForceTime)}</span></p>
                        </div>
                    )}
                </section>

                <section className="info-check-section card">
                    <h2>🚨 Your Password Might Not Be Your Biggest Problem</h2>
                    <p><strong>Even with a strong password, your personal information could be for sale right now.</strong></p>
                    <p>Data brokers are legally selling your name, address, phone number, and more to anyone willing to pay. This puts you at risk of identity theft, spam calls, and worse.</p>
                    <p><strong>Enter your name below to see if companies are profiting from your personal data:</strong></p>
                    <form onSubmit={handleFormSubmit}>
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            aria-label="First Name"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            aria-label="Last Name"
                        />
                        <button type="submit" className="check-info-button">🔍 Check If My Info Is For Sale</button>
                    </form>

                </section>
            </main>
        </div>
    );
};

export default PasswordCheckPage;
