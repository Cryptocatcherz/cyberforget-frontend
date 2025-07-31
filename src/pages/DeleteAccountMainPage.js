import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import sites from '../sites-enhanced.json';
import './DeleteAccountMainPage.css';
import { 
  FaExternalLinkAlt, 
  FaShieldAlt, 
  FaUserSecret, 
  FaSearch, 
  FaDatabase,
  FaLock,
  FaFileAlt,
  FaUserShield,
  FaClipboardCheck
} from 'react-icons/fa';
import MobileNavbar from '../components/MobileNavbar';
import Navbar from '../components/Navbar';

const DeleteAccountMainPage = () => {
  const location = useLocation();
  const pageTitle = "Delete Online Accounts - Step by Step Account Deletion Guide";
  const popularSites = sites.filter(site => site.meta === 'popular').slice(0, 6);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSites, setFilteredSites] = useState(sites);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term) {
      const filtered = sites.filter(site => 
        site.name && site.name.toLowerCase().includes(term)
      );
      setFilteredSites(filtered);
    } else {
      setFilteredSites(sites);
    }
  };

  const generateUniqueKey = (site) => {
    return `${site.name || 'unknown'}-${site.domains?.[0] || site.url || Date.now()}`;
  };

  const generateSiteUrl = (siteName) => {
    return `/delete-account/how-to-delete-my-account-on-${siteName
      .toLowerCase()
      .replace(/\./g, '-')  // Replace dots with hyphens
      .replace(/\s/g, '-')}`; // Replace spaces with hyphens
  };

  const infoCards = [
    {
      icon: <FaUserSecret className="info-icon" />,
      title: "Identity Protection",
      description: "CyberForget helps you permanently remove your personal information from hundreds of websites and data brokers.",
      color: "#4A90E2"
    },
    {
      icon: <FaDatabase className="info-icon" />,
      title: "Data Broker Removal",
      description: "Stop companies from selling your personal data with our comprehensive removal process.",
      color: "#4A90E2"
    },
    {
      icon: <FaLock className="info-icon" />,
      title: "Step-by-Step Guides",
      description: "Follow our verified deletion steps to remove your digital footprint and protect your privacy.",
      color: "#4A90E2"
    },
    {
      icon: <FaShieldAlt className="info-icon" />,
      title: "Security Monitoring",
      description: "Keep your personal information secure with regular monitoring and privacy protection.",
      color: "#4A90E2"
    },
    {
      icon: <FaUserShield className="info-icon" />,
      title: "Privacy Assurance",
      description: "Get peace of mind knowing your personal data is protected from unauthorized access and misuse.",
      color: "#4A90E2"
    },
    {
      icon: <FaClipboardCheck className="info-icon" />,
      title: "GDPR Compliance",
      description: "Stay compliant with privacy regulations while ensuring your data rights are protected.",
      color: "#4A90E2"
    }
  ];

  const popularGuides = [
    { name: "Blogger", difficulty: "impossible" },
    { name: "Box", difficulty: "easy" },
    { name: "eBay", difficulty: "easy" },
    { name: "LinkedIn", difficulty: "medium" },
    { name: "Match", difficulty: "medium" },
    { name: "Pinterest", difficulty: "impossible" }
  ];

  return (
    <div className="page-container">
      {isMobile ? <MobileNavbar /> : <Navbar />}
      <div className="global-content-wrapper">
        <div className="delete-account-main">
          <Helmet>
            <title>Remove Personal Information from Data Brokers & Websites | Privacy Protection Guide</title>
            <meta 
              name="description" 
              content="Expert guide to remove your personal information from data brokers, websites, and online databases. Protect your privacy with our comprehensive data removal service." 
            />
            <meta name="keywords" content="remove personal information, data removal service, privacy protection, data broker opt-out, delete personal data, online privacy" />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content="Step-by-step guides to permanently delete your online accounts and protect your privacy." />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content="Expert guides for secure account deletion and privacy protection." />
            <link rel="canonical" href={`https://app.cyberforget.com${location.pathname}`} />
          </Helmet>
          
          <div className="hero-section">
            <FaShieldAlt className="hero-icon pulse" />
            <h1>Delete Your Digital Footprint</h1>
            <p className="hero-subtitle">
              Protect your privacy with CyberForget's comprehensive account deletion guides. 
              Remove your personal information from 1,000+ websites and data brokers to prevent identity theft and data misuse.
            </p>

            <div className="search-section">
              <div className="search-container">
                <div className="search-wrapper">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search for any account..."
                    className="search-input"
                    aria-label="Search for accounts"
                  />
                </div>
                {searchTerm && (
                  <div className="search-results" role="listbox">
                    {filteredSites.map((site) => {
                      if (!site.name) return null; // Skip sites without a name

                      const difficulty = site.difficulty || 'unknown';
                      const difficultyText = difficulty !== 'unknown'
                          ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()
                          : 'Unknown';

                      const sitePath = site.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

                      return (
                          <Link 
                              key={generateUniqueKey(site)}
                              to={generateSiteUrl(site.name)}
                              className="search-result-item"
                              role="option"
                          >
                              <span className="site-name">{site.name}</span>
                              <div className="result-meta">
                                  <span className={`difficulty-badge ${difficulty.toLowerCase()}`}>
                                      {difficultyText}
                                  </span>
                                  <FaExternalLinkAlt className="external-link-icon" />
                              </div>
                          </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <section className="popular-guides">
            <h2>Popular Deletion Guides</h2>
            <div className="guides-grid">
              {popularGuides.map((guide, index) => (
                <Link 
                  key={index}
                  to={generateSiteUrl(guide.name)}
                  className="guide-card"
                >
                  <span className="site-name">{guide.name}</span>
                  <div className="guide-meta">
                    <span className={`difficulty-badge ${guide.difficulty.toLowerCase()}`}>
                      {guide.difficulty}
                    </span>
                    <span className="guide-link">
                      View Guide <FaExternalLinkAlt />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="info-cards">
            {infoCards.map((card, index) => (
              <div 
                key={card.title} 
                className="info-card"
                style={{'--card-color': card.color}}
              >
                <div className="icon-title">
                  {card.icon}
                  <h3>{card.title}</h3>
                </div>
                <p>{card.description}</p>
              </div>
            ))}
          </section>

          <section className="all-platforms">
            <h2>All Platforms</h2>
            <div className="platforms-grid">
              {filteredSites.map((site) => {
                if (!site.name) return null; // Skip sites without a name

                const sitePath = site.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                const difficulty = site.difficulty || 'unknown';
                const difficultyText = difficulty !== 'unknown'
                  ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()
                  : 'Unknown';

                return (
                  <Link 
                    key={generateUniqueKey(site)}
                    to={generateSiteUrl(site.name)}
                    className="platform-card"
                  >
                    <h3>{site.name}</h3>
                    <div className="platform-info">
                      <span className={`difficulty-badge ${difficulty.toLowerCase()}`}>
                        {difficultyText}
                      </span>
                      <span className="view-guide">
                        View Guide <FaExternalLinkAlt />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountMainPage; 