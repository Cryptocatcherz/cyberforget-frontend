import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import './ProgressTimeline.css';

const ProgressTimeline = ({ currentStep }) => {
    const [activeInfo, setActiveInfo] = useState(null);

    const steps = [
        { label: 'Confirm Details', info: 'Please confirm your details are correct.' },
        { label: 'We Scan', info: 'We scan for data brokers holding your info.' },
        { label: 'Contact Brokers', info: 'We contact data brokers to remove your data.' },
        { label: 'Done!', info: 'Your data gets removed.' },
    ];

    const handleInfoClick = (index, event) => {
        event.stopPropagation();
        setActiveInfo(activeInfo === index ? null : index);
    };

    const handleOutsideClick = () => {
        setActiveInfo(null);
    };

    return (
        <div className="progress-timeline" onClick={handleOutsideClick}>
            {steps.map((step, index) => (
                <div key={index} className={`step ${index <= currentStep ? 'active' : ''}`}>
                    <div className="step-circle">
                        {index + 1}
                        <FaInfoCircle 
                            className="info-icon" 
                            onClick={(e) => handleInfoClick(index, e)}
                        />
                    </div>
                    <span className="step-label">{step.label}</span>
                    {activeInfo === index && (
                        <div className="info-bubble">{step.info}</div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProgressTimeline;