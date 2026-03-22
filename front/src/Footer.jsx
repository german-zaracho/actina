import React from 'react';
import './css/footer.css';

export default function Footer() {
    return (
        <footer>
            <div className="footer-top">

                {/* Marca */}
                <div className="footer-brand">
                    <img src="/logo.png" alt="Logo de Actina" />
                    <p>Plataforma de estudio para estudiantes de medicina. Repasá contenido con multiplechoice, flashcards y atlas interactivos.</p>
                </div>

                {/* Recursos */}
                <div className="footer-col">
                    <h4>Recursos</h4>
                    <p>Sobre nosotros</p>
                    <p>Contacto</p>
                    <p>Condiciones de servicio</p>
                </div>

                {/* Más */}
                <div className="footer-col">
                    <h4>Más</h4>
                    <p>Android app</p>
                    <p>iOS app</p>
                    <p>FAQ</p>
                </div>

            </div>

            <div className="footer-bottom">
                <p className="footer-copy">
                    © {new Date().getFullYear()} <span>Actina</span>. Todos los derechos reservados.
                </p>

                <div className="footer-social">
                    <a href="#" target="_blank" rel="noreferrer" aria-label="Facebook">
                        <img src="/images/icons/facebook.png" alt="Facebook" />
                    </a>
                    <a href="#" target="_blank" rel="noreferrer" aria-label="Twitter">
                        <img src="/images/icons/gorjeo.png" alt="Twitter" />
                    </a>
                    <a href="#" target="_blank" rel="noreferrer" aria-label="Instagram">
                        <img src="/images/icons/instagram.png" alt="Instagram" />
                    </a>
                </div>
            </div>
        </footer>
    );
}