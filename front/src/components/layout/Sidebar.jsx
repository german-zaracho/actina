// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getPendingRequests } from '../../services/friendshipService';
// import '../../css/sidebar.css';

// export default function Sidebar() {
//     const [isClosed, setIsClosed] = useState(true);
//     const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
//     const sidebarRef = React.useRef(null);

//     useEffect(() => {
//         loadPendingRequests();
        
//         // Escucha eventos de actualización de solicitudes
//         const handleUpdateRequests = () => {
//             loadPendingRequests();
//         };
        
//         window.addEventListener('friendRequestsUpdated', handleUpdateRequests);
        
//         // Actualiza cada 30 segundos
//         const interval = setInterval(loadPendingRequests, 30000);
        
//         return () => {
//             window.removeEventListener('friendRequestsUpdated', handleUpdateRequests);
//             clearInterval(interval);
//         };
//     }, []);

//     // Detectar clics fuera del sidebar para cerrarlo
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             // Solo actua si el sidebar está abierto
//             if (!isClosed && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//                 setIsClosed(true);
//             }
//         };

//         // Agrega listener solo cuando el sidebar está abierto
//         if (!isClosed) {
//             document.addEventListener('mousedown', handleClickOutside);
//         }

//         // Cleanup
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [isClosed]);

//     const loadPendingRequests = async () => {
//         try {
//             const requests = await getPendingRequests();
//             setPendingRequestsCount(requests.length);
//         } catch (err) {
//             // Si hay un error (no autenticado, etc.), no mostra el contador
//             setPendingRequestsCount(0);
//         }
//     };

//     const handleToggleClick = () => {
//         setIsClosed(!isClosed);
//     };

//     return (
//         <div className="sidebarWrapper">
//             {/* Overlay para cerrar el sidebar en mobile/tablet */}
//             {!isClosed && <div className="sidebar-overlay" onClick={() => setIsClosed(true)}></div>}
            
//             <nav className={`sidebar ${isClosed ? 'close' : ''}`} ref={sidebarRef}>
//                 <header>
//                     <div className="image-text">
//                         <a href="#" className="text-logo-a" target="_blank">
//                             <span className="image">
//                                 <img src="#" alt="" />
//                             </span>
//                         </a>
//                     </div>

//                     <span className="material-icons toggle" onClick={handleToggleClick}>
//                         chevron_right
//                     </span>
//                 </header>

//                 <div className="menu-bar">
//                     <div className="menu">
//                         <ul className="menu-links">
//                             <li className="nav-link" id="border-top">
//                                 <Link to="/home" className="border-top">
//                                     <span className="material-icons icon">home</span>
//                                     <span className="text nav-text">Home</span>
//                                 </Link>
//                             </li>
//                             <li className="nav-link">
//                                 <Link to="/multiplechoiceSubjects">
//                                     <span className="material-icons icon">quiz</span>
//                                     <span className="text nav-text">Multiplechoice</span>
//                                 </Link>
//                             </li>
//                             <li className="nav-link">
//                                 <Link to="/flashcardsSubjects">
//                                     {/* <span className="material-icons icon">art_track</span> */}
//                                     <span className="material-icons icon">style</span>
//                                     <span className="text nav-text">Flashcards</span>
//                                 </Link>
//                             </li>
//                             <li className="nav-link">
//                                 <Link to="/atlasSubjects">
//                                     <span className="material-icons icon">art_track</span>
//                                     <span className="text nav-text">Atlas</span>
//                                 </Link>
//                             </li>
//                             <li className="nav-link">
//                                 <Link to="/friends">
//                                     <span className="material-icons icon">group</span>
//                                     <span className="text nav-text">Amigos</span>
//                                     {pendingRequestsCount > 0 && (
//                                         <span className="notification-badge">
//                                             {pendingRequestsCount}
//                                         </span>
//                                     )}
//                                 </Link>
//                             </li>

//                             <li className="nav-link">
//                                 <Link to="/my-activities">
//                                     <span className="material-icons icon">folder</span>
//                                     <span className="text nav-text">Mis Actividades</span>
//                                 </Link>
//                             </li>
//                             <li className="nav-link">
//                                 <Link to="/favorites">
//                                     {/* <span className="material-icons icon">star</span> */}
//                                     <i className='bx bxs-bookmark icon'></i>
//                                     <span className="text nav-text">Favoritos</span>
//                                 </Link>
//                             </li>
//                             {/* <li className="nav-link">
//                                 <a href="#">
//                                     <span className="material-icons icon">chat</span>
//                                     <span className="text nav-text">Chat</span>
//                                 </a>
//                             </li> */}
//                             <li className="nav-link">
//                                 <Link to="/create" className="border-bottom">
//                                     <span className="material-icons icon">add_circle</span>
//                                     <span className="text nav-text">Crear</span>
//                                 </Link>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//             </nav>
//         </div>

//     );
// }

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getPendingRequests } from '../../services/friendshipService';
import '../../css/sidebar.css';

export default function Sidebar() {
    const [isClosed, setIsClosed] = useState(true);
    const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 650);
    const sidebarRef = React.useRef(null);
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 650);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        loadPendingRequests();

        const handleUpdateRequests = () => loadPendingRequests();
        window.addEventListener('friendRequestsUpdated', handleUpdateRequests);
        const interval = setInterval(loadPendingRequests, 30000);

        return () => {
            window.removeEventListener('friendRequestsUpdated', handleUpdateRequests);
            clearInterval(interval);
        };
    }, []);

    // Cerrar sidebar lateral al hacer click fuera (solo desktop)
    useEffect(() => {
        if (isMobile) return;

        const handleClickOutside = (event) => {
            if (!isClosed && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsClosed(true);
            }
        };

        if (!isClosed) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isClosed, isMobile]);

    const loadPendingRequests = async () => {
        try {
            const requests = await getPendingRequests();
            setPendingRequestsCount(requests.length);
        } catch {
            setPendingRequestsCount(0);
        }
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { to: '/home',                    icon: 'home',        label: 'Home' },
        { to: '/multiplechoiceSubjects',  icon: 'quiz',        label: 'Multiplechoice' },
        { to: '/flashcardsSubjects',      icon: 'style',       label: 'Flashcards' },
        { to: '/atlasSubjects',           icon: 'art_track',   label: 'Atlas' },
        { to: '/friends',                 icon: 'group',       label: 'Amigos',  badge: pendingRequestsCount },
        { to: '/my-activities',           icon: 'folder',      label: 'Mis Actividades' },
        { to: '/favorites',               icon: 'bookmark',    label: 'Favoritos' },
        { to: '/create',                  icon: 'add_circle',  label: 'Crear' },
    ];

    /* ── BOTTOM NAV (mobile ≤650px) ── */
    if (isMobile) {
        // Mostramos solo 5 items en la barra; el resto en un "más"
        const visibleItems = navItems.slice(0, 5);

        return (
            <nav className="bottom-nav">
                {visibleItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`bottom-nav-item ${isActive(item.to) ? 'active' : ''}`}
                    >
                        <div className="bottom-nav-icon-wrap">
                            <span className="material-icons">{item.icon}</span>
                            {item.badge > 0 && (
                                <span className="bottom-nav-badge">{item.badge}</span>
                            )}
                        </div>
                        <span className="bottom-nav-label">{item.label}</span>
                    </Link>
                ))}

                {/* Botón "Más" que abre el resto */}
                <MoreMenu items={navItems.slice(5)} pendingRequestsCount={pendingRequestsCount} isActive={isActive} />
            </nav>
        );
    }

    /* ── SIDEBAR LATERAL (desktop >650px) ── */
    return (
        <div className="sidebarWrapper">
            {!isClosed && (
                <div className="sidebar-overlay" onClick={() => setIsClosed(true)} />
            )}

            <nav className={`sidebar ${isClosed ? 'close' : ''}`} ref={sidebarRef}>
                <header>
                    <div className="image-text">
                        <a href="#" className="text-logo-a" target="_blank">
                            <span className="image"><img src="#" alt="" /></span>
                        </a>
                    </div>
                    <span className="material-icons toggle" onClick={() => setIsClosed(!isClosed)}>
                        chevron_right
                    </span>
                </header>

                <div className="menu-bar">
                    <div className="menu">
                        <ul className="menu-links">
                            {navItems.map((item, i) => (
                                <li
                                    key={item.to}
                                    className={`nav-link ${i === 0 ? 'border-top' : ''} ${i === navItems.length - 1 ? 'border-bottom' : ''}`}
                                    id={i === 0 ? 'border-top' : undefined}
                                >
                                    <Link to={item.to} className={i === 0 ? 'border-top' : i === navItems.length - 1 ? 'border-bottom' : ''}>
                                        <span className="material-icons icon">{item.icon}</span>
                                        <span className="text nav-text">{item.label}</span>
                                        {item.badge > 0 && (
                                            <span className="notification-badge">{item.badge}</span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

/* ── Componente interno: menú "Más" ── */
function MoreMenu({ items, isActive }) {
    const [open, setOpen] = useState(false);

    // Cerrar al tocar fuera
    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (!e.target.closest('.more-menu-container')) setOpen(false);
        };
        document.addEventListener('touchstart', handler);
        document.addEventListener('mousedown', handler);
        return () => {
            document.removeEventListener('touchstart', handler);
            document.removeEventListener('mousedown', handler);
        };
    }, [open]);

    return (
        <div className="more-menu-container">
            {open && (
                <div className="more-menu-popup">
                    {items.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`more-menu-item ${isActive(item.to) ? 'active' : ''}`}
                            onClick={() => setOpen(false)}
                        >
                            <span className="material-icons">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            )}
            <button
                className={`bottom-nav-item ${open ? 'active' : ''}`}
                onClick={() => setOpen(!open)}
            >
                <div className="bottom-nav-icon-wrap">
                    <span className="material-icons">more_horiz</span>
                </div>
                <span className="bottom-nav-label">Más</span>
            </button>
        </div>
    );
}