import { useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  Heart, 
  Download, 
  Share2, 
  Clock,
  Calendar,
  Music,
  User,
  Album,
  X
} from "lucide-react";
import PropTypes from "prop-types";

const SongDetails = ({ 
  song, 
  isPlaying, 
  onPlay, 
  onLike, 
  onDownload, 
  onClose,
  isVisible = false 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const defaultImage = "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600";

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(song);
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const formatDuration = (duration) => {
    if (!duration) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!song || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <div className="relative">
          <div 
            className="h-48 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${song.image || defaultImage})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <X className="text-white" size={20} />
              </button>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-white text-2xl font-bold mb-1">Song Details</h2>
              <p className="text-white/80">Complete information about this track</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start space-x-6">
            {/* Album Art */}
            <div className="flex-shrink-0">
              <img
                src={song.image || defaultImage}
                alt={song.title}
                className="w-32 h-32 rounded-xl object-cover shadow-lg"
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />
            </div>

            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {song.title || "Unknown Title"}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {song.artist || "Unknown Artist"}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPlay(song)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  className={`p-3 rounded-full transition-colors ${
                    isLiked 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDownload?.(song)}
                  className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-500 transition-colors"
                >
                  <Download size={20} />
                </motion.button>

                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-green-50 hover:text-green-500 transition-colors"
                  >
                    <Share2 size={20} />
                  </motion.button>

                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[150px] z-10"
                      >
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors">
                          Copy Link
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors">
                          Share on Twitter
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors">
                          Share on Facebook
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Song Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Artist</p>
                    <p className="font-medium text-gray-900">{song.artist || "Unknown"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Album className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Album</p>
                    <p className="font-medium text-gray-900">{song.album || "Single"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Music className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Genre</p>
                    <p className="font-medium text-gray-900">{song.genre || "Unknown"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">{formatDuration(song.duration)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Release Date</p>
                    <p className="font-medium text-gray-900">{song.releaseDate || "Unknown"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Music className="text-gray-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Plays</p>
                    <p className="font-medium text-gray-900">{song.plays || "0"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {song.description && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">About this song</h3>
              <p className="text-gray-600 leading-relaxed">{song.description}</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

SongDetails.propTypes = {
  song: PropTypes.object,
  isPlaying: PropTypes.bool,
  onPlay: PropTypes.func,
  onLike: PropTypes.func,
  onDownload: PropTypes.func,
  onClose: PropTypes.func,
  isVisible: PropTypes.bool
};

export default SongDetails;