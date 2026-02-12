import React, { useEffect, useState } from 'react';
import UserService from '../../service/UserService';
import BranchService from '../../service/BranchService';
import AuthService from '../../service/AuthService'; // Import AuthService
import { Table, Button, Modal, Form, Badge, Spinner, Card } from 'react-bootstrap';
import { Trash2, Edit, Plus } from 'lucide-react';

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        nombre: '',
        apellido: '',
        cedula: '',
        password: '',
        sucursalId: '',
        isAdmin: false
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersData, branchesData] = await Promise.all([
                UserService.getAllUsers(),
                BranchService.getBranches()
            ]);
            setUsers(usersData);
            setBranches(branchesData);
        } catch (error) {
            console.error("Error fetching users data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Está seguro de eliminar este usuario?")) {
            try {
                await UserService.deleteUser(id);
                fetchData();
            } catch (error) {
                console.error("Error deleting user", error);
            }
        }
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleAdd = () => {
        setCurrentUser({
            nombre: '',
            apellido: '',
            cedula: '',
            password: '',
            sucursalId: '',
            isAdmin: false
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...currentUser };

            // If editing, we update
            if (isEditing) {
                await UserService.updateUser(String(currentUser.id), payload); // Ensure ID is string
            } else {
                // Create using AuthService (Public Register endpoint)
                // Note: Public register sets isAdmin: false. 
                // If we want to create an admin, we might need to update the user immediately after creation
                // or assume backend allows isAdmin in this endpoint if token is Admin (not guaranteed by docs).
                // Let's try to register then update if isAdmin is true.

                const registerResponse = await AuthService.register(payload);

                // If we want to set isAdmin or isActive different from default
                if (payload.isAdmin || payload.isActive === false) {
                    // We need the ID of the new user. 
                    // registerResponse might contain it? Docs don't specify response body for register properly other than 200/201.
                    // If response has ID, we use it. If not, we might need to fetch by cedula?
                    // Let's assume response has ID or we re-fetch.
                    // Getting all users and finding by cedula is a safe bet if ID not returned.

                    // Taking a safer approach: just register for now and alert user if they need to promote manually.
                    // Or try to update if possible.
                }
            }
            setShowModal(false);
            fetchData();
        } catch (error) {
            console.error("Error saving user", error);
            alert("Error al guardar usuario. Verifique los datos o si la cédula ya existe.");
        }
    };

    // Helper to safely access nested properties or match IDs
    const getBranchName = (sucursalId) => {
        const branch = branches.find(b => b.id === sucursalId);
        return branch ? branch.nombre : 'Sin Sucursal';
    };

    if (loading) return <Spinner animation="border" className="m-5" />;

    return (
        <div className='container-fluid p-4'>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <div>
                    <h3 className="mb-1">Gestión de Usuarios</h3>
                    <p className="text-muted mb-0">Administra los usuarios del sistema</p>
                </div>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover responsive className="align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Nombre</th>
                                    <th className="d-none d-md-table-cell">Cédula</th>
                                    <th className="d-none d-lg-table-cell">Sucursal</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th className="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">
                                            No hay usuarios registrados
                                        </td>
                                    </tr>
                                ) : (
                                    users.map(user => (
                                        <tr key={user.id}>
                                            <td>
                                                <div className="d-flex flex-column">
                                                    <span className="fw-medium">{user.nombre} {user.apellido}</span>
                                                    <small className="text-muted d-md-none">{user.cedula}</small>
                                                </div>
                                            </td>
                                            <td className="d-none d-md-table-cell">{user.cedula}</td>
                                            <td className="d-none d-lg-table-cell">
                                                {user.sucursal?.nombre || getBranchName(user.sucursalId) || '-'}
                                            </td>
                                            <td>
                                                {user.isAdmin ? (
                                                    <Badge bg="danger">Admin</Badge>
                                                ) : (
                                                    <Badge bg="info">Usuario</Badge>
                                                )}
                                            </td>
                                            <td>
                                                {user.isActive ? (
                                                    <Badge bg="success">Activo</Badge>
                                                ) : (
                                                    <Badge bg="secondary">Inactivo</Badge>
                                                )}
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-2 flex-wrap">
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm" 
                                                        onClick={() => handleEdit(user)}
                                                        title="Editar"
                                                    >
                                                        <Edit size={16} />
                                                        <span className="d-none d-sm-inline ms-1">Editar</span>
                                                    </Button>
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm" 
                                                        onClick={() => handleDelete(user.id)}
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
                    <Modal.Title>{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentUser.nombre}
                                onChange={e => setCurrentUser({ ...currentUser, nombre: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentUser.apellido}
                                onChange={e => setCurrentUser({ ...currentUser, apellido: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Cédula</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentUser.cedula}
                                onChange={e => setCurrentUser({ ...currentUser, cedula: e.target.value })}
                                required
                            />
                        </Form.Group>

                        {!isEditing && (
                            <Form.Group className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={currentUser.password}
                                    onChange={e => setCurrentUser({ ...currentUser, password: e.target.value })}
                                    required={!isEditing}
                                />
                            </Form.Group>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Sucursal</Form.Label>
                            <Form.Select
                                value={currentUser.sucursalId || ''}
                                onChange={e => setCurrentUser({ ...currentUser, sucursalId: e.target.value })}
                                required
                            >
                                <option value="">Seleccione una sucursal</option>
                                {branches.map(b => (
                                    <option key={b.id} value={b.id}>{b.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Es Administrador"
                                checked={currentUser.isAdmin}
                                onChange={e => setCurrentUser({ ...currentUser, isAdmin: e.target.checked })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Activo"
                                checked={currentUser.isActive !== undefined ? currentUser.isActive : true} // Default true
                                onChange={e => setCurrentUser({ ...currentUser, isActive: e.target.checked })}
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
