import { useEffect, useState } from "react";
import { Calendar, Check, Copy, ExternalLink, MousePointerClick, BarChart3, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { UrlData } from "../types/url";
import { cn } from "../utils/cn";

interface UrlCardProps {
  urlData: UrlData | null;
  featured?: boolean;
}

const UrlCard = ({ urlData, featured = false }: UrlCardProps) => {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden rounded-3xl border p-6 transition-all duration-300",
        featured 
          ? "border-violet-500/30 bg-violet-500/5 ring-1 ring-violet-500/20" 
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      )}
    >
      {/* Animated Border Beam for Featured */}
      {featured && (
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,#8b5cf6_360deg)] opacity-20"
          />
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-[10px] font-mono font-bold text-violet-400 uppercase tracking-wider">
              {urlData.shortCode}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 uppercase tracking-widest">
              <Calendar size={10} />
              {new Date(urlData.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors truncate max-w-[200px]">
            {urlData.shortUrl.replace(/^https?:\/\//, '')}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={cn(
              "p-2 rounded-xl border transition-all",
              copied 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
            )}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <a
            href={urlData.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-slate-500 truncate mb-4">
          {urlData.originalUrl}
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <MousePointerClick size={14} className="text-violet-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Clicks</span>
            </div>
            <div className="text-lg font-bold text-white">{urlData.clicks}</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <BarChart3 size={14} className="text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider">CTR</span>
            </div>
            <div className="text-lg font-bold text-white">12.4%</div>
          </div>
        </div>
      </div>

      {/* Mini Chart Simulation */}
      <div className="h-12 w-full flex items-end gap-1 px-1">
        {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            className="flex-1 bg-violet-500/20 rounded-t-sm group-hover:bg-violet-500/40 transition-colors"
          />
        ))}
      </div>
    </motion.article>
  );
};

export default UrlCard;
