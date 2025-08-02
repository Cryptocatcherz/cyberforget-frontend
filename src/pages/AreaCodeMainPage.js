import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FaShieldAlt, FaExternalLinkAlt, FaPhoneAlt, FaExclamationTriangle, FaMapMarkedAlt, FaBuilding, FaSearch, FaUserShield, FaEye } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';
import './AreaCodeMainPage.css';
import areaCodesData from '../data/area-codes.json';
const { areaCodes } = areaCodesData;

const AreaCodeMainPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = "US Area Code Lookup - Protect Yourself from Phone Scams";
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCodes, setFilteredCodes] = useState(areaCodes);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showDataBrokerCTA, setShowDataBrokerCTA] = useState(false);
  const [displayedCodes, setDisplayedCodes] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // High-risk area codes commonly used in scams
  const highRiskAreaCodes = [
    '646', '917', '347', '929', '332', // NYC (spoofed frequently)
    '213', '323', '424', '747', '818', // LA area
    '305', '786', '754', // Miami
    '202', // Washington DC
    '512', '737', // Austin
    '281', '832', '713', // Houston
    '404', '678', '470', // Atlanta
    '702', '725', // Las Vegas
    '312', '773', '872', // Chicago
    '215', '267', '445', // Philadelphia
    '469', '214', '972', // Dallas
    '480', '602', '623', // Phoenix
    '619', '858', '760', // San Diego
    '571', '703', // Northern Virginia
  ];

  useEffect(() => {
    if (searchTerm) {
      // When searching, show filtered results
      setDisplayedCodes(filteredCodes);
      setInitialLoad(false);
    } else if (showAll) {
      // Show all codes when "Load More" is clicked
      setDisplayedCodes(areaCodes);
    } else {
      // Initially show only high-risk area codes
      const highRiskCodes = areaCodes.filter(code => 
        highRiskAreaCodes.includes(code.areaCode)
      );
      setDisplayedCodes(highRiskCodes);
    }
  }, [searchTerm, filteredCodes, showAll]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term) {
      const filtered = areaCodes.filter(code => 
        code.areaCode.includes(term) ||
        code.location.toLowerCase().includes(term)
      );
      setFilteredCodes(filtered);
    } else {
      setFilteredCodes(areaCodes);
    }
  };

  const generateUniqueKey = (areaCode) => {
    return `${areaCode.areaCode}-${areaCode.location.replace(/\s/g, '')}`;
  };

  const generateAreaCodeUrl = (areaCode) => {
    return `/area-codes/${areaCode}`;
  };

  useEffect(() => {
    // Show data broker CTA after user searches, indicating interest in protection
    if (searchTerm) {
      const timer = setTimeout(() => {
        setShowDataBrokerCTA(true);
      }, 3000); // Show after 3 seconds of searching
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  const infoCards = [
    {
      icon: <FaUserShield className="info-icon" />,
      title: "Check Your Email Security",
      description: "See if your email has been stolen in data breaches that phone scammers use to target you.",
      color: "#4A90E2",
      action: () => navigate('/data-leak'),
      cta: "Check Email"
    },
    {
      icon: <FaExclamationTriangle className="info-icon" />,
      title: "Scam Database",
      description: "Real-time reports of fraudulent calls and verified legitimate numbers for each area code.",
      color: "#ff4757",
      cta: "View Reports"
    },
    {
      icon: <FaEye className="info-icon" />,
      title: "Data Broker Scan",
      description: "Find out which companies are selling your personal information to phone scammers.",
      color: "#4A90E2",
      action: () => navigate('/location'),
      cta: "Start Scan"
    }
  ];

  return (
    <div className="page-container">
      {isMobile ? <MobileNavbar /> : <Navbar />}
      <div className="area-code-main">
        <Helmet>
          <title>{pageTitle} | CyberForget Security</title>
          <meta 
            name="description" 
            content="Lookup any US area code to check for phone scams and protect yourself from fraud. Comprehensive database of scam reports, safety ratings, and identity protection tips." 
          />
          <meta name="keywords" content="area code lookup, phone scam checker, suspicious call, fraud protection, identity theft prevention, scam area codes" />
          <link rel="canonical" href={`https://app.cleandata.me${location.pathname}`} />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "CyberForget Area Code Lookup",
              "description": "Check any US area code for scam activity and protect yourself from phone fraud",
              "url": `https://app.cleandata.me${location.pathname}`,
              "provider": {
                "@type": "Organization",
                "name": "CyberForget"
              }
            })}
          </script>
        </Helmet>

        <div className="hero-section">
          <FaShieldAlt className="hero-icon pulse" />
          <h1>Suspicious Phone Call? Check the <span className="highlight">Area Code</span></h1>
          <p className="hero-subtitle">
            Don't fall victim to phone scams. Instantly lookup any US area code to check for 
            known scam activity, verify legitimate locations, and protect your personal information.
          </p>
          <div className="security-stats">
            <div className="stat-item">
              <span className="stat-number">847,000+</span>
              <span className="stat-label">Scam calls blocked</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">12.4M+</span>
              <span className="stat-label">Phone numbers verified</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99.8%</span>
              <span className="stat-label">Accuracy rate</span>
            </div>
          </div>

          <div className="search-section">
            <div className="search-container">
              <div className="search-wrapper">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search area code or location..."
                  className="search-input"
                  aria-label="Search area codes"
                />
              </div>
              {searchTerm && (
                <div className="search-results" role="listbox">
                  {filteredCodes.map((code) => (
                    <Link 
                      key={generateUniqueKey(code)}
                      to={generateAreaCodeUrl(code.areaCode)}
                      className="search-result-item"
                      role="option"
                    >
                      <span className="area-code">{code.areaCode}</span>
                      <div className="result-meta">
                        <span className="location">{code.location}</span>
                        <span className={`safety-badge ${code.safetyRating.toLowerCase()}`}>
                          {code.safetyRating}
                        </span>
                        <FaExternalLinkAlt className="external-link-icon" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Broker CTA - Appears after user shows interest */}
        {showDataBrokerCTA && (
          <div className="data-broker-cta">
            <div className="cta-content">
              <div className="cta-icon">
                <FaUserShield />
              </div>
              <div className="cta-text">
                <h3>⚠️ Scammers Already Have Your Info</h3>
                <p>Phone scammers often know your name, address, and personal details before they call. Data brokers are <strong>legally selling your information</strong> to anyone willing to pay.</p>
                <button 
                  className="cta-button"
                  onClick={() => navigate('/location')}
                >
                  🔍 Check What Info Is Being Sold About You
                </button>
              </div>
              <button className="cta-close" onClick={() => setShowDataBrokerCTA(false)}>×</button>
            </div>
          </div>
        )}

        <section className="info-cards">
          {infoCards.map((card, index) => (
            <div 
              key={index} 
              className={`info-card ${card.action ? 'clickable' : ''}`}
              style={{ borderColor: card.color }}
              onClick={card.action}
            >
              {card.icon}
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div className="card-action">
                <span>{card.cta || 'Learn More'} →</span>
              </div>
            </div>
          ))}
        </section>

        <section className="all-area-codes">
          <div className="section-header">
            <h2>
              {searchTerm ? 'Search Results' : showAll ? (
                <>Complete US <span className="highlight">Area Code</span> Directory</>
              ) : (
                <><span className="highlight">High-Risk</span> Area Codes</>
              )}
            </h2>
            <p>
              {searchTerm 
                ? `Found ${filteredCodes.length} matching area codes` 
                : showAll 
                  ? 'Complete directory of all US area codes with scam reports and safety ratings.' 
                  : 'Area codes frequently used by scammers to appear local and gain your trust.'}
            </p>
          </div>
          <div className="area-codes-grid">
            {displayedCodes.map((code) => (
              <Link 
                key={generateUniqueKey(code)}
                to={generateAreaCodeUrl(code.areaCode)}
                className="area-code-card"
              >
                <h3>{code.areaCode}</h3>
                <p className="location">{code.location}</p>
                <div className="area-code-info">
                  <span className={`safety-badge ${code.safetyRating.toLowerCase()}`}>
                    {code.safetyRating}
                  </span>
                  <div className="quick-links">
                    {code.activeScamAlerts?.length > 0 && (
                      <span className="alert-count">
                        <FaExclamationTriangle /> {code.activeScamAlerts.length} Alerts
                      </span>
                    )}
                    {code.legitimateCallers?.government?.length > 0 && (
                      <span className="govt-numbers">
                        <FaBuilding /> {code.legitimateCallers.government.length} Verified
                      </span>
                    )}
                  </div>
                  {code.riskLevel && (
                    <span className="risk-level">Risk: {code.riskLevel}</span>
                  )}
                  <span className="view-details">
                    View Details <FaExternalLinkAlt />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {!searchTerm && !showAll && (
            <div className="load-more-section">
              <button 
                className="load-more-button"
                onClick={() => setShowAll(true)}
              >
                <FaSearch /> View All {areaCodes.length} Area Codes
              </button>
              <p className="load-more-text">
                Showing {displayedCodes.length} high-risk area codes • {areaCodes.length - displayedCodes.length} more available
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AreaCodeMainPage; 