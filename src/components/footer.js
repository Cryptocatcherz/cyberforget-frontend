import React, { useState } from "react";
import {
  FaShieldAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import "./footer.css"; // Import the CSS file

export function Footer() {
  const [hoveredLink, setHoveredLink] = useState(null);

  // Updated URLs
  const links = {
    aboutUs: "https://cyberforget.com/about",
    careers: "https://cyberforget.com/careers",
    privacyPolicy: "https://cyberforget.com/privacy-policy",
    termsOfService: "https://cyberforget.com/terms-of-service",
    contactUs: "https://cyberforget.com/contact",
    facebook: "https://facebook.com/cyberforget",
    twitter: "https://x.com/CyberForgetAI",
    linkedin: "https://linkedin.com/company/cyberforget",
    instagram: "https://instagram.com/cyberforget",
  };

  return (
    <footer className="footer">
      {/* Logo Section */}
      <a href={links.aboutUs} className="footer-logo">
        <FaShieldAlt className="logo-icon" />
        <span className="logo-title">CyberForget</span>
      </a>

      <div className="footer-content">
        {/* Company Info */}
        <div className="footer-column">
          <h4 className="footer-heading">About Us</h4>
          <p className="footer-description">
            Advanced AI-powered cyber intelligence platform. Industry-leading threat detection,
            digital security analysis, and comprehensive cyber defense solutions.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h4 className="footer-heading">Quick Links</h4>
          <nav>
            {[
              { name: "Intelligence Platform", link: links.aboutUs },
              { name: "Join Our Team", link: links.careers },
              { name: "Privacy Policy", link: links.privacyPolicy },
              { name: "Terms of Service", link: links.termsOfService },
              { name: "Contact Us", link: links.contactUs },
            ].map((item) => (
              <a
                key={item.name}
                href={item.link}
                className={`footer-link ${
                  hoveredLink === item.name ? "hover" : ""
                }`}
                onMouseEnter={() => setHoveredLink(item.name)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Social Media Links */}
        <div className="footer-column">
          <h4 className="footer-heading">Follow Us</h4>
          <div className="footer-socials">
            {[
              {
                icon: <FaFacebookF />,
                link: links.facebook,
                name: "Facebook",
              },
              {
                icon: <FaTwitter />,
                link: links.twitter,
                name: "Twitter",
              },
              {
                icon: <FaLinkedinIn />,
                link: links.linkedin,
                name: "LinkedIn",
              },
              {
                icon: <FaInstagram />,
                link: links.instagram,
                name: "Instagram",
              },
            ].map((social) => (
              <a
                key={social.name}
                href={social.link}
                className={`social-icon ${
                  hoveredLink === social.name ? "hover" : ""
                }`}
                onMouseEnter={() => setHoveredLink(social.name)}
                onMouseLeave={() => setHoveredLink(null)}
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} CyberForget AI. All rights reserved. Advanced Cyber Intelligence Platform.
      </div>
    </footer>
  );
}
