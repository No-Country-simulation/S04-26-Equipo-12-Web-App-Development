import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/store";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex items-center w-14 h-7 rounded-full px-1 cursor-pointer transition-colors duration-300 bg-surface-background-deep border border-outline-variant focus-visible:outline-2 focus-visible:outline-primary"
    >
      {/* Track fill */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary"
        initial={false}
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Thumb */}
      <motion.div
        className="relative z-10 flex items-center justify-center w-5 h-5 rounded-full bg-background shadow-sm"
        initial={false}
        animate={{ x: isDark ? 28 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Moon size={12} className="text-primary" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: 30, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -30, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Sun size={12} className="text-foreground" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
