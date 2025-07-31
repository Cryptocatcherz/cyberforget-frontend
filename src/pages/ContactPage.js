import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';
import './ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [selectedDate, setSelectedDate] = useState(12);
    const [currentMonth, setCurrentMonth] = useState('January 2025');

    // Tech companies for scrolling animation with logo data
    const techCompanies = [
        { name: 'Adobe', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/adobe/adobe-original.svg' },
        { name: 'AWS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
        { name: 'Google', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg' },
        { name: 'Figma', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
        { name: 'Microsoft', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg' },
        { name: 'Apple', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg' },
        { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
        { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
        { name: 'Spotify', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg' },
        { name: 'Dropbox', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dropbox/dropbox-original.svg' },
        { name: 'Slack', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg' },
        { name: 'GitHub', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
        { name: 'OpenAI', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
        { name: 'Stripe', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg' }
    ];

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const toggleFAQ = (index) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    const faqData = [
        {
            question: "How can I contact CleanData.me support?",
            answer: "You can reach our support team by email at john@cleandata.me, or use the contact form on this page. We typically respond within 24 hours during business days."
        },
        {
            question: "What are your business hours?",
            answer: "Our support team is available Monday through Friday, 9:00 AM to 6:00 PM EST. While we may not respond immediately outside these hours, we'll get back to you as soon as possible."
        },
        {
            question: "How long does it take to remove my data?",
            answer: "Data removal timelines vary by site, but typically take 7-30 days. Some sites respond faster, while others may take longer due to their internal processes. We'll keep you updated on the progress."
        },
        {
            question: "Can I schedule a consultation call?",
            answer: "Yes! For enterprise clients or complex cases, we offer consultation calls. Please mention this in your message, and we'll provide you with available time slots."
        },
        {
            question: "Do you offer phone support?",
            answer: "Currently, we primarily handle support through email and our contact form to ensure we can provide detailed, documented assistance. For urgent matters, please mark your message as 'Urgent' in the subject line."
        }
    ];

    return (
        <>
            <Helmet>
                <title>Contact Us - CleanData.me | Get Support & Ask Questions</title>
                <meta
                    name="description"
                    content="Contact CleanData.me for support, questions, or to learn more about our data removal services. We're here to help protect your privacy."
                />
            </Helmet>
            <Navbar />
            <MobileNavbar />
            
            <div className="contact-page-wrapper">
                <div className="contact-container">
                    <div className="contact-hero">
                        <h1>Reach out to us anytime</h1>
                        <p>
                            Whether you have questions about our platform, need technical support, 
                            or want to learn more about our solutions, our team is ready to assist you.
                        </p>
                    </div>

                    <div className="tech-stack-section">
                        <p className="tech-stack-label">Trusted by teams at</p>
                        <div className="tech-stack-scroll">
                            <div className="tech-stack-track">
                                {[...techCompanies, ...techCompanies].map((company, index) => (
                                    <div key={index} className="tech-company">
                                        <img 
                                            src={company.logo} 
                                            alt={company.name}
                                            className="company-logo"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                        <span className="company-name" style={{display: 'none'}}>
                                            {company.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="contact-content">
                        <div className="contact-form-section">
                            <div className="contact-info">
                                <div className="calendar-widget">
                                    <div className="calendar-header">
                                        <div className="avatar">
                                            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80" alt="Support Agent" />
                                        </div>
                                        <div className="calendar-info">
                                            <h3>CleanData Support</h3>
                                            <h2>Schedule a Call</h2>
                                            <p className="calendar-description">
                                                <span className="info-icon">ℹ️</span>
                                                Book a call and we'll help you protect your privacy. 
                                                Our team will guide you through the process.
                                            </p>
                                            <div className="calendar-meta">
                                                <span className="duration">🕒 30 min</span>
                                                <span className="platform">💻 Zoom</span>
                                                <span className="timezone">🌍 EST</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="calendar-grid">
                                        <div className="calendar-month">{currentMonth}</div>
                                        <div className="calendar-weekdays">
                                            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span className="weekend">S</span><span className="weekend">S</span>
                                        </div>
                                        <div className="calendar-days">
                                            {[...Array(31)].map((_, i) => {
                                                const day = i + 1;
                                                const isSelected = day === selectedDate;
                                                const isWeekend = [7, 8, 14, 15, 21, 22, 28, 29].includes(day);
                                                return (
                                                    <button
                                                        key={day}
                                                        className={`calendar-day ${isSelected ? 'selected' : ''} ${isWeekend ? 'weekend' : ''}`}
                                                        onClick={() => setSelectedDate(day)}
                                                    >
                                                        {day}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button className="schedule-btn">
                                            Schedule Call
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="contact-methods">
                                    <div className="contact-method">
                                        <h3>Email Support</h3>
                                        <p>
                                            <a href="mailto:john@cleandata.me">john@cleandata.me</a>
                                        </p>
                                        <span>Response time: Within 24 hours</span>
                                    </div>
                                    
                                    <div className="contact-method">
                                        <h3>Business Hours</h3>
                                        <p>Monday - Friday</p>
                                        <span>9:00 AM - 6:00 PM EST</span>
                                    </div>
                                </div>
                            </div>

                            <div className="contact-form">
                                <h2>Send us a Message</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-field">
                                            <label htmlFor="name">Full Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label htmlFor="email">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="form-field">
                                        <label htmlFor="subject">Subject</label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select a topic</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="support">Technical Support</option>
                                            <option value="billing">Billing Question</option>
                                            <option value="data-removal">Data Removal Request</option>
                                            <option value="enterprise">Enterprise Solutions</option>
                                            <option value="urgent">Urgent Issue</option>
                                        </select>
                                    </div>
                                    
                                    <div className="form-field">
                                        <label htmlFor="message">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows="6"
                                            placeholder="Please describe your question or issue in detail..."
                                            required
                                        />
                                    </div>
                                    
                                    <button type="submit" className="submit-button">
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="faq-section">
                            <h2>Frequently Asked Questions</h2>
                            <div className="faq-list">
                                {faqData.map((faq, index) => (
                                    <div key={index} className="faq-item">
                                        <button
                                            className="faq-question"
                                            onClick={() => toggleFAQ(index)}
                                            aria-expanded={expandedFAQ === index}
                                        >
                                            <span>{faq.question}</span>
                                            <span className={`faq-icon ${expandedFAQ === index ? 'expanded' : ''}`}>
                                                +
                                            </span>
                                        </button>
                                        {expandedFAQ === index && (
                                            <div className="faq-answer">
                                                <p>{faq.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cta-section">
                            <h2>Ready to Protect Your Privacy?</h2>
                            <p>Start your free scan to see what personal information is exposed online.</p>
                            <div className="cta-buttons">
                                <a href="/location" className="cta-button primary">
                                    Start Free Scan
                                </a>
                                <a href="/pricing" className="cta-button secondary">
                                    View Pricing
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactPage; 