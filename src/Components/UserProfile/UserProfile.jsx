import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Heart, Music, Shield, Mic2, Headphones } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../features/loginUser.slice";
import { socialLogout } from "../../features/socialAuth.slice";
import PropTypes from "prop-types";

const ROLE_DISPLAY = {
  ADMIN:  { label: "Admin",    icon: Shield,    color: "text-purple-500" },
  ARTIST: { label: "Artist",   icon: Mic2,      color: "text-blue-500"   },
  USER:   { label: "Listener", icon: Headphones, color: "text-green-500" },
};

const UserProfile = ({ className = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const loginState  = useSelector((state) => state.loginUser);
  const socialState = useSelector((state) => state.socialAuth);

  const isAuthenticated = loginState.isAuthenticated || socialState.isAuthenticated;

  // loginUser.user is a plain string (username) from the backend
  const username = loginState.user
    || socialState.user?.loggedInUser
    || socialState.user?.displayName
    || "Guest";

  const role = loginState.role || socialState.role || "USER";
  const roleInfo = ROLE_DISPLAY[role] ?? ROLE_DISPLAY.USER;
  const RoleIcon = roleInfo.icon;

  const handleLogout = () => {
    dispatch(userLogout());
    dispatch(socialLogout());
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <div className={`relative ${className}`}>
      {/* Avatar button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1.5 pr-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-200"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="text-white" size={16} />
        </div>
        {isAuthenticated && (
          <div className="hidden md:block text-left">
            <p className="font-medium text-gray-900 dark:text-white text-sm leading-tight">{username}</p>
            <p className={`text-xs leading-tight ${roleInfo.color}`}>
              {roleInfo.label}
            </p>
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden"
            >
              {isAuthenticated ? (
                <>
                  {/* User info banner */}
                  <div className="p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={24} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{username}</p>
                        <div className="flex items-center space-x-1 mt-0.5">
                          <RoleIcon size={12} className="opacity-90 flex-shrink-0" />
                          <p className="text-xs opacity-90">{roleInfo.label}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick links */}
                  <div className="py-2">
                    <Link to="/favorites" onClick={() => setIsOpen(false)}>
                      <motion.div
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.04)" }}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        <Heart size={18} />
                        <span className="text-sm">Favorites</span>
                      </motion.div>
                    </Link>
                    <Link to="/library" onClick={() => setIsOpen(false)}>
                      <motion.div
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.04)" }}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        <Music size={18} />
                        <span className="text-sm">Library</span>
                      </motion.div>
                    </Link>
                  </div>

                  {/* Sign out */}
                  <div className="border-t border-gray-100 dark:border-gray-700">
                    <motion.button
                      whileHover={{ backgroundColor: "rgba(239,68,68,0.08)" }}
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-500 hover:text-red-600 transition-colors"
                    >
                      <LogOut size={18} />
                      <span className="text-sm font-medium">Sign Out</span>
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="p-4 space-y-3">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Sign in to save your favourite music and more.
                  </p>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-md transition-all">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mt-2">
                      Create Account
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

UserProfile.propTypes = {
  className: PropTypes.string,
};

export default UserProfile;
