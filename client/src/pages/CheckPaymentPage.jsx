import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const CheckPaymentPage = () => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(null);
  const [manualAmount, setManualAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [family, setFamily] = useState("");
  const [currency, setCurrency] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);

  const fetchPayableAmount = async () => {
    setLoading(true);
    setError(false); // Reset error state on fetch
    try {
      const response = await axios.get(`http://103.18.23.62:8080/apeks/apps/erp/getdata//yfc/?P_EMAIL=yfconline5@gmail.com`);
      const dueAmount = response.data.items[0]?.total_due_amount;
      setAmount(dueAmount !== undefined ? dueAmount : null);
      setFamily(response.data.items[0]?.family_name);
      setCurrency(response.data.items[0]?.currency);
    } catch (error) {
      console.error("Error fetching amount:", error);
      setAmount(null); // Set amount to null in case of error
      setError(true); // Set error state to true
    } finally {
      setLoading(false);
    }
  };
  
  const handleProceedToPayment = () => {
    const finalAmount = amount !== null && amount > 0 ? parseFloat(amount) : parseFloat(manualAmount);
    if (finalAmount > 0) {
      navigate("/payment", { state: { amount: finalAmount, currency: currency, email: email } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Check Your Payment</h1>
        <p className="text-gray-600 text-center mb-4">
          Enter your email to view your payable amount and proceed with the payment.
        </p>
        <input
          type="email"
          placeholder="Enter student email"
          value={email}
          onChange={handleEmailChange}
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:border-blue-500 mb-4"
          required
        />
        <button
          onClick={fetchPayableAmount}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          Check My Fee
        </button>

        {loading && <p className="text-center text-gray-600 mt-4">Loading...</p>}

        <div className="mt-6 text-center">
          {amount !== null && (
            <>
              <div className="mt-6 text-left">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">Student Information:</h2>
                <p className="text-gray-600">
                  <strong>Family Name: </strong> {family}
                </p>
                <p className="text-gray-600">
                  <strong>Currency: </strong> {currency}
                </p>
                <p className="text-gray-600">
                  <strong>Amount Due: </strong>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="ml-2 border border-gray-300 rounded-lg p-1 text-gray-800"
                  />
                </p>
              </div>
              <button
                onClick={handleProceedToPayment}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
              >
                Pay Now
              </button>
            </>
          )}

          {error && (
            <div className="mt-4 text-red-500">
              <p>No fees found for this email. Please enter a manual amount:</p>
              <input
                type="number"
                placeholder="Add amount manually"
                value={manualAmount}
                onChange={(e) => setManualAmount(e.target.value)}
                className="mt-2 border border-gray-300 rounded-lg p-1 text-gray-800"
              />
              <button
                onClick={handleProceedToPayment}
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
              >
                Pay Now with Manual Amount
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckPaymentPage;
