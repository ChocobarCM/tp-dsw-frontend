import { useState, useEffect } from "react";
import Axios from "axios";

export default function Oficiales() {
  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('DETECTIVE');
  const [cod, setCod] = useState(0);
  const [editar, setEditar] = useState(false);
  const [listaOficiales, setOficiales] = useState([]);

  const getAuthConfig = () => {
    const userGuardado = JSON.parse(localStorage.getItem("usuario") || "{}");
    const token = localStorage.getItem("token") || userGuardado.token;
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const URL_API = "http://localhost:3000/api/oficiales"; // O /api/usuarios según tu backend

  const getOficiales = () => Axios.get(URL_API, getAuthConfig()).then((res) => setOficiales(res.data));
  useEffect(() => { getOficiales(); }, []);

  const crearOficial = () => {
    Axios.post(URL_API, { dni, nombre, password, rol }, getAuthConfig()).then(() => {
      getOficiales();
      cancelarEdit();
    });
  };

  const eliminarOficial = (id) => {
    Axios.delete(`${URL_API}/${id}`, getAuthConfig()).then(() => getOficiales());
  };

  const actOficial = () => {
    const datos = { dni, nombre, rol };
    if (password.trim() !== "") datos.password = password; // Solo envía contraseña si escribió una nueva

    Axios.put(`${URL_API}/${cod}`, datos, getAuthConfig()).then(() => {
      getOficiales();
      cancelarEdit();
    });
  };

  const cancelarEdit = () => {
    setDni("");
    setNombre("");
    setPassword("");
    setRol("DETECTIVE");
    setEditar(false);
  };

  const editarOficial = (val) => {
    setEditar(true);
    setDni(val.dni);
    setNombre(val.nombre);
    setRol(val.rol);
    setPassword(""); // Dejamos en blanco por seguridad al editar
    setCod(val.codOficial || val.id || val.dni);
  };

  return (
    <>
      <div className="card bg-transparent border-info text-light text-center mb-4">
        <div className="card-header border-info text-uppercase">Gestión de Oficiales y Credenciales</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-dark text-info border-info">DNI</span>
                <input onChange={(e) => setDni(e.target.value)} value={dni} type="text" className="form-control bg-dark text-light border-info" placeholder="Número de documento" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-dark text-info border-info">Nombre</span>
                <input onChange={(e) => setNombre(e.target.value)} value={nombre} type="text" className="form-control bg-dark text-light border-info" placeholder="Nombre completo" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-dark text-info border-info">Contraseña</span>
                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className="form-control bg-dark text-light border-info" placeholder={editar ? "Dejar vacío para no cambiar" : "Clave de acceso"} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-dark text-info border-info">Rol</span>
                <select onChange={(e) => setRol(e.target.value)} value={rol} className="form-select bg-dark text-light border-info">
                  <option value="DETECTIVE">DETECTIVE</option>
                  <option value="FISCAL">FISCAL</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer border-info d-flex justify-content-center gap-2">
          {editar ? (
            <>
              <button onClick={actOficial} className="btn btn-outline-success">Actualizar</button>
              <button onClick={cancelarEdit} className="btn btn-outline-danger">Cancelar</button>
            </>
          ) : <button onClick={crearOficial} className="btn btn-outline-success">Registrar Oficial</button>}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-hover table-bordered border-info text-center align-middle">
          <thead className="table-active">
            <tr>
              <th>ID / Legajo</th>
              <th>DNI</th>
              <th>Nombre</th>
              <th>Rol Asignado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {listaOficiales.map((val) => {
              const idActual = val.codOficial || val.id || val.dni;
              return (
                <tr key={idActual}>
                  <th>{idActual}</th>
                  <td>{val.dni}</td>
                  <td>{val.nombre}</td>
                  <td><span className="badge bg-info text-dark">{val.rol}</span></td>
                  <td>
                    <div className="btn-group">
                      <button onClick={() => editarOficial(val)} className="btn btn-sm btn-outline-primary">Editar</button>
                      <button onClick={() => eliminarOficial(idActual)} className="btn btn-sm btn-outline-danger">Baja</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}