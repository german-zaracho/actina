import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../css/styles.css';

export default function HeaderAtLanding() {

    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 600);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header className='whiteHeader'>
            <div className='logoContainer'>
                
                <Link to="/home" className="border-top">
                    <img
                        src={isMobile ? "../../public/logo2.png" : "../../public/logo.png"}
                        alt="Logo de Actina"
                    />
                </Link>

                <div className='access'>
                    {/* <Link to="/home" className="btnGreen">Acceder como invitado</Link> */}
                    <Link to="/login" className="btnGreen">Iniciar sesión</Link>
                </div>

            </div>
        </header>
    );
}
