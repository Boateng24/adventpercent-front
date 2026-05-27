import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Clock, X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import PropTypes from "prop-types";

const options = [
  {
    value: "light",
    icon: Sun,
    label: "Light",
    description: "Always use light mode",
  },
  {
    value: "dark",
    icon: Moon,
    label: "Dark",
    description: "Always use dark mode",
  },
  {
    value: "auto",
    icon: Clock,
    label: "Auto",
    description: "Dark 7 PM – 7 AM, light otherwise",
  },
];

const SettingsPanel = ({ isOpen, onClose }) => {
  const { preference, setPreference } = useTheme();
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">
              Settings
            </h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={15} className="text-gray-500 dark:text-gray-400" />
            </motion.button>
          </div>

          {/* Appearance section */}
          <div className="px-5 py-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Appearance
            </p>
            <div className="space-y-2">
              {options.map(({ value, icon: Icon, label, description }) => {
                const isActive = preference === value;
                return (
                  <motion.button
                    key={value}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPreference(value)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 p-1.5 rounded-lg ${
                        isActive
                          ? "bg-white/20"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={isActive ? "text-white" : "text-gray-600 dark:text-gray-300"}
                      />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-medium ${isActive ? "text-white" : ""}`}>
                        {label}
                      </p>
                      <p
                        className={`text-xs ${
                          isActive ? "text-white/70" : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {description}
                      </p>
                    </div>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-white/80 flex-shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Footer note */}
          <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
              AdventPercent · More settings coming soon
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

SettingsPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SettingsPanel;
