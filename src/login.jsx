import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import Axios from "axios";

const Login = ({ setUsuario }) => {
    const [dni, setDni] = useState("");
    const [contra, setContra] = useState("");
    // 1. Nuevo estado para manejar el mensaje de error visual
    const [errorMsg, setErrorMsg] = useState(""); 

    const handdleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg(""); // 2. Limpiamos cualquier error previo al hacer un nuevo intento
        
        try {
            const response = await Axios.post("http://localhost:3000/api/login", {
                dni: dni,
                password: contra
            });

            // Guardamos el usuario en el navegador convirtiéndolo a texto (JSON)
            localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
            setUsuario(response.data.usuario);
            
        } catch (error) {
            if (error.response) {
                // 3. En lugar del alert, guardamos el texto del backend en el estado
                setErrorMsg(error.response.data.mensaje); 
            } else {
                setErrorMsg("Error de conexión con el servidor.");
            }
        }
    }

    return(
        <main className="login-screen">
            <section className="login-card" aria-labelledby="login-title">
                <div className="login-card-header">
                    <span className="login-kicker">SGIC-RO</span>
                    <h1 id="login-title">Intranet Forense</h1>
                    <p>Ingresá tus credenciales para continuar</p>
                </div>

                <form className="login-form" onSubmit={handdleLogin}>
                    <label htmlFor="inputDni">DNI</label>
                    <input
                        onChange={(event) => {
                            setDni(event.target.value);
                            setErrorMsg("");
                        }}
                        value={dni}
                        type="text"
                        id="inputDni"
                        autoComplete="username"
                        required
                    />

                    <label htmlFor="inputPassword5">Contraseña</label>
                    <input
                        onChange={(event) => {
                            setContra(event.target.value);
                            setErrorMsg("");
                        }}
                        value={contra}
                        type="password"
                        id="inputPassword5"
                        autoComplete="current-password"
                        required
                    />

                    {errorMsg && (
                        <div className="login-error" role="alert">
                            {errorMsg}
                        </div>
                    )}

                    <button type="submit" className="login-submit">
                        Iniciar sesión
                    </button>
                </form>
            </section>
        </main>
    );
}

export default Login;