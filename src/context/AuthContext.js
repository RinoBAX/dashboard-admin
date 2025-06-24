import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('authToken');
            const storedUser = localStorage.getItem('authUser');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
        } finally {
            setLoading(false);
        }
    }, []); 
    const login = async (email, password) => {
        const data = await api.login(email, password);
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUser', JSON.stringify(data.user));
    };
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
    };
    const authContextValue = useMemo(() => ({
        user,
        token,
        isAuthenticated: !!token, 
        login,
        logout,
    }), [user, token]); 

    if (loading) {
        return (
            <div className="min-h-screen bg-c-navy flex items-center justify-center text-c-chocolate text-xl tracking-widest">
                INITIALIZING SYSTEM...
            </div>
        );
    }
    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    return useContext(AuthContext);
};
