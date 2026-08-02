import { motion } from "framer-motion";
import { LogOut, Menu, Moon, Sun, X, ChevronRight } from "lucide-react";
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
  const isHome = location.pathname === "/home";
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4",
        scrolled ? "py-2" : "py-3 md:py-4"
      )}
    >
      <nav
        className={cn(
          "mx-auto max-w-5xl flex h-14 md:h-16 items-center justify-between px-4 md:px-6 rounded-2xl border transition-all duration-300",
          scrolled
            ? (
                theme === "dark"
                  ? "bg-[#0a0a0c]/80 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/50"
                  : "bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg shadow-slate-200/60"
              )
            : (
                theme === "dark"
                  ? "bg-transparent border-transparent"
                  : "bg-transparent border-transparent"
              )
        )}
      >
       
      <Link to="/home" className="group flex items-center gap-2">
          <motion.img
            src="/llgg.png"
            alt="Shortify Logo"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="h-10 w-10 object-contain"
          />

          <span className={`text-xl font-bold tracking-tight ${
            theme === "dark"
              ? "text-white group-hover:text-violet-400"
              : "text-slate-900 group-hover:text-violet-600"
          }`}>
            Shortify
          </span>
        </Link>
        {/* Desktop Links */}
        <div className="hidden items-center gap-6 md:flex">
          <div className={cn("flex items-center gap-1 rounded-full p-1 border", theme === "dark" ? "bg-white/5 border-white/5" : "bg-slate-100 border-slate-200")}>
            <Link
              to="/home"
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-full transition-all",
                isHome ? (theme === "dark" ? "bg-white/10 text-white shadow-sm" : "bg-violet-100 text-violet-700 shadow-sm") : (theme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900")
              )}
            >
              Home
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              type="button"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${theme === "dark" ? "border-white/10 text-slate-400 hover:bg-white/5 hover:text-white" : "border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {authenticated ? (
              <button 
                type="button" 
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${theme === "dark" ? "border-white/10 bg-white/5 text-slate-400 hover:border-red-500/20 hover:bg-red-500/5 hover:text-red-400" : "border-slate-200 bg-white text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-500"}`}
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className={`text-sm font-medium transition-colors ${theme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}>
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
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${
              theme === "dark"
                ? "border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
                : "border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${
              theme === "dark"
                ? "border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
                : "border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={menuOpen ? { opacity: 1, y: 0, pointerEvents: "auto" } : { opacity: 0, y: -20, pointerEvents: "none" }}
        className={`absolute top-24 left-4 right-4 backdrop-blur-2xl rounded-3xl p-6 md:hidden shadow-2xl border ${
          theme === "dark"
            ? "bg-[#0a0a0c]/95 border-white/10"
            : "bg-white/95 border-slate-200 shadow-slate-200/70"
        }`}
      >
        <div className="flex flex-col gap-4">
          <Link to="/home" className={`p-2 text-lg font-medium ${theme === "dark" ? "text-white" : "text-slate-900"}`} onClick={() => setMenuOpen(false)}>Home</Link>
          
          <div className={`h-px my-2 ${theme === "dark" ? "bg-white/5" : "bg-slate-200"}`} />
          {authenticated ? (
            <button onClick={handleLogout} className="flex items-center gap-2 text-lg font-medium text-red-400 p-2">
              <LogOut size={20} /> Logout
            </button>
          ) : (
            <>
              <Link to="/login" className={`p-2 text-lg font-medium ${theme === "dark" ? "text-white" : "text-slate-900"}`} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="flex items-center justify-center gap-2 rounded-2xl bg-violet-600 py-4 text-lg font-bold text-white" onClick={() => setMenuOpen(false)}>
                Start Free <ChevronRight size={20} />
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </header>
  );
};

export default Navbar;
