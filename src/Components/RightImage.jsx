import { motion } from "framer-motion";

export const RightImage = () => {
  const notes = ["♩", "♪", "♫", "♬", "𝄞", "♩", "♪", "♫"];

  return (
    <div className="relative flex-1 self-stretch overflow-hidden bg-gradient-to-br from-green-400 via-teal-500 to-blue-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 flex flex-col items-center justify-center">

      {/* Background glow blobs */}
      <div className="absolute top-16 left-16 w-72 h-72 bg-white/10 dark:bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-24 right-12 w-96 h-96 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-200/20 dark:bg-teal-400/5 rounded-full blur-2xl" />

      {/* Floating music notes */}
      {notes.map((note, i) => (
        <motion.span
          key={i}
          className="absolute text-white/30 dark:text-white/20 select-none pointer-events-none"
          style={{
            fontSize: `${1.2 + (i % 3) * 0.8}rem`,
            left: `${8 + (i * 11) % 84}%`,
            top: `${10 + (i * 13) % 80}%`,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        >
          {note}
        </motion.span>
      ))}

      {/* Vinyl record */}
      <motion.div
        className="relative mb-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        {/* Outer record */}
        <div className="w-52 h-52 rounded-full bg-gray-900 dark:bg-gray-950 shadow-2xl flex items-center justify-center relative overflow-hidden">
          {/* Grooves */}
          {[40, 52, 64, 76, 88].map((size) => (
            <div
              key={size}
              className="absolute rounded-full border border-gray-700/60 dark:border-gray-600/40"
              style={{ width: `${size}%`, height: `${size}%` }}
            />
          ))}
          {/* Label */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center z-10 shadow-inner">
            <div className="w-4 h-4 rounded-full bg-gray-900 dark:bg-gray-950" />
          </div>
          {/* Shine */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
        </div>

        {/* Tonearm */}
        <div
          className="absolute -right-6 top-2 w-20 h-1 bg-white/60 dark:bg-gray-400/60 rounded-full origin-right"
          style={{ transform: "rotate(-30deg)", transformOrigin: "right center" }}
        />
      </motion.div>

      {/* Waveform bars */}
      <div className="flex items-end space-x-1 mb-10 h-12">
        {[3, 6, 9, 5, 8, 4, 7, 10, 6, 3, 8, 5, 9, 4, 6, 3, 7, 10, 5, 8].map((h, i) => (
          <motion.div
            key={i}
            className="w-1.5 rounded-full bg-white/70 dark:bg-white/50"
            animate={{ height: [`${h * 3}px`, `${h * 5}px`, `${h * 3}px`] }}
            transition={{ duration: 0.8 + (i % 4) * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
          />
        ))}
      </div>

      {/* Branding text */}
      <div className="text-center px-8">
        <h2 className="text-white text-3xl font-bold mb-2 drop-shadow-lg">AdventPercent</h2>
        <p className="text-white/80 dark:text-white/60 text-sm leading-relaxed max-w-xs">
          Your home for Adventist music — curated, approved, and always uplifting.
        </p>
      </div>

      {/* Bottom dots */}
      <div className="absolute bottom-8 flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-white/50"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};
