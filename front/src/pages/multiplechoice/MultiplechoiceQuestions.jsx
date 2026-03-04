import React, { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import HeaderAt from '../../components/layout/HeaderAt';
import '../../css/multiplechoice-view.css';

export default function MultiplechoiceQuestions({ multiplechoices }) {
    const { classification } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const friendActivity = location.state?.friendActivity;
    const isMyActivity = location.state?.isMyActivity || false;
    const myActivities = location.state?.myActivities || [];

    const handleGoBack = () => { navigate(-1); };

    let dataSource;
    if (friendActivity) {
        dataSource = [friendActivity];
    } else if (isMyActivity) {
        dataSource = myActivities;
    } else {
        dataSource = multiplechoices;
    }

    const [data] = useState(dataSource);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showJustification, setShowJustification] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [selectionMade, setSelectionMade] = useState(false);
    const [endAttempt, setEndAttempt] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentQuestion = data
        .filter(mc => mc.classification === classification)
        .flatMap(mc => mc.questions)[currentQuestionIndex];

    const currentMultiplechoice = data.filter(mc => mc.classification === classification)[0];
    const currentTotalQuestions = currentMultiplechoice ? currentMultiplechoice.questions.length : 0;
    const isLastQuestion = currentQuestionIndex === currentTotalQuestions - 1;
    const correctAnswer = currentQuestion ? currentQuestion.options[currentQuestion.answer - 1] : null;

    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

    const handleOptionSelect = (option) => {
        if (!selectionMade) setSelectedOption(option);
    };

    const handleSelectClick = () => { setSelectionMade(true); };
    const toggleJustification = () => { setShowJustification(prev => !prev); };

    const handleNextQuestion = () => {
        if (!endAttempt) {
            if (selectionMade) {
                if (selectedOption === correctAnswer) setCorrectAnswersCount(c => c + 1);
                setCurrentQuestionIndex(i => i + 1);
                setSelectedOption(null);
                setShowJustification(false);
                setSelectionMade(false);
            }
        } else {
            setCurrentQuestionIndex(i => i + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(i => i - 1);
            setSelectedOption(null);
            setShowJustification(false);
        }
    };

    const showCalification = () => {
        if (selectedOption === correctAnswer) setCorrectAnswersCount(c => c + 1);
        setEndAttempt(true);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => { setIsModalOpen(false); };

    const getOptionClass = (option) => {
        if (!selectionMade) return selectedOption === option ? 'mc-option selected' : 'mc-option';
        if (option === correctAnswer) return 'mc-option correct';
        if (option === selectedOption && option !== correctAnswer) return 'mc-option incorrect';
        return 'mc-option';
    };

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
                        <div className="mc-container">
                            {/* Progreso */}
                            <div className="mc-progress-bar">
                                <div
                                    className="mc-progress-fill"
                                    style={{ width: `${((currentQuestionIndex + 1) / currentTotalQuestions) * 100}%` }}
                                />
                            </div>
                            <div className="mc-progress-label">
                                Pregunta {currentQuestionIndex + 1} de {currentTotalQuestions}
                            </div>

                            {/* Pregunta */}
                            <div className="mc-question-card">
                                <p className="mc-question-text">
                                    {capitalizeFirstLetter(currentQuestion.question)}
                                </p>

                                <ul className="mc-options-list">
                                    {currentQuestion.options.map((option, optionIndex) => (
                                        <li key={optionIndex}>
                                            <button
                                                className={getOptionClass(option)}
                                                onClick={() => handleOptionSelect(option)}
                                                disabled={selectionMade}
                                            >
                                                <span className="mc-option-letter">
                                                    {String.fromCharCode(65 + optionIndex)}
                                                </span>
                                                <span className="mc-option-text">{capitalizeFirstLetter(option)}</span>
                                                {selectionMade && option === correctAnswer && (
                                                    <span className="material-icons mc-option-icon">check_circle</span>
                                                )}
                                                {selectionMade && option === selectedOption && option !== correctAnswer && (
                                                    <span className="material-icons mc-option-icon">cancel</span>
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                {/* Justificación */}
                                {showJustification && (
                                    <div className="mc-justification">
                                        <div className="mc-justification-answer">
                                            <span className="material-icons">check_circle</span>
                                            <strong>Respuesta correcta:</strong> {capitalizeFirstLetter(correctAnswer)}
                                        </div>
                                        <p>{currentQuestion.justification}</p>
                                    </div>
                                )}

                                {/* Resultado acumulado si terminó */}
                                {endAttempt && (
                                    <div className="mc-score-inline">
                                        Respuestas correctas: <strong>{correctAnswersCount} / {currentTotalQuestions}</strong>
                                    </div>
                                )}
                            </div>

                            {/* Acciones */}
                            <div className="mc-actions">
                                <div className="mc-actions-row">
                                    <button
                                        className="mc-btn mc-btn-secondary"
                                        onClick={handlePreviousQuestion}
                                        disabled={!endAttempt || currentQuestionIndex === 0}
                                    >
                                        <span className="material-icons">arrow_back</span>
                                        Anterior
                                    </button>

                                    <button
                                        className="mc-btn mc-btn-secondary"
                                        onClick={toggleJustification}
                                        disabled={!selectionMade}
                                    >
                                        <span className="material-icons">{showJustification ? 'visibility_off' : 'visibility'}</span>
                                        {showJustification ? 'Ocultar respuesta' : 'Ver respuesta'}
                                    </button>

                                    {!selectionMade ? (
                                        <button
                                            className="mc-btn mc-btn-primary"
                                            onClick={handleSelectClick}
                                            disabled={!selectedOption}
                                        >
                                            Confirmar
                                        </button>
                                    ) : isLastQuestion ? (
                                        <button
                                            className="mc-btn mc-btn-finish"
                                            onClick={showCalification}
                                            disabled={endAttempt}
                                        >
                                            <span className="material-icons">flag</span>
                                            Terminar intento
                                        </button>
                                    ) : (
                                        <button
                                            className="mc-btn mc-btn-primary"
                                            onClick={handleNextQuestion}
                                        >
                                            Siguiente
                                            <span className="material-icons">arrow_forward</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Modal resultado */}
                            <Modal
                                isOpen={isModalOpen}
                                onRequestClose={handleCloseModal}
                                contentLabel="Resultado"
                                ariaHideApp={false}
                                className="contentModal"
                            >
                                <div className="modal">
                                    <div className="mc-modal-result">
                                        <span className="material-icons mc-modal-icon">emoji_events</span>
                                        <h3>¡Intento completado!</h3>
                                        <p className="mc-modal-score">
                                            {correctAnswersCount} <span>/ {currentTotalQuestions}</span>
                                        </p>
                                        <p className="mc-modal-label">respuestas correctas</p>
                                    </div>
                                    <button onClick={handleCloseModal} className="mc-btn mc-btn-primary">
                                        Ver resultados
                                    </button>
                                </div>
                            </Modal>
                        </div>
                    ) : (
                        <div>
                            <p>Algo salió mal.</p>
                            <button onClick={handleGoBack} className='btnBackWhite'>Volver</button>
                        </div>
                    )}

                    <button onClick={handleGoBack} className='btnBackWhite topMar'>
                        Volver a {isMyActivity ? 'Mis Multiplechoices' : 'Multiplechoices'}
                    </button>
                </div>
            </div>
        </>
    );
}