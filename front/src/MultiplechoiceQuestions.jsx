import React, { useState } from 'react';
import Modal from 'react-modal';
import { Link, useNavigate, useParams } from 'react-router-dom';
// import jsondata from './data/multiplechoice.json';
import Sidebar from './Sidebar';
import HeaderAt from './HeaderAt';

export default function MultiplechoiceQuestions({ multiplechoices }) {
    const { classification } = useParams();
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };

    const [data, setData] = useState(multiplechoices);
    const [selectedClassification, setSelectedClassification] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showJustification, setShowJustification] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [selectionMade, setSelectionMade] = useState(false);
    const [endAttempt, setEndAttempt] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleNextQuestion = () => {

        if (!endAttempt) {
            if (selectionMade) {
                // Verificar si la opción seleccionada es correcta y actualizar el contador
                if (selectedOption === correctAnswer) {
                    setCorrectAnswersCount((count) => count + 1);
                }
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                setSelectedOption(null); // Reinicia la opción seleccionada al pasar a la siguiente pregunta
                setShowJustification(false);//Al avanzar a la siguiente pregunta, oculta la justificacion 
                setSelectionMade(false);
            }
        } else {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        }

    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
            setSelectedOption(null); // Reinicia la opción seleccionada al pasar a la pregunta anterior
            setShowJustification(false);// Al retroceder a la siguiente pregunta, oculta la justificacion
        }
    };

    const currentQuestion = data
        .filter((multiplechoice) => multiplechoice.classification === classification)
        .flatMap((multiplechoice) => multiplechoice.questions)[currentQuestionIndex];

    const currentMultiplechoice = data
        .filter((multiplechoice) => multiplechoice.classification === classification)[0];

    const currentTotalQuestions = currentMultiplechoice ? currentMultiplechoice.questions.length : 0;

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const handleOptionSelect = (option) => {
        if (!selectionMade) {
            setSelectedOption(option);
        }
    };

    const toggleJustification = () => {
        setShowJustification((prevShow) => !prevShow); // Cambiar el estado para mostrar u ocultar la justificación
    };

    const handleSelectClick = () => {
        setSelectionMade(true);
        console.log(currentQuestionIndex, currentTotalQuestions);
        console.log(currentQuestionIndex !== (currentTotalQuestions - 1));
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const showCalification = () => {
        if (selectedOption === correctAnswer) {
            setCorrectAnswersCount((count) => count + 1);
        }
        setEndAttempt(true);
        handleOpenModal(); // Abre el modal al final del intento
    };

    const correctAnswer = currentQuestion ? currentQuestion.options[currentQuestion.answer - 1] : null;


    return (
        <>
            <HeaderAt />
            <div className="divContainer">
                <Sidebar />
                <div className="container">
                    <div className="solidBgHeading">
                        <h2>Multiplechoice</h2>
                    </div>
                    {currentQuestion ? (
                        <div className='multiplechoiceContainer'>

                            <ul className='questions bgWhite'>
                                <li>
                                    <span className='capitalize'><strong>{capitalizeFirstLetter(currentQuestion.question)}</strong></span>

                                    <ul>
                                        {currentQuestion.options.map((option, optionIndex) => (
                                            <li key={optionIndex}>
                                                <label>
                                                    <input
                                                        type='radio'
                                                        value={option}
                                                        checked={selectedOption === option}
                                                        onChange={() => handleOptionSelect(option)}
                                                    /> {capitalizeFirstLetter(option)}</label>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>

                            {showJustification && (
                                <div className='justification questions bgWhite'>
                                    <p className='respuesta'>{currentQuestion.justification}</p>
                                    {/* {console.log("hola", selectedOption, correctAnswer)} */}

                                    <p className='respuesta'><strong>Respuesta Correcta:</strong> {capitalizeFirstLetter(correctAnswer)}</p>

                                </div>
                            )}

                            {endAttempt && (
                                <div className='questions bgWhite multiplechoiceAnswer'>
                                    <p>Respuestas Correctas: {correctAnswersCount}</p>
                                </div>
                            )}

                            <div className='buttonContainer'>
                                <div className="buttonDivider">
                                    <button onClick={toggleJustification} disabled={!selectionMade} className='btnBack'>{showJustification ? 'Ocultar Respuesta' : 'Ver Respuesta'} </button>
                                    <button onClick={handleSelectClick} disabled={selectionMade} className='btnBack'>Seleccionar</button>
                                </div>
                                <div className="buttonDivider">
                                    <button onClick={handlePreviousQuestion} disabled={!endAttempt} className='btnBack'>Anterior</button>
                                    <button onClick={handleNextQuestion} disabled={!selectionMade || (currentQuestionIndex === (currentTotalQuestions - 1))} className='btnBack'>Siguiente</button>
                                </div>
                                <div className="buttonEnd">
                                    <button 
                                    onClick={showCalification} 
                                    // disabled={!(currentQuestionIndex === (currentTotalQuestions - 1))}
                                    disabled={currentQuestionIndex !== currentTotalQuestions - 1} 
                                    className='btnMedium'>Terminar Intento</button>

                                </div>


                                <Modal
                                    isOpen={isModalOpen}
                                    onRequestClose={handleCloseModal}
                                    contentLabel="Respuestas Correctas"
                                    ariaHideApp={false}
                                    className="contentModal"
                                >
                                    <div className='modal'>
                                        <h3></h3>
                                        <p>Has acertado correctamente: {correctAnswersCount}/{currentTotalQuestions}</p>
                                        <button onClick={handleCloseModal} className='btnCerrar'>Cerrar</button>
                                    </div>
                                </Modal>



                            </div>

                            

                        </div>
                    ) : (
                        <div>
                            <ul>
                                <li>Algo salio mal</li>
                            </ul>
                            <button onClick={handleGoBack} className='bottomWhite'>Volver</button>
                        </div>
                    )}
                </div>
                
            </div>
            <div className="buttonBack">
                                <button onClick={handleGoBack} className='buttonWhite btnMg'>Volver a Multiplechoices</button>
                            </div>
        </>
    );
}