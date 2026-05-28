import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Library as LibraryIcon, Play, Clock, Folder, Plus, X,
  Music, ChevronLeft, ListMusic,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Components/Header/Header";
import Sidebar from "../Components/SideBar/SideBar";
import AddToPlaylistModal from "../Components/AddToPlaylistModal/AddToPlaylistModal";
import { toast } from "react-toastify";
import { getPlaylists, getRecentlyPlayed, createPlaylist } from "../api/songs/songs";
import { setQueue, togglePlayPause } from "../features/queue.slice";

const formatDuration = (seconds) => {
  if (!seconds) return "0m";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
};

const playlistCoverImage = (playlist) =>
  playlist.songs?.[0]?.song?.image || playlist.songs?.[0]?.image || null;

const playlistStats = (playlist) => {
  const count = playlist.songs?.length ?? 0;
  const duration = (playlist.songs ?? []).reduce(
    (acc, s) => acc + (s.song?.duration ?? s.duration ?? 0), 0
  );
  return { count, duration };
};

const EmptyState = ({ type, onCreatePlaylist }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-20"
  >
    <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
      {type === "playlists" ? (
        <Folder className="text-blue-500" size={40} />
      ) : (
        <Clock className="text-blue-500" size={40} />
      )}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      {type === "playlists" ? "No playlists yet" : "No recent activity"}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
      {type === "playlists"
        ? "Create your first playlist to organise your favourite songs."
        : "Start listening to music to see your recently played songs here."}
    </p>
    {type === "playlists" && (
      <button
        onClick={onCreatePlaylist}
        className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all inline-flex items-center gap-2"
      >
        <Plus size={18} /> Create Playlist
      </button>
    )}
  </motion.div>
);

const CreatePlaylistModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const playlist = await createPlaylist({ name: name.trim(), description: description.trim() });
      onCreate(playlist);
      onClose();
    } catch {
      toast.error("Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Playlist</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Playlist name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My playlist"
              className="w-full p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
              className="w-full p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 py-2.5 rounded-md bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium hover:shadow-md transition-all disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};


const PlaylistDetail = ({ playlist, onBack, onSongPlay }) => {
  const { count, duration } = playlistStats(playlist);

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
      >
        <ChevronLeft size={20} /> Back to Library
      </button>

      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 mb-6 text-white flex items-center gap-6">
        <div className="w-24 h-24 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          {playlistCoverImage(playlist) ? (
            <img src={playlistCoverImage(playlist)} alt={playlist.name} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <ListMusic size={40} />
          )}
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-white/70 mb-1">Playlist</p>
          <h2 className="text-2xl font-bold mb-1">{playlist.name}</h2>
          {playlist.description && <p className="text-white/80 text-sm mb-2">{playlist.description}</p>}
          <p className="text-white/70 text-sm">
            {count} song{count !== 1 ? "s" : ""} • {formatDuration(duration)}
          </p>
        </div>
      </div>

      {count === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <Music size={48} className="mx-auto mb-4 opacity-50" />
          <p>This playlist is empty. Add songs from your recently played.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {playlist.songs.map((entry, index) => {
              const song = entry.song ?? entry;
              return (
                <motion.div
                  key={entry.id ?? index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group"
                  onClick={() => onSongPlay(song)}
                >
                  <span className="w-6 text-sm text-gray-400 dark:text-gray-500 mr-4 group-hover:hidden">{index + 1}</span>
                  <Play size={14} className="text-green-500 mr-4 hidden group-hover:block w-6" />
                  {song.image ? (
                    <img src={song.image} alt={song.title} className="w-10 h-10 rounded-lg object-cover mr-4" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mr-4 flex items-center justify-center">
                      <Music size={16} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{song.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{song.artist}</p>
                  </div>
                  <span className="text-sm text-gray-400 dark:text-gray-500 ml-4">
                    {formatDuration(song.duration)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

const Library = () => {
  const dispatch = useDispatch();
  const { items: queueItems, currentIndex: queueIndex, isPlaying } = useSelector((s) => s.queue);
  const currentSong = queueItems[queueIndex] ?? null;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("playlists");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [addToPlaylistTarget, setAddToPlaylistTarget] = useState(null);

  useEffect(() => {
    const fetchLibrary = async () => {
      setIsLoading(true);
      try {
        const [playlistsData, recentData] = await Promise.all([
          getPlaylists(),
          getRecentlyPlayed(),
        ]);
        setPlaylists(playlistsData);
        setRecentlyPlayed(recentData);
      } catch {
        toast.error("Failed to load library");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  const handleSongPlay = (song, songList = recentlyPlayed) => {
    const songIndex = songList.findIndex(s => s.id === song.id);
    if (currentSong?.id === song.id) {
      dispatch(togglePlayPause());
    } else {
      dispatch(setQueue({ items: songList, startIndex: songIndex !== -1 ? songIndex : 0 }));
    }
  };

  const handleMenuClick = () => setSidebarCollapsed((c) => !c);

  const handlePlaylistCreated = (newPlaylist) => {
    setPlaylists((prev) => [newPlaylist, ...prev]);
    toast.success(`Playlist "${newPlaylist.name}" created!`);
  };

  const handleSongAddedToPlaylist = (playlistId, song) => {
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === playlistId
          ? { ...pl, songs: [...(pl.songs ?? []), { id: `${playlistId}-${song.id}`, song }] }
          : pl
      )
    );
    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist((pl) => ({
        ...pl,
        songs: [...(pl.songs ?? []), { id: `${playlistId}-${song.id}`, song }],
      }));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 w-screen">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        overlay
      />

      <div
        className="flex-1 overflow-y-auto min-h-screen"
        style={{ marginBottom: currentSong ? "100px" : "0" }}
      >
        <Header
          onSearchSong={handleSongPlay}
          songs={recentlyPlayed}
          title="Your Library"
          subtitle="Your music collection"
          onMenuClick={handleMenuClick}
        />

        <div className="p-3 sm:p-4 lg:p-6">
          {/* Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 mb-8 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <LibraryIcon size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Your Library</h1>
                  <p className="text-blue-100">
                    {playlists.length} playlist{playlists.length !== 1 ? "s" : ""} •{" "}
                    {recentlyPlayed.length} recently played
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors text-white px-4 py-2 rounded-lg font-medium text-sm"
              >
                <Plus size={18} /> New Playlist
              </button>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading your library…</span>
            </div>
          ) : selectedPlaylist ? (
            <PlaylistDetail
              playlist={selectedPlaylist}
              onBack={() => setSelectedPlaylist(null)}
              onSongPlay={(song) => {
                const songs = selectedPlaylist.songs.map(e => e.song ?? e);
                handleSongPlay(song, songs);
              }}
            />
          ) : (
            <>
              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-200 dark:bg-gray-800 rounded-lg p-1 mb-6 w-fit">
                {["playlists", "recent"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors capitalize ${
                      activeTab === tab
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {tab === "recent" ? "Recently Played" : "Playlists"}
                  </button>
                ))}
              </div>

              {activeTab === "playlists" ? (
                playlists.length === 0 ? (
                  <EmptyState type="playlists" onCreatePlaylist={() => setShowCreateModal(true)} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {playlists.map((playlist, index) => {
                      const cover = playlistCoverImage(playlist);
                      const { count, duration } = playlistStats(playlist);
                      return (
                        <motion.div
                          key={playlist.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.08 }}
                          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                          onClick={() => setSelectedPlaylist(playlist)}
                        >
                          <div className="relative">
                            {cover ? (
                              <img src={cover} alt={playlist.name} className="w-full h-44 object-cover" />
                            ) : (
                              <div className="w-full h-44 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                                <ListMusic size={48} className="text-white/70" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button className="bg-white/90 backdrop-blur-sm rounded-full p-3 hover:scale-110 transition-transform">
                                <Play className="text-gray-900" size={24} />
                              </button>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">{playlist.name}</h3>
                            {playlist.description && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 truncate">{playlist.description}</p>
                            )}
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {count} song{count !== 1 ? "s" : ""}{duration > 0 ? ` • ${formatDuration(duration)}` : ""}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              Created {formatDate(playlist.createdAt)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )
              ) : recentlyPlayed.length === 0 ? (
                <EmptyState type="recent" />
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {recentlyPlayed.map((song, index) => (
                      <motion.div
                        key={song.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group"
                        onClick={() => handleSongPlay(song)}
                      >
                        {song.image ? (
                          <img src={song.image} alt={song.title} className="w-12 h-12 rounded-lg object-cover mr-4" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mr-4 flex items-center justify-center">
                            <Music size={18} className="text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">{song.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {song.artist}{song.album ? ` • ${song.album}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {formatDate(song.lastPlayed) && (
                            <span className="text-sm text-gray-400 dark:text-gray-500 hidden sm:block">
                              {formatDate(song.lastPlayed)}
                            </span>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); setAddToPlaylistTarget(song); }}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                            title="Add to playlist"
                          >
                            <Plus size={16} className="text-gray-500 dark:text-gray-400" />
                          </button>
                          <button
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            onClick={(e) => { e.stopPropagation(); handleSongPlay(song); }}
                          >
                            <Play size={16} className="text-gray-400" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <CreatePlaylistModal
            onClose={() => setShowCreateModal(false)}
            onCreate={handlePlaylistCreated}
          />
        )}
        {addToPlaylistTarget && (
          <AddToPlaylistModal
            song={addToPlaylistTarget}
            playlists={playlists}
            onClose={() => setAddToPlaylistTarget(null)}
            onAdded={handleSongAddedToPlaylist}
            onPlaylistCreated={handlePlaylistCreated}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Library;
