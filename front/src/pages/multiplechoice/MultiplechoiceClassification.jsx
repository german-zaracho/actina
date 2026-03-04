import React, { useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import HeaderAt from '../../components/layout/HeaderAt';

export default function MultiplechoiceClassification({ multiplechoices }) {
    const { subject } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const myActivities = location.state?.myActivities || [];
    
    const [data, setData] = useState(multiplechoices);
    const [selectedClassification, setSelectedClassification] = useState(null);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleItemClick = (classification) => {
        setSelectedClassification(classification);
    };

    // Si es "Mis Multiplechoice", usar myActivities
    const isMyActivities = subject === "Mis Multiplechoice";
    const dataToFilter = isMyActivities ? myActivities : data;

    const filteredClassifications = dataToFilter
        .filter((multiplechoice) => isMyActivities || multiplechoice.subject === subject)
        .map((multiplechoice, index) => (
            <li className='bgBlue' key={index} onClick={() => handleItemClick(multiplechoice.classification)}>
                <Link 
                    to={`/multiplechoiceQuestions/${multiplechoice.classification}`}
                    state={{ 
                        isMyActivity: isMyActivities,
                        myActivities: isMyActivities ? myActivities : undefined 
                    }}
                >
                    {multiplechoice.classification}
                </Link>
            </li>
        ));

    return (
        <>
            <HeaderAt />
            <div className="divContainer">
                <Sidebar />
                <div className="container">
                    <div className="solidBgHeading mg">
                        <h2>Multiplechoice - {subject}</h2>
                    </div>
                    <ul className='classifications'>
                        {filteredClassifications}
                    </ul>
                    <button onClick={handleGoBack} className='btnBackWhite'>Volver</button>
                </div>
            </div>
        </>
    );
}
