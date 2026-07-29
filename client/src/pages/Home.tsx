import Navbar from "../components/Navbar";
import UrlCard from "../components/UrlCard";
import { useCallback, useState } from "react";
import UrlForm from "../components/UrlForm";
import MyUrls from "../components/MyUrls";
import type { UrlClickUpdate, UrlData } from "../types/url";
import { useUrlClickEvents } from "../hooks/useUrlClickEvents";
import { Hero } from "../components/Hero";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, List, Search, TrendingUp, Globe, ShieldCheck, Zap } from "lucide-react";

const Home = () => {
  const [urlData, setUrlData] = useState<UrlData | null>(null);
  const [urlsVersion, setUrlsVersion] = useState(0);
  const [clickUpdate, setClickUpdate] = useState<UrlClickUpdate | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleUrlCreated = (data: UrlData) => {
    setUrlData(data);
    setUrlsVersion((version) => version + 1);
  };

  const handleUrlClick = useCallback((update: UrlClickUpdate) => {
    setClickUpdate(update);
    setUrlData((currentUrl) => {
      if (!currentUrl || currentUrl.id !== update.id) return currentUrl;
      return { ...currentUrl, clicks: update.clicks };
    });
  }, []);

  useUrlClickEvents(handleUrlClick);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-violet-500/30">
      <Navbar />
      
      <main className="pb-32">
        <Hero />
        
        <div className="container mx-auto px-4 -mt-8 relative z-10">
          <UrlForm onSuccess={handleUrlCreated} />
        </div>

        {/* Brand Marquee Simulation */}
        <div className="mt-20 overflow-hidden py-10 border-y border-white/5 bg-white/[0.01]">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-20 whitespace-nowrap items-center opacity-30 grayscale"
          >
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex gap-20 items-center">
                <span className="text-2xl font-black italic tracking-tighter">TECHCRUNCH</span>
                <span className="text-2xl font-black italic tracking-tighter">VERGE</span>
                <span className="text-2xl font-black italic tracking-tighter">WIRED</span>
                <span className="text-2xl font-black italic tracking-tighter">FORBES</span>
                <span className="text-2xl font-black italic tracking-tighter">NYT</span>
              </div>
            ))}
          </motion.div>
        </div>

        <section className="container mx-auto px-4 mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar Stats */}
            <aside className="lg:col-span-1 space-y-8">
              <div className="glass-card p-6 rounded-3xl border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Quick Insights</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold">12.4%</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Avg CTR</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Globe size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold">84</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Countries</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Safe</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">SSL Status</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-xl shadow-violet-500/20">
                <Zap size={24} className="mb-4" fill="currentColor" />
                <h3 className="text-lg font-bold mb-2">Go Pro</h3>
                <p className="text-xs text-white/80 mb-4 leading-relaxed">
                  Unlock custom domains, API access, and advanced link rotations.
                </p>
                <button className="w-full py-2.5 bg-white text-violet-600 rounded-xl text-xs font-bold hover:bg-white/90 transition-all">
                  Upgrade Now
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {urlData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mb-16"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">Live Result</h2>
                    </div>
                    <UrlCard urlData={urlData} featured />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Link Portfolio</h2>
                    <p className="text-sm text-slate-500">Managing {urlsVersion} active assets</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search..." 
                        className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-violet-500/50 transition-all w-48"
                      />
                    </div>
                    
                    <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/5">
                      <button 
                        onClick={() => setViewMode("grid")}
                        className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}
                      >
                        <LayoutGrid size={16} />
                      </button>
                      <button 
                        onClick={() => setViewMode("list")}
                        className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}
                      >
                        <List size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <MyUrls refreshKey={urlsVersion} clickUpdate={clickUpdate} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 bg-white/[0.01]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 text-xs tracking-widest uppercase font-bold">
            © 2026 Shortify • Premium Link Management
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
