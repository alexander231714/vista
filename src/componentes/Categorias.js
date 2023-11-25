import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const apiUrl = "http://127.0.0.1:8000/api/categorias/";

class Categorias extends Component {
  state = {
    categorias: [],
    modalInsertar: false,
    modalEditar: false,
    modalEliminar: false,
    categoriaSeleccionada: null,
    form: {
      idcategoria: '',
      nombrecategoria: '',
    },
  };

  componentDidMount() {
    this.fetchCategorias();
  }

  fetchCategorias = () => {
    axios.get(apiUrl)
      .then(response => {
        this.setState({ categorias: response.data });
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
      form: { idcategoria: '', nombrecategoria: '' }, // Limpia los campos al abrir el modal de inserción
    }));
  }

  modalEditarToggle = () => {
    this.setState(prevState => ({ modalEditar: !prevState.modalEditar }));
  }

  modalEliminarToggle = () => {
    this.setState(prevState => ({ modalEliminar: !prevState.modalEliminar }));
  }

  seleccionarCategoriaParaEditar = categoria => {
    this.setState({
      form: {
        idcategoria: categoria.idcategoria,
        nombrecategoria: categoria.nombrecategoria,
      },
      categoriaSeleccionada: categoria,
    });
    this.modalEditarToggle();
  }

  guardarEdicion = () => {
    axios.put(apiUrl + this.state.categoriaSeleccionada.idcategoria, this.state.form)
      .then(response => {
        this.modalEditarToggle();
        this.fetchCategorias();
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  peticionEliminar = () => {
    const idCategoria = this.state.categoriaSeleccionada.idcategoria;

    axios.delete(apiUrl + idCategoria)
      .then(response => {
        this.modalEliminarToggle();
        this.fetchCategorias();
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  peticionPost = () => {
    axios.post(apiUrl, this.state.form)
      .then(response => {
        this.modalInsertarToggle();
        this.fetchCategorias();
      })
      .catch(error => {
        console.error(error.message);
      });
  }

  render() {
    const { categorias, form, categoriaSeleccionada } = this.state;

    return (
      <div>
        <h4>Gestión de Categorías</h4>
        <button className="btn btn-success" onClick={() => this.modalInsertarToggle()}>
          Agregar Categoría
        </button>

        <table className="table mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre de la Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(categoria => (
              <tr key={categoria.idcategoria}>
                <td>{categoria.idcategoria}</td>
                <td>{categoria.nombrecategoria}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => this.seleccionarCategoriaParaEditar(categoria)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  {" "}
                  <button className="btn btn-danger" onClick={() => { this.setState({ categoriaSeleccionada: categoria }); this.modalEliminarToggle(); }}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal isOpen={this.state.modalEditar}>
          <ModalHeader>
            Editar Categoría
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>ID:</label>
              <input className="form-control" type="text" name="idcategoria" readOnly value={categoriaSeleccionada ? categoriaSeleccionada.idcategoria : ''} />
              <br />
              <label>Nombre de la Categoría:</label>
              <input className="form-control" type="text" name="nombrecategoria" onChange={this.handleInputChange} value={form.nombrecategoria} />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.peticionEliminar()}>Sí</button>
            <button className="btn btn-danger" onClick={() => this.modalEditarToggle()}>Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            Agregar Nueva Categoría
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>ID:</label>
              <input className="form-control" type="text" name="idcategoria" readOnly onChange={this.handleInputChange} value={form ? form.idcategoria : ''} />
              <br />
              <label>Nombre de la Categoría:</label>
              <input className="form-control" type="text" name="nombrecategoria" onChange={this.handleInputChange} value={form ? form.nombrecategoria : ''} />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-success" onClick={this.peticionPost}>
              Insertar
            </button>
            <button className="btn btn-danger" onClick={() => this.modalInsertarToggle()}>Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            ¿Estás seguro de que deseas eliminar la categoría?
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

export default Categorias;
