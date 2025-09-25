import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "./services/authService";
import HeaderAtLanding from "./HeaderAtLanding";
import './css/login.css'; // Reutilizamos los estilos del login

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Limpiar error cuando el usuario comience a escribir
        if (error) setError("");
    };

    const validateForm = () => {
        if (!formData.userName.trim()) {
            setError("El nombre de usuario es requerido");
            return false;
        }
        if (!formData.email.trim()) {
            setError("El email es requerido");
            return false;
        }
        if (!formData.password) {
            setError("La contraseña es requerida");
            return false;
        }
        if (formData.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return false;
        }
        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Por favor ingresa un email válido");
            return false;
        }
        return true;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setError("");

        try {
            const response = await register({
                userName: formData.userName.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });

            console.log("Usuario registrado:", response);
            
            // Opcional: Auto-login después del registro
            // Si tu backend devuelve un token al registrarse, puedes hacer esto:
            // localStorage.setItem("token", response.token);
            // navigate("/home", { replace: true });
            
            // O redirigir al login con un mensaje de éxito
            navigate("/login", { 
                state: { message: "¡Registro exitoso! Ahora puedes iniciar sesión." }
            });

        } catch (err) {
            console.error("Error en registro:", err);
            setError(err.error?.message || "Error al registrar usuario");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <HeaderAtLanding />
            <div className="loginForm">
                <form onSubmit={onSubmit}>
                    <h1>Crear cuenta</h1>
                    
                    <div>
                        <label>Nombre de usuario</label>
                        <input 
                            type="text" 
                            name="userName"
                            onChange={handleChange} 
                            value={formData.userName}
                            placeholder="Ingresa tu nombre de usuario"
                            required
                        />
                    </div>

                    <div>
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email"
                            onChange={handleChange} 
                            value={formData.email}
                            placeholder="Ingresa tu email"
                            required
                        />
                    </div>

                    <div>
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            name="password"
                            onChange={handleChange} 
                            value={formData.password}
                            placeholder="Mínimo 6 caracteres"
                            required
                        />
                    </div>

                    <div>
                        <label>Confirmar contraseña</label>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            onChange={handleChange} 
                            value={formData.confirmPassword}
                            placeholder="Repite tu contraseña"
                            required
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    
                    <button 
                        className="btnLogin" 
                        type="submit" 
                        disabled={loading}
                    >
                        {loading ? "Creando cuenta..." : "Crear cuenta"}
                    </button>

                    <div className="auth-links">
                        <p>¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p>
                    </div>
                </form>
            </div>
        </>
    );
};

export default RegisterPage;