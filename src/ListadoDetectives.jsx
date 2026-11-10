import { useEffect, useState } from "react";
import Axios from "axios";

// URL de tu backend
const URL_USUARIOS = "http://localhost:3000/api/detectives";

// ¡ESTA ES LA LÍNEA CLAVE QUE TE FALTABA!
export default function ListadoDetectives({ usuario }) {
  const [detectives, setDetectives] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [cargando, setCargando] = useState(true);

  const authConfig = {
    headers: { "x-rol": usuario?.rol || "ADMIN" } 
  };

  const cargarDetectives = async () => {
    try {
      setCargando(true);
      setErrorMsg("");
      const respuesta = await Axios.get(URL_USUARIOS, authConfig);
      setDetectives(respuesta.data);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.error || 
        "No se pudo cargar el listado de detectives."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDetectives();
  }, []);

  return (
    <section>
      <h3 className="text-info mb-4">Listado de Detectives</h3>

      {errorMsg && <p className="text-danger">{errorMsg}</p>}

      {cargando ? (
        <p className="text-light">Cargando detectives...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover table-bordered border-info text-center align-middle">
            <thead className="table-active">
              <tr>
                <th>DNI</th>
                <th>Nombre Completo</th>
                <th>Estado</th>
                <th>Caso Actual / Asignación</th>
              </tr>
            </thead>
            
            <tbody>
              {detectives.map((detective) => (
                <tr key={detective.dni}>
                  <td>{detective.dni}</td>
                  <td>{`${detective.nombre} ${detective.apellido}`}</td>
                  
                  {/* Etiqueta de Estado leyendo el ENUM exacto */}
                  <td>
                    <span
                      className={`badge ${
                        detective.estado === 'disponible' ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {detective.estado === 'disponible' ? "DISPONIBLE" : "OCUPADO"}
                    </span>
                  </td>

                  {/* Detalle del Caso usando 'descripcion' */}
                  <td>
                    {detective.casoActual ? (
                      <span className="text-warning">
                        Caso #{detective.casoActual.id}:{" "}
                        {detective.casoActual.descripcion}
                      </span>
                    ) : (
                      <span className="text-muted">Sin caso asignado</span>
                    )}
                  </td>
                </tr>
              ))}

              {detectives.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">
                    No hay detectives registrados en la base de datos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

