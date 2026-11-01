import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import Axios from "axios";

const login = () => {

    const [dni, setDni] = useState("");
    const [contra, setContra] = useState("");

    const handdleLogin = (e) => {
        e.preventDefault();
    }

    return(
        <div class="card text-center">
            <div class="card-header">
                Login
            </div>
            <div class="card-body">
                <label for="exampleFormControlInput" class="form-label mb-2">Dni</label>
                <input onChange={(event)=>{setDni(event.target.value)}} type="email" class="form-control" id="exampleFormControlInput" placeholder=""></input>
                <label for="inputPassword5" class="form-label">Contraseña</label>
                <input onChange={(event)=>{setContra(event.target.value)}} type="password" id="inputPassword5" class="form-control" aria-describedby="passwordHelpBlock"/>
            </div>
            <div class="card-footer fg-2">
                <button type="button" className="btn btn-primary" onClick={handdleLogin}>Iniciar Sesion</button>
            </div>
        </div>
    );
}

export default login;