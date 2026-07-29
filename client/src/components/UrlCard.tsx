import { useEffect, useState } from "react";
import { Calendar, Check, Copy, ExternalLink, MousePointerClick } from "lucide-react";
import { motion } from "framer-motion";
import type { UrlData } from "../types/url";
import { cn } from "../utils/cn";

interface UrlCardProps {
  urlData: UrlData | null;
  featured?: boolean;
}

const UrlCard = ({ urlData, featured = false }: UrlCardProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  if (!urlData) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(urlData.shortUrl);
      setCopied(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border p-5 transition-all duration-300",
        featured 
          ? "border-violet-500/40 bg-violet-500/[0.03] shadow-[0_0_30px_rgba(139,92,246,0.1)]" 
          : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-[10px] font-mono font-bold text-violet-400 uppercase tracking-wider">
              {urlData.shortCode}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <Calendar size={12} />
              {new Date(urlData.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors truncate mb-1">
            {urlData.shortUrl.replace(/^https?:\/\//, '')}
          </h3>
          <p className="text-xs text-slate-500 truncate max-w-md">
            {urlData.originalUrl}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-slate-400">
            <MousePointerClick size={14} className="text-violet-400" />
            <span className="text-xs font-bold">{urlData.clicks}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all",
                copied 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <a
              href={urlData.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default UrlCard;
