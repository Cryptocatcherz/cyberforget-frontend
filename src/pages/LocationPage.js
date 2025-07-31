// src/pages/LocationPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LocationPage.css';
import MobileNavBar from '../components/MobileNavbar';
import Navbar from '../components/Navbar';
import ReviewCarousel from './ReviewCarousel';
import axios from 'axios';
import { 
    FaBrain, 
    FaSearch, 
    FaRobot, 
    FaNetworkWired, 
    FaEye, 
    FaDatabase, 
    FaShieldAlt, 
    FaLock, 
    FaCheckCircle,
    FaExclamationTriangle,
    FaChartBar,
    FaClock,
    FaUsers,
    FaMicrochip,
    FaCrosshairs,
    FaCog
} from 'react-icons/fa';

const LocationPage = () => {
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPromptActive, setIsPromptActive] = useState(false);
    const [isFormFocused, setIsFormFocused] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const queryFirstName = queryParams.get('first');
    const queryLastName = queryParams.get('last');

    const rotatingWords = ['digital footprint', 'threat vectors', 'cyber exposure', 'attack surface', 'data leaks', 'security vulnerabilities', 'intelligence gaps'];

    // AI Intelligence Analysis Categories
    const dataCategories = [
        { icon: <FaBrain />, title: 'AI Threat Intelligence', items: ['Behavioral Analysis', 'Pattern Recognition', 'Anomaly Detection', 'Risk Profiling'] },
        { icon: <FaNetworkWired />, title: 'Network Exposure', items: ['Infrastructure Mapping', 'Connection Analysis', 'Traffic Patterns', 'Protocol Vulnerabilities'] },
        { icon: <FaDatabase />, title: 'Data Breach Intelligence', items: ['Compromised Databases', 'Dark Web Exposure', 'Credential Monitoring', 'Leak Detection'] },
        { icon: <FaEye />, title: 'Digital Surveillance', items: ['OSINT Collection', 'Social Engineering Vectors', 'Public Data Mining', 'Identity Correlation'] },
        { icon: <FaMicrochip />, title: 'Technical Fingerprints', items: ['Device Profiling', 'System Signatures', 'Software Vulnerabilities', 'Hardware Analysis'] },
        { icon: <FaCrosshairs />, title: 'Threat Surface Analysis', items: ['Attack Vector Mapping', 'Entry Point Assessment', 'Security Gap Analysis', 'Exposure Timeline'] }
    ];

    // AI Intelligence Report Features
    const reportFeatures = [
        { icon: <FaBrain />, title: 'AI-Powered Analysis', description: 'Advanced machine learning algorithms analyze 500+ intelligence sources' },
        { icon: <FaChartBar />, title: 'Threat Intelligence Report', description: 'Comprehensive risk assessment with actionable security recommendations' },
        { icon: <FaShieldAlt />, title: 'Defense Strategy', description: 'AI-generated security protocols and countermeasure deployment' },
        { icon: <FaClock />, title: 'Real-time Monitoring', description: 'Continuous threat detection and instant alert system' }
    ];

    // Automatically change the rotating words
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
        }, 3000);
        return () => clearInterval(intervalId);
    }, []);

    // Check if first and last names are missing from the URL
    useEffect(() => {
        if (!queryFirstName || !queryLastName) {
            setIsPromptActive(true);
        } else {
            setFirstName(queryFirstName);
            setLastName(queryLastName);
        }
    }, [queryFirstName, queryLastName]);

    // Fetch user location
    useEffect(() => {
        let isMounted = true;

        const fetchUserLocation = async () => {
            try {
                const response = await axios.get('https://ipapi.co/json/');
                if (isMounted && response.data) {
                    setCity(response.data.city || '');
                    setCountry(response.data.country_name || '');
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error fetching location:', error);
                }
            }
        };

        fetchUserLocation();

        return () => {
            isMounted = false;
        };
    }, []);

    // Fetch city suggestions from API
    const fetchCitySuggestions = async (input) => {
        if (input.length > 2) {
            try {
                const response = await axios.get(
                    `https://api.teleport.org/api/cities/?search=${input}`
                );
                const cityOptions = response.data._embedded['city:search-results'].map(
                    (item) => item.matching_full_name
                );
                setCitySuggestions(cityOptions);
            } catch (error) {
                console.error('Error fetching city suggestions:', error);
            }
        } else {
            setCitySuggestions([]);
        }
    };

    const handleCityChange = (e) => {
        const input = e.target.value;
        setCity(input);
        fetchCitySuggestions(input);
    };

    const handleCountryChange = (e) => {
        setCountry(e.target.value);
    };

    const handleContinue = () => {
        if (firstName && lastName && city && country) {
            navigate('/scanning', { state: { firstName, lastName, city, country } });
        } else {
            alert('Please provide all required fields.');
        }
    };

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    };

    return (
        <div className="app-container">
            {window.innerWidth <= 768 ? <MobileNavBar /> : <Navbar />}
            <div className="main-content full-screen">
                <div className="global-content-wrapper">
                    <div className="location-container">
                        <div className="location-content">
                            {/* Hero Section */}
                            <div className="hero-section">
                                <div className="hero-content">
                                    <div className="hero-badge">
                                        <FaBrain />
                                        <span>AI Cyber Intelligence</span>
                                    </div>
                                    <h1 className="hero-title">
                                        Advanced Cyber Intelligence & Threat Analysis
                                    </h1>
                                    <p className="hero-subtitle">
                                        Deploy enterprise-grade AI to conduct comprehensive cyber intelligence analysis and threat surface mapping
                                    </p>
                                    <div className="hero-stats">
                                        <div className="stat-item">
                                            <span className="stat-number">500+</span>
                                            <span className="stat-label">Intelligence Sources</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">24/7</span>
                                            <span className="stat-label">AI Monitoring</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-number">99.8%</span>
                                            <span className="stat-label">Threat Detection Rate</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Section - Moved Above the Fold */}
                            <div className={`form-section ${isFormFocused ? 'focused' : ''}`}>
                                <div className="form-header">
                                    <h2>Deploy AI Intelligence Analysis</h2>
                                    <p>Initialize comprehensive cyber intelligence assessment and threat surface analysis</p>
                                </div>

                                {/* Name Prompt */}
                                {isPromptActive && (
                                    <div className="name-prompt">
                                        <div className="name-input-group">
                                            <input
                                                type="text"
                                                placeholder="First Name"
                                                value={firstName}
                                                onChange={handleFirstNameChange}
                                                className="location-input"
                                                onFocus={() => setIsFormFocused(true)}
                                                onBlur={() => setIsFormFocused(false)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Last Name"
                                                value={lastName}
                                                onChange={handleLastNameChange}
                                                className="location-input"
                                                onFocus={() => setIsFormFocused(true)}
                                                onBlur={() => setIsFormFocused(false)}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* City and Country Input */}
                                <div className="location-input-container">
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            placeholder="City"
                                            className="location-input"
                                            value={city}
                                            onChange={handleCityChange}
                                            onFocus={() => setIsFormFocused(true)}
                                            onBlur={() => setIsFormFocused(false)}
                                        />
                                        {citySuggestions.length > 0 && (
                                            <ul className="suggestions">
                                                {citySuggestions.map((suggestion, index) => (
                                                    <li
                                                        key={index}
                                                        onClick={() => {
                                                            setCity(suggestion);
                                                            setCitySuggestions([]);
                                                        }}
                                                        className="suggestion-item"
                                                    >
                                                        {suggestion}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Country"
                                        className="location-input"
                                        value={country}
                                        onChange={handleCountryChange}
                                        onFocus={() => setIsFormFocused(true)}
                                        onBlur={() => setIsFormFocused(false)}
                                    />
                                    <button 
                                        onClick={handleContinue} 
                                        className="location-button"
                                        disabled={!city || !country}
                                    >
                                        <FaBrain />
                                        Deploy AI Analysis
                                    </button>
                                </div>

                                {/* Privacy Assurance */}
                                <div className="privacy-assurance">
                                    <div className="assurance-item">
                                        <FaLock />
                                        <span>Military-grade encryption</span>
                                    </div>
                                    <div className="assurance-item">
                                        <FaCheckCircle />
                                        <span>Zero-knowledge architecture</span>
                                    </div>
                                    <div className="assurance-item">
                                        <FaShieldAlt />
                                        <span>Enterprise security protocols</span>
                                    </div>
                                </div>
                            </div>

                            {/* What You'll Get Section */}
                            <div className="report-preview-section">
                                <h2>Your AI Intelligence Report Will Include:</h2>
                                <div className="report-features-grid">
                                    {reportFeatures.map((feature, index) => (
                                        <div key={index} className="report-feature-card">
                                            <div className="feature-icon">
                                                {feature.icon}
                                            </div>
                                            <h3>{feature.title}</h3>
                                            <p>{feature.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Data Categories Section */}
                            <div className="data-categories-section">
                                <h2>AI Intelligence Analysis Categories:</h2>
                                <div className="categories-grid">
                                    {dataCategories.map((category, index) => (
                                        <div key={index} className="category-card">
                                            <div className="category-icon">
                                                {category.icon}
                                            </div>
                                            <h3>{category.title}</h3>
                                            <ul className="category-items">
                                                {category.items.map((item, itemIndex) => (
                                                    <li key={itemIndex}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Social Proof Section */}
                            <div className="social-proof-section">
                                <h2>Trusted by Enterprise & Government</h2>
                                <div className="proof-stats">
                                    <div className="proof-stat">
                                        <FaUsers />
                                        <div className="proof-content">
                                            <span className="proof-number">500+</span>
                                            <span className="proof-label">Enterprise Clients</span>
                                        </div>
                                    </div>
                                    <div className="proof-stat">
                                        <FaExclamationTriangle />
                                        <div className="proof-content">
                                            <span className="proof-number">50M+</span>
                                            <span className="proof-label">Threats Detected</span>
                                        </div>
                                    </div>
                                    <div className="proof-stat">
                                        <FaCheckCircle />
                                        <div className="proof-content">
                                            <span className="proof-number">99.9%</span>
                                            <span className="proof-label">Uptime SLA</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Review Carousel Section */}
                            <div className="review-section">
                                <ReviewCarousel />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationPage;
