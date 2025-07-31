import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy - CyberForget | AI-First Identity Protection</title>
                <meta
                    name="description"
                    content="Read the Privacy Policy for CyberForget's AI-powered identity protection and privacy protection services. Learn how we collect, use, and protect your personal information."
                />
            </Helmet>
            <Navbar />
            <MobileNavbar />
            
            <div className="privacy-page-wrapper">
                <div className="privacy-container">
                    <div className="privacy-header">
                        <h1>Privacy Policy</h1>
                        <p className="last-updated">Last Updated: September 2025</p>
                    </div>

                    <div className="privacy-content">
                        <div className="privacy-intro">
                            <p>
                                At <strong>CyberForget</strong>, we are committed to protecting your privacy and personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you interact with our AI-powered privacy and identity protection services. Please read this policy carefully to understand our practices regarding your personal data and how we will treat it.
                            </p>
                        </div>

                        <section className="privacy-section">
                            <h2>1. Definitions</h2>
                            <ul>
                                <li><strong>"Policy":</strong> This Privacy Policy.</li>
                                <li><strong>"We", "Our", "Us":</strong> Refers to CyberForget.</li>
                                <li><strong>"You", "Your":</strong> Refers to you as a user of our website or services.</li>
                                <li><strong>"Website":</strong> Refers to the CyberForget website where this Policy is published.</li>
                                <li><strong>"Services":</strong> Refers to the AI-powered privacy management, data removal, identity protection, and related services we provide.</li>
                                <li><strong>"Personal Information":</strong> Any data that can identify you as an individual.</li>
                            </ul>
                        </section>

                        <section className="privacy-section">
                            <h2>2. Data We Collect and How We Collect It</h2>
                            <p>We are transparent about how we handle your personal information. We collect data in the following ways:</p>
                            <ul>
                                <li><strong>Direct Information:</strong> Data such as your name, email, phone number, and date of birth provided when using our services.</li>
                                <li><strong>Automatically Collected Data:</strong> Technical data such as your IP address, browser type, and site behavior via cookies and analytics.</li>
                                <li><strong>Cookies and Tracking Technologies:</strong> We use essential cookies and third-party tools to enhance your experience and security.</li>
                                <li><strong>Third-Party Data:</strong> Information we may receive from partners such as payment processors and analytics providers.</li>
                            </ul>
                        </section>

                        <section className="privacy-section">
                            <h2>3. Legal Bases for Processing Your Information</h2>
                            <p>We process your personal information based on the following legal grounds, in compliance with GDPR, CCPA, and other applicable laws:</p>
                            <ul>
                                <li><strong>Consent:</strong> You have given clear consent for us to process your personal data for a specific purpose.</li>
                                <li><strong>Contract:</strong> Processing is necessary for a contract we have with you, or because you have asked us to take specific steps before entering into a contract.</li>
                                <li><strong>Legal Obligation:</strong> Processing is necessary for us to comply with the law.</li>
                                <li><strong>Legitimate Interests:</strong> Processing is necessary for our legitimate interests or those of a third party, unless overridden by your data protection rights.</li>
                            </ul>
                        </section>

                        <section className="privacy-section">
                            <h2>4. How We Use Your Information</h2>
                            <p>We use your data to:</p>
                            <ul>
                                <li>Provide, operate, and maintain our AI-powered Services.</li>
                                <li>Improve, personalize, and expand our Services.</li>
                                <li>Understand and analyze how you use our Services.</li>
                                <li>Develop new products, services, features, and functionality.</li>
                                <li>Communicate with you, including for customer service, updates, and marketing (where permitted by law).</li>
                                <li>Process your transactions securely.</li>
                                <li>Detect, prevent, and address fraud, abuse, or security issues.</li>
                            </ul>
                        </section>

                        <section className="privacy-section">
                            <h2>5. Sharing Your Information</h2>
                            <p>We only share your data with trusted partners or when legally required. This includes:</p>
                            <ul>
                                <li><strong>Service Providers:</strong> Third parties who perform services for us or on our behalf, such as payment processing, data analysis, email delivery, hosting, customer service, and marketing assistance.</li>
                                <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or asset sale, your personal information may be transferred.</li>
                                <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
                                <li><strong>With Your Consent:</strong> We may share your information with other third parties when we have your consent to do so.</li>
                            </ul>
                        </section>

                        <section className="privacy-section">
                            <h2>6. Data Retention</h2>
                            <p>
                                We retain your data only as long as necessary to provide our services or meet legal obligations. Once no longer needed, data is securely deleted or anonymized.
                            </p>
                        </section>

                        <section className="privacy-section">
                            <h2>7. Security Measures</h2>
                            <p>
                                We employ industry-standard security measures, including encryption, access controls, and secure server facilities, to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
                            </p>
                        </section>

                        <section className="privacy-section">
                            <h2>8. Children’s Privacy</h2>
                            <p>
                                Our services are not intended for children under 16. If you believe a child has provided personal data, please contact us for its removal.
                            </p>
                        </section>

                        <section className="privacy-section">
                            <h2>9. Cookies and Tracking Technologies</h2>
                            <p>
                                We use cookies and similar tracking technologies to track activity on our Website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. Some features may not function without cookies.
                            </p>
                        </section>

                        <section className="privacy-section">
                            <h2>10. User Rights</h2>
                            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
                            <ul>
                                <li><strong>Right to Access:</strong> Request access to the personal information we hold about you.</li>
                                <li><strong>Right to Rectification:</strong> Request corrections to any inaccurate or incomplete personal information.</li>
                                <li><strong>Right to Erasure:</strong> Request deletion of your personal information under certain circumstances.</li>
                                <li><strong>Right to Restrict Processing:</strong> Request limitation of processing your personal information.</li>
                                <li><strong>Right to Data Portability:</strong> Request transfer of your personal information to another service provider.</li>
                                <li><strong>Right to Object:</strong> Object to the processing of your personal information under certain conditions.</li>
                            </ul>
                            <p>To exercise these rights, contact us at <a href="mailto:support@cyberforget.com">support@cyberforget.com</a>.</p>
                        </section>

                        <section className="privacy-section">
                            <h2>11. International Data Transfers</h2>
                            <p>
                                Your information, including Personal Information, may be transferred to and maintained on computers located outside your state, province, country, or other governmental jurisdiction where data protection laws may differ. By using our services, you consent to such transfers.
                            </p>
                        </section>

                        <section className="privacy-section">
                            <h2>12. Third-Party Links and Services</h2>
                            <p>
                                CyberForget may link to third-party websites and services. We are not responsible for the privacy practices or content of these third parties. We encourage you to review the privacy policies of each website you visit.
                            </p>
                        </section>

                        <section className="privacy-section">
                            <h2>13. Modifications to This Policy</h2>
                            <p>
                                We may update this Policy as our services evolve or as required by law. We will notify you of any significant changes by posting the new Privacy Policy on this page. Please review this Privacy Policy periodically for any changes.
                            </p>
                        </section>

                        <section className="privacy-section">
                            <h2>14. Contact Us</h2>
                            <p>
                                For privacy-related inquiries or to exercise your rights, contact us at <a href="mailto:support@cyberforget.com">support@cyberforget.com</a>.
                            </p>
                        </section>

                        <section className="privacy-section">
                            <h2>15. Business Clients</h2>
                            <p>
                                This Policy does not cover handling of business clients' data. Please contact us for more details on business-related privacy policies.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicyPage; 