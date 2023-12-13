import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.loginUser.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };
  return children;
};


export default ProtectedRoute;
