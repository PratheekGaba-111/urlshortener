import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RegisterDetails } from "../types/auth.types";
import { register } from "../services/auth.service";
import { ArrowRight, Lock, Mail, User, Loader2 } from "lucide-react";

const RegisterForm = () => {
  const [registerDetails, setRegisterDetails] = useState<RegisterDetails>({
    email: "",
    name: "",
    password: "",
  });

  const [message, setMessage] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

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
      setMessage(response.message);
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
            className={`p-4 rounded-2xl text-sm font-medium border ${
              hasError 
                ? "bg-red-500/10 border-red-500/20 text-red-400" 
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            }`}
            role="status"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1" htmlFor="name">Full Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
              <User size={18} />
            </div>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-slate-600"
              required
              value={registerDetails.name}
              onChange={(e) => setRegisterDetails(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1" htmlFor="email">Email</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
              <Mail size={18} />
            </div>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-slate-600"
              required
              value={registerDetails.email}
              onChange={(e) => setRegisterDetails(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1" htmlFor="password">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
              <Lock size={18} />
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-slate-600"
              required
              value={registerDetails.password}
              onChange={(e) => setRegisterDetails(prev => ({ ...prev, password: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all hover:shadow-xl hover:shadow-violet-500/20 active:scale-[0.98]"
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <>
            <span>Create Account</span>
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </motion.form>
  );
};

export default RegisterForm;
