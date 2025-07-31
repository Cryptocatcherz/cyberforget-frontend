import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaStar, FaTachometerAlt, FaWifi, FaKey, FaDatabase, FaGlobe, FaBan, FaComments } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import './MobileNavbar.css';
import { useAuth } from '../hooks/useAuthUtils';
import { useClerk } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import useWindowSize from '../hooks/useWindowSize';

const MobileNavbar = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isProToolsOpen, setProToolsOpen] = useState(false);
    const { user, loading } = useAuth();
    const { signOut } = useClerk();
    const navigate = useNavigate();
    const { width } = useWindowSize();

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
        if (isDropdownOpen) setDropdownOpen(false);

        // Toggle body class for scroll prevention
        if (!isMenuOpen) {
            document.body.classList.add('menu-open');
        } else {
            document.body.classList.remove('menu-open');
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
        setProToolsOpen(false);
    };
    
    const toggleProTools = () => {
        setProToolsOpen(!isProToolsOpen);
        setDropdownOpen(false);
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Cleanup to ensure body scroll is enabled when component unmounts
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (loading) {
        // Optionally, render a loading indicator or placeholder
        return null;
    }

    // Only show on mobile screens
    if (width > 768) return null;

    return (
        <React.Fragment>
            {/* Navbar Header */}
            <header className="navbar-header">
                <div className="navbar-content">
                    <Link to="/" className="logo-section" onClick={() => setMenuOpen(false)}>
                        <motion.div 
                            className="logo-wrapper-mobile"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <div className="logo-icon-container-mobile" style={{ width: 32, height: 32 }}>
                                <FaShieldAlt className="logo-icon-primary-mobile" style={{ fontSize: 18 }} />
                                <div className="logo-icon-glow-mobile"></div>
                                <div className="logo-icon-shine-mobile"></div>
                            </div>
                            <div className="text-wrapper-mobile">
                                <motion.span 
                                    className="navbar-title"
                                    style={{ fontSize: 18 }}
                                    whileHover={{ 
                                        backgroundPosition: "100% 50%",
                                        transition: { duration: 0.6, ease: "easeInOut" }
                                    }}
                                >
                                    CyberForget
                                </motion.span>
                                <motion.span 
                                    className="logo-subtitle"
                                    style={{ fontSize: 12, marginLeft: 4 }}
                                    whileHover={{ 
                                        color: "#42FFB5",
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    AI
                                </motion.span>
                            </div>
                        </motion.div>
                    </Link>
                    <button onClick={toggleMenu} className="menu-button" aria-label="Open menu">
                        {isMenuOpen ? <FiX className="menu-icon" /> : <FiMenu className="menu-icon" />}
                    </button>
                </div>
            </header>

            {/* Slide-In Menu */}
            <nav className={`slide-menu ${isMenuOpen ? 'open' : ''}`}>
                <div className="slide-menu-header">
                    <span className="slide-menu-title">Menu</span>
                    <button className="slide-menu-close" onClick={toggleMenu} aria-label="Close menu">
                        <FiX className="menu-icon" />
                    </button>
                </div>
                <ul className="menu-list">
                    <li className="menu-item">
                        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
                    </li>
                    {user && (
                        <li className="menu-item dashboard-item">
                            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="dashboard-link-mobile">
                                <FaTachometerAlt className="dashboard-icon" />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                    )}
                    {/* Free Tools Button with Dropdown */}
                    <li className="menu-item">
                        <motion.button 
                            className="free-tools-button"
                            onClick={toggleDropdown}
                            whileTap={{ scale: 0.98 }}
                            whileHover={{ y: -2 }}
                        >
                            Free Tools
                        </motion.button>
                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.ul
                                    className="dropdown-menu"
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ 
                                        opacity: 1, 
                                        y: 0, 
                                        scale: 1,
                                        transition: {
                                            duration: 0.3,
                                            ease: [0.4, 0, 0.2, 1]
                                        }
                                    }}
                                    exit={{ 
                                        opacity: 0, 
                                        y: -20, 
                                        scale: 0.95,
                                        transition: {
                                            duration: 0.2,
                                            ease: [0.4, 0, 1, 1]
                                        }
                                    }}
                                >
                                    {[
                                        { to: "/scamai", text: "CyberForget AI" },
                                        { to: "/location", text: "Free Broker Scan", className: "data-broker-item" },
                                        { to: "/data-leak", text: "Check Your Email" },
                                        { to: "/password-check", text: "Password Checker" },
                                        { to: "/area-codes", text: "Phone Number Checker" },
                                        { to: "/delete-account", text: "Account Deleter" },
                                        { to: "/password-analyzer", text: "Password Analyzer" },
                                        { to: "/file-scan", text: "Virus Scanner" },
                                        { to: "/temp-email", text: "ForgetMail" }
                                    ].map((item, index) => (
                                        <motion.li
                                            key={item.to}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ 
                                                opacity: 1, 
                                                x: 0,
                                                transition: {
                                                    duration: 0.3,
                                                    delay: index * 0.05,
                                                    ease: [0.4, 0, 0.2, 1]
                                                }
                                            }}
                                        >
                                            <Link 
                                                to={item.to} 
                                                onClick={() => { setMenuOpen(false); setDropdownOpen(false); }}
                                                className={item.className}
                                            >
                                                {item.text}
                                            </Link>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </li>
                    
                    {/* Pro Tools Button with Dropdown */}
                    <li className="menu-item">
                        <motion.button 
                            className="pro-tools-button"
                            onClick={toggleProTools}
                            whileTap={{ scale: 0.98 }}
                            whileHover={{ y: -2 }}
                        >
                            <FaStar className="pro-star-icon" />
                            Pro Tools
                        </motion.button>
                        <AnimatePresence>
                            {isProToolsOpen && (
                                <motion.ul
                                    className="dropdown-menu pro-tools-menu"
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ 
                                        opacity: 1, 
                                        y: 0, 
                                        scale: 1,
                                        transition: {
                                            duration: 0.3,
                                            ease: [0.4, 0, 0.2, 1]
                                        }
                                    }}
                                    exit={{ 
                                        opacity: 0, 
                                        y: -20, 
                                        scale: 0.95,
                                        transition: {
                                            duration: 0.2,
                                            ease: [0.4, 0, 1, 1]
                                        }
                                    }}
                                >
                                    {[
                                        { to: "/pricing", text: "VPN", icon: FaWifi },
                                        { to: "/pricing", text: "Password Manager", icon: FaKey },
                                        { to: "/pricing", text: "Data Removals", icon: FaDatabase },
                                        { to: "/pricing", text: "Site Scanner", icon: FaGlobe },
                                        { to: "/pricing", text: "Ad Blocker", icon: FaBan },
                                        { to: "/pricing", text: "Chat AI Pro", icon: FaComments }
                                    ].map((item, index) => (
                                        <motion.li
                                            key={item.text}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ 
                                                opacity: 1, 
                                                x: 0,
                                                transition: {
                                                    duration: 0.3,
                                                    delay: index * 0.05,
                                                    ease: [0.4, 0, 0.2, 1]
                                                }
                                            }}
                                        >
                                            <Link 
                                                to={item.to} 
                                                onClick={() => { setMenuOpen(false); setProToolsOpen(false); }}
                                                className="pro-tool-item"
                                            >
                                                <item.icon className="pro-tool-icon" />
                                                <span>{item.text}</span>
                                                <span className="pro-badge-mobile">PRO</span>
                                            </Link>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </li>
                    
                    <li className="menu-item sign-in">
                        {user ? (
                            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="sign-out-button">
                                Sign Out
                            </button>
                        ) : (
                            <Link to="/login" onClick={() => setMenuOpen(false)}>
                                Sign In
                            </Link>
                        )}
                    </li>
                </ul>
            </nav>
        </React.Fragment>
    );
};

export default MobileNavbar;
