import { useEffect, useState } from "react";
import Axios from "axios";

const URL_CASOS = "http://localhost:3000/api/casos";
const URL_SOLICITUDES = "http://localhost:3000/api/ordenes";

export default function SolicitarAllanamiento({ usuario }) {
  const [casos, setCasos] = useState([]);
  const [casoIdCasos, setCasoIdCasos] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [allanamientos, setAllanamientos] = useState([]);

  const authConfig = {
    headers: { "x-rol": usuario.rol }
  };


  const cargarAllanamientos = async () => {
  const respuesta = await Axios.get(
    `${URL_SOLICITUDES}/allanamientos`,
    authConfig
  );
  setAllanamientos(respuesta.data);
};


  useEffect(() => {
  const cargar = async () => {
    try {
      await cargarAllanamientos();
    } catch (error) {
      setErrorMsg(
        error.response?.data?.mensaje ||
        "No se pudo cargar el historial de allanamientos."
      );
    }
  };

  cargar();
  }, []);

  useEffect(() => {
    const cargarCasos = async () => {
      try {
        const respuesta = await Axios.get(URL_CASOS, authConfig);
        setCasos(
          respuesta.data.filter((caso) =>
            ["ACTIVO", "ABIERTO"].includes(caso.estado)
          )
        );
      } catch (error) {
        setErrorMsg(
          error.response?.data?.mensaje ||
          "No se pudieron cargar los casos."
        );
      }
    };

    cargarCasos();
  }, []);

  

  const solicitarAllanamiento = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setMensaje("");

    try {
      const respuesta = await Axios.post(
        `${URL_SOLICITUDES}/solicitar-allanamiento`,
        { casoIdCasos: Number(casoIdCasos), descripcion },
        authConfig
      );

    setMensaje(respuesta.data.mensaje);
    await cargarAllanamientos();

      setCasoIdCasos("");
      setDescripcion("");
    } catch (error) {
      setErrorMsg(
        error.response?.data?.mensaje ||
        "No se pudo enviar la solicitud."
      );
    }
  };

  return (
    <div className="card bg-transparent border-info text-light">
      <div className="card-header border-info text-uppercase">
        Solicitar allanamiento
      </div>

      <form onSubmit={solicitarAllanamiento}>
        <div className="card-body d-flex flex-column gap-3">
          <label htmlFor="casoAllanamiento">Caso asociado</label>
          <select
            id="casoAllanamiento"
            className="form-select bg-dark text-light border-info"
            value={casoIdCasos}
            onChange={(event) => setCasoIdCasos(event.target.value)}
            required
          >
            <option value="">Elegí un caso activo o abierto</option>
            {casos.map((caso) => (
              <option key={caso.idCasos} value={caso.idCasos}>
                Caso #{caso.idCasos} — {caso.descripcion}
              </option>
            ))}
          </select>

          <label htmlFor="descripcionAllanamiento">
            Motivo de la solicitud
          </label>
          <textarea
            id="descripcionAllanamiento"
            className="form-control bg-dark text-light border-info"
            placeholder="Describí el motivo del allanamiento"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            required
          />

          {casos.length === 0 && (
            <p className="text-warning mb-0">
              No hay casos activos o abiertos disponibles.
            </p>
          )}
          {errorMsg && <div className="text-danger">{errorMsg}</div>}
          {mensaje && <div className="text-success">{mensaje}</div>}
          <hr className="border-info" />

    <h3 className="text-info mb-3">Registro de allanamientos</h3>

    <div className="table-responsive">
    <table className="table table-dark table-hover table-bordered border-info text-center align-middle">
    <thead className="table-active">
      <tr>
        <th>Número de Registro Legal</th>
        <th>Caso asociado</th>
        {/*<th>Detective</th> POR AHORA NO SE MUESTRA EL DETECTIVE EN EL HISTORIAL DE ALLANAMIENTOS*/}
        <th>Motivo</th>
        <th>Fecha</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      {allanamientos.map((solicitud) => (
        <tr key={solicitud.idOrden}>
          <td>#{solicitud.idOrden}</td>
          <td>
            {solicitud.caso
              ? `Caso #${solicitud.caso.idCasos} — ${solicitud.caso.descripcion}`
              : `Caso #${solicitud.casoIdCasos}`}
          </td>

          {/* <td>
            {solicitud.caso?.detective
            ? `${solicitud.caso.detective.nombre} ${solicitud.caso.detective.apellido}`: "-"}
          </td> POR AHORA NO SE MUESTRA EL DETECTIVE EN EL HISTORIAL DE ALLANAMIENTOS*/}

          <td>{solicitud.descripcion}</td>
          <td>
            {solicitud.fechaSolicitud
              ? new Date(solicitud.fechaSolicitud).toLocaleString()
              : "-"}
          </td>

          <td>{solicitud.estadoOrden}</td>
        </tr>
      ))}

      {allanamientos.length === 0 && (
        <tr>
          <td colSpan="5">Todavía no hay allanamientos registrados.</td>
        </tr>
      )}
    </tbody>
    </table>
    </div>
        </div>

        <div className="card-footer text-center">
          <button
            type="submit"
            className="btn btn-outline-success"
            disabled={casos.length === 0}
          >
            Enviar solicitud a Fiscalía
          </button>
        </div>
      </form>
    </div>
  );
}