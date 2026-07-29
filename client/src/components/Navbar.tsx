import { LogOut, Menu, Moon, Sparkles, Sun, X, Zap } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { clearAuthToken, isAuthenticated } from "../utils/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isDashboard = location.pathname === "/home";
  const authenticated = isAuthenticated();
  const navigate = useNavigate();
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    clearAuthToken();
    setMenuOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Primary navigation">
        <Link to="/home" className="flex items-center gap-2 transition-opacity hover:opacity-80" aria-label="Shortify home">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white shadow-lg shadow-violet-500/20">
            <Zap size={18} aria-hidden="true" fill="currentColor" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Shortify</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/home"
            className={`text-sm font-medium transition-colors ${
              isDashboard ? "text-violet-400" : "text-slate-400 hover:text-white"
            }`}
          >
            Dashboard
          </Link>
          
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun size={18} aria-hidden="true" />
              ) : (
                <Moon size={18} aria-hidden="true" />
              )}
            </button>

            {authenticated ? (
              <button 
                type="button" 
                className="flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-red-400" 
                onClick={handleLogout}
              >
                <LogOut size={16} aria-hidden="true" />
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20 active:scale-95"
                >
                  <Sparkles size={16} aria-hidden="true" />
                  Start free
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
           <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full border-b border-white/5 bg-[#0a0a0c] p-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link to="/home" className="text-sm font-medium text-slate-400" onClick={closeMenu}>Dashboard</Link>
            {authenticated ? (
              <button type="button" className="flex items-center gap-2 text-sm font-medium text-slate-400" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-400" onClick={closeMenu}>Login</Link>
                <Link to="/register" className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-medium text-white" onClick={closeMenu}>
                  <Sparkles size={16} /> Start free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
