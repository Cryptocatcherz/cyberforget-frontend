import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';
import './TOSPage.css';

const TOSPage = () => {
    return (
        <>
            <Helmet>
                <title>Terms of Service - CyberForget | AI Identity Protection Terms</title>
                <meta
                    name="description"
                    content="Read the Terms of Service for CyberForget's AI-powered identity protection and privacy protection services. Learn about your rights and responsibilities."
                />
            </Helmet>
            <Navbar />
            <MobileNavbar />
            
            <div className="tos-page-wrapper">
                <div className="tos-container">
                    <div className="tos-header">
                        <h1>Terms of Service</h1>
                        <p className="last-updated">Last Updated: December 11, 2024</p>
                    </div>

                    <div className="tos-content">
                        <div className="tos-intro">
                            <p>
                                These Terms of Service ("Terms") govern your access to and use of the CyberForget website and its AI-powered privacy and identity protection services. By accessing or using our services, you agree to comply with these Terms. Please read them carefully before proceeding.
                            </p>
                        </div>

                        <section className="tos-section">
                            <h2>1. Definitions</h2>
                            <ul>
                                <li><strong>"Terms":</strong> These Terms of Service.</li>
                                <li><strong>"We", "Our", "Us":</strong> Refers to CyberForget, an AI-first privacy and identity protection service.</li>
                                <li><strong>"You", "User":</strong> Refers to any individual or entity accessing or using the website or services.</li>
                                <li><strong>"Website":</strong> Refers to the CyberForget website and its subdomains, technologies, and content.</li>
                                <li><strong>"Services":</strong> Refers to the AI-powered privacy management, data removal, identity protection, and related services offered through CyberForget.</li>
                                <li><strong>"People Search Sites":</strong> Refers to data brokers, people search websites, online directories, and similar entities.</li>
                            </ul>
                        </section>

                        <section className="tos-section">
                            <h2>2. Registration and Account Security</h2>
                            <ul>
                                <li>To access certain services, you must create an account and provide accurate, current, and complete information.</li>
                                <li>You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</li>
                                <li>CyberForget is not liable for any loss or damage arising from your failure to safeguard your account information.</li>
                                <li>Refer to our Privacy Policy for details on how we process your personal data.</li>
                            </ul>
                        </section>

                        <section className="tos-section">
                            <h2>3. Use of Services</h2>
                            <ul>
                                <li>You agree to use the Services only for lawful purposes and in accordance with these Terms.</li>
                                <li>You will not provide false, misleading, or fraudulent information.</li>
                                <li>You will not impersonate any person or entity or misrepresent your affiliation with any person or entity.</li>
                                <li>CyberForget uses the information you provide to facilitate data removal and privacy protection from People Search Sites and other third parties.</li>
                                <li>We may contact third parties on your behalf to request data removal and may create accounts as necessary to fulfill your requests.</li>
                            </ul>
                        </section>

                        <section className="tos-section">
                            <h2>4. Subscriptions, Payments, and Refunds</h2>
                            <ul>
                                <li>Services may require payment via credit/debit card or other approved methods. Payments are processed by third-party providers.</li>
                                <li>Subscriptions renew automatically unless canceled prior to the next billing cycle. You may cancel at any time via your account dashboard.</li>
                                <li>Trial periods, if offered, convert to paid subscriptions unless canceled before expiration.</li>
                                <li>Refunds are granted at our sole discretion and subject to our Refund Policy.</li>
                            </ul>
                        </section>

                        <section className="tos-section">
                            <h2>5. Support</h2>
                            <p>
                                CyberForget provides support on a commercially reasonable basis. For assistance, contact <a href="mailto:support@cyberforget.com">support@cyberforget.com</a>.
                            </p>
                        </section>

                        <section className="tos-section">
                            <h2>6. Intellectual Property</h2>
                            <p>
                                All content, design, software, and technology on the CyberForget website are protected by intellectual property laws. You may not reproduce, distribute, modify, create derivative works from, publicly display, publicly perform, republish, download, store, or transmit any material on our website without our prior written consent.
                            </p>
                        </section>

                        <section className="tos-section">
                            <h2>7. Compliance and Data Protection</h2>
                            <ul>
                                <li>CyberForget complies with applicable data protection laws, including the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and other relevant privacy regulations.</li>
                                <li>We implement industry-standard security measures to protect your data. However, no method of transmission or storage is 100% secure.</li>
                            </ul>
                        </section>

                        <section className="tos-section">
                            <h2>8. Limitation of Liability</h2>
                            <ul>
                                <li>To the maximum extent permitted by law, CyberForget and its affiliates are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the website or services.</li>
                                <li>Our total liability for any claim related to the services will not exceed the amount you paid in the six months preceding the claim.</li>
                            </ul>
                        </section>

                        <section className="tos-section">
                            <h2>9. Indemnification</h2>
                            <p>
                                You agree to indemnify, defend, and hold harmless CyberForget, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your use of the Services or violation of these Terms.
                            </p>
                        </section>

                        <section className="tos-section">
                            <h2>10. Termination</h2>
                            <ul>
                                <li>CyberForget may suspend or terminate your access to the website and services at any time, with or without cause or notice.</li>
                                <li>Upon termination, your right to use the services will immediately cease, and CyberForget may delete your account and related data in accordance with our Privacy Policy.</li>
                            </ul>
                        </section>

                        <section className="tos-section">
                            <h2>11. Dispute Resolution and Arbitration</h2>
                            <ul>
                                <li>Any disputes arising out of or relating to these Terms or the Services shall be resolved through binding arbitration, except where prohibited by law.</li>
                                <li>By agreeing to these Terms, you waive your right to a jury trial or to participate in class action lawsuits.</li>
                                <li>You may opt out of arbitration by notifying us in writing within 30 days of first accepting these Terms.</li>
                            </ul>
                        </section>

                        <section className="tos-section">
                            <h2>12. Feedback</h2>
                            <p>
                                Any feedback, suggestions, or ideas you provide may be used by CyberForget without obligation or compensation, and we retain full rights to use such feedback for any purpose.
                            </p>
                        </section>

                        <section className="tos-section">
                            <h2>13. General Provisions</h2>
                            <ul>
                                <li>These Terms constitute the entire agreement between you and CyberForget. If any provision is found invalid, the remaining provisions will remain in effect.</li>
                                <li>These Terms are governed by the laws of the jurisdiction in which CyberForget operates, without regard to conflict of law principles.</li>
                                <li>CyberForget reserves the right to modify or replace these Terms at any time. Continued use of the Services after changes constitutes acceptance of the new Terms.</li>
                            </ul>
                        </section>

                        <section className="tos-section">
                            <h2>14. Severability</h2>
                            <p>
                                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.
                            </p>
                        </section>

                        <section className="tos-section">
                            <h2>15. Contact Us</h2>
                            <p>
                                For any questions about these Terms, please contact us at <a href="mailto:support@cyberforget.com">support@cyberforget.com</a>.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TOSPage; 