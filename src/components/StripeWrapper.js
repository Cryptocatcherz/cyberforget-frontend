const loadStripe = async () => {
    try {
        if (!window.Stripe) {
            console.warn('Stripe.js failed to load. Check your internet connection.');
            return null;
        }
        return await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    } catch (error) {
        console.error('Failed to initialize Stripe:', error);
        return null;
    }
};
