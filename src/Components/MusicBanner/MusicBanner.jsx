import { motion } from "framer-motion";
import { Music, Play, Pause, Volume2 } from "lucide-react";
import PropTypes from "prop-types";

const MusicBanner = ({ currentSong, isPlaying, onPlayPause }) => {
  const defaultImage = "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 w-full h-48 sm:h-64 lg:h-80 rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl mb-4 sm:mb-6 lg:mb-8"
      style={{
        marginBottom: '-1rem', // Pulls up the content underneath
      }}
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${currentSong?.image || defaultImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-24 sm:h-24 bg-white/10 rounded-full animate-pulse" />
        <div className="absolute top-1/4 -left-4 sm:-left-8 w-8 h-8 sm:w-16 sm:h-16 bg-green-400/20 rounded-full animate-bounce" />
        <div className="absolute bottom-1/4 right-1/4 w-6 h-6 sm:w-12 sm:h-12 bg-blue-400/20 rounded-full animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end p-4 sm:p-6 lg:p-8">
        <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8 w-full">
          {/* Album Art */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative group flex-shrink-0"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white/20">
              <img
                src={currentSong?.image || defaultImage}
                alt={currentSong?.title || "Music"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />
            </div>
            
            {/* Play/Pause Overlay */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onPlayPause}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 lg:p-4">
                {isPlaying ? (
                  <Pause className="text-gray-900" size={16} />
                ) : (
                  <Play className="text-gray-900 ml-1" size={16} />
                )}
              </div>
            </motion.button>
          </motion.div>

          {/* Song Info */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <div className="flex items-center space-x-1 sm:space-x-2 bg-green-500/20 backdrop-blur-sm rounded-full px-2 sm:px-4 py-1 sm:py-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-xs sm:text-sm font-medium uppercase tracking-wide">
                    {isPlaying ? 'Now Playing' : 'Paused'}
                  </span>
                </div>
                {isPlaying && (
                  <div className="hidden sm:flex items-center space-x-1">
                    <Volume2 className="text-white/60" size={14} />
                    <div className="flex space-x-0.5">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-0.5 bg-white/60 rounded-full"
                          animate={{
                            height: [6, 16, 6],
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
              
              <h1 className="text-white text-xl sm:text-2xl lg:text-4xl font-bold mb-1 sm:mb-2 lg:mb-3 leading-tight">
                {currentSong?.title || "Select a song to play"}
              </h1>
              <p className="text-white/80 text-sm sm:text-lg lg:text-xl mb-2 sm:mb-4">
                {currentSong?.artist || "Unknown Artist"}
              </p>
              
              {currentSong?.album && (
                <p className="text-white/60 text-xs sm:text-base lg:text-lg hidden sm:block">
                  From {currentSong.album}
                </p>
              )}
            </motion.div>
          </div>

          {/* Decorative Music Icon */}
          <motion.div
            animate={{ 
              rotate: isPlaying ? 360 : 0,
              scale: isPlaying ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              rotate: { duration: 10, repeat: isPlaying ? Infinity : 0, ease: "linear" },
              scale: { duration: 2, repeat: isPlaying ? Infinity : 0 }
            }}
            className="text-white/20 hidden lg:block"
          >
            <Music size={48} className="lg:w-16 lg:h-16" />
          </motion.div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

MusicBanner.propTypes = {
  currentSong: PropTypes.object,
  isPlaying: PropTypes.bool,
  onPlayPause: PropTypes.func
};

export default MusicBanner;