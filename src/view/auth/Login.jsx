import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/view/LoginStyle.css";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setError("");
    try {
      // API expects 'cedula' and 'password'
      const response = await login(cedula, password);
      // login function in AuthContext returns { success: true/false, message: ... }
      if (response.success) {
        // Navigation is handled by keeping user state, but let's redirect manually just in case
        // or let the useEffect in a parent component handle it. 
        // Better to redirect here based on role if we had it, but for now root /
        navigate("/");
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
    setValidated(true);
  };

  return (
    <div className="container-fluid align-items-center d-flex justify-content-center mt-5">
      <div className="login-container">
        <div className="login-header">
          <h1>Iniciar Sesión</h1>
          <p className="text-muted">Ingresa tus credenciales para continuar</p>
        </div>

        <form
          className={`row g-3 needs-validation ${validated ? "was-validated" : ""}`}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="mb-3">
            <label htmlFor="validationCustomCedula" className="form-label">
              Cédula
            </label>
            <input
              type="text"
              className="form-control"
              id="validationCustomCedula"
              placeholder="123456789"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              required
            />
            <div className="valid-feedback">¡Todo bien!</div>
            <div className="invalid-feedback">Por favor, ingresa una cédula válida.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="validationCustomPassword" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="validationCustomPassword"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="valid-feedback">¡Todo bien!</div>
            <div className="invalid-feedback">La contraseña es obligatoria.</div>
          </div>

          <div className="mb-3 d-flex justify-content-end">
            <Link to="/" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary">
            Iniciar Sesión
          </button>

          <div className="register-link">
            ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
          </div>
        </form>

        {error && <p className="text-danger mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
}
