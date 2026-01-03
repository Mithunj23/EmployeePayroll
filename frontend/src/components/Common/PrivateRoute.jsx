import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { loading } = useAuth();
  const userRole = localStorage.getItem('role');

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) {
    return <Navigate to={`/${userRole}/dashboard`} />;
  }

  return children;
};

export default PrivateRoute;
