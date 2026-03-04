import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import HeaderAt from '../../components/layout/HeaderAt';
import Sidebar from '../../components/layout/Sidebar';
import '../../css/flashcard-view.css';
import { call } from '../../services/httpService';

const FlashcardTabs = ({ flashcards }) => {
    const { subject } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const friendActivity = location.state?.friendActivity;
    const myActivities = location.state?.myActivities || [];

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
    const [showCardSelector, setShowCardSelector] = useState(false);

    useEffect(() => {
        if (friendActivity) {
            setFilteredFlashcards([friendActivity]);
        } else {
            const filtered = dataSource.filter(flashcard =>
                isMyActivities || flashcard.subject === subject
            );
            setFilteredFlashcards(filtered);
        }
    }, [subject, isMyActivities, friendActivity]);

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

    const handleGoToCard = (index) => {
        setCurrentCardIndex(index);
        setShowAllFeatures(true);
        setActiveTabIndex(0);
        setShowCardSelector(false);
    };

    const handleGoBack = () => { navigate(-1); };

    // const handleGoToAtlas = () => {
    //     const currentTab = filteredFlashcards[currentCardIndex]?.tabs[activeTabIndex];
    //     if (currentTab?.atlasId && currentTab?.atlasPage) {
    //         navigate(`/atlasPages/${currentTab.atlasId}?page=${currentTab.atlasPage}`);
    //     } else {
    //         alert('Esta tab no tiene atlas asociado');
    //     }
    // };

    const handleGoToAtlas = async () => {
    const currentTab = filteredFlashcards[currentCardIndex]?.tabs[activeTabIndex];
    if (!currentTab?.atlasId || !currentTab?.atlasPage) {
        alert('Esta tab no tiene atlas asociado');
        return;
    }
    try {
        const atlasData = await call({ url: `atlas/${currentTab.atlasId}`, method: 'GET' });
        const pageIndex = parseInt(currentTab.atlasPage) - 1;
        navigate(`/atlasPages/${atlasData.subject}`, {
            state: {
                friendActivity: atlasData,
                initialPage: pageIndex >= 0 ? pageIndex : 0
            }
        });
    } catch (err) {
        console.error(err);
        alert('No se pudo cargar el atlas');
    }
};

    const toggleShowAllFeatures = () => setShowAllFeatures(prev => !prev);
    const handleTabChange = (tabIndex) => { setActiveTabIndex(tabIndex); setShowAllFeatures(true); };

    const currentFlashcard = filteredFlashcards[currentCardIndex];
    const currentTab = currentFlashcard?.tabs[activeTabIndex];
    const total = filteredFlashcards.length;

    return (
        <>
            <HeaderAt />
            <div className='divContainer'>
                <Sidebar />
                <div className="container">
                    <div className="solidBgHeading">
                        <h2>Flashcards</h2>
                    </div>

                    {total > 1 && (
                        <div className="fc-nav-bar">
                            <button className="fc-nav-btn" onClick={handlePreviousCard} disabled={currentCardIndex === 0}>‹</button>
                            <div className="fc-nav-center">
                                <button className="fc-counter-btn" onClick={() => setShowCardSelector(!showCardSelector)} title="Ir a una flashcard específica">
                                    {currentCardIndex + 1} / {total}
                                </button>
                                {showCardSelector && (
                                    <div className="fc-selector">
                                        {filteredFlashcards.map((fc, index) => (
                                            <button
                                                key={index}
                                                className={`fc-selector-item ${index === currentCardIndex ? 'active' : ''}`}
                                                onClick={() => handleGoToCard(index)}
                                            >
                                                <span className="fc-selector-num">{index + 1}</span>
                                                <span className="fc-selector-topic">{fc.topic}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button className="fc-nav-btn" onClick={handleNextCard} disabled={currentCardIndex === total - 1}>›</button>
                        </div>
                    )}

                    <div className="fc-card">
                        <div className="fc-card-header">
                            <h3 className="fc-subject">{subject}</h3>
                            {currentFlashcard && <strong className="fc-topic">{currentFlashcard.topic}</strong>}
                        </div>

                        {filteredFlashcards.length > 0 && currentCardIndex < total && (
                            <div>
                                {currentFlashcard.tabs && currentFlashcard.tabs.length > 1 && (
                                    <div className="fc-tabs-nav">
                                        {currentFlashcard.tabs.map((tab, tabIndex) => (
                                            <button
                                                key={tabIndex}
                                                className={`fc-tab-btn ${activeTabIndex === tabIndex ? 'active' : ''}`}
                                                onClick={() => handleTabChange(tabIndex)}
                                            >
                                                {tab.concepts?.[0] || `Tab ${tabIndex + 1}`}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="fc-actions">
                                    <button className="fc-action-btn" onClick={toggleShowAllFeatures}>
                                        <span className="material-icons">{showAllFeatures ? 'visibility_off' : 'visibility'}</span>
                                        {showAllFeatures ? 'Ocultar todo' : 'Mostrar todo'}
                                    </button>
                                    {currentTab?.atlasId && currentTab?.atlasPage && (
                                        <button className="fc-action-btn fc-atlas-btn" onClick={handleGoToAtlas}>
                                            <span className="material-icons">art_track</span>
                                            Ver en Atlas (Pág. {currentTab.atlasPage})
                                        </button>
                                    )}
                                </div>

                                <ul className="fc-concepts-list">
                                    {currentTab?.concepts.map((concept, conceptIndex) => (
                                        <li key={conceptIndex} className="fc-concept-item">
                                            <div className="fc-concept-name">
                                                <span className="material-icons fc-concept-icon">label</span>
                                                <strong>{concept}</strong>
                                            </div>
                                            {showAllFeatures && (
                                                <ul className="fc-features-list">
                                                    {currentTab.features[conceptIndex]?.map((feature, featureIndex) => (
                                                        <li key={featureIndex} className="fc-feature-item">
                                                            <span className="material-icons fc-feature-icon">chevron_right</span>
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <button onClick={handleGoBack} className='btnBackWhite topMar'>Volver</button>
                </div>
            </div>
        </>
    );
};

export default FlashcardTabs;