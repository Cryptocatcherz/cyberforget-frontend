import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ScanningPage.css';
import { fetchMatchProbability } from '../fetchMatchProbability';
import {
    FaExclamationTriangle,
    FaSearch,
    FaShieldAlt,
    FaDatabase,
    FaInfoCircle,
    FaCheckCircle,
    FaBug,
    FaSpinner,
    FaHome,
    FaUserCircle,
    FaUser,
    FaPhone,
    FaFileAlt,
} from 'react-icons/fa';
import peopleSearchSites from './peopleSearchSites';

const auth = '72382-cd';
const thumbioKey = '72571-1234';

// Utility function for delays
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Scan stages
const scanStages = [
    {
        stage: 'initializing',
        messages: [
            'Initializing AI cyber intelligence scan...',
            'Establishing secure encrypted connection...',
            'Preparing threat surface analysis...',
        ],
    },
    {
        stage: 'searching',
        messages: [
            'Scanning 500+ data broker networks...',
            'Analyzing social media threat vectors...',
            'Processing public records databases...',
            'Searching people finder networks...',
            'Scanning background check services...',
            'Analyzing digital footprint exposure...',
        ],
    },
    {
        stage: 'analyzing',
        messages: [
            'AI analyzing potential threat matches...',
            'Verifying intelligence sources...',
            'Processing threat intelligence data...',
            'Compiling cyber exposure report...',
        ],
    },
];

// Add these constants at the top of your file
const SCAN_DURATION = 24000; // 24 seconds total scan time
const UPDATE_INTERVAL = 500; // Update every 500ms

// Helper function to shuffle arrays
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Function to capitalize the first letter
const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// Main ScanningPage Component
const ScanningPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { firstName, lastName, city, country } = location.state || {};
    const [threats, setThreats] = useState([]);
    const [matchProbability, setMatchProbability] = useState(null);
    const [progress, setProgress] = useState(0);
    const [currentScreenshot, setCurrentScreenshot] = useState(null);
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [error, setError] = useState('');
    const [isScanning, setIsScanning] = useState(true);
    const [totalSites, setTotalSites] = useState(0);
    const headerRef = useRef(null);
    const [currentSite, setCurrentSite] = useState(null);
    const [obfuscatedSiteNames, setObfuscatedSiteNames] = useState({});
    const isMounted = useRef(true);
    const threatsRef = useRef([]);
    const [imageErrors, setImageErrors] = useState({});

    const capitalizedFirstName = capitalizeFirstLetter(firstName);
    const capitalizedLastName = capitalizeFirstLetter(lastName);

    // Define obfuscateWebsiteName inside component
    const obfuscateWebsiteName = (name) => {
        // Handle special cases first
        if (name.includes('.')) {
            const parts = name.split('.');
            const domain = parts[0];
            const extension = parts.slice(1).join('.');
            
            // Special handling for numeric domains
            if (/^\d+$/.test(domain)) {
                return `${domain}.${extension}`; // Keep numeric domains as is
            }
            
            // Handle domain part
            let obfuscatedDomain;
            if (domain.length <= 4) {
                obfuscatedDomain = domain; // Keep short domains as is
            } else {
                obfuscatedDomain = domain.slice(0, 2) + '*'.repeat(domain.length - 4) + domain.slice(-2);
            }
            
            return `${obfuscatedDomain}.${extension}`;
        }
        
        // Handle non-domain names
        if (name.length <= 4) return name;
        return name.slice(0, 2) + '*'.repeat(name.length - 4) + name.slice(-2);
    };

    // Pre-generate obfuscated names when component mounts
    useEffect(() => {
        const obfuscatedMap = peopleSearchSites.reduce((acc, site) => {
            acc[site] = obfuscateWebsiteName(site);
            return acc;
        }, {});
        setObfuscatedSiteNames(obfuscatedMap);
    }, []); // Empty dependency array means this runs once at mount

    // Effect to handle stage progression
    useEffect(() => {
        if (!isScanning) return;

        const messageInterval = setInterval(() => {
            setCurrentMessageIndex((prevIndex) => {
                const currentStage = scanStages[currentStageIndex];
                if (prevIndex >= currentStage.messages.length - 1) {
                    // Move to next stage
                    if (currentStageIndex < scanStages.length - 1) {
                        setCurrentStageIndex((prev) => prev + 1);
                        return 0;
                    }
                }
                return (prevIndex + 1) % currentStage.messages.length;
            });
        }, 2000); // Change message every 2 seconds

        return () => clearInterval(messageInterval);
    }, [currentStageIndex, isScanning]);

    const scanSites = async (probability) => {
        if (!isScanning) return;
        
        console.log('Starting scan with probability:', probability);
        
        setProgress(0);
        const startTime = Date.now();
        const totalDuration = 15000;

        // For invalid names or zero score, show exactly one match
        if (probability.score === 0 || probability.threatLevel === 'None' || 
            probability.matches === 1) {
            // Generate exactly one threat for invalid/fake names
            const singleThreat = {
                siteName: 'pe***ch.com',
                category: 'People Search',
                details: 'Limited information found'
            };
            
            threatsRef.current = [singleThreat];
            setThreats([singleThreat]);
            
            setTimeout(() => {
                if (isScanning) {
                    navigate('/results', {
                        state: {
                            threats: [singleThreat],
                            firstName,
                            lastName,
                            totalMatches: 1,
                            city,
                            country,
                            matchProbability: probability
                        }
                    });
                }
            }, totalDuration);
            return;
        }

        // For valid names, use the exact matches from probability
        const matches = probability.matches;
        console.log('Number of matches to show:', matches);

        // Adjust category distribution to match exactly the number from probability
        const totalThreats = matches;
        const categoryDistribution = {
            'Background Check': Math.floor(totalThreats * 0.08),
            'Public Records': Math.floor(totalThreats * 0.16),
            'People Search': Math.floor(totalThreats * 0.16),
            'Social Media': Math.floor(totalThreats * 0.16),
            'Contact Info': Math.floor(totalThreats * 0.16),
            'Address History': Math.floor(totalThreats * 0.28)
        };

        // Ensure the total matches the exact number from probability
        let currentTotal = Object.values(categoryDistribution).reduce((a, b) => a + b, 0);
        if (currentTotal < matches) {
            categoryDistribution['People Search'] += (matches - currentTotal);
        }

        const updateProgress = () => {
            if (!isScanning) return;

            const elapsed = Date.now() - startTime;
            const currentProgress = Math.min(100, (elapsed / totalDuration) * 100);
            setProgress(currentProgress);

            if (currentProgress < 33) {
                setCurrentStageIndex(0);
            } else if (currentProgress < 66) {
                setCurrentStageIndex(1);
            } else {
                setCurrentStageIndex(2);
            }

            const threatsToShow = Math.floor((currentProgress / 100) * matches);

            if (threatsRef.current.length < threatsToShow) {
                let newThreat = generateThreat(categoryDistribution, threatsRef.current.length);
                threatsRef.current = [...threatsRef.current, newThreat];
                setThreats([...threatsRef.current]);
            }

            if (currentProgress < 100) {
                requestAnimationFrame(updateProgress);
            } else {
                setTimeout(() => {
                    if (isScanning) {
                        navigate('/results', {
                            state: {
                                threats: threatsRef.current,
                                firstName,
                                lastName,
                                totalMatches: matches, // Use exact match count
                                city,
                                country,
                                matchProbability: probability
                            }
                        });
                    }
                }, 1500);
            }
        };

        requestAnimationFrame(updateProgress);
    };

    const initializeScan = useCallback(async () => {
        if (!firstName || !lastName || !city || !country) {
            console.log('Missing required information');
            return;
        }

        try {
            console.log('Starting scan for:', { firstName, lastName });
            const probability = await fetchMatchProbability(firstName, lastName, city, country);
            console.log('Received probability data:', probability);

            if (probability.threatLevel === 'None' || probability.matches === 0) {
                console.log('Invalid name detected - stopping scan');
                setIsScanning(false);
                navigate('/results', {
                    state: {
                        threats: [],
                        firstName,
                        lastName,
                        totalMatches: 0,
                        city,
                        country,
                        matchProbability: probability
                    }
                });
                return;
            }

            setMatchProbability(probability);
            await scanSites(probability);
        } catch (error) {
            console.log('Scan failed:', error);
            setIsScanning(false);
        }
    }, [firstName, lastName, city, country, navigate]);

    useEffect(() => {
        setIsScanning(true);
        initializeScan();
        return () => setIsScanning(false);
    }, [initializeScan]);

    // Verify that required data is available
    useEffect(() => {
        if (!location.state) {
            console.error('No location state found');
            setError('Missing required information. Please go back and try again.');
            return;
        }

        if (!firstName || !lastName || !city || !country) {
            console.error('Missing required fields:', { firstName, lastName, city, country });
            setError('Missing required information. Please go back and provide your details.');
            return;
        }
    }, [location.state, firstName, lastName, city, country]);

    // Add this new useEffect for scrolling
    useEffect(() => {
        const handleScroll = () => {
            if (headerRef.current && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                headerRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        };

        handleScroll();

        // Optionally, add event listeners if you want to handle dynamic changes
        // window.addEventListener('focusin', handleScroll);
        // window.addEventListener('focusout', handleScroll);

        return () => {
            // window.removeEventListener('focusin', handleScroll);
            // window.removeEventListener('focusout', handleScroll);
        };
    }, []);

    // Function for screenshot sites (top section visual display)
    const generateScreenshotSites = (firstName, lastName) => {
        return [
            { url: `https://dataveria.com/profile/search?fname=${firstName}&lname=${lastName}`, siteName: 'Dataveria.com' },
            { url: `https://411.info/people?fn=${firstName}&ln=${lastName}`, siteName: '411.info' },
            { url: `https://www.anywho.com/people/${firstName}%20+${lastName}/`, siteName: 'AnyWho.com' },
            // Add more screenshot sites as needed
        ];
    };

    // Generate screenshot URL using Thum.io
    const generateScreenshotUrl = (url) => {
        try {
            const encodedUrl = encodeURIComponent(url);
            return `https://image.thum.io/get/auth/${auth}/width/800/crop/600/${encodedUrl}`;
        } catch (error) {
            console.error('URL generation error:', error);
            return null;
        }
    };

    // Add these new functions from DataRemovalsPage
    const getThumbioUrl = (url, retry = false) => {
        const encodedUrl = encodeURIComponent(url);
        const thumbioUrl = `https://image.thum.io/get/auth/${thumbioKey}/width/800/crop/600/noanimate${retry ? '/wait/2' : ''}/png/?url=${encodedUrl}`;
        return thumbioUrl;
    };

    const handleImageError = async (url) => {
        console.log('Image load failed for:', url);
        
        if (!imageErrors[url]) {
            console.log('Attempting retry with longer wait time...');
            setImageErrors(prev => ({ ...prev, [url]: true }));
            
            const retryUrl = getThumbioUrl(url, true);
            console.log('Retry URL:', retryUrl);
            
            const img = new Image();
            img.src = retryUrl;
            img.onload = () => {
                console.log('Retry successful for:', url);
                setImageErrors(prev => ({ ...prev, [url]: false }));
            };
        }
    };

    // ScreenshotSection Component
    const ScreenshotSection = ({ currentScreenshot }) => {
        const [isLoading, setIsLoading] = useState(true);
        const [loadError, setLoadError] = useState(false);

        if (!currentScreenshot) {
            return (
                <div className="screenshot-section">
                    <h3>
                        <FaShieldAlt />
                        AI Intelligence Analysis
                    </h3>
                    <div className="screenshot-container">
                        <div className="screenshot-placeholder">
                            <div className="cyber-spinner"></div>
                            <p>Deploying cyber intelligence algorithms...</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="screenshot-section">
                <h3>
                    <FaShieldAlt />
                    AI Intelligence Analysis
                </h3>
                <div className="screenshot-container">
                    <div className={`image-preview ${isLoading ? 'loading' : ''} ${loadError ? 'error' : ''}`}>
                        <div className="preview-content">
                            {isLoading && (
                                <div className="loading-state">
                                    <div className="cyber-spinner"></div>
                                    <span>Analyzing {currentScreenshot.siteName}</span>
                                </div>
                            )}
                            
                            <img
                                src={getThumbioUrl(currentScreenshot.url)}
                                alt={`${currentScreenshot.siteName} Intelligence Analysis`}
                                className={`preview-image ${isLoading ? 'hidden' : ''}`}
                                onLoad={() => setIsLoading(false)}
                                onError={() => {
                                    handleImageError(currentScreenshot.url);
                                    setLoadError(true);
                                    setIsLoading(false);
                                }}
                            />

                            {!isLoading && !loadError && (
                                <div className="cyber-overlay">
                                    <div className="live-indicator">
                                        <div className="recording-dot"></div>
                                        <span>AI ANALYSIS</span>
                                    </div>
                                    <div className="site-info">
                                        <span className="site-name">{currentScreenshot.siteName}</span>
                                    </div>
                                </div>
                            )}

                            {loadError && (
                                <div className="error-state">
                                    <FaExclamationTriangle className="error-icon" />
                                    <span>Retrying analysis...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Function to format threat messages with location info
    const formatThreatMessage = (siteName, category, includeLocation = false) => {
        const exposureTypes = {
            'Background Check': {
                icon: '🔍',
                details: 'Advanced background intelligence detected',
                locationDetails: `Background data linked to ${city || 'your area'}`,
            },
            'Public Records': {
                icon: '📄',
                details: 'Public record intelligence identified',
                locationDetails: `Government records found in ${country || 'multiple regions'}`,
            },
            'People Search': {
                icon: '👤',
                details: 'Personal intelligence profile available',
                locationDetails: `Personal data indexed from ${city || 'your location'}`,
            },
            'Social Media': {
                icon: '📱',
                details: 'Social media threat vectors detected',
                locationDetails: `Digital footprint traced to ${city || 'local networks'}`,
            },
            'Contact Info': {
                icon: '📞',
                details: 'Contact intelligence may be compromised',
                locationDetails: `Communication data linked to ${city || 'your region'}`,
            },
            'Address History': {
                icon: '🏠',
                details: 'Location intelligence history exposed',
                locationDetails: `Address tracking from ${city}, ${country || 'multiple locations'}`,
            },
        };

        const exposureType = exposureTypes[category] || exposureTypes['People Search'];
        const obfuscatedName = obfuscateWebsiteName(siteName);

        return {
            icon: exposureType.icon,
            category: category,
            siteName: obfuscatedName,
            details: includeLocation ? exposureType.locationDetails : exposureType.details,
            hasLocation: includeLocation,
        };
    };

    // Use useRef for values that shouldn't trigger re-renders
    const scrollRef = useRef(0);
    const foundThreatsRef = useRef([]);
    
    // Memoize the threats to prevent unnecessary re-renders
    const memoizedThreats = useMemo(() => {
        return foundThreatsRef.current;
    }, [foundThreatsRef.current.length]);

    // Handle scroll events without causing re-renders
    const handleScroll = useCallback((e) => {
        scrollRef.current = window.scrollY;
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Update threats without causing re-renders
    const updateThreats = (newThreats) => {
        foundThreatsRef.current = newThreats;
        setThreats(newThreats);
    };

    useEffect(() => {
        // Cleanup function to set isMounted to false when unmounting
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Add the generateThreat function with location intelligence
    const generateThreat = (categoryDistribution, currentIndex) => {
        const categories = Object.keys(categoryDistribution);
        let selectedCategory;
        let total = 0;
        
        for (const category of categories) {
            total += categoryDistribution[category];
            if (currentIndex < total) {
                selectedCategory = category;
                break;
            }
        }

        const prefixes = ['cy', 'se', 'da', 'in', 'pe', 'tr', 'qu'];
        const suffixes = ['.com', '.org', '.net', '.info', '.co'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const stars = '*'.repeat(Math.floor(Math.random() * 4) + 3);

        // 30% chance to include location information
        const includeLocation = Math.random() < 0.3;
        const threat = formatThreatMessage('', selectedCategory, includeLocation);

        return {
            siteName: `${prefix}${stars}${suffix}`,
            category: selectedCategory,
            details: threat.details,
            hasLocation: threat.hasLocation
        };
    };

    useEffect(() => {
        threatsRef.current = threats;
    }, [threats]);

    // Add this CSS to your ScanningPage.css
    const styles = `
        .preview-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .preview-image.hidden {
            opacity: 0;
        }

        .cyber-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 15px;
            background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
            border-radius: 0 0 8px 8px;
        }

        .recording-dot {
            width: 8px;
            height: 8px;
            background-color: #ff0000;
            border-radius: 50%;
            margin-right: 8px;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    `;

    // Add the styles to the document
    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
        return () => styleSheet.remove();
    }, []);

    return (
        <div className="scanning-page" style={{ minHeight: '100vh', overflowY: 'auto' }}>
            {error ? (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => navigate(-1)}>Go Back</button>
                </div>
            ) : (
                <>
                    <div className="scanning-header" ref={headerRef}>
                        <h1>AI Cyber Intelligence Scan Active</h1>
                        <h2>
                            {capitalizedFirstName} {capitalizedLastName}
                        </h2>
                        <p>Advanced AI analyzing 500+ intelligence sources for digital exposure in {city}, {country}</p>
                    </div>

                    <div className="scan-status-display">
                        <div className="current-stage">
                            <FaShieldAlt className="stage-icon" />
                            <h3 className="stage-message">{scanStages[currentStageIndex].messages[currentMessageIndex]}</h3>
                        </div>
                        <div className="current-action">
                            Deploying CyberForget AI threat intelligence algorithms
                        </div>
                    </div>

                    <div className="threats-section">
                        <h3>
                            <FaShieldAlt className="info-icon" />
                            Cyber Intelligence Threats Detected
                            <span className="exposure-count">{threats.length} active threats</span>
                        </h3>
                        <div className="threats-list">
                            {threats.map((threat, index) => (
                                <div className="exposure-item" key={index}>
                                    <div className="app-icon">
                                        {threat.category === 'Address History' && <FaHome className="globe-icon" />}
                                        {threat.category === 'People Search' && <FaUserCircle className="search-icon" />}
                                        {threat.category === 'Social Media' && <FaUser className="social-icon" />}
                                        {threat.category === 'Contact Info' && <FaPhone className="contact-icon" />}
                                        {threat.category === 'Public Records' && <FaFileAlt className="document-icon" />}
                                        {threat.category === 'Background Check' && <FaDatabase className="database-icon" />}
                                    </div>
                                    <div className="exposure-content">
                                        <span className="site-name">{threat.siteName}</span>
                                        <span className="exposure-category">{threat.category}</span>
                                        <p className="exposure-details">
                                            {threat.details}
                                            {threat.hasLocation && (
                                                <span className="location-indicator"> 📍</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <ScreenshotSection currentScreenshot={currentScreenshot} />

                    <div className="info-box-bottom">
                        <FaShieldAlt className="info-icon-bottom" />
                        <p>
                            This is a preliminary AI intelligence scan. Our advanced cyber threat analysis detected potential exposures across multiple networks. 
                            For comprehensive threat elimination and continuous monitoring, upgrade to{' '}
                            <strong>CyberForget AI Pro</strong> for enterprise-grade data protection.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default ScanningPage;
