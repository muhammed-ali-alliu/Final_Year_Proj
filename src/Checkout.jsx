import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Navbar from './Components/Navbar';
import './Checkout.css';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_live_51P7H89B9yZduzV1JtQNZUAwgjRfO3BeVWMygrJSTV7LeyugzaII3fvqZUeBJgG7q7Ft63yMo43v6ac1wnMOXLclL00gkIlqy7C');

const CheckoutForm = ({ paymentAmount, paymentIntentId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentError, setPaymentError] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false); 

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Call your backend to create a checkout session
        try {
            const response = await axios.post('/bookings/:id', {
                email: userEmail, // Assuming you have userEmail variable defined
                amount: paymentAmount, // Assuming you have paymentAmount variable defined
            });
    
            const { sessionId } = response.data;
    
            // Redirect to checkout page
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({
                sessionId: sessionId,
            });
    
            if (error) {
                console.error('Error redirecting to checkout:', error);
                // Handle error
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            // Handle error
        }
    };

    return (
        <div className="checkout-container">
            <div className='pg_ttl'>
                Checkout
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Card details</label>
                    <CardElement />
                </div>
                <div className="form-group">
                    <label>Payment Amount:</label>
                    <span>{paymentAmount} USD</span>
                </div>
                <button
                    type="submit"
                    disabled={paymentLoading}
                    className="unique-checkout-button"
                >
                    {paymentLoading ? 'Processing...' : 'Pay Now'}
                </button>

                {paymentError && <div className="payment-error">{paymentError}</div>}
            </form>
        </div>
    );
};

const Checkout = ({ paymentAmount, paymentIntentId }) => (
    <>
        <div>
            <Navbar />
            <Elements stripe={stripePromise}>
                <CheckoutForm paymentAmount={paymentAmount} paymentIntentId={paymentIntentId} />
            </Elements>
        </div>
    </>
);

export default Checkout;
