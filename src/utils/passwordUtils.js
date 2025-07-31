export const PASSWORD_REQUIREMENTS = {
    minLength: 8,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumber: /[0-9]/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
};

export const validatePassword = (password) => {
    const errors = [];
    const requirements = [];
    
    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
        requirements.push('At least 8 characters');
    }
    if (!PASSWORD_REQUIREMENTS.hasUpperCase.test(password)) {
        requirements.push('One uppercase letter');
    }
    if (!PASSWORD_REQUIREMENTS.hasLowerCase.test(password)) {
        requirements.push('One lowercase letter');
    }
    if (!PASSWORD_REQUIREMENTS.hasNumber.test(password)) {
        requirements.push('One number');
    }
    if (!PASSWORD_REQUIREMENTS.hasSpecialChar.test(password)) {
        requirements.push('One special character (!@#$%^&*(),.?":{}|<>)');
    }
    
    if (requirements.length > 0) {
        errors.push('Your password needs:');
        errors.push(...requirements);
    }
    
    return errors;
};

export const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length contribution
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    
    // Character type contribution
    if (PASSWORD_REQUIREMENTS.hasUpperCase.test(password)) strength += 20;
    if (PASSWORD_REQUIREMENTS.hasLowerCase.test(password)) strength += 20;
    if (PASSWORD_REQUIREMENTS.hasNumber.test(password)) strength += 20;
    if (PASSWORD_REQUIREMENTS.hasSpecialChar.test(password)) strength += 20;
    
    return Math.min(100, strength);
};

export const getPasswordStrengthLabel = (strength) => {
    if (strength >= 100) return { label: 'Very Strong', color: '#00c853' };
    if (strength >= 80) return { label: 'Strong', color: '#64dd17' };
    if (strength >= 60) return { label: 'Good', color: '#ffd600' };
    if (strength >= 40) return { label: 'Fair', color: '#ff9100' };
    return { label: 'Weak', color: '#ff1744' };
}; 