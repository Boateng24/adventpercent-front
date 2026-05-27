import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Heart, Download } from "lucide-react";
import PropTypes from "prop-types";

const SongCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
    <div className="p-3 sm:p-4 space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
    </div>
  </div>
);

const SongCard = ({ song, isPlaying, isCurrentSong, onPlay, onLike, onDownload }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const defaultImage = "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400";

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden mt-4 sm:mt-6"
      style={{ height: 'auto' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageError ? defaultImage : (song?.image || defaultImage)}
          alt={song?.title || "Music"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={handleImageError}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
        
        {/* Play Button */}
        <AnimatePresence>
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onPlay(song)}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 sm:p-4 shadow-lg">
                {isPlaying && isCurrentSong ? (
                  <Pause className="text-gray-900" size={20} />
                ) : (
                  <Play className="text-gray-900 ml-1" size={20} />
                )}
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex space-x-1 sm:space-x-2">
          <AnimatePresence>
            {isHovered && (
              <>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onLike(song)}
                  className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-white transition-colors"
                >
                  <Heart size={14} className="sm:w-4 sm:h-4 text-gray-700" />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDownload(song)}
                  className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-white transition-colors"
                >
                  <Download size={14} className="sm:w-4 sm:h-4 text-gray-700" />
                </motion.button>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Playing Indicator */}
        {isPlaying && isCurrentSong && (
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
            <div className="flex items-center space-x-1 bg-green-500 rounded-full px-2 py-1">
              <div className="flex space-x-0.5">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 h-2 sm:h-3 bg-white rounded-full"
                    animate={{
                      height: [6, 12, 6],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
              <span className="text-white text-xs font-medium hidden sm:inline">Playing</span>
            </div>
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="p-2 sm:p-3">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1 text-sm sm:text-base">
          {song?.title || "Unknown Title"}
        </h3>
        <div className="flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm truncate flex-1 mr-2">
            {song?.artist || "Unknown Artist"}
          </p>
          {song?.duration && (
            <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm flex-shrink-0">
              {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, "0")}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const SongGrid = ({ 
  songs = [], 
  isLoading, 
  currentSong, 
  isPlaying, 
  onSongPlay,
  onSongLike,
  onSongDownload,
}) => {
  const handlePlay = useCallback((song) => {
    onSongPlay(song);
  }, [onSongPlay]);

  const handleLike = useCallback((song) => {
    onSongLike?.(song);
  }, [onSongLike]);

  const handleDownload = useCallback((song) => {
    onSongDownload?.(song);
  }, [onSongDownload]);

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between"
        >
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-32 sm:w-48 animate-pulse" />
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20 animate-pulse" />
        </motion.div>

        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6"
        >
          {[...Array(10)].map((_, index) => (
            <SongCardSkeleton key={index} />
          ))}
        </motion.div>
      </div>
    );
  }

  if (!songs.length) {
    return (
      <div className="text-center py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto px-4"
        >
          <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <Play className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">No songs available</h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Check back later for new music releases, or try refreshing the page.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div 
        layout
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6"
      >
        <AnimatePresence>
          {songs.map((song, index) => (
            <SongCard
              key={song?.id || index}
              song={song}
              isPlaying={isPlaying}
              isCurrentSong={currentSong?.id === song?.id}
              onPlay={handlePlay}
              onLike={handleLike}
              onDownload={handleDownload}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

SongCard.propTypes = {
  song: PropTypes.object.isRequired,
  isPlaying: PropTypes.bool,
  isCurrentSong: PropTypes.bool,
  onPlay: PropTypes.func.isRequired,
  onLike: PropTypes.func,
  onDownload: PropTypes.func
};

SongGrid.propTypes = {
  songs: PropTypes.array,
  isLoading: PropTypes.bool,
  currentSong: PropTypes.object,
  isPlaying: PropTypes.bool,
  onSongPlay: PropTypes.func.isRequired,
  onSongLike: PropTypes.func,
  onSongDownload: PropTypes.func,
  title: PropTypes.string
};

export default SongGrid;