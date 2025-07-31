import React, { useState, useEffect } from 'react';
import {
  FaShieldAlt,
  FaHome,
  FaRoad,
  FaTree,
  FaPaintRoller,
  FaTools,
  FaQuestion,
  FaMoneyBill,
  FaClock,
  FaIdCard,
  FaPhone,
  FaExclamationTriangle
} from 'react-icons/fa';
import '../styles/DoorStepProtectionPage.css';

// Get API key from environment variables
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const DoorStepProtectionPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [location, setLocation] = useState({ city: '', country: '' });
  const [loading, setLoading] = useState(false);

  // Get user's location when component mounts
  useEffect(() => {
    const getLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setLocation({
          city: data.city || 'Unknown City',
          country: data.country_name || 'Unknown Country'
        });
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };
    getLocation();
  }, []);

  // All questions with their options
  const steps = [
    {
      question: 'What did they say needs fixing?',
      subtext: 'Many scammers claim urgent repairs are needed.',
      options: [
        { text: 'They said the roof needs fixing', icon: <FaHome /> },
        { text: 'Something about the driveway or paths', icon: <FaRoad /> },
        { text: 'Garden work or tree cutting', icon: <FaTree /> },
        { text: 'House needs painting', icon: <FaPaintRoller /> },
        { text: 'General repairs or maintenance', icon: <FaTools /> },
        { text: 'Something else', icon: <FaQuestion /> }
      ]
    },
    {
      question: 'How did they ask for payment?',
      subtext: 'Be careful if they demand immediate payment.',
      options: [
        { text: 'They want cash right now', icon: <FaMoneyBill /> },
        { text: 'Asked for bank transfer', icon: <FaMoneyBill /> },
        { text: 'Offered a payment plan', icon: <FaMoneyBill /> },
        { text: 'Gave a written quote first', icon: <FaMoneyBill /> }
      ]
    },
    {
      question: 'Are they rushing you to decide?',
      subtext: 'Pressure to decide quickly is often a warning sign.',
      options: [
        { text: 'Yes - must be done today', icon: <FaClock /> },
        { text: "Offering 'special price today only'", icon: <FaClock /> },
        { text: "Said they're working nearby", icon: <FaClock /> },
        { text: "No - they're not rushing me", icon: <FaClock /> }
      ]
    },
    {
      question: 'Did they show proper identification?',
      subtext: 'Legitimate traders will have clear ID or credentials.',
      options: [
        { text: 'No ID shown', icon: <FaIdCard /> },
        { text: 'Showed something unclear', icon: <FaIdCard /> },
        { text: 'Had company van/uniform', icon: <FaIdCard /> },
        { text: 'Proper business documents', icon: <FaIdCard /> }
      ]
    }
  ];

  // Helper function to get country-specific contacts
  const getLocalContactsByCountry = (country) => {
    const contacts = {
      'United Kingdom': [
        { name: "Police (non-emergency)", number: "101", why: "Report suspicious traders" },
        { name: "Age UK Advice Line", number: "0800 678 1602", why: "Get advice and support" },
        { name: "Trading Standards", number: "0808 223 1133", why: "Report rogue traders" }
      ],
      'default': [
        { name: "Local Police", number: "Check local directory", why: "Report suspicious activity" },
        { name: "Consumer Protection", number: "Check local directory", why: "Get advice on your rights" }
      ]
    };
    return contacts[country] || contacts.default;
  };

  const handleAnswer = async (answer) => {
    const newAnswers = {
      ...answers,
      [currentStep]: answer
    };
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setAnswers(newAnswers);
    } else {
      setLoading(true);
      try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `
                  Based on these answers about a potential doorstep scam in ${location.city}, ${location.country}:
                  Work Type: ${newAnswers[0]}
                  Payment Method: ${newAnswers[1]}
                  Pressure Tactics: ${newAnswers[2]}
                  ID Shown: ${newAnswers[3]}

                  Create a personalized safety plan in this JSON format:
                  {
                    "riskLevel": "high/medium/low",
                    "summary": "Brief situation summary",
                    "specificWarnings": [
                      "Warning specific to the work type and payment method"
                    ],
                    "immediateActions": [
                      "Immediate steps based on answers"
                    ],
                    "localContacts": [
                      {
                        "name": "Relevant local authority name",
                        "number": "Contact number",
                        "why": "Why you should contact them"
                      }
                    ]
                  }
                  Focus on local authorities and resources in ${location.city}, ${location.country}.
                  Keep language clear and simple for elderly readers.
                `
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          })
        });

        if (!response.ok) throw new Error('Gemini API call failed');

        const data = await response.json();
        const geminiAnalysis = JSON.parse(data.candidates[0].content.parts[0].text);
        setAnalysis(geminiAnalysis);
        setShowResults(true);
      } catch (error) {
        console.error('Error:', error);
        // Fallback analysis
        const fallbackAnalysis = {
          riskLevel: "medium",
          summary: `Potential scam involving ${newAnswers[0].toLowerCase()} in ${location.city}`,
          specificWarnings: [
            `Be cautious of unsolicited ${newAnswers[0].toLowerCase()} offers`,
            newAnswers[1].includes("cash") ? "Never pay cash upfront" : "Always get proper documentation",
            newAnswers[2].includes("today") ? "Don't be rushed into decisions" : "Take time to verify credentials"
          ],
          immediateActions: [
            "1. Don't make any decisions today",
            "2. Talk to a family member or friend",
            "3. Get written quotes from other companies",
            "4. Ask for proper business documents",
            newAnswers[1].includes("cash") ? "5. Never pay cash upfront" : "5. Insist on proper payment documentation"
          ],
          localContacts: getLocalContactsByCountry(location.country)
        };
        setAnalysis(fallbackAnalysis);
        setShowResults(true);
      } finally {
        setLoading(false);
      }
    }
  };

  // Render results page
  if (showResults && analysis) {
    return (
      <div className="doorstep-protection-page">
        <div className="protection-header">
          <FaShieldAlt className="shield-icon" />
          <h1>Your Safety Action Plan</h1>
        </div>

        <div className="safety-plan">
          <div className={`risk-level ${analysis.riskLevel}`}>
            <FaExclamationTriangle className="risk-icon" />
            <h2>
              {analysis.riskLevel === "high" 
                ? "⚠️ Important: Take Care!" 
                : "✓ Follow These Steps"}
            </h2>
          </div>

          <div className="summary-section">
            <h3>Situation Summary</h3>
            <p>{analysis.summary}</p>
          </div>

          <div className="warnings-section">
            <h3>Important Warnings</h3>
            {analysis.specificWarnings.map((warning, index) => (
              <div key={index} className="warning-card">
                <span className="warning-icon">⚠️</span>
                <p>{warning}</p>
              </div>
            ))}
          </div>

          <div className="actions-section">
            <h3>What To Do Now:</h3>
            <div className="action-steps">
              {analysis.immediateActions.map((action, index) => (
                <div key={index} className="action-step">
                  {action}
                </div>
              ))}
            </div>
          </div>

          <div className="help-contacts">
            <h3>Need Help? Free Numbers to Call:</h3>
            <div className="contact-buttons">
              {analysis.localContacts.map((contact, index) => (
                <a 
                  key={index}
                  href={`tel:${contact.number}`}
                  className="contact-button"
                >
                  <FaPhone />
                  <div className="contact-info">
                    <strong>{contact.name}</strong>
                    <span>{contact.number}</span>
                    <small>{contact.why}</small>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the question steps or final JSON
  const currentStepData = steps[currentStep];
  const isFinal = analysis !== null; // If we have a Gemini JSON, we’re done

  return (
    <div className="doorstep-protection-page">
      <div className="protection-header">
        <FaShieldAlt className="shield-icon" />
        <h1>Doorstep Safety Guide</h1>
        <p style={{ fontSize: '1.1rem' }}>
          Answer these quick questions to get a custom plan of action. 
        </p>
      </div>

      {/* If done, show final JSON plan */}
      {isFinal ? (
        <div className="json-report">
          <h3>AI Plan of Action (JSON)</h3>
          <pre>
            {JSON.stringify(analysis, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="question-section">
          <div className="question-progress">
            Step {currentStep + 1} of {steps.length}
          </div>

          <h2>{currentStepData.question}</h2>
          <p className="question-subtext">{currentStepData.subtext}</p>

          <div className="options-list">
            {currentStepData.options.map((option, idx) => (
              <button
                key={idx}
                className="option-button"
                onClick={() => handleAnswer(option.text)}
              >
                <span className="option-icon">{option.icon}</span>
                <span className="option-text">{option.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Show a "thinking" or loading indicator if calling Gemini */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner">⏳</div>
          <p>Generating your custom plan, please wait...</p>
        </div>
      )}
    </div>
  );
};

export default DoorStepProtectionPage;
