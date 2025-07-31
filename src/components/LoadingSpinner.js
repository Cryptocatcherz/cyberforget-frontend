import React from 'react';
import ReactDOM from 'react-dom';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
    return ReactDOM.createPortal(
        <div className="cleandata-loading-spinner">
            <svg viewBox="0 0 50 50" className="spinner-svg">
                <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="#D8FF60"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="spinner-circle"
                />
            </svg>
        </div>,
        document.body
    );
};

export default LoadingSpinner;
