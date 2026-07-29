import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";
import { Zap, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const Register = () => {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-6 overflow-hidden relative"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-violet-600/5 blur-[120px] -z-10 rounded-full" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-500/20 group-hover:rotate-12 transition-transform">
              <Zap size={22} fill="currentColor" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Shortify</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-white mb-2">Join Shortify</h1>
          <p className="text-slate-500">Start building your premium link portfolio</p>
        </div>
        
        <div className="glass-card p-8 md:p-10 shadow-2xl shadow-black/50 border-white/10">
          <RegisterForm />
        </div>

        <div className="flex flex-col items-center gap-6 mt-8">
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-400 font-bold hover:text-violet-300 transition-colors">
              Sign in
            </Link>
          </p>
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-widest">
            <ChevronLeft size={14} />
            Back to Home
          </Link>
        </div>
      </div>
    </motion.main>
  );
};

export default Register;
