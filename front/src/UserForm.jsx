import React, { useState, useEffect } from 'react';
import { createUser, updateUser } from './services/adminService';
import './css/user-form.css';

const UserForm = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        confirmPassword: '',
        rol: 1,
        name: '',
        email: '',
        userImage: '',
        bio: '',
        birthDate: '',
        location: ''
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                userName: user.userName || '',
                password: '',
                confirmPassword: '',
                rol: user.rol || 1,
                name: user.name || '',
                email: user.email || '',
                userImage: user.userImage || '',
                bio: user.bio || '',
                birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
                location: user.location || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'number' ? parseInt(value) : value
        });
    };

    const validateForm = () => {
        // Validar userName
        if (!formData.userName.trim()) {
            setError('El nombre de usuario es requerido');
            return false;
        }

        // Validar contraseña (solo al crear o si se ingresa una nueva)
        if (!user && !formData.password) {
            setError('La contraseña es requerida');
            return false;
        }

        if (formData.password && formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return false;
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return false;
        }

        // Validar email si se proporciona
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Email inválido');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setSaving(true);
        setError('');

        try {
            // Preparar datos para enviar
            const dataToSave = {
                userName: formData.userName.trim(),
                rol: formData.rol,
                name: formData.name.trim(),
                email: formData.email.trim(),
                userImage: formData.userImage,
                bio: formData.bio.trim(),
                birthDate: formData.birthDate || null,
                location: formData.location.trim()
            };

            // Solo incluir password si se ingresó
            if (formData.password) {
                dataToSave.password = formData.password;
            }

            if (user) {
                await updateUser(user._id, dataToSave);
            } else {
                await createUser(dataToSave);
            }
            
            onSave();
        } catch (err) {
            setError(err.error?.message || 'Error al guardar usuario');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="form-container user-form">
            <h2>{user ? 'Editar' : 'Crear'} Usuario</h2>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* Datos de Cuenta */}
                <fieldset className="form-section">
                    <legend>Datos de Cuenta</legend>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nombre de Usuario *</label>
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                                placeholder="usuario123"
                            />
                        </div>

                        <div className="form-group">
                            <label>Rol *</label>
                            <select
                                name="rol"
                                value={formData.rol}
                                onChange={handleChange}
                                required
                                disabled={!!user}
                                title={user ? "No se puede modificar el rol de un usuario existente" : ""}
                            >
                                <option value={1}>Usuario</option>
                                {/* Solo mostrar opción de Administrador si se está editando un admin existente */}
                                {user && user.rol === 2 && (
                                    <option value={2}>Administrador</option>
                                )}
                            </select>
                            {user && (
                                <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                                    El rol no puede ser modificado
                                </small>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Contraseña {user ? '(dejar vacío para no cambiar)' : '*'}</label>
                            <div className="password-input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required={!user}
                                    placeholder="Mínimo 6 caracteres"
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-icons">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Confirmar Contraseña {user ? '' : '*'}</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required={!user && !!formData.password}
                                placeholder="Repetir contraseña"
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Datos de Perfil */}
                <fieldset className="form-section">
                    <legend>Datos de Perfil</legend>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Juan Pérez"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="usuario@ejemplo.com"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Imagen de Perfil</label>
                            <input
                                type="text"
                                name="userImage"
                                value={formData.userImage}
                                onChange={handleChange}
                                placeholder="avatar1.jpg"
                            />
                            <small className="helper-text">
                                Nombre del archivo en /assets/images/profile-imgs/
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Fecha de Nacimiento</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Ubicación</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Buenos Aires, Argentina"
                        />
                    </div>

                    <div className="form-group">
                        <label>Biografía</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="3"
                            maxLength="200"
                            placeholder="Información adicional sobre el usuario..."
                        />
                        <small className="char-count">
                            {formData.bio.length}/200 caracteres
                        </small>
                    </div>
                </fieldset>

                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-save" disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar Usuario'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;