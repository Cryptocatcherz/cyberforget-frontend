import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    FaUser, FaEnvelope, FaPhone, FaHome, FaGlobe, FaCity, 
    FaMapPin, FaLock, FaInfoCircle, FaShieldAlt, FaPlus, 
    FaTimes, FaCheck, FaExclamationTriangle, FaCheckCircle, FaEye, FaEyeSlash 
} from 'react-icons/fa';
import './EditInfoPage.css';
import { useAuth } from "../hooks/useAuthUtils";
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';
import { validatePassword } from '../utils/passwordUtils';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import authService from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';

const countriesWithStates = [
    'United States',
    'Canada',
    'Australia',
    'India',
    'Brazil',
    'Mexico',
    'Germany',
    'China',
    'Russia'
];

const EditInfoPage = () => {
    const navigate = useNavigate();
    const { token: setupToken } = useParams();
    const { user, setUser, refreshUserData } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        additionalEmails: [],
        additionalPhones: [],
        address: '',
        country: '',
        state: '',
        city: '',
        zipCode: '',
        dateOfBirth: '',
        password: '',
        confirmPassword: '',
    });

    const [currentSection, setCurrentSection] = useState('personal');
    const [error, setError] = useState('');
    const [sectionProgress, setSectionProgress] = useState({
        personal: { visited: true, completed: false },
        contact: { visited: false, completed: false },
        address: { visited: false, completed: false }
    });
    
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [formStatus, setFormStatus] = useState('unsubmitted');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [termsError, setTermsError] = useState('');
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [formSection, setFormSection] = useState('personal'); // ['personal', 'contact', 'address']
    const [formProgress, setFormProgress] = useState({
        personal: { completed: false, valid: false },
        contact: { completed: false, valid: false },
        address: { completed: false, valid: false }
    });

    const [options, setOptions] = useState({
        states: [],
        cities: []
    });

    const [isLoading, setIsLoading] = useState(true);

    const [passwordValidationErrors, setPasswordValidationErrors] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const abortController = new AbortController();

        const fetchUserData = async () => {
            console.log('Starting fetchUserData with setupToken:', setupToken);
            
            // Always attempt to fetch data when in setup mode, regardless of existing form data
            if (!setupToken && formData.firstName && formData.lastName && formData.email) {
                setIsLoading(false);
                console.log('Form data already populated, skipping fetch');
                return;
            }

            try {
                setIsLoading(true);
                setError('');

                let userData;
                
                if (setupToken) {
                    // For setup token flow, use the auth service method
                    console.log('Fetching user data by setup token:', setupToken);
                    userData = await authService.getUserBySetupToken(setupToken);
                } else {
                    // For regular authenticated users, get profile data
                    console.log('Fetching authenticated user profile');
                    userData = await authService.getUserProfile();
                }

                console.log('Raw user data received:', userData);

                if (!isMounted) {
                    console.log('Component unmounted, stopping update');
                    return;
                }

                if (userData.error) {
                    throw new Error(userData.error);
                }

                // Map the backend response to our frontend format
                const userUpdate = {
                    id: userData.id,
                    email: userData.email,
                    firstName: userData.firstName || userData.first_name || '',
                    lastName: userData.lastName || userData.last_name || '',
                    role: userData.role,
                    setupToken: userData.setup_token || userData.setupToken,
                    setupTokenExpires: userData.setup_token_expires || userData.setupTokenExpires
                };

                console.log('Prepared user update:', userUpdate);

                const formUpdate = {
                    email: userData.email || '',
                    firstName: userData.firstName || userData.first_name || '',
                    lastName: userData.lastName || userData.last_name || '',
                    phoneNumber: userData.phone || userData.phoneNumber || '',
                    address: userData.address || userData.streetAddress || '',
                    country: userData.country || '',
                    state: userData.state || '',
                    city: userData.city || '',
                    zipCode: userData.zip_code || userData.zipCode || userData.postalCode || '',
                    additionalEmails: userData.additional_emails || userData.additionalEmails || [],
                    additionalPhones: userData.additional_phones || userData.additionalPhones || [],
                    // Clear password fields in setup mode
                    password: '',
                    confirmPassword: ''
                };

                console.log('Setting form data to:', formUpdate);
                setFormData(formUpdate);

                // Update user context if not in setup mode
                if (!setupToken && setUser) {
                    setUser(prevUser => ({ ...prevUser, ...userUpdate }));
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                
                if (!isMounted) return;

                if (error.response?.status === 401) {
                    if (setupToken) {
                        setError('Invalid or expired setup token. Please request a new setup link.');
                    } else {
                        localStorage.removeItem('token');
                        navigate('/login', { 
                            state: { 
                                error: 'Session expired. Please log in again.',
                                returnUrl: window.location.pathname
                            } 
                        });
                        return;
                    }
                } else if (error.response?.status === 404 && setupToken) {
                    setError('Setup token not found. Please request a new setup link.');
                } else {
                    setError(error.message || 'Failed to load user data. Please try again.');
                }
                
                setIsLoading(false);
            }
        };

        fetchUserData();

        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, [setupToken, setUser, navigate]);

    const validateSection = (section) => {
        const newErrors = {};
        
        switch (section) {
            case 'personal':
                if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
                if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
                if (!formData.email?.trim()) {
                    newErrors.email = 'Email is required';
                } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                    newErrors.email = 'Email is invalid';
                }
                break;
                
            case 'contact':
                // Phone number validation (optional but must be valid if provided)
                if (formData.phoneNumber?.trim() && !/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
                    newErrors.phoneNumber = 'Please enter a valid phone number';
                }
                
                // Additional emails validation
                formData.additionalEmails?.forEach((email, index) => {
                    if (email.trim() && !/\S+@\S+\.\S+/.test(email)) {
                        newErrors[`additionalEmails_${index}`] = 'Please enter a valid email address';
                    }
                });
                
                // Additional phones validation
                formData.additionalPhones?.forEach((phone, index) => {
                    if (phone.trim() && !/^\+?[\d\s\-\(\)]+$/.test(phone)) {
                        newErrors[`additionalPhones_${index}`] = 'Please enter a valid phone number';
                    }
                });
                break;
                
            case 'address':
                if (!formData.address?.trim()) newErrors.address = 'Address is required';
                if (!formData.country?.trim()) newErrors.country = 'Country is required';
                if (!formData.city?.trim()) newErrors.city = 'City is required';
                // State and zip code are optional depending on country
                break;
        }
        
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear errors for this field
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
        }
    };

    const handleCountryChange = async (e) => {
        const country = e.target.value;
        setFormData({ ...formData, country, state: '', city: '' });
        
        // Clear country-related errors
        setErrors((prevErrors) => ({ 
            ...prevErrors, 
            country: undefined, 
            state: undefined, 
            city: undefined 
        }));

        if (countriesWithStates.includes(country)) {
            setLoadingOptions(true);
            try {
                // Note: You'll need to implement state/city fetching logic
                // For now, just clear the loading state
                setLoadingOptions(false);
            } catch (error) {
                console.error('Error loading states/cities:', error);
                setLoadingOptions(false);
            }
        }
    };

    const handleAddField = (field) => {
        const currentArray = formData[field] || [];
        setFormData({ ...formData, [field]: [...currentArray, ''] });
    };

    const handleRemoveField = (field, index) => {
        const currentArray = formData[field] || [];
        const newArray = currentArray.filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: newArray });

        // Remove related errors
        const errorKey = `${field}_${index}`;
        if (errors[errorKey]) {
            setErrors((prevErrors) => ({ ...prevErrors, [errorKey]: undefined }));
        }
    };

    const handleAdditionalChange = (field, index, value) => {
        const updatedFields = [...(formData[field] || [])];
        updatedFields[index] = value;
        setFormData({ ...formData, [field]: updatedFields });

        // Live validation
        setErrors((prevErrors) => ({ ...prevErrors, [`${field}_${index}`]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submit handler called');
        
        // Clear any previous terms error
        setTermsError('');
        
        // Check terms acceptance first if we're on the address section
        if (formSection === 'address' && !acceptedTerms) {
            setTermsError('Please accept the Terms of Service and Privacy Policy to continue.');
            setFormStatus('error');
            console.log('Terms not accepted, showing error');
            return;
        }
        
        // Validate all sections before submission
        console.log('Starting validation of all sections');
        const personalErrors = validateSection('personal');
        const contactErrors = validateSection('contact');
        const addressErrors = validateSection('address');
        
        console.log('Validation results:', {
            personalErrors,
            contactErrors,
            addressErrors
        });
        
        const allErrors = { ...personalErrors, ...contactErrors, ...addressErrors };
        
        if (Object.keys(allErrors).length > 0) {
            console.log('Form validation failed with errors:', allErrors);
            setErrors(allErrors);
            // Set the form section to the first section with errors
            if (Object.keys(personalErrors).length > 0) {
                setFormSection('personal');
            } else if (Object.keys(contactErrors).length > 0) {
                setFormSection('contact');
            } else if (Object.keys(addressErrors).length > 0) {
                setFormSection('address');
            }
            return;
        }

        console.log('Form validation passed, proceeding with submission');
        setIsSubmitting(true);
        setFormStatus('unsubmitted');
        setError('');

        try {
            // Format the data for the API - exact structure as specified
            const submissionData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                phone: formData.phoneNumber?.trim() || null,
                address: formData.address.trim(),
                city: formData.city.trim(),
                state: formData.state?.trim() || null,
                zipCode: formData.zipCode?.trim() || null,
                dateOfBirth: formData.dateOfBirth || null,
                // Store additional data in metadata
                metadata: {
                    country: formData.country?.trim() || null,
                    additionalEmails: formData.additionalEmails?.filter(email => email.trim()).map(email => email.trim()) || [],
                    additionalPhones: formData.additionalPhones?.filter(phone => phone.trim()).map(phone => phone.trim()) || []
                }
            };

            console.log('Submitting data:', submissionData);

            let response;
            if (setupToken) {
                // For setup flow, we might need to use a different endpoint
                // You may need to implement this in the auth service
                response = await authService.submitUserData(submissionData);
            } else {
                // For regular profile updates
                response = await authService.updateProfile(submissionData);
            }

            if (response.success || response) {
                setFormStatus('submitted');
                setError('');
                
                // Show success message
                setFormStatus('submitted');
                setError(response.message || 'Profile updated successfully!');

                // Navigate to dashboard after a short delay
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                throw new Error(response.error || 'Submission failed without error message');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            setFormStatus('error');
            setError(error.message || 'An error occurred while submitting the form. Please try again.');
        }

        setIsSubmitting(false);
    };

    const handleSectionChange = (section) => {
        if (formProgress[section].completed || section === formSection) {
            setFormSection(section);
        }
    };

    const handlePrevSection = () => {
        switch(formSection) {
            case 'contact':
                setFormSection('personal');
                break;
            case 'address':
                setFormSection('contact');
                break;
            default:
                break;
        }
    };

    const handleNextSection = () => {
        console.log('handleNextSection called');
        const currentSectionValid = validateSection(formSection);
        console.log('Current section validation errors:', currentSectionValid);
        
        if (Object.keys(currentSectionValid).length > 0) {
            setErrors(currentSectionValid);
            return;
        }

        // Mark current section as completed
        setFormProgress(prev => ({
            ...prev,
            [formSection]: { completed: true, valid: true }
        }));

        // Move to next section
        switch(formSection) {
            case 'personal':
                setFormSection('contact');
                break;
            case 'contact':
                setFormSection('address');
                break;
            default:
                break;
        }
    };

    const renderAdditionalEmails = () => (
        <div className="form-field">
            <label>
                <FaEnvelope className="field-icon" />
                Additional Email Addresses
                <span className="optional-text">(Optional)</span>
            </label>
            {formData.additionalEmails?.map((email, index) => (
                <div key={index} className="rowStyle" style={{ marginTop: '10px' }}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => handleAdditionalChange('additionalEmails', index, e.target.value)}
                        placeholder={`Additional email ${index + 1}`}
                        className={`location-input ${errors[`additionalEmails_${index}`] ? 'inputError' : ''}`}
                        style={{ flex: 1 }}
                    />
                    <button
                        type="button"
                        onClick={() => handleRemoveField('additionalEmails', index)}
                        className="removeButtonStyle"
                        style={{ marginLeft: '10px' }}
                    >
                        <FaTimes />
                    </button>
                    {errors[`additionalEmails_${index}`] && (
                        <span className="errorText">{errors[`additionalEmails_${index}`]}</span>
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={() => handleAddField('additionalEmails')}
                className="addButtonStyle"
                style={{ marginTop: '10px' }}
            >
                <FaPlus /> Add Email
            </button>
        </div>
    );

    const renderAddressSection = () => (
        <div className="form-section">
            <h2>
                <FaHome className="section-icon" />
                Address Information
            </h2>
            
            <div className="form-field">
                <label htmlFor="address">
                    <FaHome className="field-icon" />
                    Street Address *
                </label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`location-input ${errors.address ? 'inputError' : ''}`}
                    placeholder="123 Main Street"
                />
                {errors.address && <span className="errorText">{errors.address}</span>}
            </div>

            <div className="rowStyle">
                <div className="form-field">
                    <label htmlFor="country">
                        <FaGlobe className="field-icon" />
                        Country *
                    </label>
                    <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleCountryChange}
                        className={`location-input ${errors.country ? 'inputError' : ''}`}
                    >
                        <option value="">Select Country</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.country && <span className="errorText">{errors.country}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="state">
                        <FaMapPin className="field-icon" />
                        State/Province
                    </label>
                    <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`location-input ${errors.state ? 'inputError' : ''}`}
                        placeholder="State or Province"
                    />
                    {errors.state && <span className="errorText">{errors.state}</span>}
                </div>
            </div>

            <div className="rowStyle">
                <div className="form-field">
                    <label htmlFor="city">
                        <FaCity className="field-icon" />
                        City *
                    </label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`location-input ${errors.city ? 'inputError' : ''}`}
                        placeholder="Your city"
                    />
                    {errors.city && <span className="errorText">{errors.city}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="zipCode">
                        <FaMapPin className="field-icon" />
                        ZIP/Postal Code
                    </label>
                    <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={`location-input ${errors.zipCode ? 'inputError' : ''}`}
                        placeholder="ZIP or Postal Code"
                    />
                    {errors.zipCode && <span className="errorText">{errors.zipCode}</span>}
                </div>
            </div>
        </div>
    );

    const renderPasswordFields = () => (
        setupToken && (
            <div className="form-section">
                <h3><FaLock className="section-icon" />Security</h3>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="password">Password *</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={(e) => {
                                    handleChange(e);
                                    setPasswordValidationErrors(validatePassword(e.target.value));
                                }}
                                className={errors.password ? 'error' : ''}
                                placeholder="Create a strong password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password *</label>
                        <div className="password-input-container">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={errors.confirmPassword ? 'error' : ''}
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                    </div>
                </div>

                {formData.password && (
                    <PasswordStrengthMeter 
                        password={formData.password} 
                        errors={passwordValidationErrors}
                    />
                )}
            </div>
        )
    );

    const renderFormSection = () => {
        switch(formSection) {
            case 'personal':
                return (
                    <div className="form-section">
                        <h2>
                            <FaUser className="section-icon" />
                            Personal Information
                        </h2>
                        
                        <div className="form-field">
                            <label htmlFor="firstName">
                                <FaUser className="field-icon" />
                                First Name *
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`location-input ${errors.firstName ? 'inputError' : ''}`}
                                placeholder="Enter your first name"
                                required
                            />
                            {errors.firstName && <span className="errorText">{errors.firstName}</span>}
                        </div>

                        <div className="form-field">
                            <label htmlFor="lastName">
                                <FaUser className="field-icon" />
                                Last Name *
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`location-input ${errors.lastName ? 'inputError' : ''}`}
                                placeholder="Enter your last name"
                                required
                            />
                            {errors.lastName && <span className="errorText">{errors.lastName}</span>}
                        </div>

                        <div className="form-field">
                            <label htmlFor="email">
                                <FaEnvelope className="field-icon" />
                                Email Address *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`location-input ${errors.email ? 'inputError' : ''}`}
                                placeholder="Enter your email address"
                                required
                            />
                            {errors.email && <span className="errorText">{errors.email}</span>}
                        </div>

                        {setupToken && renderPasswordFields()}
                    </div>
                );

            case 'contact':
                return (
                    <div className="form-section">
                        <h2>
                            <FaEnvelope className="section-icon" />
                            Contact Information
                        </h2>

                        <div className="form-field">
                            <label htmlFor="phoneNumber">
                                <FaPhone className="field-icon" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={`location-input ${errors.phoneNumber ? 'inputError' : ''}`}
                                placeholder="+1 (555) 123-4567"
                            />
                            {errors.phoneNumber && <span className="errorText">{errors.phoneNumber}</span>}
                        </div>

                        {renderAdditionalEmails()}

                        <div className="form-field full-width">
                            <label>
                                <FaPhone className="field-icon" />
                                Additional Phone Numbers
                                <span className="optional-text">(Optional)</span>
                            </label>
                            {formData.additionalPhones?.map((phone, index) => (
                                <div key={index} className="rowStyle" style={{ marginTop: '10px' }}>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => handleAdditionalChange('additionalPhones', index, e.target.value)}
                                        placeholder={`Additional phone ${index + 1}`}
                                        className={`location-input ${errors[`additionalPhones_${index}`] ? 'inputError' : ''}`}
                                        style={{ flex: 1 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveField('additionalPhones', index)}
                                        className="removeButtonStyle"
                                        style={{ marginLeft: '10px' }}
                                    >
                                        <FaTimes />
                                    </button>
                                    {errors[`additionalPhones_${index}`] && (
                                        <span className="errorText">{errors[`additionalPhones_${index}`]}</span>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleAddField('additionalPhones')}
                                className="addButtonStyle"
                                style={{ marginTop: '10px' }}
                            >
                                <FaPlus /> Add Phone
                            </button>
                        </div>
                    </div>
                );

            case 'address':
                return renderAddressSection();

            default:
                return null;
        }
    };

    const handleStateChange = async (e) => {
        const state = e.target.value;
        setFormData({ ...formData, state, city: '' });
        
        // Clear state-related errors
        setErrors((prevErrors) => ({ 
            ...prevErrors, 
            state: undefined, 
            city: undefined 
        }));

        if (state) {
            setLoadingOptions(true);
            try {
                // Note: You'll need to implement city fetching logic based on state
                setLoadingOptions(false);
            } catch (error) {
                console.error('Error loading cities:', error);
                setLoadingOptions(false);
            }
        }
    };

    const WelcomeBanner = () => (
        <div className="header-card">
            <h1>
                Complete Your <span className="changing-text">Profile</span>
            </h1>
            <p>Help us protect your data by providing the information you want us to monitor and remove from data broker sites.</p>
            <div className="security-banner">
                <FaShieldAlt className="shield-icon" />
                <span>All information is encrypted and securely stored.</span>
            </div>
        </div>
    );

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="location-page">
            <Navbar />
            <MobileNavbar />
            
            <div className="location-container">
                <WelcomeBanner />
                
                <div className="form-progress">
                    <button className={`progress-step ${formSection === 'personal' ? 'active' : formProgress.personal.completed ? 'completed' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Personal</span>
                    </button>
                    <button className={`progress-step ${formSection === 'contact' ? 'active' : formProgress.contact.completed ? 'completed' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Contact</span>
                    </button>
                    <button className={`progress-step ${formSection === 'address' ? 'active' : formProgress.address.completed ? 'completed' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">Address</span>
                    </button>
                </div>

                {error && formStatus === 'error' && (
                    <div className="error-banner">
                        <FaExclamationTriangle className="error-icon" />
                        {error}
                    </div>
                )}

                {formStatus === 'submitted' && (
                    <div className="alert success">
                        <FaCheckCircle />
                        Profile updated successfully! Redirecting to dashboard...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="formStyle">
                    {renderFormSection()}

                    <div className="form-navigation">
                        <div className="nav-buttons">
                            {formSection !== 'personal' && (
                                <button
                                    type="button"
                                    onClick={handlePrevSection}
                                    className="prev-button"
                                    disabled={isSubmitting}
                                >
                                    Previous
                                </button>
                            )}

                            {formSection !== 'address' ? (
                                <button
                                    type="button"
                                    onClick={handleNextSection}
                                    className="next-button"
                                    disabled={isSubmitting}
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="next-button submitButtonStyle"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Profile'}
                                </button>
                            )}
                        </div>
                    </div>

                    {formSection === 'address' && (
                        <div className="terms-section">
                            <div className="terms-checkbox">
                                <input
                                    type="checkbox"
                                    id="acceptTerms"
                                    checked={acceptedTerms}
                                    onChange={(e) => {
                                        setAcceptedTerms(e.target.checked);
                                        // Clear terms error when checkbox is checked
                                        if (e.target.checked) {
                                            setTermsError('');
                                        }
                                    }}
                                />
                                <label htmlFor="acceptTerms">
                                    I agree to the <button type="button" onClick={() => window.open('/terms', '_blank')}>Terms of Service</button> and <button type="button" onClick={() => window.open('/privacy', '_blank')}>Privacy Policy</button>
                                </label>
                            </div>
                            {termsError && (
                                <div className="terms-error">
                                    <FaExclamationTriangle className="error-icon" />
                                    {termsError}
                                </div>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EditInfoPage;
