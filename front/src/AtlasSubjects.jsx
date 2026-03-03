// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './css/styles.css';
// import Sidebar from './Sidebar';
// import HeaderAt from './HeaderAt';

// export default function AtlasSubjects({ atlas }) {
//     const navigate = useNavigate();
//     const [data, setData] = useState(atlas);
//     const [selectedSubject, setSelectedSubject] = useState(null);

//     const handleGoBack = () => {
//         navigate(-1);
//     };

//     const handleItemClick = (subject) => {
//         setSelectedSubject(subject);
//         navigate(`/atlasPages/${subject}`);
//     };

//     const uniqueSubjects = Array.from(new Set(data.map(atlas => atlas.subject)));

//     return (
//         <>
//             <HeaderAt />
//             <div className='divContainer'>
//                 <Sidebar />
//                 <div className='container'>
//                     <div className="solidBgHeading mg">
//                         <h2>Atlas</h2>
//                     </div>
//                     <ul className='subjects classifications'>
//                         {uniqueSubjects.map((subject, index) => (
//                             <li className='bgBlue' key={index} onClick={() => handleItemClick(subject)}>
//                                 <Link to={`/atlasPages/${subject}`} subject={subject} >{subject}</Link>
//                             </li>
//                         ))}
//                     </ul>
//                     <button onClick={handleGoBack} className='btnBackWhite'>Volver</button>
//                 </div>
//             </div>
//         </>
//     );

// }

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getActivitiesByType } from './services/userActivitiesService';
import './css/styles.css';
import Sidebar from './Sidebar';
import HeaderAt from './HeaderAt';

export default function AtlasSubjects({ atlas }) {
    const navigate = useNavigate();
    const [data, setData] = useState(atlas);
    const [myActivities, setMyActivities] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);

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

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleItemClick = (subject) => {
        setSelectedSubject(subject);
        navigate(`/atlasPages/${subject}`);
    };

    const handleMyActivitiesClick = () => {
        if (myActivities.length === 0) {
            alert('Aún no has creado ningún atlas');
        }
    };

    const uniqueSubjects = Array.from(new Set(data.map(atlas => atlas.subject)));

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
                                <Link to={`/atlasPages/${subject}`} subject={subject}>
                                    {subject}
                                </Link>
                            </li>
                        ))}
                        
                        {/* Separador visual */}
                        {myActivities.length > 0 && (
                            <li className='category-divider'>
                                <span>Mis Actividades</span>
                            </li>
                        )}

                        {/* Categoría "Mis Atlas" */}
                        {myActivities.length > 0 ? (
                            <li className='bgBlue my-activities-category'>
                                <Link 
                                    to={`/atlasPages/Mis Atlas`}
                                    state={{ myActivities: myActivities }}
                                >
                                    Mis Atlas ({myActivities.length})
                                </Link>
                            </li>
                        ) : (
                            <li className='bgBlue my-activities-category' onClick={handleMyActivitiesClick}>
                                <a>Mis Atlas (0)</a>
                            </li>
                        )}
                    </ul>
                    <button onClick={handleGoBack} className='btnBackWhite'>Volver</button>
                </div>
            </div>
        </>
    );
}