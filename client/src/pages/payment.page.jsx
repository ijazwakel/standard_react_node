import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
// Renders errors or successful transactions on the screen.
function Message({ content }) {
    return <p>{content}</p>;
}

function PaymentPage() { // Accept amount as a prop
    const location = useLocation();
    const navigate = useNavigate('/')
    const { amount, currency, email } = location.state || {};
    const initialOptions = {
        "client-id": import.meta.env.PAYPAL_CLIENT_ID,
        "enable-funding": "venmo",
        "buyer-country": "US",
        currency: currency,
        components: "buttons",
    };
    const [message, setMessage] = useState("");
    return (
        <div className="paypal-button-container">
            <ToastContainer />
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    style={{
                        shape: "rect",
                        layout: "vertical",
                        color: "gold",
                        label: "paypal",
                    }}
                    createOrder={async () => {
                        try {
                            const response = await fetch("/api/orders", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    amount: amount, // Send the amount here
                                    currency: currency
                                }),
                            });

                            const orderData = await response.json();

                            if (orderData.id) {
                                return orderData.id;
                            } else {
                                const errorDetail = orderData?.details?.[0];
                                const errorMessage = errorDetail
                                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                                    : JSON.stringify(orderData);

                                throw new Error(errorMessage);
                            }
                        } catch (error) {
                            console.error(error);
                            setMessage(`Could not initiate PayPal Checkout...${error}`);
                        }
                    }}
                    onApprove={async (data, actions) => {
                        try {
                            const response = await fetch(
                                `/api/orders/${data.orderID}/capture`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                }
                            );

                            const orderData = await response.json();
                            const errorDetail = orderData?.details?.[0];

                            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                                return actions.restart();
                            } else if (errorDetail) {
                                throw new Error(
                                    `${errorDetail.description} (${orderData.debug_id})`
                                );
                            } else if (orderData.status === "COMPLETED") {
                                // Extract the required values
                                const transaction = orderData.purchase_units[0].payments.captures[0];
                                const payerEmail = email;
                                const transactionID = transaction.id;
                                const paymentMode = 24; // You can set this based on the transaction source
                                const amountPaid = transaction.amount.value;
                                const leaveNote = "Payment successfully completed."; // Customize this if needed

                                // Send a POST request to the provided link with the extracted values
                                const response = await fetch('http://103.18.23.62:8080/apeks/apps/erp/yfcpayment/insert/', {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        P_EMAIL: email,
                                        P_PAYMENT_MODE: paymentMode,
                                        P_TRANSACTION_ID: transactionID,
                                        P_LEAVE_NOTE: leaveNote,
                                        P_AMOUNT: amountPaid
                                    }),
                                });

                                if (response.status === 200) {
                                    toast.success(`Payment completed successfully`);
                                }
                                navigate('/')
                                // Set the message for the UI
                                setMessage(`Transaction ${transaction.status}: ${transaction.id}. See console for all available details`);
                            } else {
                                console.log("Transaction failed or was not completed.");
                            }
                        } catch (error) {
                            console.error(error);
                            setMessage(`Sorry, your transaction could not be processed...${error}`);
                        }
                    }}

                />
            </PayPalScriptProvider>
            <Message content={message} />
        </div>
    );
}

export default PaymentPage;
