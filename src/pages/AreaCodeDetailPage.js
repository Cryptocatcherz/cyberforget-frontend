import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  FaExclamationTriangle, FaBuilding, FaPhoneAlt, 
  FaMapMarkedAlt, FaShieldAlt, FaChartLine, 
  FaUserShield, FaHistory, FaSpinner, FaClock, FaBell, FaCheckCircle, FaExternalLinkAlt, FaUsers, FaMapMarkerAlt, FaList, FaGov, FaMedkit, FaBolt, FaGraduationCap, FaDollarSign 
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';
import { Footer } from '../components/footer';
import './AreaCodeDetailPage.css';
import areaCodesData from '../data/area-codes.json';

// Loading component
const LoadingComponent = () => (
  <div className="loading-container">
    <div className="loading-pulse"></div>
    <div className="loading-text">Loading area code information...</div>
  </div>
);

// Error component with enhanced error handling
const ErrorComponent = ({ areaCode, error }) => (
  <div className="area-code-detail error-page">
    <Helmet>
      <title>Error - Area Code {areaCode} Not Found</title>
      <meta name="robots" content="noindex" />
    </Helmet>
    <Navbar />
    <div className="error-message">
      <FaExclamationTriangle className="error-icon" />
      <h1>Area Code Not Found</h1>
      <p>Sorry, we couldn't find information for area code {areaCode}</p>
      <p className="error-details">{error}</p>
      <div className="error-actions">
        <Link to="/" className="back-button">Back to Directory</Link>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </div>
    </div>
    <Footer />
  </div>
);

const AreaCodeDetailPage = () => {
  const { areaCode } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [areaCodeData, setAreaCodeData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Scroll to top when navigating to this page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    const loadAreaCodeData = async () => {
      try {
        setIsLoading(true);
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const foundAreaCode = areaCodesData.areaCodes.find(
          code => code.areaCode === areaCode
        );

        if (!foundAreaCode) {
          throw new Error('Area code not found in our database');
        }

        setAreaCodeData(foundAreaCode);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadAreaCodeData();
  }, [areaCode]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorComponent areaCode={areaCode} error={error} />;
  if (!areaCodeData) return <ErrorComponent areaCode={areaCode} />;

  const {
    location = 'Unknown Location',
    safetyRating = 'UNKNOWN',
    riskLevel = 'N/A',
    seoMeta = {
      title: `${areaCode} Area Code: Complete Guide to ${location} Phone Numbers`,
      description: `Everything you need to know about the ${areaCode} area code in ${location}. Learn about local scam alerts, safety ratings, and how to verify legitimate callers. Updated ${new Date().toLocaleDateString()}.`,
      keywords: [
        `${areaCode} area code`,
        `where is ${areaCode} area code`,
        `${location} phone numbers`,
        `${areaCode} phone scams`,
        'phone safety',
        'legitimate callers',
        `${location} caller verification`,
        'phone fraud protection'
      ]
    },
    regionalInfo = {
      timezone: 'Unknown',
      mainCities: [],
      localAuthorities: {}
    },
    activeScamAlerts = [],
    knownScamPatterns = [],
    legitimateCallers = {
      government: [],
      healthcare: [],
      utilities: [],
      education: [],
      emergency: []
    },
    safetyMetrics = {
      totalReportedScams2023: 0,
      yearOverYearChange: '0%',
      averageMonthlyComplaints: 0,
      mostTargetedAgeGroup: 'Unknown'
    },
    consumerResources = {
      localSupport: [],
      scamReportingSteps: {
        immediate: [],
        followUp: []
      }
    }
  } = areaCodeData;

  return (
    <div className="area-code-detail">
      <Helmet>
        <title>What is the {areaCode} Area Code? - Complete Guide to {location}</title>
        <meta name="description" content={seoMeta.description} />
        <meta name="keywords" content={seoMeta.keywords.join(', ')} />
        <meta property="og:title" content={seoMeta.title} />
        <meta property="og:description" content={seoMeta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://yoursite.com/area-codes/${areaCode}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoMeta.title} />
        <meta name="twitter:description" content={seoMeta.description} />
        <link rel="canonical" href={`https://yoursite.com/area-codes/${areaCode}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{
              "@type": "Question",
              "name": `Where is the ${areaCode} area code?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `The ${areaCode} area code serves ${location}. Major cities in this area include ${regionalInfo.mainCities.join(', ')}.`
              }
            }, {
              "@type": "Question",
              "name": `Is the ${areaCode} area code safe?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `The ${areaCode} area code has a ${safetyRating} safety rating with a risk level of ${riskLevel}. In 2023, there were ${safetyMetrics.totalReportedScams2023} reported scams.`
              }
            }]
          })}
        </script>
      </Helmet>

      <Navbar />
      {isMobile && <MobileNavbar />}

      <div className="enhanced-hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="area-code-display">
            <span className="area-code-number">{areaCode}</span>
            <div className="hero-badges">
              <div className="location-badge">
                <FaMapMarkerAlt /> {location}
              </div>
              <div className={`safety-badge ${safetyRating.toLowerCase()}`}>
                <FaShieldAlt /> {safetyRating}
              </div>
            </div>
          </div>
          <div className="hero-text">
            <h1>Area Code {areaCode} Security Guide</h1>
            <p className="hero-description">
              Complete security information for the {areaCode} area code serving {location}. 
              Check for scam reports, verify legitimate callers, and protect yourself from phone fraud.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">{safetyMetrics?.totalReportedScams2023 || 0}</span>
                <span className="stat-label">Scams Reported</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{legitimateCallers.government?.length + legitimateCallers.healthcare?.length + legitimateCallers.utilities?.length || 0}</span>
                <span className="stat-label">Verified Callers</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{riskLevel}</span>
                <span className="stat-label">Risk Level</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="area-code-search">
        <h2>Search Other Area Codes</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter area code or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Link to="/area-codes" className="browse-all-btn">
            <FaList /> Browse All Area Codes
          </Link>
        </div>
      </div>

      <div className="legitimate-callers-section">
        <h2>
          <FaCheckCircle className="section-icon" />
          Legitimate Callers from {areaCode}
        </h2>
        <div className="callers-grid">
          {Object.entries(legitimateCallers).map(([category, callers]) => (
            callers.length > 0 && (
              <div key={category} className="caller-category">
                <h3>
                  {category === 'government' && <FaBuilding />}
                  {category === 'healthcare' && <FaMedkit />}
                  {category === 'utilities' && <FaBolt />}
                  {category === 'education' && <FaGraduationCap />}
                  {category === 'emergency' && <FaPhoneAlt />}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
                <div className="caller-list">
                  {callers.map((caller, index) => (
                    <div key={index} className="caller-card">
                      <h4>{caller.agency || caller.name}</h4>
                      <p>{caller.purpose}</p>
                      {caller.verificationUrl && (
                        <a 
                          href={caller.verificationUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="verify-link"
                        >
                          Verify Caller <FaExternalLinkAlt />
                        </a>
                      )}
                      {caller.officialPrefix && (
                        <div className="prefix-badge">
                          Official Prefix: {caller.officialPrefix}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <FaClock />
          <h3>Timezone</h3>
          <p>{regionalInfo.timezone || 'Unknown'}</p>
        </div>
        <div className="stat-card">
          <FaExclamationTriangle />
          <h3>Risk Level</h3>
          <p>{riskLevel}/10</p>
        </div>
        <div className="stat-card">
          <FaChartLine />
          <h3>2023 Scams</h3>
          <p>{safetyMetrics?.totalReportedScams2023 || 'N/A'}</p>
        </div>
        <div className="stat-card">
          <FaUsers />
          <h3>Population</h3>
          <p>{regionalInfo.demographics?.population || 'N/A'}</p>
        </div>
      </div>

      <section className="main-content">
        <div className="content-grid">
          <div className="grid-item regional-info">
            <h2><FaBuilding /> Regional Information</h2>
            <div className="info-grid">
              <div className="info-card">
                <h3>Major Cities</h3>
                <ul>
                  {regionalInfo.mainCities?.map((city, index) => (
                    <li key={index}>{city}</li>
                  ))}
                </ul>
              </div>
              <div className="info-card">
                <h3>Major Employers</h3>
                <ul>
                  {regionalInfo.demographics?.majorEmployers?.map((employer, index) => (
                    <li key={index}>{employer}</li>
                  ))}
                </ul>
              </div>
              <div className="info-card">
                <h3>Local Authorities</h3>
                <ul>
                  {regionalInfo.localAuthorities && (
                    <>
                      <li><strong>Police:</strong> {regionalInfo.localAuthorities.police}</li>
                      <li><strong>Consumer Protection:</strong> {regionalInfo.localAuthorities.consumerProtection}</li>
                      <li><strong>Fraud Unit:</strong> {regionalInfo.localAuthorities.fraudUnit}</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="grid-item active-alerts">
            <h2><FaBell /> Active Scam Alerts</h2>
            {activeScamAlerts?.length > 0 ? (
              <div className="alerts-list">
                {activeScamAlerts.map((alert, index) => (
                  <div key={index} className="alert-card">
                    <span className="alert-date">{alert.date}</span>
                    <h3>{alert.title}</h3>
                    <p>{alert.scamScript}</p>
                    <div className="alert-details">
                      <span><FaUsers /> {alert.targetDemographic}</span>
                      <span><FaMapMarkedAlt /> {alert.affectedAreas.join(', ')}</span>
                      {alert.reportedLosses && (
                        <span><FaDollarSign /> {alert.reportedLosses}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-alerts">No active scam alerts at this time.</p>
            )}
          </div>

          <div className="grid-item safety-resources">
            <h2><FaShieldAlt /> Safety Resources</h2>
            <div className="resources-grid">
              <div className="resource-card reporting">
                <h3>How to Report Scams</h3>
                <div className="steps">
                  <div className="step-group">
                    <h4>Immediate Steps:</h4>
                    <ul>
                      {consumerResources.scamReportingSteps.immediate.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="step-group">
                    <h4>Follow-up Actions:</h4>
                    <ul>
                      {consumerResources.scamReportingSteps.followUp.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="resource-card local-support">
                <h3>Local Support</h3>
                {consumerResources.localSupport.map((support, index) => (
                  <div key={index} className="support-item">
                    <h4>{support.name}</h4>
                    <p>{support.phone}</p>
                    {support.website && (
                      <a href={support.website} target="_blank" rel="noopener noreferrer">
                        Visit Website <FaExternalLinkAlt />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AreaCodeDetailPage; 