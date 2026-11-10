import { useEffect, useState } from "react";
import Axios from "axios";

const URL_SOLICITUDES = "http://localhost:3000/api/ordenes";

export default function RevisionAllanamientos({ usuario }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [idProcesando, setIdProcesando] = useState(null);
  const [historial, setHistorial] = useState([]);

  const authConfig = {
    headers: { "x-rol": usuario.rol }
  };

  const cargarSolicitudes = async () => {
    const respuesta = await Axios.get(
      `${URL_SOLICITUDES}/pendientes-allanamiento`,
      authConfig
    );
    setSolicitudes(respuesta.data);
  };

  const cargarHistorial = async () => {
  const respuesta = await Axios.get(
    `${URL_SOLICITUDES}/allanamientos`,
    authConfig
  );
  setHistorial(respuesta.data);
  };

  useEffect(() => {
    const iniciar = async () => {
      try {
        await Promise.all([cargarSolicitudes(), cargarHistorial()]);
      } catch (error) {
        setErrorMsg(
          error.response?.data?.mensaje ||
          "No se pudieron cargar las solicitudes."
        );
      }
    };

    iniciar();
  }, []);

  const evaluarSolicitud = async (idOrden, decision) => {
    setErrorMsg("");
    setMensaje("");
    setIdProcesando(idOrden);

    try {
      const respuesta = await Axios.put(
        `${URL_SOLICITUDES}/${idOrden}/evaluar-allanamiento`,
        { decision },
        authConfig
      );

      setMensaje(respuesta.data.mensaje);
      await Promise.all([cargarSolicitudes(), cargarHistorial()]);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.mensaje ||
        "No se pudo evaluar la solicitud."
      );
    } finally {
      setIdProcesando(null);
    }
  };

  return (
    <section>
      <h3 className="text-info mb-4">Solicitudes de allanamiento pendientes</h3>

      {errorMsg && <p className="text-danger">{errorMsg}</p>}
      {mensaje && <p className="text-success">{mensaje}</p>}

      <div className="table-responsive">
        <table className="table table-dark table-hover table-bordered border-info text-center align-middle">
          <thead className="table-active">
            <tr>
              <th>Solicitud</th>
              <th>Caso</th>
              <th>Dirección del caso</th>
              <th>Motivo</th>
              <th>Fecha</th>
              <th>Decisión</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((solicitud) => (
              <tr key={solicitud.idOrden}>
                <td>#{solicitud.idOrden}</td>
                <td>
                  {solicitud.caso
                    ? `Caso #${solicitud.caso.idCasos} — ${solicitud.caso.descripcion}`
                    : `Caso #${solicitud.casoIdCasos}`}
                </td>
                <td>{solicitud.caso?.direccion || "-"}</td>
                <td>{solicitud.descripcion}</td>
                <td>
                  {solicitud.fechaSolicitud
                    ? new Date(solicitud.fechaSolicitud).toLocaleString()
                    : "-"}
                </td>
                <td>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success"
                      disabled={idProcesando === solicitud.idOrden}
                      onClick={() =>
                        evaluarSolicitud(solicitud.idOrden, "ACEPTAR")
                      }
                    >
                      Aceptar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      disabled={idProcesando === solicitud.idOrden}
                      onClick={() =>
                        evaluarSolicitud(solicitud.idOrden, "RECHAZAR")
                      }
                    >
                      Rechazar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {solicitudes.length === 0 && (
              <tr>
                <td colSpan="6">No hay solicitudes pendientes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    <hr className="border-info my-5" />
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
      {historial.map((solicitud) => (
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

      {historial.length === 0 && (
        <tr>
          <td colSpan="5">Todavía no hay allanamientos registrados.</td>
        </tr>
      )}
    </tbody>
    </table>
    </div>
    </section>
    );
} 