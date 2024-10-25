// src/components/LoginForm.js
import React, { useEffect, useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';
import {useAuth} from "../context/AuthContext.jsx";
import { useNavigate } from 'react-router-dom';
const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate()
    const handleLogin = async (e) => {
       
        e.preventDefault();
        setError('');

        try {
            const response = await axios.get('http://103.18.23.62:8080/apeks/apps/erp/studentlogin/getdata/', {
                params: {
                    P_USER_NAME: email,
                    P_PASSWORD: password,
                },
            });

            if (response.data.items[0].login_result === "success") {
                // Use the login method from context
                await login(response.data.items[0].user_name);
                console.log('Login successful:', response.data);
                navigate('/')
                // Optionally redirect
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            console.error("Login failed:", err);
            setError('An error occurred during login');
        }
    };
    // useEffect(() => {
    //  console.log(localStorage.getItem("user_name"));

    // }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold text-center mb-6">Login to Your Account</h2>
                {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="flex items-center border rounded-md p-2">
                        <FaUser className="text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            className="flex-1 p-2 focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center border rounded-md p-2">
                        <FaLock className="text-gray-400" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="flex-1 p-2 focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700 transition"
                    >
                        Login
                    </button>
                </form>
                <div className="text-center mt-4">
                    <a href="#" className="text-gray-600 hover:underline">Forgot Password?</a>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
