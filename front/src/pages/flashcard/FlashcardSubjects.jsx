import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getActivitiesByType } from '../../services/userActivitiesService';
import '../../css/styles.css';
import Sidebar from '../../components/layout/Sidebar';
import HeaderAt from '../../components/layout/HeaderAt';

export default function FlashcardSubjects({ flashcards }) {
    const navigate = useNavigate();
    const [data] = useState(flashcards);
    const [myActivities, setMyActivities] = useState([]);
    const [showMyActivities, setShowMyActivities] = useState(false);

    useEffect(() => {
        loadMyActivities();
    }, []);

    const loadMyActivities = async () => {
        try {
            const activities = await getActivitiesByType('flashcard');
            setMyActivities(activities);
        } catch (err) {
            console.error('Error loading my activities:', err);
        }
    };

    const handleGoBack = () => navigate(-1);

    const handleItemClick = (subject) => {
        navigate(`/flashcardTabs/${subject}`);
    };

    const handleMyActivityClick = (activity) => {
        navigate(`/flashcardTabs/${activity.subject}`, {
            state: { friendActivity: activity }
        });
    };

    const handleMyActivitiesToggle = () => {
        if (myActivities.length === 0) {
            alert('Aún no has creado ningún flashcard');
            return;
        }
        setShowMyActivities(prev => !prev);
    };

    const uniqueSubjects = Array.from(new Set(data.map(fc => fc.subject)));

    return (
        <>
            <HeaderAt />
            <div className='divContainer'>
                <Sidebar />
                <div className='container'>
                    <div className="solidBgHeading mg">
                        <h2>Flashcards</h2>
                    </div>
                    <ul className='subjects classifications'>
                        {uniqueSubjects.map((subject, index) => (
                            <li className='bgBlue' key={index} onClick={() => handleItemClick(subject)}>
                                <Link to={`/flashcardTabs/${subject}`}>{subject}</Link>
                            </li>
                        ))}

                        {/* Separador */}
                        <li className='category-divider'>
                            <span>Mis Actividades</span>
                        </li>

                        {/* Botón Mis Flashcards */}
                        <li
                            className='my-activities-category'
                            onClick={handleMyActivitiesToggle}
                            style={{ cursor: 'pointer' }}
                        >
                            <a>
                                Mis Flashcards ({myActivities.length})
                                {myActivities.length > 0 && (
                                    <span className="material-icons" style={{ fontSize: '1rem', marginLeft: '0.5rem', verticalAlign: 'middle' }}>
                                        {showMyActivities ? 'expand_less' : 'expand_more'}
                                    </span>
                                )}
                            </a>
                        </li>

                        {/* Lista expandible de mis flashcards */}
                        {showMyActivities && myActivities.map((activity, index) => (
                            <li
                                key={index}
                                className='my-activity-item'
                                onClick={() => handleMyActivityClick(activity)}
                            >
                                <a>
                                    <span className="material-icons my-activity-icon">style</span>
                                    <span>{activity.subject} — {activity.topic}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleGoBack} className='btnBackWhite'>Volver</button>
                </div>
            </div>
        </>
    );
}