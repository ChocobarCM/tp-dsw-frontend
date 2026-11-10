import { useState, useEffect } from "react";
import Axios from "axios";

export default function Zonas({ usuario }){
  const [nombre, setNombre] = useState('');
  const [cod, setCod] = useState(0);
  const [editar, setEditar] = useState(false);
  const [listaZonas, setZonas] = useState([]);

  const authConfig = { headers: { "x-rol": usuario.rol }};

  const getZonas = () => Axios.get("http://localhost:3000/api/zonas").then((res) => setZonas(res.data));
  useEffect(() => { getZonas(); }, []);

  const crearZona = () => Axios.post("http://localhost:3000/api/zonas", { nombre }, authConfig).then(() => { getZonas(); cancelarEdit(); });
  const eliminarZona = (cod) => Axios.delete(`http://localhost:3000/api/zonas/${cod}`, authConfig).then(() => getZonas());
  const actZona = () => Axios.put(`http://localhost:3000/api/zonas/${cod}`, { nombre }, authConfig).then(() => { getZonas(); cancelarEdit(); });
  
  const cancelarEdit = () => { setNombre(""); setEditar(false); };
  const editarZona = (val) => { setEditar(true); setNombre(val.nombre); setCod(val.codZona); };

  return (
    <>
      <div className="card bg-transparent border-info text-light text-center mb-4">
        <div className="card-header border-info text-uppercase">Gestión de zonas</div>
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text bg-dark text-info border-info">Nombre</span>
            <input onChange={(e) => setNombre(e.target.value)} value={nombre} type="text" className="form-control bg-dark text-light border-info" />
          </div>
        </div>
        <div className="card-footer border-info d-flex justify-content-center gap-2">
          {editar ? (
            <>
              <button onClick={actZona} className="btn btn-outline-success">Actualizar</button>
              <button onClick={cancelarEdit} className="btn btn-outline-danger">Cancelar</button>
            </>
          ) : <button onClick={crearZona} className="btn btn-outline-success">Crear</button>}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-hover table-bordered border-info text-center align-middle">
          <thead className="table-active"><tr><th>Cod</th><th>Nombre</th><th>Acción</th></tr></thead>
          <tbody>
            {listaZonas.map((val) => (
              <tr key={val.codZona}>
                <th>{val.codZona}</th><td>{val.nombre}</td>
                <td>
                  <div className="btn-group">
                    <button onClick={() => editarZona(val)} className="btn btn-sm btn-outline-primary">Editar</button>
                    <button onClick={() => eliminarZona(val.codZona)} className="btn btn-sm btn-outline-danger">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}