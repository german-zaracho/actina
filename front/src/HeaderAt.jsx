import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../src/css/styles.css';
import backgroundImage from '../src/assets/trama5.png';

export default function HeaderAt() {

    return (
        <header className='whiteHeader'>
                <div className='logoContainer'>
                    <Link to="/home" className="border-top homeA">
                        <img src="../../public/logo.png" alt="Logo de Actina" />
                    </Link>

                    <a href="/" className='homeA'>
                        <span className='user'>N</span>
                    </a>

                </div>
        </header>
    );
}