import { useEffect, useState } from "react";
import Axios from "axios";

const URL_PRUEBAS = "http://localhost:3000/api/pruebas";
const URL_CASOS_ACTIVOS = `${URL_PRUEBAS}/casos-activos`;

export default function Evidencias({ usuario }) {
  const [evidencias, setEvidencias] = useState([]);
  const [casosActivos, setCasosActivos] = useState([]);
  const [idEditando, setIdEditando] = useState(null);

  const [descripcion, setDescripcion] = useState("");
  const [resultado, setResultado] = useState("");
  const [casoIdCasos, setCasoIdCasos] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [mensaje, setMensaje] = useState("");

  const authConfig = {
    headers: { "x-rol": usuario.rol }
  };

  const cargarEvidencias = async () => {
    const respuesta = await Axios.get(URL_PRUEBAS, authConfig);
    setEvidencias(respuesta.data);
  };

  const cargarCasosActivos = async () => {
    const respuesta = await Axios.get(URL_CASOS_ACTIVOS, authConfig);
    setCasosActivos(respuesta.data);
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        await Promise.all([cargarEvidencias(), cargarCasosActivos()]);
      } catch (error) {
        setErrorMsg(
          error.response?.data?.mensaje ||
          "No se pudieron cargar las evidencias o los casos activos."
        );
      }
    };

    cargarDatos();
  }, []);

  const limpiarFormulario = () => {
    setIdEditando(null);
    setDescripcion("");
    setResultado("");
    setCasoIdCasos("");
  };

  const guardarEvidencia = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setMensaje("");

    try {
      if (idEditando !== null) {
        // La edición actualiza descripción y resultado; mantiene el caso asociado.
        await Axios.put(
          `${URL_PRUEBAS}/${idEditando}`,
          { descripcion, resultado: resultado || null },
          authConfig
        );
        setMensaje("Evidencia actualizada.");
      } else {
        await Axios.post(
          URL_PRUEBAS,
          {
            descripcion,
            resultado: resultado || null,
            casoIdCasos: Number(casoIdCasos)
          },
          authConfig
        );
        setMensaje("Evidencia cargada.");
      }

      await cargarEvidencias();
      limpiarFormulario();
    } catch (error) {
      setErrorMsg(
        error.response?.data?.mensaje ||
        "No se pudo guardar la evidencia."
      );
    }
  };

  const prepararEdicion = (evidencia) => {
    setIdEditando(evidencia.idpruebas);
    setDescripcion(evidencia.descripcion || "");
    setResultado(evidencia.resultado || "");
    setErrorMsg("");
    setMensaje("");
  };

  const eliminarEvidencia = async (id) => {
    setErrorMsg("");
    setMensaje("");

    try {
      await Axios.delete(`${URL_PRUEBAS}/${id}`, authConfig);
      await cargarEvidencias();
      setMensaje("Evidencia eliminada.");
    } catch (error) {
      setErrorMsg(
        error.response?.data?.mensaje ||
        "No se pudo eliminar la evidencia."
      );
    }
  };

  return (
    <>
      <div className="card bg-transparent border-info text-light text-center mb-4">
        <div className="card-header border-info text-uppercase">
          Carga de evidencias
        </div>

        <form onSubmit={guardarEvidencia}>
          <div className="card-body d-flex flex-column gap-3">
            <label className="text-start" htmlFor="descripcionEvidencia">
              Descripción de la evidencia
            </label>
            <input
              id="descripcionEvidencia"
              className="form-control bg-dark text-light border-info"
              placeholder="Describí la evidencia"
              value={descripcion}
              onChange={(event) => setDescripcion(event.target.value)}
              required
            />

            <label className="text-start" htmlFor="resultadoEvidencia">
              Resultado
            </label>
            <input
              id="resultadoEvidencia"
              className="form-control bg-dark text-light border-info"
              placeholder="Resultado (opcional)"
              value={resultado}
              onChange={(event) => setResultado(event.target.value)}
            />

            {idEditando === null && (
              <>
                <label className="text-start" htmlFor="casoEvidencia">
                  Caso activo asociado
                </label>
                <select
                  id="casoEvidencia"
                  className="form-select bg-dark text-light border-info"
                  value={casoIdCasos}
                  onChange={(event) => setCasoIdCasos(event.target.value)}
                  required
                >
                  <option value="">Elegí un caso activo</option>
                  {casosActivos.map((caso) => (
                    <option key={caso.idCasos} value={caso.idCasos}>
                      Caso #{caso.idCasos} — {caso.descripcion}
                    </option>
                  ))}
                </select>
              </>
            )}

            {errorMsg && <div className="text-danger">{errorMsg}</div>}
            {mensaje && <div className="text-success">{mensaje}</div>}
          </div>

          <div className="card-footer d-flex justify-content-center gap-2">
            <button type="submit" className="btn btn-outline-success">
              {idEditando !== null ? "Actualizar evidencia" : "Cargar evidencia"}
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
              <th>Evidencia</th>
              <th>Resultado</th>
              <th>Caso asociado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {evidencias.map((evidencia) => {
              const casoAsociado =
                evidencia.caso ||
                evidencia.casos;

              return (
                <tr key={evidencia.idpruebas}>
                  <td>{evidencia.idpruebas}</td>
                  <td>{evidencia.descripcion}</td>
                  <td>{evidencia.resultado || "-"}</td>
                  <td>
                    {casoAsociado?.descripcion ||
                      (evidencia.casoIdCasos
                        ? `Caso #${evidencia.casoIdCasos}`
                        : "-")}
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => prepararEdicion(evidencia)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarEvidencia(evidencia.idpruebas)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {evidencias.length === 0 && (
              <tr>
                <td colSpan="5">No hay evidencias cargadas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}