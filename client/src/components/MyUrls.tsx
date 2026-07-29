import { useEffect, useState } from "react";
import type { UrlClickUpdate, UrlData } from "../types/url";
import { getMyUrls } from "../services/url.service";
import UrlCard from "./UrlCard";
import { Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MyUrlsProps {
  refreshKey?: number;
  clickUpdate?: UrlClickUpdate | null;
}

const MyUrls = ({ refreshKey = 0, clickUpdate = null }: MyUrlsProps) => {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrls = async () => {
      setLoading(true);
      try {
        const response = await getMyUrls();
        if (response) {
          setUrls(response.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUrls();
  }, [refreshKey]);

  useEffect(() => {
    if (!clickUpdate) return;
    setUrls((currentUrls) =>
      currentUrls.map((url) =>
        url.id === clickUpdate.id
          ? { ...url, clicks: clickUpdate.clicks }
          : url,
      ),
    );
  }, [clickUpdate]);

  if (loading && urls.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="animate-spin text-violet-500/50" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {urls.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border-dashed border-white/5 p-20 text-center"
        >
          <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center text-slate-600 mx-auto mb-6 border border-white/5">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">No links yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Paste a long URL above to generate your first professional short link.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {urls.map((url) => (
              <UrlCard key={url.id} urlData={url} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MyUrls;
