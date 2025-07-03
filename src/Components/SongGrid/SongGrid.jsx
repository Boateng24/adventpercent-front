import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Heart, Download } from "lucide-react";
import PropTypes from "prop-types";

const SongCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
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
      className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden mt-6"
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
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                {isPlaying && isCurrentSong ? (
                  <Pause className="text-gray-900" size={24} />
                ) : (
                  <Play className="text-gray-900 ml-1" size={24} />
                )}
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
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
                  className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                >
                  <Heart size={16} className="text-gray-700" />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDownload(song)}
                  className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                >
                  <Download size={16} className="text-gray-700" />
                </motion.button>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Playing Indicator */}
        {isPlaying && isCurrentSong && (
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center space-x-1 bg-green-500 rounded-full px-2 py-1">
              <div className="flex space-x-0.5">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 h-3 bg-white rounded-full"
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
              <span className="text-white text-xs font-medium">Playing</span>
            </div>
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 truncate mb-1">
          {song?.title || "Unknown Title"}
        </h3>
        <div className="flex justify-between items-center"> {/* Added flex container */}
          <p className="text-gray-600 text-sm truncate">
            {song?.artist || "Unknown Artist"}
          </p>
          {song?.duration && (
            <p className="text-gray-400 text-sm">
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
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between"
        >
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
        </motion.div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
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
      <div className="text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Play className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No songs available</h3>
          <p className="text-gray-600">
            Check back later for new music releases, or try refreshing the page.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
    
      </motion.div>

      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
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