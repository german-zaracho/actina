import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import HeaderAt from '../../components/layout/HeaderAt';
import Sidebar from '../../components/layout/Sidebar';
import '../../css/atlas-view.css';
import '../../css/flashcard-view.css';
import { call } from '../../services/httpService';

const AtlasPages = ({ atlas }) => {
    const navigate = useNavigate();
    const { subject } = useParams();
    const location = useLocation();

    const friendActivity = location.state?.friendActivity;
    const myActivities = location.state?.myActivities || [];
    const initialPage = location.state?.initialPage || 0;


    const isMyActivities = subject === "Mis Atlas";

    const [filteredAtlas, setFilteredAtlas] = useState([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(initialPage);
    const [blurredItems, setBlurredItems] = useState([]);
    const [allBlurred, setAllBlurred] = useState(false);
    const [showPageSelector, setShowPageSelector] = useState(false);

    useEffect(() => {
        if (friendActivity) {
            setFilteredAtlas([friendActivity]);
        } else if (isMyActivities) {
            setFilteredAtlas(myActivities);
        } else {
            setFilteredAtlas(atlas.filter(a => a.subject === subject));
        }
    }, [subject, isMyActivities, friendActivity]);

    useEffect(() => {
        if (filteredAtlas.length > 0) {
            const items = filteredAtlas[0].pages[currentPageIndex]?.items || [];
            setBlurredItems(Array(items.length).fill(false));
            setAllBlurred(false);
        }
    }, [filteredAtlas, currentPageIndex]);

    const handlePreviousPage = () => setCurrentPageIndex(currentPageIndex - 1);
    const handleNextPage = () => setCurrentPageIndex(currentPageIndex + 1);
    const handleGoBack = () => navigate(-1);

    const handleGoToFlashcard = async () => {
        const flashcardId = filteredAtlas[0].pages[currentPageIndex]?.flashcardId;
        if (!flashcardId) return;
        try {
            const flashcardData = await call({ url: `flashcards/${flashcardId}`, method: 'GET' });
            navigate(`/flashcardTabs/${flashcardData.subject}`, {
                state: { friendActivity: flashcardData }
            });
        } catch (err) {
            console.error(err);
            alert('No se pudo cargar la flashcard');
        }
    };

    const handleToggleBlur = (index) => {
        setBlurredItems(prev => {
            const next = [...prev];
            next[index] = !next[index];
            return next;
        });
    };

    const handleToggleAllBlur = () => {
        setAllBlurred(prev => {
            const next = !prev;
            setBlurredItems(Array(blurredItems.length).fill(next));
            return next;
        });
    };

    const currentPage = filteredAtlas[0]?.pages[currentPageIndex];
    const totalPages = filteredAtlas[0]?.pages.length || 0;

    return (
        <>
            <HeaderAt />
            <div className='divContainer'>
                <Sidebar />
                <div className="container">
                    <div className="solidBgHeading">
                        <h2>Atlas</h2>
                    </div>

                    {filteredAtlas.length > 0 && currentPage && (
                        <>
                            {/* Navegación entre páginas */}
                            {totalPages > 1 && (
                                <div className="atlas-nav-bar">
                                    <button className="atlas-nav-btn" onClick={handlePreviousPage} disabled={currentPageIndex === 0}>‹</button>

                                    <div className="fc-nav-center">
                                        <button
                                            className="fc-counter-btn"
                                            onClick={() => setShowPageSelector(!showPageSelector)}
                                            title="Ir a una página específica"
                                        >
                                            {currentPageIndex + 1} / {totalPages}
                                        </button>

                                        {showPageSelector && (
                                            <div className="fc-selector">
                                                {filteredAtlas[0].pages.map((page, index) => (
                                                    <button
                                                        key={index}
                                                        className={`fc-selector-item ${index === currentPageIndex ? 'active' : ''}`}
                                                        onClick={() => {
                                                            setCurrentPageIndex(index);
                                                            setShowPageSelector(false);
                                                        }}
                                                    >
                                                        <span className="fc-selector-num">{index + 1}</span>
                                                        <span className="fc-selector-topic">{page.topic}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <button className="atlas-nav-btn" onClick={handleNextPage} disabled={currentPageIndex === totalPages - 1}>›</button>
                                </div>
                            )}

                            <div className="atlas-card">
                                {/* Header */}
                                <div className="atlas-card-header">
                                    <h3 className="atlas-subject">{subject}</h3>
                                    <strong className="atlas-topic">{currentPage.topic}</strong>
                                </div>

                                {/* Imagen */}
                                <div className="atlas-image-wrapper">
                                    <img
                                        src={`../../src/assets/images/atlas/${currentPage.image}`}
                                        alt={currentPage.topic}
                                        className="atlas-image"
                                    />
                                </div>

                                {/* Acciones */}
                                <div className="atlas-actions">
                                    <button className="atlas-action-btn" onClick={handleToggleAllBlur}>
                                        <span className="material-icons">
                                            {allBlurred ? 'visibility' : 'visibility_off'}
                                        </span>
                                        {allBlurred ? 'Mostrar todos' : 'Ocultar todos'}
                                    </button>

                                    {currentPage.flashcardId && (
                                        <button className="atlas-action-btn atlas-fc-btn" onClick={handleGoToFlashcard}>
                                            <span className="material-icons">style</span>
                                            Ver Flashcard
                                        </button>
                                    )}
                                </div>

                                {/* Items */}
                                <div className="atlas-items-list">
                                    {currentPage.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="atlas-item-row">
                                            <span className="atlas-item-num">{itemIndex + 1}</span>
                                            <span className={`atlas-item-text ${blurredItems[itemIndex] ? 'blurred' : ''}`}>
                                                {item}
                                            </span>
                                            <button
                                                className="atlas-blur-btn"
                                                onClick={() => handleToggleBlur(itemIndex)}
                                            >
                                                <span className="material-icons">
                                                    {blurredItems[itemIndex] ? 'visibility' : 'visibility_off'}
                                                </span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <button onClick={handleGoBack} className='btnBackWhite topMar'>Volver</button>
                </div>
            </div>
        </>
    );
};

export default AtlasPages;