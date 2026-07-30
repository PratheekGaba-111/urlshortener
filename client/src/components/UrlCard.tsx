import { useEffect, useState } from "react";
import { Calendar, Check, Copy, ExternalLink, MousePointerClick } from "lucide-react";
import { motion } from "framer-motion";
import type { UrlData } from "../types/url";
import { cn } from "../utils/cn";
import { useTheme } from "../hooks/useTheme";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UrlCardProps {
  urlData: UrlData | null;
  featured?: boolean;
}

const UrlCard = ({ urlData, featured = false }: UrlCardProps) => {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

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
    <TooltipProvider>
      <motion.article
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className={cn(
          "group relative overflow-hidden",
          featured 
            ? "shadow-[0_0_30px_rgba(139,92,246,0.1)]" 
            : ""
        )}
      >
        <Card className={cn(
          "border p-0 transition-all duration-300",
          featured 
            ? "border-violet-500/40 bg-violet-500/[0.03]" 
            : theme === "dark"
              ? "border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10"
              : "border-slate-200 bg-white shadow-sm hover:border-violet-200 hover:bg-violet-50/40"
        )}>
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge variant="outline" className="rounded border-violet-500/20 bg-violet-500/10 px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-violet-400">
                    {urlData.shortCode}
                  </Badge>
                  <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest ${theme === "dark" ? "text-slate-500" : "text-slate-500"}`}>
                    <Calendar size={12} />
                    {new Date(urlData.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                
                <h3 className={`mb-1 truncate text-xl font-bold transition-colors group-hover:text-violet-400 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                  {urlData.shortUrl.replace(/^https?:\/\//, '')}
                </h3>
                <p className={`max-w-md truncate text-sm ${theme === "dark" ? "text-slate-500" : "text-slate-600"}`}>
                  {urlData.originalUrl}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="secondary" className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 ${theme === "dark" ? "border-white/5 bg-white/5 text-slate-400" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
                  <MousePointerClick size={14} className="text-violet-400" />
                  <span className="text-xs font-bold">{urlData.clicks}</span>
                </Badge>

                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger
                      render={(triggerProps) => (
                        <Button
                          type="button"
                          variant={copied ? "secondary" : "outline"}
                          size="sm"
                          {...triggerProps}
                          onClick={(event) => {
                            triggerProps.onClick?.(event);
                            handleCopy();
                          }}
                          className={cn(
                            "gap-2",
                            copied 
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                              : theme === "dark"
                                ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                          )}
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          <span>{copied ? "Copied" : "Copy"}</span>
                        </Button>
                      )}
                    />
                    <TooltipContent>{copied ? "Copied to clipboard" : "Copy short link"}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      render={(triggerProps) => (
                        <Button
                          render={
                            <a
                              href={urlData.shortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          }
                          variant="outline"
                          size="icon-sm"
                          {...triggerProps}
                          className={cn(
                            theme === "dark"
                              ? "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                          )}
                        >
                          <ExternalLink size={16} />
                        </Button>
                      )}
                    />
                    <TooltipContent>Open short link</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.article>
    </TooltipProvider>
  );
};

export default UrlCard;
