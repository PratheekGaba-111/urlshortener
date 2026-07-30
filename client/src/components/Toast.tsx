import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { useEffect } from "react";
import { useTheme } from "../hooks/useTheme";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast = ({ message, type = "success", isVisible, onClose }: ToastProps) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-400" />,
    error: <XCircle size={18} className="text-red-400" />,
    info: <Info size={18} className="text-blue-400" />,
  };

  const colors = {
    success: theme === "dark" ? "border-emerald-500/20 bg-emerald-500/5" : "border-emerald-200 bg-emerald-50",
    error: theme === "dark" ? "border-red-500/20 bg-red-500/5" : "border-red-200 bg-red-50",
    info: theme === "dark" ? "border-blue-500/20 bg-blue-500/5" : "border-blue-200 bg-blue-50",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl ${
            colors[type]
          }`}
        >
          {icons[type]}
          <span className={`text-sm font-bold whitespace-nowrap ${theme === "dark" ? "text-white" : "text-slate-900"}`}>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
