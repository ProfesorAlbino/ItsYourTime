import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Moon, Sun } from 'lucide-react';
import '../styles/layout/AdminLayoutStyle.css';

const AdminLayout = () => {
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

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: 'var(--background-color)' }}>
      <Sidebar />
      <div className="flex-grow-1 d-flex flex-column admin-content" style={{ marginLeft: '250px' }}>
        <header className="d-flex justify-content-end align-items-center p-2 p-md-3 border-bottom" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <button
            onClick={toggleTheme}
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span className="d-none d-sm-inline">{theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
          </button>
        </header>
        <main className="flex-grow-1 overflow-auto" style={{ backgroundColor: 'var(--background-color)', width: '100%', maxWidth: '100%', overflowX: 'hidden', margin: '0 auto' }}>
          <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
            <Outlet />
          </div>
        </main>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .admin-content {
            margin-left: 70px !important;
          }
          .sidebar {
            z-index: 1050;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;