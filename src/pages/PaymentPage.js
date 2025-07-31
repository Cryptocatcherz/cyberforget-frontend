import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://cleandata-test-app-961214fcb16c.herokuapp.com/api'
  : 'http://localhost:5002/api';

const PaymentPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const createCheckoutSession = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/payment/create-checkout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        priceId: process.env.REACT_APP_STRIPE_PRICE_ID,
                        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                        cancelUrl: `${window.location.origin}/signup`,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to create checkout session');
                }

                const { url } = await response.json();
                
                // Redirect to Stripe Checkout
                window.location.href = url;
            } catch (error) {
                console.error('Error creating checkout session:', error);
                navigate('/error');
            }
        };

        createCheckoutSession();
    }, [navigate]);

    return (
        <div className="payment-container">
            <div className="loading-spinner">
                <p>Redirecting to secure checkout...</p>
            </div>
        </div>
    );
};

export default PaymentPage;
