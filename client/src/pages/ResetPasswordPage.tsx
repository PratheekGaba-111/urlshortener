import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Lock, ShieldCheck, Zap, ChevronLeft, Loader2 } from "lucide-react";
import { resetPassword, validatePasswordReset } from "../services/auth.service";
import { motion } from "framer-motion";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"checking" | "ready" | "success" | "error">("checking");
  const [message, setMessage] = useState("Checking your reset link...");
  const [loading, setLoading] = useState(false);

  const isValidPassword = useMemo(() => password.length >= 6, [password]);
  const passwordsMatch = password === confirmPassword;

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setStatus("error");
        setMessage("The reset link is missing.");
        return;
      }

      const response = await validatePasswordReset(token);
      if (response?.success) {
        setStatus("ready");
        setMessage("Choose a new password for your account.");
      } else {
        setStatus("error");
        setMessage(response?.message ?? "The reset link is invalid or has expired.");
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token || !isValidPassword || !passwordsMatch) {
      setStatus("error");
      setMessage("Please make sure your password is at least 6 characters and both fields match.");
      return;
    }

    setLoading(true);
    const response = await resetPassword(token, password);
    setLoading(false);
    
    if (response?.success) {
      setStatus("success");
      setMessage(response.message);
      window.setTimeout(() => navigate("/login"), 1600);
    } else {
      setStatus("error");
      setMessage(response?.message ?? "Unable to update your password right now.");
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6 overflow-hidden relative"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-violet-600/5 blur-[120px] -z-10 rounded-full" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-500/20 group-hover:rotate-12 transition-transform">
              <Zap size={22} fill="currentColor" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Shortify</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-slate-500">{message}</p>
        </div>
        
        <div className="glass-card p-8 md:p-10 shadow-2xl shadow-black/50 border-white/10">
          {status === "checking" ? (
            <div className="flex justify-center py-10">
              <Loader2 size={32} className="animate-spin text-violet-500/50" />
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {status === "error" && (
                <div className="p-4 rounded-2xl text-xs font-bold border bg-red-500/10 border-red-500/20 text-red-400 uppercase tracking-widest">
                  {message}
                </div>
              )}
              
              {status === "success" && (
                <div className="p-4 rounded-2xl text-xs font-bold border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 uppercase tracking-widest">
                  Success. Redirecting...
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1" htmlFor="new-password">New Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-slate-600"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1" htmlFor="confirm-password">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                      <ShieldCheck size={18} />
                    </div>
                    <input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-slate-600"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || status === "success" || status === "error"}
                className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <span>Update Password</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="flex flex-col items-center gap-6 mt-8">
          <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-widest">
            <ChevronLeft size={14} />
            Back to Login
          </Link>
        </div>
      </div>
    </motion.main>
  );
};

export default ResetPasswordPage;
