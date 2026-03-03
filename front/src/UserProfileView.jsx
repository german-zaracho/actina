import React from 'react';
import './css/user-profile-view.css';

const UserProfileView = ({ user, onClose, onEdit }) => {
    const getUserInitial = () => {
        return user.name?.charAt(0).toUpperCase() || 
               user.userName?.charAt(0).toUpperCase() || 'U';
    };

    const getRoleName = (rol) => {
        return rol === 2 ? 'Administrador' : 'Usuario';
    };

    const getRoleBadge = (rol) => {
        return rol === 2 ? 'admin-badge' : 'user-badge';
    };

    return (
        <div className="user-profile-view">
            <div className="profile-view-header">
                <h2>Perfil de Usuario</h2>
                <button className="btn-close" onClick={onClose}>
                    <span className="material-icons">close</span>
                </button>
            </div>

            <div className="profile-view-content">
                {/* Avatar y datos principales */}
                <div className="profile-header-section">
                    <div className="profile-avatar-large">
                        {user.userImage ? (
                            <img 
                                src={`/src/assets/images/profile-imgs/${user.userImage}`}
                                alt={user.userName}
                            />
                        ) : (
                            <div className="default-avatar-large">
                                {getUserInitial()}
                            </div>
                        )}
                    </div>
                    <div className="profile-main-info">
                        <h3>{user.name || user.userName}</h3>
                        <p className="username-display">@{user.userName}</p>
                        <span className={`role-badge ${getRoleBadge(user.rol)}`}>
                            {getRoleName(user.rol)}
                        </span>
                    </div>
                </div>

                {/* Información detallada */}
                <div className="profile-details-grid">
                    <div className="detail-item">
                        <span className="detail-label">
                            <span className="material-icons">email</span>
                            Email
                        </span>
                        <span className="detail-value">
                            {user.email || 'No especificado'}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            <span className="material-icons">location_on</span>
                            Ubicación
                        </span>
                        <span className="detail-value">
                            {user.location || 'No especificado'}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            <span className="material-icons">cake</span>
                            Fecha de Nacimiento
                        </span>
                        <span className="detail-value">
                            {user.birthDate 
                                ? new Date(user.birthDate).toLocaleDateString('es-AR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                                : 'No especificado'
                            }
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            <span className="material-icons">event</span>
                            Fecha de Creación
                        </span>
                        <span className="detail-value">
                            {user.createdAt 
                                ? new Date(user.createdAt).toLocaleDateString('es-AR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                                : 'No especificado'
                            }
                        </span>
                    </div>

                    {user.updatedAt && (
                        <div className="detail-item">
                            <span className="detail-label">
                                <span className="material-icons">update</span>
                                Última Actualización
                            </span>
                            <span className="detail-value">
                                {new Date(user.updatedAt).toLocaleDateString('es-AR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    )}
                </div>

                {/* Biografía */}
                {user.bio && (
                    <div className="bio-section">
                        <h4>
                            <span className="material-icons">description</span>
                            Biografía
                        </h4>
                        <p>{user.bio}</p>
                    </div>
                )}
            </div>

            <div className="profile-view-actions">
                <button className="btn-secondary" onClick={onClose}>
                    Cerrar
                </button>
                <button className="btn-primary" onClick={() => onEdit(user)}>
                    <span className="material-icons">edit</span>
                    Editar Usuario
                </button>
            </div>
        </div>
    );
};

export default UserProfileView;