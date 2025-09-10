import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderAt from './HeaderAt';
import Sidebar from './Sidebar';

const FlashcardTabs = ({ flashcards }) => {
    const { subject } = useParams();
    const [filteredFlashcards, setFilteredFlashcards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAllFeatures, setShowAllFeatures] = useState(true); // Nuevo estado

    const navigate = useNavigate();

    useEffect(() => {
        const filtered = flashcards.filter(flashcard => flashcard.subject === subject);
        setFilteredFlashcards(filtered);
    }, [subject, flashcards]);

    const handlePreviousCard = () => {
        setCurrentCardIndex(currentCardIndex - 1);
        setShowAllFeatures(true);
    };

    const handleNextCard = () => {
        setCurrentCardIndex(currentCardIndex + 1);
        setShowAllFeatures(true);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoToAtlas = () => {
        const atlasId = filteredFlashcards[currentCardIndex]?.atlasId;
        const atlasPage = filteredFlashcards[currentCardIndex]?.atlasPage;
        navigate(`/atlasPages/${atlasId}?page=${atlasPage}`);
    };

    const toggleShowAllFeatures = () => {
        setShowAllFeatures(prevShowAllFeatures => !prevShowAllFeatures);
    };



    return (
        <>
            <HeaderAt />
            <div className='divContainer'>
                <Sidebar />
                <div className="container">
                    <div className="solidBgHeading">
                        <h2>Flashcards</h2>
                    </div>
                    <div className="flashcard bgWhite">
                        <h3>{subject}</h3>
                        {/* Verifica que haya flashcards y que la flashcard actual exista */}
                        {filteredFlashcards.length > 0 && currentCardIndex < filteredFlashcards.length && (
                            <div key={currentCardIndex}>
                                <strong>{filteredFlashcards[currentCardIndex].topic}</strong>
                                <button className='btnBack flashcardBtn' onClick={toggleShowAllFeatures}>
                                    {showAllFeatures ? 'Ocultar Todos' : 'Mostrar Todos'}
                                </button>
                                <ul>
                                    {/* Mapea los concepts y features para la flashcard actual */}
                                    {filteredFlashcards[currentCardIndex].tabs[0]?.concepts.map((concept, conceptIndex) => (
                                        <li key={conceptIndex}>
                                            <ul>
                                                <li className="flashcardConcept">
                                                    <strong>{concept}</strong>
                                                </li>
                                                {/* Mapea sobre los features */}
                                                {(showAllFeatures || (showAllFeatures && conceptIndex === 0)) && (
                                                    <ul>
                                                        
                                                        {filteredFlashcards[currentCardIndex].tabs[0]?.features[conceptIndex]?.map((feature, featureIndex) => (
                                                            <li key={featureIndex}>{feature}</li>
                                                        ))}
                                                    </ul>
                                                    
                                                )}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>

                            </div>

                        )}
                    </div>
                    <div className="bottomActions">
                        <button onClick={handlePreviousCard} disabled={currentCardIndex === 0}>
                            Flashcard Anterior
                        </button>
                        {currentCardIndex < (filteredFlashcards.length - 1) && (
                            <button onClick={handleNextCard} disabled={currentCardIndex === filteredFlashcards.length - 1}>Siguiente Flashcard</button>
                        )}
                    </div>
                    <button onClick={handleGoBack} className='btnBackWhite topMar'>Volver</button>
                </div>
            </div>
        </>
    );
};

export default FlashcardTabs;

