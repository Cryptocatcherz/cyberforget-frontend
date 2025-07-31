// src/components/ErrorFallback.js
import React from 'react';

const ErrorFallback = ({ error, onRetry }) => (
    <div className="error-fallback">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={onRetry}>Retry</button>
    </div>
);

export default ErrorFallback;