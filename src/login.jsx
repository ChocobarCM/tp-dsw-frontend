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
        <div className="card text-center m-5">
            <div className="card-header">
                Login - Intranet Forense
            </div>
            <div className="card-body">
                <label htmlFor="inputDni" className="form-label mb-2">DNI</label>
                <input 
                    onChange={(event) => {
                        setDni(event.target.value);
                        setErrorMsg(""); // Limpiamos el error en cuanto el usuario vuelve a escribir
                    }} 
                    type="text" 
                    className="form-control" 
                    id="inputDni" 
                />
                
                <label htmlFor="inputPassword5" className="form-label mt-3">Contraseña</label>
                <input 
                    onChange={(event) => {
                        setContra(event.target.value);
                        setErrorMsg(""); // Limpiamos el error en cuanto el usuario vuelve a escribir
                    }} 
                    type="password" 
                    id="inputPassword5" 
                    className="form-control" 
                />

                {/* 4. Mostramos el mensaje en rojo solo si errorMsg no está vacío */}
                {errorMsg && (
                    <div className="text-danger fw-bold mt-3">
                        {errorMsg}
                    </div>
                )}
            </div>
            <div className="card-footer">
                <button type="button" className="btn btn-primary" onClick={handdleLogin}>
                    Iniciar Sesión
                </button>
            </div>
        </div>
    );
}

export default Login;