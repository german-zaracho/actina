import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import HeaderAt from '../../components/layout/HeaderAt';
import Sidebar from '../../components/layout/Sidebar';

const FlashcardTabs = ({ flashcards }) => {
    const { subject } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const friendActivity = location.state?.friendActivity;
    const myActivities = location.state?.myActivities || [];
    
    // Determinar la fuente de datos
    const isMyActivities = subject === "Mis Flashcards";
    let dataSource;
    if (friendActivity) {
        dataSource = [friendActivity];
    } else if (isMyActivities) {
        dataSource = myActivities;
    } else {
        dataSource = flashcards;
    }
    
    const [filteredFlashcards, setFilteredFlashcards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAllFeatures, setShowAllFeatures] = useState(true);
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    useEffect(() => {
        if (friendActivity) {
            // Si es actividad de amigo, usar directamente
            setFilteredFlashcards([friendActivity]);
        } else {
            const filtered = dataSource.filter(flashcard => 
                isMyActivities || flashcard.subject === subject
            );
            setFilteredFlashcards(filtered);
        }
    }, [subject, dataSource, isMyActivities, friendActivity]);

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
        setShowAllFeatures(true);
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

                                {currentTab?.atlasId && currentTab?.atlasPage && (
                                    <button className='btnBack flashcardBtn' onClick={handleGoToAtlas}>
                                        Ver en Atlas (PÃ¡g. {currentTab.atlasPage})
                                    </button>
                                )}

                                <ul>
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