import React, { useState, useEffect } from 'react';
import featureToggleService from '../services/featureToggleService';
import { useAuth } from "../hooks/useAuthUtils";
import './FeatureToggles.css';

const FeatureToggle = ({ label, isEnabled, onChange, isLoading }) => (
    <div className="feature-toggle-item">
        <label className="toggle-label">{label}</label>
        <div className={`toggle-switch ${isEnabled ? 'enabled' : ''} ${isLoading ? 'loading' : ''}`}
             onClick={() => !isLoading && onChange(!isEnabled)}>
            <div className="toggle-slider">
                {isLoading && <div className="toggle-loading"></div>}
            </div>
        </div>
    </div>
);

const FeatureToggles = ({ toggles: initialToggles = {} }) => {
    const [loading, setLoading] = useState({});
    const [localToggles, setLocalToggles] = useState(initialToggles);
    const [error, setError] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const { isAuthenticated, user } = useAuth();

    const features = [
        { key: 'multi_factor_auth', label: 'Multi Factor Auth' },
        { key: 'role_based_access', label: 'Role Based Access' },
        { key: 'monitoring_verification', label: 'Monitoring Verification' },
        { key: 'data_leak_notification', label: 'Data Leak Notification' }
    ];

    // Fetch initial toggles from server
    useEffect(() => {
        const fetchToggles = async () => {
            if (!isAuthenticated || !user?.id) return;

            try {
                setError(null);
                const result = await featureToggleService.getFeatureToggles(user.id);
                
                if (result.success) {
                    console.log('[FeatureToggles] Loaded feature toggles:', result.data);
                    setLocalToggles(result.data);
                } else {
                    throw new Error(result.error || 'Failed to load feature toggles');
                }
            } catch (error) {
                console.error('[FeatureToggles] Error fetching feature toggles:', error);
                setError('Failed to load features. Using local settings.');
                setLocalToggles(initialToggles);
            }
        };

        fetchToggles();
    }, [isAuthenticated, user?.id, initialToggles]);

    // Set up real-time subscription for feature toggle changes
    useEffect(() => {
        // Real-time updates handled by WebSocket
        // The API-first approach with optimistic updates provides sufficient UX
        console.log('[FeatureToggles] Skipping real-time subscriptions - using API-first approach');
        
        // Cleanup function (no-op since we're not creating subscriptions)
        return () => {
            console.log('[FeatureToggles] No subscriptions to clean up');
        };
    }, [isAuthenticated, user?.id]);

    const handleToggle = async (toggleName) => {
        if (!isAuthenticated || !user?.id) {
            setError('Please log in to modify features');
            return;
        }

        setLoading(prev => ({ ...prev, [toggleName]: true }));
        setError(null);
        
        const newValue = !localToggles[toggleName];
        
        // Optimistic update
        setLocalToggles(prev => ({
            ...prev,
            [toggleName]: newValue
        }));
        
        try {
            const result = await featureToggleService.updateFeatureToggle(
                toggleName, 
                newValue, 
                user.id
            );

            if (result.success) {
                console.log('[FeatureToggles] Feature toggle updated successfully');
                
                // Update with server response if available
                if (result.data) {
                    setLocalToggles(result.data);
                }
            } else {
                throw new Error(result.error || 'Failed to update feature');
            }
        } catch (error) {
            console.error('[FeatureToggles] Error updating feature toggle:', error);
            setError('Failed to update feature. Please try again.');
            
            // Revert optimistic update
            setLocalToggles(prev => ({
                ...prev,
                [toggleName]: !newValue
            }));
        } finally {
            setLoading(prev => ({ ...prev, [toggleName]: false }));
        }
    };

    return (
        <div className="feature-toggles-container">
            <h3 className="feature-toggles-title">
                Features
            </h3>
            {error && (
                <div className="feature-toggles-error">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                </div>
            )}
            <div className="feature-toggles-list">
                {features.map(({ key, label }) => (
                    <FeatureToggle
                        key={key}
                        label={label}
                        isEnabled={localToggles[key]}
                        onChange={() => handleToggle(key)}
                        isLoading={loading[key]}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeatureToggles;