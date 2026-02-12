import React, { useEffect, useState } from 'react';
import BranchService from '../../service/BranchService';
import { Table, Button, Modal, Form, Spinner, Card } from 'react-bootstrap';
import { Trash2, Edit, Plus, MapPin } from 'lucide-react';

export default function ManageBranches() {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentBranch, setCurrentBranch] = useState({
        nombre: '',
        ubicacion: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await BranchService.getBranches();
            setBranches(data);
        } catch (error) {
            console.error("Error fetching branches", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Está seguro de eliminar esta sucursal?")) {
            try {
                await BranchService.deleteBranch(id);
                fetchData();
            } catch (error) {
                console.error("Error deleting branch", error);
            }
        }
    };

    const handleEdit = (branch) => {
        setCurrentBranch(branch);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleAdd = () => {
        setCurrentBranch({
            nombre: '',
            ubicacion: ''
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await BranchService.updateBranch(currentBranch.id, currentBranch);
            } else {
                await BranchService.createBranch(currentBranch);
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error("Error saving branch", error);
            alert("Error al guardar la sucursal.");
        }
    };

    if (loading) return <Spinner animation="border" className="m-5" />;

    return (
        <div className='container-fluid p-4'>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <div>
                    <h3 className="mb-1">Gestión de Sucursales</h3>
                    <p className="text-muted mb-0">Administra las sucursales de la empresa</p>
                </div>
                <Button variant="primary" onClick={handleAdd} className="d-flex align-items-center gap-2">
                    <Plus size={18} /> Nueva Sucursal
                </Button>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover responsive className="align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Ubicación</th>
                                    <th className="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {branches.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="text-center py-5 text-muted">
                                            No hay sucursales registradas
                                        </td>
                                    </tr>
                                ) : (
                                    branches.map(branch => (
                                        <tr key={branch.id}>
                                            <td className="fw-bold">{branch.nombre}</td>
                                            <td>
                                                <div className="d-flex align-items-center text-muted">
                                                    <MapPin size={16} className="me-2" />
                                                    {branch.ubicacion}
                                                </div>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-2 flex-wrap">
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm" 
                                                        onClick={() => handleEdit(branch)}
                                                        title="Editar"
                                                    >
                                                        <Edit size={16} />
                                                        <span className="d-none d-sm-inline ms-1">Editar</span>
                                                    </Button>
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm" 
                                                        onClick={() => handleDelete(branch.id)}
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={16} />
                                                        <span className="d-none d-sm-inline ms-1">Eliminar</span>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar Sucursal' : 'Nueva Sucursal'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentBranch.nombre}
                                onChange={e => setCurrentBranch({ ...currentBranch, nombre: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ubicación</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentBranch.ubicacion}
                                onChange={e => setCurrentBranch({ ...currentBranch, ubicacion: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button variant="primary" type="submit">Guardar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
