import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/styles.css';
import Sidebar from './Sidebar';
import HeaderAt from './HeaderAt';

export default function AtlasSubjects({ atlas }) {
    const navigate = useNavigate();
    const [data, setData] = useState(atlas);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleItemClick = (subject) => {
        setSelectedSubject(subject);
        navigate(`/atlasPages/${subject}`);
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
                                <Link to={`/atlasPages/${subject}`} subject={subject} >{subject}</Link>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleGoBack} className='btnBackWhite'>Volver</button>
                </div>
            </div>


        </>
    );

}

