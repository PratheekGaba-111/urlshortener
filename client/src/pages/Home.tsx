import Navbar from "../components/Navbar";
import UrlCard from "../components/UrlCard";
import { useCallback, useState } from "react";
import UrlForm from "../components/UrlForm";
import MyUrls from "../components/MyUrls";
import type { UrlClickUpdate, UrlData } from "../types/url";
import { useUrlClickEvents } from "../hooks/useUrlClickEvents";
import { Sparkles, Zap, Shield, BarChart3 } from "lucide-react";

const Home = () => {
  const [urlData, setUrlData] = useState<UrlData | null>(null);
  const [urlsVersion, setUrlsVersion] = useState(0);
  const [clickUpdate, setClickUpdate] = useState<UrlClickUpdate | null>(null);

  const handleUrlCreated = (data: UrlData) => {
    setUrlData(data);
    setUrlsVersion((version) => version + 1);
  };

  const handleUrlClick = useCallback((update: UrlClickUpdate) => {
    setClickUpdate(update);
    setUrlData((currentUrl) => {
      if (!currentUrl || currentUrl.id !== update.id) {
        return currentUrl;
      }

      return {
        ...currentUrl,
        clicks: update.clicks,
      };
    });
  }, []);

  useUrlClickEvents(handleUrlClick);

  return (
    <div className="min-h-screen bg-[#0a0a0c]">
      <Navbar />
      
      <main className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-violet-600/20 blur-[120px] -z-10 rounded-full" />
        
        <section className="text-center px-4 mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-8 animate-fade-in">
            <Sparkles size={14} />
            <span>Exceptional UI for modern teams</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
            Shorten, track, and <br />
            <span className="gradient-text">own the moment</span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">
            Create clean, trackable links in seconds with a dashboard built for founders, builders, and fast-moving teams.
          </p>
          
          <div className="max-w-2xl mx-auto mb-16">
            <UrlForm onSuccess={handleUrlCreated} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            <div className="glass-card p-6 group hover:border-violet-500/30 transition-all">
              <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                <Zap size={20} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast launch flow</h3>
              <p className="text-sm text-slate-400">Turn long URLs into polished short links in seconds.</p>
            </div>
            
            <div className="glass-card p-6 group hover:border-blue-500/30 transition-all">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 size={20} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Clear signal</h3>
              <p className="text-sm text-slate-400">Keep an eye on clicks without leaving the workspace.</p>
            </div>
            
            <div className="glass-card p-6 group hover:border-emerald-500/30 transition-all">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Shield size={20} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Built for momentum</h3>
              <p className="text-sm text-slate-400">Designed for founders, launch crews, and creators.</p>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4">
          {urlData && (
            <div className="mb-16 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-violet-400 text-xs font-semibold tracking-wider uppercase">Latest link</span>
                  <h2 className="text-2xl font-bold">Ready to share</h2>
                </div>
              </div>
              <UrlCard urlData={urlData} featured />
            </div>
          )}

          <div className="mt-12">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Your Workspace</h2>
                <div className="h-px flex-1 bg-white/5 mx-8 hidden sm:block" />
              </div>
            <MyUrls refreshKey={urlsVersion} clickUpdate={clickUpdate} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
