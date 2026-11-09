import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Login from './login';
import Zonas from './Zonas';
import Oficiales from './Oficiales';
import TipoDelitos from './TipoDelitos.jsx' ; 
import Casos from './Casos.jsx';
import RevisionCasos from './RevisionCasos.jsx';
import Evidencias from './Evidencias.jsx';
import ListadoDetectives from './ListadoDetectives.jsx';
import SolicitarAllanamiento from './SolicitarAllanamiento.jsx';
import RevisionAllanamientos from './RevisionAllanamientos.jsx';
import SolicitarCierreCaso from './SolicitarCierreCaso.jsx';

function App() {
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    //COMENTADO PARA NO GUARDAR EL TOKEN
    //localStorage.removeItem("token");
    setUsuario(null);
  };

  if (!usuario) {
    return <Login setUsuario={setUsuario} />;
  }

  return (
    <BrowserRouter>
      <div className="layout-dashboard">
        <header className="topbar d-flex justify-content-between align-items-center p-3">
          <div className="d-flex align-items-center gap-3">
            <h2 className="m-0 text-info">SGIC-RO</h2>
            <span>Usuario: {usuario.nombre} ({usuario.rol}) | Terminal 04</span>
          </div>
          <button className="btn btn-outline-info btn-sm" onClick={cerrarSesion}>Cerrar Sesión</button>
        </header>
        
        <aside className="sidebar">
          <nav>
            {/* Menú según el rol del usuario */}
            {usuario.rol === 'ADMIN' && (
              <>
                <Link to="/zonas" className="btn-menu text-decoration-none">Gestión de Zonas</Link>
                <Link to="/delitos" className="btn-menu text-decoration-none">Tipos de Delito</Link>
                <Link to="/oficiales" className="btn-menu text-decoration-none">Oficiales</Link>
                <Link to="/revision-casos" className="btn-menu text-decoration-none">Revisar casos</Link>
                <Link to="/listado-oficiales" className="btn-menu text-decoration-none">Listado de Detectives</Link>
              </>
            )}
            {usuario.rol === 'DETECTIVE' && (
              <>
              <Link to="/casos" className="btn-menu text-decoration-none">Gestión de Casos</Link>
              <Link to="/evidencias" className="btn-menu text-decoration-none">Carga de evidencias</Link>
              <Link to="/solicitar-allanamiento" className="btn-menu text-decoration-none">Solicitar Allanamiento</Link>
              <Link to="/solicitar-cierre-caso" className="btn-menu text-decoration-none">Solicitar Cierre de Caso</Link>
              </>
            )}
            
            {usuario.rol === 'FISCAL' && (
              <Link to="/revision-allanamientos" className="btn-menu text-decoration-none">Revisar Allanamientos</Link>
            )}

            {usuario.rol === 'FORENSE' && (
              <span className="btn-menu text-decoration-none text-warning">Laboratorio Forense</span>
            )}
          </nav>
        </aside>

        <main className="contenido">
          {usuario.rol === 'FORENSE' ? (
            <section className="d-flex flex-column align-items-center justify-content-center" style={{ height: '70vh' }}>
              <h2 className="text-info mb-4">Módulo de Análisis Forense</h2>
              <div className="card bg-dark border-warning text-center p-5" style={{ maxWidth: '500px' }}>
                <h1 className="display-1 text-warning mb-3">🚧</h1>
                <h4 className="text-light">Pantalla en Construcción</h4>
                <p className="text-muted mt-2">
                  El módulo de carga de reportes forenses y análisis de pruebas materiales se encuentra actualmente en desarrollo.
                </p>
              </div>
            </section>
          ) : (
            <Routes>
              {/* Rutas protegidas por rol */}
              <Route path="/zonas" element={usuario.rol === 'ADMIN' ? <Zonas usuario={usuario}/> : <Navigate to="/" />} />
              <Route path="/delitos" element={usuario.rol === 'ADMIN' ? <TipoDelitos /> : <Navigate to="/" />} />
              <Route path="/oficiales" element={usuario.rol === 'ADMIN' ? <Oficiales /> : <Navigate to="/" />} />
              <Route path="/casos" element={usuario.rol === 'DETECTIVE' ? <Casos usuario={usuario}/>: <Navigate to="/" />}/>
              <Route path="/revision-casos" element={usuario.rol === 'ADMIN' ? <RevisionCasos usuario={usuario}/> : <Navigate to="/" />} />
              <Route path="/evidencias" element={usuario.rol === 'DETECTIVE' ? <Evidencias usuario={usuario} /> : <Navigate to="/" />} />
              <Route path="/listado-oficiales" element={usuario.rol === 'ADMIN' ? <ListadoDetectives usuario={usuario} /> : <Navigate to="/" />} />  
              <Route path="/solicitar-allanamiento" element={usuario.rol === 'DETECTIVE'? <SolicitarAllanamiento usuario={usuario} />: <Navigate to="/" />}/>
              <Route path="/revision-allanamientos" element={usuario.rol === 'FISCAL'? <RevisionAllanamientos usuario={usuario} />: <Navigate to="/" />}/> 
              <Route path="/solicitar-cierre-caso" element={usuario.rol === 'DETECTIVE'? <SolicitarCierreCaso usuario={usuario} />: <Navigate to="/" />}/>   
            </Routes>
          )}
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
