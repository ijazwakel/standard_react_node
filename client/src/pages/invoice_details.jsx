import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
export default function InvoiceDetailsPage() {
    const [invoiceDetails, setInvoiceDetails] = useState([]);
    const userName = localStorage.getItem("user_name");
    useEffect(() => {
        const fetchInvoiceDetails = async () => {
            try {
                const response = await axios.get(
                    `http://103.18.23.62:8080/apeks/apps/erp/invoiceinfo/getdata/?P_EMAIL=${userName}`
                );


                setInvoiceDetails(response.data.items);
            } catch (error) {
                console.error("Error fetching class schedule:", error);
            }
        };
        fetchInvoiceDetails();
    }, [userName]);
    return (
        <DashboardLayout>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Invoices</h2>
                <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-800 text-white text-left text-sm uppercase">
                            <th className="px-4 py-3 border">Invoice No</th>
                            <th className="px-4 py-3 border">Invoice Date</th>
                            <th className="px-4 py-3 border">Status</th>
                            <th className="px-4 py-3 border">Due Date</th>
                            <th className="px-4 py-3 border">Currency</th>
                            <th className="px-4 py-3 border">Adjustment</th>
                            <th className="px-4 py-3 border">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoiceDetails.map((invoice, index) => (
                            <tr
                                key={index}
                                className={`border-b text-sm ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                            >
                                <td className="px-4 py-3 border">{invoice.inv_no}</td>
                                <td className="px-4 py-3 border">
                                    {new Date(invoice.invoice_date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </td>
                                <td className="px-4 py-3 border">{invoice.status}</td>
                                <td className="px-4 py-3 border">
                                    {new Date(invoice.due_date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </td>
                                <td className="px-4 py-3 border">{invoice.currency}</td>
                                <td className="px-4 py-3 border">{invoice.adjustment}</td>
                                <td className="px-4 py-3 border">{invoice.total}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
