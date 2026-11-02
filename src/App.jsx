import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import Axios from "axios";
import Login from './login'; // Importamos tu nuevo componente

function App() {
  //Declaramos TODOS los estados primero
  
  //Buscamos en el localStorage al arrancar. Si hay datos, los cargamos; si no, queda en null.
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });
  const [nombre, setNombre] = useState('');
  const [cod, setCod] = useState(0);
  const [editar, setEditar] = useState(false);
  const [listaZonas, setZonas] = useState([]);

  //Función para cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem("usuario"); // Borramos el dato del navegador
    setUsuario(null); // Volvemos el estado a null para que React renderice el Login
  };

  const crearZona = () => {
    Axios.post("http://localhost:3000/api/zonas", {
      nombre: nombre
    }).then(() => {
      getZonas();
      alert("Zona creada");
      cancelarEdit();
    });
  }

  const eliminarZona = (cod) => {
    Axios.delete(`http://localhost:3000/api/zonas/${cod}`).then(() => {
      getZonas();
    });
  }

  const actZona = () => {
    Axios.put(`http://localhost:3000/api/zonas/${cod}`, {
      nombre: nombre
    }).then(() => {
      getZonas();
      cancelarEdit();
    });
  }

  const cancelarEdit = () => {
    setNombre("");
    setEditar(false);
  }

  const editarZona = (val) => {
    setEditar(true);
    setNombre(val.nombre);
    setCod(val.codZona);
  }

  const getZonas = () => {
    Axios.get("http://localhost:3000/api/zonas").then((response) => {
      setZonas(response.data);
    });
  }

  // 2. Solución al bucle infinito: usamos useEffect para cargar las zonas
  // Solo se ejecutará una vez cuando el usuario inicie sesión exitosamente.
  useEffect(() => {
    if (usuario) {
      getZonas();
    }
  }, [usuario]);

  // El Guardia: Si el estado usuario es null, bloqueamos la app y mostramos el Login
  if (!usuario) {
    return <Login setUsuario={setUsuario} />;
  }

  // Render principal (Solo llega acá si el usuario se logueó)
  return (
    <div className="layout-dashboard">
      <header className="topbar d-flex justify-content-between align-items-center p-3">
        <div className="d-flex align-items-center gap-3">
          <h2 className="m-0">SGIC-RO</h2>
          <span>Usuario: {usuario.nombre} ({usuario.rol}) | Terminal 04</span>
        </div>
        {/* 3. Agregamos el botón de Cerrar Sesión en la esquina derecha del header */}
        <button className="btn btn-outline-light btn-sm" onClick={cerrarSesion}>
          Cerrar Sesión
        </button>
      </header>
      <aside className="sidebar">
        <nav>
          <button className="btn-menu">Casos Activos</button>
          <button className="btn-menu">Zonas de Rosario</button>
          <button className="btn-menu">Tipos de Delito</button>
          <button className="btn-menu">Criminales</button>
        </nav>
      </aside>
      <main className="contenido">
        <div className="card text-center">
          <div className="card-header">
            Gestion de zonas
          </div>
          <div className="card-body">
            <div className="input-group">
              <span className="input-group-text" id="basic-addon1">Nombre</span>
              <input onChange={(event) => { setNombre(event.target.value) }} value={nombre} type="text" className="form-control" placeholder="Ingresar nombre" aria-label="Username" aria-describedby="basic-addon1" />
            </div>
          </div>
          <div className="card-footer fg-2">
            {
              editar ?
                <div>
                  <button onClick={actZona} type="button" className="btn btn-success m-2">Actualizar</button>
                  <button onClick={cancelarEdit} type="button" className="btn btn-danger m-2">Cancelar</button>
                </div>
                : <button onClick={crearZona} type="button" className="btn btn-success">Crear</button>
            }
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Cod</th>
              <th scope="col">Nombre</th>
              <th scope="col">Accion</th>
            </tr>
          </thead>
          <tbody>
            {
              listaZonas.map((val, key) => {
                return <tr key={val.codZona}>
                  <th scope="row">{val.codZona}</th>
                  <td>{val.nombre}</td>
                  <td>
                    {/* Corregí 'class' por 'className' para evitar advertencias de React */}
                    <div className="btn-group" role="group" aria-label="Basic example">
                      <button onClick={() => { editarZona(val) }} type="button" className="btn btn-primary">Editar</button>
                      <button onClick={() => { eliminarZona(val.codZona) }} type="button" className="btn btn-danger">Eliminar</button>
                    </div>
                  </td>
                </tr>
              })
            }
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default App;