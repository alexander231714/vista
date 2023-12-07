import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";

const apiUrl = "http://127.0.0.1:8000/api/productos/";

class Producto extends Component {
  state = {
    productos: [],
    modalInsertar: false,
    modalEditar: false,
    modalEliminar: false,
    productoSeleccionado: null,
    form: {
      idproducto: '',
      idcategoria: '',
      idproveedor: '',
      nombre_producto: '',
      precio: '',
      stock: '',
      descripcion: '',
      imagen: '',
    },
  };

  componentDidMount() {
    this.fetchProductos();
  }

  fetchProductos = () => {
    axios.get(apiUrl)
      .then(response => {
        this.setState({ productos: response.data });
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  handleInputChange = e => {
    e.persist();
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        [e.target.name]: e.target.value,
      },
    }));
  }

  modalInsertarToggle = () => {
    this.setState(prevState => ({
      modalInsertar: !prevState.modalInsertar,
      form: {
        idproducto: '',
        idcategoria: '',
        idproveedor: '',
        nombre_producto: '',
        precio: '',
        stock: '',
        descripcion: '',
        imagen: '',
      },
    }));
  }

  modalEditarToggle = () => {
    this.setState(prevState => ({ modalEditar: !prevState.modalEditar }));
  }

  modalEliminarToggle = () => {
    this.setState(prevState => ({ modalEliminar: !prevState.modalEliminar }));
  }

  seleccionarProductoParaEditar = producto => {
    this.setState({
      form: {
        idproducto: producto.idproducto,
        idcategoria: producto.idcategoria,
        idproveedor: producto.idproveedor,
        nombre_producto: producto.nombre_producto,
        precio: producto.precio,
        stock: producto.stock,
        descripcion: producto.descripcion,
        imagen: producto.imagen,
      },
      productoSeleccionado: producto,
    });
    this.modalEditarToggle();
  }

  guardarEdicion = () => {
    const { idproducto, ...restForm } = this.state.form;
    axios.put(apiUrl + this.state.productoSeleccionado.idproducto, restForm)
      .then(response => {
        this.modalEditarToggle();
        this.fetchProductos();
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  peticionEliminar = () => {
    axios.delete(apiUrl + this.state.productoSeleccionado.idproducto)
      .then(response => {
        this.fetchProductos();
        this.modalEliminarToggle();
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  peticionPost = () => {
    axios.post(apiUrl, this.state.form)
      .then(response => {
        this.modalInsertarToggle();
        this.fetchProductos();
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  render() {
    const { productos, form, productoSeleccionado } = this.state;

    return (
      <div className="container mt-4">
        <h4>Gestión de Productos</h4>
        <button className="btn btn-success mb-3" onClick={() => this.modalInsertarToggle()}>
          Agregar Producto
        </button>

        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Categoría</th>
              <th>Proveedor</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Descripción</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.idproducto}>
                <td>{producto.idproducto}</td>
                <td>{producto.categoria ? producto.categoria.nombrecategoria : ''}</td>
                <td>{producto.proveedor ? producto.proveedor.nombre_proveedor : ''}</td>
                <td>{producto.nombre_producto}</td>
                <td>{producto.precio}</td>
                <td>{producto.stock}</td>
                <td>{producto.descripcion}</td>
                <td>
                  <img
                    src={producto.imagen}
                    alt="Imagen del producto"
                    className="img-thumbnail"
                    style={{ width: '100px', height: '100px' }}
                  />
                </td>
                <td>
                  <button className="btn btn-primary" onClick={() => this.seleccionarProductoParaEditar(producto)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>{" "}
                  <button className="btn btn-danger" onClick={() => { this.setState({ productoSeleccionado: producto }); this.modalEliminarToggle(); }}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal isOpen={this.state.modalEditar}>
          <ModalHeader>
            Editar Producto
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>ID:</label>
              <input className="form-control" type="text" name="idproducto" readOnly value={productoSeleccionado ? productoSeleccionado.idproducto : ''} />
              <br />
              <label>ID Categoría:</label>
              <input className="form-control" type="text" name="idcategoria" onChange={this.handleInputChange} value={form.idcategoria} />
              <br />
              <label>ID Proveedor:</label>
              <input className="form-control" type="text" name="idproveedor" onChange={this.handleInputChange} value={form.idproveedor} />
              <br />
              <label>Nombre del Producto:</label>
              <input className="form-control" type="text" name="nombre_producto" onChange={this.handleInputChange} value={form.nombre_producto} />
              <br />
              <label>Precio:</label>
              <input className="form-control" type="text" name="precio" onChange={this.handleInputChange} value={form.precio} />
              <br />
              <label>Stock:</label>
              <input className="form-control" type="text" name="stock" onChange={this.handleInputChange} value={form.stock} />
              <br />
              <label>Descripción:</label>
              <input className="form-control" type="text" name="descripcion" onChange={this.handleInputChange} value={form.descripcion} />
              <br />
              <label>Imagen:</label>
              <input className="form-control" type="text" name="imagen" onChange={this.handleInputChange} value={form.imagen} />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-success" onClick={() => this.guardarEdicion()}>Guardar</button>
            <button className="btn btn-danger" onClick={() => this.modalEditarToggle()}>Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            Agregar Nuevo Producto
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>ID:</label>
              <input className="form-control" type="text" name="idproducto" readOnly onChange={this.handleInputChange} value={form ? form.idproducto : ''} />
              <br />
              <label>ID Categoría:</label>
              <input className="form-control" type="text" name="idcategoria" onChange={this.handleInputChange} value={form.idcategoria} />
              <br />
              <label>ID Proveedor:</label>
              <input className="form-control" type="text" name="idproveedor" onChange={this.handleInputChange} value={form.idproveedor} />
              <br />
              <label>Nombre del Producto:</label>
              <input className="form-control" type="text" name="nombre_producto" onChange={this.handleInputChange} value={form.nombre_producto} />
              <br />
              <label>Precio:</label>
              <input className="form-control" type="text" name="precio" onChange={this.handleInputChange} value={form.precio} />
              <br />
              <label>Stock:</label>
              <input className="form-control" type="text" name="stock" onChange={this.handleInputChange} value={form.stock} />
              <br />
              <label>Descripción:</label>
              <input className="form-control" type="text" name="descripcion" onChange={this.handleInputChange} value={form.descripcion} />
              <br />
              <label>Imagen:</label>
              <input className="form-control" type="text" name="imagen" onChange={this.handleInputChange} value={form.imagen} />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-success" onClick={() => this.peticionPost()}>
              Insertar
            </button>
            <button className="btn btn-danger" onClick={() => this.modalInsertarToggle()}>Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            ¿Estás seguro de que deseas eliminar el producto?
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.peticionEliminar()}>Sí</button>
            <button className="btn btn-secondary" onClick={() => this.modalEliminarToggle()}>No</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Producto;
