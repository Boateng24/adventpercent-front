import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Sidebar from "../Components/SideBar/SideBar";
import Header from "../Components/Header/Header";
import MusicBanner from "../Components/MusicBanner/MusicBanner";
import SongGrid from "../Components/SongGrid/SongGrid";
import TrendingSection from "../Components/TrendingSection/TrendingSection";
import AudioPlayer from "../Components/AudioPlayer/AudioPlayer";
import { recordInteraction, getRecommendedSongs } from "../api/songs/songs";
import downloadSong from "../helpers/download";

const Home = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch songs
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setIsLoading(true);
        const fetchedSongs = await getRecommendedSongs(page);
        if (fetchedSongs && fetchedSongs.length > 0) {
          setSongs(prev => page === 1 ? fetchedSongs : [...prev, ...fetchedSongs]);
          setPlaylist(prev => page === 1 ? fetchedSongs : [...prev, ...fetchedSongs]);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
        toast.error("Failed to load songs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, [page]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
        hasMore &&
        !isLoading
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading]);

  const handleSongPlay = useCallback(async (song) => {
    const songIndex = playlist.findIndex(s => s.id === song.id);
    
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
      await recordInteraction(song.id, isPlaying ? "skip" : "play");
    } else {
      setCurrentSong(song);
      setCurrentIndex(songIndex !== -1 ? songIndex : 0);
      setIsPlaying(true);
      await recordInteraction(song.id, "play");
    }
  }, [currentSong, isPlaying, playlist]);

  const handlePlayPause = useCallback(() => {
    if (currentSong) {
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, currentSong]);

  const handleNext = useCallback(async () => {
    if(currentSong){
      await recordInteraction(currentSong.id, "skip");
    }
    if (currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentSong(playlist[nextIndex]);
      setIsPlaying(true);
    } else if (playlist.length > 0) {
      // Loop back to first song
      setCurrentIndex(0);
      setCurrentSong(playlist[0]);
      setIsPlaying(true);
    }
  }, [currentIndex, playlist, currentSong]);

  const handlePrevious = useCallback(async () => {
    if(currentSong){
      await recordInteraction(currentSong.id, "skip");
    }
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentSong(playlist[prevIndex]);
      setIsPlaying(true);
    } else if (playlist.length > 0) {
      // Loop to last song
      const lastIndex = playlist.length - 1;
      setCurrentIndex(lastIndex);
      setCurrentSong(playlist[lastIndex]);
      setIsPlaying(true);
    }
  }, [currentIndex, playlist, currentSong]);

  const handleSongLike = useCallback(async (song) => {
    // Add song to favorites
    try {
      await recordInteraction(song.id, "favorites")
      toast.success(`Added "${song.title}" to favorites!`);
    } catch (error) {
      toast.error("Failed to add song to favorites");
    }
  }, []);

  const handleSongDownload = useCallback((song) => {
    if (song.track && song.title) {
      downloadSong(song.track, song.title, (progress) => {
        if (progress === 100) {
          toast.success(`Downloaded "${song.title}" successfully!`);
        }
      });
    } else {
      toast.error("Unable to download this song");
    }
  }, []);

  const handleSearchSong = useCallback((song) => {
    handleSongPlay(song);
  }, [handleSongPlay]);

  const handleClosePlayer = useCallback(() => {
  // Pause audio before closing
  setIsPlaying(false);
  // Clear current song to hide player
  setCurrentSong(null);
}, []);

  return (
    <div className="flex min-h-screen bg-gray-50 w-screen">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <motion.div
        animate={{
          marginLeft: sidebarCollapsed ? 80 : 280
        }}
        className="flex-1 transition-all duration-300"
        style={{ marginBottom: currentSong ? '100px' : '0' }} // Add space for player
      >
        {/* Header */}
        <Header 
          onSearchSong={handleSearchSong}
          songs={songs}
          title="Discover Music"
          subtitle="Find your next favorite song"
        />

        {/* Content */}
        <div className="flex gap-6 p-6">
          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            {/* Music Banner */}
            <MusicBanner 
              currentSong={currentSong}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
            />

            {/* Songs Grid */}
            <SongGrid
              songs={songs}
              isLoading={isLoading && page === 1}
              currentSong={currentSong}
              isPlaying={isPlaying}
              onSongPlay={handleSongPlay}
              onSongLike={handleSongLike}
              onSongDownload={handleSongDownload}
            />

            {/* Loading more indicator */}
            {isLoading && page > 1 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                  <span className="text-gray-600">Loading more songs...</span>
                </div>
              </div>
            )}
          </div>

          {/* Trending Sidebar */}
          <div className="w-80 hidden xl:block">
            <TrendingSection
              currentSong={currentSong}
              isPlaying={isPlaying}
              onSongPlay={handleSongPlay}
            />
          </div>
        </div>
      </motion.div>

      {/* Audio Player - Only show when a song is selected */}
      {currentSong && (
        <AudioPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          playlist={playlist}
          currentIndex={currentIndex}
          onSongLike={handleSongLike}
          onSongDownload={handleSongDownload}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
};

export default Home;