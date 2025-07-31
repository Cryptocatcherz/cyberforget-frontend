import React, { useState, useEffect } from 'react';
import './DataPointsComponent.css';
import {
    FaFileAlt, FaUser, FaMapMarkerAlt, FaPhone, FaExclamationTriangle,
    FaGavel, FaMoneyBill, FaCreditCard, FaBuilding, FaUsers,
    FaEnvelope, FaCalendarAlt, FaHistory, FaHeart, FaUserSecret,
    FaLink, FaFacebookF
} from 'react-icons/fa';

const DataPointsComponent = () => {
    const dataPoints = [
        { icon: <FaFileAlt />, label: 'Civil Records', special: true },
        { icon: <FaUser />, label: 'Name' },
        { icon: <FaMapMarkerAlt />, label: 'Street Address' },
        { icon: <FaPhone />, label: 'Mobile Phone' },
        { icon: <FaUsers />, label: 'Relatives' },
        { icon: <FaExclamationTriangle />, label: 'Evictions' },
        { icon: <FaBuilding />, label: 'Property Records' },
        { icon: <FaGavel />, label: 'Traffic Tickets' },
        { icon: <FaGavel />, label: 'Disputes & Lawsuits' },
        { icon: <FaMoneyBill />, label: 'Bankruptcies' },
        { icon: <FaMoneyBill />, label: 'Debt & Liens' },
        { icon: <FaGavel />, label: 'Legal Judgments' },
        { icon: <FaCreditCard />, label: 'Credit Score' },
        { icon: <FaUser />, label: 'Spouse Name' },
        { icon: <FaCalendarAlt />, label: 'Age' },
        { icon: <FaPhone />, label: 'Landline' },
        { icon: <FaHistory />, label: 'Residence History' },
        { icon: <FaHeart />, label: 'Marriage & Divorce' },
        { icon: <FaUserSecret />, label: 'Aliases' },
        { icon: <FaFacebookF />, label: 'Social Media' },
        { icon: <FaEnvelope />, label: 'Personal Email' },
        { icon: <FaBuilding />, label: 'Foreclosures' },
        { icon: <FaUsers />, label: 'Neighbors' },
        { icon: <FaLink />, label: 'Jobs, Work History' }
    ];

    const [showMore, setShowMore] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    const visibleDataPoints = showMore || !isMobile ? dataPoints : dataPoints.slice(0, 7);

    return (
        <div className="datapoints-container">
            <div className="alert-banner">
                Highly Sensitive Information
            </div>
            <p className="description">
                Data brokers expose the following details about individuals. Let's{' '}
                <a href="#remove" className="remove-link">
                    remove them now
                </a>
                .
            </p>
            <div className="data-point-tags">
                {visibleDataPoints.map((point, index) => (
                    <div key={index} className={`data-point ${point.special ? 'special' : ''}`}>
                        <div className="icon">{point.icon}</div>
                        <span>{point.label}</span>
                    </div>
                ))}
            </div>
            {isMobile && (
                <button className="toggle-button" onClick={toggleShowMore}>
                    {showMore ? 'Show Less' : 'Show More'}
                </button>
            )}
        </div>
    );
};

export default DataPointsComponent;
