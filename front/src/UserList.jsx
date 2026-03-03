

// import React, { useState, useEffect } from 'react';
// import { getAllUsers, deleteUser } from './services/adminService';
// import ConfirmModal from './ConfirmModal';

// const UserList = ({ onEdit, onCreate, onViewProfile }) => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [userToDelete, setUserToDelete] = useState(null);
//     const [expandedUserId, setExpandedUserId] = useState(null);

//     useEffect(() => {
//         loadUsers();
//     }, []);

//     const loadUsers = async () => {
//         try {
//             const data = await getAllUsers();
//             setUsers(data);
//         } catch (err) {
//             setError('Error al cargar los usuarios');
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDeleteClick = (user) => {
//         setUserToDelete(user);
//         setShowDeleteModal(true);
//     };

//     const handleConfirmDelete = async () => {
//         try {
//             await deleteUser(userToDelete._id);
//             setUsers(users.filter(user => user._id !== userToDelete._id));
//             setShowDeleteModal(false);
//             setUserToDelete(null);
//         } catch (err) {
//             alert('Error al eliminar usuario');
//             console.error(err);
//         }
//     };

//     const handleCancelDelete = () => {
//         setShowDeleteModal(false);
//         setUserToDelete(null);
//     };

//     const handleToggleProfile = (userId) => {
//         setExpandedUserId(expandedUserId === userId ? null : userId);
//     };

//     const getRoleName = (rol) => {
//         return rol === 2 ? 'Administrador' : 'Usuario';
//     };

//     const getRoleBadge = (rol) => {
//         return rol === 2 ? 'admin-badge' : 'user-badge';
//     };

//     if (loading) return <div className="loading">Cargando...</div>;
//     if (error) return <div className="error">{error}</div>;

//     return (
//         <>
//             <div className="user-list">
//                 <div className="list-header">
//                     <h2>Usuarios</h2>
//                     <button className="btn-primary" onClick={onCreate}>
//                         Crear Nuevo Usuario
//                     </button>
//                 </div>

//                 <table className="admin-table">
//                     <thead>
//                         <tr>
//                             <th>Usuario</th>
//                             <th>Nombre</th>
//                             <th>Email</th>
//                             <th>Rol</th>
//                             <th>Fecha Creación</th>
//                             <th>Acciones</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {users.map(user => (
//                             <React.Fragment key={user._id}>
//                                 <tr>
//                                     <td data-label="Usuario">
//                                         <div className="user-cell">
//                                             {user.userImage ? (
//                                                 <img 
//                                                     src={`/src/assets/images/profile-imgs/${user.userImage}`}
//                                                     alt={user.userName}
//                                                     className="user-avatar-small"
//                                                 />
//                                             ) : (
//                                                 <div className="user-avatar-small default">
//                                                     {user.name?.charAt(0).toUpperCase() || 
//                                                      user.userName?.charAt(0).toUpperCase() || 'U'}
//                                                 </div>
//                                             )}
//                                             <span className="username-text">@{user.userName}</span>
//                                         </div>
//                                     </td>
//                                     <td data-label="Nombre">{user.name || '-'}</td>
//                                     <td data-label="Email">{user.email || '-'}</td>
//                                     <td data-label="Rol">
//                                         <span className={`role-badge ${getRoleBadge(user.rol)}`}>
//                                             {getRoleName(user.rol)}
//                                         </span>
//                                     </td>
//                                     <td data-label="Fecha">
//                                         {user.createdAt 
//                                             ? new Date(user.createdAt).toLocaleDateString('es-AR')
//                                             : '-'
//                                         }
//                                     </td>
//                                     <td data-label="Acciones" className="actions">
//                                         <button
//                                             className="btn-view"
//                                             onClick={() => handleToggleProfile(user._id)}
//                                             title={expandedUserId === user._id ? "Ocultar perfil" : "Ver perfil"}
//                                         >
//                                             <span className="material-icons">
//                                                 {expandedUserId === user._id ? 'visibility_off' : 'visibility'}
//                                             </span>
//                                         </button>
//                                         <button
//                                             className="btn-edit"
//                                             onClick={() => onEdit(user)}
//                                             title="Editar"
//                                         >
//                                             <span className="material-icons">edit</span>
//                                         </button>
//                                         <button
//                                             className="btn-delete"
//                                             onClick={() => handleDeleteClick(user)}
//                                             title="Eliminar"
//                                         >
//                                             <span className="material-icons">delete</span>
//                                         </button>
//                                     </td>
//                                 </tr>

//                                 {/* Fila expandible con información del perfil */}
//                                 {expandedUserId === user._id && (
//                                     <tr className="profile-detail-row">
//                                         <td colSpan="6">
//                                             <div className="profile-detail-content">
//                                                 <div className="profile-header">
//                                                     <span className="material-icons">person</span>
//                                                     <h3>Información del Perfil</h3>
//                                                 </div>

//                                                 <div className="profile-grid">
//                                                     <div className="profile-item">
//                                                         <span className="profile-label">
//                                                             <span className="material-icons">badge</span>
//                                                             Nombre completo
//                                                         </span>
//                                                         <span className="profile-value">{user.name || 'No especificado'}</span>
//                                                     </div>

//                                                     <div className="profile-item">
//                                                         <span className="profile-label">
//                                                             <span className="material-icons">email</span>
//                                                             Email
//                                                         </span>
//                                                         <span className="profile-value">{user.email || 'No especificado'}</span>
//                                                     </div>

//                                                     <div className="profile-item">
//                                                         <span className="profile-label">
//                                                             <span className="material-icons">cake</span>
//                                                             Fecha de nacimiento
//                                                         </span>
//                                                         <span className="profile-value">
//                                                             {user.birthDate 
//                                                                 ? new Date(user.birthDate).toLocaleDateString('es-AR')
//                                                                 : 'No especificado'
//                                                             }
//                                                         </span>
//                                                     </div>

//                                                     <div className="profile-item">
//                                                         <span className="profile-label">
//                                                             <span className="material-icons">location_on</span>
//                                                             Ubicación
//                                                         </span>
//                                                         <span className="profile-value">{user.location || 'No especificado'}</span>
//                                                     </div>

//                                                     {user.bio && (
//                                                         <div className="profile-item full-width">
//                                                             <span className="profile-label">
//                                                                 <span className="material-icons">description</span>
//                                                                 Biografía
//                                                             </span>
//                                                             <span className="profile-value bio">{user.bio}</span>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 )}
//                             </React.Fragment>
//                         ))}
//                     </tbody>
//                 </table>

//                 {users.length === 0 && (
//                     <p className="empty-message">No hay usuarios registrados</p>
//                 )}
//             </div>

//             <ConfirmModal
//                 isOpen={showDeleteModal}
//                 title="Confirmar eliminación"
//                 message={`¿Estás seguro de que quieres eliminar al usuario "${userToDelete?.userName}"? Esta acción eliminará tanto la cuenta como el perfil y no se puede deshacer.`}
//                 onConfirm={handleConfirmDelete}
//                 onCancel={handleCancelDelete}
//             />
//         </>
//     );
// };

// export default UserList;

import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from './services/adminService';
import ConfirmModal from './ConfirmModal';

const UserList = ({ onEdit, onCreate, onViewProfile }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [expandedUserId, setExpandedUserId] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            setError('Error al cargar los usuarios');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteUser(userToDelete._id);
            setUsers(users.filter(user => user._id !== userToDelete._id));
            setShowDeleteModal(false);
            setUserToDelete(null);
        } catch (err) {
            alert('Error al eliminar usuario');
            console.error(err);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    const handleToggleProfile = (userId) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    const getRoleName = (rol) => {
        return rol === 2 ? 'Administrador' : 'Usuario';
    };

    const getRoleBadge = (rol) => {
        return rol === 2 ? 'admin-badge' : 'user-badge';
    };

    if (loading) return <div className="loading">Cargando...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <>
            <div className="user-list">
                <div className="list-header">
                    <h2>Usuarios</h2>
                    <button className="btn-primary" onClick={onCreate}>
                        Crear Nuevo Usuario
                    </button>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Fecha Creación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <React.Fragment key={user._id}>
                                <tr>
                                    <td data-label="Usuario" title={`@${user.userName}`}>
                                        <div className="user-cell">
                                            {user.userImage ? (
                                                <img
                                                    src={`/src/assets/images/profile-imgs/${user.userImage}`}
                                                    alt={user.userName}
                                                    className="user-avatar-small"
                                                />
                                            ) : (
                                                <div className="user-avatar-small default">
                                                    {user.name?.charAt(0).toUpperCase() ||
                                                        user.userName?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                            )}
                                            <span className="username-text">@{user.userName}</span>
                                        </div>
                                    </td>
                                    <td data-label="Nombre" title={user.name || '-'}>{user.name || '-'}</td>
                                    <td data-label="Email" title={user.email || '-'}>{user.email || '-'}</td>
                                    <td data-label="Rol">
                                        <span className={`role-badge ${getRoleBadge(user.rol)}`}>
                                            {getRoleName(user.rol)}
                                        </span>
                                    </td>
                                    <td data-label="Fecha">
                                        {user.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString('es-AR')
                                            : '-'
                                        }
                                    </td>
                                    <td data-label="Acciones" className="actions">
                                        <button
                                            className="btn-view"
                                            onClick={() => handleToggleProfile(user._id)}
                                            title={expandedUserId === user._id ? "Ocultar perfil" : "Ver perfil"}
                                        >
                                            <span className="material-icons">
                                                {expandedUserId === user._id ? 'visibility_off' : 'visibility'}
                                            </span>
                                        </button>
                                        <button
                                            className="btn-edit"
                                            onClick={() => onEdit(user)}
                                            title="Editar"
                                        >
                                            <span className="material-icons">edit</span>
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDeleteClick(user)}
                                            title="Eliminar"
                                        >
                                            <span className="material-icons">delete</span>
                                        </button>
                                    </td>
                                </tr>

                                {/* Fila expandible con información del perfil */}
                                {expandedUserId === user._id && (
                                    <tr className="profile-detail-row">
                                        <td colSpan="6">
                                            <div className="profile-detail-content">
                                                <div className="profile-header">
                                                    <span className="material-icons">person</span>
                                                    <h3>Información del Perfil</h3>
                                                </div>

                                                <div className="profile-grid">
                                                    <div className="profile-item">
                                                        <span className="profile-label">
                                                            <span className="material-icons">badge</span>
                                                            Nombre completo
                                                        </span>
                                                        <span className="profile-value">{user.name || 'No especificado'}</span>
                                                    </div>

                                                    <div className="profile-item">
                                                        <span className="profile-label">
                                                            <span className="material-icons">email</span>
                                                            Email
                                                        </span>
                                                        <span className="profile-value">{user.email || 'No especificado'}</span>
                                                    </div>

                                                    <div className="profile-item">
                                                        <span className="profile-label">
                                                            <span className="material-icons">cake</span>
                                                            Fecha de nacimiento
                                                        </span>
                                                        <span className="profile-value">
                                                            {user.birthDate
                                                                ? new Date(user.birthDate).toLocaleDateString('es-AR')
                                                                : 'No especificado'
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="profile-item">
                                                        <span className="profile-label">
                                                            <span className="material-icons">location_on</span>
                                                            Ubicación
                                                        </span>
                                                        <span className="profile-value">{user.location || 'No especificado'}</span>
                                                    </div>

                                                    {user.bio && (
                                                        <div className="profile-item full-width">
                                                            <span className="profile-label">
                                                                <span className="material-icons">description</span>
                                                                Biografía
                                                            </span>
                                                            <span className="profile-value bio">{user.bio}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <p className="empty-message">No hay usuarios registrados</p>
                )}
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                title="Confirmar eliminación"
                message={`¿Estás seguro de que quieres eliminar al usuario "${userToDelete?.userName}"? Esta acción eliminará tanto la cuenta como el perfil y no se puede deshacer.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </>
    );
};

export default UserList;