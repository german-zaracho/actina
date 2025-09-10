import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import HeaderAt from './HeaderAt.jsx';

export default function Home(

) {

    return (
        <>
            <HeaderAt />
            <div className='divContainer'>
                <Sidebar />
                <div className='container'>
                    <div className='homeSection'>
                        <h2 className='searchTitle'>Hola, Bienvenid@!</h2>
                        <div className='searchField'>
                            <span className="bx bx-search icon" />
                            <input placeholder='Buscar' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
