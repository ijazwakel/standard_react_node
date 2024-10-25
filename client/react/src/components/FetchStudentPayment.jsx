import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

const PaymentDetails = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("PayPal");
    const [amount, setAmount] = useState(null);
    const [editedAmount, setEditedAmount] = useState('');
    const [family, setFamily] = useState('');
    const [currency, setCurrency] = useState('');
    const userName = localStorage.getItem("user_name")
    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                const response = await axios.get(`http://103.18.23.62:8080/apeks/apps/erp/getdata//yfc/?P_EMAIL=${userName}`);
                const dueAmount = response.data.items[0]?.total_due_amount;
                setAmount(dueAmount !== undefined ? dueAmount : null);
                setEditedAmount(dueAmount !== undefined ? dueAmount : ''); // Initialize editedAmount
                setFamily(response.data.items[0]?.family_name);
                setCurrency(response.data.items[0]?.currency);
            } catch (error) {
                console.error("Error fetching payment data:", error);
            }
        };
        fetchPaymentData();
    }, []);

    const handlePaymentMethodChange = (e) => {
        const selectedMethod = e.target.value;
        setPaymentMethod(selectedMethod);
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        setEditedAmount(value);
    };

    const handleSubmit = async () => {
        const amountToSubmit = parseFloat(editedAmount);
        if (amountToSubmit > 0) {
            if (paymentMethod === "PayPal") {
                // Redirect to PayPalPayment with the edited amount
                navigate('/paypal-payment', {
                    state: { amount: amountToSubmit, currency, email: userName }
                });
            } else if (paymentMethod === "Stripe") {
                // Call the placeOrder function for Stripe
                await placeOrder(amountToSubmit, currency);
            } else if (paymentMethod === "CreditC") {
                // Call the placeOrder function for Stripe
                await handlePayfastPayment(amountToSubmit);
            } else {
                alert("Selected payment method is not implemented.");
            }
        } else {
            alert("Please enter an amount greater than zero.");
        }
    };

    const placeOrder = async (amount, currency) => {
        const url = "http://localhost:8080";
        let orderData = {
            currency: currency,
            amount: amount
        };
        try {
            let response = await axios.post(url + "/stripe", orderData);
            console.log(response);

            if (response.data.success) {
                const { session_url } = response.data;
                window.location.replace(session_url); // Redirect to Stripe checkout
            } else {
                alert("Error creating Stripe session.");
            }
        } catch (error) {
            console.error("Error processing Stripe payment:", error);
            alert("Payment processing error. Please try again.");
        }
    };
    const handlePayfastPayment = async (amount) => {
        try {
            // Fetch this based on the logged-in user
            const studentId = "123";
            const response = await axios.post('http://localhost:8080/api/pay', { amount, studentId });

            if (response.data.paymentUrl) {
                // Redirect to PayFast payment page
                window.location.href = response.data.paymentUrl;
            }
        } catch (error) {
            console.error('Payment initiation failed', error);
        }
    };


    return (
        <DashboardLayout>
            <div className="w-full">
                {/* Payment Content */}
                <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Details</h2>
                    <div className="overflow-x-auto">
                        {/* Table Layout */}
                        <table className="min-w-full w-full border border-gray-300 rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">Family Name</th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">Currency</th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">Due Amount</th>
                                    <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b">Pay By</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-blue-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 border-b font-medium">{family || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 border-b font-medium">{currency || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap border-b">
                                        <input
                                            type="number"
                                            value={editedAmount}
                                            onChange={handleAmountChange}
                                            className="block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Enter due amount"
                                            min="0"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap border-b">
                                        <select
                                            value={paymentMethod}
                                            onChange={handlePaymentMethodChange}
                                            className="block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        >
                                            <option value="PayPal">PayPal</option>
                                            <option value="Stripe">Stripe</option>
                                            <option value="CreditCard">Credit Card</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="mt-4">
                            <button
                                onClick={handleSubmit}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Proceed to Pay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>

    );
};

export default PaymentDetails;
