import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderAt from './HeaderAt';
import Sidebar from './Sidebar';
import UserActivityForm from './UserActivityForm';
import './css/create-activity.css';

const CreateActivityPage = () => {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState(null); // null, 'multiplechoice', 'flashcard', 'atlas'

    const handleSelectType = (type) => {
        setSelectedType(type);
    };

    const handleCancel = () => {
        setSelectedType(null);
    };

    const handleSave = () => {
        // Después de guardar, redirigir a "Mis Actividades"
        alert('¡Actividad creada exitosamente!');
        navigate('/my-activities');
    };

    const activityTypes = [
        {
            type: 'multiplechoice',
            title: 'Multiple Choice',
            description: 'Crea preguntas de opción múltiple con respuestas y justificaciones',
            icon: 'quiz',
            color: '#667eea'
        },
        {
            type: 'flashcard',
            title: 'Flashcard',
            description: 'Crea tarjetas de estudio con conceptos y características',
            icon: 'style',
            color: '#f093fb'
        },
        {
            type: 'atlas',
            title: 'Atlas',
            description: 'Crea un atlas visual con imágenes y elementos educativos',
            icon: 'map',
            color: '#4facfe'
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
                                    <p className="subtitle">Elige el tipo de actividad que deseas crear</p>
                                </div>

                                <div className="activity-types-grid">
                                    {activityTypes.map((activity) => (
                                        <div
                                            key={activity.type}
                                            className="activity-type-card"
                                            onClick={() => handleSelectType(activity.type)}
                                            style={{ '--card-color': activity.color }}
                                        >
                                            <div className="card-icon">
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
        </>
    );
};

export default CreateActivityPage;