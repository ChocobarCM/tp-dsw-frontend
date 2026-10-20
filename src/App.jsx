import './App.css';

function App() {
  return (
    <div className="layout-dashboard">
      <header className="topbar">
        <h2>SGIC-RO</h2>
        <span>Usuario: L (Detective) | Terminal 04</span>
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
        <h1>Análisis Forense en Curso...</h1>
        <p style={{ marginTop: '20px', color: '#7393b3' }}>
          Sistema L.E.I.S. inicializado. Esperando conexión a la base de datos...
        </p>
      </main>
    </div>
  );
}

export default App;