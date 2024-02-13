export const handlePlayPause = (isPlaying, audioRef, setIsPlaying) => {
  if (isPlaying) {
    audioRef.current.pause();
  } else {
    audioRef.current.play();
  }
  setIsPlaying(!isPlaying);
};