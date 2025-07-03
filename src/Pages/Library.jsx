import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Library as LibraryIcon, Play, Music, Clock, Calendar, Folder } from "lucide-react";
import Header from "../Components/Header/Header";
import Sidebar from "../Components/SideBar/SideBar";
import AudioPlayer from "../Components/AudioPlayer/AudioPlayer";

const Library = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('playlists');

  // Mock data
  useEffect(() => {
    const mockPlaylists = [
      {
        id: 1,
        name: "Worship Favorites",
        songCount: 25,
        duration: 1800,
        image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400",
        createdAt: "2024-01-01",
        songs: []
      },
      {
        id: 2,
        name: "Quartet Collection",
        songCount: 18,
        duration: 1200,
        image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400",
        createdAt: "2024-01-05",
        songs: []
      }
    ];

    const mockRecentlyPlayed = [
      {
        id: 1,
        title: "Amazing Grace",
        artist: "SDA Choir",
        album: "Hymns Collection",
        duration: 240,
        image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400",
        track: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        lastPlayed: "2024-01-20"
      },
      {
        id: 2,
        title: "How Great Thou Art",
        artist: "Adventist Quartet",
        album: "Classic Hymns",
        duration: 195,
        image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400",
        track: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        lastPlayed: "2024-01-19"
      }
    ];

    setPlaylists(mockPlaylists);
    setRecentlyPlayed(mockRecentlyPlayed);
  }, []);

  const handleSongPlay = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    // Implementation for next song
  };

  const handlePrevious = () => {
    // Implementation for previous song
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const EmptyState = ({ type }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
        {type === 'playlists' ? (
          <Folder className="text-blue-500" size={40} />
        ) : (
          <Clock className="text-blue-500" size={40} />
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {type === 'playlists' ? 'No playlists yet' : 'No recent activity'}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {type === 'playlists' 
          ? 'Create your first playlist to organize your favorite songs.'
          : 'Start listening to music to see your recently played songs here.'
        }
      </p>
      <button
        onClick={() => window.history.back()}
        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
      >
        {type === 'playlists' ? 'Discover Music' : 'Start Listening'}
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
        className="flex-1 transition-all duration-300"
        style={{ marginBottom: currentSong ? '100px' : '0' }}
      >
        <Header 
          onSearchSong={handleSongPlay}
          songs={recentlyPlayed}
          title="Your Library"
          subtitle="Your music collection"
        />

        <div className="p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 mb-8 text-white"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <LibraryIcon size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Your Library</h1>
                <p className="text-blue-100">
                  {playlists.length} playlist{playlists.length !== 1 ? 's' : ''} • 
                  {recentlyPlayed.length} recently played
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-6 w-fit">
            <button
              onClick={() => setActiveTab('playlists')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'playlists'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Playlists
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'recent'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Recently Played
            </button>
          </div>

          {/* Content */}
          {activeTab === 'playlists' ? (
            playlists.length === 0 ? (
              <EmptyState type="playlists" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {playlists.map((playlist, index) => (
                  <motion.div
                    key={playlist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                  >
                    <div className="relative">
                      <img
                        src={playlist.image}
                        alt={playlist.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-white/90 backdrop-blur-sm rounded-full p-3 hover:scale-110 transition-transform">
                          <Play className="text-gray-900" size={24} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{playlist.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {playlist.songCount} songs • {formatDuration(playlist.duration)}
                      </p>
                      <p className="text-xs text-gray-400">
                        Created {formatDate(playlist.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            recentlyPlayed.length === 0 ? (
              <EmptyState type="recent" />
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {recentlyPlayed.map((song, index) => (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleSongPlay(song)}
                    >
                      <img
                        src={song.image}
                        alt={song.title}
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{song.title}</h3>
                        <p className="text-sm text-gray-500 truncate">
                          {song.artist} • {song.album}
                        </p>
                      </div>
                      <div className="text-sm text-gray-400 mr-4">
                        {formatDate(song.lastPlayed)}
                      </div>
                      <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <Play size={16} className="text-gray-400" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
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
          playlist={recentlyPlayed}
          currentIndex={currentIndex}
        />
      )}
    </div>
  );
};

export default Library;