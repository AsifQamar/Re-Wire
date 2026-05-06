import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51TU92FAQ1kEgk6MPplsFyP6dyjZ3zRDDdrbFpF6U4KlhIPxmanytf755yHLkBbpSgjXrhaqbMQLPT2nGcHqfMiMQ001HfjMpq3');

const CheckoutForm = ({ amount, planName }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/recycler?payment=success", 
      },
      redirect: 'if_required' 
    });

    if (error) {
      setMessage(error.message);
      setIsError(true);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage("Payment successful! Your plan is now active.");
      setIsError(false);
      setTimeout(() => navigate('/recycler'), 3000);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-card">
      <h2 className="checkout-title">Secure Checkout</h2>
      <p className="checkout-sub">Complete your subscription to {planName}</p>
      
      <div className="checkout-summary">
        <div className="cs-row"><span>Plan</span><span>{planName}</span></div>
        <div className="cs-row"><span>Duration</span><span>Monthly</span></div>
        <div className="cs-row"><span>Total Amount</span><span>₹{amount.toLocaleString('en-IN')}</span></div>
      </div>

      <div className="stripe-element-container">
        <PaymentElement />
      </div>
      
      <button 
        disabled={isProcessing || !stripe || !elements} 
        className="btn btn-teal checkout-btn"
      >
        {isProcessing ? "Processing..." : `Pay ₹${amount.toLocaleString('en-IN')}`}
      </button>

      <div className="test-card-hint" style={{marginTop: '16px', fontSize: '12px', color: 'var(--tl)', textAlign: 'center'}}>
        Testing? Use 4242 4242 4242 4242 as the card number.
      </div>

      {message && (
        <div className={`checkout-msg ${isError ? 'msg-error' : 'msg-success'}`}>
          {message}
        </div>
      )}
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const plan = queryParams.get('plan') || 'Pro';
  const amount = plan === 'Enterprise' ? 15000 : 2999; 

  useEffect(() => {
    const token = localStorage.getItem('rewireToken');

    fetch("/api/payment/create-intent", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ amountInRupees: amount }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch(err => console.error("Payment intent error:", err));
  }, [amount]);

  return (
    <div className="checkout-page">
      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm amount={amount} planName={plan} />
        </Elements>
      ) : (
        <div className="checkout-card" style={{textAlign: 'center'}}>
          <p className="sh-md" style={{color: 'var(--teal)'}}>Initialising Secure Gateway...</p>
          <p className="sub" style={{marginTop: '10px'}}>Connecting to Stripe servers</p>
        </div>
      )}
    </div>
  );
}