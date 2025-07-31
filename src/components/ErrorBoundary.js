// src/components/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error('ErrorBoundary caught an error', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="error-fallback">
                    <h2>Something went wrong.</h2>
                    <p>{this.state.error?.toString()}</p>
                    <button onClick={() => this.setState({ hasError: false, error: null })}>
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;