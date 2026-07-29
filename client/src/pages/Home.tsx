import Navbar from "../components/Navbar";
import UrlCard from "../components/UrlCard";
import { useCallback, useState, useRef } from "react";
import UrlForm from "../components/UrlForm";
import MyUrls from "../components/MyUrls";
import type { UrlClickUpdate, UrlData } from "../types/url";
import { useUrlClickEvents } from "../hooks/useUrlClickEvents";
import { Hero } from "../components/Hero";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, List, Search } from "lucide-react";
import { Toast, type ToastType } from "../components/Toast";

const Home = () => {
  const [urlData, setUrlData] = useState<UrlData | null>(null);
  const [urlsVersion, setUrlsVersion] = useState(0);
  const [clickUpdate, setClickUpdate] = useState<UrlClickUpdate | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const latestLinkRef = useRef<HTMLDivElement>(null);

  // Toast State
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: ToastType }>({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ isVisible: true, message, type });
  };

  const handleUrlCreated = (data: UrlData) => {
    setUrlData(data);
    setUrlsVersion((version) => version + 1);
    showToast("URL Shortened successfully!");
    
    setTimeout(() => {
      latestLinkRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0a0c] text-white selection:bg-violet-500/30"
    >
      <Navbar />
      
      <main className="pb-32">
        <Hero />
        
        <div className="container mx-auto px-4 -mt-12 relative z-10">
          <UrlForm onSuccess={handleUrlCreated} />
        </div>

        <section className="container mx-auto max-w-4xl px-4 mt-24">
          <AnimatePresence mode="wait">
            {urlData && (
              <motion.div
                ref={latestLinkRef}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500">Latest Generated Asset</h2>
                </div>
                <UrlCard urlData={urlData} featured />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
              <div>
                <h2 className="text-2xl font-bold mb-1">Portfolio</h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Active link infrastructure</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative group hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search assets..." 
                    className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-violet-500/50 transition-all w-40"
                  />
                </div>
                
                <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/5">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            <MyUrls refreshKey={urlsVersion} clickUpdate={clickUpdate} />
          </div>
        </section>
      </main>

      <Toast 
        isVisible={toast.isVisible} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />

      <footer className="border-t border-white/5 py-12 bg-white/[0.01]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 text-[10px] tracking-[0.2em] uppercase font-bold">
            © 2026 Shortify • Built for Precision
          </p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Home;
