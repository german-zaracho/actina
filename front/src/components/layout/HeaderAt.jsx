import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/styles.css';
import { useAuth } from '../../AuthContext';

export default function HeaderAt() {
    const navigate = useNavigate();
    const { profile, isAdmin, logout: logoutContext } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 600);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const userInitial = profile?.name 
        ? profile.name.charAt(0).toUpperCase() 
        : profile?.userName?.charAt(0).toUpperCase() || 'A';

    const handleLogout = async () => {
        await logoutContext();
        navigate('/login');
    };

    return (
        <header className='whiteHeader'>
            <div className='logoContainer'>
                <Link to="/home" className="border-top homeA">
                    <img
                        src={isMobile ? "/logo2.png" : "/logo.png"}
                        alt="Logo de Actina"
                    />
                </Link>

                <div className="user-menu">
                    <button
                        className='user-button'
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        {profile?.userImage ? (
                            <img 
                                src={`/images/profile-imgs/${profile.userImage}`} 
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
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className="dropdown-item"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    Panel Admin
                                </Link>
                            )}
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