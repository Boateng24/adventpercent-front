import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../Components/SideBar/SideBar";
import Header from "../Components/Header/Header";
import MusicBanner from "../Components/MusicBanner/MusicBanner";
import SongGrid from "../Components/SongGrid/SongGrid";
import TrendingSection from "../Components/TrendingSection/TrendingSection";
import { recordInteraction, addToFavorites, removeFromFavorites, getPlaylists } from "../api/songs/songs";
import { fetchSongsPage, isCacheFresh } from "../features/songs.slice";
import { setQueue, togglePlayPause } from "../features/queue.slice";
import AddToPlaylistModal from "../Components/AddToPlaylistModal/AddToPlaylistModal";
import downloadSong from "../helpers/download";

const Home = () => {
  const dispatch = useDispatch();
  const { items: songs, page, hasMore, isLoading, lastFetched } = useSelector((state) => state.songs);
  const { items: queueItems, currentIndex: queueIndex, isPlaying } = useSelector((s) => s.queue);
  const currentSong = queueItems[queueIndex] ?? null;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [trendingOpen, setTrendingOpen] = useState(false);
  const [likedSongIds, setLikedSongIds] = useState(new Set());
  const [playlists, setPlaylists] = useState([]);
  const [addToPlaylistTarget, setAddToPlaylistTarget] = useState(null);

  // Fetch page 1 only when cache is stale or empty
  useEffect(() => {
    if (songs.length === 0 || !isCacheFresh(lastFetched)) {
      dispatch(fetchSongsPage(1));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch playlists for "Add to Playlist" modal
  useEffect(() => {
    getPlaylists().then(setPlaylists).catch(() => {});
  }, []);

  // Infinite scroll — duplicate dispatches are blocked by the `condition` in the slice
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight &&
        hasMore &&
        !isLoading
      ) {
        dispatch(fetchSongsPage(page + 1));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading, page, dispatch]);

  const handleSongPlay = useCallback(async (song) => {
    const songIndex = songs.findIndex(s => s.id === song.id);
    if (currentSong?.id === song.id) {
      dispatch(togglePlayPause());
      await recordInteraction(song.id, isPlaying ? "skip" : "play");
    } else {
      dispatch(setQueue({ items: songs, startIndex: songIndex !== -1 ? songIndex : 0 }));
      await recordInteraction(song.id, "play");
    }
  }, [currentSong, isPlaying, songs, dispatch]);

  const handleSongLike = useCallback(async (song) => {
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
  }, [likedSongIds]);

  const handleSongAddToPlaylist = useCallback((song) => {
    setAddToPlaylistTarget(song);
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

  const handleMenuClick = useCallback(() => {
    setSidebarCollapsed(!sidebarCollapsed);
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 w-screen overflow-x-hidden">
      {/* Sidebar — overlay mode, slides in from left */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        overlay
      />

      {/* Main Content — always full width */}
      <div
        className="flex flex-col min-h-screen"
        style={{ marginBottom: currentSong ? '80px' : '0', paddingBottom: currentSong ? 'env(safe-area-inset-bottom, 0px)' : '0' }}
      >
        <Header
          onSearchSong={handleSearchSong}
          songs={songs}
          title="Discover Music"
          subtitle="Find your next favorite song"
          onMenuClick={handleMenuClick}
          onTrendingClick={() => setTrendingOpen(true)}
        />

        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 lg:space-y-8">
          <MusicBanner
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlayPause={() => dispatch(togglePlayPause())}
          />

          <SongGrid
            songs={songs}
            isLoading={isLoading && page === 1}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onSongPlay={handleSongPlay}
            onSongLike={handleSongLike}
            onSongDownload={handleSongDownload}
            onSongAddToPlaylist={handleSongAddToPlaylist}
            likedSongIds={likedSongIds}
          />

          {isLoading && page > 1 && (
            <div className="text-center py-6 sm:py-8">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                <span className="text-gray-600 text-sm sm:text-base">Loading more songs...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trending Panel — overlay, slides in from right */}
      <AnimatePresence>
        {trendingOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setTrendingOpen(false)}
            />
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed right-0 top-0 h-full w-80 z-50 shadow-2xl"
            >
              <TrendingSection
                currentSong={currentSong}
                isPlaying={isPlaying}
                onSongPlay={handleSongPlay}
                onClose={() => setTrendingOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {addToPlaylistTarget && (
          <AddToPlaylistModal
            song={addToPlaylistTarget}
            playlists={playlists}
            onClose={() => setAddToPlaylistTarget(null)}
            onPlaylistCreated={(newPlaylist) => setPlaylists((prev) => [newPlaylist, ...prev])}
            onAdded={() => {}}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
