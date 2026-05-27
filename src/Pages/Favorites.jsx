import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Play, Download, Trash2} from "lucide-react";
import Header from "../Components/Header/Header";
import Sidebar from "../Components/SideBar/SideBar";
import AudioPlayer from "../Components/AudioPlayer/AudioPlayer";
import { toast } from "react-toastify";
import { getFavorites, removeFromFavorites } from "../api/songs/songs";

const Favorites = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch {
        toast.error("Failed to load favorites");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleSongPlay = (song) => {
    const songIndex = favorites.findIndex(s => s.id === song.id);
    
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setCurrentIndex(songIndex !== -1 ? songIndex : 0);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (currentIndex < favorites.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentSong(favorites[nextIndex]);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentSong(favorites[prevIndex]);
      setIsPlaying(true);
    }
  };

  const handleRemoveFromFavorites = async (songId) => {
    try {
      await removeFromFavorites(songId);
      setFavorites(prev => prev.filter(song => song.id !== songId));
      toast.success("Removed from favorites");
      if (currentSong?.id === songId) {
        setCurrentSong(null);
        setIsPlaying(false);
      }
    } catch {
      toast.error("Failed to remove from favorites");
    }
  };

  const handleDownload = (song) => {
    toast.success(`Downloading "${song.title}"`);
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
        <Heart className="text-red-500" size={40} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No favorites yet</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        Start adding songs to your favorites by clicking the heart icon on any song you love.
      </p>
      <button
        onClick={() => window.history.back()}
        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
      >
        Discover Music
      </button>
    </motion.div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 w-screen">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <motion.div
        animate={{
          marginLeft: sidebarCollapsed ? 80 : 280
        }}
        className="flex-1 transition-all duration-300 w-full"
        style={{ marginBottom: currentSong ? '100px' : '0' }}
      >
       <Header 
          onSearchSong={handleSongPlay}
          songs={favorites}
          title="Your Favorites"
          subtitle="Songs you've loved"
        />

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading your favorites...</span>
            </div>
          ) : favorites.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Header Stats */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 mb-8 text-white"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Heart size={32} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Your Favorites</h1>
                    <p className="text-red-100">
                      {favorites.length} song{favorites.length !== 1 ? 's' : ''} • 
                      {Math.floor(favorites.reduce((acc, song) => acc + song.duration, 0) / 60)} min total
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Play All Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <button
                  onClick={() => handleSongPlay(favorites[0])}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
                >
                  <Play size={20} />
                  <span>Play All</span>
                </button>
              </motion.div>

              {/* Songs List */}
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {favorites.map((song, index) => (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                        currentSong?.id === song.id ? 'bg-green-50 dark:bg-green-900/20' : ''
                      }`}
                      onClick={() => handleSongPlay(song)}
                    >
                      {/* Track Number / Playing Indicator */}
                      <div className="flex-shrink-0 w-8 flex items-center justify-center mr-4">
                        {currentSong?.id === song.id && isPlaying ? (
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
                        ) : (
                          <span className={`text-sm ${
                            currentSong?.id === song.id ? 'text-green-600 font-medium' : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            {index + 1}
                          </span>
                        )}
                      </div>

                      {/* Album Art */}
                      <img
                        src={song.image}
                        alt={song.title}
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />

                      {/* Song Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium truncate ${
                          currentSong?.id === song.id ? 'text-green-600' : 'text-gray-900 dark:text-white'
                        }`}>
                          {song.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {song.artist} • {song.album}
                        </p>
                      </div>

                      {/* Genre */}
                      <div className="hidden md:block mr-4">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                          {song.genre}
                        </span>
                      </div>

                      {/* Duration */}
                      <div className="text-sm text-gray-400 dark:text-gray-500 mr-4">
                        {formatDuration(song.duration)}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(song);
                          }}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                          <Download size={16} className="text-gray-400 hover:text-blue-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromFavorites(song.id);
                          }}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                          <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
         </motion.div>

      {currentSong && (
        <AudioPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          playlist={favorites}
          currentIndex={currentIndex}
        />
      )}
    </div>
  );
};

export default Favorites;