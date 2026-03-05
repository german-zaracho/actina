import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getActivitiesByType } from '../../services/userActivitiesService';
import '../../css/styles.css';
import Sidebar from '../../components/layout/Sidebar';
import HeaderAt from '../../components/layout/HeaderAt';

export default function AtlasSubjects({ atlas }) {
    const navigate = useNavigate();
    const [data] = useState(atlas);
    const [myActivities, setMyActivities] = useState([]);
    const [showMyActivities, setShowMyActivities] = useState(false);

    useEffect(() => {
        loadMyActivities();
    }, []);

    const loadMyActivities = async () => {
        try {
            const activities = await getActivitiesByType('atlas');
            setMyActivities(activities);
        } catch (err) {
            console.error('Error loading my activities:', err);
        }
    };

    const handleGoBack = () => navigate(-1);

    const handleItemClick = (subject) => {
        navigate(`/atlasPages/${subject}`);
    };

    const handleMyActivityClick = (activity) => {
        navigate(`/atlasPages/${activity.subject}`, {
            state: { friendActivity: activity }
        });
    };

    const handleMyActivitiesToggle = () => {
        if (myActivities.length === 0) {
            alert('Aún no has creado ningún atlas');
            return;
        }
        setShowMyActivities(prev => !prev);
    };

    const uniqueSubjects = Array.from(new Set(data.map(a => a.subject)));

    return (
        <>
            <HeaderAt />
            <div className='divContainer'>
                <Sidebar />
                <div className='container'>
                    <div className="solidBgHeading mg">
                        <h2>Atlas</h2>
                    </div>
                    <ul className='subjects classifications'>
                        {uniqueSubjects.map((subject, index) => (
                            <li className='bgBlue' key={index} onClick={() => handleItemClick(subject)}>
                                <Link to={`/atlasPages/${subject}`}>{subject}</Link>
                            </li>
                        ))}

                        {/* Separador */}
                        <li className='category-divider'>
                            <span>Mis Actividades</span>
                        </li>

                        {/* Botón Mis Atlas */}
                        <li
                            className='my-activities-category'
                            onClick={handleMyActivitiesToggle}
                            style={{ cursor: 'pointer' }}
                        >
                            <a>
                                Mis Atlas ({myActivities.length})
                                {myActivities.length > 0 && (
                                    <span className="material-icons" style={{ fontSize: '1rem', marginLeft: '0.5rem', verticalAlign: 'middle' }}>
                                        {showMyActivities ? 'expand_less' : 'expand_more'}
                                    </span>
                                )}
                            </a>
                        </li>

                        {showMyActivities && myActivities.map((activity, index) => (
                            <li
                                key={index}
                                className='my-activity-item'
                                onClick={() => handleMyActivityClick(activity)}
                            >
                                <a>
                                    <span className="material-icons my-activity-icon">art_track</span>
                                    <span>{activity.type} — {activity.subject}</span>
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