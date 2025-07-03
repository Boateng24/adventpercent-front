import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import PropTypes from "prop-types";
import { getSongDetails } from "../../api/songs/songs";

const SearchBar = ({ 
  onSongSelect,
  onSearch,
  className = "",
  placeholder = "Search songs, artists, genre, album...",
  results = []
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const isMounted = useRef(false);

  const clearQuery = () => {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    // Skip the initial render
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    // Only search when query has at least 2 characters
    if (query.trim().length >= 2) {
      const debounceTimer = setTimeout(() => {
        onSearch(query);
      }, 300);
      
      return () => clearTimeout(debounceTimer);
    } else {
      // Clear results when query is too short
      onSearch("");
    }
  }, [query]); // Removed onSearch from dependencies

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className={`flex items-center rounded-full px-4 py-2 transition-all duration-200 ${
        isFocused 
          ? "bg-white shadow-md" 
          : "bg-gray-100 hover:bg-gray-200"
      }`}>
        <Search className="mr-2 text-gray-500" size={18} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="bg-transparent border-none outline-none w-full text-gray-800 placeholder-gray-500 focus:ring-0 focus:border-none focus:outline-none"
          style={{boxShadow: 'none'}}
        />
        {query && (
          <button 
            onClick={clearQuery} 
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isFocused && query.length >= 2 && results.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto">
          {results.map((song) => (
            <div
              key={song.id}
              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
              onClick={async (e) => {
                e.preventDefault();
                try {
                  const fullSong = await getSongDetails(song.id);
                  onSongSelect(fullSong);
                  setQuery(fullSong.title);
                  setIsFocused(false);
                } catch (error) {
                  console.error("Error playing song:", error);
                }
              }}
            >
              <img 
                src={song.image || "https://via.placeholder.com/40"} 
                alt={song.title}
                className="w-10 h-10 rounded mr-3"
              />
              <div>
                <p className="font-medium text-gray-900">{song.title}</p>
                <p className="text-sm text-gray-600">{song.artist}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  onSongSelect: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  results: PropTypes.array
};

export default SearchBar;