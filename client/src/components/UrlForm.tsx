import { useState, type FormEvent } from "react";
import { shortenUrl } from "../services/url.service";
import type { UrlData } from "../types/url";
import { Link2, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface UrlFormProps {
  onSuccess: (data: UrlData) => void;
}

const UrlForm = ({ onSuccess }: UrlFormProps) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

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
          className="group relative flex flex-col sm:flex-row gap-2 p-2 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl focus-within:border-violet-500/30 transition-all duration-500" 
          onSubmit={handleSubmit}
        >
          <div className="relative flex-1 flex items-center">
            <div className="absolute left-4 text-slate-500 group-focus-within:text-violet-400 transition-colors">
              <Link2 size={20} />
            </div>
            <input
              type="url"
              placeholder="Paste your long link here..."
              className="w-full bg-transparent pl-12 pr-4 py-4 text-base text-white placeholder:text-slate-600 focus:outline-none"
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
        <p className="text-center mt-4 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Enter</kbd> to generate instantly
        </p>
      </motion.div>
    </div>
  );
};
export default UrlForm;
