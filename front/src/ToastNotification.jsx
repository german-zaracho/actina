import React, { useEffect } from 'react';
import './css/toast-notification.css';

const ToastNotification = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, duration]);

    if (!isVisible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return 'check_circle';
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            case 'info':
                return 'info';
            default:
                return 'check_circle';
        }
    };

    return (
        <div className={`toast-notification ${type} ${isVisible ? 'show' : ''}`}>
            <span className="material-icons toast-icon">
                {getIcon()}
            </span>
            <span className="toast-message">{message}</span>
            <button 
                className="toast-close"
                onClick={onClose}
                aria-label="Cerrar notificación"
            >
                <span className="material-icons">close</span>
            </button>
        </div>
    );
};

export default ToastNotification;