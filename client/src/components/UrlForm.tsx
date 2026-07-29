import { useState, type FormEvent } from "react";
import { shortenUrl } from "../services/url.service";
import type { UrlData } from "../types/url";
import { Link2, Sparkles, Loader2 } from "lucide-react";

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
      alert("Failed to Shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form 
        className="glass-card p-2 flex flex-col sm:flex-row gap-2 shadow-2xl shadow-violet-500/10 border-white/10" 
        onSubmit={handleSubmit}
      >
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
            <Link2 size={20} aria-hidden="true" />
          </div>
          <input
            id="long-url"
            type="url"
            placeholder="https://example.com/your-long-url"
            className="w-full bg-transparent pl-12 pr-4 py-4 text-slate-200 focus:outline-none placeholder:text-slate-600"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/20 active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" aria-hidden="true" />
              <span>Shortening...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} aria-hidden="true" />
              <span>Shorten</span>
            </>
          )}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-500 text-center">
        Press <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs">Enter</kbd> to shorten instantly
      </p>
    </div>
  );
};
export default UrlForm;
