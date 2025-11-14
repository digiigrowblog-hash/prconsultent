// EllipseBgDecoration.js (reusable component)
import { motion } from "framer-motion";

export default function EllipseBgDecoration({
  className = "",
  style = {},
  color = "#d7f6fc", // Default cyan to match your theme
  blur = "blur-3xl",
  opacity = "opacity-60",
  width = "100%",
  height = "40%",
  top = "12%",
  left = "auto",
  right = "20%",
  zIndex = "20"
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`absolute rounded-full ${blur} ${opacity} ${className}`}
      style={{
        background: `radial-gradient(ellipse at center, ${color} 80%, transparent 100%)`,
        width,
        height,
        top,
        left,
        right,
        zIndex,
        ...style
      }}
      aria-hidden="true"
    />
  );
}
