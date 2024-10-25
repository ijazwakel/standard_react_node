// components/DashboardLayout.js
"use client";
import { useState, useEffect } from "react";
import {useAuth } from "../context/AuthContext.jsx"
import { useNavigate, NavLink } from "react-router-dom"; // Import NavLink
import axios from "axios";
import {
    FaClipboardList, // For Class Schedule
    FaFileInvoiceDollar, // For Invoices
    FaMoneyBillWave, // For Payment Details
    FaMoneyCheckAlt, // For Pay Now
    FaSignOutAlt,
    FaUserCircle,
    FaBars // Burger icon
} from "react-icons/fa";

export default function DashboardLayout({ children }) {
    const [family, setFamily] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to manage sidebar visibility
    const { logout } = useAuth();
    const navigate = useNavigate();
    const userName = localStorage.getItem("user_name");

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev); // Toggle sidebar visibility
    };

    useEffect(() => {
        const fetchPayableAmount = async () => {
            try {
                const response = await axios.get(
                    `http://103.18.23.62:8080/apeks/apps/erp/getdata//yfc/?P_EMAIL=${userName}`
                );
                setFamily(response.data.items[0].family_name);
            } catch (error) {
                console.error("Error fetching amount:", error);
            }
        };
        fetchPayableAmount();
    }, []);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
            {isSidebarOpen && ( // Render sidebar conditionally based on state
                <aside className="w-full md:w-64 bg-gray-800 text-white flex flex-col h-screen fixed md:h-full">
                    <div className="flex-grow p-6 mt-[8rem]">
                        <nav className="space-y-4">
                            <NavLink
                                to="/" // Route for Class Schedule
                                className={({ isActive }) =>
                                    `flex items-center gap-4 p-3 rounded-md hover:bg-gray-700 transition w-full text-left ${isActive ? "bg-gray-700" : ""}`
                                }
                            >
                                <FaClipboardList size={20} />
                                <span>Class Schedule</span>
                            </NavLink>

                            <NavLink
                                to="/invoice_details" // Route for Invoices
                                className={({ isActive }) =>
                                    `flex items-center gap-4 p-3 rounded-md hover:bg-gray-700 transition w-full text-left ${isActive ? "bg-gray-700" : ""}`
                                }
                            >
                                <FaFileInvoiceDollar size={20} />
                                <span>Invoices</span>
                            </NavLink>

                            <NavLink
                                to="/payment_details" // Route for Payment Details
                                className={({ isActive }) =>
                                    `flex items-center gap-4 p-3 rounded-md hover:bg-gray-700 transition w-full text-left ${isActive ? "bg-gray-700" : ""}`
                                }
                            >
                                <FaMoneyBillWave size={20} />
                                <span>Payment Details</span>
                            </NavLink>

                            <NavLink
                                to="/current_payment_details" // Route for Pay Now
                                className={({ isActive }) =>
                                    `flex items-center gap-4 p-3 rounded-md hover:bg-gray-700 transition w-full text-left ${isActive ? "bg-gray-700" : ""}`
                                }
                            >
                                <FaMoneyCheckAlt size={20} />
                                <span>Pay Now</span>
                            </NavLink>
                        </nav>
                    </div>
                    <div className="p-6">
                        <a
                            className="flex items-center cursor-pointer gap-4 p-3 rounded-md hover:bg-red-600 bg-red-500 transition"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt size={20} />
                            <span>Logout</span>
                        </a>
                    </div>
                </aside>
            )}
            <div className={`flex-1 flex flex-col ${isSidebarOpen ? "md:ml-64" : ""}`}> {/* Adjust margin based on sidebar state */}
                <header className="bg-gray-700 text-white shadow-md py-2 px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-10">
                    <div className="flex items-center gap-4">
                        <div
                            onClick={toggleSidebar}
                            className="cursor-pointer p-1" // Cursor pointer for better UX
                        >
                            <FaBars size={24} className="text-white" />
                        </div>
                        <span className="text-xl font-semibold">Student Portal</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center"> {/* Flex column for profile icon and family name */}
                            <FaUserCircle size={50} className="text-gray-500 shadow-lg rounded-full bg-white p-1" />
                            <span className="font-semibold">{family}</span> {/* Family name below the icon */}
                        </div>
                    </div>
                </header>


                <main className="flex-1 p-6 bg-white overflow-auto mt-[7rem]"> {/* White background for main content */}
                    {children}
                </main>
            </div>
        </div>
    );
}
