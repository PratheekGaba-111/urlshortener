import { useState, type FormEvent } from "react";
import { shortenUrl } from "../services/url.service";
import type { UrlData } from "../types/url";
import { Link2, Sparkles, Loader2, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";

interface UrlFormProps {
  onSuccess: (data: UrlData) => void;
}

const UrlForm = ({ onSuccess }: UrlFormProps) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [alias, setAlias] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      setLoading(true);
      const response = await shortenUrl({
        originalUrl: url,
        // alias: alias.trim() || undefined, // Future feature
      });
      onSuccess(response.data);
      setUrl("");
      setAlias("");
    } catch (error) {
      console.error(error);
      alert("Failed to Shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <form 
          className="group relative flex flex-col sm:flex-row gap-3 p-3 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl focus-within:border-violet-500/50 transition-all duration-500" 
          onSubmit={handleSubmit}
        >
          <div className="relative flex-1 flex items-center">
            <div className="absolute left-4 text-slate-500 group-focus-within:text-violet-400 transition-colors">
              <Link2 size={22} />
            </div>
            <input
              type="url"
              placeholder="Paste your long destination URL here..."
              className="w-full bg-transparent pl-14 pr-4 py-4 text-lg text-white placeholder:text-slate-600 focus:outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className={cn(
                "p-4 rounded-2xl border transition-all",
                showOptions ? "bg-violet-500/10 border-violet-500/20 text-violet-400" : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
              )}
            >
              <Settings2 size={20} />
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="relative overflow-hidden flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] active:scale-95"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Shorten Now</span>
                </>
              )}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 10 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="overflow-hidden"
            >
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Custom Alias (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. summer-sale"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Domain</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none appearance-none">
                      <option>shrt.it</option>
                      <option>my-brand.link</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
export default UrlForm;
