import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import "../../styles/view/RegisterStyle.css";
import { useAuth } from "../../context/AuthContext";
import BranchService from "../../service/BranchService"; // To populate branches

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState(""); // Changed from correo to cedula as per API
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sucursalId, setSucursalId] = useState("");
  const [branches, setBranches] = useState([]);

  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch branches for the dropdown
    const fetchBranches = async () => {
      try {
        const data = await BranchService.getBranches();
        setBranches(data);
      } catch (err) {
        console.error("Failed to fetch branches", err);
      }
    };
    fetchBranches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false || password !== confirmPassword) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setError("");
    try {
      // API expects: nombre, apellido, cedula, password, sucursalId
      await register({ nombre, apellido, cedula, password, sucursalId });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    }
    setValidated(true);
  };

  return (
    <div className="container align-items-center d-flex justify-content-center mt-5 mb-5">
      <div className="register-container">
        <div className="register-header">
          <h1>Crear cuenta</h1>
          <p className="text-muted">Complete el formulario para registrarse</p>
        </div>

        <form
          className={`needs-validation ${validated ? "was-validated" : ""}`}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <div className="invalid-feedback">Este campo es obligatorio.</div>
            </div>

            <div className="col-md-6">
              <label htmlFor="apellido" className="form-label">Apellido</label>
              <input
                type="text"
                className="form-control"
                id="apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
              <div className="invalid-feedback">Este campo es obligatorio.</div>
            </div>
          </div>

          <div className="mb-3 mt-3">
            <label htmlFor="cedula" className="form-label">Cédula</label>
            <input
              type="text"
              className="form-control"
              id="cedula"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              required
            />
            <div className="invalid-feedback">Por favor, ingrese su cédula.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="sucursal" className="form-label">Sucursal</label>
            <select
              className="form-select"
              id="sucursal"
              value={sucursalId}
              onChange={(e) => setSucursalId(e.target.value)}
              required
            >
              <option value="" disabled>Seleccione una sucursal</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.nombre}</option>
              ))}
            </select>
            <div className="invalid-feedback">Seleccione una sucursal.</div>
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // Removed complex pattern to make it easier for testing, or keep if strict
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div className="mb-3 position-relative">
            <label htmlFor="confirm-password" className="form-label">Confirmar contraseña</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            <div className="invalid-feedback">
              {password !== confirmPassword ? "Las contraseñas no coinciden." : "Este campo es obligatorio."}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">Crear cuenta</button>

          <div className="login-link text-center mt-3">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </div>
        </form>

        {error && <p className="text-danger mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
}