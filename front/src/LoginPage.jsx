import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "./services/authService";
import HeaderAtLanding from "./HeaderAtLanding";
import './css/login.css';

const LoginPage = () => {

    const navigate = useNavigate()
    const [userName, setUserName] = useState("")
    const [pass, setPass] = useState("")
    const [error, setError] = useState("")

    const onChangeUserName = (e) => {
        setUserName(e.target.value)
    }

    const onChangePass = (e) => {
        setPass(e.target.value)
    }

    const onSubmit = (e) => {

        e.preventDefault()
        console.log("userName:", userName, "Pass:", pass)
        login({ userName, password: pass })
            .then(({ account, token }) => {
                console.log(account, token)
                localStorage.setItem("token", token)
                navigate("/home", { replace: true })
            })
            .catch(err => setError(err.error.message))

    }

    return (
        <>
            <HeaderAtLanding />
            <div className="loginForm">
                <form onSubmit={onSubmit}>
                    <h1>Iniciar sesion</h1>
                    <div>
                        <label>Nombre de usuario</label>
                        <input type="text" onChange={onChangeUserName} value={userName} />
                    </div>
                    <div>
                        <label>Contraseña</label>
                        <input type="password" onChange={onChangePass} value={pass} />
                    </div>

                    <p> {error} </p>
                    <button className="btnLogin" type="submit">Ingresar</button>
                </form>
            </div>
        </>

    );
};

export default LoginPage;