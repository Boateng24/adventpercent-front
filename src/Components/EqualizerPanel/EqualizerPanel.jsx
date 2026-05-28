import { motion, AnimatePresence } from "framer-motion";
import { X, Check, SlidersHorizontal } from "lucide-react";
import { EQ_PRESETS, EQ_BAND_LABELS } from "../../utils/eqPresets";

const MAX_GAIN = 8;

// Smooth SVG path through the 5 EQ gain points using horizontal bezier handles
const buildPath = (gains, W, H) => {
  const midY = H / 2;
  const pts = gains.map((g, i) => ({
    x: (i / (gains.length - 1)) * W,
    y: midY - (g / MAX_GAIN) * (midY - 3),
  }));

  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cx = (pts[i - 1].x + pts[i].x) / 2;
    d += ` C ${cx},${pts[i - 1].y} ${cx},${pts[i].y} ${pts[i].x},${pts[i].y}`;
  }
  return d;
};

const EqCurve = ({ gains, isActive }) => {
  const W = 76;
  const H = 30;
  const midY = H / 2;
  const path = buildPath(gains, W, H);
  const color = isActive ? "#22c55e" : "#9ca3af";

  return (
    <svg width={W} height={H} className="block my-1" aria-hidden>
      {/* zero line */}
      <line x1="0" y1={midY} x2={W} y2={midY} stroke={color} strokeOpacity="0.2" strokeWidth="1" />
      {/* curve */}
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* data points */}
      {gains.map((g, i) => {
        const x = (i / (gains.length - 1)) * W;
        const y = midY - (g / MAX_GAIN) * (midY - 3);
        return <circle key={i} cx={x} cy={y} r="2" fill={color} />;
      })}
    </svg>
  );
};

const EqualizerPanel = ({ activePreset, onSelectPreset, onClose }) => {
  const active = EQ_PRESETS.find(p => p.id === activePreset);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ type: "spring", damping: 30, stiffness: 320 }}
      className="absolute bottom-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl px-4 pt-4 pb-3 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-green-500" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Equalizer</span>
          {active && (
            <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full font-medium">
              {active.name}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={15} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Preset Cards */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {EQ_PRESETS.map((preset) => {
          const isSelected = activePreset === preset.id;
          return (
            <motion.button
              key={preset.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectPreset(preset.id)}
              className={`flex-shrink-0 flex flex-col items-start p-3 rounded-xl border-2 transition-all w-[120px] text-left ${
                isSelected
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-xs font-semibold leading-tight ${
                  isSelected ? "text-green-600 dark:text-green-400" : "text-gray-800 dark:text-gray-200"
                }`}>
                  {preset.name}
                </span>
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check size={12} className="text-green-500 flex-shrink-0 ml-1" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <EqCurve gains={preset.gains} isActive={isSelected} />

              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5 line-clamp-2">
                {preset.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Band frequency labels */}
      <div className="flex justify-between mt-2 px-1">
        {EQ_BAND_LABELS.map((label) => (
          <span key={label} className="text-xs text-gray-400 dark:text-gray-500">{label}</span>
        ))}
      </div>
    </motion.div>
  );
};

export default EqualizerPanel;
