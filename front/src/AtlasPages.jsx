// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import HeaderAt from './HeaderAt';
// import Sidebar from './Sidebar';

// const AtlasPages = ({ atlas }) => {
//     const navigate = useNavigate();
//     const { subject } = useParams();
//     const location = useLocation();
//     const myActivities = location.state?.myActivities || [];
    
//     const [filteredAtlas, setFilteredAtlas] = useState([]);
//     const [currentPageIndex, setCurrentPageIndex] = useState(0);
//     const [blurredItems, setBlurredItems] = useState([]);
//     const [allBlurred, setAllBlurred] = useState(false);

//     useEffect(() => {
//         // Si vienen myActivities desde "Mis Actividades", usar directamente sin filtrar
//         if (myActivities.length > 0) {
//             console.log('Usando myActivities:', myActivities);
//             setFilteredAtlas(myActivities);
//         } else {
//             // Si es la vista normal, filtrar por subject
//             const filtered = atlas.filter(a => a.subject === subject);
//             console.log('Atlas filtrados por subject:', filtered);
//             setFilteredAtlas(filtered);
//         }
//     }, [subject, atlas, myActivities]);

//     useEffect(() => {
//         if (filteredAtlas.length > 0) {
//             setBlurredItems(Array(filteredAtlas[0].pages[currentPageIndex]?.items.length).fill(false));
//         }
//     }, [filteredAtlas, currentPageIndex]);

//     const handlePreviousPage = () => {
//         setCurrentPageIndex(currentPageIndex - 1);
//     };

//     const handleNextPage = () => {
//         setCurrentPageIndex(currentPageIndex + 1);
//     };

//     const handleGoBack = () => {
//         navigate(-1);
//     };

//     const handleGoToFlashcard = () => {
//         const flashcardId = filteredAtlas[0].pages[currentPageIndex]?.flashcardId;
//         navigate(`/flashcardTabs/${flashcardId}`);
//     };

//     const handleToggleBlur = (index) => {
//         setBlurredItems((prevBlurredItems) => {
//             const newBlurredItems = [...prevBlurredItems];
//             newBlurredItems[index] = !newBlurredItems[index];
//             return newBlurredItems;
//         });
//     };

//     const handleToggleAllBlur = () => {
//         setBlurredItems((prevBlurredItems) => {
//             const newBlurredItems = prevBlurredItems.map(() => !allBlurred);
//             setAllBlurred(!allBlurred);
//             return newBlurredItems;
//         });
//     };

//     return (
//         <>
//             <HeaderAt />
//             <div className='divContainer'>
//                 <Sidebar />
//                 <div className="container">
//                     <div className="solidBgHeading">
//                         <h2>Atlas</h2>
//                     </div>
//                     <div className="flashcard bgWhite">
//                         <h3>{subject}</h3>

//                         {filteredAtlas.length > 0 && currentPageIndex < filteredAtlas[0].pages.length && (
//                             <div key={currentPageIndex}>
//                                 <h4>{filteredAtlas[0].pages[currentPageIndex]?.topic}</h4>
//                                 <ul>
//                                     <li className='atlasImageContainer'>
//                                         <img 
//                                             src={`../../src/assets/images/atlas/${filteredAtlas[0].pages[currentPageIndex]?.image}`} 
//                                             alt={filteredAtlas[0].pages[currentPageIndex]?.topic} 
//                                         />
//                                     </li>
//                                     <li>
//                                         <button onClick={handleToggleAllBlur} className="btnBack switchBlurBtn">
//                                             {allBlurred ? "Mostrar Todos" : "Ocultar Todos"}
//                                         </button>
//                                     </li>
//                                     <li>
//                                         {filteredAtlas[0].pages[currentPageIndex]?.items.map((item, itemIndex) => (
//                                             <ul className='itemContainer' key={itemIndex}>
//                                                 <li>{itemIndex + 1}.-</li>
//                                                 <li className={`atlasItem ${blurredItems[itemIndex] ? 'blurred' : ''}`} key={itemIndex}>
//                                                     {item}
//                                                 </li>
//                                                 <li className='btnBlurContainer'>
//                                                     <button className='btnBack' onClick={() => handleToggleBlur(itemIndex)}>
//                                                         {blurredItems[itemIndex] ? 'Mostrar' : 'Ocultar'}
//                                                     </button>
//                                                 </li>
//                                             </ul>
//                                         ))}
//                                     </li>
//                                 </ul>
//                             </div>
//                         )}
//                     </div>

//                     <div className="bottomActions">
//                         <button onClick={handlePreviousPage} disabled={currentPageIndex === 0}>
//                             Página Anterior
//                         </button>

//                         {filteredAtlas.length > 0 && filteredAtlas[0].pages && currentPageIndex < filteredAtlas[0].pages.length - 1 && (
//                             <button onClick={handleNextPage}>Siguiente Página</button>
//                         )}
//                     </div>
//                     <button onClick={handleGoBack} className='btnBackWhite topMar'>Volver</button>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AtlasPages;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import HeaderAt from './HeaderAt';
// import Sidebar from './Sidebar';

// const AtlasPages = ({ atlas }) => {
//     const navigate = useNavigate();
//     const { subject } = useParams();
//     const [filteredAtlas, setFilteredAtlas] = useState([]);
//     const [currentPageIndex, setCurrentPageIndex] = useState(0);
//     const [blurredItems, setBlurredItems] = useState([]);
//     const [allBlurred, setAllBlurred] = useState(false);

//     useEffect(() => {
//         const filtered = atlas.filter(atlas => atlas.subject === subject);
//         console.log(filtered);
//         console.log('hola1');
//         console.log(filtered[0].pages.length);
//         console.log('hola2');
//         setFilteredAtlas(filtered);
//     }, [subject, atlas]);

//     useEffect(() => {
//         if (filteredAtlas.length > 0) {
//             setBlurredItems(Array(filteredAtlas[0].pages[currentPageIndex]?.items.length).fill(false));
//         }
//     }, [filteredAtlas, currentPageIndex]);

//     const handlePreviousPage = () => {
//         setCurrentPageIndex(currentPageIndex - 1);
//     };

//     const handleNextPage = () => {
//         setCurrentPageIndex(currentPageIndex + 1);
//     };

//     const handleGoBack = () => {
//         navigate(-1);
//     };

//     const handleGoToFlashcard = () => {
//         const flashcardId = filteredAtlas[0].pages[currentPageIndex]?.flashcardId;
//         navigate(`/flashcardTabs/${flashcardId}`);
//     };

//     const handleToggleBlur = (index) => {
//         setBlurredItems((prevBlurredItems) => {
//             const newBlurredItems = [...prevBlurredItems];
//             newBlurredItems[index] = !newBlurredItems[index];
//             return newBlurredItems;
//         });
//     };

//     const handleToggleAllBlur = () => {
//         setBlurredItems((prevBlurredItems) => {
//             const newBlurredItems = prevBlurredItems.map(() => !allBlurred);
//             setAllBlurred(!allBlurred);
//             return newBlurredItems;
//         });
//     };


//     return (
//         <>
//             <HeaderAt />
//             <div className='divContainer'>
//                 <Sidebar />
//                 <div className="container">
//                     <div className="solidBgHeading">
//                         <h2>Atlas</h2>
//                     </div>
//                     <div className="flashcard bgWhite">
//                         <h3>{subject}</h3>

//                         {filteredAtlas.length > 0 && currentPageIndex < filteredAtlas[0].pages.length && (
//                             <div key={currentPageIndex}>
//                                 <h4>{filteredAtlas[0].pages[currentPageIndex]?.topic}</h4>
//                                 <ul>
//                                     <li className='atlasImageContainer'><img src={`../../src/assets/images/atlas/${filteredAtlas[0].pages[currentPageIndex]?.image}`} alt={filteredAtlas[0].pages[currentPageIndex]?.topic} /></li>
//                                     <li><button onClick={handleToggleAllBlur} className="btnBack switchBlurBtn">
//                                         {allBlurred ? "Mostrar Todos" : "Ocultar Todos"}
//                                     </button></li>
//                                     <li>
//                                         {filteredAtlas[0].pages[currentPageIndex]?.items.map((item, itemIndex) => (
//                                             <ul className='itemContainer' key={itemIndex}>
//                                                 <li>{itemIndex + 1}.-</li>
//                                                 <li className={`atlasItem ${blurredItems[itemIndex] ? 'blurred' : ''}`} key={itemIndex}>{item}</li>
//                                                 <li className='btnBlurContainer'><button className='btnBack' onClick={() => handleToggleBlur(itemIndex)}>{blurredItems[itemIndex] ? 'Mostrar' : 'Ocultar'}</button></li>
//                                             </ul>
//                                         ))}
//                                     </li>
//                                 </ul>
//                             </div>
//                         )}
//                     </div>

//                     <div className="bottomActions">

//                         <button onClick={handlePreviousPage} disabled={currentPageIndex === 0}>PÃ¡gina Anterior</button>

//                         {filteredAtlas.length > 0 && filteredAtlas[0].pages && currentPageIndex < filteredAtlas[0].pages.length - 1 && (
//                             <button onClick={handleNextPage} >Siguiente PÃ¡gina</button>
//                         )}



//                     </div>
//                     {/* <button onClick={handleGoToFlashcard}>Ir a Flashcard</button> */}
//                     <button onClick={handleGoBack} className='btnBackWhite  topMar'>Volver</button>

//                 </div>
//             </div>
//         </>
//     );
// };

// export default AtlasPages;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import HeaderAt from './HeaderAt';
import Sidebar from './Sidebar';

const AtlasPages = ({ atlas }) => {
    const navigate = useNavigate();
    const { subject } = useParams();
    const location = useLocation();
    
    const friendActivity = location.state?.friendActivity;
    const myActivities = location.state?.myActivities || [];
    
    // Determinar la fuente de datos
    const isMyActivities = subject === "Mis Atlas";
    let dataSource;
    if (friendActivity) {
        dataSource = [friendActivity];
    } else if (isMyActivities) {
        dataSource = myActivities;
    } else {
        dataSource = atlas;
    }
    
    const [filteredAtlas, setFilteredAtlas] = useState([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [blurredItems, setBlurredItems] = useState([]);
    const [allBlurred, setAllBlurred] = useState(false);

    useEffect(() => {
        if (friendActivity) {
            // Si es actividad de amigo, usar directamente
            setFilteredAtlas([friendActivity]);
        } else {
            const filtered = dataSource.filter(a => 
                isMyActivities || a.subject === subject
            );
            setFilteredAtlas(filtered);
        }
    }, [subject, dataSource, isMyActivities, friendActivity]);

    useEffect(() => {
        if (filteredAtlas.length > 0) {
            setBlurredItems(Array(filteredAtlas[0].pages[currentPageIndex]?.items.length).fill(false));
        }
    }, [filteredAtlas, currentPageIndex]);

    const handlePreviousPage = () => {
        setCurrentPageIndex(currentPageIndex - 1);
    };

    const handleNextPage = () => {
        setCurrentPageIndex(currentPageIndex + 1);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoToFlashcard = () => {
        const flashcardId = filteredAtlas[0].pages[currentPageIndex]?.flashcardId;
        navigate(`/flashcardTabs/${flashcardId}`);
    };

    const handleToggleBlur = (index) => {
        setBlurredItems((prevBlurredItems) => {
            const newBlurredItems = [...prevBlurredItems];
            newBlurredItems[index] = !newBlurredItems[index];
            return newBlurredItems;
        });
    };

    const handleToggleAllBlur = () => {
        setBlurredItems((prevBlurredItems) => {
            const newBlurredItems = prevBlurredItems.map(() => !allBlurred);
            setAllBlurred(!allBlurred);
            return newBlurredItems;
        });
    };

    return (
        <>
            <HeaderAt />
            <div className='divContainer'>
                <Sidebar />
                <div className="container">
                    <div className="solidBgHeading">
                        <h2>Atlas</h2>
                    </div>
                    <div className="flashcard bgWhite">
                        <h3>{subject}</h3>

                        {filteredAtlas.length > 0 && currentPageIndex < filteredAtlas[0].pages.length && (
                            <div key={currentPageIndex}>
                                <h4>{filteredAtlas[0].pages[currentPageIndex]?.topic}</h4>
                                <ul>
                                    <li className='atlasImageContainer'>
                                        <img 
                                            src={`../../src/assets/images/atlas/${filteredAtlas[0].pages[currentPageIndex]?.image}`} 
                                            alt={filteredAtlas[0].pages[currentPageIndex]?.topic} 
                                        />
                                    </li>
                                    <li>
                                        <button onClick={handleToggleAllBlur} className="btnBack switchBlurBtn">
                                            {allBlurred ? "Mostrar Todos" : "Ocultar Todos"}
                                        </button>
                                    </li>
                                    <li>
                                        {filteredAtlas[0].pages[currentPageIndex]?.items.map((item, itemIndex) => (
                                            <ul className='itemContainer' key={itemIndex}>
                                                <li>{itemIndex + 1}.-</li>
                                                <li className={`atlasItem ${blurredItems[itemIndex] ? 'blurred' : ''}`} key={itemIndex}>
                                                    {item}
                                                </li>
                                                <li className='btnBlurContainer'>
                                                    <button className='btnBack' onClick={() => handleToggleBlur(itemIndex)}>
                                                        {blurredItems[itemIndex] ? 'Mostrar' : 'Ocultar'}
                                                    </button>
                                                </li>
                                            </ul>
                                        ))}
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="bottomActions">
                        <button onClick={handlePreviousPage} disabled={currentPageIndex === 0}>
                            PÃ¡gina Anterior
                        </button>

                        {filteredAtlas.length > 0 && filteredAtlas[0].pages && currentPageIndex < filteredAtlas[0].pages.length - 1 && (
                            <button onClick={handleNextPage}>Siguiente PÃ¡gina</button>
                        )}
                    </div>
                    <button onClick={handleGoBack} className='btnBackWhite topMar'>Volver</button>
                </div>
            </div>
        </>
    );
};

export default AtlasPages;