import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login } from "../services/authService";
import HeaderAtLanding from "../components/layout/HeaderAtLanding";
import { useAuth } from '../AuthContext';
import '../css/login.css';

const LoginPage = () => {

    const navigate = useNavigate();
    const { login: loginContext } = useAuth();
    const [userName, setUserName] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const successMessage = location.state?.message;// Mensaje de éxito del registro

    const onChangeUserName = (e) => {
        setUserName(e.target.value);
        if (error) setError(""); // Limpia el error al escribir
    };

    const onChangePass = (e) => {
        setPass(e.target.value);
        if (error) setError("");
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!userName.trim() || !pass) {
            setError("Por favor completa todos los campos");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const { account, token } = await login({ userName: userName.trim(), password: pass });

            await loginContext(token, account);

            navigate("/home", { replace: true });
        } catch (err) {
            console.error("Error en login:", err);
            setError(err.error?.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <HeaderAtLanding />
            <div className="loginForm">
                <form onSubmit={onSubmit}>
                    <h1>Iniciar sesion</h1>

                    {successMessage && (
                        <div className="success-message">
                            {successMessage}
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="username">Nombre de usuario</label>
                        <input
                            id="username"
                            type="text"
                            onChange={onChangeUserName}
                            value={userName}
                            placeholder="Ingresa tu nombre de usuario"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            onChange={onChangePass}
                            value={pass}
                            placeholder="Ingresa tu contraseña"
                            required
                        />
                    </div>

                    <button
                        className={`btnLogin ${loading ? 'loading' : ''}`}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? '' : 'Ingresar'}
                    </button>

                    <div className="auth-links">
                        <p>¿No tienes cuenta? <a href="/register">Crear cuenta</a></p>
                    </div>

                </form>
            </div>
        </>

    );
};

export default LoginPage;