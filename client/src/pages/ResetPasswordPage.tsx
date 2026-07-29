import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Lock, ShieldCheck, Zap, Sparkles, Loader2 } from "lucide-react";
import { resetPassword, validatePasswordReset } from "../services/auth.service";

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
    <main className="min-h-screen bg-[#0a0a0c] flex flex-col md:flex-row overflow-hidden">
      {/* Left Side: Branding & Info */}
      <section className="relative flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-violet-600/5 blur-[120px] -z-10 rounded-full scale-150" />
        
        <div className="relative z-10 max-w-xl">
          <Link to="/" className="inline-flex items-center gap-2 mb-12 transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600 text-white shadow-lg shadow-violet-500/20">
              <Zap size={22} fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Shortify</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-6">
            <Sparkles size={14} />
            <span>Password Recovery</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Reset your <br />
            <span className="gradient-text">access</span>
          </h1>
          
          <p className="text-lg text-slate-400 mb-12">
            Pick a fresh password and return to your dashboard in seconds.
          </p>
        </div>
      </section>

      {/* Right Side: Reset Form */}
      <section className="flex-1 flex items-center justify-center p-8 bg-white/[0.02] border-l border-white/5">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">Set a new password</h2>
            <p className="text-slate-500 mt-2">{message}</p>
          </div>
          
          <div className="glass-card p-8 shadow-2xl shadow-violet-500/5">
            {status === "checking" ? (
              <div className="flex justify-center py-8">
                <Loader2 size={32} className="animate-spin text-violet-500" />
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {status === "error" && (
                  <div className="p-4 rounded-xl text-sm font-medium border bg-red-500/10 border-red-500/20 text-red-400">
                    {message}
                  </div>
                )}
                
                {status === "success" && (
                  <div className="p-4 rounded-xl text-sm font-medium border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                    Password updated successfully. Redirecting...
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300" htmlFor="new-password">New Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                        <Lock size={18} />
                      </div>
                      <input
                        id="new-password"
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-slate-600"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300" htmlFor="confirm-password">Confirm Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                        <ShieldCheck size={18} />
                      </div>
                      <input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-slate-600"
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
                  className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98]"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <span>Update password</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-sm text-slate-500">
            <Link to="/login" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
              Back to sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default ResetPasswordPage;
