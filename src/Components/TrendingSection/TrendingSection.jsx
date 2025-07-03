import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Play, Pause, Clock, Music } from "lucide-react";
import { truncateString } from "../../helpers/truncate";
import { getTrendingSongs } from "../../api/songs/songs";
import PropTypes from "prop-types";

const TrendingSection = ({ currentSong, isPlaying, onSongPlay }) => {
  const [trending, setTrending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
   const fetchTrendings = async () => {
  try {
    setIsLoading(true);
    const data = await getTrendingSongs();
    setTrending(data.map(item => item.song)); // Map to song objects
    setError(null);
  } catch (error) {
    console.error("Error fetching trending songs:", error);
    setError("Failed to load trending songs");
  } finally {
    setIsLoading(false);
  }
};

    fetchTrendings();
  }, []);


  const defaultImage = "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400";

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-4"
    >
      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
        <TrendingUp className="text-orange-500" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Trending Songs Yet</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        Songs will appear here as they gain popularity. Check back soon to discover what&apos;s trending!
      </p>
      <div className="mt-6 flex justify-center">
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-orange-300 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

  const LoadingState = () => (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="h-3 bg-gray-200 rounded w-12" />
        </div>
      ))}
    </div>
  );

  const ErrorState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-4"
    >
      <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <Music className="text-red-500" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Trending</h3>
      <p className="text-gray-600 text-sm">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        Try Again
      </button>
    </motion.div>
  );

  return (
    <div className="sticky top-0 bg-white rounded-xl shadow-lg overflow-hidden h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 rounded-full p-2">
            <TrendingUp className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Trending This Week</h2>
            <p className="text-orange-100 text-sm">Most popular songs right now</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="overflow-y-auto"
        style={{
          maxHeight: 'calc(100vh - 200px)', // Adjust 200px to your header height
          scrollBehavior: 'smooth'
        }}>
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : trending.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-gray-100">
            <AnimatePresence>
              {trending.map((song, index) => (
                <motion.div
                  key={song?.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSongPlay?.(song)}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 text-center">
                    <span className="text-lg font-bold text-gray-400 group-hover:text-orange-500 transition-colors">
                      {index + 1}
                    </span>
                  </div>

                  {/* Album Art */}
                  <div className="relative flex-shrink-0 ml-4">
                    <img
                      className="w-12 h-12 rounded-lg object-cover shadow-md"
                      src={song?.image || defaultImage}
                      alt={song?.title || "Song"}
                      onError={(e) => {
                        e.target.src = defaultImage;
                      }}
                    />
                    
                    {/* Play/Pause Overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {isPlaying && currentSong?.id === song?.id ? (
                        <Pause className="text-white" size={16} />
                      ) : (
                        <Play className="text-white ml-0.5" size={16} />
                      )}
                    </div>

                    {/* Playing Indicator */}
                    {isPlaying && currentSong?.id === song?.id && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    )}
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 ml-4 min-w-0">
  <div className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
    {song?.title ? truncateString(song.title, 20) : "Unknown Title"}
    {song.rank <= 3 && (
      <span className="ml-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-0.5 rounded-full">
        #{song.rank}
      </span>
    )}
  </div>
  <div className="text-sm text-gray-500">
    {song?.artist ? truncateString(song.artist, 18) : "Unknown Artist"}
    {song.playVelocity > 0.5 && (
      <span className="ml-2 text-green-500 flex items-center">
        <TrendingUp size={12} className="mr-1" />
        {Math.round(song.playVelocity * 100)}%
      </span>
    )}
  </div>
</div>

                  {/* Duration */}
                  <div className="flex-shrink-0 flex items-center text-gray-400 text-sm">
                    <Clock size={14} className="mr-1" />
                    {song?.duration ? (
                      `${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, "0")}`
                    ) : (
                      "0:00"
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

TrendingSection.propTypes = {
  currentSong: PropTypes.object,
  isPlaying: PropTypes.bool,
  onSongPlay: PropTypes.func
};

export default TrendingSection;