import { useEffect, useState } from "react";
import Axios from "axios";

const URL_CASOS = "http://localhost:3000/api/casos";

export default function SolicitarCierreCaso({ usuario }) {
  const [casos, setCasos] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [idProcesando, setIdProcesando] = useState(null);

  const authConfig = {
    headers: {
      "x-rol": usuario.rol,
      "x-dni": usuario.dni
    }
  };

  const cargarCasosActivos = async () => {
    const respuesta = await Axios.get(URL_CASOS, authConfig);

    setCasos(
      respuesta.data.filter(
        (caso) =>
          caso.estado === "ACTIVO" &&
          String(caso.codDetective) === String(usuario.dni)
      )
    );
  };

  useEffect(() => {
    const iniciar = async () => {
      try {
        await cargarCasosActivos();
      } catch (error) {
        setErrorMsg(
          error.response?.data?.mensaje ||
          "No se pudieron cargar tus casos activos."
        );
      }
    };

    iniciar();
  }, []);

  const solicitarCierre = async (idCasos) => {
    setErrorMsg("");
    setMensaje("");
    setIdProcesando(idCasos);

    try {
      const respuesta = await Axios.post(
        `${URL_CASOS}/${idCasos}/solicitar-cierre`,
        {},
        authConfig
      );

      setMensaje(respuesta.data.mensaje);
      await cargarCasosActivos();
    } catch (error) {
      setErrorMsg(
        error.response?.data?.mensaje ||
        "No se pudo enviar la solicitud de cierre."
      );
    } finally {
      setIdProcesando(null);
    }
  };

  return (
    <section>
      <h3 className="text-info mb-4">Solicitar cierre de caso</h3>

      {errorMsg && <p className="text-danger">{errorMsg}</p>}
      {mensaje && <p className="text-success">{mensaje}</p>}

      <div className="table-responsive">
        <table className="table table-dark table-hover table-bordered border-info text-center align-middle">
          <thead className="table-active">
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Dirección</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {casos.map((caso) => (
              <tr key={caso.idCasos}>
                <td>{caso.idCasos}</td>
                <td>{caso.descripcion}</td>
                <td>{caso.direccion || "-"}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-warning"
                    disabled={idProcesando === caso.idCasos}
                    onClick={() => solicitarCierre(caso.idCasos)}
                  >
                    {idProcesando === caso.idCasos
                      ? "Enviando..."
                      : "Solicitar cierre"}
                  </button>
                </td>
              </tr>
            ))}

            {casos.length === 0 && (
              <tr>
                <td colSpan="4">No tenés casos activos disponibles para cerrar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}