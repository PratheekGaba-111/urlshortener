import { Link, useLocation } from "react-router-dom";
import { LogOut, Menu, Moon, Sparkles, Sun, X, Zap } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { clearAuthToken, isAuthenticated } from "../utils/auth";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isDashboard = location.pathname === "/home";
  const authenticated = isAuthenticated();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    clearAuthToken();
    setMenuOpen(false);
    window.location.assign("/login");
  };

  return (
    <header className="navbar-shell">
      <nav className="navbar" aria-label="Primary navigation">
        <Link to="/home" className="navbar__brand" aria-label="Shortify home">
          <span className="navbar__logo">
            <Zap size={18} aria-hidden="true" />
          </span>
          <span>Shortify</span>
        </Link>

        <div className={`navbar__links ${menuOpen ? "is-open" : ""}`}>
          <Link
            to="/home"
            className={isDashboard ? "navbar__link is-active" : "navbar__link"}
            onClick={closeMenu}
          >
            Dashboard
          </Link>
          {authenticated ? (
            <button type="button" className="navbar__link navbar__logout" onClick={handleLogout}>
              <LogOut size={16} aria-hidden="true" />
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="navbar__link" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="navbar__cta" onClick={closeMenu}>
                <Sparkles size={16} aria-hidden="true" />
                Start free
              </Link>
            </>
          )}
        </div>

        <div className="navbar__actions">
          <button
            type="button"
            className="icon-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun size={18} aria-hidden="true" />
            ) : (
              <Moon size={18} aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            className="icon-button navbar__menu"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={19} aria-hidden="true" />
            ) : (
              <Menu size={19} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
