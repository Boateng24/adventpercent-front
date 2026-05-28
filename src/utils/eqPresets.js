// Frequency bands in Hz (sub-bass → air)
export const EQ_BAND_FREQS = [60, 250, 1000, 4000, 16000];
export const EQ_BAND_LABELS = ["60Hz", "250Hz", "1kHz", "4kHz", "16kHz"];

export const EQ_PRESETS = [
  {
    id: "flat",
    name: "Flat",
    description: "Natural, unprocessed sound",
    gains: [0, 0, 0, 0, 0],
  },
  {
    id: "bassBoost",
    name: "Bass Boost",
    description: "Deep, punchy low end",
    gains: [7, 5, 0, -1, -1],
  },
  {
    id: "vocalBoost",
    name: "Vocal Boost",
    description: "Clear, present vocals",
    gains: [-2, 0, 5, 4, 1],
  },
  {
    id: "pop",
    name: "Pop",
    description: "Bright, energetic mix",
    gains: [2, 1, -1, 2, 4],
  },
  {
    id: "classical",
    name: "Classical",
    description: "Warm, natural acoustics",
    gains: [4, 3, -1, 2, 4],
  },
];
