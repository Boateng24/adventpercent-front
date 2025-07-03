import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Play, Download, Trash2} from "lucide-react";
import Header from "../Components/Header/Header";
import Sidebar from "../Components/SideBar/SideBar";
import AudioPlayer from "../Components/AudioPlayer/AudioPlayer";
import { toast } from "react-toastify";

const Favorites = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock favorites data - in real app, this would come from API/localStorage
  useEffect(() => {
    const mockFavorites = [
      {
        id: 1,
        title: "Amazing Grace",
        artist: "SDA Choir",
        album: "Hymns Collection",
        duration: 240,
        image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400",
        track: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        genre: "Hymn",
        dateAdded: "2024-01-15"
      },
      {
        id: 2,
        title: "How Great Thou Art",
        artist: "Adventist Quartet",
        album: "Classic Hymns",
        duration: 195,
        image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400",
        track: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        genre: "Quartet",
        dateAdded: "2024-01-10"
      }
    ];
    setFavorites(mockFavorites);
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

  const handleRemoveFromFavorites = (songId) => {
    setFavorites(prev => prev.filter(song => song.id !== songId));
    toast.success("Removed from favorites");
    
    // If currently playing song is removed, stop playback
    if (currentSong?.id === songId) {
      setCurrentSong(null);
      setIsPlaying(false);
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
      <h3 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
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
    <div className="flex h-screen bg-gray-50 w-screen">
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
          {favorites.length === 0 ? (
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
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {favorites.map((song, index) => (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        currentSong?.id === song.id ? 'bg-green-50' : ''
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
                            currentSong?.id === song.id ? 'text-green-600 font-medium' : 'text-gray-400'
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
                          currentSong?.id === song.id ? 'text-green-600' : 'text-gray-900'
                        }`}>
                          {song.title}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {song.artist} • {song.album}
                        </p>
                      </div>

                      {/* Genre */}
                      <div className="hidden md:block mr-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {song.genre}
                        </span>
                      </div>

                      {/* Duration */}
                      <div className="text-sm text-gray-400 mr-4">
                        {formatDuration(song.duration)}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(song);
                          }}
                          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <Download size={16} className="text-gray-400 hover:text-blue-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromFavorites(song.id);
                          }}
                          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
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