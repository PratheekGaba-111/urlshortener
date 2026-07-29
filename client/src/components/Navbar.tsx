import { motion } from "framer-motion";
import { LogOut, Menu, Moon, Sparkles, Sun, X, Zap, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "../hooks/useTheme";
import { clearAuthToken, isAuthenticated } from "../utils/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isDashboard = location.pathname === "/home";
  const authenticated = isAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    setMenuOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-4",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <nav 
        className={cn(
          "mx-auto max-w-7xl flex h-16 items-center justify-between px-6 rounded-2xl border transition-all duration-300",
          scrolled 
            ? "bg-[#0a0a0c]/80 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/50" 
            : "bg-transparent border-transparent"
        )}
      >
        <Link to="/home" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-500/20"
          >
            <Zap size={20} fill="currentColor" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-violet-400 transition-colors">Shortify</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
            <Link
              to="/home"
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-full transition-all",
                isDashboard ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white"
              )}
            >
              Dashboard
            </Link>
            <Link
              to="/analytics"
              className="px-4 py-1.5 text-sm font-medium text-slate-400 hover:text-white rounded-full transition-all"
            >
              Analytics
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition-all hover:bg-white/5 hover:text-white"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {authenticated ? (
              <button 
                type="button" 
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/20 transition-all" 
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="group flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/25 active:scale-95"
                >
                  <span>Start Free</span>
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-4 right-4 bg-[#0a0a0c]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              <Link to="/home" className="text-lg font-medium text-white p-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/analytics" className="text-lg font-medium text-slate-400 p-2" onClick={() => setMenuOpen(false)}>Analytics</Link>
              <div className="h-px bg-white/5 my-2" />
              {authenticated ? (
                <button onClick={handleLogout} className="flex items-center gap-2 text-lg font-medium text-red-400 p-2">
                  <LogOut size={20} /> Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-lg font-medium text-white p-2" onClick={() => setMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="flex items-center justify-center gap-2 rounded-2xl bg-violet-600 py-4 text-lg font-bold text-white" onClick={() => setMenuOpen(false)}>
                    Start Free <ChevronRight size={20} />
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
