import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HoursService from '../../service/HoursService';
import { ArrowLeft, Save, Clock, Calendar, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, Alert, Spinner } from 'react-bootstrap';

export default function SubmitHours() {
    const navigate = useNavigate();
    const [horasExtra, setHorasExtra] = useState('');
    const [fechaIngreso, setFechaIngreso] = useState('');
    const [comentarios, setComentarios] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        // Validation
        if (!fechaIngreso) {
            setError('Por favor selecciona una fecha.');
            setLoading(false);
            return;
        }

        const horasValue = parseFloat(horasExtra);
        if (isNaN(horasValue) || horasValue <= 0) {
            setError('Por favor ingresa una cantidad válida de horas (mayor a 0).');
            setLoading(false);
            return;
        }

        try {
            // Ensure fechaIngreso is in YYYY-MM-DD format (DateOnly format)
            const fechaFormatted = fechaIngreso.split('T')[0];
            
            // Prepare data matching the backend Hora model
            // Backend expects: HorasExtra (decimal), FechaIngreso (DateOnly), Comentarios (string?)
            // ASP.NET Core model binding should handle camelCase, but we'll be explicit
            const requestData = {
                horasExtra: horasValue,  // decimal
                fechaIngreso: fechaFormatted,  // DateOnly format: "YYYY-MM-DD"
                comentarios: comentarios.trim() || null  // string? (nullable)
            };
            
            console.log('Submitting hours with data:', requestData);
            
            const response = await HoursService.submitHours(requestData);
            
            console.log('Hours submitted successfully:', response);
            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            console.error('Error submitting hours:', err);
            console.error('Error response:', err.response);
            
            // Extract error message
            let errorMessage = 'Error al registrar las horas. Por favor intente nuevamente.';
            
            if (err.response) {
                // Try to get detailed error message
                const errorData = err.response.data;
                if (errorData) {
                    if (typeof errorData === 'string') {
                        errorMessage = errorData;
                    } else if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.errors) {
                        // Model validation errors
                        const firstError = Object.values(errorData.errors)[0];
                        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                    } else if (errorData.title) {
                        errorMessage = errorData.title;
                    }
                }
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            setLoading(false);
        }
    };

    // Set max date to today
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="container py-3 py-md-4">
            <div className="mb-3 mb-md-4">
                <Link to="/" className="text-decoration-none d-flex align-items-center text-muted">
                    <ArrowLeft size={16} className="me-1" /> Volver al inicio
                </Link>
            </div>

            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-3 p-md-4">
                            <div className="d-flex align-items-center mb-3 mb-md-4">
                                <div className="bg-primary bg-opacity-10 p-2 p-md-3 rounded-circle me-2 me-md-3 flex-shrink-0">
                                    <Clock className="text-primary" size={20} style={{ width: '20px', height: '20px' }} />
                                </div>
                                <div className="flex-grow-1">
                                    <h2 className="mb-0 fw-bold" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)' }}>Registrar Horas Extra</h2>
                                    <small className="text-muted d-none d-sm-block">Completa el formulario para registrar tus horas</small>
                                </div>
                            </div>

                            {success && (
                                <Alert variant="success" className="mb-4">
                                    <CheckCircle size={18} className="me-2" />
                                    Horas registradas exitosamente. Redirigiendo...
                                </Alert>
                            )}

                            {error && (
                                <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4">
                                    <AlertCircle size={18} className="me-2" />
                                    {error}
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3 mb-md-4">
                                    <label htmlFor="fecha" className="form-label fw-medium d-flex align-items-center gap-2 mb-2">
                                        <Calendar size={18} className="flex-shrink-0" />
                                        <span>Fecha</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="fecha"
                                        className="form-control"
                                        value={fechaIngreso}
                                        max={today}
                                        onChange={(e) => setFechaIngreso(e.target.value)}
                                        required
                                    />
                                    <small className="text-muted d-block mt-1">Selecciona la fecha en que trabajaste las horas extra</small>
                                </div>

                                <div className="mb-3 mb-md-4">
                                    <label htmlFor="horas" className="form-label fw-medium d-flex align-items-center gap-2 mb-2">
                                        <Clock size={18} className="flex-shrink-0" />
                                        <span>Cantidad de Horas</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="horas"
                                        className="form-control"
                                        step="0.5"
                                        min="0.5"
                                        max="24"
                                        placeholder="Ej. 2.5"
                                        value={horasExtra}
                                        onChange={(e) => setHorasExtra(e.target.value)}
                                        required
                                    />
                                    <small className="text-muted d-block mt-1">Ingresa la cantidad de horas extra trabajadas (mínimo 0.5)</small>
                                </div>

                                <div className="mb-3 mb-md-4">
                                    <label htmlFor="comentarios" className="form-label fw-medium d-flex align-items-center gap-2 mb-2">
                                        <FileText size={18} className="flex-shrink-0" />
                                        <span>Comentarios <span className="text-muted small fw-normal">(Opcional)</span></span>
                                    </label>
                                    <textarea
                                        id="comentarios"
                                        className="form-control"
                                        rows="4"
                                        placeholder="Describe brevemente el trabajo realizado o el motivo de las horas extra..."
                                        value={comentarios}
                                        onChange={(e) => setComentarios(e.target.value)}
                                        maxLength={500}
                                    ></textarea>
                                    <small className="text-muted d-block mt-1">
                                        {comentarios.length}/500 caracteres
                                    </small>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={loading || success}>
                                        {loading ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Registrando...
                                            </>
                                        ) : success ? (
                                            <>
                                                <CheckCircle size={18} className="me-2" />
                                                Registrado
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} className="me-2" />
                                                Registrar Horas
                                            </>
                                        )}
                                    </button>
                                    <Link to="/" className="btn btn-outline-secondary">
                                        Cancelar
                                    </Link>
                                </div>
                            </form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
}
