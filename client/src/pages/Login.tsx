import LoginForm from "../components/LoginForm";
import { Link, useLocation } from "react-router-dom";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";

const Login = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const successMessage = (location.state as { successMessage?: string } | null)?.successMessage;

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen flex items-center justify-center overflow-hidden p-6 relative transition-colors duration-300 ${theme === "dark" ? "bg-[#0a0a0c] text-white" : "bg-slate-50 text-slate-900"}`}
    >
      {/* Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] rounded-full blur-[120px] -z-10 ${theme === "dark" ? "bg-violet-600/5" : "bg-violet-400/10"}`} />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-500/20 group-hover:rotate-12 transition-transform">
              <Zap size={22} fill="currentColor" />
            </div>
            <span className={`text-2xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Shortify</span>
          </Link>
          
          <h1 className={`mb-2 text-3xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Welcome Back</h1>
          <p className={`${theme === "dark" ? "text-slate-500" : "text-slate-600"}`}>Sign in to manage your link portfolio</p>
        </div>
        
        <div className={`glass-card border p-8 shadow-2xl md:p-10 ${theme === "dark" ? "border-white/10 shadow-black/50" : "border-slate-200 bg-white/90 shadow-slate-200/70"}`}>
          {successMessage && (
            <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              {successMessage}
            </div>
          )}
          <LoginForm />
        </div>

        <div className="mt-8 text-center">
          <p className={`text-sm ${theme === "dark" ? "text-slate-500" : "text-slate-600"}`}>
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-violet-400 transition-colors hover:text-violet-300">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </motion.main>
  );
};

export default Login;
