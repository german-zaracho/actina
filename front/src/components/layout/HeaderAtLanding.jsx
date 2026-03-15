import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { useAuth } from '../../AuthContext';
import '../../css/styles.css';

export default function HeaderAtLanding() {
    const navigate = useNavigate();
    const { login: loginContext } = useAuth();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
    const [loadingGuest, setLoadingGuest] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 600);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleGuestLogin = async () => {
        setLoadingGuest(true);
        try {
            const { account, token } = await login({
                userName: "guest1",
                password: "guest1235"
            });
            await loginContext(token, account);
            navigate("/home", { replace: true });
        } catch (err) {
            console.error("Error al ingresar como invitado:", err);
            alert("No se pudo ingresar como invitado");
        } finally {
            setLoadingGuest(false);
        }
    };

    return (
        <header className='whiteHeader'>
            <div className='logoContainer'>

                <Link to="/home" className="border-top">
                    <img
                        src={isMobile ? "/logo2.png" : "/logo.png"}
                        alt="Logo de Actina"
                    />
                </Link>

                <div className='access'>
                    <button
                        className="btnWhite"
                        onClick={handleGuestLogin}
                        disabled={loadingGuest}
                    >
                        {loadingGuest ? "Cargando..." : "Ingresar como invitado"}
                    </button>
                    <Link to="/login" className="btnGreen">Iniciar sesión</Link>
                </div>

            </div>
        </header>
    );
}
