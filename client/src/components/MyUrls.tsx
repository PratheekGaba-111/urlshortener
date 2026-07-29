import { useEffect, useState } from "react";
import type { UrlClickUpdate, UrlData } from "../types/url";
import { getMyUrls } from "../services/url.service";
import UrlCard from "./UrlCard";
import { Plus, LayoutGrid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MyUrlsProps {
  refreshKey?: number;
  clickUpdate?: UrlClickUpdate | null;
}

const MyUrls = ({ refreshKey = 0, clickUpdate = null }: MyUrlsProps) => {
  const [urls, setUrls] = useState<UrlData[]>([]);

  useEffect(() => {
    const fetchUrls = async () => {
      const response = await getMyUrls();
      if (response) {
        setUrls(response.data);
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

  return (
    <div className="w-full">
      {urls.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border-dashed border-white/10 p-20 text-center rounded-[3rem]"
        >
          <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center text-slate-500 mx-auto mb-8 border border-white/5">
            <Plus size={40} />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-white">No assets found</h3>
          <p className="text-slate-500 max-w-sm mx-auto text-lg">
            Start by shortening your first URL to see it appear in your portfolio.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {urls.map((url, index) => (
              <UrlCard key={url.id} urlData={url} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default MyUrls;
