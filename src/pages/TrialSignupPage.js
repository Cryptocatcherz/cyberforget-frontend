import React from 'react';
import { useLocation } from 'react-router-dom';

const SignupPage = () => {
    const location = useLocation();
    const { scannedCount } = location.state;

    return (
        <div className="signup-page">
            <h1>Sign Up for a Free Trial</h1>
            <p>{scannedCount} websites were scanned for your information.</p>
            <p>We found your profiles on several sites. Sign up to see the full results and protect your privacy.</p>
            <button>Start Your Free Trial</button>
        </div>
    );
};

export default SignupPage;
