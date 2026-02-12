import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserService from '../../service/UserService';
import BranchService from '../../service/BranchService';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { User, Save, Lock } from 'lucide-react';

export default function UserProfile() {
    const { user } = useAuth(); // Removed setUser
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        cedula: '',
        sucursalId: '',
        password: '',
        confirmPassword: ''
    });
    const [branchName, setBranchName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!user) return;
                // Fetch fresh user data using ID from token/context
                // user object in context might have id
                const userData = await UserService.getUser(user.id);

                setFormData({
                    nombre: userData.nombre,
                    apellido: userData.apellido,
                    cedula: userData.cedula,
                    sucursalId: userData.sucursalId,
                    password: '',
                    confirmPassword: ''
                });

                if (userData.sucursalId) {
                    try {
                        const branches = await BranchService.getBranches();
                        const branch = branches.find(b => b.id === userData.sucursalId);
                        setBranchName(branch ? branch.nombre : 'Sin asignación');
                    } catch (e) {
                        console.error("Error fetching branch info");
                    }
                }
            } catch (error) {
                console.error("Error fetching user profile", error);
                setMessage({ type: 'danger', text: 'Error al cargar perfil.' });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]); // Added user dependency, moved fetchUserData inside to avoid dependency hell or keep outside and memoize
    // Moving inside is cleaner if not used elsewhere.

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setSaving(true);

        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: 'danger', text: 'Las contraseñas no coinciden.' });
            setSaving(false);
            return;
        }

        try {
            const updateData = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                cedula: formData.cedula,
                sucursalId: formData.sucursalId,
                // Only send password if changed? API might require it.
                // If empty, refrain from sending or send current?
                // Usually valid to send empty if backend handles it, or check backend logic.
                // Assuming backend updates password if provided.
                ...(formData.password ? { password: formData.password } : {})
            };

            await UserService.updateUser(user.id, updateData);

            setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' });

            // Ideally update context user if name changed
        } catch (error) {
            console.error("Error updating profile", error);
            setMessage({ type: 'danger', text: 'Error al actualizar perfil.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Spinner animation="border" className="m-5" />;

    return (
        <div className="container py-4">
            <h2 className="mb-4">Mi Perfil</h2>

            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-4">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                    <User size={32} className="text-primary" />
                                </div>
                                <div>
                                    <h4 className="mb-0">{formData.nombre} {formData.apellido}</h4>
                                    <small className="text-muted">{branchName}</small>
                                </div>
                            </div>

                            {message.text && (
                                <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
                                    {message.text}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <Form.Group>
                                            <Form.Label>Nombre</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <Form.Group>
                                            <Form.Label>Apellido</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="apellido"
                                                value={formData.apellido}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Cédula</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="cedula"
                                            value={formData.cedula}
                                            onChange={handleChange}
                                            disabled // Usually ID is immutable or requires special process
                                            title="Contacte al administrador para cambiar su cédula"
                                        />
                                    </Form.Group>
                                </div>

                                <hr className="my-4" />
                                <h5 className="mb-3"><Lock size={18} className="me-2" />Cambiar Contraseña</h5>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <Form.Group>
                                            <Form.Label>Nueva Contraseña (Opcional)</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Dejar en blanco para mantener actual"
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <Form.Group>
                                            <Form.Label>Confirmar Contraseña</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                disabled={!formData.password}
                                            />
                                        </Form.Group>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end mt-3">
                                    <Button variant="primary" type="submit" disabled={saving}>
                                        {saving ? <Spinner animation="border" size="sm" /> : <Save size={18} className="me-2" />}
                                        Guardar Cambios
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
}
