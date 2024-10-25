import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

export default function PaymentDetails() {
    const [paymentDetails, setPaymentDetails] = useState([]);
    const userName = localStorage.getItem("user_name");

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await axios.get(
                    `http://103.18.23.62:8080/apeks/apps/erp/paymenthistory/getdata/?P_EMAIL=${userName}`
                );
                setPaymentDetails(response.data.items);
            } catch (error) {
                console.error("Error fetching class schedule:", error);
            }
        };
        fetchPaymentDetails();
    }, [userName]);

    return (
        <DashboardLayout>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Payments</h2>
                <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-800 text-white text-left text-sm uppercase">
                            <th className="px-4 py-3 border">Payment ID</th>
                            <th className="px-4 py-3 border">Invoice ID</th>
                            <th className="px-4 py-3 border">Transaction ID</th>
                            <th className="px-4 py-3 border">Amount</th>
                            <th className="px-4 py-3 border">Payment Mode</th>
                            <th className="px-4 py-3 border">Payment Method</th>
                            <th className="px-4 py-3 border">Payment Date</th>
                            <th className="px-4 py-3 border">Date Recorded</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentDetails.map((payment, index) => (
                            <tr
                                key={index}
                                className={`border-b text-sm ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                            >
                                <td className="px-4 py-3 border">{payment.payment_id}</td>
                                <td className="px-4 py-3 border">{payment.invoice_no}</td>
                                <td className="px-4 py-3 border">{payment.transactionid}</td>
                                <td className="px-4 py-3 border">{payment.amount}</td>
                                <td className="px-4 py-3 border">{payment.paymentmode}</td>
                                <td className="px-4 py-3 border">{payment.paymentmethod}</td>
                                <td className="px-4 py-3 border">
                                    {new Date(payment.date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </td>
                                <td className="px-4 py-3 border">
                                    {new Date(payment.daterecorded).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
