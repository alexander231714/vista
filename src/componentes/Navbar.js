import { Link } from 'react-router-dom';
function Navbar() {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">


        <Link className="navbar-brand" to="HomePage">Inicio</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/Categorias">Categorias</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Proveedores">Proveedores</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Producto">Producto</Link>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;