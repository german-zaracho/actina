import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, removeFromFavorites } from '../services/favoritesService';
import { copyActivity } from '../services/userActivitiesService';
import HeaderAt from '../components/layout/HeaderAt';
import Sidebar from '../components/layout/Sidebar';
import ConfirmModal from '../components/ui/ConfirmModal';
import ToastNotification from '../components/ui/ToastNotification';
import '../css/my-activities.css';

const FavoritesPage = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activityToRemove, setActivityToRemove] = useState(null);

    const [toast, setToast] = useState({
        isVisible: false,
        message: '',
        type: 'success'
    });

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            setLoading(true);
            const data = await getFavorites();
            setFavorites(data);
        } catch (err) {
            setError('Error al cargar favoritos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveClick = (activity) => {
        setActivityToRemove(activity);
        setShowDeleteModal(true);
    };

    const handleConfirmRemove = async () => {
        try {
            await removeFromFavorites(activityToRemove._id);
            await loadFavorites();
            setShowDeleteModal(false);
            setActivityToRemove(null);
            setToast({
                isVisible: true,
                message: 'Eliminado de favoritos',
                type: 'success'
            });
        } catch (err) {
            setToast({
                isVisible: true,
                message: 'Error al eliminar de favoritos',
                type: 'error'
            });
            console.error(err);
        }
    };

    const handleCancelRemove = () => {
        setShowDeleteModal(false);
        setActivityToRemove(null);
    };

    const handleCopyActivity = async (activity) => {
        try {
            await copyActivity(activity._id);
            setToast({
                isVisible: true,
                message: 'Actividad copiada a "Mis Actividades"',
                type: 'success'
            });
        } catch (err) {
            setToast({
                isVisible: true,
                message: 'Error al copiar actividad',
                type: 'error'
            });
            console.error(err);
        }
    };

    const getActivityIcon = (activityType) => {
        switch (activityType) {
            case 'multiplechoice':
                return 'quiz';
            case 'flashcard':
                return 'style';
            case 'atlas':
                return 'map';
            default:
                return 'description';
        }
    };

    const getActivityColor = (activityType) => {
        switch (activityType) {
            case 'multiplechoice':
                return '#037e6a';
            case 'flashcard':
                return '#e67e22';
            case 'atlas':
                return '#3498db';
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
        return 'Sin título';
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

    if (loading) {
        return (
            <>
                <HeaderAt />
                <div className='divContainer'>
                    <Sidebar />
                    <div className="container">
                        <div className="my-activities-container">
                            <div className="loading">Cargando favoritos...</div>
                        </div>
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
                    <div className="my-activities-container">
                        <div className="page-header">
                            <h1>Mis Favoritos</h1>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        {favorites.length === 0 ? (
                            <div className="empty-state">
                                <span className="material-icons">star_border</span>
                                <p>No tienes actividades favoritas aún</p>
                                <p style={{ fontSize: '0.9rem', color: '#999' }}>
                                    Explora actividades de otros usuarios y agrégalas a favoritos
                                </p>
                            </div>
                        ) : (
                            <div className="activities-grid">
                                {favorites.map(activity => {
                                    if (activity.isDeleted) {
                                        return (
                                            <div
                                                key={activity._id}
                                                className="activity-card deleted-activity"
                                                style={{ '--category-color': '#e74c3c' }}
                                            >
                                                <div className="card-header">
                                                    <div
                                                        className="card-icon"
                                                        style={{ background: '#e74c3c' }}
                                                    >
                                                        <span className="material-icons">
                                                            delete_outline
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="card-content">
                                                    <h3>Actividad Eliminada</h3>
                                                    <p className="activity-stats deleted-message">
                                                        {activity.deletedMessage}
                                                    </p>
                                                    <p className="activity-date" style={{ color: '#e74c3c' }}>
                                                        Esta actividad ya no está disponible
                                                    </p>
                                                </div>

                                                <div className="card-actions">
                                                    <button
                                                        onClick={() => handleRemoveClick(activity)}
                                                        className="btn-action btn-delete"
                                                        style={{ width: '100%' }}
                                                    >
                                                        <span className="material-icons">close</span>
                                                        Eliminar de Favoritos
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={activity._id}
                                            className="activity-card"
                                            style={{ '--category-color': getActivityColor(activity.activityType) }}
                                        >
                                            <div className="card-header">
                                                <div
                                                    className="card-icon"
                                                    style={{ background: getActivityColor(activity.activityType) }}
                                                >
                                                    <span className="material-icons">
                                                        {getActivityIcon(activity.activityType)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="card-content" onClick={() => handleActivityClick(activity)}>
                                                <h3>{getActivityTitle(activity)}</h3>
                                                <p className="activity-stats">
                                                    {getActivityStats(activity)}
                                                </p>
                                                <p className="activity-date">
                                                    Tipo: {activity.activityType === 'multiplechoice' ? 'Multiple Choice' :
                                                        activity.activityType === 'flashcard' ? 'Flashcard' : 'Atlas'}
                                                </p>
                                            </div>

                                            <div className="card-actions">
                                                <button
                                                    onClick={() => handleActivityClick(activity)}
                                                    className="btn-action btn-edit"
                                                >
                                                    <span className="material-icons">play_arrow</span>
                                                    Realizar
                                                </button>
                                                <button
                                                    onClick={() => handleCopyActivity(activity)}
                                                    className="btn-action btn-copy"
                                                    title="Copiar a Mis Actividades"
                                                >
                                                    <span className="material-icons">content_copy</span>
                                                    Copiar
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveClick(activity)}
                                                    className="btn-action btn-delete"
                                                >
                                                    <span className="material-icons">star</span>
                                                    Quitar
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                title="Quitar de favoritos"
                message={`¿Estás seguro de que quieres quitar esta actividad de favoritos?`}
                onConfirm={handleConfirmRemove}
                onCancel={handleCancelRemove}
            />

            <ToastNotification
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast({ ...toast, isVisible: false })}
            />
        </>
    );
};

export default FavoritesPage;