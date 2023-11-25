import React from 'react';
import './App.css';
import Categorias from './componentes/Categorias';
import Proveedores from './componentes/Proveedores';
import Producto from './componentes/Producto';
import Navbar from './componentes/Navbar';
import HomePage from './componentes/HomePage';

import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
    <Navbar />
    <Routes>
      <Route path="/Categorias" element={<Categorias />} />
      <Route path="/Proveedores" element={<Proveedores />} />
      <Route path="/Producto" element={<Producto />} />
      <Route path="/HomePage" element={<HomePage/>} />
    </Routes>
  </Router>
  );
}

export default App;
