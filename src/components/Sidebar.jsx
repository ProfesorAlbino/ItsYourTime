import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/components/SideBarStyle.css";
import { User, Clock, Home, LogOut, Briefcase } from "lucide-react"; // Changed Bolt to Clock/Briefcase for relavancy
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <div className="sidebar d-flex flex-column">
      <div className="sidebar-header mt-4 text-center ">
        <h4>ItsYourTime</h4>
        <hr />
      </div>

      <nav className="sidebar-nav ms-3 flex-grow-1">
        <ul className="list-unstyled">
          {/* Dashboard */}
          <li className="mb-4">
            <NavLink
              to="/home-admin"
              end
              className={({ isActive }) => `sidebar-nav-item w-75 ${isActive ? "active" : ""}`}
            >
              <Home /> <span className="ms-2">Inicio</span>
            </NavLink>
          </li>

          {/* Usuarios */}
          <li className="mb-4">
            <NavLink
              to="/home-admin/users"
              className={({ isActive }) => `sidebar-nav-item w-75 ${isActive ? "active" : ""}`}
            >
              <User /> <span className="ms-2">Usuarios</span>
            </NavLink>
          </li>

          {/* Sucursales */}
          <li className="mb-4">
            <NavLink
              to="/home-admin/branches"
              className={({ isActive }) => `sidebar-nav-item w-75 ${isActive ? "active" : ""}`}
            >
              <Briefcase /> <span className="ms-2">Sucursales</span>
            </NavLink>
          </li>

          {/* Aprobaciones */}
          <li className="mb-4">
            <NavLink
              to="/home-admin/approvals"
              className={({ isActive }) => `sidebar-nav-item w-75 ${isActive ? "active" : ""}`}
            >
              <Clock /> <span className="ms-2">Aprobaciones</span>
            </NavLink>
          </li>

        </ul>
      </nav>

      <div className="mt-auto mb-4 ms-3">
        <button
          onClick={logout}
          className="sidebar-nav-item btn text-danger"
          style={{ border: 'none', background: 'transparent' }}
        >
          <LogOut /> <span className="ms-2">Cerrar sesión</span>
        </button>
      </div>

      <div className="sidebar-footer p-3 border-top text-center">
        <small>© 2026 ItYourTime</small>
      </div>
    </div>
  );
};

export default Sidebar;
