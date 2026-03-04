import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPendingRequests } from './services/friendshipService';
import '../src/css/sidebar.css';

export default function Sidebar() {
    const [isClosed, setIsClosed] = useState(true);
    const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
    const sidebarRef = React.useRef(null);

    useEffect(() => {
        loadPendingRequests();
        
        // Escuchar eventos de actualización de solicitudes
        const handleUpdateRequests = () => {
            loadPendingRequests();
        };
        
        window.addEventListener('friendRequestsUpdated', handleUpdateRequests);
        
        // Actualizar cada 30 segundos
        const interval = setInterval(loadPendingRequests, 30000);
        
        return () => {
            window.removeEventListener('friendRequestsUpdated', handleUpdateRequests);
            clearInterval(interval);
        };
    }, []);

    // Detectar clics fuera del sidebar para cerrarlo
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Solo actuar si el sidebar está abierto
            if (!isClosed && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsClosed(true);
            }
        };

        // Agregar listener solo cuando el sidebar está abierto
        if (!isClosed) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isClosed]);

    const loadPendingRequests = async () => {
        try {
            const requests = await getPendingRequests();
            setPendingRequestsCount(requests.length);
        } catch (err) {
            // Si hay error (no autenticado, etc.), no mostrar contador
            setPendingRequestsCount(0);
        }
    };

    const handleToggleClick = () => {
        setIsClosed(!isClosed);
    };

    return (
        <div className="sidebarWrapper">
            {/* Overlay para cerrar el sidebar en mobile/tablet */}
            {!isClosed && <div className="sidebar-overlay" onClick={() => setIsClosed(true)}></div>}
            
            <nav className={`sidebar ${isClosed ? 'close' : ''}`} ref={sidebarRef}>
                <header>
                    <div className="image-text">
                        <a href="#" className="text-logo-a" target="_blank">
                            <span className="image">
                                <img src="#" alt="" />
                            </span>
                        </a>
                    </div>

                    <span className="material-icons toggle" onClick={handleToggleClick}>
                        chevron_right
                    </span>
                </header>

                <div className="menu-bar">
                    <div className="menu">
                        <ul className="menu-links">
                            <li className="nav-link" id="border-top">
                                <Link to="/home" className="border-top">
                                    <span className="material-icons icon">home</span>
                                    <span className="text nav-text">Home</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to="/multiplechoiceSubjects">
                                    <span className="material-icons icon">quiz</span>
                                    <span className="text nav-text">Multiplechoice</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to="/flashcardsSubjects">
                                    {/* <span className="material-icons icon">art_track</span> */}
                                    <span className="material-icons icon">style</span>
                                    <span className="text nav-text">Flashcards</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to="/atlasSubjects">
                                    <span className="material-icons icon">art_track</span>
                                    <span className="text nav-text">Atlas</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to="/friends">
                                    <span className="material-icons icon">group</span>
                                    <span className="text nav-text">Amigos</span>
                                    {pendingRequestsCount > 0 && (
                                        <span className="notification-badge">
                                            {pendingRequestsCount}
                                        </span>
                                    )}
                                </Link>
                            </li>

                            <li className="nav-link">
                                <Link to="/my-activities">
                                    <span className="material-icons icon">folder</span>
                                    <span className="text nav-text">Mis Actividades</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to="/favorites">
                                    <span className="material-icons icon">star</span>
                                    <span className="text nav-text">Favoritos</span>
                                </Link>
                            </li>
                            {/* <li className="nav-link">
                                <a href="#">
                                    <span className="material-icons icon">chat</span>
                                    <span className="text nav-text">Chat</span>
                                </a>
                            </li> */}
                            <li className="nav-link">
                                <Link to="/create" className="border-bottom">
                                    <span className="material-icons icon">add_circle</span>
                                    <span className="text nav-text">Crear</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>

    );
}