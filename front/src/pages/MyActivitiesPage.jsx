import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyActivities, deleteActivity, updateActivity } from '../services/userActivitiesService';
import HeaderAt from '../components/layout/HeaderAt';
import Sidebar from '../components/layout/Sidebar';
import UserActivityForm from '../components/forms/ActivityFormWrapper';
import ConfirmModal from '../components/ui/ConfirmModal';
import ToastNotification from '../components/ui/ToastNotification';
import '../css/my-activities.css';

const MyActivitiesPage = () => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [editingActivity, setEditingActivity] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activityToDelete, setActivityToDelete] = useState(null);
    const [showVisibilityModal, setShowVisibilityModal] = useState(false);
    const [activityToChangeVisibility, setActivityToChangeVisibility] = useState(null);
    
    // Estado para el toast
    const [toast, setToast] = useState({
        isVisible: false,
        message: '',
        type: 'success'
    });

    useEffect(() => {
        loadActivities();
    }, []);

    useEffect(() => {
        filterActivities();
    }, [filterType, activities]);

    const loadActivities = async () => {
        try {
            setLoading(true);
            const data = await getMyActivities();
            setActivities(data);
        } catch (err) {
            setError('Error al cargar actividades');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filterActivities = () => {
        if (filterType === 'all') {
            setFilteredActivities(activities);
        } else {
            setFilteredActivities(activities.filter(a => a.activityType === filterType));
        }
    };

    const handleEdit = (activity) => {
        setEditingActivity(activity);
    };

    const handleCancelEdit = () => {
        setEditingActivity(null);
    };

    const handleSaveEdit = async () => {
        await loadActivities();
        setEditingActivity(null);
        setToast({
            isVisible: true,
            message: 'Actividad actualizada exitosamente',
            type: 'success'
        });
    };

    const handleDeleteClick = (activity) => {
        setActivityToDelete(activity);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteActivity(activityToDelete._id);
            await loadActivities();
            setShowDeleteModal(false);
            setActivityToDelete(null);
            setToast({
                isVisible: true,
                message: 'Actividad eliminada',
                type: 'success'
            });
        } catch (err) {
            setToast({
                isVisible: true,
                message: 'Error al eliminar actividad',
                type: 'error'
            });
            console.error(err);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setActivityToDelete(null);
    };

    const handleToggleVisibility = async (activity) => {
        setActivityToChangeVisibility(activity);
        setShowVisibilityModal(true);
    };

    const handleChangeVisibility = async (newVisibility) => {
        try {
            // Solo enviar el campo que queremos actualizar
            await updateActivity(activityToChangeVisibility._id, {
                visibility: newVisibility
            });
            await loadActivities();
            setShowVisibilityModal(false);
            setActivityToChangeVisibility(null);
            setToast({
                isVisible: true,
                message: 'Visibilidad actualizada',
                type: 'success'
            });
        } catch (err) {
            setToast({
                isVisible: true,
                message: 'Error al cambiar visibilidad',
                type: 'error'
            });
            console.error(err);
        }
    };

    const handleCancelVisibilityChange = () => {
        setShowVisibilityModal(false);
        setActivityToChangeVisibility(null);
    };

    const closeToast = () => {
        setToast({
            ...toast,
            isVisible: false
        });
    };

    const getActivityIcon = (type) => {
        const icons = {
            'multiplechoice': 'quiz',
            'flashcard': 'style',
            'atlas': 'art_track'
        };
        return icons[type] || 'description';
    };

    const getVisibilityInfo = (visibility) => {
        const info = {
            'public': {
                icon: 'public',
                label: 'Publico',
                color: '#2196f3',
                description: 'Visible para todos'
            },
            'friends': {
                icon: 'group',
                label: 'Amigos',
                color: '#4caf50',
                description: 'Visible para tus amigos'
            },
            'private': {
                icon: 'lock',
                label: 'Privado',
                color: '#ff9800',
                description: 'Solo visible para ti'
            }
        };
        return info[visibility] || info['private'];
    };

    const getActivityTitle = (activity) => {
        switch (activity.activityType) {
            case 'multiplechoice':
                return `${activity.subject} - ${activity.classification}`;
            case 'flashcard':
                return `${activity.subject} - ${activity.topic}`;
            case 'atlas':
                return `${activity.type} - ${activity.subject}`;
            default:
                return 'Actividad';
        }
    };

    const getActivityStats = (activity) => {
        switch (activity.activityType) {
            case 'multiplechoice':
                return `${activity.questions?.length || 0} preguntas`;
            case 'flashcard':
                const totalConcepts = activity.tabs?.reduce((sum, tab) => 
                    sum + (tab.concepts?.length || 0), 0) || 0;
                return `${activity.tabs?.length || 0} tabs, ${totalConcepts} conceptos`;
            case 'atlas':
                return `${activity.pages?.length || 0} páginas`;
            default:
                return '';
        }
    };

    const getCategoryColor = (type) => {
        const colors = {
            'multiplechoice': '#037e6a',
            'flashcard': '#534799',
            'atlas': '#0185c6'
        };
        return colors[type] || '#999';
    };

    const handleActivityClick = (activity) => {
        if (activity.activityType === 'multiplechoice') {
            navigate(`/multiplechoiceQuestions/${activity.classification}`, {
                state: { 
                    isMyActivity: true,
                    myActivities: [activity],
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

    if (editingActivity) {
        return (
            <>
                <HeaderAt />
                <div className='divContainer'>
                    <Sidebar />
                    <div className="container">
                        <UserActivityForm
                            activityType={editingActivity.activityType}
                            item={editingActivity}
                            onSave={handleSaveEdit}
                            onCancel={handleCancelEdit}
                        />
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
                            <h1>Mis Actividades</h1>
                            <button 
                                className="btn-create"
                                onClick={() => navigate('/create')}
                            >
                                + Nueva Actividad
                            </button>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        {/* Filtros */}
                        <div className="filters">
                            <button 
                                className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                                onClick={() => setFilterType('all')}
                            >
                                Todas ({activities.length})
                            </button>
                            <button 
                                className={`filter-btn ${filterType === 'multiplechoice' ? 'active' : ''}`}
                                onClick={() => setFilterType('multiplechoice')}
                            >
                                Multiple Choice ({activities.filter(a => a.activityType === 'multiplechoice').length})
                            </button>
                            <button 
                                className={`filter-btn ${filterType === 'flashcard' ? 'active' : ''}`}
                                onClick={() => setFilterType('flashcard')}
                            >
                                Flashcards ({activities.filter(a => a.activityType === 'flashcard').length})
                            </button>
                            <button 
                                className={`filter-btn ${filterType === 'atlas' ? 'active' : ''}`}
                                onClick={() => setFilterType('atlas')}
                            >
                                Atlas ({activities.filter(a => a.activityType === 'atlas').length})
                            </button>
                        </div>

                        {/* Lista de actividades */}
                        {loading ? (
                            <div className="loading">Cargando actividades...</div>
                        ) : filteredActivities.length === 0 ? (
                            <div className="empty-state">
                                <span className="material-icons">inbox</span>
                                <p>No tienes actividades {filterType !== 'all' ? `de tipo ${filterType}` : ''}</p>
                                <button 
                                    className="btn-create-empty"
                                    onClick={() => navigate('/create')}
                                >
                                    Crear tu primera actividad
                                </button>
                            </div>
                        ) : (
                            <div className="activities-grid">
                                {filteredActivities.map(activity => (
                                    <div 
                                        key={activity._id} 
                                        className="activity-card"
                                        style={{ '--category-color': getCategoryColor(activity.activityType) }}
                                    >
                                        <div className="card-header">
                                            <div className="card-icon">
                                                <span className="material-icons">
                                                    {getActivityIcon(activity.activityType)}
                                                </span>
                                            </div>
                                            <div className="visibility-toggle">
                                                <button
                                                    className="btn-visibility"
                                                    onClick={() => handleToggleVisibility(activity)}
                                                    title={getVisibilityInfo(activity.visibility).description}
                                                    style={{ color: getVisibilityInfo(activity.visibility).color }}
                                                >
                                                    <span className="material-icons">
                                                        {getVisibilityInfo(activity.visibility).icon}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="card-content">
                                            <h3>{getActivityTitle(activity)}</h3>
                                            <p className="activity-stats">{getActivityStats(activity)}</p>
                                            <p className="activity-date">
                                                Creado: {new Date(activity.createdAt).toLocaleDateString('es-AR')}
                                            </p>
                                            <span 
                                                className="visibility-badge"
                                                style={{ 
                                                    background: `${getVisibilityInfo(activity.visibility).color}20`,
                                                    color: getVisibilityInfo(activity.visibility).color
                                                }}
                                            >
                                                <span className="material-icons">
                                                    {getVisibilityInfo(activity.visibility).icon}
                                                </span>
                                                {getVisibilityInfo(activity.visibility).label}
                                            </span>
                                        </div>

                                        <div className="card-actions">
                                            <button 
                                                className="btn-action btn-play"
                                                onClick={() => handleActivityClick(activity)}
                                            >
                                                <span className="material-icons">play_arrow</span>
                                                Realizar
                                            </button>
                                            <button 
                                                className="btn-action btn-edit"
                                                onClick={() => handleEdit(activity)}
                                            >
                                                <span className="material-icons">edit</span>
                                                Editar
                                            </button>
                                            <button 
                                                className="btn-action btn-delete"
                                                onClick={() => handleDeleteClick(activity)}
                                            >
                                                <span className="material-icons">delete</span>
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                title="Confirmar eliminación"
                message={`¿Estás seguro de que quieres eliminar la actividad "${activityToDelete ? getActivityTitle(activityToDelete) : ''}"? Esta acción no se puede deshacer.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            {/* Modal de cambio de visibilidad */}
            {showVisibilityModal && (
                <div className="modal-overlay" onClick={handleCancelVisibilityChange}>
                    <div className="visibility-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Cambiar visibilidad</h3>
                        <p className="modal-subtitle">¿Quien puede ver esta actividad?</p>
                        
                        <div className="visibility-options">
                            <button
                                className="visibility-option"
                                onClick={() => handleChangeVisibility('public')}
                            >
                                <span className="material-icons" style={{ color: '#2196f3' }}>public</span>
                                <div className="option-info">
                                    <strong>Publico</strong>
                                    <span>Cualquiera puede verlo</span>
                                </div>
                            </button>

                            <button
                                className="visibility-option"
                                onClick={() => handleChangeVisibility('friends')}
                            >
                                <span className="material-icons" style={{ color: '#4caf50' }}>group</span>
                                <div className="option-info">
                                    <strong>Amigos</strong>
                                    <span>Solo tus amigos pueden verlo</span>
                                </div>
                            </button>

                            <button
                                className="visibility-option"
                                onClick={() => handleChangeVisibility('private')}
                            >
                                <span className="material-icons" style={{ color: '#ff9800' }}>lock</span>
                                <div className="option-info">
                                    <strong>Privado</strong>
                                    <span>Solo tu puedes verlo</span>
                                </div>
                            </button>
                        </div>

                        <button className="btn-cancel-modal" onClick={handleCancelVisibilityChange}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            <ToastNotification
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={closeToast}
                duration={2000}
            />
        </>
    );
};

export default MyActivitiesPage;