import { motion } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import PropTypes from "prop-types";

const MiniPlayer = ({ 
  currentSong, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious,
  onExpand 
}) => {
  const defaultImage = "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=100";

  if (!currentSong) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-30 cursor-pointer"
      onClick={onExpand}
    >
      <div className="flex items-center space-x-3">
        <img
          src={currentSong.image || defaultImage}
          alt={currentSong.title}
          className="w-12 h-12 rounded-lg object-cover"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900 truncate text-sm">
            {currentSong.title || "Unknown Title"}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {currentSong.artist || "Unknown Artist"}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <SkipBack size={16} className="text-gray-600" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayPause();
            }}
            className="p-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full hover:shadow-lg transition-all"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <SkipForward size={16} className="text-gray-600" />
          </button>
        </div>

        {isPlaying && (
          <div className="flex items-center space-x-1">
            <Volume2 size={14} className="text-green-500" />
            <div className="flex space-x-0.5">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 h-3 bg-green-500 rounded-full"
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
          </div>
        )}
      </div>
    </motion.div>
  );
};

MiniPlayer.propTypes = {
  currentSong: PropTypes.object,
  isPlaying: PropTypes.bool,
  onPlayPause: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onExpand: PropTypes.func.isRequired
};

export default MiniPlayer;