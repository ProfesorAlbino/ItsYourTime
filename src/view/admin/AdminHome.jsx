import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../../service/UserService';
import BranchService from '../../service/BranchService';
import HoursService from '../../service/HoursService';
import { Users, Briefcase, Clock, FileCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

export default function AdminHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    branches: 0,
    pendingHours: 0,
    approvedHours: 0,
    totalHours: 0,
    pendingCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('');
        const [users, branches, hours] = await Promise.all([
          UserService.getAllUsers(),
          BranchService.getBranches(),
          HoursService.getHours()
        ]);

        const pending = hours.filter(h => !h.isAprobada);
        const pendingHours = pending.reduce((acc, curr) => acc + curr.horasExtra, 0);
        const approved = hours.filter(h => h.isAprobada);
        const approvedHours = approved.reduce((acc, curr) => acc + curr.horasExtra, 0);
        const totalHours = hours.reduce((acc, curr) => acc + curr.horasExtra, 0);

        setStats({
          users: users.length,
          branches: branches.length,
          pendingHours: pendingHours,
          approvedHours: approvedHours,
          totalHours: totalHours,
          pendingCount: pending.length
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        setError('Error al cargar los datos del panel.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="mb-1">Panel de Administración</h2>
          <p className="text-muted mb-0">Bienvenido, {user?.nombre || 'Administrador'}</p>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4">
          <AlertCircle size={18} className="me-2" />
          {error}
        </Alert>
      )}

      <Row className="g-3 g-md-4 mb-4">
        {/* Users Card */}
        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted mb-2 small">Total Usuarios</h6>
                  <h3 className="mb-0 fw-bold">{stats.users}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <Users className="text-primary" size={28} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Branches Card */}
        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted mb-2 small">Sucursales</h6>
                  <h3 className="mb-0 fw-bold">{stats.branches}</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                  <Briefcase className="text-info" size={28} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Pending Card */}
        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted mb-2 small">Horas Pendientes</h6>
                  <h3 className="mb-0 fw-bold">{stats.pendingHours.toFixed(1)} h</h3>
                  <small className="text-muted">{stats.pendingCount} solicitud{stats.pendingCount !== 1 ? 'es' : ''}</small>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                  <Clock className="text-warning" size={28} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Approved Card */}
        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted mb-2 small">Horas Aprobadas</h6>
                  <h3 className="mb-0 fw-bold">{stats.approvedHours.toFixed(1)} h</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <FileCheck className="text-success" size={28} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="g-3 g-md-4 mb-4">
        <Col xs={12} md={6}>
          <Card className="border-0 shadow-sm h-100" style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)' }}>
            <Card.Body className="p-4 text-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="mb-2">Gestionar Aprobaciones</h5>
                  <p className="mb-3 opacity-90 small">Revisa y aprueba las solicitudes de horas pendientes</p>
                  <Link to="/home-admin/approvals">
                    <Button variant="light" size="sm">
                      Ir a Aprobaciones
                    </Button>
                  </Link>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-circle">
                  <FileCheck size={32} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="mb-2">Resumen General</h5>
                  <div className="d-flex align-items-center gap-4 mt-3">
                    <div>
                      <small className="text-muted d-block">Total Horas</small>
                      <strong className="fs-5">{stats.totalHours.toFixed(1)} h</strong>
                    </div>
                    <div>
                      <small className="text-muted d-block">Tasa Aprobación</small>
                      <strong className="fs-5">
                        {stats.totalHours > 0 
                          ? ((stats.approvedHours / stats.totalHours) * 100).toFixed(0) 
                          : 0}%
                      </strong>
                    </div>
                  </div>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <TrendingUp className="text-primary" size={32} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Welcome Section */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <h5 className="mb-3">Accesos Rápidos</h5>
          <Row className="g-3">
            <Col xs={12} sm={6} md={4}>
              <Link to="/home-admin/users" className="text-decoration-none">
                <Card className="border-0 shadow-sm h-100 hover-lift">
                  <Card.Body className="p-3 text-center">
                    <Users className="text-primary mb-2" size={32} />
                    <h6 className="mb-0">Gestionar Usuarios</h6>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Link to="/home-admin/branches" className="text-decoration-none">
                <Card className="border-0 shadow-sm h-100 hover-lift">
                  <Card.Body className="p-3 text-center">
                    <Briefcase className="text-info mb-2" size={32} />
                    <h6 className="mb-0">Gestionar Sucursales</h6>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Link to="/home-admin/approvals" className="text-decoration-none">
                <Card className="border-0 shadow-sm h-100 hover-lift">
                  <Card.Body className="p-3 text-center">
                    <FileCheck className="text-success mb-2" size={32} />
                    <h6 className="mb-0">Aprobar Horas</h6>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}
