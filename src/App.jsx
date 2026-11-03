import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Login from './login';
import Zonas from './Zonas';
import Oficiales from './Oficiales';
import TipoDelitos from './TipoDelitos.jsx' ; 

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
              </>
            )}
            {usuario.rol === 'DETECTIVE' && (
              <Link to="/mis-casos" className="btn-menu text-decoration-none">Mis Investigaciones</Link>
            )}
            {usuario.rol === 'FISCAL' && (
              <Link to="/bandeja-ordenes" className="btn-menu text-decoration-none">Bandeja de Órdenes</Link>
            )}
          </nav>
        </aside>

        <main className="contenido">
          <Routes>
            {/* Rutas protegidas por rol */}
            <Route path="/zonas" element={usuario.rol === 'ADMIN' ? <Zonas usuario={usuario}/> : <Navigate to="/" />} />
            <Route path="/delitos" element={usuario.rol === 'ADMIN' ? <TipoDelitos /> : <Navigate to="/" />} />
            <Route path="/oficiales" element={usuario.rol === 'ADMIN' ? <Oficiales /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;