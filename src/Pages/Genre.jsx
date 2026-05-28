import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Music, Play, Heart, Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Components/Header/Header";
import Sidebar from "../Components/SideBar/SideBar";
import SongGrid from "../Components/SongGrid/SongGrid";
import { toast } from "react-toastify";
import { getSongsByGenre, addToFavorites, removeFromFavorites } from "../api/songs/songs";
import { setQueue, togglePlayPause } from "../features/queue.slice";
import downloadSong from "../helpers/download";

const Genre = () => {
  const { genre } = useParams();
  const dispatch = useDispatch();
  const { items: queueItems, currentIndex: queueIndex, isPlaying } = useSelector((s) => s.queue);
  const currentSong = queueItems[queueIndex] ?? null;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedSongIds, setLikedSongIds] = useState(new Set());

  const genreInfo = {
    quartet: { name: "Quartet", description: "Beautiful four-part harmony performances", color: "from-blue-500 to-indigo-500", icon: "🎵" },
    chorale: { name: "Chorale", description: "Traditional choir arrangements and performances", color: "from-green-500 to-teal-500", icon: "🎼" },
    acapella: { name: "Acapella", description: "Pure vocal performances without instruments", color: "from-purple-500 to-pink-500", icon: "🎤" },
    oldtimers: { name: "Old Timers", description: "Classic hymns and traditional songs", color: "from-amber-500 to-orange-500", icon: "📻" },
    live: { name: "Live Performance", description: "Recorded live performances and concerts", color: "from-red-500 to-rose-500", icon: "🎪" },
  };

  const currentGenre = genreInfo[genre] || {
    name: genre?.charAt(0).toUpperCase() + genre?.slice(1) || "Unknown",
    description: "Music in this genre",
    color: "from-gray-500 to-gray-600",
    icon: "🎵",
  };

  useEffect(() => {
    const fetchGenreSongs = async () => {
      setIsLoading(true);
      try {
        const data = await getSongsByGenre(genre);
        setSongs(data);
      } catch {
        toast.error(`Failed to load ${currentGenre.name} songs`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGenreSongs();
  }, [genre]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMenuClick = () => setSidebarCollapsed((c) => !c);

  const handleSongPlay = (song) => {
    const songIndex = songs.findIndex(s => s.id === song.id);
    if (currentSong?.id === song.id) {
      dispatch(togglePlayPause());
    } else {
      dispatch(setQueue({ items: songs, startIndex: songIndex !== -1 ? songIndex : 0 }));
    }
  };

  const handleSongLike = async (song) => {
    const alreadyLiked = likedSongIds.has(song.id);
    setLikedSongIds((prev) => {
      const next = new Set(prev);
      alreadyLiked ? next.delete(song.id) : next.add(song.id);
      return next;
    });
    try {
      if (alreadyLiked) {
        await removeFromFavorites(song.id);
        toast.success(`Removed "${song.title}" from favorites`);
      } else {
        await addToFavorites(song.id);
        toast.success(`Added "${song.title}" to favorites!`);
      }
    } catch {
      setLikedSongIds((prev) => {
        const next = new Set(prev);
        alreadyLiked ? next.add(song.id) : next.delete(song.id);
        return next;
      });
      toast.error("Failed to update favorites");
    }
  };

  const handleSongDownload = (song) => {
    if (song.track && song.title) {
      downloadSong(song.track, song.title, (progress) => {
        if (progress === 100) toast.success(`Downloaded "${song.title}" successfully!`);
      });
    } else {
      toast.error("Unable to download this song");
    }
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
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No songs in this genre yet</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 w-screen">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        overlay
      />

      <div
        className="flex-1"
        style={{ marginBottom: currentSong ? '100px' : '0' }}
      >
        <Header
          onSearchSong={handleSongPlay}
          songs={songs}
          title={currentGenre.name}
          subtitle={currentGenre.description}
          onMenuClick={handleMenuClick}
        />

        <div className="p-3 sm:p-4 lg:p-6">
          {/* Genre Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-8 mb-8 text-white"
          >
            <div className="flex items-start sm:items-center space-x-3 sm:space-x-6">
              <div className="text-4xl sm:text-6xl">{currentGenre.icon}</div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{currentGenre.name}</h1>
                <p className="text-base sm:text-xl opacity-90 mb-4">{currentGenre.description}</p>
                <div className="flex items-center space-x-4 text-sm opacity-80">
                  <span>{songs.length} songs</span>
                  <span>•</span>
                  <span>{Math.floor(songs.reduce((acc, song) => acc + (song.duration ?? 0), 0) / 60)} minutes</span>
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

                <button className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                  <Heart size={20} />
                  <span>Save Genre</span>
                </button>

                <button className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
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
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading {currentGenre.name.toLowerCase()} music...</span>
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
              likedSongIds={likedSongIds}
              title={`${currentGenre.name} Collection`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Genre;
