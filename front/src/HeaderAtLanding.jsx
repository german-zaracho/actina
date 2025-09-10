import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../src/css/styles.css';

export default function HeaderAtLanding() {

    return (
        <header className='whiteHeader'>
            <div className='logoContainer'>
                <Link to="/home" className="border-top">
                    <img src="../../public/logo.png" alt="Logo de Actina" />
                </Link>

                <div className='access'>
                    {/* <Link to="/home" className="btnGreen">Acceder como invitado</Link> */}
                    <Link to="/login" className="btnGreen">Iniciar sesión</Link>
                </div>


            </div>
        </header>
    );
}
