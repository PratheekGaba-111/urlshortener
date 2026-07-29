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
import { useTheme } from "../hooks/useTheme";

const Home = () => {
  const [urlData, setUrlData] = useState<UrlData | null>(null);
  const [urlsVersion, setUrlsVersion] = useState(0);
  const [clickUpdate, setClickUpdate] = useState<UrlClickUpdate | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const latestLinkRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

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
      className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-[#0a0a0c] text-white selection:bg-violet-500/30" : "bg-slate-50 text-slate-900 selection:bg-violet-200"}`}
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
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <h2 className={`text-[10px] font-bold uppercase tracking-[0.3em] ${theme === "dark" ? "text-emerald-500" : "text-emerald-600"}`}>Latest Short Link</h2>
                </div>
                <UrlCard urlData={urlData} featured />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-10">
            <div className={`flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-end ${theme === "dark" ? "border-white/5" : "border-slate-200"}`}>
              <div>
                <h2 className="mb-1 text-2xl font-bold">Your Links</h2>
                <p className={`text-xs font-bold uppercase tracking-widest ${theme === "dark" ? "text-slate-500" : "text-slate-500"}`}>Manage your short links</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative group hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search assets..." 
                    className={`w-40 rounded-xl border pl-9 pr-4 py-2 text-xs transition-all focus:outline-none focus:border-violet-500/50 ${theme === "dark" ? "border-white/10 bg-white/5 text-white" : "border-slate-200 bg-white text-slate-900"}`}
                  />
                </div>
                
                <div className={`flex items-center rounded-xl border p-1 ${theme === "dark" ? "border-white/5 bg-white/5" : "border-slate-200 bg-white"}`}>
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`rounded-lg p-1.5 transition-all ${viewMode === "grid" ? (theme === "dark" ? "bg-white/10 text-white shadow-sm" : "bg-violet-100 text-violet-700 shadow-sm") : theme === "dark" ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`rounded-lg p-1.5 transition-all ${viewMode === "list" ? (theme === "dark" ? "bg-white/10 text-white shadow-sm" : "bg-violet-100 text-violet-700 shadow-sm") : theme === "dark" ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"}`}
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

      <footer className={`border-t py-12 ${theme === "dark" ? "border-white/5 bg-white/[0.01]" : "border-slate-200 bg-white/70"}`}>
        <div className="container mx-auto px-4 text-center">
          <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${theme === "dark" ? "text-slate-600" : "text-slate-500"}`}>
            © 2026 Shortify • Built for Precision
          </p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Home;
