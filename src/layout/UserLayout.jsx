import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Moon, Sun } from 'lucide-react';

const UserLayout = () => {
  const { logout, user } = useAuth();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const userName = user?.nombre || "Usuario";

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--background-color)' }}>
      <header>
        <nav className="navbar navbar-expand-lg px-4" style={{ backgroundColor: 'var(--card-bg)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container-fluid">
            <Link className="navbar-brand fw-bold" to="/" style={{ color: 'var(--text-primary)' }}>
              ItsYourTime
            </Link>

            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <span className="navbar-toggler-icon" style={{ 
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='${encodeURIComponent('rgba(255, 255, 255, 0.85)')}' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")`,
                filter: 'invert(1)'
              }}></span>
            </button>

            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
              <ul className="navbar-nav align-items-center gap-2">
                <li className="nav-item d-none d-lg-block">
                  <span className="nav-link" style={{ color: 'var(--text-primary)' }}>
                    Hola, {userName}
                  </span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/" style={{ color: 'var(--text-primary)' }}>
                    Mis Horas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/submit-hours" style={{ color: 'var(--text-primary)' }}>
                    Registrar
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile" style={{ color: 'var(--text-primary)' }}>
                    Mi Perfil
                  </Link>
                </li>
                <li className="nav-item d-lg-none">
                  <span className="nav-link text-muted small" style={{ color: 'var(--text-secondary)' }}>
                    {userName}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    onClick={toggleTheme}
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                    title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                  >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    <span className="d-none d-md-inline">{theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    onClick={logout} 
                    className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
                  >
                    <LogOut size={16} /> 
                    <span className="d-none d-md-inline">Salir</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow-1 py-4" style={{ backgroundColor: 'var(--background-color)', width: '100%', maxWidth: '100%', overflowX: 'hidden', margin: '0 auto' }}>
        <div className="container" style={{ width: '100%', maxWidth: '100%', margin: '0 auto', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
          <Outlet />
        </div>
      </main>

      <footer className="py-3 border-top text-center" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
        <small>© 2026 ItsYourTime - Gestión de Horas</small>
      </footer>
    </div>
  );
};

export default UserLayout;
