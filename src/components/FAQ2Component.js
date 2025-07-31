import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import './FAQ2Component.css';

const FAQ2Component = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Why does CleanData need to collect this information?",
      answer: "This information is critical for removing your data from data broker websites. We need to confirm different pieces of information about you to ensure we're removing the correct data. We only use this information for data removal purposes."
    },
    {
      question: "Is my information secure?",
      answer: "Yes, we take your privacy seriously. We use industry-standard encryption and security measures to protect your data. We never share or sell your information to third parties."
    },
    {
      question: "What if I don't want to provide all details?",
      answer: "You can provide as much or as little information as you're comfortable with. However, please note that our ability to remove your data effectively depends on the information we receive from you."
    },
    {
      question: "How long does the data removal process take?",
      answer: "The process typically takes 2-3 days per data broker. We continuously scan and monitor to ensure your data remains removed."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-header">Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <button className="faq-question" onClick={() => toggleFAQ(index)}>
            {activeIndex === index ? <FaMinus className="faq-icon" /> : <FaPlus className="faq-icon" />}
            {faq.question}
          </button>
          {activeIndex === index && <p className="faq-answer">{faq.answer}</p>}
        </div>
      ))}
    </div>
  );
};

export default FAQ2Component;