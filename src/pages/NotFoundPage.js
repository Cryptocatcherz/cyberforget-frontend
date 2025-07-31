// 404 Not Found Page
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaRobot, FaShieldAlt, FaComments, FaLock } from 'react-icons/fa';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const { isSignedIn } = useClerkAuth();
  const navigate = useNavigate();
  
  return (
    <div className="not-found-page-wrapper">
      {/* Simple navbar for 404 page */}
      <nav className="not-found-navbar">
        <Link to="/" className="not-found-logo">
          <FaShieldAlt className="logo-icon" />
          <span>CyberForget</span>
        </Link>
        {!isSignedIn && (
          <Link to="/login" className="not-found-login-btn">
            <FaLock className="btn-icon" />
            <span>Sign In</span>
          </Link>
        )}
      </nav>
      
      <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon-wrapper">
          <div className="not-found-icon">
            <FaRobot />
          </div>
          <div className="cyber-glow"></div>
        </div>
        
        <div className="not-found-header">
          <h1 className="glitch" data-text="404">404</h1>
          <h2>Oops! Lost in Cyberspace</h2>
        </div>
        
        <div className="not-found-message">
          <p>The page you're looking for has vanished into the digital void.</p>
          <p className="fun-message">Our AI is searching the entire internet... but still can't find it! 🔍</p>
        </div>
        
        <div className="not-found-actions">
          <button 
            onClick={() => navigate('/')} 
            className="primary-action-btn"
          >
            <FaComments className="btn-icon" />
            Chat with CyberForget AI
          </button>
          
          {!isSignedIn && (
            <button 
              onClick={() => navigate('/login')} 
              className="secondary-action-btn"
            >
              <FaLock className="btn-icon" />
              Sign In
            </button>
          )}
        </div>
        
        <div className="not-found-suggestions">
          <h3>Popular Security Tools</h3>
          <div className="suggestions-grid">
            <Link to="/" className="suggestion-card glow-card">
              <div className="card-icon-wrapper">
                <FaComments className="suggestion-icon" />
              </div>
              <span>AI Assistant</span>
              <p>Chat with our security AI</p>
            </Link>
            
            <Link to="/email-scan" className="suggestion-card glow-card">
              <div className="card-icon-wrapper">
                <FaSearch className="suggestion-icon" />
              </div>
              <span>Email Scanner</span>
              <p>Check for data breaches</p>
            </Link>
            
            <Link to="/password-check" className="suggestion-card glow-card">
              <div className="card-icon-wrapper">
                <FaShieldAlt className="suggestion-icon" />
              </div>
              <span>Password Check</span>
              <p>Test password strength</p>
            </Link>
            
            <Link to="/temp-email" className="suggestion-card glow-card">
              <div className="card-icon-wrapper">
                <FaLock className="suggestion-icon" />
              </div>
              <span>ForgetMail</span>
              <p>Temporary email service</p>
            </Link>
          </div>
        </div>
        
        <div className="not-found-footer">
          <p>If you think this is a mistake, you can always <Link to="/contact">contact our support team</Link>.</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default NotFoundPage;
