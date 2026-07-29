import { useEffect, useState } from "react";
import type { UrlClickUpdate, UrlData } from "../types/url";
import { getMyUrls } from "../services/url.service";
import UrlCard from "./UrlCard";
import { BarChart3, Link2, Plus, ArrowUpRight } from "lucide-react";

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

  const totalClicks = urls.reduce((total, url) => total + url.clicks, 0);

  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-wrap gap-4">
          <div className="glass-card px-5 py-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Link2 size={18} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Links</div>
              <div className="text-lg font-bold text-white">{urls.length}</div>
            </div>
          </div>
          
          <div className="glass-card px-5 py-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <BarChart3 size={18} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Clicks</div>
              <div className="text-lg font-bold text-white">{totalClicks}</div>
            </div>
          </div>
        </div>
      </div>

      {urls.length === 0 ? (
        <div className="glass-card border-dashed border-white/10 p-12 text-center">
          <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 mx-auto mb-6">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">No URLs created yet</h3>
          <p className="text-slate-400 max-w-sm mx-auto">
            Paste a long URL above and your first polished Shortify link will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {urls.map((url) => (
            <UrlCard key={url.id} urlData={url} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MyUrls;
