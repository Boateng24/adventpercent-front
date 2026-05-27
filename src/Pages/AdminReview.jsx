import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle, XCircle, Clock, User } from "lucide-react";
import Header from "../Components/Header/Header";
import Sidebar from "../Components/SideBar/SideBar";
import AudioPlayer from "../Components/AudioPlayer/AudioPlayer";
import { toast } from "react-toastify";
import { getPendingSongs, approveSong, rejectSong } from "../api/admin/admin";

const AdminReview = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pendingSongs, setPendingSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const fetchPending = async () => {
      setIsLoading(true);
      try {
        const data = await getPendingSongs();
        setPendingSongs(data);
      } catch {
        toast.error("Failed to load pending songs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleSongPlay = (song) => {
    const songIndex = pendingSongs.findIndex((s) => s.id === song.id);
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setCurrentIndex(songIndex !== -1 ? songIndex : 0);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    if (currentSong) setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentIndex < pendingSongs.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentSong(pendingSongs[nextIndex]);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentSong(pendingSongs[prevIndex]);
      setIsPlaying(true);
    }
  };

  const removeSongFromQueue = (songId) => {
    setPendingSongs((prev) => prev.filter((s) => s.id !== songId));
    if (currentSong?.id === songId) {
      setCurrentSong(null);
      setIsPlaying(false);
    }
  };

  const handleApprove = async (song, e) => {
    e.stopPropagation();
    setProcessingId(song.id);
    try {
      await approveSong(song.id);
      removeSongFromQueue(song.id);
      toast.success(`"${song.title}" approved and is now live`);
    } catch {
      toast.error("Failed to approve song");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (song, e) => {
    e.stopPropagation();
    setProcessingId(song.id);
    try {
      await rejectSong(song.id);
      removeSongFromQueue(song.id);
      toast.info(`"${song.title}" has been rejected`);
    } catch {
      toast.error("Failed to reject song");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const defaultImage =
    "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400";

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="text-green-500" size={40} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">All caught up!</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        There are no songs pending review. New uploads will appear here
        automatically.
      </p>
    </motion.div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 w-screen">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <motion.div
        animate={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
        className="flex-1 transition-all duration-300 overflow-y-auto"
        style={{ marginBottom: currentSong ? "100px" : "0" }}
      >
        <Header
          onSearchSong={handleSongPlay}
          songs={pendingSongs}
          title="Admin Review"
          subtitle="Approve or reject uploaded songs"
        />

        <div className="p-6">
          {/* Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 mb-8 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Song Review Queue</h1>
                  <p className="text-green-100 mt-1">
                    {isLoading ? (
                      "Loading..."
                    ) : (
                      <>
                        <span className="font-semibold">{pendingSongs.length}</span>
                        {" song"}
                        {pendingSongs.length !== 1 ? "s" : ""} awaiting review
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Stats chips */}
              {!isLoading && pendingSongs.length > 0 && (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
                    <Clock size={16} />
                    <span className="text-sm font-medium">
                      {pendingSongs.length} pending
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading pending songs...</span>
            </div>
          ) : pendingSongs.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-12 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-4 md:col-span-4">Song</div>
                <div className="col-span-2 hidden md:block">Uploaded by</div>
                <div className="col-span-2 hidden md:block">Genre</div>
                <div className="col-span-1 hidden md:block">Duration</div>
                <div className="col-span-7 md:col-span-3 text-right pr-2">
                  Actions
                </div>
              </div>

              <AnimatePresence>
                {pendingSongs.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`grid grid-cols-12 items-center px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0 ${
                      currentSong?.id === song.id ? "bg-green-50 dark:bg-green-900/20" : ""
                    }`}
                    onClick={() => handleSongPlay(song)}
                  >
                    {/* Track number / playing indicator */}
                    <div className="col-span-1 flex items-center justify-center">
                      {currentSong?.id === song.id && isPlaying ? (
                        <div className="flex space-x-0.5">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-0.5 h-4 bg-green-500 rounded-full"
                              animate={{ height: [8, 16, 8] }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.1,
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <span
                          className={`text-sm ${
                            currentSong?.id === song.id
                              ? "text-green-600 font-medium"
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                        >
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Song info */}
                    <div className="col-span-4 flex items-center space-x-3 min-w-0">
                      <img
                        src={song.image || defaultImage}
                        alt={song.title}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.src = defaultImage;
                        }}
                      />
                      <div className="min-w-0">
                        <h3
                          className={`font-medium truncate text-sm ${
                            currentSong?.id === song.id
                              ? "text-green-600"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {song.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {song.artist}
                          {song.album ? ` • ${song.album}` : ""}
                        </p>
                      </div>
                    </div>

                    {/* Uploaded by */}
                    <div className="col-span-2 hidden md:flex items-center space-x-1 min-w-0">
                      <User size={13} className="text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {song.uploadedBy || "Unknown"}
                      </span>
                    </div>

                    {/* Genre */}
                    <div className="col-span-2 hidden md:block">
                      {song.genre && (
                        <span className="px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                          {song.genre}
                        </span>
                      )}
                    </div>

                    {/* Duration */}
                    <div className="col-span-1 hidden md:block text-sm text-gray-400 dark:text-gray-500">
                      {song.duration ? formatDuration(song.duration) : "--:--"}
                    </div>

                    {/* Actions */}
                    <div className="col-span-7 md:col-span-3 flex items-center justify-end space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleApprove(song, e)}
                        disabled={processingId === song.id}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === song.id ? (
                          <div className="w-3 h-3 border border-white border-b-transparent rounded-full animate-spin" />
                        ) : (
                          <CheckCircle size={13} />
                        )}
                        <span>Approve</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleReject(song, e)}
                        disabled={processingId === song.id}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === song.id ? (
                          <div className="w-3 h-3 border border-white border-b-transparent rounded-full animate-spin" />
                        ) : (
                          <XCircle size={13} />
                        )}
                        <span>Reject</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
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
          playlist={pendingSongs}
          currentIndex={currentIndex}
          onClose={() => {
            setCurrentSong(null);
            setIsPlaying(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminReview;
