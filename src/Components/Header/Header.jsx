import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Settings } from "lucide-react";
import UserProfile from "../UserProfile/UserProfile";
import SearchBar from "../SearchBar/SearchBar";
import PropTypes from "prop-types";
import { searchSongs } from "../../api/songs/songs";

const Header = ({ 
  onSearchSong, 
  title = "Discover Music", 
  subtitle = "Find your next favorite song" 
}) => {
  const [notifications] = useState(3);
  const [searchResults, setSearchResults] = useState([]);

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
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center justify-between p-4">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </motion.div>

        {/* Search Bar - Center */}
        <div className="flex-1 max-w-md mx-8">
          <motion.div whileHover={{ scale: 1.02 }}>
            <SearchBar
              onSongSelect={onSearchSong}
              onSearch={handleSearch}
              results={searchResults}
              placeholder="Search songs, artists, genres, albums..."
              className="w-full"
            />
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Bell size={20} className="text-gray-600" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Settings size={20} className="text-gray-600" />
          </motion.button>

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
  subtitle: PropTypes.string
};

export default Header;