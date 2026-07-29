import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { login, requestPasswordReset } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import type { LoginDetails } from "../types/auth.types";
import { ArrowRight, Lock, Mail, Send, Loader2, Eye, EyeOff } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const LoginForm = () => {
  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    email: "",
    password: "",
  });

  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [resetEmail, setResetEmail] = useState("");
  const [feedback, setFeedback] = useState<string>("");
  const [feedbackTone, setFeedbackTone] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      if (mode === "forgot") {
        const response = await requestPasswordReset(resetEmail);
        if (response?.success) {
          setFeedbackTone("success");
          setFeedback(response.message);
        } else {
          setFeedbackTone("error");
          setFeedback("Unable to send a reset email right now.");
        }
        return;
      }

      const response = await login(loginDetails);
      if (response) {
        localStorage.setItem("token", response.token);
        navigate("/home");
      } else {
        setFeedbackTone("error");
        setFeedback("Invalid credentials. Please check your email and password.");
      }
    } catch (err) {
      setFeedbackTone("error");
      setFeedback("Something went wrong. Please try again.");
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
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`rounded-2xl border p-4 text-sm font-medium ${
              feedbackTone === "error" 
                ? "border-red-500/20 bg-red-500/10 text-red-400"
                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
            }`}
            role="status"
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className={`ml-1 text-sm font-semibold uppercase tracking-[0.2em] ${theme === "dark" ? "text-slate-500" : "text-slate-600"}`} htmlFor="email">Email</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
              <Mail size={18} />
            </div>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              className={`w-full rounded-2xl border py-4 pl-12 pr-4 text-base transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${theme === "dark" ? "border-white/10 bg-white/5 text-white placeholder:text-slate-600" : "border-slate-200 bg-white text-slate-900 shadow-sm placeholder:text-slate-400"}`}
              required
              value={mode === "login" ? loginDetails.email : resetEmail}
              onChange={(e) => {
                if (mode === "login") {
                  setLoginDetails(prev => ({ ...prev, email: e.target.value }));
                } else {
                  setResetEmail(e.target.value);
                }
              }}
            />
          </div>
        </div>

        {mode === "login" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className={`text-sm font-semibold uppercase tracking-[0.2em] ${theme === "dark" ? "text-slate-500" : "text-slate-600"}`} htmlFor="password">Password</label>
              <button 
                type="button" 
                className="text-sm text-violet-400 transition-colors hover:text-violet-300"
                onClick={() => setMode("forgot")}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full rounded-2xl border py-4 pl-12 pr-12 text-base transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${theme === "dark" ? "border-white/10 bg-white/5 text-white placeholder:text-slate-600" : "border-slate-200 bg-white text-slate-900 shadow-sm placeholder:text-slate-400"}`}
                required
                value={loginDetails.password}
                onChange={(e) => setLoginDetails(prev => ({ ...prev, password: e.target.value }))}
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
        )}
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all hover:shadow-xl hover:shadow-violet-500/20 active:scale-[0.98] text-base"
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <>
            <span>{mode === "login" ? "Sign In" : "Send Reset Link"}</span>
            {mode === "login" ? <ArrowRight size={18} /> : <Send size={18} />}
          </>
        )}
      </button>

      {mode === "forgot" && (
        <button 
          type="button" 
          className={`w-full text-center text-sm transition-colors ${theme === "dark" ? "text-slate-500 hover:text-slate-300" : "text-slate-600 hover:text-slate-800"}`}
          onClick={() => setMode("login")}
        >
          Back to sign in
        </button>
      )}
    </motion.form>
  );
};

export default LoginForm;
