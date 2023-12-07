import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';


const apiUrl = "http://127.0.0.1:8000/api/proveedores/";

class Proveedores extends Component {
  state = {
    proveedores: [],
    modalInsertar: false,
    modalEditar: false,
    modalEliminar: false,
    proveedorSeleccionado: null,
    form: {
      idproveedor: '',
      nombre_proveedor: '',
      telefono: '',
      direccion: '',
    },
  };

  componentDidMount() {
    this.fetchProveedores();
  }

  fetchProveedores = () => {
    axios.get(apiUrl)
      .then(response => {
        this.setState({ proveedores: response.data });
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
      form: { idproveedor: '', nombre_proveedor: '', telefono: '', direccion: '' },
    }));
  }

  modalEditarToggle = () => {
    this.setState(prevState => ({ modalEditar: !prevState.modalEditar }));
  }

  modalEliminarToggle = () => {
    this.setState(prevState => ({ modalEliminar: !prevState.modalEliminar }));
  }

  seleccionarProveedorParaEditar = proveedor => {
    this.setState({
      form: {
        idproveedor: proveedor.idproveedor,
        nombre_proveedor: proveedor.nombre_proveedor,
        telefono: proveedor.telefono,
        direccion: proveedor.direccion,
      },
      proveedorSeleccionado: proveedor,
    });
    this.modalEditarToggle();
  }

  guardarEdicion = () => {
    axios.put(apiUrl + this.state.proveedorSeleccionado.idproveedor, this.state.form)
      .then(response => {
        this.modalEditarToggle();
        this.fetchProveedores();
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  peticionEliminar = () => {
    axios.delete(apiUrl + this.state.proveedorSeleccionado.idproveedor)
      .then(response => {
        this.modalEliminarToggle();
        this.fetchProveedores();
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  peticionPost = () => {
    axios.post(apiUrl, this.state.form)
      .then(response => {
        this.modalInsertarToggle();
        this.fetchProveedores();
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  render() {
    const { proveedores, form, proveedorSeleccionado } = this.state;

    return (

      <div className="container mt-4">
        <h4>Gestión de Proveedores</h4>
        <button className="btn btn-success mb-3" onClick={() => this.modalInsertarToggle()}>
          Agregar Proveedor
        </button>

        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Nombre del Proveedor</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map(proveedor => (
              <tr key={proveedor.idproveedor}>
                <td>{proveedor.idproveedor}</td>
                <td>{proveedor.nombre_proveedor}</td>
                <td>{proveedor.telefono}</td>
                <td>{proveedor.direccion}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => this.seleccionarProveedorParaEditar(proveedor)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>{" "}
                  <button className="btn btn-danger" onClick={() => { this.setState({ proveedorSeleccionado: proveedor }); this.modalEliminarToggle(); }}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal isOpen={this.state.modalEditar}>
          <ModalHeader>
            Editar Proveedor
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>ID:</label>
              <input className="form-control" type="text" name="idproveedor" readOnly value={proveedorSeleccionado ? proveedorSeleccionado.idproveedor : ''} />
              <br />
              <label>Nombre del Proveedor:</label>
              <input className="form-control" type="text" name="nombre_proveedor" onChange={this.handleInputChange} value={form.nombre_proveedor} />
              <br />
              <label>Teléfono:</label>
              <input className="form-control" type="text" name="telefono" onChange={this.handleInputChange} value={form.telefono} />
              <br />
              <label>Dirección:</label>
              <input className="form-control" type="text" name="direccion" onChange={this.handleInputChange} value={form.direccion} />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-success" onClick={() => this.guardarEdicion()}>Guardar</button>
            <button className="btn btn-danger" onClick={() => this.modalEditarToggle()}>Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            Agregar Nuevo Proveedor
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>ID:</label>
              <input className="form-control" type="text" name="idproveedor" readOnly onChange={this.handleInputChange} value={form ? form.idproveedor : ''} />
              <br />
              <label>Nombre del Proveedor:</label>
              <input className="form-control" type="text" name="nombre_proveedor" onChange={this.handleInputChange} value={form ? form.nombre_proveedor : ''} />
              <br />
              <label>Teléfono:</label>
              <input className="form-control" type="text" name="telefono" onChange={this.handleInputChange} value={form ? form.telefono : ''} />
              <br />
              <label>Dirección:</label>
              <input className="form-control" type="text" name="direccion" onChange={this.handleInputChange} value={form ? form.direccion : ''} />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-success" onClick={() => this.peticionPost()}>Insertar</button>
            <button className="btn btn-danger" onClick={() => this.modalInsertarToggle()}>Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            ¿Estás seguro de que deseas eliminar el proveedor?
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

export default Proveedores;
