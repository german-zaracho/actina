import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAt from './HeaderAt';
import Sidebar from './Sidebar';
import UserActivityForm from './UserActivityForm';
import ToastNotification from './ToastNotification';
import './css/create-activity.css';

const CreateActivityPage = () => {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState(null);
    
    const [toast, setToast] = useState({
        isVisible: false,
        message: '',
        type: 'success'
    });

    const handleSelectType = (type) => {
        setSelectedType(type);
    };

    const handleCancel = () => {
        setSelectedType(null);
    };

    const handleSave = () => {
        setToast({
            isVisible: true,
            message: '¡Actividad creada exitosamente!',
            type: 'success'
        });
        setTimeout(() => {
            navigate('/my-activities');
        }, 1500);
    };

    const closeToast = () => {
        setToast({ ...toast, isVisible: false });
    };

    const activityTypes = [
        {
            type: 'multiplechoice',
            title: 'Multiple Choice',
            description: 'Crea preguntas de opción múltiple con respuestas y justificaciones',
            icon: 'quiz',
            color: '#037e6a'
        },
        {
            type: 'flashcard',
            title: 'Flashcard',
            description: 'Crea tarjetas de estudio con conceptos y características',
            icon: 'style',
            color: '#534799'
        },
        {
            type: 'atlas',
            title: 'Atlas',
            description: 'Crea un atlas visual con imágenes y elementos educativos',
            icon: 'art_track',
            color: '#0185c6'
        }
    ];

    return (
        <>
            <HeaderAt />
            <div className='divContainer'>
                <Sidebar />
                <div className="container">
                    <div className="create-activity-container">
                        {!selectedType ? (
                            <>
                                <div className="page-header">
                                    <h1>Crear Nueva Actividad</h1>
                                </div>

                                <div className="activity-types-grid">
                                    {activityTypes.map((activity) => (
                                        <div
                                            key={activity.type}
                                            className="activity-type-card"
                                            onClick={() => handleSelectType(activity.type)}
                                            style={{ '--card-color': activity.color }}
                                        >
                                            <div 
                                                className="card-icon" 
                                                style={{ backgroundColor: activity.color }}
                                            >
                                                <span className="material-icons">{activity.icon}</span>
                                            </div>
                                            <h3>{activity.title}</h3>
                                            <p>{activity.description}</p>
                                            <button className="btn-select">
                                                Crear {activity.title}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button 
                                    onClick={() => navigate(-1)} 
                                    className='btnBackWhite'
                                >
                                    Volver
                                </button>
                            </>
                        ) : (
                            <div className="form-wrapper">
                                <UserActivityForm
                                    activityType={selectedType}
                                    item={null}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ToastNotification
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={closeToast}
                duration={2000}
            />
        </>
    );
};

export default CreateActivityPage;