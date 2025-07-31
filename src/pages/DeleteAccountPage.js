import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import sites from '../sites-enhanced.json';
import './DeleteAccountPage.css';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaExternalLinkAlt,
  FaClock,
  FaShieldAlt,
  FaList,
  FaQuestionCircle
} from 'react-icons/fa';
import MobileNavbar from '../components/MobileNavbar';
import Navbar from '../components/Navbar';

const difficultyIcons = {
  easy: <FaCheckCircle color="#28a745" aria-label="Easy" />,
  medium: <FaInfoCircle color="#ffc107" aria-label="Medium" />,
  hard: <FaExclamationTriangle color="#dc3545" aria-label="Hard" />,
  impossible: <FaExclamationTriangle color="#dc3545" aria-label="Impossible" />
};

const languages = {
  en: { name: 'English', flag: '🇬🇧' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  pt_br: { name: 'Português', flag: '🇧🇷' },
  cat: { name: 'Català', flag: '🏴󠁥󠁳󠁣󠁴󠁿' },
  pl: { name: 'Polski', flag: '🇵🇱' },
  ar: { name: 'العربية', flag: '🇸🇦' }
};

const DeleteAccountPage = () => {
  const [language, setLanguage] = useState('en');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeFaq, setActiveFaq] = useState(null);
  const pageRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get site data first
  const siteName = decodeURIComponent(location.pathname)
    .split('how-to-delete-my-account-on-')[1]
    .replace(/-/g, '.')
    .toLowerCase();

  const site = sites.find(s => 
    s.name && 
    s.name.toLowerCase().replace(/[^a-z0-9]/g, '') === siteName.replace(/[^a-z0-9]/g, '')
  );

  // Only keep the mobile resize handler
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add renderSteps function
  const renderSteps = () => {
    if (!site?.steps) return null;
    
    const currentSteps = site.steps[language] || site.steps.en || [];
    
    return (
      <div className="steps-section">
        <h2>Step-by-Step Instructions</h2>
        <div className="steps-list">
          {currentSteps.map((step, index) => (
            <div key={index} className="step-item">
              <span className="step-number">{index + 1}</span>
              <span className="step-text">{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!site) {
    return (
      <div className="page-container">
        {isMobile ? <MobileNavbar /> : <Navbar />}
        <div className="delete-account-page">
          <h1>Site Not Found</h1>
          <p>The site you are looking for does not exist or has incomplete information.</p>
          <Link to="/delete-account" className="back-link">← Back to Delete Account Main Page</Link>
        </div>
      </div>
    );
  }

  const { 
    name, 
    difficulty, 
    notes = '', 
    email, 
    url,
    category,
    monthly_users,
    founded_year,
    deletion_type,
    account_recovery_period,
    data_retention_period,
    alternatives = [],
    required_for_deletion = [],
    deletion_impact = [],
    steps = {},
    faqs = [],
    last_verified,
    status,
    gdpr_compliant,
    ccpa_compliant
  } = site;

  const sitePath = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  // Get available languages for this site
  const availableLanguages = Object.keys(languages).filter(lang => 
    site[`notes_${lang}`] || (lang === 'en' && site.notes)
  );

  // Determine difficulty based on the type
  let currentDifficulty = typeof difficulty === 'string' ? difficulty : (difficulty?.[language] || difficulty?.en || 'unknown');
  const difficultyKey = currentDifficulty.toLowerCase();

  // Get the appropriate note for the current language
  const currentNote = site[`notes_${language}`] || site.notes;
  const currentSteps = steps[language] || steps.en || [];

  // Schema.org structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Delete ${name}`,
    "description": `Learn how to delete your ${name} account with our comprehensive guide.`,
    "totalTime": "PT10M",
    "step": currentSteps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "text": step
    }))
  };

  return (
    <div className="page-container" ref={pageRef}>
      <Helmet>
        <title>How to Delete {name}</title>
        <meta 
          name="description" 
          content={`Learn how to delete your ${name} account with our comprehensive step-by-step guide.`} 
        />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      {isMobile ? <MobileNavbar /> : <Navbar />}

      <div className="global-content-wrapper">
        <div className="delete-account-page">
          <div className="language-flags">
            {availableLanguages.map(lang => (
              <button
                key={lang}
                className={`flag-button ${lang === language ? 'active' : ''}`}
                onClick={() => setLanguage(lang)}
                title={languages[lang].name}
              >
                <span className="flag">{languages[lang].flag}</span>
              </button>
            ))}
          </div>

          <div className="page-header">
            <h1>
              How to Delete {name}
            </h1>
            <div className="difficulty-indicator">
              {difficultyIcons[difficultyKey] || null}
              <span>{currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}</span>
            </div>
            
            {status && last_verified && (
              <div className={`status-badge ${status}`}>
                <FaClock /> Last Verified: {new Date(last_verified).toLocaleDateString()}
              </div>
            )}
          </div>

          <div className="service-info">
            {category && <div className="info-item"><strong>Category:</strong> {category}</div>}
            {monthly_users && <div className="info-item"><strong>Monthly Users:</strong> {monthly_users}</div>}
            {founded_year && <div className="info-item"><strong>Founded:</strong> {founded_year}</div>}
          </div>

          {url && (
            <div className="delete-account-button-container">
              <a href={url} target="_blank" rel="noopener noreferrer" className="delete-account-button">
                Go to Delete Account Page
                <FaExternalLinkAlt className="external-link-icon" />
              </a>
            </div>
          )}

          {renderSteps()}

          {required_for_deletion.length > 0 && (
            <div className="requirements-section">
              <h2>Requirements for Deletion</h2>
              <ul className="requirements-list">
                {required_for_deletion.map((req, index) => (
                  <li key={index}>
                    <FaCheckCircle className="requirement-icon" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {deletion_impact.length > 0 && (
            <div className="impact-section">
              <h2>What Happens After Deletion</h2>
              <ul className="impact-list">
                {deletion_impact.map((impact, index) => (
                  <li key={index}>
                    <FaExclamationTriangle className="impact-icon" />
                    {impact}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {currentNote && (
            <div className="notes-section">
              <h2>Important Information</h2>
              <p>{currentNote}</p>
            </div>
          )}

          <div className="data-retention-info">
            {account_recovery_period && (
              <div className="info-card">
                <FaClock className="info-icon" />
                <h3>Account Recovery Period</h3>
                <p>{account_recovery_period}</p>
              </div>
            )}
            {data_retention_period && (
              <div className="info-card">
                <FaShieldAlt className="info-icon" />
                <h3>Data Retention Period</h3>
                <p>{data_retention_period}</p>
              </div>
            )}
          </div>

          {alternatives.length > 0 && (
            <div className="alternatives-section">
              <h2>Alternative Services</h2>
              <div className="alternatives-grid">
                {alternatives.map((alt, index) => (
                  <div key={index} className="alternative-card">
                    {alt}
                  </div>
                ))}
              </div>
            </div>
          )}

          {faqs.length > 0 && (
            <div className="faq-section">
              <h2>Frequently Asked Questions</h2>
              {faqs.map((faq, index) => (
                <details 
                  key={index}
                  className="faq-item"
                  open={activeFaq === index}
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <summary>
                    <FaQuestionCircle className="faq-icon" />
                    {faq.question}
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          )}

          <div className="compliance-section">
            {(gdpr_compliant || ccpa_compliant) && (
              <div className="compliance-badges">
                {gdpr_compliant && (
                  <div className="compliance-badge gdpr">
                    <FaShieldAlt /> GDPR Compliant
                  </div>
                )}
                {ccpa_compliant && (
                  <div className="compliance-badge ccpa">
                    <FaShieldAlt /> CCPA Compliant
                  </div>
                )}
              </div>
            )}
          </div>

          {email && (
            <div className="contact-support">
              <h2>Need Help?</h2>
              <p>If you're having trouble deleting your account, please contact support:</p>
              <a href={`mailto:${email}`} className="support-button">
                Contact Support
              </a>
            </div>
          )}

          <Link to="/delete-account" className="back-link">← Back to Delete Account Main Page</Link>
        </div>
      </div>
    </div>
  );
};

export default memo(DeleteAccountPage);
