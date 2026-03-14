import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import ToastNotification from '../components/ui/ToastNotification';
import { call } from '../services/httpService';
import { getFriendActivities, copyActivity } from '../services/userActivitiesService';
import { addToFavorites, removeFromFavorites, isFavorite } from '../services/favoritesService';
import HeaderAt from '../components/layout/HeaderAt';
import { getFriends } from '../services/friendshipService';
import '../css/public-profile.css';

const PublicProfilePage = () => {
    const { userName } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [friends, setFriends] = useState([]);
    const [activities, setActivities] = useState([]);
    const [favoriteStates, setFavoriteStates] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState({
        isVisible: false,
        message: '',
        type: 'success'
    });

    useEffect(() => {
        loadPublicProfile();
    }, [userName]);

    const loadPublicProfile = async () => {
        try {
            setLoading(true);
            // Obtener perfil del usuario por userName
            const profileData = await call({
                url: `profile/by-username/${userName}`,
                method: 'GET'
            });
            setProfile(profileData);

            // Cargar actividades del usuario (públicas o de amigos según corresponda)
            try {
                const activitiesData = await getFriendActivities(profileData._id);
                setActivities(activitiesData);

                // Cargar estado de favoritos para cada actividad
                const favStates = {};
                for (const activity of activitiesData) {
                    try {
                        const result = await isFavorite(activity._id);
                        favStates[activity._id] = result.isFavorite;
                    } catch (err) {
                        favStates[activity._id] = false;
                    }
                }
                setFavoriteStates(favStates);
            } catch (err) {
                console.log('No se pudieron cargar las actividades:', err);
                setActivities([]);
            }

            try {
                const friendsData = await call({
                    url: `friends/${profileData._id}`,
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

    const getActivityIcon = (activityType) => {
        switch (activityType) {
            case 'multiplechoice':
                return 'quiz';
            case 'flashcard':
                return 'style';
            case 'atlas':
                return 'art_track';
            default:
                return 'description';
        }
    };

    const getActivityColor = (activityType) => {
        switch (activityType) {
            case 'multiplechoice':
                return '#037e6a';
            case 'flashcard':
                return '#534799';
            case 'atlas':
                return '#0185c6';
            default:
                return '#95a5a6';
        }
    };

    const getActivityStats = (activity) => {
        if (activity.activityType === 'multiplechoice') {
            return `${activity.questions?.length || 0} preguntas`;
        } else if (activity.activityType === 'flashcard') {
            return `${activity.tabs?.reduce((total, tab) => total + (tab.concepts?.length || 0), 0) || 0} conceptos`;
        } else if (activity.activityType === 'atlas') {
            return `${activity.pages?.length || 0} páginas`;
        }
        return '';
    };

    const getActivityTitle = (activity) => {
        if (activity.activityType === 'multiplechoice') {
            return `${activity.subject} - ${activity.classification}`;
        } else if (activity.activityType === 'flashcard') {
            return `${activity.subject} - ${activity.topic}`;
        } else if (activity.activityType === 'atlas') {
            return `${activity.type} - ${activity.subject}`;
        }
        return activity.title || 'Sin título';
    };

    const handleActivityClick = (activity) => {
        if (activity.activityType === 'multiplechoice') {
            navigate(`/multiplechoiceQuestions/${activity.classification}`, {
                state: {
                    friendActivity: activity,
                    subject: activity.subject
                }
            });
        } else if (activity.activityType === 'flashcard') {
            navigate(`/flashcardTabs/${activity.subject}`, {
                state: {
                    friendActivity: activity,
                    topic: activity.topic
                }
            });
        } else if (activity.activityType === 'atlas') {
            navigate(`/atlasPages/${activity.subject}`, {
                state: {
                    friendActivity: activity,
                    type: activity.type
                }
            });
        }
    };

    const handleToggleFavorite = async (activity, e) => {
        e.stopPropagation(); // Evita que se active handleActivityClick

        try {
            const currentlyFavorite = favoriteStates[activity._id];

            if (currentlyFavorite) {
                await removeFromFavorites(activity._id);
                setFavoriteStates(prev => ({ ...prev, [activity._id]: false }));
            } else {
                await addToFavorites(activity._id);
                setFavoriteStates(prev => ({ ...prev, [activity._id]: true }));
            }
        } catch (err) {
            console.error('Error toggling favorite:', err);
            alert('Error al actualizar favoritos');
        }
    };

    const handleCopyActivity = async (activity, e) => {
        e.stopPropagation();

        try {
            await copyActivity(activity._id);
            setToast({
                isVisible: true,
                message: 'Actividad copiada a "Mis Actividades"',
                type: 'success'
            });
        } catch (err) {
            console.error('Error copying activity:', err);
            setToast({
                isVisible: true,
                message: 'Error al copiar actividad',
                type: 'error'
            });
        }
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
                            Volver
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

                                {/* Sección de actividades */}
                                {activities.length > 0 && (
                                    <div className="activities-section">
                                        <h3>Actividades ({activities.length})</h3>
                                        <div className="activities-grid">
                                            {activities.map(activity => (
                                                <div
                                                    key={activity._id}
                                                    className="activity-card"
                                                    onClick={() => handleActivityClick(activity)}
                                                    style={{ '--activity-color': getActivityColor(activity.activityType) }}
                                                >
                                                    <div className="activity-icon">
                                                        <span className="material-icons">
                                                            {getActivityIcon(activity.activityType)}
                                                        </span>
                                                    </div>
                                                    <button
                                                        className="favorite-button"
                                                        onClick={(e) => handleToggleFavorite(activity, e)}
                                                        title={favoriteStates[activity._id] ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                                    >
                                                        <span className="material-icons">
                                                            {favoriteStates[activity._id] ? 'bookmark' : 'bookmark_border'}
                                                        </span>
                                                    </button>
                                                    <button
                                                        className="copy-button"
                                                        onClick={(e) => handleCopyActivity(activity, e)}
                                                        title="Copiar a Mis Actividades"
                                                    >
                                                        <span className="material-icons">
                                                            content_copy
                                                        </span>
                                                    </button>
                                                    <div className="activity-content">
                                                        <h4>{getActivityTitle(activity)}</h4>
                                                        <p className="activity-type">
                                                            {activity.activityType === 'multiplechoice' ? 'Multiple Choice' :
                                                                activity.activityType === 'flashcard' ? 'Flashcard' : 'Atlas'}
                                                        </p>
                                                        <p className="activity-stats">
                                                            {getActivityStats(activity)}
                                                        </p>
                                                        <span className="visibility-badge">
                                                            <span className="material-icons">
                                                                {activity.visibility === 'public' ? 'public' : 'people'}
                                                            </span>
                                                            {activity.visibility === 'public' ? 'Público' : 'Amigos'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {friends.length > 0 && (
                                    <div className="friends-section">
                                        <h3>Amigos ({friends.length})</h3>
                                        <div className="friends-grid">
                                            {friends.slice(0, 6).map(friend => (
                                                <div
                                                    key={friend._id}
                                                    className="friend-item"
                                                    onClick={() => navigate(`/profile/${friend.userName}`)}
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

            <ToastNotification
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast({ ...toast, isVisible: false })}
            />
        </>
    );
};

export default PublicProfilePage;