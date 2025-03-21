import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem('userRole');

  if (!allowedRoles.includes(role)) return <Navigate to="/admin-login" />;
  return children;
};

export default ProtectedRoute;
