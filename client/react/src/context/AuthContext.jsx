// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        // Check local storage for existing user_name
        const storedUserName = localStorage.getItem('user_name');
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []);

    const login = (name) => {
        setUserName(name);
        localStorage.setItem('user_name', name);
    };

    const logout = () => {
        setUserName(null);
        localStorage.removeItem('user_name');
    };

    return (
        <AuthContext.Provider value={{ userName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return React.useContext(AuthContext);
};
