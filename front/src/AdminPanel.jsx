

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getCurrentUserRole } from './services/authService';
// import { getDashboardStats } from './services/adminService';
// import MultiplechoiceList from './MultiplechoiceList';
// import MultiplechoiceForm from './MultiplechoiceForm';
// import FlashcardList from './FlashcardList';
// import FlashcardForm from './FlashcardForm';
// import AtlasList from './AtlasList';
// import AtlasForm from './AtlasForm';
// import UserList from './UserList';
// import UserForm from './UserForm';
// import HeaderAt from './HeaderAt';
// import { useAuth } from './AuthContext';
// import './css/admin.css';

// const AdminPanel = () => {
//     const navigate = useNavigate();
//     const { isAdmin, loading } = useAuth();

//     const [activeSection, setActiveSection] = useState('dashboard');
    
//     // Dashboard stats
//     const [stats, setStats] = useState({
//         totalUsers: 0,
//         totalMultiplechoices: 0,
//         totalFlashcards: 0,
//         totalAtlas: 0,
//         contentThisWeek: 0,
//         activeUsersThisWeek: 0
//     });
//     const [loadingStats, setLoadingStats] = useState(true);

//     // Multiplechoices
//     const [showForm, setShowForm] = useState(false);
//     const [editingItem, setEditingItem] = useState(null);

//     // Flashcards
//     const [showFlashcardForm, setShowFlashcardForm] = useState(false);
//     const [editingFlashcard, setEditingFlashcard] = useState(null);

//     // Atlas
//     const [showAtlasForm, setShowAtlasForm] = useState(false);
//     const [editingAtlas, setEditingAtlas] = useState(null);

//     // Users
//     const [showUserForm, setShowUserForm] = useState(false);
//     const [editingUser, setEditingUser] = useState(null);

//     useEffect(() => {
//         if (!loading && !isAdmin) {
//             navigate('/home');
//         }
//     }, [isAdmin, loading, navigate]);

//     useEffect(() => {
//         if (isAdmin && activeSection === 'dashboard') {
//             loadStats();
//         }
//     }, [isAdmin, activeSection]);

//     const loadStats = async () => {
//         try {
//             setLoadingStats(true);
//             const data = await getDashboardStats();
//             setStats(data);
//         } catch (error) {
//             console.error('Error loading stats:', error);
//         } finally {
//             setLoadingStats(false);
//         }
//     };

//     if (loading) {
//         return (
//             <>
//                 <HeaderAt />
//                 <div className="admin-container">
//                     <div className="loading">Cargando panel de administrador...</div>
//                 </div>
//             </>
//         );
//     }

//     if (!isAdmin) {
//         return null;
//     }

//     return (
//         <>
//             <HeaderAt />
//             <div className="admin-container">
//                 <aside className="admin-sidebar">
//                     <h2>Panel Admin</h2>
//                     <nav className="admin-nav">
//                         <button
//                             className={activeSection === 'dashboard' ? 'active' : ''}
//                             onClick={() => setActiveSection('dashboard')}
//                         >
//                             Dashboard
//                         </button>
//                         <button
//                             className={activeSection === 'multiplechoices' ? 'active' : ''}
//                             onClick={() => setActiveSection('multiplechoices')}
//                         >
//                             Multiple Choice
//                         </button>

//                         <button
//                             className={activeSection === 'flashcards' ? 'active' : ''}
//                             onClick={() => setActiveSection('flashcards')}
//                         >
//                             Flashcards
//                         </button>
//                         <button
//                             className={activeSection === 'atlas' ? 'active' : ''}
//                             onClick={() => setActiveSection('atlas')}
//                         >
//                             Atlas
//                         </button>
//                         <button
//                             className={activeSection === 'users' ? 'active' : ''}
//                             onClick={() => setActiveSection('users')}
//                         >
//                             Usuarios
//                         </button>
//                     </nav>
//                 </aside>

//                 <main className="admin-content">
//                     {activeSection === 'dashboard' && (
//                         <div className="dashboard-section">
//                             <h1>Dashboard</h1>
//                             {loadingStats ? (
//                                 <div className="loading">Cargando estadísticas...</div>
//                             ) : (
//                                 <div className="stats-grid">
//                                     <div className="stat-card">
//                                         <h3>Total Usuarios</h3>
//                                         <p className="stat-number">{stats.totalUsers}</p>
//                                         <span className="stat-label">Usuarios registrados</span>
//                                     </div>
//                                     <div className="stat-card">
//                                         <h3>Multiple Choices</h3>
//                                         <p className="stat-number">{stats.totalMultiplechoices}</p>
//                                         <span className="stat-label">Grupos creados</span>
//                                     </div>
//                                     <div className="stat-card">
//                                         <h3>Flashcards</h3>
//                                         <p className="stat-number">{stats.totalFlashcards}</p>
//                                         <span className="stat-label">Grupos creados</span>
//                                     </div>
//                                     <div className="stat-card">
//                                         <h3>Atlas</h3>
//                                         <p className="stat-number">{stats.totalAtlas}</p>
//                                         <span className="stat-label">Páginas creadas</span>
//                                     </div>
//                                     <div className="stat-card stat-highlight">
//                                         <h3>Contenido Esta Semana</h3>
//                                         <p className="stat-number">{stats.contentThisWeek}</p>
//                                         <span className="stat-label">Actividades creadas (últimos 7 días)</span>
//                                     </div>
//                                     <div className="stat-card stat-highlight">
//                                         <h3>Usuarios Activos</h3>
//                                         <p className="stat-number">{stats.activeUsersThisWeek}</p>
//                                         <span className="stat-label">Usuarios que crearon contenido esta semana</span>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {activeSection === 'multiplechoices' && (
//                         <div className="content-section">
//                             {showForm ? (
//                                 <MultiplechoiceForm
//                                     item={editingItem}
//                                     onSave={() => {
//                                         setShowForm(false);
//                                         setEditingItem(null);
//                                     }}
//                                     onCancel={() => {
//                                         setShowForm(false);
//                                         setEditingItem(null);
//                                     }}
//                                 />
//                             ) : (
//                                 <MultiplechoiceList
//                                     onCreate={() => {
//                                         setEditingItem(null);
//                                         setShowForm(true);
//                                     }}
//                                     onEdit={(item) => {
//                                         setEditingItem(item);
//                                         setShowForm(true);
//                                     }}
//                                 />
//                             )}
//                         </div>
//                     )}

//                     {activeSection === 'flashcards' && (
//                         <div className="content-section">
//                             {showFlashcardForm ? (
//                                 <FlashcardForm
//                                     item={editingFlashcard}
//                                     onSave={() => {
//                                         setShowFlashcardForm(false);
//                                         setEditingFlashcard(null);
//                                     }}
//                                     onCancel={() => {
//                                         setShowFlashcardForm(false);
//                                         setEditingFlashcard(null);
//                                     }}
//                                 />
//                             ) : (
//                                 <FlashcardList
//                                     onCreate={() => {
//                                         setEditingFlashcard(null);
//                                         setShowFlashcardForm(true);
//                                     }}
//                                     onEdit={(item) => {
//                                         setEditingFlashcard(item);
//                                         setShowFlashcardForm(true);
//                                     }}
//                                 />
//                             )}
//                         </div>
//                     )}

//                     {activeSection === 'atlas' && (
//                         <div className="content-section">
//                             {showAtlasForm ? (
//                                 <AtlasForm
//                                     item={editingAtlas}
//                                     onSave={() => {
//                                         setShowAtlasForm(false);
//                                         setEditingAtlas(null);
//                                     }}
//                                     onCancel={() => {
//                                         setShowAtlasForm(false);
//                                         setEditingAtlas(null);
//                                     }}
//                                 />
//                             ) : (
//                                 <AtlasList
//                                     onCreate={() => {
//                                         setEditingAtlas(null);
//                                         setShowAtlasForm(true);
//                                     }}
//                                     onEdit={(item) => {
//                                         setEditingAtlas(item);
//                                         setShowAtlasForm(true);
//                                     }}
//                                 />
//                             )}
//                         </div>
//                     )}

//                     {activeSection === 'users' && (
//                         <div className="content-section">
//                             {showUserForm ? (
//                                 <UserForm
//                                     user={editingUser}
//                                     onSave={() => {
//                                         setShowUserForm(false);
//                                         setEditingUser(null);
//                                     }}
//                                     onCancel={() => {
//                                         setShowUserForm(false);
//                                         setEditingUser(null);
//                                     }}
//                                 />
//                             ) : (
//                                 <UserList
//                                     onCreate={() => {
//                                         setEditingUser(null);
//                                         setShowUserForm(true);
//                                     }}
//                                     onEdit={(user) => {
//                                         setEditingUser(user);
//                                         setShowUserForm(true);
//                                     }}
//                                 />
//                             )}
//                         </div>
//                     )}
//                 </main>
//             </div>
//         </>
//     );
// };

// export default AdminPanel;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserRole } from './services/authService';
import { getDashboardStats } from './services/adminService';
import MultiplechoiceList from './MultiplechoiceList';
import MultiplechoiceForm from './MultiplechoiceForm';
import FlashcardList from './FlashcardList';
import FlashcardForm from './FlashcardForm';
import AtlasList from './AtlasList';
import AtlasForm from './AtlasForm';
import UserList from './UserList';
import UserForm from './UserForm';
import HeaderAt from './HeaderAt';
import { useAuth } from './AuthContext';
import './css/admin.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const { isAdmin, loading } = useAuth();

    const [activeSection, setActiveSection] = useState('dashboard');
    
    // Dashboard stats
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalMultiplechoices: 0,
        totalMultiplechoiceQuestions: 0,
        totalMultiplechoiceJustified: 0,
        totalFlashcards: 0,
        totalAtlas: 0,
        contentThisWeek: 0,
        activeUsersThisWeek: 0
    });
    const [loadingStats, setLoadingStats] = useState(true);

    // Multiplechoices
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Flashcards
    const [showFlashcardForm, setShowFlashcardForm] = useState(false);
    const [editingFlashcard, setEditingFlashcard] = useState(null);

    // Atlas
    const [showAtlasForm, setShowAtlasForm] = useState(false);
    const [editingAtlas, setEditingAtlas] = useState(null);

    // Users
    const [showUserForm, setShowUserForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate('/home');
        }
    }, [isAdmin, loading, navigate]);

    useEffect(() => {
        if (isAdmin && activeSection === 'dashboard') {
            loadStats();
        }
    }, [isAdmin, activeSection]);

    const loadStats = async () => {
        try {
            setLoadingStats(true);
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoadingStats(false);
        }
    };

    if (loading) {
        return (
            <>
                <HeaderAt />
                <div className="admin-container">
                    <div className="loading">Cargando panel de administrador...</div>
                </div>
            </>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <>
            <HeaderAt />
            <div className="admin-container">
                <aside className="admin-sidebar">
                    <h2>Panel Admin</h2>
                    <nav className="admin-nav">
                        <button
                            className={activeSection === 'dashboard' ? 'active' : ''}
                            onClick={() => setActiveSection('dashboard')}
                        >
                            Dashboard
                        </button>
                        <button
                            className={activeSection === 'multiplechoices' ? 'active' : ''}
                            onClick={() => setActiveSection('multiplechoices')}
                        >
                            Multiple Choice
                        </button>

                        <button
                            className={activeSection === 'flashcards' ? 'active' : ''}
                            onClick={() => setActiveSection('flashcards')}
                        >
                            Flashcards
                        </button>
                        <button
                            className={activeSection === 'atlas' ? 'active' : ''}
                            onClick={() => setActiveSection('atlas')}
                        >
                            Atlas
                        </button>
                        <button
                            className={activeSection === 'users' ? 'active' : ''}
                            onClick={() => setActiveSection('users')}
                        >
                            Usuarios
                        </button>
                    </nav>
                </aside>

                <main className="admin-content">
                    {activeSection === 'dashboard' && (
                        <div className="dashboard-section">
                            <h1>Dashboard</h1>
                            {loadingStats ? (
                                <div className="loading">Cargando estadísticas...</div>
                            ) : (
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <h3>Total Usuarios</h3>
                                        <p className="stat-number">{stats.totalUsers}</p>
                                        <span className="stat-label">Usuarios registrados</span>
                                    </div>
                                    <div className="stat-card">
                                        <h3>Cantidad de Multiplechoice</h3>
                                        <p className="stat-number">{stats.totalMultiplechoices}</p>
                                        <span className="stat-label">Grupos en la base de datos</span>
                                    </div>
                                    <div className="stat-card">
                                        <h3>Cantidad de Preguntas</h3>
                                        <p className="stat-number">{stats.totalMultiplechoiceQuestions}</p>
                                        <span className="stat-label">Total de preguntas en multiplechoice</span>
                                    </div>
                                    <div className="stat-card">
                                        <h3>Preguntas Justificadas</h3>
                                        <p className="stat-number">{stats.totalMultiplechoiceJustified}</p>
                                        <span className="stat-label">Preguntas con justificación</span>
                                    </div>
                                    <div className="stat-card">
                                        <h3>Flashcards</h3>
                                        <p className="stat-number">{stats.totalFlashcards}</p>
                                        <span className="stat-label">Grupos creados</span>
                                    </div>
                                    <div className="stat-card">
                                        <h3>Atlas</h3>
                                        <p className="stat-number">{stats.totalAtlas}</p>
                                        <span className="stat-label">Páginas creadas</span>
                                    </div>
                                    <div className="stat-card stat-highlight">
                                        <h3>Contenido Esta Semana</h3>
                                        <p className="stat-number">{stats.contentThisWeek}</p>
                                        <span className="stat-label">Actividades creadas (últimos 7 días)</span>
                                    </div>
                                    <div className="stat-card stat-highlight">
                                        <h3>Usuarios Activos</h3>
                                        <p className="stat-number">{stats.activeUsersThisWeek}</p>
                                        <span className="stat-label">Usuarios que crearon contenido esta semana</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeSection === 'multiplechoices' && (
                        <div className="content-section">
                            {showForm ? (
                                <MultiplechoiceForm
                                    item={editingItem}
                                    onSave={() => {
                                        setShowForm(false);
                                        setEditingItem(null);
                                    }}
                                    onCancel={() => {
                                        setShowForm(false);
                                        setEditingItem(null);
                                    }}
                                />
                            ) : (
                                <MultiplechoiceList
                                    onCreate={() => {
                                        setEditingItem(null);
                                        setShowForm(true);
                                    }}
                                    onEdit={(item) => {
                                        setEditingItem(item);
                                        setShowForm(true);
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {activeSection === 'flashcards' && (
                        <div className="content-section">
                            {showFlashcardForm ? (
                                <FlashcardForm
                                    item={editingFlashcard}
                                    onSave={() => {
                                        setShowFlashcardForm(false);
                                        setEditingFlashcard(null);
                                    }}
                                    onCancel={() => {
                                        setShowFlashcardForm(false);
                                        setEditingFlashcard(null);
                                    }}
                                />
                            ) : (
                                <FlashcardList
                                    onCreate={() => {
                                        setEditingFlashcard(null);
                                        setShowFlashcardForm(true);
                                    }}
                                    onEdit={(item) => {
                                        setEditingFlashcard(item);
                                        setShowFlashcardForm(true);
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {activeSection === 'atlas' && (
                        <div className="content-section">
                            {showAtlasForm ? (
                                <AtlasForm
                                    item={editingAtlas}
                                    onSave={() => {
                                        setShowAtlasForm(false);
                                        setEditingAtlas(null);
                                    }}
                                    onCancel={() => {
                                        setShowAtlasForm(false);
                                        setEditingAtlas(null);
                                    }}
                                />
                            ) : (
                                <AtlasList
                                    onCreate={() => {
                                        setEditingAtlas(null);
                                        setShowAtlasForm(true);
                                    }}
                                    onEdit={(item) => {
                                        setEditingAtlas(item);
                                        setShowAtlasForm(true);
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {activeSection === 'users' && (
                        <div className="content-section">
                            {showUserForm ? (
                                <UserForm
                                    user={editingUser}
                                    onSave={() => {
                                        setShowUserForm(false);
                                        setEditingUser(null);
                                    }}
                                    onCancel={() => {
                                        setShowUserForm(false);
                                        setEditingUser(null);
                                    }}
                                />
                            ) : (
                                <UserList
                                    onCreate={() => {
                                        setEditingUser(null);
                                        setShowUserForm(true);
                                    }}
                                    onEdit={(user) => {
                                        setEditingUser(user);
                                        setShowUserForm(true);
                                    }}
                                />
                            )}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default AdminPanel;