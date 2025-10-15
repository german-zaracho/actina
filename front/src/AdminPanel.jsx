import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserRole } from './services/authService';
import MultiplechoiceList from './MultiplechoiceList';
import MultiplechoiceForm from './MultiplechoiceForm';
import FlashcardList from './FlashcardList';
import FlashcardForm from './FlashcardForm';
import AtlasList from './AtlasList';
import AtlasForm from './AtlasForm';
import HeaderAt from './HeaderAt';
import { useAuth } from './AuthContext';
import './css/admin.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const { isAdmin, loading } = useAuth();

    const [activeSection, setActiveSection] = useState('dashboard');

    // Multiplechoices
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Flashcards
    const [showFlashcardForm, setShowFlashcardForm] = useState(false);
    const [editingFlashcard, setEditingFlashcard] = useState(null);

    // Atlas
    const [showAtlasForm, setShowAtlasForm] = useState(false);
    const [editingAtlas, setEditingAtlas] = useState(null);

    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate('/home');
        }
    }, [isAdmin, loading, navigate]);

    // useEffect(() => {
    //     checkAdminAccess();
    // }, []);

    // const checkAdminAccess = async () => {
    //     try {
    //         const roleData = await getCurrentUserRole();

    //         if (roleData.rol !== 2) {
    //             navigate('/home');
    //             return;
    //         }

    //         setIsAdmin(true);
    //     } catch (error) {
    //         console.error('Error checking admin access:', error);
    //         navigate('/login');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

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
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <h3>Multiple Choices</h3>
                                    <p className="stat-number">-</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Flashcards</h3>
                                    <p className="stat-number">-</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Atlas</h3>
                                    <p className="stat-number">-</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Usuarios</h3>
                                    <p className="stat-number">-</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'multiplechoices' && (
                        <div className="content-section">
                            {/* <h1>Gestión de Multiple Choice</h1>
                            <button className="btn-primary">Crear Nuevo</button>
                            <p>Aquí irá la lista de multiple choices con opciones CRUD</p> */}
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
                            <h1>Gestión de Usuarios</h1>
                            <p>Aquí irá la lista de usuarios</p>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default AdminPanel;