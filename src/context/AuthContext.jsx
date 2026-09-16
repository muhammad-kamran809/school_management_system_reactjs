import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        setLoading(true);

        try {
            const response = await api.post('/login', {
                email,
                password,
            });

            const token = response.data.token;

            localStorage.setItem('token', token);

            api.defaults.headers.common['Authorization'] =
                `Bearer ${token}`;

            const userResponse = await api.get('/me');
            const authenticatedUser =
                userResponse.data.user || userResponse.data;

            setUser(authenticatedUser);

            return {
                success: true,
                user: authenticatedUser,
            };
        } catch (error) {
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
            await api.post('/logout');
        } catch (error) {
            console.log('Logout error:', error);
        }

        localStorage.removeItem('token');

        delete api.defaults.headers.common['Authorization'];

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
            api.defaults.headers.common['Authorization'] =
                `Bearer ${token}`;

            const response = await api.get('/me');
            const authenticatedUser = response.data.user || response.data;

            setUser(authenticatedUser);
        } catch (error) {
            localStorage.removeItem('token');

            delete api.defaults.headers.common['Authorization'];

            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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