/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
// import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        setLoading(true);

        try {
            // API call commented out:
            // const response = await api.post('/login', {
            //     email,
            //     password,
            // });
            //
            // const token = response.data.token;
            //
            // localStorage.setItem('token', token);
            //
            // api.defaults.headers.common['Authorization'] =
            //     `Bearer ${token}`;
            //
            // const userResponse = await api.get('/me');
            // const authenticatedUser =
            //     userResponse.data.user || userResponse.data;

            if (!email || !password) {
                return {
                    success: false,
                    message: 'Please enter email and password.',
                };
            }

            // Mock login logic preserving full functionality:
            const token = 'mock-school-management-token';
            localStorage.setItem('token', token);

            const displayName = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);

            const authenticatedUser = {
                id: 1,
                name: displayName,
                email: email,
                role: 'admin',
            };

            localStorage.setItem('sms_user', JSON.stringify(authenticatedUser));
            setUser(authenticatedUser);

            return {
                success: true,
                user: authenticatedUser,
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    'Login failed.',
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            // API call commented out:
            // await api.post('/logout');
        } catch (error) {
            console.log('Logout error:', error);
        }

        localStorage.removeItem('token');
        localStorage.removeItem('sms_user');

        // delete api.defaults.headers.common['Authorization'];

        setUser(null);
    };

    // Check existing login when React starts
    const checkAuth = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            // API call commented out:
            // api.defaults.headers.common['Authorization'] =
            //     `Bearer ${token}`;
            //
            // const response = await api.get('/me');
            // const authenticatedUser = response.data.user || response.data;

            let authenticatedUser = {
                id: 1,
                name: 'Administrator',
                email: 'admin@school.com',
                role: 'admin',
            };

            const savedUser = localStorage.getItem('sms_user');
            if (savedUser) {
                try {
                    authenticatedUser = JSON.parse(savedUser);
                } catch (e) {
                    console.error('Error parsing stored user:', e);
                }
            }

            setUser(authenticatedUser);
        } catch (error) {
            console.error('Auth verification error:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('sms_user');

            // delete api.defaults.headers.common['Authorization'];

            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);