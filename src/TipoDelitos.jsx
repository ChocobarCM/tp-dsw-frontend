import { useState, useEffect } from "react";
import Axios from "axios";

export default function TipoDelitos() {
  const [descripcion, setDescripcion] = useState('');
  const [cod, setCod] = useState(0);
  const [editar, setEditar] = useState(false);
  const [listaDelitos, setDelitos] = useState([]);

  // Configuración automática del Token JWT para rutas protegidas
  const getAuthConfig = () => {
    //COMENTADO PARA NO GUARDAR EL TOKEN
    //const userGuardado = JSON.parse(localStorage.getItem("usuario") || "{}");
    //const token = localStorage.getItem("token") || userGuardado.token;
    //return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const URL_API = "http://localhost:3000/api/tipoDelitos"; 

  const getDelitos = () => Axios.get(URL_API, getAuthConfig()).then((res) => setDelitos(res.data));
  useEffect(() => { getDelitos(); }, []);

  const crearDelito = () => {
    Axios.post(URL_API, { descripcion }, getAuthConfig()).then(() => {
      getDelitos();
      cancelarEdit();
    });
  };

  const eliminarDelito = (id) => {
    Axios.delete(`${URL_API}/${id}`, getAuthConfig()).then(() => getDelitos());
  };

  const actDelito = () => {
    Axios.put(`${URL_API}/${cod}`, { descripcion }, getAuthConfig()).then(() => {
      getDelitos();
      cancelarEdit();
    });
  };

  const cancelarEdit = () => {
    setDescripcion("");
    setEditar(false);
  };

  const editarDelito = (val) => {
    setEditar(true);
    setDescripcion(val.descripcion);
    setCod(val.codigoTD);
  };

  return (
    <>
      <div className="card bg-transparent border-info text-light text-center mb-4">
        <div className="card-header border-info text-uppercase">Gestión de Tipos de Delito</div>
        <div className="card-body d-flex flex-column gap-3">
          <div className="input-group">
            <span className="input-group-text bg-dark text-info border-info">Descripción</span>
            <input onChange={(e) => setDescripcion(e.target.value)} value={descripcion} type="text" className="form-control bg-dark text-light border-info" placeholder="Detalle o artículo penal (opcional)" required/>
          </div>
        </div>
        <div className="card-footer border-info d-flex justify-content-center gap-2">
          {editar ? (
            <>
              <button onClick={actDelito} className="btn btn-outline-success">Actualizar</button>
              <button onClick={cancelarEdit} className="btn btn-outline-danger">Cancelar</button>
            </>
          ) : <button onClick={crearDelito} className="btn btn-outline-success">Crear</button>}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-hover table-bordered border-info text-center align-middle">
          <thead className="table-active">
            <tr>
              <th>Cod</th>
              <th>Descripción</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {listaDelitos.map((val) => {
              const idActual = val.codigoTD;
              return (
                <tr key={idActual}>
                  <th>{idActual}</th>
                  <td>{val.descripcion}</td>
                  <td>
                    <div className="btn-group">
                      <button onClick={() => editarDelito(val)} className="btn btn-sm btn-outline-primary">Editar</button>
                      <button onClick={() => eliminarDelito(idActual)} className="btn btn-sm btn-outline-danger">Eliminar</button>
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