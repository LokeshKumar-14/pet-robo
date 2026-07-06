import { motion } from "framer-motion";

export function RobotAvatar({ compact = false }: { compact?: boolean }) {
  return (
    <motion.div
      className={compact ? "h-24 w-24" : "h-44 w-44"}
      animate={{ y: [0, -5, 0], scale: [1, 1.015, 1] }}
      transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
    >
      <div className="relative h-full w-full">
        <div className="absolute inset-[9%] rounded-full border border-cyan/40 bg-[#111b22] shadow-glow" />
        <div className="absolute left-[18%] right-[18%] top-[32%] h-[33%] rounded-[28%] bg-[#edfaff] shadow-[inset_0_-12px_30px_rgba(104,232,255,0.24)]">
          <motion.span
            className="absolute left-[27%] top-[43%] h-[13%] w-[13%] rounded-full bg-ink"
            animate={{ scaleY: [1, 1, 0.12, 1] }}
            transition={{ repeat: Infinity, duration: 4.8, times: [0, 0.9, 0.94, 1] }}
          />
          <motion.span
            className="absolute right-[27%] top-[43%] h-[13%] w-[13%] rounded-full bg-ink"
            animate={{ scaleY: [1, 1, 0.12, 1] }}
            transition={{ repeat: Infinity, duration: 4.8, times: [0, 0.9, 0.94, 1] }}
          />
        </div>
        <div className="absolute left-[22%] top-[25%] h-[2.5%] w-[18%] -rotate-45 rounded-full bg-cyan" />
        <div className="absolute right-[22%] top-[25%] h-[2.5%] w-[18%] rotate-45 rounded-full bg-cyan" />
        <div className="absolute bottom-[21%] left-1/2 h-[4%] w-[29%] -translate-x-1/2 rounded-full bg-lime" />
      </div>
    </motion.div>
  );
}
