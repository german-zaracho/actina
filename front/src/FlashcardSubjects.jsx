// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from './Sidebar.jsx';
// import HeaderAt from './HeaderAt.jsx';

// export default function Flashcards() {
//     const navigate = useNavigate();

//     const handleGoBack = () => {
//         navigate(-1);
//     };

//     return (
//         <>
//             <HeaderAt />
//             <div className="divContainer">
//                 <Sidebar />
//                 <div className="container">
//                     <h2>Flashcards</h2>
//                     <button onClick={handleGoBack} className='btnBack'>Volver</button>
//                 </div>
//             </div>



//         </>
//     );
// }

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/styles.css';
import Sidebar from './Sidebar';
import HeaderAt from './HeaderAt';

export default function FlashcardSubjects({ flashcards }) {
    const navigate = useNavigate();
    const [data, setData] = useState(flashcards);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleItemClick = (subject) => {
        setSelectedSubject(subject);
        navigate(`/flashcardTabs/${subject}`);
    };

    const uniqueSubjects = Array.from(new Set(data.map(flashcard => flashcard.subject)));

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
                                <Link to={`/flashcardTabs/${subject}`} subject={subject} >{subject}</Link>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleGoBack} className='btnBackWhite'>Volver</button>
                </div>
            </div>


        </>
    );

}