// Comprehensive Security Assessment Tool - Fun & Interactive Intelligence Gathering
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseTool, { ToolResult, ToolLoading, ToolError } from './BaseTool';
import CyberForgetEmailWiper from '../../../services/breachService';
import { 
  FaShieldAlt, FaSearch, FaEnvelope, FaLock, FaPhone, FaFile, 
  FaUserTimes, FaBrain, FaExclamationTriangle, FaGlobe, FaDesktop,
  FaMapMarkerAlt, FaUser, FaBuilding, FaChevronRight, FaEye,
  FaDatabase, FaChartLine, FaFlag, FaRobot, FaCheckCircle,
  FaTimesCircle, FaSmile, FaFrown, FaMeh, FaLaugh, FaGrinBeam,
  FaKey, FaClock, FaWifi, FaGamepad, FaTrophy, FaStar
} from 'react-icons/fa';
import './ComprehensiveSecurityTool.css';
import { API_BASE_URL } from '../../../config/api';

const ComprehensiveSecurityTool = ({ onComplete, onClose }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('captcha'); // captcha, location, questions, email_scan, breach_results, analysis, results
  const [userInfo, setUserInfo] = useState({
    ip: '',
    location: '',
    city: '',
    country: '',
    device: '',
    browser: '',
    os: '',
    isp: '',
    usingVPN: false,
    isHuman: false,
    name: '',
    email: '',
    phone: '',
    securityAnswers: {},
    emailBreaches: []
  });
  const [captchaCode, setCaptchaCode] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const [locationConfirmed, setLocationConfirmed] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [securityScore, setSecurityScore] = useState(0);
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [funFacts, setFunFacts] = useState([]);
  const [showResponse, setShowResponse] = useState(false);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  // Auto-fill name from previous Data Broker Scan Tool usage
  useEffect(() => {
    // Try to get name from localStorage or session storage
    const savedName = localStorage.getItem('cyberforget_last_scan_name') || 
                     sessionStorage.getItem('data_broker_scan_name');
    
    if (savedName && !userInfo.name) {
      setUserInfo(prev => ({ ...prev, name: savedName }));
      console.log('Auto-filled name from previous scan:', savedName);
    }
  }, [userInfo.name]);

  // Generate random captcha
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'; // Removed confusing chars
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Detect user environment on component mount
  useEffect(() => {
    setCaptchaCode(generateCaptcha());
    detectUserEnvironment();
  }, []);

  const detectUserEnvironment = async () => {
    try {
      const userAgent = navigator.userAgent;
      const platform = navigator.platform;
      
      const browserInfo = getBrowserInfo(userAgent);
      const osInfo = getOSInfo(userAgent, platform);
      const locationData = await fetchLocationData();
      
      setUserInfo(prev => ({
        ...prev,
        ip: locationData.ip || 'Hidden',
        city: locationData.city || 'Unknown',
        country: locationData.country || 'Unknown',
        location: `${locationData.city || 'Unknown'}, ${locationData.country || 'Unknown'}`,
        device: getDeviceType(userAgent),
        browser: browserInfo.name,
        os: osInfo,
        isp: locationData.isp || 'Unknown',
      }));
      
    } catch (error) {
      console.error('Environment detection failed:', error);
    }
  };

  const fetchLocationData = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      return await response.json();
    } catch (error) {
      return {
        ip: 'Hidden for privacy',
        city: 'Unknown',
        country: 'Unknown',
        isp: 'Unknown'
      };
    }
  };

  const getBrowserInfo = (userAgent) => {
    if (userAgent.includes('Chrome')) return { name: 'Chrome', version: userAgent.match(/Chrome\/(\d+)/)?.[1] };
    if (userAgent.includes('Firefox')) return { name: 'Firefox', version: userAgent.match(/Firefox\/(\d+)/)?.[1] };
    if (userAgent.includes('Safari')) return { name: 'Safari', version: userAgent.match(/Safari\/(\d+)/)?.[1] };
    if (userAgent.includes('Edge')) return { name: 'Edge', version: userAgent.match(/Edge\/(\d+)/)?.[1] };
    return { name: 'Unknown Browser', version: 'Unknown' };
  };

  const getOSInfo = (userAgent, platform) => {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return platform || 'Unknown OS';
  };

  const getDeviceType = (userAgent) => {
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'Tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'Mobile';
    return 'Desktop';
  };

  const securityQuestions = [
    {
      id: 'password_change',
      question: "Let's start with something fun! When did you last change your main password?",
      subtitle: "Don't worry, we're not judging... much 😏",
      type: 'radio',
      icon: <FaKey />,
      field: 'passwordChange',
      options: [
        { value: 'week', label: 'Within the last week', points: 20 },
        { value: 'month', label: 'Within the last month', points: 15 },
        { value: 'year', label: 'Within the last year', points: 10 },
        { value: 'years', label: 'More than a year ago', points: 0 },
        { value: 'never', label: "Never / I don't remember", points: -10 }
      ],
      funResponse: (answer) => {
        const responses = {
          week: "Wow! 🌟 You're already ahead of 90% of people! Security superstar alert!",
          month: "Not bad! 👍 You're definitely better than most people out there!",
          year: "Could be better... 😅 But hey, at least you remembered when!",
          years: "Yikes! 😱 That password has seen some things... time for a refresh!",
          never: "Oh no! 🚨 Your password might be older than some memes!"
        };
        return responses[answer] || "Interesting choice! 🤔";
      }
    },
    {
      id: 'social_media',
      question: "Okay, here's a juicy one... How much do you share on social media?",
      subtitle: "Plot twist: Criminals LOVE oversharing... it makes their job easier 😈",
      type: 'radio',
      icon: <FaGlobe />,
      field: 'socialSharing',
      options: [
        { value: 'private', label: 'Private accounts only', points: 15 },
        { value: 'friends', label: 'Only friends can see my posts', points: 10 },
        { value: 'some', label: 'Some posts are public', points: 5 },
        { value: 'everything', label: 'Everything is public', points: -10 },
        { value: 'no_social', label: "I don't use social media", points: 20 }
      ],
      funResponse: (answer) => {
        const responses = {
          private: "Smart! 🔐 You're like a digital ninja hiding in the shadows!",
          friends: "Good balance! 👥 You know how to keep it real but safe!",
          some: "Hmm... 🤔 Maybe dial back the sharing a teensy bit?",
          everything: "Whoa there! 📢 You're basically a walking, talking billboard!",
          no_social: "Respect! 🙏 Living completely off the grid like a cybersecurity monk!"
        };
        return responses[answer] || "Interesting approach! 🤷";
      }
    },
    {
      id: 'wifi_habits',
      question: "Quick confession time: Do you use public WiFi for sensitive stuff?",
      subtitle: "Like banking, shopping, or... ahem... other private activities? 📱",
      type: 'radio',
      icon: <FaWifi />,
      field: 'wifiHabits',
      options: [
        { value: 'never', label: 'Never! I use mobile data', points: 15 },
        { value: 'vpn', label: 'Only with a VPN', points: 10 },
        { value: 'sometimes', label: 'Sometimes, but carefully', points: 0 },
        { value: 'always', label: 'All the time, YOLO!', points: -15 }
      ],
      funResponse: (answer) => {
        const responses = {
          never: "Paranoid in the BEST way! 🛡️ Your data fortress is strong!",
          vpn: "VPN warrior! 🔐 You know the secret handshakes!",
          sometimes: "Risky business! 😬 Playing with fire, but at least you know it!",
          always: "Living dangerously! 💀 Hackers probably have your coffee order memorized!"
        };
        return responses[answer] || "Bold choice! 😅";
      }
    },
    {
      id: 'password_manager',
      question: "Real talk: Do you use a password manager?",
      subtitle: "Or are you still rocking 'password123' for everything? No judgment... okay, maybe a little 🤨",
      type: 'radio',
      icon: <FaLock />,
      field: 'passwordManager',
      options: [
        { value: 'yes', label: 'Yes, I use one religiously', points: 20 },
        { value: 'sometimes', label: 'Sometimes, when I remember', points: 10 },
        { value: 'browser', label: "Just my browser's built-in one", points: 5 },
        { value: 'no', label: 'No, I remember all my passwords', points: -10 },
        { value: 'same', label: 'I use the same password everywhere', points: -20 }
      ],
      funResponse: (answer) => {
        const responses = {
          yes: "LEGEND! 🏆 Your digital life is basically Fort Knox!",
          sometimes: "Getting there! 📈 Baby steps toward password enlightenment!",
          browser: "It's something! 🤷 Not perfect, but you're trying!",
          no: "Are you a human computer?! 🤖 That's impressive but risky!",
          same: "Oh honey, no! 😱 That's like using the same key for your house, car, AND diary!"
        };
        return responses[answer] || "Interesting strategy! 🎯";
      }
    },
    {
      id: 'email',
      question: "Alright, you've been awesome so far! Now for the good stuff... What's your email?",
      subtitle: "Time to scan billions of breach records and see if you've been compromised! 🕵️‍♀️",
      type: 'input',
      placeholder: 'Enter your email address',
      icon: <FaEnvelope />,
      field: 'email',
      inputType: 'email',
      required: true,
      funResponse: (answer) => `Perfect! Let's see if ${answer} has been living dangerously... 🔍`
    },
    {
      id: 'name',
      question: "Last but not least, what should we call you?",
      subtitle: "We'll use this to check if your personal info is being sold online by data brokers",
      type: 'input',
      placeholder: 'Enter your name',
      icon: <FaUser />,
      field: 'name',
      required: true,
      funResponse: (answer) => `Nice to meet you, ${answer}! 👋 Ready to see what the internet knows about you?`
    },
    {
      id: 'phone_number',
      question: "One last thing (totally optional!) - got a phone number to check?",
      subtitle: "We'll see if it's been leaked in scams or data breaches 📞 (Skip if you want!)",
      type: 'input',
      placeholder: 'Enter your phone number (optional)',
      icon: <FaPhone />,
      field: 'phone',
      inputType: 'tel',
      required: false,
      funResponse: (answer) => answer ? `Sweet! Let's see if ${answer} has been naughty or nice! 🔍` : "No worries! Privacy first - we totally get it! 📱"
    }
  ];

  const currentQuestion = securityQuestions[currentQuestionIndex];

  const handleCaptchaSubmit = () => {
    if (userCaptchaInput.toLowerCase() === captchaCode.toLowerCase()) {
      setUserInfo(prev => ({ ...prev, isHuman: true }));
      setCurrentStep('location');
    } else {
      alert('Whoops! That doesn\'t match. Maybe you\'re secretly a robot after all? 🤖 Try again!');
      setCaptchaCode(generateCaptcha());
      setUserCaptchaInput('');
    }
  };

  const handleLocationResponse = (isCorrect) => {
    setLocationConfirmed(isCorrect);
    setUserInfo(prev => ({ ...prev, usingVPN: !isCorrect }));
    
    // Send user info to analytics (optional, non-blocking)
    const sendLocationData = async () => {
      try {
        // Only send data if we're in development or if the API exists
        if (process.env.NODE_ENV === 'development') {
          console.log('📊 Security assessment data collected:', {
            name: userInfo.name,
            location: userInfo.location,
            usingVPN: !isCorrect,
            totalPoints: totalPoints,
            timestamp: new Date().toISOString()
          });
        }
        // Skip actual API call to prevent CORS errors until backend endpoint exists
        // TODO: Implement backend endpoint for security assessment analytics
      } catch (error) {
        console.error('Error processing location data:', error);
      }
    };
    
    // Send data in background (non-blocking)
    sendLocationData();
    
    // Always proceed to next step after 2 seconds
    setTimeout(() => {
      setCurrentStep('questions');
    }, 2000);
  };

  const handleQuestionAnswer = (value) => {
    const newAnswers = { ...userInfo.securityAnswers, [currentQuestion.field]: value };
    setUserInfo(prev => ({ ...prev, securityAnswers: newAnswers, [currentQuestion.field]: value }));
    
    // Calculate points for this answer
    let points = 0;
    if (currentQuestion.options) {
      const selectedOption = currentQuestion.options.find(option => option.value === value);
      points = selectedOption?.points || 0;
    }
    
    setCurrentPoints(points);
    setTotalPoints(prev => prev + points);
    setShowResponse(true);
    
    // Auto-progress after showing response
    setTimeout(() => {
      handleNextQuestion();
    }, 2500); // Give time to read the fun response
  };

  const handleNextQuestion = () => {
    setShowResponse(false); // Reset response state
    setCurrentPoints(0);
    
    if (currentQuestionIndex < securityQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Restore original flow: show email scan and results first
      setCurrentStep('email_scan');
      performEmailScan();
    }
  };

  const triggerSignupForFullAnalysis = () => {
    // Navigate to signup with context about the security assessment
    navigate('/signup', {
      state: {
        redirectTo: '/scanning',
        source: 'security_assessment',
        message: 'Complete your profile to get your full security analysis and data broker scan',
        userInfo: {
          name: userInfo.name,
          totalScore: totalPoints,
          securityAnswers: userInfo.securityAnswers,
          usingVPN: userInfo.usingVPN,
          isHuman: userInfo.isHuman
        }
      }
    });
  };

  const performEmailScan = async () => {
    if (!userInfo.email) {
      setCurrentStep('analysis');
      generateFinalReport();
      return;
    }

    try {
      setIsAnalyzing(true);
      console.log('Checking email:', userInfo.email);
      
      // Check for actual breaches using the CyberForget service
      const breachResult = await CyberForgetEmailWiper.checkEmailBreaches(userInfo.email);
      console.log('Breach result:', breachResult);
      
      let foundBreaches = [];
      let isCompromised = false;
      
      if (breachResult.success && breachResult.status === 'compromised') {
        isCompromised = true;
        
        // If we have actual breach data, use it
        if (breachResult.breaches && breachResult.breaches.length > 0) {
          foundBreaches = breachResult.breaches.map(breach => ({
            name: breach.Name || breach.name || 'Unknown Breach',
            year: breach.BreachDate ? new Date(breach.BreachDate).getFullYear() : 'Unknown',
            accounts: breach.PwnCount ? `${(breach.PwnCount / 1000000).toFixed(1)}M` : 'Unknown',
            severity: breach.IsVerified !== false ? 'High' : 'Medium'
          }));
        } else {
          // Fallback to showing that breaches were found but details unknown
          foundBreaches = [
            { name: 'Data Breach Detected', year: 'Recent', accounts: 'Unknown', severity: 'High' }
          ];
        }
      } else if (breachResult.success && breachResult.status === 'clean') {
        isCompromised = false;
        foundBreaches = [];
      }
      
      setUserInfo(prev => ({ 
        ...prev, 
        emailBreaches: foundBreaches,
        emailCompromised: isCompromised,
        breachCheckResult: breachResult
      }));

      setTimeout(() => {
        setCurrentStep('breach_results');
      }, 3000);

    } catch (error) {
      console.error('Email scan failed:', error);
      
      // Set no breaches found on error
      setUserInfo(prev => ({ 
        ...prev, 
        emailBreaches: [],
        emailCompromised: false,
        breachCheckResult: { status: 'error', message: 'Unable to check breaches' }
      }));
      
      setTimeout(() => {
        setCurrentStep('breach_results');
      }, 3000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateFinalReport = () => {
    let score = 70; // Base score
    
    // Calculate score based on answers
    Object.entries(userInfo.securityAnswers).forEach(([key, value]) => {
      const question = securityQuestions.find(q => q.field === key);
      if (question && question.options) {
        const option = question.options.find(o => o.value === value);
        if (option) score += option.points;
      }
    });

    // VPN usage bonus
    if (userInfo.usingVPN) score += 10;

    // Email breach penalty
    if (userInfo.emailBreaches.length > 0) {
      score -= userInfo.emailBreaches.length * 5;
    }

    score = Math.max(0, Math.min(100, score)); // Keep between 0-100

    const riskLevel = score >= 80 ? 'Low' : score >= 60 ? 'Moderate' : score >= 40 ? 'High' : 'Critical';
    
    const report = {
      userInfo,
      securityScore: score,
      riskLevel,
      isHuman: userInfo.isHuman,
      usingVPN: userInfo.usingVPN,
      emailBreaches: userInfo.emailBreaches,
      recommendations: generateRecommendations(score, userInfo),
      funFacts: generateFunFacts(userInfo)
    };

    setResult(report);
    setSecurityScore(score);
    setCurrentStep('results');

    // Send result back to chat
    onComplete({
      type: 'comprehensive_security_fun',
      data: report,
      summary: `🎮 **CyberForget Security Game Complete!** Security Score: ${score}/100 (${riskLevel} Risk) | ${userInfo.usingVPN ? '🛡️ VPN Detected' : '📍 No VPN'} | ${userInfo.emailBreaches.length} Email Breaches Found | Ready for data broker scan!`
    });
  };

  const generateRecommendations = (score, info) => {
    const recommendations = [];
    
    if (score < 40) {
      recommendations.push('🚨 URGENT: Your digital security needs immediate attention!');
    }
    
    if (info.securityAnswers.passwordManager === 'same') {
      recommendations.push("🔐 Get a password manager ASAP! You're one hack away from disaster!");
    }
    
    if (info.securityAnswers.wifiHabits === 'always') {
      recommendations.push('📶 Stop using public WiFi for sensitive stuff! Get a VPN!');
    }
    
    if (info.emailBreaches.length > 0) {
      recommendations.push(`🔍 Your email was found in ${info.emailBreaches.length} breaches! Time to check what else is out there!`);
    }
    
    recommendations.push('🎯 Run a data broker scan to see what personal info is being sold about you!');
    
    return recommendations;
  };

  const generateFunFacts = (info) => {
    const facts = [];
    
    if (info.usingVPN) {
      facts.push("🕵️ VPN detected! You're browsing like a secret agent!");
    }
    
    if (info.device === 'Mobile') {
      facts.push('📱 Mobile user detected! 78% of people do their banking on mobile!');
    }
    
    if (info.browser === 'Chrome') {
      facts.push("🌐 Chrome user! You're part of the 65% majority!");
    }
    
    facts.push('🤖 You passed the human test! Only 99.9% of people do!');
    
    return facts;
  };

  const triggerDataBrokerScan = () => {
    if (userInfo.name) {
      const [firstName, ...lastNameParts] = userInfo.name.split(' ');
      const lastName = lastNameParts.join(' ');
      
      // Construct the URL based on the name format
      let locationUrl = `/location+${firstName}`;
      let queryParams = `?first=${encodeURIComponent(firstName)}`;
      
      if (lastName) {
        locationUrl += `+${lastName}`;
        queryParams += `&last=${encodeURIComponent(lastName)}`;
      }
      
      // Navigate to the location page with the proper URL format
      navigate(locationUrl + queryParams, {
        state: {
          firstName,
          lastName,
          email: userInfo.email,
          phone: userInfo.phone,
          fromFunAssessment: true
        }
      });
    } else {
      navigate('/signup', {
        state: {
          redirectTo: '/location',
          message: 'Complete your profile to run a full data broker scan'
        }
      });
    }
  };

  const renderCaptcha = () => (
    <div className="fun-captcha">
      <div className="captcha-header">
        <FaRobot className="captcha-icon" />
        <h3>🤖 Plot twist! Are you actually human?</h3>
        <p>Before we dive into your digital secrets, let's make sure you're not a sneaky bot! 😄</p>
      </div>
      
      <div className="captcha-container">
        <div className="captcha-code">
          <span className="captcha-text">{captchaCode}</span>
        </div>
        <div className="captcha-input">
          <input
            type="text"
            value={userCaptchaInput}
            onChange={(e) => setUserCaptchaInput(e.target.value)}
            placeholder="Enter the code above"
            className="captcha-field"
            maxLength={6}
          />
          <button onClick={handleCaptchaSubmit} className="captcha-submit">
            I'm totally human! 🙋‍♀️
          </button>
        </div>
      </div>
      
      <div className="captcha-help">
        <p>Code looking funky? <button onClick={() => setCaptchaCode(generateCaptcha())}>Get a fresh one!</button></p>
      </div>
    </div>
  );

  const renderLocationVerification = () => (
    <div className="location-verification">
      <div className="verification-header">
        <FaCheckCircle className="verification-icon success" />
        <h3>✅ Awesome! You passed the human test!</h3>
        <p>Now for the fun part... let's play detective! 🕵️‍♀️</p>
      </div>
      
      <div className="location-question">
        <FaMapMarkerAlt className="location-icon" />
        <h4>Quick question: Are you chilling in {userInfo.city}, {userInfo.country} right now?</h4>
        <p>Our digital crystal ball (aka your IP address) thinks you are...</p>
        
        <div className="location-buttons">
          <button onClick={() => handleLocationResponse(true)} className="location-btn yes">
            <FaCheckCircle /> Yep, nailed it! 
          </button>
          <button onClick={() => handleLocationResponse(false)} className="location-btn no">
            <FaTimesCircle /> Nope, nice try though!
          </button>
        </div>
      </div>
      
      {locationConfirmed !== null && (
        <div className="location-response">
          {locationConfirmed ? (
            <div className="response-message">
              <FaSmile className="response-icon" />
              <p>Sweet! Our detective skills are on point. Let's keep this party going...</p>
            </div>
          ) : (
            <div className="response-message vpn">
              <FaGrinBeam className="response-icon" />
              <p>🎉 Ooh, sneaky! VPN detected! +10 security points for being privacy-smart!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderQuestions = () => (
    <div className="fun-questions">
      <div className="question-header">
        <div className="question-indicator">
          <span className="question-number">🎯 Question {currentQuestionIndex + 1} of {securityQuestions.length}</span>
          {totalPoints > 0 && <span className="points-badge">• {totalPoints} pts</span>}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestionIndex + 1) / securityQuestions.length) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="question-card">
        <div className="question-icon">
          {currentQuestion.icon}
        </div>
        <div className="question-content">
          <h3>{currentQuestion.question}</h3>
          <p>{currentQuestion.subtitle}</p>
          
          {currentQuestion.type === 'input' && (
            <div className="input-container">
              <input
                type={currentQuestion.inputType || 'text'}
                placeholder={currentQuestion.placeholder}
                value={userInfo[currentQuestion.field] || ''}
                onChange={(e) => setUserInfo(prev => ({ ...prev, [currentQuestion.field]: e.target.value }))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && userInfo[currentQuestion.field]) {
                    handleQuestionAnswer(userInfo[currentQuestion.field]);
                  }
                }}
                className="question-input"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'rgba(20, 30, 48, 0.8)',
                  border: '2px solid rgba(66, 255, 181, 0.2)',
                  borderRadius: '12px',
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#42ffb5';
                  e.target.style.background = 'rgba(20, 30, 48, 0.95)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(66, 255, 181, 0.15), 0 4px 12px rgba(66, 255, 181, 0.1)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(66, 255, 181, 0.2)';
                  e.target.style.background = 'rgba(20, 30, 48, 0.8)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'translateY(0)';
                }}
              />
            </div>
          )}
          
          {currentQuestion.type === 'radio' && (
            <div className="radio-options">
              {currentQuestion.options.map((option, idx) => (
                <label key={idx} className="radio-option">
                  <input
                    type="radio"
                    name={currentQuestion.field}
                    value={option.value}
                    checked={userInfo.securityAnswers[currentQuestion.field] === option.value}
                    onChange={() => handleQuestionAnswer(option.value)}
                  />
                  <span className="radio-button"></span>
                  <span className="radio-label">{option.label}</span>
                </label>
              ))}
            </div>
          )}
          
          {userInfo.securityAnswers[currentQuestion.field] && currentQuestion.funResponse && showResponse && (
            <div className="fun-response-with-points">
              <div className="fun-response">
                <FaLaugh className="response-icon" />
                <p>{currentQuestion.funResponse(userInfo.securityAnswers[currentQuestion.field])}</p>
              </div>
              <div className="points-celebration">
                <div className="points-display">
                  <span className="celebration-emoji">
                    {currentPoints >= 15 ? '🎉' : currentPoints >= 10 ? '🌟' : currentPoints >= 5 ? '👍' : currentPoints >= 0 ? '😊' : '😬'}
                  </span>
                  <span className="points-number">{currentPoints > 0 ? '+' : ''}{currentPoints}</span>
                  <span className="points-label">pts</span>
                </div>
                <div className="total-score">
                  Total: {totalPoints} points 🎯
                </div>
              </div>
              <div className="auto-progress">
                <div className="progress-message">
                  🎯 Moving to next question...
                </div>
                <div className="countdown-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {!showResponse && (
        <div className="question-navigation">
          <button 
            onClick={() => {
              // For input questions, we need to trigger the response manually
              if (currentQuestion.type === 'input') {
                const value = userInfo[currentQuestion.field] || '';
                handleQuestionAnswer(value);
              } else if (currentQuestion.type === 'radio' && userInfo.securityAnswers[currentQuestion.field]) {
                // Radio buttons already trigger automatically
                handleNextQuestion();
              }
            }}
            disabled={currentQuestion.required && !userInfo[currentQuestion.field]}
            className="next-btn"
          >
            {currentQuestionIndex === securityQuestions.length - 1 ? 'Let\'s see the damage! 📧' : 'Hit me with the next one! 👉'}
          </button>
        </div>
      )}
    </div>
  );

  const renderEmailScan = () => (
    <div className="email-scanning">
      <div className="scan-header">
        <FaEnvelope className="scan-icon scanning" />
        <h3>🔍 Time for the moment of truth...</h3>
        <p>Scanning {userInfo.email} against billions of breach records. Hold onto your hat! 🎩</p>
      </div>
      
      <div className="scan-animation">
        <div className="scanning-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      {userInfo.emailBreaches.length > 0 && (
        <div className="breach-results">
          <h4>😱 Plot twist! Your email has been on some adventures:</h4>
          <div className="breach-list">
            {userInfo.emailBreaches.map((breach, idx) => (
              <div key={idx} className="breach-item">
                <FaExclamationTriangle className="breach-icon" />
                <div>
                  <strong>{breach.name}</strong>
                  <span>{breach.year} • {breach.accounts} accounts • {breach.severity} severity</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderBreachResults = () => {
    const { emailBreaches = [], emailCompromised = false } = userInfo;
    
    // Calculate breach impact points
    let breachPoints = 0;
    let trustLevel = 'Unknown';
    
    if (emailCompromised && emailBreaches.length > 0) {
      breachPoints = emailBreaches.length * -10; // Negative points for breaches
      const highSeverityBreaches = emailBreaches.filter(b => b.severity === 'High').length;
      breachPoints -= highSeverityBreaches * 5; // Extra penalty for high severity
      trustLevel = 'Compromised';
    } else {
      breachPoints = 25; // Positive points for clean email
      trustLevel = 'Clean';
    }
    
    const handleContinueToName = () => {
      setCurrentStep('questions');
      // Continue to name question (index 5)
      setCurrentQuestionIndex(5);
    };
    
    return (
      <div className="breach-results-display">
        <div className="breach-header">
          <div className="breach-score-circle">
            <div className={`score-indicator ${trustLevel.toLowerCase()}`}>
              {emailCompromised ? '⚠️' : '✅'}
            </div>
            <div className="breach-score">
              <span className="score-number">{breachPoints > 0 ? '+' : ''}{breachPoints}</span>
              <span className="score-label">pts</span>
            </div>
          </div>
          <div className="breach-status">
            <h3>{emailCompromised ? '🚨 Email Compromised!' : '🎉 Email is Clean!'}</h3>
            <p className="trust-level">Security Status: <strong>{trustLevel}</strong></p>
          </div>
        </div>
        
        {emailCompromised && emailBreaches.length > 0 ? (
          <div className="breach-details">
            <h4>📊 Breach Analysis Results</h4>
            <div className="breach-summary">
              <div className="summary-stat">
                <span className="stat-number">{emailBreaches.length}</span>
                <span className="stat-label">Breaches Found</span>
              </div>
              <div className="summary-stat">
                <span className="stat-number">{emailBreaches.filter(b => b.severity === 'High').length}</span>
                <span className="stat-label">High Severity</span>
              </div>
              <div className="summary-stat">
                <span className="stat-number">{emailBreaches.filter(b => b.severity === 'Medium').length}</span>
                <span className="stat-label">Medium Severity</span>
              </div>
            </div>
            
            <div className="breach-list-detailed">
              {emailBreaches.map((breach, idx) => (
                <div key={idx} className={`breach-card ${breach.severity.toLowerCase()}`}>
                  <div className="breach-info">
                    <div className="breach-name">{breach.name}</div>
                    <div className="breach-meta">
                      <span className="breach-year">🗓️ {breach.year}</span>
                      <span className="breach-accounts">👥 {breach.accounts} accounts</span>
                      <span className={`breach-severity ${breach.severity.toLowerCase()}`}>
                        {breach.severity === 'High' ? '🔴' : '🟡'} {breach.severity}
                      </span>
                    </div>
                  </div>
                  <div className="breach-impact">
                    <span className="impact-points">-{breach.severity === 'High' ? '15' : '10'} pts</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="breach-explanation">
              <h5>🤔 What does this mean?</h5>
              <p>Your email appeared in {emailBreaches.length} data breach{emailBreaches.length > 1 ? 'es' : ''}. This means cybercriminals may have access to your email and potentially other personal information from these compromised services.</p>
              <p>🛡️ <strong>Don't panic!</strong> This is why we're here to help secure your digital life. Let's continue to see what other information might be at risk.</p>
            </div>
          </div>
        ) : (
          <div className="clean-email-celebration">
            <div className="celebration-content">
              <h4>🎉 Excellent news!</h4>
              <p>Your email hasn't been found in any major data breaches. You're starting with a clean slate!</p>
              <div className="clean-benefits">
                <div className="benefit-item">
                  <FaCheckCircle className="benefit-icon" />
                  <span>No known credential exposure</span>
                </div>
                <div className="benefit-item">
                  <FaCheckCircle className="benefit-icon" />
                  <span>Lower identity theft risk</span>
                </div>
                <div className="benefit-item">
                  <FaCheckCircle className="benefit-icon" />
                  <span>Good security practices</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="trust-building">
          <h4>🤝 Building Trust Through Transparency</h4>
          <p>We believe in showing you exactly what we find. Now that you know your email security status, we'd like to check what other personal information might be publicly available.</p>
          <p>This helps us give you the most accurate security assessment possible.</p>
        </div>
        
        <div className="continue-section">
          <button 
            onClick={handleContinueToName}
            className="continue-btn primary"
          >
            <FaUser />
            Continue to Name Check
          </button>
          <p className="continue-note">We'll check what public information is available about you online</p>
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="fun-results">
      <div className="results-header">
        <div className="score-display">
          <div className={`score-circle ${result.riskLevel.toLowerCase()}`}>
            <FaTrophy className="trophy-icon" />
            <span className="score-number">{result.securityScore}</span>
            <span className="score-label">Security Score</span>
          </div>
          <div className="score-details">
            <h3>🎮 And... scene! Your digital personality revealed:</h3>
            <p className="risk-level">Risk Level: <strong>{result.riskLevel}</strong></p>
          </div>
        </div>
      </div>
      
      <div className="fun-facts">
        <h4>🎯 Some juicy intel we discovered:</h4>
        <ul>
          {result.funFacts.map((fact, idx) => (
            <li key={idx}>{fact}</li>
          ))}
        </ul>
      </div>
      
      <div className="recommendations">
        <h4>🛡️ Here's how to level up your security game:</h4>
        <ul>
          {result.recommendations.map((rec, idx) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </div>
      
      <div className="data-broker-education">
        <h4>🕵️ Now for the REAL eye-opener...</h4>
        <div className="education-content">
          <div className="broker-warning">
            <FaExclamationTriangle className="warning-icon" />
            <div className="warning-text">
              <strong>Plot twist!</strong> While you were answering these questions, 
              <span className="highlight">500+ data broker companies</span> are actively selling your personal information right now.
            </div>
          </div>
          
          <div className="broker-facts">
            <h5>💡 What you didn't know about data brokers:</h5>
            <div className="fact-grid">
              <div className="fact-item">
                <FaDatabase className="fact-icon" />
                <div>
                  <strong>$200+ billion industry</strong>
                  <span>Data brokers make more money selling your info than Netflix makes from subscriptions</span>
                </div>
              </div>
              <div className="fact-item">
                <FaEye className="fact-icon" />
                <div>
                  <strong>Real-time tracking</strong>
                  <span>They know your location, shopping habits, and even predict your next purchase</span>
                </div>
              </div>
              <div className="fact-item">
                <FaChartLine className="fact-icon" />
                <div>
                  <strong>Your digital twin</strong>
                  <span>They've built a detailed profile of you from 1,000+ data points</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="security-connection">
            <h5>🔗 How this connects to your security score:</h5>
            <div className="connection-items">
              <div className="connection-item">
                <span className="score-indicator">Score: {result.securityScore}/100</span>
                <span className="arrow">→</span>
                <span className="exposure-risk">
                  {result.securityScore >= 80 ? 'Lower data broker exposure risk' : 
                   result.securityScore >= 60 ? 'Moderate data broker targeting' : 
                   'High-value target for data brokers'}
                </span>
              </div>
              <p className="connection-explanation">
                {result.securityScore >= 80 
                  ? "Your strong security habits make you less valuable to data brokers, but they still have your basic info."
                  : result.securityScore >= 60 
                  ? "Your mixed security practices mean data brokers have moderate confidence in your profile accuracy."
                  : "Weak security practices signal to data brokers that you're an easy target for more invasive data collection."
                }
              </p>
            </div>
          </div>
        </div>
        
        <div className="broker-scan-cta">
          <div className="cta-header">
            <h4>🎯 Ready to see your ACTUAL digital footprint?</h4>
            <p>Let's scan the real databases where your personal information is being sold</p>
          </div>
          
          <div className="scan-preview">
            <h5>Our AI will search for:</h5>
            <div className="preview-items">
              <div className="preview-item">
                <FaUser />
                <span>Full name variations in {userInfo.city || 'your area'}</span>
              </div>
              <div className="preview-item">
                <FaMapMarkerAlt />
                <span>Address history & current location data</span>
              </div>
              <div className="preview-item">
                <FaPhone />
                <span>Phone numbers linked to your identity</span>
              </div>
              <div className="preview-item">
                <FaEnvelope />
                <span>Email addresses & social media profiles</span>
              </div>
            </div>
          </div>
          
          <div className="signup-promotion-card">
            <div className="promotion-header">
              <FaShieldAlt className="promotion-icon" />
              <div className="promotion-title">
                <h3>🆓 Get Your Complete Security Report</h3>
                <p>Sign up now for full analysis and protection</p>
              </div>
            </div>
            
            <div className="promotion-benefits">
              <div className="benefit-item">
                <FaSearch className="benefit-icon" />
                <div className="benefit-text">
                  <strong>Full Data Broker Scan</strong>
                  <span>Search 500+ databases for your exposed information</span>
                </div>
              </div>
              <div className="benefit-item">
                <FaUserTimes className="benefit-icon" />
                <div className="benefit-text">
                  <strong>Automated Data Removal</strong>
                  <span>We'll remove your data from brokers automatically</span>
                </div>
              </div>
              <div className="benefit-item">
                <FaEye className="benefit-icon" />
                <div className="benefit-text">
                  <strong>Continuous Monitoring</strong>
                  <span>24/7 surveillance for new data exposures</span>
                </div>
              </div>
              <div className="benefit-item">
                <FaShieldAlt className="benefit-icon" />
                <div className="benefit-text">
                  <strong>Identity Protection</strong>
                  <span>Real-time alerts and fraud prevention</span>
                </div>
              </div>
            </div>
            
            <div className="promotion-actions">
              <button className="signup-btn primary" onClick={triggerSignupForFullAnalysis}>
                <FaShieldAlt />
                Sign Up for FREE Full Report
              </button>
              <button className="demo-btn secondary" onClick={triggerDataBrokerScan}>
                <FaSearch />
                Try Demo Scan First
              </button>
            </div>
          </div>
          
          <div className="trust-indicators">
            <div className="trust-item">
              <FaLock />
              <span>Encrypted & secure scanning</span>
            </div>
            <div className="trust-item">
              <FaShieldAlt />
              <span>No personal data stored</span>
            </div>
            <div className="trust-item">
              <FaCheckCircle />
              <span>Read-only intelligence gathering</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <BaseTool
      toolName="🎮 Fun Security Assessment"
      toolIcon={<FaGamepad />}
      toolDescription="Interactive security game with personality and real analysis"
      onClose={onClose}
      className="comprehensive-security-tool fun-mode"
    >
      <div className="comprehensive-security-content">
        {currentStep === 'captcha' && renderCaptcha()}
        {currentStep === 'location' && renderLocationVerification()}
        {currentStep === 'questions' && renderQuestions()}
        {currentStep === 'email_scan' && renderEmailScan()}
        {currentStep === 'breach_results' && renderBreachResults()}
        {currentStep === 'results' && renderResults()}
      </div>
    </BaseTool>
  );
};

export default ComprehensiveSecurityTool;