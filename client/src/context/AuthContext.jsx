import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap the application
export const AuthProvider = ({ children }) => {
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        // Check local storage for existing user_name
        const storedUserName = localStorage.getItem('user_name');
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []);

    // Function to log in a user
    const login = (name) => {
        setUserName(name);
        localStorage.setItem('user_name', name);
    };

    // Function to log out a user
    const logout = () => {
        setUserName(null);
        localStorage.removeItem('user_name');
    };

    // Return the context provider with the userName, login, and logout methods
    return (
        <AuthContext.Provider value={{ userName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
