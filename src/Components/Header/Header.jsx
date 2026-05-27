import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Bell, Settings, Menu, TrendingUp } from "lucide-react";
import UserProfile from "../UserProfile/UserProfile";
import SearchBar from "../SearchBar/SearchBar";
import SettingsPanel from "../Settings/SettingsPanel";
import PropTypes from "prop-types";
import { searchSongs } from "../../api/songs/songs";

const Header = ({
  onSearchSong,
  title = "Discover Music",
  subtitle = "Find your next favorite song",
  onMenuClick,
  onTrendingClick,
}) => {
  const [notifications] = useState(3);
  const [searchResults, setSearchResults] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  const handleSearch = async (query) => {
    if (query.trim().length >= 2) {
      try {
        const results = await searchSongs(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6">

        {/* Menu toggle */}
        {onMenuClick && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors mr-2 flex-shrink-0"
          >
            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
          </motion.button>
        )}

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-shrink-0"
        >
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block truncate">
            {subtitle}
          </p>
        </motion.div>

        {/* Search */}
        <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-2 sm:mx-4 lg:mx-8">
          <motion.div whileHover={{ scale: 1.02 }}>
            <SearchBar
              onSongSelect={onSearchSong}
              onSearch={handleSearch}
              results={searchResults}
              placeholder="Search songs, artists, albums..."
              className="w-full"
            />
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:flex relative p-2 lg:p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <Bell size={16} className="sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center text-[10px] lg:text-xs">
                {notifications}
              </span>
            )}
          </motion.button>

          {/* Settings */}
          <div ref={settingsRef} className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSettingsOpen((o) => !o)}
              className={`hidden sm:flex p-2 lg:p-3 rounded-full transition-colors ${
                settingsOpen
                  ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Settings
                size={16}
                className={`sm:w-5 sm:h-5 ${settingsOpen ? "text-white" : "text-gray-600 dark:text-gray-300"}`}
              />
            </motion.button>
            <SettingsPanel
              isOpen={settingsOpen}
              onClose={() => setSettingsOpen(false)}
            />
          </div>

          {/* Trending toggle */}
          {onTrendingClick && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onTrendingClick}
              className="p-2 lg:p-3 bg-gradient-to-r from-green-500 to-blue-500 hover:shadow-md rounded-full transition-all"
              title="Trending songs"
            >
              <TrendingUp size={16} className="sm:w-5 sm:h-5 text-white" />
            </motion.button>
          )}

          {/* User Profile */}
          <UserProfile />
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  onSearchSong: PropTypes.func.isRequired,
  songs: PropTypes.array,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onMenuClick: PropTypes.func,
  onTrendingClick: PropTypes.func,
};

export default Header;
