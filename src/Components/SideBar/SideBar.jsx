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
  Headphones
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const SideBar = ({ isCollapsed, onToggleCollapse }) => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'favorites', icon: Heart, label: 'Favorites', path: '/favorites' },
    { id: 'library', icon: Library, label: 'Library', path: '/library' },
    { id: 'upload', icon: Upload, label: 'Upload', path: '/upload' },
  ];

  const genres = [
    { id: 'quartet', label: 'Quartet', path: '/genre/quartet' },
    { id: 'chorale', label: 'Chorale', path: '/genre/chorale' },
    { id: 'acapella', label: 'Acapella', path: '/genre/acapella' },
    { id: 'oldtimers', label: 'Old Timers', path: '/genre/oldtimers' },
    { id: 'live', label: 'Live Performance', path: '/genre/live' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onToggleCollapse}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 280,
          x: 0
        }}
        className="fixed left-0 top-0 h-full bg-white shadow-2xl z-50 flex flex-col border-r border-gray-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
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
                  <h1 className="font-bold text-gray-900 text-lg">AdventPercent</h1>
                  <p className="text-xs text-gray-500">Music Streaming</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
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
                      : 'hover:bg-gray-100 text-gray-700'
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
                        className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-50"
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
              className="p-4 border-t border-gray-100"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Music size={16} className="text-gray-500" />
                <h3 className="font-semibold text-gray-900 text-sm">Genres</h3>
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
                            ? 'text-green-600 bg-green-50 font-medium'
                            : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
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

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <p className="text-xs text-gray-500">© {currentYear} AdventPercent</p>
                <p className="text-xs text-gray-400">Adventist Music for everyone</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

SideBar.propTypes = {
  isCollapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func
};

export default SideBar;