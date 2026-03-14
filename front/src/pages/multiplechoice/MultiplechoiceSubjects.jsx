import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getActivitiesByType } from '../../services/userActivitiesService';
import '../../css/styles.css';
import Sidebar from '../../components/layout/Sidebar';
import HeaderAt from '../../components/layout/HeaderAt';

export default function MultiplechoiceSubject({ multiplechoices }) {
    const navigate = useNavigate();
    const [data, setData] = useState(multiplechoices);
    const [myActivities, setMyActivities] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);

    useEffect(() => {
        loadMyActivities();
    }, []);

    const loadMyActivities = async () => {
        try {
            const activities = await getActivitiesByType('multiplechoice');
            setMyActivities(activities);
        } catch (err) {
            console.error('Error loading my activities:', err);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleItemClick = (subject) => {
        setSelectedSubject(subject);
    };

    const handleMyActivitiesClick = () => {
        if (myActivities.length === 0) {
            alert('Aún no has creado ningún multiplechoice');
        }
    };

    const uniqueSubjects = Array.from(new Set(data.map(multiplechoice => multiplechoice.subject)));

    return (
        <>
            <HeaderAt />
            <div className='divContainer'>
                <Sidebar />
                <div className='container'>
                    <div className="solidBgHeading mg">
                        <h2>Multiplechoice</h2>
                    </div>
                    <ul className='subjects classifications'>
                        {uniqueSubjects.map((subject, index) => (
                            <li className='bgBlue' key={index} onClick={() => handleItemClick(subject)}>
                                <Link to={`/multiplechoiceClassification/${subject}`} subject={subject}>
                                    {subject}
                                </Link>
                            </li>
                        ))}
                        
                        {myActivities.length > 0 && (
                            <li className='category-divider'>
                                <span>Mis Actividades</span>
                            </li>
                        )}

                        {myActivities.length > 0 ? (
                            <li className='bgBlue my-activities-category'>
                                <Link 
                                    to={`/multiplechoiceClassification/Mis Multiplechoice`}
                                    state={{ myActivities: myActivities }}
                                >
                                    Mis Multiplechoice ({myActivities.length})
                                </Link>
                            </li>
                        ) : (
                            <li className='bgBlue my-activities-category' onClick={handleMyActivitiesClick}>
                                <a>Mis Multiplechoice (0)</a>
                            </li>
                        )}
                    </ul>
                    <button onClick={handleGoBack} className='btnBackWhite'>Volver</button>
                </div>
            </div>
        </>
    );
}
