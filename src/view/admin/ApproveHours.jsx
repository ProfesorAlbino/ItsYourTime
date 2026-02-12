import React, { useEffect, useState } from 'react';
import HoursService from '../../service/HoursService';
import { Table, Button, Badge, Spinner, Form, Modal, Accordion, Card, Alert, Row, Col } from 'react-bootstrap';
import { Check, X, User, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ApproveHours() {
    const [hours, setHours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedHour, setSelectedHour] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [comment, setComment] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setError('');
            const data = await HoursService.getHours({ isAprobada: false });
            setHours(data);
        } catch (error) {
            console.error("Error fetching hours", error);
            setError('Error al cargar las horas pendientes.');
        } finally {
            setLoading(false);
        }
    };

    const openActionModal = (hour, type) => {
        setSelectedHour(hour);
        setActionType(type);
        setComment(type === 'approve' ? 'Aprobado' : '');
        setShowModal(true);
    };

    const handleAction = async () => {
        if (!selectedHour) return;

        if (actionType === 'reject' && !comment.trim()) {
            return;
        }

        setProcessing(true);
        try {
            const isApproved = actionType === 'approve';
            
            // Use the correct approve endpoint
            await HoursService.approveHours(selectedHour.id, {
                aprobar: isApproved,
                comentario: comment || (isApproved ? 'Aprobado' : 'Rechazado')
            });

            setShowModal(false);
            setComment('');
            setSelectedHour(null);
            setActionType(null);
            fetchData();
        } catch (error) {
            console.error("Error processing hours", error);
            setError("Error al procesar la solicitud. " + (error.response?.data?.message || ''));
        } finally {
            setProcessing(false);
        }
    };

    // Group pending hours by user
    const groupedPending = hours.reduce((acc, curr) => {
        const userId = curr.usuarioId;
        if (!acc[userId]) {
            acc[userId] = {
                user: curr.usuario,
                hours: []
            };
        }
        acc[userId].hours.push(curr);
        return acc;
    }, {});

    const totalPending = hours.reduce((acc, curr) => acc + curr.horasExtra, 0);
    const totalUsers = Object.keys(groupedPending).length;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className='container-fluid p-4'>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <div>
                    <h3 className="mb-1">Gestionar Aprobaciones</h3>
                    <p className="text-muted mb-0">Revisa y aprueba las solicitudes de horas extra</p>
                </div>
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4">
                    <AlertCircle size={18} className="me-2" />
                    {error}
                </Alert>
            )}

            {/* Stats Summary */}
            {hours.length > 0 && (
                <Row className="g-3 mb-4">
                    <Col xs={12} sm={6} md={4}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center">
                                    <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                                        <Clock className="text-warning" size={24} />
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1 small">Horas Pendientes</h6>
                                        <h4 className="mb-0 fw-bold">{totalPending.toFixed(1)} h</h4>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                        <User className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1 small">Usuarios con Solicitudes</h6>
                                        <h4 className="mb-0 fw-bold">{totalUsers}</h4>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center">
                                    <div className="bg-info bg-opacity-10 p-3 rounded-circle me-3">
                                        <CheckCircle className="text-info" size={24} />
                                    </div>
                                    <div>
                                        <h6 className="text-muted mb-1 small">Total Solicitudes</h6>
                                        <h4 className="mb-0 fw-bold">{hours.length}</h4>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <div className="mb-5">
                <h5 className="mb-3 fw-bold">Pendientes de Aprobación</h5>

                {Object.keys(groupedPending).length === 0 ? (
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center py-5">
                            <CheckCircle size={48} className="text-success mb-3 opacity-50" />
                            <p className="text-muted mb-0">No hay horas pendientes de aprobación.</p>
                        </Card.Body>
                    </Card>
                ) : (
                    <Accordion defaultActiveKey="0">
                        {Object.values(groupedPending).map((group, index) => (
                            <Accordion.Item eventKey={String(index)} key={index}>
                                <Accordion.Header>
                                    <div className="d-flex align-items-center gap-3 w-100">
                                        <div className="bg-primary bg-opacity-10 p-2 rounded-circle">
                                            <User size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <div className="fw-bold">{group.user?.nombre} {group.user?.apellido}</div>
                                            <small className="text-muted">{group.user?.cedula}</small>
                                        </div>
                                        <Badge bg="warning" text="dark" className="ms-auto me-3">
                                            {group.hours.length} Solicitud(es)
                                        </Badge>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body className="p-0">
                                    <div className="table-responsive">
                                        <Table hover responsive className="align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Fecha</th>
                                                    <th>Horas</th>
                                                    <th className="d-none d-md-table-cell">Comentarios</th>
                                                    <th className="text-end">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {group.hours.map(h => (
                                                    <tr key={h.id}>
                                                        <td>
                                                            <div className="d-flex flex-column">
                                                                <span className="fw-medium">{new Date(h.fechaIngreso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
                                                                <small className="text-muted">{new Date(h.fechaIngreso).toLocaleDateString('es-ES', { year: 'numeric' })}</small>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className="fw-bold">{h.horasExtra} h</span>
                                                        </td>
                                                        <td className="small text-muted d-none d-md-table-cell">
                                                            {h.comentarios ? (
                                                                <span title={h.comentarios}>
                                                                    {h.comentarios.length > 40 ? `${h.comentarios.substring(0, 40)}...` : h.comentarios}
                                                                </span>
                                                            ) : (
                                                                <span className="opacity-50">-</span>
                                                            )}
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="d-flex justify-content-end gap-2 flex-wrap">
                                                                <Button 
                                                                    variant="outline-success" 
                                                                    size="sm" 
                                                                    onClick={() => openActionModal(h, 'approve')} 
                                                                    title="Aprobar"
                                                                    className="flex-fill flex-md-grow-0"
                                                                >
                                                                    <Check size={16} className="me-1" /> 
                                                                    <span className="d-none d-sm-inline">Aprobar</span>
                                                                </Button>
                                                                <Button 
                                                                    variant="outline-danger" 
                                                                    size="sm" 
                                                                    onClick={() => openActionModal(h, 'reject')} 
                                                                    title="Rechazar"
                                                                    className="flex-fill flex-md-grow-0"
                                                                >
                                                                    <X size={16} className="me-1" /> 
                                                                    <span className="d-none d-sm-inline">Rechazar</span>
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                )}
            </div>


            <Modal show={showModal} onHide={() => !processing && setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="d-flex align-items-center gap-2">
                        {actionType === 'approve' ? (
                            <>
                                <CheckCircle className="text-success" size={24} />
                                Aprobar Horas
                            </>
                        ) : (
                            <>
                                <XCircle className="text-danger" size={24} />
                                Rechazar Horas
                            </>
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card className="mb-3" style={{ backgroundColor: 'var(--background-color)' }}>
                        <Card.Body>
                            <Row>
                                <Col xs={12} sm={6} className="mb-2 mb-sm-0">
                                    <small className="text-muted d-block">Usuario</small>
                                    <strong>{selectedHour?.usuario?.nombre} {selectedHour?.usuario?.apellido}</strong>
                                </Col>
                                <Col xs={6} sm={3}>
                                    <small className="text-muted d-block">Horas</small>
                                    <strong>{selectedHour?.horasExtra} h</strong>
                                </Col>
                                <Col xs={6} sm={3}>
                                    <small className="text-muted d-block">Fecha</small>
                                    <strong>{selectedHour?.fechaIngreso ? new Date(selectedHour.fechaIngreso).toLocaleDateString('es-ES') : '-'}</strong>
                                </Col>
                            </Row>
                            {selectedHour?.comentarios && (
                                <div className="mt-3 pt-3 border-top">
                                    <small className="text-muted d-block mb-1">Comentario del usuario</small>
                                    <p className="mb-0 small">{selectedHour.comentarios}</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                    <Form.Group>
                        <Form.Label>
                            {actionType === 'reject' ? 'Razón del rechazo' : 'Comentario (Opcional)'}
                            {actionType === 'reject' && <span className="text-danger"> *</span>}
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder={actionType === 'reject' ? "Por favor, indique la razón del rechazo..." : "Comentario opcional para la aprobación..."}
                            required={actionType === 'reject'}
                            disabled={processing}
                        />
                        {actionType === 'reject' && !comment.trim() && (
                            <Form.Text className="text-danger">
                                El comentario es obligatorio para rechazar.
                            </Form.Text>
                        )}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        onClick={() => setShowModal(false)}
                        disabled={processing}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant={actionType === 'approve' ? 'success' : 'danger'}
                        onClick={handleAction}
                        disabled={processing || (actionType === 'reject' && !comment.trim())}
                    >
                        {processing ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Procesando...
                            </>
                        ) : (
                            <>
                                {actionType === 'approve' ? (
                                    <>
                                        <Check size={18} className="me-2" />
                                        Confirmar Aprobación
                                    </>
                                ) : (
                                    <>
                                        <X size={18} className="me-2" />
                                        Confirmar Rechazo
                                    </>
                                )}
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
