import { useEffect, useState } from "react";
import Axios from "axios";

const URL_CASOS = "http://localhost:3000/api/casos";

export default function RevisionCasos({ usuario }) {
  const [casosPendientes, setCasosPendientes] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [casosListado, setCasosListado] = useState([]);
  const [zonaFiltro, setZonaFiltro] = useState(""); 
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

  const cargarZonas = async () => {
  const respuesta = await Axios.get("http://localhost:3000/api/zonas");
  setZonas(respuesta.data);
};

const cargarListado = async (filtro = zonaFiltro) => {
  const respuesta = await Axios.get(`${URL_CASOS}/listado`, {
    ...authConfig,
    params: filtro ? { zonaId: filtro } : {}
  });

  setCasosListado(respuesta.data);
};

  useEffect(() => {
    const iniciar = async () => {
      try {
        await Promise.all([
        cargarPendientes(),
        cargarZonas(),
        cargarListado("")
      ]);
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
      await cargarListado();
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
              <th>Tipo de solicitud</th>
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
                <td>{caso.estado === "CIERRE_PENDIENTE" ? "Cerrar caso" : "Nuevo caso"}</td>
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
                <td colSpan="7">No hay casos pendientes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <hr className="border-info my-5" />

<h3 className="text-info mb-3">Listado de casos por zona</h3>

<div className="mb-3">
  <label className="form-label" htmlFor="filtroZona">
    Filtrar por zona
  </label>

  <select
    id="filtroZona"
    className="form-select bg-dark text-light border-info"
    value={zonaFiltro}
    onChange={async (event) => {
      const nuevaZona = event.target.value;
      setZonaFiltro(nuevaZona);

      try {
        setErrorMsg("");
        await cargarListado(nuevaZona);
      } catch (error) {
        setErrorMsg(
          error.response?.data?.mensaje ||
          "No se pudo cargar el listado de casos."
        );
      }
    }}
  >
    <option value="">Todas las zonas</option>
    {zonas.map((zona) => (
      <option key={zona.codZona} value={zona.codZona}>
        {zona.nombre}
      </option>
    ))}
  </select>
</div>

<div className="table-responsive">
  <table className="table table-dark table-hover table-bordered border-info text-center align-middle">
    <thead className="table-active">
      <tr>
        <th>ID</th>
        <th>Descripción</th>
        <th>Dirección</th>
        <th>Fecha de inicio</th>
        <th>Tipo de delito</th>
        <th>Zona</th>
        <th>Estado</th>
      </tr>
    </thead>

    <tbody>
      {casosListado.map((caso) => (
        <tr key={caso.idCasos}>
          <td>{caso.idCasos}</td>
          <td>{caso.descripcion}</td>
          <td>{caso.direccion || "-"}</td>
          <td>{caso.fechaInicio || "-"}</td>
          <td>{caso.tipoDelito?.descripcion || "-"}</td>
          <td>{caso.zona?.nombre || "-"}</td>
          <td>{caso.estado || "-"}</td>
        </tr>
      ))}

      {casosListado.length === 0 && (
        <tr>
          <td colSpan="7">No hay casos para la zona seleccionada.</td>
        </tr>
      )}
    </tbody>
  </table>
</div>
    </section>
  );
}