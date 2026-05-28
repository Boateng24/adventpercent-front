import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipForward, SkipBack,
  Volume2, VolumeX, Repeat, Shuffle,
  Heart, Download, ChevronUp, ChevronDown,
  X, ListMusic, SlidersHorizontal, Radio, Moon, Waves, ScrollText,
} from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { useDispatch, useSelector } from "react-redux";
import {
  togglePlayPause, setIsPlaying, goToNext, goToPrevious,
  togglePanel, closePlayer, addToQueue, stopRadio,
} from "../../features/queue.slice";
import { addRecentlyPlayed, addToFavorites, removeFromFavorites, getSimilarSongs, getSongDetails } from "../../api/songs/songs";
import downloadSong from "../../helpers/download";
import QueuePanel from "../QueuePanel/QueuePanel";
import EqualizerPanel from "../EqualizerPanel/EqualizerPanel";
import LyricsPanel from "../LyricsPanel/LyricsPanel";
import { EQ_PRESETS, EQ_BAND_FREQS } from "../../utils/eqPresets";
import { isLRC, parseLRC, distributeLines } from "../../utils/lrcParser";

const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400";

const SleepMenu = ({ onSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 4, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 4, scale: 0.95 }}
    transition={{ duration: 0.1 }}
    className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 min-w-[150px] z-50"
    onClick={(e) => e.stopPropagation()}
  >
    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 px-3 pb-1.5 uppercase tracking-wide">
      Sleep Timer
    </p>
    {[15, 30, 60].map((min) => (
      <button key={min} onClick={() => onSelect(min)}
        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        {min} minutes
      </button>
    ))}
    <button onClick={() => onSelect("song")}
      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      End of song
    </button>
  </motion.div>
);

const AudioPlayer = () => {
  const dispatch = useDispatch();
  const { items, currentIndex, isPlaying, panelOpen, radioMode, radioSeedSong } = useSelector((s) => s.queue);
  const currentSong = items[currentIndex] ?? null;

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("flat");
  const [eqOpen, setEqOpen] = useState(false);
  const [sleepMenuOpen, setSleepMenuOpen] = useState(false);
  const [sleepEnd, setSleepEnd] = useState(null);
  const [sleepCountdown, setSleepCountdown] = useState(null);
  const [crossfadeDuration, setCrossfadeDuration] = useState(0);
  const [xfadeMenuOpen, setXfadeMenuOpen] = useState(false);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [lyrics, setLyrics] = useState(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [lyricsFetched, setLyricsFetched] = useState(false);

  // Slot A = audioRef, Slot B = audioBRef. activeSlot tracks which is live.
  const audioRef = useRef(null);
  const audioBRef = useRef(null);
  const activeSlot = useRef("A");
  const progressRef = useRef(null);
  const audioContextRef = useRef(null);
  const filtersRef = useRef([]);
  const radioFetchingRef = useRef(false);
  const sleepIntervalRef = useRef(null);
  const preFadeVolumeRef = useRef(null);
  const isCrossfadingRef = useRef(false);
  const xfadeRafRef = useRef(null);
  const xfadedToSongIdRef = useRef(null);
  const expandedLyricsContainerRef = useRef(null);
  const expandedCurrentLineRef = useRef(null);

  const getActive = useCallback(
    () => (activeSlot.current === "A" ? audioRef.current : audioBRef.current),
    []
  );
  const getInactive = useCallback(
    () => (activeSlot.current === "A" ? audioBRef.current : audioRef.current),
    []
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // EQ — only wired to slot A (audioRef). Acceptable tradeoff with crossfade.
  const applyPreset = useCallback(async (presetId) => {
    setSelectedPreset(presetId);
    if (!audioContextRef.current && audioRef.current) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const source = ctx.createMediaElementSource(audioRef.current);
        const filters = EQ_BAND_FREQS.map((freq, i) => {
          const f = ctx.createBiquadFilter();
          f.type = i === 0 ? "lowshelf" : i === EQ_BAND_FREQS.length - 1 ? "highshelf" : "peaking";
          f.frequency.value = freq;
          f.Q.value = 1.4;
          f.gain.value = 0;
          return f;
        });
        source.connect(filters[0]);
        for (let i = 0; i < filters.length - 1; i++) filters[i].connect(filters[i + 1]);
        filters[filters.length - 1].connect(ctx.destination);
        audioContextRef.current = ctx;
        filtersRef.current = filters;
      } catch { return; }
    }
    const ctx = audioContextRef.current;
    const filters = filtersRef.current;
    if (!ctx || !filters.length) return;
    const preset = EQ_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    if (ctx.state !== "running") await ctx.resume();
    preset.gains.forEach((gain, i) => {
      filters[i]?.gain.setTargetAtTime(gain, ctx.currentTime, 0.015);
    });
  }, []);

  useHotkeys("space", (e) => { if (!isMobile) { e.preventDefault(); dispatch(togglePlayPause()); } });
  useHotkeys("ctrl+right", () => !isMobile && dispatch(goToNext()));
  useHotkeys("ctrl+left", () => !isMobile && dispatch(goToPrevious()));
  useHotkeys("ctrl+up", () => !isMobile && setVolume((v) => Math.min(1, v + 0.1)));
  useHotkeys("ctrl+down", () => !isMobile && setVolume((v) => Math.max(0, v - 0.1)));

  // Song loading — targets whichever slot is active
  useEffect(() => {
    const audio = getActive();
    if (!audio || !currentSong?.track) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onMetadata = () => { setDuration(audio.duration); setIsLoading(false); };
    const onLoadStart = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onError = () => setIsLoading(false);
    const onEnded = () => {
      if (isRepeat) { audio.currentTime = 0; audio.play(); }
      else dispatch(goToNext());
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadstart", onLoadStart);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("error", onError);

    if (xfadedToSongIdRef.current === currentSong.id) {
      // Crossfade already played this song into the active slot — just sync state
      xfadedToSongIdRef.current = null;
      if (!isNaN(audio.duration)) { setDuration(audio.duration); setCurrentTime(audio.currentTime); }
    } else {
      // Manual navigation or first play — cancel any running crossfade first
      cancelAnimationFrame(xfadeRafRef.current);
      if (isCrossfadingRef.current) {
        isCrossfadingRef.current = false;
        const inactive = getInactive();
        inactive?.pause();
        if (inactive) inactive.src = "";
      }
      audio.src = currentSong.track;
      audio.load();
      addRecentlyPlayed(currentSong.id);
      setIsLiked(false);
      setCurrentTime(0);
    }

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadstart", onLoadStart);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("error", onError);
    };
  }, [currentSong?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Play / pause
  useEffect(() => {
    const audio = getActive();
    if (!audio) return;
    if (isPlaying && !isLoading) {
      audio.play().catch(() => dispatch(setIsPlaying(false)));
    } else {
      audio.pause();
    }
  }, [isPlaying, isLoading, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Volume — skipped during active crossfade to avoid fighting the fade
  useEffect(() => {
    const audio = getActive();
    if (audio && !isCrossfadingRef.current) audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sleep Timer ───────────────────────────────────────────────────────────
  const cancelSleepTimer = useCallback(() => {
    clearInterval(sleepIntervalRef.current);
    sleepIntervalRef.current = null;
    const audio = getActive();
    if (preFadeVolumeRef.current !== null && audio) {
      audio.volume = preFadeVolumeRef.current;
      preFadeVolumeRef.current = null;
    }
    setSleepEnd(null);
    setSleepCountdown(null);
    setSleepMenuOpen(false);
  }, [getActive]);

  const startSleepTimer = useCallback((minutes) => {
    cancelSleepTimer();
    const audio = getActive();
    const seconds = minutes === "song"
      ? Math.ceil((audio?.duration ?? 0) - (audio?.currentTime ?? 0))
      : minutes * 60;
    if (seconds <= 0) return;
    setSleepEnd(Date.now() + seconds * 1000);
    setSleepCountdown(seconds);
    setSleepMenuOpen(false);
  }, [cancelSleepTimer, getActive]);

  useEffect(() => {
    if (!sleepEnd) return;
    sleepIntervalRef.current = setInterval(() => {
      const remaining = Math.ceil((sleepEnd - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(sleepIntervalRef.current);
        const audio = getActive();
        if (audio) audio.volume = preFadeVolumeRef.current ?? audio.volume;
        preFadeVolumeRef.current = null;
        dispatch(setIsPlaying(false));
        setSleepEnd(null);
        setSleepCountdown(null);
        return;
      }
      setSleepCountdown(remaining);
      const audio = getActive();
      if (remaining <= 30 && audio) {
        if (preFadeVolumeRef.current === null) preFadeVolumeRef.current = audio.volume;
        audio.volume = preFadeVolumeRef.current * (remaining / 30);
      }
    }, 1000);
    return () => clearInterval(sleepIntervalRef.current);
  }, [sleepEnd, dispatch, getActive]);

  // ── Crossfade ─────────────────────────────────────────────────────────────
  const startCrossfade = useCallback(() => {
    if (isCrossfadingRef.current || !crossfadeDuration) return;
    const nextIdx = (currentIndex + 1) % items.length;
    const nextSong = items[nextIdx];
    if (!nextSong?.track) return;

    isCrossfadingRef.current = true;
    const currentAudio = getActive();
    const nextAudio = getInactive();
    if (!currentAudio || !nextAudio) { isCrossfadingRef.current = false; return; }

    nextAudio.src = nextSong.track;
    nextAudio.volume = 0;
    nextAudio.play().catch(() => {});

    const targetVol = isMuted ? 0 : volume;
    const startVol = currentAudio.volume;
    const fadeDurationMs = crossfadeDuration * 1000;
    const startTime = performance.now();

    const tick = () => {
      const progress = Math.min((performance.now() - startTime) / fadeDurationMs, 1);
      currentAudio.volume = startVol * (1 - progress);
      nextAudio.volume = targetVol * progress;

      if (progress < 1) {
        xfadeRafRef.current = requestAnimationFrame(tick);
      } else {
        currentAudio.pause();
        currentAudio.src = "";
        nextAudio.volume = targetVol;
        activeSlot.current = activeSlot.current === "A" ? "B" : "A";
        xfadedToSongIdRef.current = nextSong.id;
        isCrossfadingRef.current = false;
        dispatch(goToNext());
      }
    };

    cancelAnimationFrame(xfadeRafRef.current);
    xfadeRafRef.current = requestAnimationFrame(tick);
  }, [currentIndex, items, crossfadeDuration, isMuted, volume, getActive, getInactive, dispatch]);

  // Trigger crossfade when `crossfadeDuration` seconds remain in the current song
  useEffect(() => {
    if (!crossfadeDuration || !duration || !isPlaying || isCrossfadingRef.current) return;
    const remaining = duration - currentTime;
    if (remaining > 0 && remaining <= crossfadeDuration) startCrossfade();
  }, [currentTime]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Radio auto-append ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!radioMode || !radioSeedSong || radioFetchingRef.current) return;
    const upcomingCount = Math.max(0, items.length - currentIndex - 1);
    if (upcomingCount > 3) return;
    radioFetchingRef.current = true;
    const excludeIds = items.map((s) => s.id);
    getSimilarSongs(radioSeedSong, excludeIds)
      .then((more) => more.slice(0, 10).forEach((song) => dispatch(addToQueue(song))))
      .finally(() => { radioFetchingRef.current = false; });
  }, [radioMode, radioSeedSong, items.length, currentIndex, dispatch]);

  // Reset lyrics state whenever the song changes
  useEffect(() => {
    setLyrics(null);
    setLyricsFetched(false);
    setLyricsOpen(false);
  }, [currentSong?.id]);

  // Lazy-fetch lyrics when the expanded view or lyrics panel opens for this song
  useEffect(() => {
    if ((!lyricsOpen && !isExpanded) || lyricsFetched || !currentSong?.id) return;
    setLyricsLoading(true);
    getSongDetails(currentSong.id)
      .then((song) => setLyrics(song?.lyrics ?? null))
      .catch(() => setLyrics(null))
      .finally(() => { setLyricsLoading(false); setLyricsFetched(true); });
  }, [lyricsOpen, isExpanded, lyricsFetched, currentSong?.id]);

  // Memoized so parseLRC / distributeLines don't run on every currentTime tick
  const expandedSyncedLines = useMemo(() => {
    if (!lyrics) return null;
    if (isLRC(lyrics)) return parseLRC(lyrics);
    if (duration > 0) return distributeLines(lyrics, duration);
    return null;
  }, [lyrics, duration]);

  const expandedCurrentLineIndex = expandedSyncedLines
    ? expandedSyncedLines.reduce((best, line, i) => (line.time <= currentTime ? i : best), -1)
    : -1;

  // Auto-scroll the highlighted line in the expanded-view lyrics section
  useEffect(() => {
    const container = expandedLyricsContainerRef.current;
    const line = expandedCurrentLineRef.current;
    if (!isExpanded || !container || !line || expandedCurrentLineIndex < 0) return;
    const cRect = container.getBoundingClientRect();
    const lRect = line.getBoundingClientRect();
    container.scrollTo({
      top: container.scrollTop + (lRect.top - cRect.top) - cRect.height / 2 + lRect.height / 2,
      behavior: "smooth",
    });
  }, [expandedCurrentLineIndex, isExpanded]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Helpers ───────────────────────────────────────────────────────────────
  const handleProgressClick = (e) => {
    const audio = getActive();
    const bar = progressRef.current;
    if (!audio || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const formatTime = (t) => {
    if (!t || isNaN(t)) return "0:00";
    return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
  };

  const handleLike = async () => {
    const next = !isLiked;
    setIsLiked(next);
    try {
      next ? await addToFavorites(currentSong.id) : await removeFromFavorites(currentSong.id);
    } catch { setIsLiked(!next); }
  };

  const handleDownload = () => {
    if (currentSong?.track && currentSong?.title) downloadSong(currentSong.track, currentSong.title);
  };

  if (!currentSong) return null;

  return (
    <>
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />
      <audio ref={audioBRef} preload="metadata" crossOrigin="anonymous" />
      <QueuePanel />

      <AnimatePresence>
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-200 dark:border-gray-700 z-40 pb-[env(safe-area-inset-bottom,0px)]"
        >
          <AnimatePresence>
            {eqOpen && (
              <EqualizerPanel activePreset={selectedPreset} onSelectPreset={applyPreset} onClose={() => setEqOpen(false)} />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {lyricsOpen && (
              <LyricsPanel
                lyrics={lyrics}
                isLoading={lyricsLoading}
                currentTime={currentTime}
                duration={duration}
                songTitle={currentSong.title}
                artist={currentSong.artist}
                onClose={() => setLyricsOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <div
            ref={progressRef}
            className="w-full h-1 bg-gray-200 dark:bg-gray-700 cursor-pointer hover:h-2 transition-all duration-200 group"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-gradient-to-r from-green-500 to-blue-500 relative"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100" />
            </div>
          </div>

          {/* Close */}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(closePlayer())}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-blue-500 shadow z-10">
            <X size={14} className="text-white" />
          </motion.button>

          <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3">

            {/* ── Song info ── */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <motion.div whileHover={{ scale: 1.05 }} className="relative cursor-pointer flex-shrink-0"
                onClick={() => setIsExpanded(!isExpanded)}>
                <img src={currentSong.image || DEFAULT_IMAGE} alt={currentSong.title}
                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg object-cover shadow-lg"
                  onError={(e) => { e.target.src = DEFAULT_IMAGE; }} />
                {isLoading && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  </div>
                )}
              </motion.div>

              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white truncate text-sm sm:text-base">
                  {currentSong.title || "Unknown Title"}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                  {currentSong.artist || "Unknown Artist"}
                </p>
                <AnimatePresence>
                  {radioMode && (
                    <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }} onClick={() => dispatch(stopRadio())}
                      className="mt-0.5 flex items-center gap-1 text-xs text-green-500 hover:text-green-600 transition-colors">
                      <Radio size={11} className="animate-pulse" />
                      <span>Radio · tap to stop</span>
                    </motion.button>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {sleepEnd && (
                    <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }} onClick={cancelSleepTimer}
                      className="mt-0.5 flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-500 transition-colors">
                      <Moon size={11} />
                      <span>Sleep · {formatTime(sleepCountdown)}</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden md:flex items-center space-x-1">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleLike}
                  className={`p-2 rounded-full transition-colors ${isLiked ? "text-red-500 bg-red-50 dark:bg-red-900/20" : "text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"}`}>
                  <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleDownload}
                  className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <Download size={16} />
                </motion.button>
              </div>
            </div>

            {/* ── Playback controls ── */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
              <motion.button whileHover={{ scale: 1.1 }} onClick={() => setIsShuffle(!isShuffle)}
                className={`hidden sm:flex p-2 rounded-full transition-colors ${isShuffle ? "text-green-500 bg-green-50 dark:bg-green-900/20" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}>
                <Shuffle size={16} />
              </motion.button>

              <motion.button whileHover={{ scale: 1.1 }} onClick={() => dispatch(goToPrevious())}
                className="p-1 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <SkipBack size={18} />
              </motion.button>

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => dispatch(togglePlayPause())} disabled={isLoading}
                className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50">
                {isLoading
                  ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  : isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </motion.button>

              <motion.button whileHover={{ scale: 1.1 }} onClick={() => dispatch(goToNext())}
                className="p-1 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <SkipForward size={18} />
              </motion.button>

              <motion.button whileHover={{ scale: 1.1 }} onClick={() => setIsRepeat(!isRepeat)}
                className={`hidden sm:flex p-2 rounded-full transition-colors ${isRepeat ? "text-green-500 bg-green-50 dark:bg-green-900/20" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}>
                <Repeat size={16} />
              </motion.button>
            </div>

            {/* ── Desktop: time + volume + settings row ── */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 flex-1 justify-end">
              <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[36px] text-right">{formatTime(currentTime)}</span>
              <span className="text-sm text-gray-300 dark:text-gray-600">/</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[36px]">{formatTime(duration)}</span>

              {/* Volume */}
              <div className="relative flex items-center"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}>
                <motion.button whileHover={{ scale: 1.1 }} onClick={() => setIsMuted(!isMuted)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </motion.button>
                <AnimatePresence>
                  {showVolumeSlider && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                      className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                      <input type="range" min="0" max="1" step="0.05" value={volume}
                        onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
                        className="w-20 h-1 appearance-none cursor-pointer accent-green-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* EQ */}
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => { setEqOpen((o) => !o); setLyricsOpen(false); }}
                className={`p-2 rounded-full transition-colors ${eqOpen ? "text-green-500 bg-green-50 dark:bg-green-900/20" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                title="Equalizer">
                <SlidersHorizontal size={18} />
              </motion.button>

              {/* Lyrics */}
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => { setLyricsOpen((o) => !o); setEqOpen(false); }}
                className={`p-2 rounded-full transition-colors ${lyricsOpen ? "text-purple-500 bg-purple-50 dark:bg-purple-900/20" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                title="Lyrics">
                <ScrollText size={18} />
              </motion.button>

              {/* Crossfade */}
              <div className="relative" onMouseLeave={() => setXfadeMenuOpen(false)}>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setXfadeMenuOpen((o) => !o)}
                  className={`p-2 rounded-full transition-colors ${crossfadeDuration > 0 ? "text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                  title="Crossfade">
                  <Waves size={18} />
                </motion.button>
                <AnimatePresence>
                  {xfadeMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                      className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-[210px] z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Crossfade</span>
                        <span className={`text-xs font-medium ${crossfadeDuration > 0 ? "text-cyan-500" : "text-gray-400"}`}>
                          {crossfadeDuration === 0 ? "Off" : `${crossfadeDuration}s`}
                        </span>
                      </div>
                      <input
                        type="range" min="0" max="12" step="1"
                        value={crossfadeDuration}
                        onChange={(e) => setCrossfadeDuration(Number(e.target.value))}
                        className="w-full h-1.5 appearance-none cursor-pointer accent-cyan-500 rounded-full"
                      />
                      <div className="flex justify-between mt-1.5">
                        <span className="text-xs text-gray-400">Off</span>
                        <span className="text-xs text-gray-400">12s</span>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 leading-snug">
                        Blend audio between songs as one ends and the next begins.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sleep Timer */}
              <div className="relative" onMouseLeave={() => setSleepMenuOpen(false)}>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => sleepEnd ? cancelSleepTimer() : setSleepMenuOpen((o) => !o)}
                  className={`p-2 rounded-full transition-colors ${sleepEnd ? "text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                  title={sleepEnd ? "Cancel sleep timer" : "Sleep timer"}>
                  <Moon size={18} />
                </motion.button>
                <AnimatePresence>{sleepMenuOpen && <SleepMenu onSelect={startSleepTimer} />}</AnimatePresence>
              </div>

              {/* Queue */}
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(togglePanel())}
                className={`p-2 rounded-full transition-colors ${panelOpen ? "text-green-500 bg-green-50 dark:bg-green-900/20" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                title="Queue">
                <ListMusic size={18} />
              </motion.button>

              {/* Expand */}
              <motion.button whileHover={{ scale: 1.1 }} onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </motion.button>
            </div>

            {/* ── Mobile icon row ── */}
            <div className="lg:hidden flex items-center gap-0.5 ml-1">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => { setEqOpen((o) => !o); setLyricsOpen(false); }}
                className={`p-2 rounded-full transition-colors ${eqOpen ? "text-green-500" : "text-gray-400"}`}>
                <SlidersHorizontal size={18} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => { setLyricsOpen((o) => !o); setEqOpen(false); }}
                className={`p-2 rounded-full transition-colors ${lyricsOpen ? "text-purple-500" : "text-gray-400"}`}>
                <ScrollText size={18} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(togglePanel())}
                className={`p-2 rounded-full transition-colors ${panelOpen ? "text-green-500" : "text-gray-400"}`}>
                <ListMusic size={18} />
              </motion.button>
              <div className="relative">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => sleepEnd ? cancelSleepTimer() : setSleepMenuOpen((o) => !o)}
                  className={`p-2 rounded-full transition-colors ${sleepEnd ? "text-indigo-400" : "text-gray-400"}`}>
                  <Moon size={18} />
                </motion.button>
                <AnimatePresence>{sleepMenuOpen && <SleepMenu onSelect={startSleepTimer} />}</AnimatePresence>
              </div>
            </div>
          </div>

          {/* Expanded view */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden"
              >
                <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 sm:py-5 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 sm:gap-8 items-start">

                  {/* Left — song info */}
                  <div className="flex sm:flex-col items-center sm:text-center gap-3 flex-shrink-0">
                    <img src={currentSong.image || DEFAULT_IMAGE} alt={currentSong.title}
                      className="w-16 h-16 sm:w-36 sm:h-36 rounded-lg sm:rounded-xl object-cover shadow-lg"
                      onError={(e) => { e.target.src = DEFAULT_IMAGE; }} />
                    <div className="w-full">
                      <h2 className="font-bold text-gray-900 dark:text-white truncate text-base">
                        {currentSong.title || "Unknown Title"}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {currentSong.artist || "Unknown Artist"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <button onClick={handleLike}
                        className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${isLiked ? "bg-red-100 text-red-600 dark:bg-red-900/30" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"}`}>
                        <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                        {isLiked ? "Liked" : "Like"}
                      </button>
                      <button onClick={handleDownload}
                        className="flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        <Download size={14} />
                        Download
                      </button>
                    </div>
                  </div>

                  {/* Right — lyrics */}
                  <div className="flex flex-col min-h-0">
                    <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                      <ScrollText size={15} className="text-purple-500" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Lyrics</span>
                      {expandedSyncedLines && (
                        <span className="text-xs text-green-500 font-medium">Synced</span>
                      )}
                    </div>

                    <div ref={expandedLyricsContainerRef} className="overflow-y-auto pr-2" style={{ maxHeight: "11rem" }}>
                      {lyricsLoading && (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500" />
                        </div>
                      )}

                      {!lyricsLoading && !lyrics && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <p className="text-sm text-gray-400 dark:text-gray-500">No lyrics for this song yet.</p>
                          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Artists can add lyrics on upload.</p>
                        </div>
                      )}

                      {!lyricsLoading && expandedSyncedLines && (
                        <div className="space-y-2 pb-6">
                          {expandedSyncedLines.map((line, i) => {
                            const isCurrent = i === expandedCurrentLineIndex;
                            const isPast = i < expandedCurrentLineIndex;
                            return (
                              <motion.p
                                key={i}
                                ref={isCurrent ? expandedCurrentLineRef : null}
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

                      {!lyricsLoading && lyrics && !expandedSyncedLines && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed pb-4">
                          {lyrics}
                        </p>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default AudioPlayer;
