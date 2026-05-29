const DEFAULT_COVER_IMAGES = [
  "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/164907/pexels-photo-164907.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/210764/pexels-photo-210764.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/7672255/pexels-photo-7672255.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/2097250/pexels-photo-2097250.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/3771114/pexels-photo-3771114.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/4088801/pexels-photo-4088801.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400",
];

/**
 * Returns a consistent default cover image for a song with no artwork.
 * The same song always gets the same image (deterministic hash of id/title).
 */
export const getDefaultImage = (song) => {
  const key = String(song?.id ?? song?.title ?? "");
  const hash = [...key].reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return DEFAULT_COVER_IMAGES[hash % DEFAULT_COVER_IMAGES.length];
};

export default DEFAULT_COVER_IMAGES;
