import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderAt from './HeaderAt';
import Sidebar from './Sidebar';
import { call } from './services/httpService';
import { getFriends } from './services/friendshipService';
import './css/public-profile.css';

const PublicProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadPublicProfile();
    }, [userId]);

    const loadPublicProfile = async () => {
        try {
            setLoading(true);
            // Obtener perfil del usuario
            const profileData = await call({
                url: `profile/${userId}`,
                method: 'GET'
            });
            setProfile(profileData);

            // Opcionalmente, cargar amigos del usuario (si quieres mostrarlos)
            try {
                const friendsData = await call({
                    url: `friends/${userId}`,
                    method: 'GET'
                });
                setFriends(friendsData);
            } catch (err) {
                console.log('No se pudieron cargar los amigos públicamente');
            }
        } catch (err) {
            console.error('Error cargando perfil:', err);
            setError('No se encontró el usuario');
        } finally {
            setLoading(false);
        }
    };

    const getInitialLetter = () => {
        if (profile?.name) {
            return profile.name.charAt(0).toUpperCase();
        } else if (profile?.userName) {
            return profile.userName.charAt(0).toUpperCase();
        }
        return 'U';
    };

    if (loading) {
        return (
            <>
                <HeaderAt />
                <div className='divContainer'>
                    <Sidebar />
                    <div className="container">
                        <div className="loading">Cargando perfil...</div>
                    </div>
                </div>
            </>
        );
    }

    if (error || !profile) {
        return (
            <>
                <HeaderAt />
                <div className='divContainer'>
                    <Sidebar />
                    <div className="container">
                        <div className="error-message">{error}</div>
                        <button onClick={() => navigate(-1)} className='btnBackWhite'>
                            Volver
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <HeaderAt />
            <div className='divContainer'>
                <Sidebar />
                <div className="container">
                    <div className="public-profile-container">
                        <button 
                            onClick={() => navigate(-1)} 
                            className='btnBackWhite'
                        >
                            ← Volver
                        </button>

                        <div className="profile-card">
                            {/* Imagen de perfil */}
                            <div className="profile-header">
                                <div className="profile-image">
                                    {profile.userImage ? (
                                        <img 
                                            src={`/src/assets/images/profile-imgs/${profile.userImage}`} 
                                            alt={profile.userName}
                                        />
                                    ) : (
                                        <div className="default-avatar">
                                            {getInitialLetter()}
                                        </div>
                                    )}
                                </div>
                                <div className="profile-title">
                                    <h1>{profile.name || profile.userName}</h1>
                                    <p className="username">@{profile.userName}</p>
                                </div>
                            </div>

                            {/* Información del perfil */}
                            <div className="profile-info">
                                {profile.bio && (
                                    <div className="info-section">
                                        <h3>Biografía</h3>
                                        <p>{profile.bio}</p>
                                    </div>
                                )}

                                <div className="info-grid">
                                    {profile.email && (
                                        <div className="info-item">
                                            <label>Email</label>
                                            <p>{profile.email}</p>
                                        </div>
                                    )}

                                    {profile.location && (
                                        <div className="info-item">
                                            <label>Ubicación</label>
                                            <p>{profile.location}</p>
                                        </div>
                                    )}

                                    {profile.birthDate && (
                                        <div className="info-item">
                                            <label>Fecha de nacimiento</label>
                                            <p>
                                                {new Date(profile.birthDate).toLocaleDateString('es-AR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Sección de amigos */}
                                {friends.length > 0 && (
                                    <div className="friends-section">
                                        <h3>Amigos ({friends.length})</h3>
                                        <div className="friends-grid">
                                            {friends.slice(0, 6).map(friend => (
                                                <div 
                                                    key={friend._id} 
                                                    className="friend-item"
                                                    onClick={() => navigate(`/profile/${friend._id}`)}
                                                >
                                                    {friend.userImage ? (
                                                        <img 
                                                            src={`/src/assets/images/profile-imgs/${friend.userImage}`}
                                                            alt={friend.userName}
                                                        />
                                                    ) : (
                                                        <div className="friend-avatar">
                                                            {friend.name?.charAt(0).toUpperCase() || 
                                                             friend.userName?.charAt(0).toUpperCase() || 'A'}
                                                        </div>
                                                    )}
                                                    <p>{friend.name || friend.userName}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {friends.length > 6 && (
                                            <p className="more-friends">
                                                +{friends.length - 6} amigos más
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PublicProfilePage;