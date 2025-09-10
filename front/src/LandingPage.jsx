import React from 'react';
import HeaderAtLanding from './HeaderAtLanding';
import Footer from './Footer'

export default function LandingPage() {

    return (
        <>
            <HeaderAtLanding />
            <section className='landingSection'>

                <div className='landingText'>
                    <h2>Bienvenido!</h2>
                    <p>Sumérgete en el mundo de la medicina con nuestra aplicación, diseñada para estudiantes y entusiastas de la salud que buscan profundizar su conocimiento y habilidades. Con una interfaz intuitiva y recursos interactivos, nuestra plataforma es el compañero perfecto para el aprendizaje continuo y la revisión eficiente.</p>
                </div>

                <div>
                    <div className='imgWrapper'><img src="../../src/assets/images/views/homeNormal.jpg" alt="Home del sitio web Actina" className='' /></div>
                </div>

            </section>

            <section className='landingSection'>

                <div>
                    <div className='imgWrapper'><img src="../../src/assets/images/views/multiplechoiceInicio.jpg" alt="Pagina de multiplechoice del sitio Actina" className='' /></div>
                </div>

                <div className='landingText'>
                    <h2>Multiplechoice</h2>
                    <p>Ya sea que estés estudiando para un examen, repasando conceptos clave o simplemente deseas poner a prueba tus conocimientos, nuestra aplicación es la herramienta perfecta.<br />Aquí encontrarás una amplia variedad de preguntas relacionadas con diferentes áreas de la medicina, como anatomía, fisiología, farmacología, patología y más.</p>
                </div>

            </section>

            <section className='landingSection'>

                <div className='landingText'>
                    <h2>Flashcards</h2>
                    <p>¿Quieres mejorar tus conocimientos médicos de manera efectiva? Con nuestras flashcards, podrás repasar y memorizar conceptos médicos clave de manera eficiente y efectiva. Además, puedes personalizar o incluso crear tus propias flashcards.</p>
                </div>
                
                <div>
                    <div className='imgWrapper'><img src="../../src/assets/images/views/flashcardInicio.jpg" alt="Pagina de flashcard del sitio Actina" className='' /></div>
                </div>

            </section>

            <section className='landingSection'>

                <div>
                    <div className='imgWrapper'><img src="../../src/assets/images/views/atlasHome.jpg" alt="Pagina de Atlas del sitio web Actina" className='' /></div>
                </div>

                <div className='landingText'>
                    <h2>Atlas</h2>
                    <p>Nuestros atlas te permitirán navegar fácilmente a través de las imágenes de diferentes partes del cuerpo, órganos y patologías; las cuales vienen acompañadas de descripciones que te brindarán información adicional y estarán relacionadas con las flashcards en caso de querer extender la búsqueda.</p>
                </div>

            </section>

            <section className='landingSection'>

                <div className='landingText'>
                    <h2>Actividades de chat</h2>
                    <p>La aplicación consta de un chat en tiempo real que te permitirá registrar, categorizar y compartir fragmentos de conversaciones como actividades. Diseñada para documentar aquellas simulaciones en las que se presenta un paciente y debemos llegar a un diagnostico y un tratamiento.</p>
                </div>
                
                <div>
                    <div className='imgWrapper'><img src="../../src/assets/images/views/homeNormal.jpg" alt="Home del sitio web Actina" className='' /></div>
                </div>

            </section>

            <Footer/>

        </>
    );
}