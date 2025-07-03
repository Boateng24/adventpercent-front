import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  List, 
  X, 
  Play, 
  Pause, 
  MoreHorizontal, 
  Shuffle,
  Repeat,
  Heart,
  Download
} from "lucide-react";
import PropTypes from "prop-types";

const QueuePanel = ({ 
  isOpen, 
  onClose, 
  playlist = [], 
  currentSong, 
  currentIndex, 
  isPlaying,
  onSongSelect,
  onSongLike,
  onSongDownload,
  onShuffle,
  onRepeat,
  isShuffled,
  isRepeating
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const defaultImage = "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=100";

  const formatDuration = (duration) => {
    if (!duration) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Queue Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <List className="text-gray-700" size={24} />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Queue</h2>
                  <p className="text-sm text-gray-500">{playlist.length} songs</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <button
                  onClick={onShuffle}
                  className={`p-2 rounded-full transition-colors ${
                    isShuffled 
                      ? 'bg-green-100 text-green-600' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <Shuffle size={16} />
                </button>
                <button
                  onClick={onRepeat}
                  className={`p-2 rounded-full transition-colors ${
                    isRepeating 
                      ? 'bg-green-100 text-green-600' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <Repeat size={16} />
                </button>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MoreHorizontal size={16} className="text-gray-600" />
              </button>
            </div>

            {/* Queue List */}
            <div className="flex-1 overflow-y-auto">
              {playlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <List className="text-gray-300 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No songs in queue</h3>
                  <p className="text-gray-500">Add songs to see them here</p>
                </div>
              ) : (
                <div className="py-2">
                  {playlist.map((song, index) => {
                    const isCurrentSong = currentSong?.id === song.id;
                    const isHovered = hoveredIndex === index;
                    
                    return (
                      <motion.div
                        key={song.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center p-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          isCurrentSong 
                            ? 'bg-green-50 border border-green-200' 
                            : isHovered 
                            ? 'bg-gray-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => onSongSelect(song, index)}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(-1)}
                      >
                        {/* Track Number / Play Button */}
                        <div className="flex-shrink-0 w-8 flex items-center justify-center">
                          {isCurrentSong && isPlaying ? (
                            <div className="flex space-x-0.5">
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-0.5 h-4 bg-green-500 rounded-full"
                                  animate={{
                                    height: [8, 16, 8],
                                  }}
                                  transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                  }}
                                />
                              ))}
                            </div>
                          ) : isHovered ? (
                            <Play size={14} className="text-gray-600" />
                          ) : (
                            <span className={`text-sm ${
                              isCurrentSong ? 'text-green-600 font-medium' : 'text-gray-400'
                            }`}>
                              {index + 1}
                            </span>
                          )}
                        </div>

                        {/* Song Info */}
                        <div className="flex items-center flex-1 min-w-0 ml-3">
                          <img
                            src={song.image || defaultImage}
                            alt={song.title}
                            className="w-10 h-10 rounded-md object-cover"
                            onError={(e) => {
                              e.target.src = defaultImage;
                            }}
                          />
                          <div className="ml-3 flex-1 min-w-0">
                            <p className={`font-medium truncate ${
                              isCurrentSong ? 'text-green-600' : 'text-gray-900'
                            }`}>
                              {song.title || "Unknown Title"}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {song.artist || "Unknown Artist"}
                            </p>
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="flex-shrink-0 text-sm text-gray-400 mr-2">
                          {formatDuration(song.duration)}
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex items-center space-x-1">
                          {isHovered && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSongLike(song);
                                }}
                                className="p-1 hover:bg-white rounded-full transition-colors"
                              >
                                <Heart size={14} className="text-gray-400 hover:text-red-500" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSongDownload(song);
                                }}
                                className="p-1 hover:bg-white rounded-full transition-colors"
                              >
                                <Download size={14} className="text-gray-400 hover:text-blue-500" />
                              </button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

QueuePanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  playlist: PropTypes.array,
  currentSong: PropTypes.object,
  currentIndex: PropTypes.number,
  isPlaying: PropTypes.bool,
  onSongSelect: PropTypes.func.isRequired,
  onSongLike: PropTypes.func,
  onSongDownload: PropTypes.func,
  onShuffle: PropTypes.func,
  onRepeat: PropTypes.func,
  isShuffled: PropTypes.bool,
  isRepeating: PropTypes.bool
};

export default QueuePanel;