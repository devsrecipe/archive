import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BrandPreloader({ duration = 3000, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing system...");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const startTime = performance.now();

    const updateProgress = (now) => {
      const elapsed = now - startTime;
      const pct = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 30) {
        setStatusText("booting devsrecipe engine...");
      } else if (pct < 65) {
        setStatusText("powering circuit architecture...");
      } else if (pct < 90) {
        setStatusText("cooking your digital idea...");
      } else {
        setStatusText("system ready.");
      }

      if (elapsed < duration) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          setIsDone(true);
          if (onComplete) onComplete();
        }, 150);
      }
    };

    const frame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(frame);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="brand-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(8px)",
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "#050507",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Ambient Background Radial Glow */}
          <div
            style={{
              position: "absolute",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(0, 0, 0, 0) 70%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />

          {/* Center Brand Logo Container */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            {/* SVG Animated Brand Logo: Chef Hat + Circuit Board + Terminal */}
            <motion.svg
              width="150"
              height="150"
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{ filter: "drop-shadow(0 0 25px rgba(255, 255, 255, 0.25))" }}
            >
              {/* --- 1. CHEF HAT OUTER OUTLINE --- */}
              <motion.path
                d="M 38 100 C 22 100 12 85 18 68 C 14 48 30 32 48 32 C 54 18 72 14 88 18 C 104 14 122 18 128 32 C 146 32 162 48 158 68 C 164 85 154 100 138 100"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />

              {/* Outer Subtle Halo Outline */}
              <motion.path
                d="M 38 100 C 22 100 12 85 18 68 C 14 48 30 32 48 32 C 54 18 72 14 88 18 C 104 14 122 18 128 32 C 146 32 162 48 158 68 C 164 85 154 100 138 100"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, ease: "easeInOut", delay: 0.2 }}
              />

              {/* --- 2. CIRCUIT BOARD TREE TRACES --- */}
              {/* Central Trunk */}
              <motion.path
                d="M 88 100 L 88 40"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
              />

              {/* Left Primary Branch */}
              <motion.path
                d="M 88 85 L 68 65 L 48 65 L 48 48"
                stroke="#d4d4d8"
                strokeWidth="2.8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.7, ease: "easeInOut" }}
              />

              {/* Left Lower Branch */}
              <motion.path
                d="M 88 95 L 60 95 L 38 80 L 38 68"
                stroke="#a1a1aa"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.9, ease: "easeInOut" }}
              />

              {/* Right Primary Branch */}
              <motion.path
                d="M 88 85 L 108 65 L 128 65 L 128 48"
                stroke="#d4d4d8"
                strokeWidth="2.8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.7, ease: "easeInOut" }}
              />

              {/* Right Lower Branch */}
              <motion.path
                d="M 88 95 L 116 95 L 138 80 L 138 68"
                stroke="#a1a1aa"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.9, ease: "easeInOut" }}
              />

              {/* Secondary Feeder Traces */}
              <motion.path
                d="M 68 65 L 68 45"
                stroke="#a1a1aa"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              />
              <motion.path
                d="M 108 65 L 108 45"
                stroke="#a1a1aa"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              />

              {/* --- 3. CIRCUIT TERMINAL NODES --- */}
              {[
                { cx: 88, cy: 38 },
                { cx: 48, cy: 46 },
                { cx: 128, cy: 46 },
                { cx: 38, cy: 66 },
                { cx: 138, cy: 66 },
                { cx: 68, cy: 43 },
                { cx: 108, cy: 43 },
              ].map((node, i) => (
                <motion.g
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.0 + i * 0.1, duration: 0.4 }}
                >
                  <circle cx={node.cx} cy={node.cy} r="4" fill="#09090b" stroke="#ffffff" strokeWidth="2.5" />
                  <motion.circle
                    cx={node.cx}
                    cy={node.cy}
                    r="2"
                    fill="#ffffff"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                </motion.g>
              ))}

              {/* --- 4. BOTTOM TERMINAL BOX WITH > _ --- */}
              {/* Terminal Box Body */}
              <motion.rect
                x="32"
                y="104"
                width="112"
                height="44"
                rx="8"
                fill="#09090b"
                stroke="#ffffff"
                strokeWidth="3"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              />

              {/* Terminal CLI Chevron '>' */}
              <motion.path
                d="M 48 118 L 58 126 L 48 134"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              />

              {/* Terminal CLI Underscore Cursor '_' */}
              <motion.path
                d="M 66 134 L 80 134"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
              />

              {/* Simulated Command Text */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                <circle cx="92" cy="126" r="2" fill="rgba(255,255,255,0.7)" />
                <circle cx="100" cy="126" r="2" fill="rgba(255,255,255,0.7)" />
                <circle cx="108" cy="126" r="2" fill="rgba(255,255,255,0.7)" />
                <circle cx="116" cy="126" r="2" fill="rgba(255,255,255,0.7)" />
              </motion.g>
            </motion.svg>

            {/* Brand Title */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{ marginTop: 24, textAlign: "center" }}
            >
              <div
                style={{
                  fontFamily: "var(--font-heading, sans-serif)",
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#ffffff",
                }}
              >
                devs<span style={{ color: "#a1a1aa" }}>recipe</span>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: 11,
                  color: "#71717a",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginTop: 4,
                  fontWeight: 600,
                }}
              >
                Cook Your Idea with Devs Recipe
              </div>
            </motion.div>

            {/* Terminal Live Status & Progress Meter */}
            <div
              style={{
                marginTop: 28,
                width: 240,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              {/* Progress Track */}
              <div
                style={{
                  width: "100%",
                  height: 3,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  borderRadius: 9999,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <motion.div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #71717a 0%, #ffffff 100%)",
                    boxShadow: "0 0 12px rgba(255, 255, 255, 0.8)",
                    borderRadius: 9999,
                  }}
                />
              </div>

              {/* Status and Percentage */}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 11,
                  fontFamily: "var(--font-mono, monospace)",
                  color: "#a1a1aa",
                }}
              >
                <span style={{ color: "#d4d4d8" }}>{statusText}</span>
                <span style={{ color: "#ffffff", fontWeight: 700 }}>
                  {progress.toString().padStart(2, "0")}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
