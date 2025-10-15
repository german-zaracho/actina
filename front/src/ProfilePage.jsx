import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, getAvailableImages } from './services/profileService';
import HeaderAt from './HeaderAt';
import { useAuth } from './AuthContext';
import './css/profile.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { profile: contextProfile, updateProfile: updateContextProfile } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [availableImages, setAvailableImages] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        userImage: '',
        bio: '',
        birthDate: '',
        location: ''
    });

    useEffect(() => {
        loadProfile();
        loadAvailableImages();
    }, []);

    const loadAvailableImages = async () => {
        try {
            const images = await getAvailableImages();
            setAvailableImages(images);
        } catch (err) {
            console.error('Error loading available images:', err);
            // Si falla, usar lista por defecto
            setAvailableImages([
                'avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg', 
                'avatar4.jpg', 'avatar5.jpg'
            ]);
        }
    };

    const loadProfile = async () => {
        try {
            const profileData = await getProfile();
            setProfile(profileData);
            setFormData({
                name: profileData.name || '',
                email: profileData.email || '',
                userImage: profileData.userImage || '',
                bio: profileData.bio || '',
                birthDate: profileData.birthDate ? new Date(profileData.birthDate).toISOString().split('T')[0] : '',
                location: profileData.location || ''
            });
        } catch (err) {
            console.error('Error loading profile:', err);
            setError('Error al cargar el perfil');
            if (err.message.includes('token') || err.message.includes('401')) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageSelect = (imageName) => {
        setFormData(prev => ({
            ...prev,
            userImage: imageName // Si es '', mostrará la letra inicial
        }));
    };

    const getInitialLetter = () => {
        if (formData.name) {
            return formData.name.charAt(0).toUpperCase();
        } else if (profile?.userName) {
            return profile.userName.charAt(0).toUpperCase();
        }
        return 'A';
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const response = await updateProfile(formData);

            const updatedProfile = response.profile || response;
            setProfile(updatedProfile);
            setFormData({
                name: updatedProfile.name || '',
                email: updatedProfile.email || '',
                userImage: updatedProfile.userImage || '',
                bio: updatedProfile.bio || '',
                birthDate: updatedProfile.birthDate ? new Date(updatedProfile.birthDate).toISOString().split('T')[0] : '',
                location: updatedProfile.location || ''
            });
            
            setIsEditing(false);
            updateContextProfile(updatedProfile);
            // Notificar al HeaderAt que el perfil se actualizó
            window.dispatchEvent(new CustomEvent('profileUpdated'));
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.error?.message || 'Error al actualizar el perfil');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (profile) {
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
                userImage: profile.userImage || '',
                bio: profile.bio || '',
                birthDate: profile.birthDate ? new Date(profile.birthDate).toISOString().split('T')[0] : '',
                location: profile.location || ''
            });
        }
        setError('');
    };

    if (loading) {
        return (
            <>
                <HeaderAt />
                <div className="profile-container">
                    <div className="loading">Cargando perfil...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <HeaderAt />
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-header">
                        <h1>Mi Perfil</h1>
                        {!isEditing && (
                            <button 
                                className="btn-edit" 
                                onClick={() => setIsEditing(true)}
                            >
                                Editar Perfil
                            </button>
                        )}
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSave}>
                        <div className="profile-content">
                            <div className="profile-image-section">
                                <div className="profile-image">
                                    {formData.userImage ? (
                                        <img 
                                            src={`/src/assets/images/profile-imgs/${formData.userImage}`} 
                                            alt="Profile" 
                                        />
                                    ) : (
                                        <div className="default-avatar">
                                            {getInitialLetter()}
                                        </div>
                                    )}
                                </div>
                                
                                {isEditing && (
                                    <div className="image-selector">
                                        <label>Seleccionar imagen:</label>
                                        
                                        {/* Opción para usar letra inicial */}
                                        <div className="default-option">
                                            <button
                                                type="button"
                                                className={`image-option default-avatar-option ${!formData.userImage ? 'selected' : ''}`}
                                                onClick={() => handleImageSelect('')}
                                            >
                                                <div className="default-avatar small">
                                                    {getInitialLetter()}
                                                </div>
                                            </button>
                                            <span className="option-label">Letra inicial</span>
                                        </div>

                                        {/* Opciones de imágenes */}
                                        <div className="images-section">
                                            <p className="section-title">O elige una imagen:</p>
                                            <div className="image-grid">
                                                {availableImages.map((imageName) => (
                                                    <button
                                                        key={imageName}
                                                        type="button"
                                                        className={`image-option ${formData.userImage === imageName ? 'selected' : ''}`}
                                                        onClick={() => handleImageSelect(imageName)}
                                                    >
                                                        <img 
                                                            src={`/src/assets/images/profile-imgs/${imageName}`} 
                                                            alt={`Avatar ${imageName}`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="profile-info">
                                <div className="form-group">
                                    <label>Nombre completo</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Tu nombre completo"
                                        />
                                    ) : (
                                        <p>{profile?.name || 'No especificado'}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Usuario</label>
                                    <p>{profile?.userName}</p>
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="tu@email.com"
                                        />
                                    ) : (
                                        <p>{profile?.email || 'No especificado'}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Biografía</label>
                                    {isEditing ? (
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            placeholder="Cuéntanos algo sobre ti..."
                                            rows="3"
                                            maxLength="200"
                                        />
                                    ) : (
                                        <p>{profile?.bio || 'No especificado'}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Fecha de nacimiento</label>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            name="birthDate"
                                            value={formData.birthDate}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <p>
                                            {profile?.birthDate 
                                                ? new Date(profile.birthDate).toLocaleDateString() 
                                                : 'No especificado'
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Ubicación</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder="Tu ciudad, país"
                                        />
                                    ) : (
                                        <p>{profile?.location || 'No especificado'}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="btn-cancel" 
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-save"
                                    disabled={saving}
                                >
                                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;