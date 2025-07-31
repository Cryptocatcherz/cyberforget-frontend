import React, { useState } from 'react';
import './FAQComponent.css';

const FAQComponent = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="faq-container">
            <h2 className="faq-title">Frequently Asked Questions</h2>
            {faqData.map((item, index) => (
                <div key={index} className="faq-card">
                    <div className="faq-header" onClick={() => toggleAccordion(index)}>
                        <h3>{item.title}</h3>
                        <span>{activeIndex === index ? '-' : '+'}</span>
                    </div>
                    {activeIndex === index && (
                        <div className="faq-content">
                            <p>{item.description}</p>
                            <ul>
                                {item.details.map((detail, i) => (
                                    <li key={i}>
                                        <strong>{detail.question}</strong> {detail.answer}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const faqData = [
    {
        title: "Data Collection",
        description: "CleanData prioritizes protecting your privacy by removing your data from online sources. We require certain information to accurately identify and remove your data from these platforms.",
        details: [
            {
                question: "Why is information needed?",
                answer: "To ensure we're removing the correct records, we may ask for details such as your full name, email address, and current address."
            },
            {
                question: "What happens if I don't provide information?",
                answer: "Without sufficient information, some requests may be declined by data brokers due to verification needs."
            }
        ]
    },
    {
        title: "Services",
        description: "CleanData specializes in removing personal data from online data brokers, enhancing your privacy across the web.",
        details: [
            {
                question: "Can CleanData remove court records?",
                answer: "No, court records are public by nature. CleanData focuses on personal data from online sources."
            },
            {
                question: "Can CleanData remove search results?",
                answer: "While we remove personal data from data brokers, you may need to contact search engines directly for specific search results."
            }
        ]
    },
    {
        title: "How To Guide",
        description: "After subscribing to CleanData, we recommend you complete your privacy profile to start the data removal process.",
        details: [
            {
                question: "Do I need to do anything else?",
                answer: "No, CleanData handles all removals for you. You can monitor progress via your dashboard."
            },
            {
                question: "Best usage tips:",
                answer: "For the best experience, access your dashboard on a desktop or tablet."
            }
        ]
    },
    {
        title: "Subscriptions",
        description: "Manage your CleanData subscription easily through your account settings.",
        details: [
            {
                question: "How to update?",
                answer: "Visit the subscription section to modify or renew your plan."
            },
            {
                question: "How to cancel?",
                answer: "Navigate to your account settings and select 'Cancel Subscription' to stop your service."
            }
        ]
    },
    {
        title: "Contact Us",
        description: "Our team is here to help. Reach out to us via call or email for any inquiries.",
        details: [
            {
                question: "Call Us:",
                answer: "+1 (424) 216-9253"
            },
            {
                question: "Email Us:",
                answer: "support@cleandata.com"
            }
        ]
    }
];

export default FAQComponent;
