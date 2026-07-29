import { useEffect, useState } from "react";
import { Calendar, Check, Copy, ExternalLink, MousePointerClick } from "lucide-react";
import type { UrlData } from "../types/url";

interface UrlCardProps {
  urlData: UrlData | null;
  featured?: boolean;
}

const UrlCard = ({ urlData, featured = false }: UrlCardProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timeout = window.setTimeout(() => setCopied(false), 1800);

    return () => window.clearTimeout(timeout);
  }, [copied]);

  if (!urlData) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(urlData.shortUrl);
      setCopied(true);
    } catch (error) {
      console.error(error);
      alert("Failed to copy!");
    }
  };

  return (
    <article 
      className={`glass-card p-6 transition-all duration-300 hover:border-white/20 ${
        featured ? "border-violet-500/30 bg-violet-500/5 ring-1 ring-violet-500/20" : "border-white/10"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-violet-400">
            /{urlData.shortCode}
          </span>
          {featured && (
            <span className="px-2 py-1 rounded bg-violet-600 text-[10px] font-bold uppercase tracking-wider text-white">
              Featured
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
          <MousePointerClick size={14} className="text-violet-400" />
          <span>{urlData.clicks} clicks</span>
        </div>
      </div>

      <div className="mb-6">
        <a
          className="text-xl font-bold text-white hover:text-violet-400 transition-colors flex items-center gap-2 group"
          href={urlData.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {urlData.shortUrl}
          <ExternalLink size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>

        <a
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors truncate block mt-1"
          href={urlData.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {urlData.originalUrl}
        </a>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar size={14} />
          <span>
            {new Date(urlData.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <button
          type="button"
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
            copied 
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
              : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white"
          }`}
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check size={14} />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};

export default UrlCard;
