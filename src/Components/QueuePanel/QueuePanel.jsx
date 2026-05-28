import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, GripVertical, Trash2, ListMusic } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  removeFromQueue,
  reorderQueue,
  jumpToSong,
  clearQueue,
  closePanel,
} from "../../features/queue.slice";

const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400";

const QueueItem = ({ song, index, isCurrent, isPast }) => {
  const dispatch = useDispatch();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: song._queueId, disabled: isCurrent });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 px-4 py-2.5 group rounded-lg transition-colors ${
        isCurrent
          ? "bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 mx-2"
          : isPast
          ? "opacity-40 hover:opacity-60"
          : "hover:bg-gray-50 dark:hover:bg-gray-800/60"
      }`}
    >
      {/* Drag handle / playing indicator */}
      {isCurrent ? (
        <div className="w-5 flex-shrink-0 flex items-center justify-center gap-0.5">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 bg-green-500 rounded-full"
              animate={{ height: [5, 13, 5] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      ) : (
        <button
          {...attributes}
          {...listeners}
          className="w-5 flex-shrink-0 text-gray-300 dark:text-gray-600 hover:text-gray-500 cursor-grab active:cursor-grabbing touch-none"
          tabIndex={-1}
        >
          <GripVertical size={16} />
        </button>
      )}

      {/* Index */}
      <span className={`text-xs w-4 text-center flex-shrink-0 ${isCurrent ? "text-green-500 font-bold" : "text-gray-400 dark:text-gray-500"}`}>
        {index + 1}
      </span>

      {/* Art */}
      <button onClick={() => !isCurrent && dispatch(jumpToSong(index))} className="flex-shrink-0">
        <img
          src={song.image || DEFAULT_IMAGE}
          alt={song.title}
          className="w-9 h-9 rounded-md object-cover"
          onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
        />
      </button>

      {/* Info */}
      <button
        onClick={() => !isCurrent && dispatch(jumpToSong(index))}
        className="flex-1 min-w-0 text-left"
      >
        <p className={`text-sm font-medium truncate ${isCurrent ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>
          {song.title || "Unknown"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {song.artist || "Unknown Artist"}
        </p>
      </button>

      {/* Remove */}
      {!isCurrent && (
        <button
          onClick={() => dispatch(removeFromQueue(index))}
          className="flex-shrink-0 p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-all"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
};

const QueuePanel = () => {
  const dispatch = useDispatch();
  const { items, currentIndex, panelOpen } = useSelector((s) => s.queue);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const fromIndex = items.findIndex((s) => s._queueId === active.id);
    const toIndex = items.findIndex((s) => s._queueId === over.id);
    if (fromIndex !== -1 && toIndex !== -1) {
      dispatch(reorderQueue({ fromIndex, toIndex }));
    }
  };

  const upcomingCount = Math.max(0, items.length - currentIndex - 1);

  return (
    <AnimatePresence>
      {panelOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => dispatch(closePanel())}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 bottom-24 w-80 sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
              <div className="flex items-center gap-2">
                <ListMusic size={18} className="text-green-500" />
                <h2 className="font-bold text-gray-900 dark:text-white">Queue</h2>
                {items.length > 0 && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {upcomingCount > 0 && (
                  <button
                    onClick={() => dispatch(clearQueue())}
                    className="text-xs text-red-500 hover:text-red-600 hover:underline"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => dispatch(closePanel())}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X size={18} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <ListMusic size={28} className="text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Queue is empty</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Play a song or use ⋮ to add one
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto py-3 space-y-0.5">
                {/* Now Playing */}
                {currentIndex >= 0 && (
                  <section>
                    <p className="px-4 pb-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Now Playing
                    </p>
                    <QueueItem song={items[currentIndex]} index={currentIndex} isCurrent />
                  </section>
                )}

                {/* Up Next — draggable */}
                {upcomingCount > 0 && (
                  <section className="pt-2">
                    <p className="px-4 pb-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Up Next · {upcomingCount}
                    </p>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext
                        items={items.slice(currentIndex + 1).map((s) => s._queueId)}
                        strategy={verticalListSortingStrategy}
                      >
                        {items.slice(currentIndex + 1).map((song, i) => (
                          <QueueItem
                            key={song._queueId}
                            song={song}
                            index={currentIndex + 1 + i}
                            isCurrent={false}
                            isPast={false}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </section>
                )}

                {/* History */}
                {currentIndex > 0 && (
                  <section className="pt-2">
                    <p className="px-4 pb-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      History · {currentIndex}
                    </p>
                    {items.slice(0, currentIndex).map((song, i) => (
                      <QueueItem key={song._queueId} song={song} index={i} isCurrent={false} isPast />
                    ))}
                  </section>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QueuePanel;
