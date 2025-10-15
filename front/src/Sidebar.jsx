import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../src/css/sidebar.css';

export default function Sidebar() {
    const [isClosed, setIsClosed] = useState(true);

    const handleToggleClick = () => {
        setIsClosed(!isClosed);
    };

    return (
        <div className="sidebarWrapper">
            <nav className={`sidebar ${isClosed ? 'close' : ''}`}>
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
                                    <span className="text nav-text">Multiplechoice</span>
                                </Link>
                            </li>
                            <li className="nav-link" id="border-top">
                                <Link to="/multiplechoiceSubjects" className="border-top">
                                    <span className="material-icons icon">summarize</span>
                                    <span className="text nav-text">Multiplechoice</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to="/flashcardsSubjects">
                                    <span className="material-icons icon">art_track</span>
                                    <span className="text nav-text">Flashcards</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to="/atlasSubjects">
                                    <span className="material-icons icon">menu_book</span>
                                    <span className="text nav-text">Atlas</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to="/friends">
                                    <span className="material-icons icon">group</span>
                                    <span className="text nav-text">Amigos</span>
                                </Link>
                            </li>

                            <li className="nav-link">
                                <a href="#">
                                    <span className="material-icons icon">folder</span>
                                    <span className="text nav-text">Mis Actividades</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="#">
                                    <i className='bx bxs-bookmark icon'></i>
                                    <span className="text nav-text">Favoritos</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="#">
                                    <span className="material-icons icon">chat</span>
                                    <span className="text nav-text">Chat</span>
                                </a>
                            </li>
                            <li className="nav-link">
                                <a href="#" className="border-bottom">
                                    <span className="material-icons icon">add_circle</span>
                                    <span className="text nav-text">Crear</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>

    );
}