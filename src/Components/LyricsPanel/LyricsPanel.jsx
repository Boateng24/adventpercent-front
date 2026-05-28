import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, Music2 } from "lucide-react";
import { isLRC, parseLRC, distributeLines } from "../../utils/lrcParser";

const LyricsPanel = ({ lyrics, isLoading, currentTime, duration, songTitle, artist, onClose }) => {
  const syncedLines = lyrics
    ? isLRC(lyrics)
      ? parseLRC(lyrics)
      : duration > 0
        ? distributeLines(lyrics, duration)
        : null
    : null;
  const isPlainText = lyrics && !syncedLines;

  const currentLineIndex = syncedLines
    ? syncedLines.reduce((best, line, i) => (line.time <= currentTime ? i : best), -1)
    : -1;

  const containerRef = useRef(null);
  const currentLineRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const line = currentLineRef.current;
    if (!container || !line || currentLineIndex < 0) return;
    const cRect = container.getBoundingClientRect();
    const lRect = line.getBoundingClientRect();
    container.scrollTo({
      top: container.scrollTop + (lRect.top - cRect.top) - cRect.height / 2 + lRect.height / 2,
      behavior: "smooth",
    });
  }, [currentLineIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ type: "spring", damping: 30, stiffness: 320 }}
      className="absolute bottom-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl z-50 flex flex-col"
      style={{ maxHeight: "22rem" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{songTitle}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{artist}</p>
        </div>
        {syncedLines && (
          <span className="mx-3 text-xs text-green-500 font-medium flex-shrink-0">Synced</span>
        )}
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
        >
          <X size={15} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Body */}
      <div ref={containerRef} className="overflow-y-auto flex-1 px-6 py-5">
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500" />
          </div>
        )}

        {!isLoading && !lyrics && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Music2 size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No lyrics for this song yet.</p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              Artists can add lyrics when uploading.
            </p>
          </div>
        )}

        {!isLoading && syncedLines && (
          <div className="space-y-2 pb-10">
            {syncedLines.map((line, i) => {
              const isCurrent = i === currentLineIndex;
              const isPast = i < currentLineIndex;
              return (
                <motion.p
                  key={i}
                  ref={isCurrent ? currentLineRef : null}
                  animate={{
                    scale: isCurrent ? 1.06 : 0.97,
                    opacity: isCurrent ? 1 : isPast ? 0.35 : 0.55,
                    color: isCurrent ? "#22c55e" : isPast ? "#9ca3af" : "#6b7280",
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`text-center leading-relaxed select-none ${isCurrent ? "font-semibold" : "font-normal"}`}
                  style={{ fontSize: isCurrent ? "1rem" : "0.875rem" }}
                >
                  {line.text}
                </motion.p>
              );
            })}
          </div>
        )}

        {!isLoading && isPlainText && (
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-center pb-4">
            {lyrics}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default LyricsPanel;
