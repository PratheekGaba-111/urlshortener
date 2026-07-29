import { useState, type FormEvent } from "react";
import { shortenUrl } from "../services/url.service";
import type { UrlData } from "../types/url";
import { Link2, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";

interface UrlFormProps {
  onSuccess: (data: UrlData) => void;
}

const UrlForm = ({ onSuccess }: UrlFormProps) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      setLoading(true);
      const response = await shortenUrl({
        originalUrl: url,
      });
      onSuccess(response.data);
      setUrl("");
    } catch (error) {
      console.error(error);
      // We'll replace this with a proper toast soon
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <form 
          className={`group relative flex flex-col gap-2 rounded-3xl border p-2 shadow-2xl backdrop-blur-xl transition-all duration-500 sm:flex-row ${theme === "dark" ? "border-white/10 bg-white/[0.02] focus-within:border-violet-500/30" : "border-slate-200 bg-white shadow-slate-200/70 focus-within:border-violet-300"}`}
          onSubmit={handleSubmit}
        >
          <div className="relative flex-1 flex items-center">
            <div className={`absolute left-4 transition-colors ${theme === "dark" ? "text-slate-500 group-focus-within:text-violet-400" : "text-slate-400 group-focus-within:text-violet-500"}`}>
              <Link2 size={20} />
            </div>
            <input
              type="url"
              placeholder="Paste your long link here..."
              className={`w-full bg-transparent py-4 pl-12 pr-4 text-base focus:outline-none ${theme === "dark" ? "text-white placeholder:text-slate-600" : "text-slate-900 placeholder:text-slate-400"}`}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="relative overflow-hidden flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 text-white font-bold px-8 py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-violet-500/20"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Sparkles size={18} />
                <span>Shorten</span>
              </>
            )}
          </button>
        </form>
        <p className={`mt-4 text-center text-[10px] font-bold uppercase tracking-widest ${theme === "dark" ? "text-slate-600" : "text-slate-500"}`}>
          Press <kbd className={`rounded border px-1.5 py-0.5 ${theme === "dark" ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>Enter</kbd> to generate instantly
        </p>
      </motion.div>
    </div>
  );
};
export default UrlForm;
