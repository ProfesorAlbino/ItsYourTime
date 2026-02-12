import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import HoursService from '../service/HoursService';
import { Link } from 'react-router-dom';
import { PlusCircle, Clock, CheckCircle, XCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { Spinner, Badge, Card, Table, Row, Col, Alert } from 'react-bootstrap';

export default function Home() {
  const { user } = useAuth();
  const [hours, setHours] = useState([]);
  const [availableHours, setAvailableHours] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError('');
      const [hoursData, availableData] = await Promise.all([
        HoursService.getHours(),
        HoursService.getAvailableHours()
      ]);
      setHours(hoursData);
      setAvailableHours(availableData);
    } catch (err) {
      console.error("Error fetching hours:", err);
      setError('Error al cargar las horas. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const pendingHours = hours.filter(h => !h.isAprobada).reduce((acc, curr) => acc + curr.horasExtra, 0);
  const approvedHours = hours.filter(h => h.isAprobada).reduce((acc, curr) => acc + curr.horasExtra, 0);
  const rejectedHours = hours.filter(h => h.isAprobada === false && h.aprobadaPor).reduce((acc, curr) => acc + curr.horasExtra, 0);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container py-3 py-md-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 mb-md-4 gap-2 gap-md-3">
        <div className="flex-grow-1">
          <h1 className="mb-1" style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>Mis Horas</h1>
          <p className="text-muted mb-0 d-none d-md-block">Gestiona y consulta tus horas extra registradas</p>
        </div>
        <Link to="/submit-hours" className="btn btn-primary d-flex align-items-center justify-content-center gap-2 w-100 w-md-auto">
          <PlusCircle size={18} /> <span>Registrar Horas</span>
        </Link>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4">
          <AlertCircle size={18} className="me-2" />
          {error}
        </Alert>
      )}

      {/* Available Hours Summary */}
      {availableHours && (
        <Card className="mb-3 mb-md-4 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)' }}>
          <Card.Body className="text-white p-3 p-md-4">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 gap-md-3">
              <div className="flex-grow-1">
                <h6 className="mb-1 mb-md-2 opacity-90" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>Horas Disponibles</h6>
                <h2 className="mb-0 fw-bold" style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)' }}>{availableHours.horasAprobadas || 0} h</h2>
                <small className="opacity-75 d-none d-sm-block">Aprobadas y listas para usar</small>
              </div>
              <div className="bg-white bg-opacity-20 p-2 p-md-3 rounded-circle flex-shrink-0">
                <TrendingUp size={24} style={{ width: '24px', height: '24px' }} />
              </div>
            </div>
            <Row className="mt-3 mt-md-4 g-2 g-md-3">
              <Col xs={6} sm={3}>
                <div>
                  <small className="opacity-75 d-block mb-1">Pendientes</small>
                  <strong className="fs-6">{availableHours.horasPendientes || 0} h</strong>
                </div>
              </Col>
              <Col xs={6} sm={3}>
                <div>
                  <small className="opacity-75 d-block mb-1">Rechazadas</small>
                  <strong className="fs-6">{availableHours.horasRechazadas || 0} h</strong>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div>
                  <small className="opacity-75 d-block mb-1">Total Registradas</small>
                  <strong className="fs-6">{availableHours.totalHoras || 0} h</strong>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Stats Cards */}
      <Row className="g-2 g-md-3 g-lg-4 mb-3 mb-md-4">
        <Col xs={12} sm={6} lg={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-3 p-md-4">
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                  <Clock className="text-warning" size={24} />
                </div>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-1 small">Pendientes</h6>
                  <h3 className="mb-0 fw-bold">{pendingHours.toFixed(1)} h</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                  <CheckCircle className="text-success" size={24} />
                </div>
                <div className="flex-grow-1">
                  <h6 className="text-muted mb-1 small">Aprobadas</h6>
                  <h3 className="mb-0 fw-bold">{approvedHours.toFixed(1)} h</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        {rejectedHours > 0 && (
          <Col xs={12} sm={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-danger bg-opacity-10 p-3 rounded-circle me-3">
                    <XCircle className="text-danger" size={24} />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="text-muted mb-1 small">Rechazadas</h6>
                    <h3 className="mb-0 fw-bold">{rejectedHours.toFixed(1)} h</h3>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Recent History */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-3 p-md-4">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-2">
            <h5 className="mb-0 fw-bold" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>Historial de Registros</h5>
            <Badge bg="secondary">{hours.length} registro{hours.length !== 1 ? 's' : ''}</Badge>
          </div>
          {hours.length === 0 ? (
            <div className="text-center py-5">
              <Clock size={48} className="text-muted mb-3 opacity-50" />
              <p className="text-muted mb-0">No tienes horas registradas aún.</p>
              <Link to="/submit-hours" className="btn btn-primary mt-3">
                <PlusCircle size={18} className="me-2" />
                Registrar Primera Hora
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Horas</th>
                    <th>Estado</th>
                    <th className="d-none d-md-table-cell">Comentarios</th>
                  </tr>
                </thead>
                <tbody>
                  {hours.slice(0, 10).map((h) => (
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
                      <td>
                        {h.isAprobada ? (
                          <Badge bg="success">
                            <CheckCircle size={14} className="me-1" />
                            Aprobada
                          </Badge>
                        ) : h.aprobadaPor ? (
                          <Badge bg="danger">
                            <XCircle size={14} className="me-1" />
                            Rechazada
                          </Badge>
                        ) : (
                          <Badge bg="warning" text="dark">
                            <Clock size={14} className="me-1" />
                            Pendiente
                          </Badge>
                        )}
                      </td>
                      <td className="text-muted small d-none d-md-table-cell">
                        {h.comentarios ? (
                          <span title={h.comentarios}>
                            {h.comentarios.length > 50 ? `${h.comentarios.substring(0, 50)}...` : h.comentarios}
                          </span>
                        ) : (
                          <span className="opacity-50">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {hours.length > 10 && (
                <div className="text-center mt-3">
                  <small className="text-muted">Mostrando los últimos 10 registros de {hours.length} totales</small>
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
