import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const isAuthenticated = useSelector((state) => state.loginUser.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  redirectTo: PropTypes.string,
};

export default ProtectedRoute;