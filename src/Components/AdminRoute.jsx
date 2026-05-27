import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.loginUser);

  // TODO: restore auth + role checks before production
  // if (!isAuthenticated) return <Navigate to="/login" />;
  // if (user?.role !== "admin") return <Navigate to="/" />;

  return children;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminRoute;
