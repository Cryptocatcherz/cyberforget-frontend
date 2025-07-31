import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaLock, FaExclamationTriangle, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { validatePassword } from '../utils/passwordUtils';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import LoadingSpinner from '../components/LoadingSpinner';
import './SetupPasswordPage.css';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://cleandata-test-app-961214fcb16c.herokuapp.com'
  : 'http://localhost:5002';

const SetupPasswordPage = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordValidationErrors, setPasswordValidationErrors] = useState([]);

    const validateToken = async () => {
        try {
            setIsLoading(true);
            setError('');

            const response = await fetch(`${API_BASE_URL}/api/users/validate-setup-token/${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': window.location.origin
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Failed to validate setup token');
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Token validation error:', error);
            setError(error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('Setup token:', token); // Debug log
        validateToken();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'password') {
            const errors = validatePassword(value);
            setPasswordValidationErrors(errors);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate password
        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            setError(passwordErrors[0]);
            return;
        }

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const response = await fetch(`${API_BASE_URL}/api/users/setup-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': window.location.origin
                },
                body: JSON.stringify({
                    setupToken: token,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Failed to set up password');
            }

            // Store the new JWT token if provided
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/login', {
                    state: { message: 'Password set successfully. Please log in with your new password.' }
                });
            }, 2000);

        } catch (error) {
            console.error('Password setup error:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="setup-password-page">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="setup-password-page">
            <div className="setup-password-container">
                <h1>Set Up Your Password</h1>
                
                {error && (
                    <div className="error-banner">
                        <FaExclamationTriangle />
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="success-banner">
                        <FaCheckCircle />
                        Password set successfully! Redirecting to login...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="setup-password-form">
                        <div className="form-field">
                            <label htmlFor="password">
                                <FaLock className="field-icon" />
                                Password
                            </label>
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <PasswordStrengthMeter password={formData.password} />
                            {passwordValidationErrors.length > 0 && (
                                <div className="password-requirements">
                                    {passwordValidationErrors.map((error, index) => (
                                        <div key={index} className="requirement">
                                            <FaExclamationTriangle size={12} />
                                            {error}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-field">
                            <label htmlFor="confirmPassword">
                                <FaLock className="field-icon" />
                                Confirm Password
                            </label>
                            <div className="password-input-container">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="submit-button">
                            Set Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SetupPasswordPage; 