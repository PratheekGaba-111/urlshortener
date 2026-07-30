import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { verifyEmail } from "../services/auth.service";
import { Loader2, CheckCircle2, XCircle, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { AuroraBackground } from "../components/magic-ui/aurora-background";
import { ShineBorder } from "../components/magic-ui/shine-border";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "../hooks/useTheme";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const { theme } = useTheme();

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
    <AuroraBackground className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-[#0a0a0c] text-white" : "bg-slate-50 text-slate-900"}`}>
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center p-6 overflow-hidden relative"
      >
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
              <span className={`text-2xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Shortify</span>
            </Link>
            <h1 className={`text-3xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Account Verification</h1>
          </div>
          
          <ShineBorder className="rounded-[1.75rem]">
            <Card className={`border-0 bg-transparent shadow-none ${theme === "dark" ? "shadow-black/50" : "bg-white/90 shadow-slate-200/70"}`}>
              <CardContent className={`p-12 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                {loading ? (
                  <div className="space-y-6 py-4">
                    <div className="flex justify-center">
                      <Loader2 size={48} className="animate-spin text-violet-500/50" />
                    </div>
                    <p className={`font-bold uppercase tracking-widest text-[10px] ${theme === "dark" ? "text-slate-500" : "text-slate-600"}`}>Securing your identity...</p>
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
                      <p className={`${theme === "dark" ? "text-slate-500" : "text-slate-600"} text-sm`}>{message}</p>
                    </div>
                    <Button 
                      onClick={() => navigate("/login")}
                      className="w-full flex items-center justify-center gap-2 text-white font-bold"
                    >
                      Continue to Login
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </ShineBorder>

          <div className="flex flex-col items-center gap-6 mt-8">
            <Link to="/" className={`inline-flex items-center gap-2 text-[10px] font-bold transition-colors uppercase tracking-widest ${theme === "dark" ? "text-slate-600 hover:text-slate-400" : "text-slate-500 hover:text-slate-700"}`}>
              <ChevronLeft size={14} />
              Back to Home
            </Link>
          </div>
        </div>
      </motion.main>
    </AuroraBackground>
  );
};

export default VerifyEmail;
