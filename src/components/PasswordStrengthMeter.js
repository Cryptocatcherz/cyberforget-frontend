import React from 'react';
import { calculatePasswordStrength, getPasswordStrengthLabel } from '../utils/passwordUtils';
import './PasswordStrengthMeter.css';

const PasswordStrengthMeter = ({ password }) => {
    const strength = calculatePasswordStrength(password);
    const { label, color } = getPasswordStrengthLabel(strength);

    return (
        <div className="password-strength-meter">
            <div className="strength-bar">
                <div 
                    className="strength-fill"
                    style={{ 
                        width: `${strength}%`,
                        backgroundColor: color
                    }}
                />
            </div>
            <div className="strength-label" style={{ color }}>
                {password && `Password Strength: ${label}`}
            </div>
        </div>
    );
};

export default PasswordStrengthMeter; 