import { useState } from "react";
import { login, requestPasswordReset } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import type { LoginDetails } from "../types/auth.types";
import { ArrowRight, Lock, Mail, Send, Loader2 } from "lucide-react";

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
    <form className="space-y-6" onSubmit={handleSubmit}>
      {feedback && (
        <div 
          className={`p-4 rounded-xl text-sm font-medium border ${
            feedbackTone === "error" 
              ? "bg-red-500/10 border-red-500/20 text-red-400" 
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          }`}
          role="status"
        >
          {feedback}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300" htmlFor="email">Email</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
              <Mail size={18} />
            </div>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-slate-600"
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
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300" htmlFor="password">Password</label>
              <button 
                type="button" 
                className="text-xs text-violet-400 hover:text-violet-300"
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
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-slate-600"
                required
                value={loginDetails.password}
                onChange={(e) => setLoginDetails(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98]"
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <>
            <span>{mode === "login" ? "Sign in" : "Send reset link"}</span>
            {mode === "login" ? <ArrowRight size={18} /> : <Send size={18} />}
          </>
        )}
      </button>

      {mode === "forgot" && (
        <button 
          type="button" 
          className="w-full text-center text-sm text-slate-500 hover:text-slate-300"
          onClick={() => setMode("login")}
        >
          Back to sign in
        </button>
      )}
    </form>
  );
};

export default LoginForm;
