import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const HomePage = () => {
    const [productos, setProductos] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filtroGlobal, setFiltroGlobal] = useState('');

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/productos');
            setProductos(response.data);
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleProductClick = (producto) => {
        setSelectedProduct(producto);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const handleFiltroGlobalChange = (e) => {
        setFiltroGlobal(e.target.value);
    };

    const productosFiltrados = productos.filter((producto) =>
        producto.nombre_producto.toLowerCase().includes(filtroGlobal.toLowerCase()) ||
        (producto.categoria.nombrecategoria.toLowerCase().includes(filtroGlobal.toLowerCase())) ||
        (producto.proveedor.nombre_proveedor.toLowerCase().includes(filtroGlobal.toLowerCase()))
    );

    return (
        <div className="container">
            <h1>Lista de Productos</h1>

            {/* Filtro Global */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por nombre, categoría o proveedor"
                    value={filtroGlobal}
                    onChange={handleFiltroGlobalChange}
                />
            </div>

            <div className="row">
                {productosFiltrados.map((producto) => (
                    <div key={producto.idproducto} className="col-md-4">
                        <div className="card mb-4" onClick={() => handleProductClick(producto)}>
                            <img
                                src={producto.imagen}
                                className="card-img-top"
                                alt="Imagen del producto"
                                style={{ width: '100%', height: '200px', objectFit: 'contain' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{producto.nombre_producto}</h5>
                                <p className="card-text">Precio: ${producto.precio}</p>
                                <p className="card-text">Existencias: {producto.stock}</p>
                                <button className="btn btn-primary">Agregar al Carrito</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para mostrar información detallada del producto */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedProduct && selectedProduct.nombre_producto}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProduct && (
                        <div>
                            <div className="text-center mb-3">
                                <img src={selectedProduct.imagen} alt="Imagen del producto" className="img-fluid" />
                            </div>
                            <div>
                                <p className="mb-2">
                                    <strong>Precio:</strong> ${selectedProduct.precio}
                                </p>
                                <p className="mb-2">
                                    <strong>Existencias:</strong> {selectedProduct.stock}
                                </p>
                                <p className="mb-2">
                                    <strong>Categoría:</strong> {selectedProduct.categoria ? selectedProduct.categoria.nombrecategoria : 'N/A'}
                                </p>
                                <p className="mb-2">
                                    <strong>Proveedor:</strong> {selectedProduct.proveedor ? selectedProduct.proveedor.nombre_proveedor : 'N/A'}
                                </p>
                                <p className="mb-2">
                                    <strong>Descripción:</strong> {selectedProduct.descripcion || 'N/A'}
                                </p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default HomePage;
