import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, Heart, Music } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../features/loginUser.slice";
import PropTypes from "prop-types";

const UserProfile = ({ className = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.loginUser);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(userLogout());
    navigate("/");
    setIsOpen(false);
  };

  const menuItems = [
    { icon: Settings, label: "Settings", action: () => console.log("Settings") },
    { icon: Heart, label: "Liked Songs", action: () => console.log("Liked Songs") },
    { icon: Music, label: "My Playlists", action: () => console.log("Playlists") },
  ];

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
          <User className="text-white" size={20} />
        </div>
        {isAuthenticated && user && (
          <div className="hidden md:block text-left">
            <p className="font-medium text-gray-900 text-sm">{user.username || user.email}</p>
            <p className="text-xs text-gray-500">Premium User</p>
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
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            >
              {isAuthenticated ? (
                <>
                  {/* User Info */}
                  <div className="p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="font-semibold">{user?.username || "User"}</p>
                        <p className="text-sm opacity-90">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {menuItems.map((item, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                        onClick={item.action}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        <item.icon size={18} />
                        <span>{item.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100">
                    <motion.button
                      whileHover={{ backgroundColor: "#fef2f2" }}
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:text-red-700 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="p-4">
                  <p className="text-gray-600 mb-4">Join AdventPercent to save your favorite music</p>
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-lg font-medium"
                      >
                        Sign In
                      </motion.button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50"
                      >
                        Sign Up
                      </motion.button>
                    </Link>
                  </div>
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
  className: PropTypes.string
};

export default UserProfile;