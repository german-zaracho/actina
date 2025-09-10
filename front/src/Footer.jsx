import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../src/css/styles.css';

export default function Footer() {

    return (
        <footer>

            <div className="columnContainer">

                <div className="footerColumn">
                    <img src="../../src/assets/logoBlanco.png" alt="Logo de Actina" />
                </div>

                <div className="footerColumn">
                    <h3>Recursos</h3>
                    <p>Sobre nosotros</p>
                    <p>Contacto</p>
                    <p>Condiciones de servicio</p>
                </div>

                <div className="footerColumn">
                    <h3>Más</h3>
                    <p>Android app</p>
                    <p>iOS app</p>
                    <p>FAQ</p>
                </div>

            </div>

            <hr />
            <div className="rowContainer">

                <div className="socialMediaContainer">

                    <a href="#" target="_blank" className="socialIcon"><img src="../../src/assets/icons/facebook.png"
                        alt="Facebook" /></a>
                    <a href="#" target="_blank" className="socialIcon"><img src="../../src/assets/icons/gorjeo.png"
                        alt="Twitter" /></a>
                    <a href="#" target="_blank" className="socialIcon"><img src="../../src/assets/icons/instagram.png"
                        alt="Instagram" /></a>

                </div>

                <div>
                    <form action="#" method="post">
                        <input type="email" name="email" placeholder="Enter your email" required />
                        <button type="submit">Subscribe</button>
                        <div className='inputFooterContainer'>
                            <input type="checkbox" name="suscribe" id="" />
                            <p>Sí, quiero recibir correos electrónicos sobre productos, noticias y más de Actina.</p>
                        </div>
                    </form>
                </div>





            </div>



        </footer>
    );
}