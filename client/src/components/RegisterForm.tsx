import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { RegisterDetails } from "../types/auth.types";
import { register } from "../services/auth.service";
import { ArrowRight, Lock, Mail, User, Loader2, Eye, EyeOff } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RegisterForm = () => {
  const [registerDetails, setRegisterDetails] = useState<RegisterDetails>({
    email: "",
    name: "",
    password: "",
  });

  const [message, setMessage] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await register(registerDetails);
      if (!response) {
        setHasError(true);
        setMessage("Registration failed. Please try again.");
        return;
      }
      setHasError(false);
      navigate("/login", { replace: true, state: { successMessage: response.message } });
    } catch (error) {
      setHasError(true);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6" 
      onSubmit={handleSubmit}
    >
      <AnimatePresence mode="wait">
        {message && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`rounded-2xl border p-4 text-sm font-medium ${
                hasError 
                ? theme === "dark"
                  ? "border-red-500/20 bg-red-500/10 text-red-400"
                  : "border-red-200 bg-red-50 text-red-700"
                : theme === "dark"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
              role="status"
            >
              {message}
            </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className={`ml-1 text-sm font-semibold uppercase tracking-[0.2em] ${theme === "dark" ? "text-slate-500" : "text-slate-600"}`} htmlFor="name">Full Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
              <User size={18} />
            </div>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className={`pl-12 pr-4 ${theme === "dark" ? "border-white/10 bg-white/5 text-white placeholder:text-slate-600" : "border-slate-200 bg-white text-slate-900 shadow-sm placeholder:text-slate-400"}`}
              required
              value={registerDetails.name}
              onChange={(e) => setRegisterDetails(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={`ml-1 text-sm font-semibold uppercase tracking-[0.2em] ${theme === "dark" ? "text-slate-500" : "text-slate-600"}`} htmlFor="email">Email</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
              <Mail size={18} />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              className={`pl-12 pr-4 ${theme === "dark" ? "border-white/10 bg-white/5 text-white placeholder:text-slate-600" : "border-slate-200 bg-white text-slate-900 shadow-sm placeholder:text-slate-400"}`}
              required
              value={registerDetails.email}
              onChange={(e) => setRegisterDetails(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={`ml-1 text-sm font-semibold uppercase tracking-[0.2em] ${theme === "dark" ? "text-slate-500" : "text-slate-600"}`} htmlFor="password">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
              <Lock size={18} />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`pl-12 pr-12 ${theme === "dark" ? "border-white/10 bg-white/5 text-white placeholder:text-slate-600" : "border-slate-200 bg-white text-slate-900 shadow-sm placeholder:text-slate-400"}`}
              required
              value={registerDetails.password}
              onChange={(e) => setRegisterDetails(prev => ({ ...prev, password: e.target.value }))}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className={`absolute inset-y-0 right-4 flex items-center transition-colors ${theme === "dark" ? "text-slate-500 hover:text-violet-400" : "text-slate-500 hover:text-violet-600"}`}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 text-white font-bold"
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <>
            <span>Create Account</span>
            <ArrowRight size={18} />
          </>
        )}
      </Button>
    </motion.form>
  );
};

export default RegisterForm;
