import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Lock, ShieldCheck, ChevronLeft, Loader2 } from "lucide-react";
import { resetPassword, validatePasswordReset } from "../services/auth.service";
import { motion } from "framer-motion";
import { AuroraBackground } from "../components/magic-ui/aurora-background";
import { ShineBorder } from "../components/magic-ui/shine-border";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "../hooks/useTheme";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"checking" | "ready" | "success" | "error">("checking");
  const [message, setMessage] = useState("Checking your reset link...");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

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
    <AuroraBackground className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-[#0a0a0c] text-white" : "bg-slate-50 text-slate-900"}`}>
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center p-6 overflow-hidden relative"
      >
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
              <motion.img
                src="/llgg.png"
                alt="Shortify Logo"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="h-10 w-10 object-contain transition-transform"
              />
              <span className={`text-2xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Shortify</span>
            </Link>
            
            <h1 className={`text-3xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Reset Password</h1>
            <p className={`${theme === "dark" ? "text-slate-500" : "text-slate-600"}`}>{message}</p>
          </div>
          
          <ShineBorder className="rounded-[1.75rem]">
            <Card className={`border-0 bg-transparent shadow-none ${theme === "dark" ? "shadow-black/50" : "bg-white/90 shadow-slate-200/70"}`}>
              <CardContent className={`p-8 md:p-10 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                {status === "checking" ? (
                  <div className="flex justify-center py-10">
                    <Loader2 size={32} className="animate-spin text-violet-500/50" />
                  </div>
                ) : (
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {status === "error" && (
                      <div className={`p-4 rounded-2xl text-xs font-bold border uppercase tracking-widest ${
                        theme === "dark"
                          ? "bg-red-500/10 border-red-500/20 text-red-400"
                          : "bg-red-50 border-red-200 text-red-700"
                      }`}>
                        {message}
                      </div>
                    )}
                    
                    {status === "success" && (
                      <div className={`p-4 rounded-2xl text-xs font-bold border uppercase tracking-widest ${
                        theme === "dark"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-emerald-50 border-emerald-200 text-emerald-700"
                      }`}>
                        Success. Redirecting...
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${theme === "dark" ? "text-slate-500" : "text-slate-600"}`} htmlFor="new-password">New Password</label>
                        <div className="relative group">
                          <div className={`absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors ${theme === "dark" ? "text-slate-500 group-focus-within:text-violet-400" : "text-slate-400 group-focus-within:text-violet-500"}`}>
                            <Lock size={18} />
                          </div>
                          <Input
                            id="new-password"
                            type="password"
                            placeholder="••••••••"
                            className={`pl-12 pr-4 ${theme === "dark" ? "bg-white/5 border-white/10 text-white placeholder:text-slate-600" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"}`}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${theme === "dark" ? "text-slate-500" : "text-slate-600"}`} htmlFor="confirm-password">Confirm Password</label>
                        <div className="relative group">
                          <div className={`absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors ${theme === "dark" ? "text-slate-500 group-focus-within:text-violet-400" : "text-slate-400 group-focus-within:text-violet-500"}`}>
                            <ShieldCheck size={18} />
                          </div>
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="••••••••"
                            className={`pl-12 pr-4 ${theme === "dark" ? "bg-white/5 border-white/10 text-white placeholder:text-slate-600" : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"}`}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={loading || status === "success" || status === "error"}
                      className="w-full flex items-center justify-center gap-2 text-white font-bold"
                    >
                      {loading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          <span>Update Password</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </ShineBorder>

          <div className="flex flex-col items-center gap-6 mt-8">
            <Link to="/login" className={`inline-flex items-center gap-2 text-[10px] font-bold transition-colors uppercase tracking-widest ${theme === "dark" ? "text-slate-600 hover:text-slate-400" : "text-slate-500 hover:text-slate-700"}`}>
              <ChevronLeft size={14} />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.main>
    </AuroraBackground>
  );
};

export default ResetPasswordPage;
