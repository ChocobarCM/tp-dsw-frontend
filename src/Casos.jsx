import { useEffect, useState } from "react";
import Axios from "axios";

const URL_CASOS = "http://localhost:3000/api/casos";
const URL_TIPOS = "http://localhost:3000/api/tipoDelitos";
const URL_ZONAS = "http://localhost:3000/api/zonas";

export default function Casos({ usuario }) {
  const [casos, setCasos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [zonaCodZona, setZonaCodZona] = useState("");
  const [idEditando, setIdEditando] = useState(null);

  const [descripcion, setDescripcion] = useState("");
  //const [estado, setEstado] = useState(""); COMENTADO PARA QUE EL ESTADO NO SEA EDITABLE POR EL USUARIO, SINO QUE SE MANEJE DESDE EL BACKEND
  const [direccion, setDireccion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [tipoDelitoId, setTipoDelitoId] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [mensaje, setMensaje] = useState("");

  const authConfig = {
    headers: { "x-rol": usuario.rol, "x-dni": usuario.dni }
  };

  const cargarCasos = async () => {
    const respuesta = await Axios.get(URL_CASOS, authConfig);
    setCasos(respuesta.data);
  };

  const cargarZonas = async () => {
  const respuesta = await Axios.get(URL_ZONAS);
  setZonas(respuesta.data);
};

  const cargarTipos = async () => {
    const respuesta = await Axios.get(URL_TIPOS);
    setTipos(respuesta.data);
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        await Promise.all([cargarCasos(), cargarTipos(), cargarZonas()]);
      } catch (error) {
        setErrorMsg(
          error.response?.data?.mensaje || "No se pudieron cargar los casos o tipos de delito."
        );
      }
    };

    cargarDatos();
  }, []);

  const limpiarFormulario = () => {
    setIdEditando(null);
    setDescripcion("");
    //setEstado(""); COMENTADO PARA QUE EL ESTADO NO SEA EDITABLE POR EL USUARIO, SINO QUE SE MANEJE DESDE EL BACKEND
    setDireccion("");
    setFechaInicio("");
    setTipoDelitoId("");
    setZonaCodZona("");
  };

  const guardarCaso = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setMensaje("");

    const datos = {
      descripcion,
      //estado, COMENTADO PARA QUE EL ESTADO NO SEA EDITABLE POR EL USUARIO, SINO QUE SE MANEJE DESDE EL BACKEND
      direccion,
      fechaInicio: fechaInicio || null,
      tipoDelitoId: Number(tipoDelitoId),
      zonaCodZona: Number(zonaCodZona),
      dniDetective: usuario?.dni,
      codDetective: usuario?.dni,
      usuarioDni: usuario?.dni
    };

    try {
      if (idEditando !== null) {
        await Axios.put(`${URL_CASOS}/${idEditando}`, datos, authConfig);
        setMensaje("Caso actualizado.");
      } else {
        await Axios.post(URL_CASOS, datos, authConfig);
        setMensaje("Caso creado.");
      }

      await cargarCasos();
      limpiarFormulario();
    } catch (error) {
      setErrorMsg(
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        "No se pudo guardar el caso."
      );
    }
  };

  const prepararEdicion = (caso) => {
    setIdEditando(caso.idCasos);
    setDescripcion(caso.descripcion || "");
    //setEstado(caso.estado || ""); COMENTADO PARA QUE EL ESTADO NO SEA EDITABLE POR EL USUARIO, SINO QUE SE MANEJE DESDE EL BACKEND
    setDireccion(caso.direccion || "");
    setFechaInicio(caso.fechaInicio || "");
    setTipoDelitoId(String(caso.tipoDelitoId || ""));
    setZonaCodZona(String(caso.zonaCodZona || ""));
    setErrorMsg("");
    setMensaje("");
  };

  const eliminarCaso = async (idCasos) => {
    setErrorMsg("");
    setMensaje("");

    try {
      await Axios.delete(`${URL_CASOS}/${idCasos}`, authConfig);
      await cargarCasos();
      setMensaje("Caso eliminado.");
    } catch (error) {
      setErrorMsg(
        error.response?.data?.mensaje ||
        "No se pudo eliminar el caso."
      );
    }
  };

  return (
    <>
      <div className="card bg-transparent border-info text-light text-center mb-4">
        <div className="card-header border-info text-uppercase">
          Gestión de casos
        </div>

        <form onSubmit={guardarCaso}>
          <div className="card-body d-flex flex-column gap-3">
            <label className="text-start" htmlFor="descripcion">Descripción</label>
            <input
              className="form-control bg-dark text-light border-info"
              placeholder="Descripción del caso"
              value={descripcion}
              onChange={(event) => setDescripcion(event.target.value)}
              required
            />
            
            {/* <label className="text-start" htmlFor="estado">Estado</label>
            <input
              className="form-control bg-dark text-light border-info"
              placeholder="Estado"
              value={estado}
              onChange={(event) => setEstado(event.target.value)}
            />  EL ESTADO ES GESTIONADO DESDE EL BACKEND ASI QUE LO SAQUE DEL FORMULARIO*/} 
            
            <label className="text-start" htmlFor="direccion">Dirección</label>
            <input
              className="form-control bg-dark text-light border-info"
              placeholder="Dirección"
              value={direccion}
              onChange={(event) => setDireccion(event.target.value)}
            />

            <label className="text-start" htmlFor="zonaCaso">Zona</label>
            <select
            id="zonaCaso"
            className="form-select bg-dark text-light border-info"
            value={zonaCodZona}
            onChange={(event) => setZonaCodZona(event.target.value)}
            required
            >
  
            <option value="">Elegí una zona</option>
            {zonas.map((zona) => (
            <option key={zona.codZona} value={zona.codZona}>
            {zona.nombre}
            </option>
            ))}
            </select>

            <label className="text-start" htmlFor="fechaInicio">
              Fecha de inicio
            </label>
            <input
              id="fechaInicio"
              type="date"
              className="form-control bg-dark text-light border-info"
              value={fechaInicio}
              onChange={(event) => setFechaInicio(event.target.value)}
            />

            <select
              className="form-select bg-dark text-light border-info"
              value={tipoDelitoId}
              onChange={(event) => setTipoDelitoId(event.target.value)}
              required
            >
              <option value="">Elegí un tipo de delito</option>
              {tipos.map((tipo) => (
                <option key={tipo.codigoTD} value={tipo.codigoTD}>
                  {tipo.descripcion}
                </option>
              ))}
            </select>

            {errorMsg && <div className="text-danger">{errorMsg}</div>}
            {mensaje && <div className="text-success">{mensaje}</div>}
          </div>

          <div className="card-footer d-flex justify-content-center gap-2">
            <button type="submit" className="btn btn-outline-success">
              {idEditando !== null ? "Actualizar caso" : "Crear caso"}
            </button>

            {idEditando !== null && (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={limpiarFormulario}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-hover table-bordered border-info text-center align-middle">
          <thead className="table-active">
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Dirección</th>
              <th>Fecha de inicio</th>
              <th>Tipo de delito</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {casos.map((caso) => (
              <tr key={caso.idCasos}>
                <td>{caso.idCasos}</td>
                <td>{caso.descripcion}</td>
                <td>{caso.estado || "-"}</td>
                <td>{caso.direccion || "-"}</td>
                <td>{caso.fechaInicio || "-"}</td>
                <td>{caso.tipoDelito?.descripcion || "-"}</td>
                <td>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => prepararEdicion(caso)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminarCaso(caso.idCasos)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {casos.length === 0 && (
              <tr>
                <td colSpan="7">No hay casos cargados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}