import { useState, useEffect } from "react";
import Axios from "axios";
import { createRoutesFromChildren } from "react-router-dom";

export default function Ordenes({ usuario }){
  const [nroRL, setNroRL] = useState('');
  const [tipoOrden, setTipoOrden] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [dniUsuario, setDNI] = useState(usuario.dni);
  const [idCaso, setIdCaso] = useState(0);
  const [idFiscalia, setIdFiscalia] = useState(0);
  const [listaOrdenes, setOrdenes] = useState([]);
  const [casosActivos, setCasosActivos] = useState([]);

  const authConfig = { headers: { "x-rol": usuario.rol }};

  const getOrdenes = () => Axios.get("http://localhost:3000/api/ordenes").then((res) => setOrdenes(res.data));
  useEffect(() => { getOrdenes(); }, []);

  const crearOrden = () => Axios.post("http://localhost:3000/api/ordenes/solicitar", { idCaso, idFiscalia, tipoOrden, descripcion, dniUsuario  }, authConfig).then(() => { getOrdenes();});

  const cargarCasosActivos = async () => {
    const respuesta = await Axios.get("http://localhost:3000/api/pruebas/casos-activos", authConfig);
    setCasosActivos(respuesta.data);
  };
  useEffect(() => { cargarCasosActivos(); }, []);

  return (
    <>
      <div className="card bg-transparent border-info text-light text-center mb-4">
        <div className="card-header border-info text-uppercase">Solicitud de ordenes</div>
        <div className="card-body">
            <div className="row g-3">
                <div className="input-group">
                    <span className="input-group-text bg-dark text-info border-info">Numero Registro Legal</span>
                    <input onChange={(e) => setNroRL(e.target.value)} type="text" className="form-control bg-dark text-light border-info" />
                </div>
                <div className="input-group mb-3">
                    <label className="input-group-text bg-dark text-info border-info" for="inputGroupSelect01">Tipo de Orden</label>
                    <select onChange={(e) => setTipoOrden(e.target.value)} className="form-control bg-dark text-info border-info" id="inputGroupSelect01">
                        <option selected>Seleccionar...</option>
                        <option value="1">Allanamiento</option>
                        <option value="2">Arresto</option>
                    </select>
                </div>
                <div className="input-group">
                    <span className="input-group-text bg-dark text-info border-info">Descripcion</span>
                    <textarea onChange={(e) => setDescripcion(e.target.value)} className="form-control bg-dark text-info border-info" aria-label="With textarea"></textarea>
                </div>
                <div className="input-group mb-3">
                    <label className="input-group-text bg-dark text-info border-info" for="inputGroupSelect01">Caso</label>
                    <select onChange={(e) => setIdCaso(e.target.value)} className="form-control bg-dark text-info border-info" id="inputGroupSelect01">
                        <option selected>Seleccionar...</option>
                        {casosActivos.map((caso) => (
                            <option key={caso.idCasos} value={caso.idCasos}>
                                Caso #{caso.idCasos} — {caso.descripcion}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
        <div className="card-footer border-info d-flex justify-content-center gap-2">
            <button onClick={crearOrden} className="btn btn-outline-success">Solicitar</button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-hover table-bordered border-info text-center align-middle">
          <thead className="table-active">
                <tr>
                    <th>Id</th>
                    <th>Nro Legal</th>
                    <th>Tipo</th>
                    <th>Descripcion</th>
                    <th>Estado</th>
                    <th>Caso</th>
                    <th>Usuario</th>
                </tr>
          </thead>
          <tbody>
            {listaOrdenes.map((val) => (
              <tr key={val.idOrden}>
                <th>{val.idOrden}</th>
                <td>{val.tipoOrden}</td>
                <td>{val.descripcion}</td>
                <td>{val.estadoOrden}</td>
                <td>{val.casoIdCasos}</td>
                <td>{val.usuarioDni}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}