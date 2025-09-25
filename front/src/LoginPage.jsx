import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { login } from "./services/authService";
import HeaderAtLanding from "./HeaderAtLanding";
import './css/login.css';

const LoginPage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [userName, setUserName] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const successMessage = location.state?.message;// Mensaje de éxito del registro

    const onChangeUserName = (e) => {
        setUserName(e.target.value);
        if (error) setError(""); // Limpiar error al escribir
    };

    const onChangePass = (e) => {
        setPass(e.target.value);
        if (error) setError(""); // Limpiar error al escribir
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
            console.log("userName:", userName, "Pass:", pass);
            const { account, token } = await login({ userName: userName.trim(), password: pass });
            
            console.log(account, token);
            localStorage.setItem("token", token);
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

                    <div>
                        <label>Nombre de usuario</label>
                        <input type="text" onChange={onChangeUserName} value={userName}  placeholder="Ingresa tu nombre de usuario"
                            required/>
                    </div>
                    <div>
                        <label>Contraseña</label>
                        <input type="password" onChange={onChangePass} value={pass} placeholder="Ingresa tu contraseña"
                            required />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button className="btnLogin" type="submit" disabled={loading}>{loading ? "Ingresando..." : "Ingresar"}</button>

                    <div className="auth-links">
                        <p>¿No tienes cuenta? <Link to="/register">Crear cuenta</Link></p>
                    </div>
                    
                </form>
            </div>
        </>

    );
};

export default LoginPage;