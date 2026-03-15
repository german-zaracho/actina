import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers, getFriends, getPendingRequests, sendFriendRequest,
    acceptFriendRequest, rejectFriendRequest, removeFriend } from '../services/friendshipService';
import HeaderAt from '../components/layout/HeaderAt';
import Sidebar from '../components/layout/Sidebar';
import ToastNotification from '../components/ui/ToastNotification';
import '../css/friends.css';

const FriendsPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('search');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [toast, setToast] = useState({
        isVisible: false,
        message: '',
        type: 'success'
    });

    // Cargar solicitudes y amigos al montar el componente
    useEffect(() => {
        loadRequests();
        loadFriends();
    }, []);

    // Carga datos segun la pestaña activa
    useEffect(() => {
        if (activeTab === 'friends') {
            loadFriends();
        } else if (activeTab === 'requests') {
            loadRequests();
        }
    }, [activeTab]);

    const loadFriends = async () => {
        setLoading(true);
        try {
            const data = await getFriends();
            setFriends(data);
        } catch (err) {
            setError('Error al cargar amigos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadRequests = async () => {
        setLoading(true);
        try {
            const data = await getPendingRequests();
            setRequests(data);
        } catch (err) {
            setError('Error al cargar solicitudes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.trim().length < 2) {
            setError('Ingresa al menos 2 caracteres para buscar');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const results = await searchUsers(searchQuery);
            setSearchResults(results);
        } catch (err) {
            setError('Error al buscar usuarios');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendRequest = async (friendId) => {
        try {
            await sendFriendRequest(friendId);
            // Actualiza resultados de busqueda
            const updatedResults = await searchUsers(searchQuery);
            setSearchResults(updatedResults);
            // Muestra toast en lugar de alert
            setToast({
                isVisible: true,
                message: 'Solicitud enviada correctamente',
                type: 'success'
            });
        } catch (err) {
            setToast({
                isVisible: true,
                message: err.error?.message || 'Error al enviar solicitud',
                type: 'error'
            });
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await acceptFriendRequest(requestId);
            loadRequests(); // Actualiza solicitudes
            loadFriends();  // Actualiza amigos
            
            // Notifica al Sidebar para actualizar el contador
            window.dispatchEvent(new Event('friendRequestsUpdated'));
            
            setToast({
                isVisible: true,
                message: 'Solicitud aceptada',
                type: 'success'
            });
        } catch (err) {
            setToast({
                isVisible: true,
                message: 'Error al aceptar solicitud',
                type: 'error'
            });
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            await rejectFriendRequest(requestId);
            loadRequests();
            
            // Notifica al Sidebar para actualizar el contador
            window.dispatchEvent(new Event('friendRequestsUpdated'));
            
            setToast({
                isVisible: true,
                message: 'Solicitud rechazada',
                type: 'info'
            });
        } catch (err) {
            setToast({
                isVisible: true,
                message: 'Error al rechazar solicitud',
                type: 'error'
            });
        }
    };

    const handleRemoveFriend = async (friendshipId) => {
        if (!confirm('¿Seguro que quieres eliminar esta amistad?')) return;

        try {
            await removeFriend(friendshipId);
            loadFriends();
            setToast({
                isVisible: true,
                message: 'Amistad eliminada',
                type: 'info'
            });
        } catch (err) {
            setToast({
                isVisible: true,
                message: 'Error al eliminar amigo',
                type: 'error'
            });
        }
    };

    const closeToast = () => {
        setToast({
            ...toast,
            isVisible: false
        });
    };

    const getUserInitial = (user) => {
        return user.name?.charAt(0).toUpperCase() || user.userName?.charAt(0).toUpperCase() || 'U';
    };

    const getStatusButton = (user) => {
        switch (user.friendshipStatus) {
            case 'accepted':
                return <span className="badge badge-success">Amigos</span>;
            case 'pending':
                return user.isSentByMe ? (
                    <span className="badge badge-warning">Solicitud enviada</span>
                ) : (
                    <button
                        className="btn-accept"
                        onClick={() => handleAcceptRequest(user.friendshipId)}
                    >
                        Aceptar
                    </button>
                );
            default:
                return (
                    <button
                        className="btn-add"
                        onClick={() => handleSendRequest(user._id)}
                    >
                        Agregar
                    </button>
                );
        }
    };

    return (
        <>
            <HeaderAt />
            <div className='divContainer'>
                <Sidebar />
                <div className="container">
                    <div className="friends-container">
                        <h1>Amigos</h1>

                        {error && <div className="error-message">{error}</div>}

                        <div className="tabs">
                            <button
                                className={`tab ${activeTab === 'search' ? 'active' : ''}`}
                                onClick={() => setActiveTab('search')}
                            >
                                Buscar
                            </button>
                            <button
                                className={`tab ${activeTab === 'friends' ? 'active' : ''}`}
                                onClick={() => setActiveTab('friends')}
                            >
                                Mis Amigos ({friends.length})
                            </button>
                            <button
                                className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
                                onClick={() => setActiveTab('requests')}
                            >
                                Solicitudes ({requests.length})
                            </button>
                        </div>

                        {activeTab === 'search' && (
                            <div className="tab-content">
                                <form onSubmit={handleSearch} className="search-form">
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre o usuario..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="search-input"
                                    />
                                    <button type="submit" className="btn-search" disabled={loading}>
                                        {loading ? 'Buscando...' : 'Buscar'}
                                    </button>
                                </form>

                                <div className="results-list">
                                    {searchResults.length === 0 && searchQuery && !loading && (
                                        <p className="no-results">No se encontraron usuarios</p>
                                    )}
                                    {searchResults.map(user => (
                                        <div key={user._id} className="user-card">
                                            <div className="user-info">
                                                {user.userImage ? (
                                                    <img
                                                        src={`/images/profile-imgs/${user.userImage}`}
                                                        alt={user.userName}
                                                        className="user-avatar"
                                                    />
                                                ) : (
                                                    <div className="user-avatar-default">
                                                        {getUserInitial(user)}
                                                    </div>
                                                )}
                                                <div>
                                                    <h3>{user.name || user.userName}</h3>
                                                    <p className="username">@{user.userName}</p>
                                                </div>
                                            </div>
                                            {getStatusButton(user)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'friends' && (
                            <div className="tab-content">
                                {loading ? (
                                    <p>Cargando...</p>
                                ) : friends.length === 0 ? (
                                    <p className="no-results">Aun no tienes amigos agregados</p>
                                ) : (
                                    <div className="results-list">
                                        {friends.map(friend => (
                                            <div key={friend._id} className="user-card">
                                                <div
                                                    className="user-info"
                                                    onClick={() => navigate(`/profile/${friend.userName}`)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {friend.userImage ? (
                                                        <img
                                                            src={`/images/profile-imgs/${friend.userImage}`}
                                                            alt={friend.userName}
                                                            className="user-avatar"
                                                        />
                                                    ) : (
                                                        <div className="user-avatar-default">
                                                            {getUserInitial(friend)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3>{friend.name || friend.userName}</h3>
                                                        <p className="username">@{friend.userName}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    className="btn-remove"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveFriend(friend._id);
                                                    }}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'requests' && (
                            <div className="tab-content">
                                {loading ? (
                                    <p>Cargando...</p>
                                ) : requests.length === 0 ? (
                                    <p className="no-results">No tienes solicitudes pendientes</p>
                                ) : (
                                    <div className="results-list">
                                        {requests.map(request => (
                                            <div key={request._id} className="user-card">
                                                <div
                                                    className="user-info"
                                                    onClick={() => navigate(`/profile/${request.sender.userName}`)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {request.sender?.userImage ? (
                                                        <img
                                                            src={`/images/profile-imgs/${request.sender.userImage}`}
                                                            alt={request.sender.userName}
                                                            className="user-avatar"
                                                        />
                                                    ) : (
                                                        <div className="user-avatar-default">
                                                            {getUserInitial(request.sender)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3>{request.sender?.name || request.sender?.userName}</h3>
                                                        <p className="username">@{request.sender?.userName}</p>
                                                    </div>
                                                </div>
                                                <div
                                                    className="request-actions"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <button
                                                        className="btn-accept"
                                                        onClick={() => handleAcceptRequest(request._id)}
                                                    >
                                                        Aceptar
                                                    </button>
                                                    <button
                                                        className="btn-reject"
                                                        onClick={() => handleRejectRequest(request._id)}
                                                    >
                                                        Rechazar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

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

export default FriendsPage;