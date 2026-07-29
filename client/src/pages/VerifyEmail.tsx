import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { verifyEmail } from "../services/auth.service";
import { Loader2, CheckCircle2, XCircle, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6 overflow-hidden relative"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-violet-600/5 blur-[120px] -z-10 rounded-full" />
      
      <div className="w-full max-w-md relative z-10 text-center">
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <motion.img
              src="/llgg.png"
              alt="Shortify Logo"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="h-10 w-10 object-contain transition-transform"
            />
            <span className="text-2xl font-bold tracking-tight text-white">Shortify</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Account Verification</h1>
        </div>
        
        <div className="glass-card p-12 shadow-2xl shadow-black/50 border-white/10">
          {loading ? (
            <div className="space-y-6 py-4">
              <div className="flex justify-center">
                <Loader2 size={48} className="animate-spin text-violet-500/50" />
              </div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Securing your identity...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-center">
                {success ? (
                  <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={40} />
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                    <XCircle size={40} />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {success ? "Verified" : "Failed"}
                </h2>
                <p className="text-slate-500 text-sm">{message}</p>
              </div>
              <button 
                onClick={() => navigate("/login")}
                className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.98]"
              >
                Continue to Login
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-6 mt-8">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-widest">
            <ChevronLeft size={14} />
            Back to Home
          </Link>
        </div>
      </div>
    </motion.main>
  );
};

export default VerifyEmail;
