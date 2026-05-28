import { useState } from "react";
import { motion } from "framer-motion";
import { X, ListMusic, Plus, ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import { createPlaylist, addSongToPlaylist } from "../../api/songs/songs";
import PropTypes from "prop-types";

const AddToPlaylistModal = ({ song, playlists, onClose, onAdded, onPlaylistCreated }) => {
  const [view, setView] = useState(playlists.length === 0 ? "create" : "list");
  const [adding, setAdding] = useState(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = async (playlist) => {
    setAdding(playlist.id);
    try {
      await addSongToPlaylist(playlist.id, song.id);
      toast.success(`Added to "${playlist.name}"`);
      onAdded?.(playlist.id, song);
      onClose();
    } catch {
      toast.error("Failed to add song to playlist");
    } finally {
      setAdding(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const newPlaylist = await createPlaylist({ name: name.trim(), description: description.trim() });
      onPlaylistCreated?.(newPlaylist);
      await addSongToPlaylist(newPlaylist.id, song.id);
      toast.success(`Created "${newPlaylist.name}" and added "${song.title}"`);
      onAdded?.(newPlaylist.id, song);
      onClose();
    } catch {
      toast.error("Failed to create playlist");
    } finally {
      setCreating(false);
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
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {view === "create" && playlists.length > 0 && (
              <button
                onClick={() => setView("list")}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft size={18} className="text-gray-500 dark:text-gray-400" />
              </button>
            )}
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              {view === "create"
                ? playlists.length === 0
                  ? "Create a Playlist"
                  : "New Playlist"
                : "Add to Playlist"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Song label */}
        <p className="px-5 pt-3 pb-1 text-sm text-gray-500 dark:text-gray-400 truncate">
          <span className="font-medium text-gray-700 dark:text-gray-300">{song.title}</span>
          {song.artist ? ` · ${song.artist}` : ""}
        </p>

        {view === "list" ? (
          <>
            <div className="px-3 pt-2 pb-1 space-y-1 max-h-60 overflow-y-auto">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => handleAdd(playlist)}
                  disabled={adding === playlist.id}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left disabled:opacity-50"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ListMusic size={16} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {playlist.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {playlist.songs?.length ?? 0} songs
                    </p>
                  </div>
                  {adding === playlist.id && (
                    <div className="w-4 h-4 rounded-full border-2 border-green-500 border-t-transparent animate-spin flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Create new option */}
            <div className="px-3 pb-4 pt-2">
              <button
                onClick={() => setView("create")}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
              >
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Plus size={18} className="text-gray-500 dark:text-gray-400" />
                </div>
                <p className="font-medium text-gray-600 dark:text-gray-400 text-sm">
                  Create new playlist
                </p>
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleCreate} className="p-5 space-y-4">
            {playlists.length === 0 && (
              <p className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                No playlists yet — create one to save this song.
              </p>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Playlist name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My playlist"
                autoFocus
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
                rows={2}
                className="w-full p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>
            <div className="flex gap-3">
              {playlists.length > 0 && (
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="flex-1 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={creating || !name.trim()}
                className="flex-1 py-2.5 rounded-md bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium text-sm hover:shadow-md transition-all disabled:opacity-50"
              >
                {creating
                  ? "Creating…"
                  : playlists.length === 0
                  ? "Create & Add Song"
                  : "Create & Add"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

AddToPlaylistModal.propTypes = {
  song: PropTypes.object.isRequired,
  playlists: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdded: PropTypes.func,
  onPlaylistCreated: PropTypes.func,
};

export default AddToPlaylistModal;
