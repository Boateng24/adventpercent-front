import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Heart,
  Library,
  Music,
  Upload,
  Menu,
  X,
  Headphones,
  Shield,
  LogOut,
  LogIn,
  User,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../../features/loginUser.slice";
import { socialLogout } from "../../features/socialAuth.slice";

const Sidebar = ({ isCollapsed, onToggleCollapse, overlay = false }) => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [hoveredItem, setHoveredItem] = useState(null);

  const loginState = useSelector((state) => state.loginUser);
  const socialState = useSelector((state) => state.socialAuth);
  const isAuthenticated = loginState.isAuthenticated || socialState.isAuthenticated;
  const displayName = loginState.user || socialState.user?.loggedInUser || socialState.user?.displayName || "Guest";

  // TODO: restore role check before production — const isAdmin = isAuthenticated && (loginState.isAdmin || socialState.isAdmin);
  const isAdmin = true;

  const handleLogout = () => {
    dispatch(userLogout());
    dispatch(socialLogout());
    navigate("/login");
  };

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'favorites', icon: Heart, label: 'Favorites', path: '/favorites' },
    { id: 'library', icon: Library, label: 'Library', path: '/library' },
    { id: 'upload', icon: Upload, label: 'Upload', path: '/upload' },
    ...(isAdmin
      ? [{ id: 'admin', icon: Shield, label: 'Review Queue', path: '/admin/review' }]
      : []),
  ];

  const genres = [
    { id: 'quartet', label: 'Quartet', path: '/genre/quartet' },
    { id: 'chorale', label: 'Chorale', path: '/genre/chorale' },
    { id: 'acapella', label: 'Acapella', path: '/genre/acapella' },
    { id: 'hymns', label: 'Hymns', path: '/genre/hymns' },
    { id: 'oldtimers', label: 'Old Timers', path: '/genre/oldtimers' },
    { id: 'live', label: 'Live Performance', path: '/genre/live' },
  ];

  return (
    <>
      {/* Backdrop — full screen in overlay mode, mobile-only otherwise */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-black/50 z-40 ${overlay ? "" : "lg:hidden"}`}
            onClick={onToggleCollapse}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: overlay ? 280 : (isCollapsed ? 80 : 280),
          x: overlay ? (isCollapsed ? -290 : 0) : 0,
        }}
        className="fixed left-0 top-0 h-full bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col border-r border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Headphones className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900 dark:text-white text-lg">AdventPercent</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Music Streaming</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Scrollable middle — nav + genres grow to fill available height and scroll if needed.
            Scrollbar is invisible (globally hidden in index.css). */}
        <div className="flex-1 overflow-y-auto">

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link key={item.id} to={item.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 relative ${
                    isActive
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Icon size={20} />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Tooltip for collapsed state */}
                  <AnimatePresence>
                    {isCollapsed && hoveredItem === item.id && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg whitespace-nowrap z-50"
                      >
                        {item.label}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Genres Section */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-4 border-t border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Music size={16} className="text-gray-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Genres</h3>
              </div>
              
              <div className="space-y-1">
                {genres.map((genre) => {
                  const isActive = location.pathname === genre.path;
                  return (
                    <Link key={genre.id} to={genre.path}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className={`w-full text-left p-2 text-sm rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'text-green-600 bg-green-50 dark:bg-green-900/30 font-medium'
                            : 'text-gray-600 dark:text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}
                      >
                        {genre.label}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        </div>{/* end scrollable middle */}

        {/* Footer — user info + logout */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
          {/* User info row */}
          <AnimatePresence>
            {!isCollapsed && isAuthenticated && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-3 px-1"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <User size={14} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{displayName}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Signed in</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logout / Login button */}
          {isAuthenticated ? (
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors relative"
              onMouseEnter={() => setHoveredItem('logout')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <LogOut size={20} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium text-sm"
                  >
                    Sign Out
                  </motion.span>
                )}
              </AnimatePresence>
              {/* Tooltip */}
              <AnimatePresence>
                {isCollapsed && hoveredItem === 'logout' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg whitespace-nowrap z-50"
                  >
                    Sign Out
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ) : (
            <Link to="/login">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center space-x-3 p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                onMouseEnter={() => setHoveredItem('login')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <LogIn size={20} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-medium text-sm"
                    >
                      Sign In
                    </motion.span>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {isCollapsed && hoveredItem === 'login' && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg whitespace-nowrap z-50"
                    >
                      Sign In
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          )}

          {/* Copyright */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center pt-1"
              >
                <p className="text-xs text-gray-400 dark:text-gray-500">© {currentYear} AdventPercent</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
  overlay: PropTypes.bool,
};

export default Sidebar;