// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import jsondata from './data/multiplechoice.json';

// export default function MultiplechoiceSubject() {
//     const navigate = useNavigate();
//     const [data, setData] = useState(jsondata);

//     const handleGoBack = () => {
//         navigate(-1);
//     };

//     const [selectedSubject, setSelectedSubject] = useState(null);

//     const handleItemClick = (subject) => {
//         setSelectedSubject(subject);
//     };

//     return (
//         <>
//             <p className=''>Materias</p>
//             <ul className='subjects classifications'>
//                 {data.map((multiplechoice, index) => (
//                     <li className='bgBlue' key={index} onClick={() => handleItemClick(multiplechoice.subject)}>
//                         <Link to={`/multiplechoiceClassification/`}>{multiplechoice.subject}</Link>
//                     </li>
//                 ))}
//             </ul>
//             <button onClick={handleGoBack}>Volver</button>
//         </>
//     );
// }

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import jsondata from './data/multiplechoice.json';
import './css/styles.css';
import Sidebar from './Sidebar';
import HeaderAt from './HeaderAt';

export default function MultiplechoiceSubject({ multiplechoices }) {
    const navigate = useNavigate();
    const [data, setData] = useState(multiplechoices);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleItemClick = (subject) => {
        setSelectedSubject(subject);
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
                                <Link to={`/multiplechoiceClassification/${subject}`} subject={subject} >{subject}</Link>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleGoBack} className='btnBackWhite'>Volver</button>
                </div>
            </div>
        </>
    );

}


