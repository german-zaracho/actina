import React, { useState, useEffect } from 'react'; // ← AGREGADO useEffect
import { Link, useNavigate } from 'react-router-dom';
import { logout } from './services/authService';
import '../src/css/styles.css';
import { getProfile } from './services/profileService';
import backgroundImage from '../src/assets/trama5.png';

export default function HeaderAt() {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [userInitial, setUserInitial] = useState(''); // ← VACÍO inicialmente
    const [userImage, setUserImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    // Escuchar cambios en el perfil
    useEffect(() => {
        const handleProfileUpdate = () => {
            loadUserData();
        };

        window.addEventListener('profileUpdated', handleProfileUpdate);

        return () => {
            window.removeEventListener('profileUpdated', handleProfileUpdate);
        };
    }, []);

    const loadUserData = async () => {
        try {
            const profile = await getProfile();

            // Determinar la inicial
            let initial = 'A';
            if (profile.name) {
                initial = profile.name.charAt(0).toUpperCase();
            } else if (profile.userName) {
                initial = profile.userName.charAt(0).toUpperCase();
            }

            setUserInitial(initial);
            setUserImage(profile.userImage || '');
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading user data:', error);
            setUserInitial('A');
            setUserImage('');
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Aún así remover el token y redirigir
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    return (
        <header className='whiteHeader'>
            <div className='logoContainer'>
                <Link to="/home" className="border-top homeA">
                    <img src="../../public/logo.png" alt="Logo de Actina" />
                </Link>

                <div className="user-menu">
                    <button
                        className='user-button'
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        {isLoading ? (
                            <span className='user'></span>
                        ) : userImage ? (
                            <img
                                src={`/src/assets/images/profile-imgs/${userImage}`}
                                alt="Profile"
                                className="user-image"
                            />
                        ) : (
                            <span className='user'>{userInitial}</span>
                        )}
                    </button>

                    {showDropdown && (
                        <div className="dropdown-menu">
                            <Link
                                to="/profile"
                                className="dropdown-item"
                                onClick={() => setShowDropdown(false)}
                            >
                                Mi Perfil
                            </Link>
                            <button
                                className="dropdown-item logout-btn"
                                onClick={handleLogout}
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}