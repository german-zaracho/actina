// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import jsondata from './data/multiplechoice.json';

// export default function MultiplechoiceClassification(subject) {

//     const navigate = useNavigate();

//     const handleGoBack = () => {
//         navigate(-1);
//     };

//     const [data, setData] = useState(jsondata);
//     const [selectedClassification, setSelectedClassification] = useState(null);

//     const handleItemClick = (classification) => {
//         setSelectedClassification(classification);
//     };

//     return (
//         <>
//                     <p className=''>Multiplechoice</p>
//                     <ul className='classifications'>
//                         {data.map((multiplechoice, index) => (
//                             <li className='bgBlue' key={index} onClick={() => handleItemClick(multiplechoice.classification)}>
//                                 <Link to={`/multiplechoiceQuestions/${multiplechoice.classification}`}>{multiplechoice.classification}</Link>
//                             </li>
//                         ))}
//                     </ul>
//                     <button onClick={handleGoBack}>Volver</button>
//         </>
//     );
// }

// import React, { useState } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import jsondata from './data/multiplechoice.json';

// export default function MultiplechoiceClassification({subject}) {
//     const { subject } = useParams();
//     const navigate = useNavigate();
//     const [data, setData] = useState(jsondata);
//     const [selectedClassification, setSelectedClassification] = useState(null);

//     const handleGoBack = () => {
//         navigate(-1);
//     };

//     const handleItemClick = (classification) => {
//         setSelectedClassification(classification);
//     };

//     const filteredClassifications = data
//         .filter((multiplechoice) => multiplechoice.subject === subject)
//         .map((multiplechoice, index) => (
//             <li className='bgBlue' key={index} onClick={() => handleItemClick(multiplechoice.classification)}>
//                 <Link to={`/multiplechoiceQuestions/${multiplechoice.classification}`}>{multiplechoice.classification}</Link>
//             </li>
//         ));

//         console.log(filteredClassifications);
//     return (
//         <>

//             <p className=''>Multiplechoice</p>
//             <ul className='classifications'>
//                 {filteredClassifications}
//             </ul>
//             <button onClick={handleGoBack}>Volver</button>
//         </>
//     );
// }


import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
// import jsondata from './data/multiplechoice.json';
import Sidebar from './Sidebar';
import HeaderAt from './HeaderAt';

export default function MultiplechoiceClassification({ multiplechoices }) {
    const { subject } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(multiplechoices);
    const [selectedClassification, setSelectedClassification] = useState(null);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleItemClick = (classification) => {
        setSelectedClassification(classification);
    };

    const filteredClassifications = data
        .filter((multiplechoice) => multiplechoice.subject === subject)
        .map((multiplechoice, index) => (
            <li className='bgBlue' key={index} onClick={() => handleItemClick(multiplechoice.classification)}>
                <Link to={`/multiplechoiceQuestions/${multiplechoice.classification}`}>
                    {multiplechoice.classification}
                </Link>
            </li>
        ));

    console.log(filteredClassifications);

    return (
        <>
            <HeaderAt />
            <div className="divContainer">
                <Sidebar />
                <div className="container">
                    <div className="solidBgHeading mg">
                        <h2>Multiplechoice</h2>
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

