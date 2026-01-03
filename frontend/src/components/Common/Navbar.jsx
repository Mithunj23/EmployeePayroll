import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = ({ role }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={`/${role}/dashboard`} className="navbar-brand">
          Payroll System
        </Link>

        <div className="navbar-menu">
          {role === 'admin' ? (
            <>
              <Link to="/admin/dashboard" className="navbar-link">Dashboard</Link>
              <Link to="/admin/employees" className="navbar-link">Employees</Link>
              <Link to="/admin/payroll" className="navbar-link">Payroll</Link>
              <Link to="/admin/reports" className="navbar-link">Reports</Link>
              {/* Added attendance link */}
              <Link to="/admin/attendance" className="navbar-link">Attendance</Link>
            </>
          ) : (
            <>
              <Link to="/employee/dashboard" className="navbar-link">Dashboard</Link>
              {/* Optionally add employee attendance link if desired */}
              <Link to="/employee/attendance" className="navbar-link">Attendance</Link>
            </>
          )}

          <button onClick={handleLogout} className="btn btn--secondary btn--sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
