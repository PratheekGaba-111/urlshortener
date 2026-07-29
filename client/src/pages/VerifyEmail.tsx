import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { verifyEmail } from "../services/auth.service";
import { Loader2, CheckCircle2, XCircle, Zap, Sparkles } from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setLoading(false);
        setSuccess(false);
        setMessage("Invalid verification link.");
        return;
      }

      try {
        const response = await verifyEmail(token);
        setSuccess(true);
        setMessage(response.message);
      } catch (error: any) {
        setSuccess(false);
        setMessage(
          error.response?.data?.message ?? "Email verification failed."
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

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
            <span>Account Verification</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Confirming your <br />
            <span className="gradient-text">identity</span>
          </h1>
          
          <p className="text-lg text-slate-400 mb-12">
            We're securing your workspace to ensure only you can manage your links.
          </p>
        </div>
      </section>

      {/* Right Side: Verification Status */}
      <section className="flex-1 flex items-center justify-center p-8 bg-white/[0.02] border-l border-white/5">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="glass-card p-12 shadow-2xl shadow-violet-500/5">
            {loading ? (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <Loader2 size={48} className="animate-spin text-violet-500" />
                </div>
                <h2 className="text-2xl font-bold">Verifying...</h2>
                <p className="text-slate-500">Please wait while we verify your account.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center">
                  {success ? (
                    <CheckCircle2 size={64} className="text-emerald-500" />
                  ) : (
                    <XCircle size={64} className="text-red-500" />
                  )}
                </div>
                <h2 className="text-2xl font-bold">
                  {success ? "Verified Successfully!" : "Verification Failed"}
                </h2>
                <p className="text-slate-500">{message}</p>
                <button 
                  onClick={() => navigate("/login")}
                  className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98]"
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default VerifyEmail;
