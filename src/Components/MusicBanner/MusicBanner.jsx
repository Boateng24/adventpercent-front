import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Play, Pause, Volume2, ChevronLeft, ChevronRight } from "lucide-react";
import PropTypes from "prop-types";
import { getDefaultImage } from "../../utils/defaultImages";

const SLIDES = [
  {
    url: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    label: "Live Performances",
  },
  {
    url: "https://images.pexels.com/photos/7672255/pexels-photo-7672255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    label: "Choral Excellence",
  },
  {
    url: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    label: "Worship Nights",
  },
  {
    url: "https://images.pexels.com/photos/164907/pexels-photo-164907.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    label: "Sacred Music",
  },
  {
    url: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    label: "Gospel Concerts",
  },
  {
    url: "https://images.pexels.com/photos/210764/pexels-photo-210764.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    label: "Praise & Worship",
  },
];

const SLIDE_INTERVAL = 5000;

const MusicBanner = ({ currentSong, isPlaying, onPlayPause }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const intervalRef = useRef(null);

  const isSongActive = Boolean(currentSong);

  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSlideIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_INTERVAL);
  };

  // Auto-advance only when no song is active
  useEffect(() => {
    if (!isSongActive) {
      startInterval();
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isSongActive]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = (index) => {
    setSlideIndex(index);
    // Reset timer so it doesn't jump immediately after a manual nav
    if (!isSongActive) startInterval();
  };

  const prev = () => goTo((slideIndex - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((slideIndex + 1) % SLIDES.length);

  const backgroundImage = isSongActive
    ? (currentSong.image || getDefaultImage(currentSong))
    : SLIDES[slideIndex].url;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full h-48 sm:h-64 lg:h-80 rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl mb-4 sm:mb-6 lg:mb-8"
    >
      {/* Sliding background images */}
      <AnimatePresence mode="sync">
        <motion.div
          key={backgroundImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-24 sm:h-24 bg-white/10 rounded-full animate-pulse" />
        <div className="absolute top-1/4 -left-4 sm:-left-8 w-8 h-8 sm:w-16 sm:h-16 bg-green-400/20 rounded-full animate-bounce" />
        <div className="absolute bottom-1/4 right-1/4 w-6 h-6 sm:w-12 sm:h-12 bg-blue-400/20 rounded-full animate-pulse" />
      </div>

      {/* Manual nav arrows — only when slideshow is active */}
      {!isSongActive && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Content */}
      <div className="relative h-full flex items-end p-4 sm:p-6 lg:p-8">
        <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8 w-full">

          {/* Album Art — shown only when a song is active */}
          {isSongActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="relative group flex-shrink-0"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white/20">
                <img
                  src={currentSong.image || getDefaultImage(currentSong)}
                  alt={currentSong.title || "Music"}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = getDefaultImage(currentSong); }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onPlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 lg:p-4">
                  {isPlaying
                    ? <Pause className="text-gray-900" size={16} />
                    : <Play className="text-gray-900 ml-1" size={16} />}
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* Text Info */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {isSongActive ? (
                <motion.div
                  key={currentSong.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                    <div className="flex items-center space-x-1 sm:space-x-2 bg-green-500/20 backdrop-blur-sm rounded-full px-2 sm:px-4 py-1 sm:py-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 text-xs sm:text-sm font-medium uppercase tracking-wide">
                        {isPlaying ? "Now Playing" : "Paused"}
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
                              animate={{ height: [6, 16, 6] }}
                              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <h1 className="text-white text-xl sm:text-2xl lg:text-4xl font-bold mb-1 sm:mb-2 leading-tight truncate">
                    {currentSong.title || "Unknown Title"}
                  </h1>
                  <p className="text-white/80 text-sm sm:text-lg lg:text-xl mb-1 truncate">
                    {currentSong.artist || "Unknown Artist"}
                  </p>
                  {currentSong.album && (
                    <p className="text-white/60 text-xs sm:text-base hidden sm:block truncate">
                      From {currentSong.album}
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key={`slide-${slideIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                    <div className="flex items-center space-x-1 sm:space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-2 sm:px-4 py-1 sm:py-2">
                      <Music size={12} className="text-white/70" />
                      <span className="text-white/70 text-xs sm:text-sm font-medium uppercase tracking-wide">
                        AdventPercent
                      </span>
                    </div>
                  </div>
                  <h1 className="text-white text-xl sm:text-2xl lg:text-4xl font-bold mb-1 sm:mb-2 leading-tight">
                    {SLIDES[slideIndex].label}
                  </h1>
                  <p className="text-white/70 text-sm sm:text-base lg:text-lg">
                    Select a song to start playing
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Decorative Music Icon */}
          <motion.div
            animate={{
              rotate: isPlaying ? 360 : 0,
              scale: isPlaying ? [1, 1.1, 1] : 1,
            }}
            transition={{
              rotate: { duration: 10, repeat: isPlaying ? Infinity : 0, ease: "linear" },
              scale: { duration: 2, repeat: isPlaying ? Infinity : 0 },
            }}
            className="text-white/20 hidden lg:block"
          >
            <Music size={48} className="lg:w-16 lg:h-16" />
          </motion.div>
        </div>
      </div>

      {/* Slide indicator dots — only when no song is active */}
      {!isSongActive && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === slideIndex
                  ? "w-4 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{ left: `${20 + i * 15}%`, top: `${30 + (i % 2) * 40}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>
    </motion.div>
  );
};

MusicBanner.propTypes = {
  currentSong: PropTypes.object,
  isPlaying: PropTypes.bool,
  onPlayPause: PropTypes.func,
};

export default MusicBanner;
