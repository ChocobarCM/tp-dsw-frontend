import { useEffect, useState } from "react";
import Axios from "axios";

const URL_CASOS = "http://localhost:3000/api/casos";

export default function RevisionCasos({ usuario }) {
  const [casosPendientes, setCasosPendientes] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [idProcesando, setIdProcesando] = useState(null);

  const authConfig = {
    headers: { "x-rol": usuario.rol }
  };

  const cargarPendientes = async () => {
    const respuesta = await Axios.get(
      `${URL_CASOS}/pendientes`,
      authConfig
    );
    setCasosPendientes(respuesta.data);
  };

  useEffect(() => {
    const iniciar = async () => {
      try {
        await cargarPendientes();
      } catch (error) {
        setErrorMsg(
          error.response?.data?.mensaje ||
          "No se pudieron cargar los casos pendientes."
        );
      }
    };

    iniciar();
  }, []);

  const resolverCaso = async (idCasos, decision) => {
    setErrorMsg("");
    setMensaje("");
    setIdProcesando(idCasos);

    try {
      const respuesta = await Axios.put(
        `${URL_CASOS}/${idCasos}/resolucion`,
        { decision },
        authConfig
      );

      setMensaje(respuesta.data.mensaje);
      await cargarPendientes();
    } catch (error) {
      setErrorMsg(
        error.response?.data?.mensaje ||
        "No se pudo resolver el caso."
      );
    } finally {
      setIdProcesando(null);
    }
  };

  return (
    <section>
      <h3 className="text-info mb-4">Casos pendientes de revisión</h3>

      {errorMsg && <p className="text-danger">{errorMsg}</p>}
      {mensaje && <p className="text-success">{mensaje}</p>}

      <div className="table-responsive">
        <table className="table table-dark table-hover table-bordered border-info text-center align-middle">
          <thead className="table-active">
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Dirección</th>
              <th>Fecha de inicio</th>
              <th>Tipo de delito</th>
              <th>Decisión</th>
            </tr>
          </thead>

          <tbody>
            {casosPendientes.map((caso) => (
              <tr key={caso.idCasos}>
                <td>{caso.idCasos}</td>
                <td>{caso.descripcion}</td>
                <td>{caso.direccion || "-"}</td>
                <td>{caso.fechaInicio || "-"}</td>
                <td>{caso.tipoDelito?.descripcion || "-"}</td>
                <td>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success"
                      disabled={idProcesando === caso.idCasos}
                      onClick={() => resolverCaso(caso.idCasos, "ACEPTAR")}
                    >
                      Aceptar
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      disabled={idProcesando === caso.idCasos}
                      onClick={() => resolverCaso(caso.idCasos, "RECHAZAR")}
                    >
                      Rechazar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {casosPendientes.length === 0 && (
              <tr>
                <td colSpan="6">No hay casos pendientes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}