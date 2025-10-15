import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUserRole, logout as logoutService } from './services/authService';
import { getProfile } from './services/profileService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Cargar datos del usuario al montar
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            // Cargar rol y perfil en paralelo
            const [roleData, profileData] = await Promise.all([
                getCurrentUserRole(),
                getProfile()
            ]);

            setUser({ rol: roleData.rol });
            setProfile(profileData);
            setIsAuthenticated(true);
            setIsAdmin(roleData.rol === 2);
        } catch (error) {
            console.error('Error checking auth:', error);
            localStorage.removeItem('token');
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (token, accountData) => {
        localStorage.setItem('token', token);
        
        try {
            const [roleData, profileData] = await Promise.all([
                getCurrentUserRole(),
                getProfile()
            ]);

            setUser({ rol: roleData.rol });
            setProfile(profileData);
            setIsAuthenticated(true);
            setIsAdmin(roleData.rol === 2);
        } catch (error) {
            console.error('Error loading user data after login:', error);
        }
    };

    const logout = async () => {
        try {
            await logoutService();
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            setProfile(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
        }
    };

    const updateProfile = (newProfile) => {
        setProfile(newProfile);
    };

    const value = {
        user,
        profile,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        logout,
        updateProfile,
        refreshAuth: checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};