import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderAt from './HeaderAt';
import Sidebar from './Sidebar';

const FlashcardTabs = ({ flashcards }) => {
    const { subject } = useParams();
    const [filteredFlashcards, setFilteredFlashcards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAllFeatures, setShowAllFeatures] = useState(true);
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const filtered = flashcards.filter(flashcard => flashcard.subject === subject);
        setFilteredFlashcards(filtered);
    }, [subject, flashcards]);

    const handlePreviousCard = () => {
        setCurrentCardIndex(currentCardIndex - 1);
        setShowAllFeatures(true);
        setActiveTabIndex(0);
    };

    const handleNextCard = () => {
        setCurrentCardIndex(currentCardIndex + 1);
        setShowAllFeatures(true);
        setActiveTabIndex(0);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoToAtlas = () => {
        const currentTab = filteredFlashcards[currentCardIndex]?.tabs[activeTabIndex];
        const atlasId = currentTab?.atlasId;
        const atlasPage = currentTab?.atlasPage;
        
        if (atlasId && atlasPage) {
            navigate(`/atlasPages/${atlasId}?page=${atlasPage}`);
        } else {
            alert('Esta tab no tiene atlas asociado');
        }
    };

    const toggleShowAllFeatures = () => {
        setShowAllFeatures(prevShowAllFeatures => !prevShowAllFeatures);
    };

    const handleTabChange = (tabIndex) => {
        setActiveTabIndex(tabIndex);
        setShowAllFeatures(true); // Mostrar todo al cambiar de tab
    };

    const currentFlashcard = filteredFlashcards[currentCardIndex];
    const currentTab = currentFlashcard?.tabs[activeTabIndex];



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
                        {filteredFlashcards.length > 0 && currentCardIndex < filteredFlashcards.length && (
                            <div key={currentCardIndex}>
                                <strong>{currentFlashcard.topic}</strong>
                                
                                {/* Tabs navigation */}
                                {currentFlashcard.tabs && currentFlashcard.tabs.length > 1 && (
                                    <div className="tabs-navigation">
                                        {currentFlashcard.tabs.map((tab, tabIndex) => (
                                            <button
                                                key={tabIndex}
                                                className={`tab-button ${activeTabIndex === tabIndex ? 'active' : ''}`}
                                                onClick={() => handleTabChange(tabIndex)}
                                            >
                                                Tab {tabIndex + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <button className='btnBack flashcardBtn' onClick={toggleShowAllFeatures}>
                                    {showAllFeatures ? 'Ocultar Todos' : 'Mostrar Todos'}
                                </button>

                                {/* Mostrar el botón de atlas solo si la tab actual tiene atlasId */}
                                {currentTab?.atlasId && currentTab?.atlasPage && (
                                    <button className='btnBack flashcardBtn' onClick={handleGoToAtlas}>
                                        Ver en Atlas (Pág. {currentTab.atlasPage})
                                    </button>
                                )}

                                <ul>
                                    {/* Mostrar concepts y features de la tab activa */}
                                    {currentTab?.concepts.map((concept, conceptIndex) => (
                                        <li key={conceptIndex}>
                                            <ul>
                                                <li className="flashcardConcept">
                                                    <strong>{concept}</strong>
                                                </li>
                                                {showAllFeatures && (
                                                    <ul>
                                                        {currentTab.features[conceptIndex]?.map((feature, featureIndex) => (
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
                            <button onClick={handleNextCard} disabled={currentCardIndex === filteredFlashcards.length - 1}>
                                Siguiente Flashcard
                            </button>
                        )}
                    </div>
                    <button onClick={handleGoBack} className='btnBackWhite topMar'>Volver</button>
                </div>
            </div>
        </>
    );
};

export default FlashcardTabs;

