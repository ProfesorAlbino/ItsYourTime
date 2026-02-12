import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../service/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token') || AuthService.getCurrentUser();
            if (token) {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        const userData = JSON.parse(storedUser);
                        // Normalize isAdmin if it's stored as string
                        if (userData.isAdmin === "True" || userData.isAdmin === "true") {
                            userData.isAdmin = true;
                        } else if (userData.isAdmin === "False" || userData.isAdmin === "false") {
                            userData.isAdmin = false;
                        }
                        setUser(userData);
                    } catch (e) {
                        // If stored user is invalid, decode from token
                        try {
                            const payload = JSON.parse(atob(token.split('.')[1]));
                            const isAdminValue = payload.isAdmin || payload.isAdmin === "True";
                            const normalizedIsAdmin = isAdminValue === true || isAdminValue === "True" || isAdminValue === "true";
                            const userData = {
                                token,
                                id: payload.id,
                                isAdmin: normalizedIsAdmin,
                                exp: payload.exp,
                                iss: payload.iss,
                                aud: payload.aud
                            };
                            localStorage.setItem('user', JSON.stringify(userData));
                            setUser(userData);
                        } catch (err) {
                            console.error('Error decoding token:', err);
                        }
                    }
                } else {
                    // Decode token if user data not stored
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        const isAdminValue = payload.isAdmin || payload.isAdmin === "True";
                        const normalizedIsAdmin = isAdminValue === true || isAdminValue === "True" || isAdminValue === "true";
                        const userData = {
                            token,
                            id: payload.id,
                            isAdmin: normalizedIsAdmin,
                            exp: payload.exp,
                            iss: payload.iss,
                            aud: payload.aud
                        };
                        localStorage.setItem('user', JSON.stringify(userData));
                        setUser(userData);
                    } catch (err) {
                        console.error('Error decoding token:', err);
                    }
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (cedula, password) => {
        try {
            const data = await AuthService.login(cedula, password);
            if (data.token) {
                const token = data.token;
                const payload = JSON.parse(atob(token.split('.')[1]));
                
                // Normalize isAdmin: handle both string "True"/"False" and boolean true/false
                const isAdminValue = payload.isAdmin || payload.isAdmin === "True" || payload.isAdmin === true;
                const normalizedIsAdmin = isAdminValue === true || isAdminValue === "True" || isAdminValue === "true";

                const userData = {
                    token,
                    id: payload.id,
                    isAdmin: normalizedIsAdmin,
                    exp: payload.exp,
                    iss: payload.iss,
                    aud: payload.aud
                };

                // Save token separately for api interceptor
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                return { success: true };
            }
            return { success: false, message: 'Invalid credentials' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const logout = () => {
        AuthService.logout();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    const register = async (userData) => {
        try {
            await AuthService.register(userData);
            return { success: true };
        } catch (error) {
            throw error;
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
