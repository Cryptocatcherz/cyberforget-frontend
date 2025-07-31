import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './CollapsibleSection.css'; // Alternatively, integrate styles within EditInfoPage.css
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const CollapsibleSection = ({ title, children, icon }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSection = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="collapsible-section">
            <button
                type="button"
                className="collapsible-header"
                onClick={toggleSection}
                aria-expanded={isOpen}
                aria-controls={`section-${title.replace(/\s+/g, '-')}`}
            >
                <div className="collapsible-icon">
                    {icon}
                </div>
                <div className="collapsible-title">{title}</div>
                <div className="collapsible-toggle">
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>
            </button>
            {isOpen && (
                <div className="collapsible-content" id={`section-${title.replace(/\s+/g, '-')}`}>
                    {children}
                </div>
            )}
        </div>
    );
};

CollapsibleSection.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    icon: PropTypes.node,
};

CollapsibleSection.defaultProps = {
    icon: null,
};

export default CollapsibleSection;
