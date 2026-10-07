import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const getStoredToken = () => {
    const token = localStorage.getItem('token');
    return token && token !== 'undefined' && token !== 'null' ? token : null;
};

const extractUserData = (raw) => {
    if (!raw) return null;
    let u = raw;
    // Unwrap if wrapped inside axios response data
    if (u.data && typeof u.data === 'object') {
        if (u.data.data && typeof u.data.data === 'object' && (u.data.data.id || u.data.data.email || u.data.data.name)) {
            u = u.data.data;
        } else if (u.data.user && typeof u.data.user === 'object') {
            u = u.data.user;
        } else if (u.data.id || u.data.email || u.data.name || u.data.roles) {
            u = u.data;
        }
    }
    // Unwrap if user object is nested in .user
    if (u.user && typeof u.user === 'object' && (u.user.id || u.user.email || u.user.name)) {
        u = u.user;
    }
    // Unwrap if user object is nested in .data
    if (u.data && typeof u.data === 'object' && (u.data.id || u.data.email || u.data.name)) {
        u = u.data;
    }
    return u;
};

const getStoredUser = () => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser || savedUser === 'undefined' || savedUser === 'null') {
        return null;
    }
    try {
        const parsed = JSON.parse(savedUser);
        return extractUserData(parsed);
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = getStoredToken();
        const storedUser = getStoredUser();
        return token && storedUser ? storedUser : null;
    });

    const [loading, setLoading] = useState(() => {
        const token = getStoredToken();
        const storedUser = getStoredUser();
        return Boolean(token && !storedUser);
    });

    useEffect(() => {
        const checkAuth = async () => {
            const token = getStoredToken();

            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            try {
                const userResponse = await api.get('/me');
                const userData = extractUserData(userResponse.data);

                if (userData) {
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    delete api.defaults.headers.common['Authorization'];
                    setUser(null);
                } else {
                    console.error('Session verification error:', error);
                    const storedUser = getStoredUser();
                    if (!storedUser) {
                        setUser(null);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        setLoading(true);

        try {
            const response = await api.post('/login', {
                email,
                password,
            });

            const token = response.data.token;

            localStorage.setItem('token', token);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Try fetching detailed profile from /me first
            let userData = null;
            try {
                const userResponse = await api.get('/me');
                userData = extractUserData(userResponse.data);
            } catch (meError) {
                console.warn('Failed to fetch /me profile after login, falling back to login user payload:', meError);
            }

            // Fallback to login response user data if /me is unavailable
            if (!userData) {
                userData = extractUserData(response.data);
            }

            if (userData) {
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            }

            return {
                success: true,
                user: userData,
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
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];

        setUser(null);
    };

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