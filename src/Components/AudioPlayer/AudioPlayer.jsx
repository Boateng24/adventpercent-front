import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle,
  Heart,
  Download,
  ChevronUp,
  ChevronDown,
  X,
  MoreHorizontal
} from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import PropTypes from "prop-types";

const AudioPlayer = ({ 
  currentSong, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious,
  playlist = [],
  currentIndex = 0,
  onSongLike,
  onSongDownload, 
  onClose 
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Keyboard shortcuts (disabled on mobile)
  useHotkeys('space', (e) => {
    if (!isMobile) {
      e.preventDefault();
      onPlayPause();
    }
  });
  useHotkeys('ctrl+right', () => !isMobile && onNext());
  useHotkeys('ctrl+left', () => !isMobile && onPrevious());
  useHotkeys('ctrl+up', () => !isMobile && setVolume(prev => Math.min(1, prev + 0.1)));
  useHotkeys('ctrl+down', () => !isMobile && setVolume(prev => Math.max(0, prev - 0.1)));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong?.track) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      console.error('Audio loading error');
    };
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleSongEnd);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    // Load new song
    audio.src = currentSong.track;
    audio.load();

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleSongEnd);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && !isLoading) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Playback failed:', error);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, isLoading]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleSongEnd = useCallback(() => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      if (playlist[randomIndex]) {
        onNext(randomIndex);
      }
    } else {
      onNext();
    }
  }, [isRepeat, isShuffle, onNext, playlist]);

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar || !duration) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onSongLike?.(currentSong);
  };

  const handleDownload = () => {
    onSongDownload?.(currentSong);
  };

  const defaultImage = "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400";

  if (!currentSong) {
    return null;
  }

  return (
    <>
      <audio
        ref={audioRef}
        preload="metadata"
      />
      
      <AnimatePresence>
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-200 dark:border-gray-700 z-40"
        >
          {/* Progress Bar */}
          <div 
            ref={progressRef}
            className="w-full h-1 bg-gray-200 cursor-pointer hover:h-2 transition-all duration-200 group"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-100 relative"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-blue-500 shadow-sm z-10"
            aria-label="Close player"
          >
            <X size={14} className="text-white" />
          </motion.button>

          <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3">
            {/* Song Info */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <img
                  src={currentSong.image || defaultImage}
                  alt={currentSong.title}
                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg object-cover shadow-lg"
                  onError={(e) => {
                    e.target.src = defaultImage;
                  }}
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-6 sm:w-6 border-b-2 border-white" />
                  </div>
                )}
              </motion.div>
              
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white truncate text-sm sm:text-base">
                  {currentSong.title || "Unknown Title"}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  {currentSong.artist || "Unknown Artist"}
                </p>
              </div>

              {/* Action buttons - Hidden on mobile, shown on tablet+ */}
              <div className="hidden md:flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className={`p-2 rounded-full transition-colors ${
                    isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDownload}
                  className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <Download size={16} />
                </motion.button>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
              {/* Shuffle - Hidden on mobile */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsShuffle(!isShuffle)}
                className={`hidden sm:flex p-2 rounded-full transition-colors ${
                  isShuffle ? 'text-green-500 bg-green-50' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Shuffle size={16} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onPrevious}
                className="p-1 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                disabled={currentIndex === 0 && !isShuffle}
              >
                <SkipBack size={16} className="sm:w-5 sm:h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPlayPause}
                disabled={isLoading}
                className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-6 sm:w-6 border-b-2 border-white" />
                ) : isPlaying ? (
                  <Pause size={16} className="sm:w-6 sm:h-6" />
                ) : (
                  <Play size={16} className="sm:w-6 sm:h-6 ml-0.5" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onNext}
                className="p-1 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                disabled={currentIndex === playlist.length - 1 && !isShuffle}
              >
                <SkipForward size={16} className="sm:w-5 sm:h-5" />
              </motion.button>

              {/* Repeat - Hidden on mobile */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsRepeat(!isRepeat)}
                className={`hidden sm:flex p-2 rounded-full transition-colors ${
                  isRepeat ? 'text-green-500 bg-green-50' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Repeat size={16} />
              </motion.button>

              {/* Mobile More Options */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="sm:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MoreHorizontal size={16} />
              </motion.button>
            </div>

            {/* Time and Volume - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-4 flex-1 justify-end">
              <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[40px] text-right">
                {formatTime(currentTime)}
              </span>
              <span className="text-sm text-gray-300 dark:text-gray-600">/</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[40px]">
                {formatTime(duration)}
              </span>

              <div 
                className="relative flex items-center space-x-2"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </motion.button>

                <AnimatePresence>
                  {showVolumeSlider && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute right-0 bottom-full mb-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
                    >
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </motion.button>
            </div>
          </div>

          {/* Expanded Player - Hidden on mobile */}
          <AnimatePresence>
            {isExpanded && !isMobile && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-6 overflow-hidden"
              >
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center space-x-6">
                    <img
                      src={currentSong.image || defaultImage}
                      alt={currentSong.title}
                      className="w-24 h-24 rounded-xl object-cover shadow-lg"
                      onError={(e) => {
                        e.target.src = defaultImage;
                      }}
                    />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {currentSong.title || "Unknown Title"}
                      </h2>
                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                        {currentSong.artist || "Unknown Artist"}
                      </p>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={handleLike}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                            isLiked 
                              ? 'bg-red-100 text-red-600' 
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                          <span>{isLiked ? 'Liked' : 'Like'}</span>
                        </button>
                        <button
                          onClick={handleDownload}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors"
                        >
                          <Download size={16} />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

AudioPlayer.propTypes = {
  currentSong: PropTypes.object,
  isPlaying: PropTypes.bool,
  onPlayPause: PropTypes.func,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  playlist: PropTypes.array,
  currentIndex: PropTypes.number,
  onSongLike: PropTypes.func,
  onSongDownload: PropTypes.func,
  onClose: PropTypes.func.isRequired
};

export default AudioPlayer;