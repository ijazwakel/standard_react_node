import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StripeVerification = () => {
    const location = useLocation();
    const sessionId = new URLSearchParams(location.search).get('session_id');
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const hasSentPaymentDetails = useRef(false); // Ref to track if POST request has been sent
    const userName = localStorage.getItem("user_name")
    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/get-payment-details/${sessionId}`);
                console.log(response);

                setPaymentDetails(response.data);

                // Check if the payment status is complete and if POST request has not been sent yet
                if (response.data.status === 'complete' && !hasSentPaymentDetails.current) {
                    // Prepare data for the POST request
                    const postData = {
                        P_EMAIL: userName,
                        P_PAYMENT_MODE: 25,
                        P_TRANSACTION_ID: response.data.id,
                        P_LEAVE_NOTE: 'Payment for Student Fee', // Customize as needed
                        P_AMOUNT: response.data.amount_total / 100 // Amount in currency
                    };

                    // Send POST request to the specified API
                    await axios.post('http://103.18.23.62:8080/apeks/apps/erp/yfcpayment/insert/', postData);
                    console.log('Payment details sent successfully.');

                    // Mark that the POST request has been sent
                    hasSentPaymentDetails.current = true;
                }
            } catch (err) {
                setError('Error fetching payment details.');
            } finally {
                setLoading(false);
            }
        };

        if (sessionId) {
            fetchPaymentDetails();
        }
    }, [sessionId]);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Payment Invoice</h2>
            <div className="mb-4">
                <h3 className="text-2xl font-semibold text-gray-700">Payment Details</h3>
                <p className="text-gray-600 mt-2">Transaction ID: <span className="font-medium text-gray-800">{paymentDetails.id}</span></p>
                <p className="text-gray-600 mt-1">Amount: <span className="font-medium text-gray-800">{(paymentDetails.amount_total / 100).toFixed(2)} {paymentDetails.currency.toUpperCase()}</span></p>
                <p className="text-gray-600 mt-1">Payment Status: <span className="font-medium text-gray-800">{paymentDetails.status}</span></p>
            </div>
            <Link to="/" className="mt-6 inline-block px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200">
                Back to Dashboard
            </Link>
        </div>
    );
};

export default StripeVerification;
