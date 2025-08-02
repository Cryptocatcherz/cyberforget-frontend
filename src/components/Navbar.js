import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaLock, FaShieldVirus, FaSearchLocation, FaEnvelope, FaSignOutAlt, FaRobot, FaTrash, FaStar, FaBrain, FaTachometerAlt, FaInbox, FaWifi, FaKey, FaDatabase, FaGlobe, FaBan, FaComments } from 'react-icons/fa';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './Navbar.css';
import { useAuth } from '../hooks/useAuthUtils';
import { useClerk } from '@clerk/clerk-react';
import useWindowSize from '../hooks/useWindowSize';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isProToolsOpen, setProToolsOpen] = useState(false);
    const [hoveredLink, setHoveredLink] = useState(null);
    const dropdownRef = useRef(null);
    const proToolsRef = useRef(null);
    const { width } = useWindowSize();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { signOut } = useClerk();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        if (isOpen) setDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
        setProToolsOpen(false);
    };
    
    const toggleProTools = () => {
        setProToolsOpen(!isProToolsOpen);
        setDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (proToolsRef.current && !proToolsRef.current.contains(event.target)) {
                setProToolsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const dropdownItems = [
        { name: "CyberForget AI", link: '/scamai', icon: FaBrain },
        { name: "Free Broker Scan", link: '/location', icon: FaSearchLocation },
        { name: "Check Your Email", link: '/data-leak', icon: FaEnvelope },
        { name: "Password Checker", link: '/password-check', icon: FaLock },
        { name: "Phone Number Checker", link: '/area-codes', icon: FaSearchLocation },
        { name: "Account Deleter", link: '/delete-account', icon: FaTrash },
        { name: "Virus Scanner", link: '/file-scan', icon: FaShieldVirus },
        { name: "ForgetMail", link: '/temp-email', icon: FaInbox }
    ];
    
    const proToolsItems = [
        { name: "VPN", link: '/vpn', icon: FaWifi },
        { name: "Password Manager", link: '/password-managers', icon: FaKey },
        { name: "Data Removals", link: '/data-removal', icon: FaDatabase },
        { name: "Site Scanner", link: '/pricing', icon: FaGlobe },
        { name: "Ad Blocker", link: '/pricing', icon: FaBan },
        { name: "Chat AI Pro", link: '/scamai', icon: FaComments }
    ];

    if (width <= 768) return null;

    return (
        <header className={`navbar${user ? ' with-sidebar-connection' : ''}`}>
            <div className="navbar-content">
                <Link to="/" className="logo-container">
                    <motion.div 
                        className="logo-wrapper"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <div className="logo-icon-container">
                            <FaShieldAlt className="logo-icon-primary" />
                            <div className="logo-icon-glow"></div>
                            <div className="logo-icon-shine"></div>
                        </div>
                        <div className="text-wrapper">
                            <motion.span 
                                className="logo-text"
                                whileHover={{ 
                                    backgroundPosition: "100% 50%",
                                    transition: { duration: 0.6, ease: "easeInOut" }
                                }}
                            >
                                CyberForget
                            </motion.span>
                            <motion.span 
                                className="logo-subtitle"
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

                <nav className={`nav-links ${isOpen ? 'open' : ''}`}>
                    <a href="https://cyberforget.com" className="nav-link">Home</a>
                    <Link to="/pricing" className="nav-link">Pricing</Link>
                    
                    {user && (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to="/dashboard" className="nav-link dashboard-link">
                                <FaTachometerAlt />
                                <span>Dashboard</span>
                            </Link>
                        </motion.div>
                    )}

                    <div className="dropdown-container" ref={dropdownRef}>
                        <motion.button
                            className="dropdown-toggle"
                            onClick={toggleDropdown}
                            onMouseEnter={() => setHoveredLink('freeTools')}
                            onMouseLeave={() => setHoveredLink(null)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Free Tools {isDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
                        </motion.button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.ul
                                    className="dropdown"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {dropdownItems.map((item) => (
                                        <motion.li key={item.name}>
                                            <motion.button
                                                onClick={() => {
                                                    navigate(item.link);
                                                    setDropdownOpen(false);
                                                }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <item.icon />
                                                <span>{item.name}</span>
                                            </motion.button>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>
                    
                    <div className="dropdown-container" ref={proToolsRef}>
                        <motion.button
                            className="dropdown-toggle pro-tools-toggle"
                            onClick={toggleProTools}
                            onMouseEnter={() => setHoveredLink('proTools')}
                            onMouseLeave={() => setHoveredLink(null)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaStar className="pro-star-icon" />
                            Pro Tools {isProToolsOpen ? <FiChevronUp /> : <FiChevronDown />}
                        </motion.button>

                        <AnimatePresence>
                            {isProToolsOpen && (
                                <motion.ul
                                    className="dropdown pro-tools-dropdown"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {proToolsItems.map((item) => (
                                        <motion.li key={item.name}>
                                            <motion.button
                                                onClick={() => {
                                                    navigate(item.link);
                                                    setProToolsOpen(false);
                                                }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <item.icon className="pro-icon" />
                                                <span>{item.name}</span>
                                                <span className="pro-badge">PRO</span>
                                            </motion.button>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>

                    {user ? (
                        <motion.button
                            onClick={handleLogout}
                            className="logout-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>Sign Out</span>
                            <FaSignOutAlt />
                        </motion.button>
                    ) : (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to="/login" className="login-btn">
                                Sign In
                            </Link>
                        </motion.div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
