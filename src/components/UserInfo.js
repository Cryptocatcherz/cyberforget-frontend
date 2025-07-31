import React from 'react';
import { FaUser, FaCalendar, FaTag } from 'react-icons/fa';
import './UserInfo.css';

const UserInfo = ({ user }) => {
    console.log('UserInfo component - user data:', user);

    const formatDate = (dateString) => {
        if (!dateString) {
            return 'Not available';
        }

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Not available';
            }

            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Not available';
        }
    };

    const calculateSubscriptionStatus = (memberSince, currentStatus) => {
        // Always use the actual status from Clerk/Stripe, don't calculate based on join date
        if (currentStatus) {
            return currentStatus;
        }

        // Default to free for new users without explicit subscription status
        return 'free';
    };

    const subscriptionStatus = calculateSubscriptionStatus(
        user?.memberSince,
        user?.subscriptionStatus
    );

    return (
        <div className="user-info">
            <h3 className="user-info-header">Account Info</h3>
            <div className="user-info-content">
                <div className="info-item">
                    <div className="info-label">
                        <FaUser /> Email
                    </div>
                    <div className="info-value user-email">
                        {user?.email || 'Not available'}
                    </div>
                </div>

                <div className="info-item">
                    <div className="info-label">
                        <FaCalendar /> Member since
                    </div>
                    <div className="info-value">
                        {formatDate(user?.memberSince)}
                    </div>
                </div>

                <div className="info-item">
                    <div className="info-label">
                        <FaTag /> Status
                    </div>
                    <div className={`status-badge ${subscriptionStatus.toLowerCase()}`}>
                        {subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;