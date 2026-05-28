const TIME_RE = /^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)$/;
const META_RE = /^\[(?:ar|ti|al|au|length|by|offset|re|ve):/i;

export const isLRC = (lyrics) => /\[\d{2}:\d{2}\.\d{2,3}\]/.test(lyrics);

export const parseLRC = (lrc) =>
  lrc
    .split("\n")
    .filter((line) => TIME_RE.test(line) && !META_RE.test(line))
    .map((line) => {
      const m = line.match(TIME_RE);
      const ms = m[3].length === 3 ? parseInt(m[3]) / 1000 : parseInt(m[3]) / 100;
      return {
        time: parseInt(m[1]) * 60 + parseInt(m[2]) + ms,
        text: m[4].trim(),
      };
    })
    .filter((l) => l.text)
    .sort((a, b) => a.time - b.time);

// Distributes plain-text lines evenly across the song duration so they
// can be highlighted like karaoke even without LRC timestamps.
export const distributeLines = (plainText, duration) => {
  if (!duration || !plainText) return null;
  const lines = plainText.split("\n").map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return null;
  return lines.map((text, i) => ({
    time: (i / lines.length) * duration,
    text,
  }));
};
