import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuthUtils";
import usePlanStatus from '../hooks/usePlanStatus';
import api from '../services/apiService';
import './EditInfoPage.css';

const EditInfo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, refreshUserData } = useAuth();
    const { planData, currentPlan, needsProfileCompletion, profileCompletion, refreshPlanData } = usePlanStatus();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        dateOfBirth: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const initializeForm = async () => {
            try {
                setLoading(true);
                
                // Check if coming from payment success
                const fromPayment = location.state?.fromPayment;
                const customerInfo = location.state?.customerInfo;

                if (fromPayment && customerInfo) {
                    // Use customer info from payment session
                    setFormData(prev => ({
                        ...prev,
                        ...customerInfo
                    }));
                } else if (user) {
                    // Fill in existing user data
                    setFormData(prev => ({
                        ...prev,
                        firstName: user.firstName || prev.firstName,
                        lastName: user.lastName || prev.lastName,
                        email: user.email || prev.email,
                        phone: user.phone || prev.phone,
                        address: user.address || prev.address,
                        city: user.city || prev.city,
                        state: user.state || prev.state,
                        zipCode: user.zipCode || prev.zipCode,
                        dateOfBirth: user.dateOfBirth || prev.dateOfBirth
                    }));
                }

                setLoading(false);
            } catch (error) {
                console.error('Error initializing form:', error);
                setError('Failed to load user information');
                setLoading(false);
            }
        };

        initializeForm();
    }, [user, location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            // Update user info
            await api.put('/users/profile', formData);
            
            // Refresh user data in context
            await refreshUserData();
            
            // Refresh plan data to update profile completion status
            await refreshPlanData();
            
            setSuccess(true);
            
            // Redirect based on context
            if (location.state?.fromPayment || needsProfileCompletion) {
                // Small delay to show success message
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile information');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const getPageTitle = () => {
        if (location.state?.fromPayment) return 'Complete Your Profile';
        if (needsProfileCompletion) return 'Complete Profile to Start Scanning';
        return 'Edit Your Information';
    };

    const getPageDescription = () => {
        if (needsProfileCompletion && currentPlan === 'TRIAL') {
            return 'Complete your profile to start using your 7-day trial and scan 500+ data broker sites.';
        }
        if (needsProfileCompletion && currentPlan === 'PREMIUM') {
            return 'Complete your profile to access all premium features and start scanning.';
        }
        if (location.state?.fromPayment) {
            return 'Please complete your profile information to activate your account.';
        }
        return 'Update your personal information and scanning preferences.';
    };

    return (
        <div className="edit-info-page">
            <div className="page-header">
                <h1>{getPageTitle()}</h1>
                <p className="page-description">{getPageDescription()}</p>
                
                {profileCompletion && (
                    <div className="profile-completion">
                        <div className="completion-bar">
                            <div 
                                className="completion-fill" 
                                style={{ width: `${profileCompletion.completionPercentage}%` }}
                            />
                        </div>
                        <span className="completion-text">
                            {profileCompletion.completionPercentage}% Complete
                        </span>
                    </div>
                )}
                
                {currentPlan && (
                    <div className={`plan-badge ${currentPlan.toLowerCase()}`}>
                        {currentPlan === 'TRIAL' ? 'Trial Active' : 
                         currentPlan === 'PREMIUM' ? 'Premium Active' : 
                         currentPlan}
                    </div>
                )}
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {success && (
                <div className="success-message">
                    Profile updated successfully! 
                    {needsProfileCompletion && ' Redirecting to dashboard...'}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                {/* Add other form fields as needed */}

                <button type="submit" className="submit-button">
                    {location.state?.fromPayment ? 'Complete Profile' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default EditInfo; 