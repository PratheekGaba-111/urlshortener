import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { login, requestPasswordReset, resendVerification } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import type { LoginDetails } from "../types/auth.types";
import { ArrowRight, ChevronLeft, Loader2, Eye, EyeOff, Lock, Mail, MailCheck, Send } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [resendLoading, setResendLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationPrompt, setVerificationPrompt] = useState<{
    email: string;
    message: string;
    sentMessage?: string;
  } | null>(null);
  const { theme } = useTheme();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");
    setVerificationPrompt(null);

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
      if (response && "token" in response) {
        localStorage.setItem("token", response.token);
        navigate("/home");
      } else if (response && "code" in response && response.code === "EMAIL_NOT_VERIFIED") {
        const email = response.email ?? loginDetails.email;
        setFeedbackTone("error");
        setFeedback(response.message);
        setVerificationPrompt({
          email,
          message: "We can send a fresh verification link to this address.",
        });
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

  const handleResendVerification = async () => {
    const targetEmail = verificationPrompt?.email ?? loginDetails.email;

    if (!targetEmail.trim()) {
      setFeedbackTone("error");
      setFeedback("Please enter the email address you used to register.");
      return;
    }

    setResendLoading(true);
    setFeedback("");

    try {
      const response = await resendVerification(targetEmail);
      if (response?.success) {
        setVerificationPrompt({
          email: targetEmail,
          message: "We sent a new verification link.",
          sentMessage: response.message,
        });
        setFeedbackTone("success");
        setFeedback(response.message);
      } else {
        setFeedbackTone("error");
        setFeedback(response?.message ?? "Unable to resend verification email right now.");
      }
    } finally {
      setResendLoading(false);
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
                ? theme === "dark"
                  ? "border-red-500/20 bg-red-500/10 text-red-400"
                  : "border-red-200 bg-red-50 text-red-700"
                : theme === "dark"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
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
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              className={`pl-12 pr-4 ${theme === "dark" ? "border-white/10 bg-white/5 text-white placeholder:text-slate-600" : "border-slate-200 bg-white text-slate-900 shadow-sm placeholder:text-slate-400"}`}
              required
              value={mode === "login" ? loginDetails.email : resetEmail}
              onChange={(e) => {
                if (mode === "login") {
                  setLoginDetails(prev => ({ ...prev, email: e.target.value }));
                  setVerificationPrompt(null);
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
                onClick={() => {
                  setMode("forgot");
                  setVerificationPrompt(null);
                }}
              >
                Forgot password?
              </button>
            </div>
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

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 text-white font-bold"
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <>
            <span>{mode === "login" ? "Sign In" : "Send Reset Link"}</span>
            {mode === "login" ? <ArrowRight size={18} /> : <Send size={18} />}
          </>
        )}
      </Button>

      <AnimatePresence mode="wait">
        {verificationPrompt && mode === "login" && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className={`overflow-hidden rounded-2xl border p-4 ${
              resendLoading || verificationPrompt.sentMessage || feedbackTone === "success"
                ? theme === "dark"
                  ? "border-emerald-500/20 bg-emerald-500/10"
                  : "border-emerald-200 bg-emerald-50"
                : theme === "dark"
                  ? "border-amber-500/20 bg-amber-500/10"
                  : "border-amber-200 bg-amber-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                resendLoading || verificationPrompt.sentMessage || feedbackTone === "success"
                  ? theme === "dark"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-emerald-100 text-emerald-700"
                  : theme === "dark"
                    ? "bg-amber-500/15 text-amber-400"
                    : "bg-amber-100 text-amber-700"
              }`}>
                <MailCheck size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold ${
                  resendLoading || verificationPrompt.sentMessage || feedbackTone === "success"
                    ? theme === "dark"
                      ? "text-emerald-100"
                      : "text-emerald-800"
                    : theme === "dark"
                      ? "text-amber-100"
                      : "text-amber-800"
                }`}>
                  {verificationPrompt.message}
                </p>
                <p className={`mt-1 text-xs ${
                  resendLoading || verificationPrompt.sentMessage || feedbackTone === "success"
                    ? theme === "dark"
                      ? "text-emerald-200/80"
                      : "text-emerald-700"
                    : theme === "dark"
                      ? "text-amber-200/80"
                      : "text-amber-700"
                }`}>
                  {verificationPrompt.email}
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={resendLoading}
                    onClick={handleResendVerification}
                    className={`gap-2 rounded-full border px-4 font-semibold ${
                      resendLoading || verificationPrompt.sentMessage || feedbackTone === "success"
                        ? theme === "dark"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/15"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : theme === "dark"
                          ? "border-amber-500/20 bg-amber-500/10 text-amber-50 hover:bg-amber-500/15"
                          : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    {resendLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <MailCheck size={16} />
                    )}
                    {resendLoading ? "Sending..." : "Resend verification link"}
                  </Button>
                  {verificationPrompt.sentMessage && (
                    <span className="text-xs font-medium text-emerald-200">
                      {verificationPrompt.sentMessage}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {mode === "forgot" && (
        <div className="pt-1 text-center">
          <p className={`mb-3 text-xs uppercase tracking-[0.24em] ${theme === "dark" ? "text-slate-600" : "text-slate-500"}`}>
            Remembered your password?
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setMode("login")}
            className={`mx-auto inline-flex items-center gap-2 rounded-full px-4 font-semibold ${theme === "dark" ? "text-slate-300 hover:bg-white/5 hover:text-white" : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"}`}
          >
            <ChevronLeft size={16} />
            Back to sign in
          </Button>
        </div>
      )}
    </motion.form>
  );
};

export default LoginForm;
