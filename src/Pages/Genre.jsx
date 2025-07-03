import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Music, Play, Heart, Download } from "lucide-react";
import Header from "../Components/Header/Header";
import Sidebar from "../Components/SideBar/SideBar";
import AudioPlayer from "../Components/AudioPlayer/AudioPlayer";
import SongGrid from "../Components/SongGrid/SongGrid";
import { toast } from "react-toastify";

const Genre = () => {
  const { genre } = useParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Genre information
  const genreInfo = {
    quartet: {
      name: "Quartet",
      description: "Beautiful four-part harmony performances",
      color: "from-blue-500 to-indigo-500",
      icon: "🎵"
    },
    chorale: {
      name: "Chorale",
      description: "Traditional choir arrangements and performances",
      color: "from-green-500 to-teal-500",
      icon: "🎼"
    },
    acapella: {
      name: "Acapella",
      description: "Pure vocal performances without instruments",
      color: "from-purple-500 to-pink-500",
      icon: "🎤"
    },
    oldtimers: {
      name: "Old Timers",
      description: "Classic hymns and traditional songs",
      color: "from-amber-500 to-orange-500",
      icon: "📻"
    },
    live: {
      name: "Live Performance",
      description: "Recorded live performances and concerts",
      color: "from-red-500 to-rose-500",
      icon: "🎪"
    }
  };

  const currentGenre = genreInfo[genre] || {
    name: genre?.charAt(0).toUpperCase() + genre?.slice(1) || "Unknown",
    description: "Music in this genre",
    color: "from-gray-500 to-gray-600",
    icon: "🎵"
  };

  // Mock data for genre songs
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockSongs = [
        {
          id: 1,
          title: `${currentGenre.name} Song 1`,
          artist: "SDA Artists",
          album: `${currentGenre.name} Collection`,
          duration: 240,
          image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400",
          track: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          genre: currentGenre.name
        },
        {
          id: 2,
          title: `${currentGenre.name} Song 2`,
          artist: "Adventist Musicians",
          album: `${currentGenre.name} Favorites`,
          duration: 195,
          image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400",
          track: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          genre: currentGenre.name
        },
        {
          id: 3,
          title: `${currentGenre.name} Song 3`,
          artist: "Church Choir",
          album: `Best of ${currentGenre.name}`,
          duration: 210,
          image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400",
          track: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          genre: currentGenre.name
        }
      ];
      
      setSongs(mockSongs);
      setIsLoading(false);
    }, 1000);
  }, [genre, currentGenre.name]);

  const handleSongPlay = (song) => {
    const songIndex = songs.findIndex(s => s.id === song.id);
    
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
    if (currentIndex < songs.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentSong(songs[nextIndex]);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentSong(songs[prevIndex]);
      setIsPlaying(true);
    }
  };

  const handleSongLike = (song) => {
    toast.success(`Added "${song.title}" to favorites!`);
  };

  const handleSongDownload = (song) => {
    toast.success(`Downloading "${song.title}"`);
  };

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <Music className="text-gray-400" size={40} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">No songs in this genre yet</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        We&apos;re working on adding more {currentGenre.name.toLowerCase()} music to our collection.
      </p>
      <button
        onClick={() => window.history.back()}
        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
      >
        Explore Other Genres
      </button>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 w-screen">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <motion.div
        animate={{
          marginLeft: sidebarCollapsed ? 80 : 280
        }}
        className="flex-1 transition-all duration-300"
        style={{ marginBottom: currentSong ? '100px' : '0' }}
      >
        <Header 
          onSearchSong={handleSongPlay}
          songs={songs}
          title={currentGenre.name}
          subtitle={currentGenre.description}
        />

        <div className="p-6">
          {/* Genre Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-r ${currentGenre.color} rounded-xl p-8 mb-8 text-white`}
          >
            <div className="flex items-center space-x-6">
              <div className="text-6xl">{currentGenre.icon}</div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{currentGenre.name}</h1>
                <p className="text-xl opacity-90 mb-4">{currentGenre.description}</p>
                <div className="flex items-center space-x-4 text-sm opacity-80">
                  <span>{songs.length} songs</span>
                  <span>•</span>
                  <span>{Math.floor(songs.reduce((acc, song) => acc + song.duration, 0) / 60)} minutes</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Play All Button */}
          {songs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleSongPlay(songs[0])}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full font-medium hover:shadow-lg transition-all text-lg"
                >
                  <Play size={24} />
                  <span>Play All</span>
                </button>
                
                <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-all">
                  <Heart size={20} />
                  <span>Save Genre</span>
                </button>
                
                <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-all">
                  <Download size={20} />
                  <span>Download All</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Songs Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              <span className="ml-3 text-gray-600">Loading {currentGenre.name.toLowerCase()} music...</span>
            </div>
          ) : songs.length === 0 ? (
            <EmptyState />
          ) : (
            <SongGrid
              songs={songs}
              isLoading={false}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onSongPlay={handleSongPlay}
              onSongLike={handleSongLike}
              onSongDownload={handleSongDownload}
              title={`${currentGenre.name} Collection`}
            />
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
          playlist={songs}
          currentIndex={currentIndex}
          onSongLike={handleSongLike}
          onSongDownload={handleSongDownload}
        />
      )}
    </div>
  );
};

export default Genre;