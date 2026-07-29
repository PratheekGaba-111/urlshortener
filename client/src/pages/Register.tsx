import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";
import { Zap, Sparkles, Shield, MousePointer2, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const Register = () => {
  return (
    <main className="min-h-screen bg-[#0a0a0c] flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side: Branding & Info */}
      <section className="relative flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-24 overflow-hidden bg-white/[0.01]">
        <div className="absolute top-0 left-0 w-full h-full bg-violet-600/5 blur-[120px] -z-10 rounded-full scale-150" />
        
        <div className="relative z-10 max-w-xl">
          <Link to="/" className="inline-flex items-center gap-2 mb-12 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-500/20 group-hover:rotate-12 transition-transform">
              <Zap size={22} fill="currentColor" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Shortify</span>
          </Link>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Sparkles size={14} />
            <span>Launch Workspace</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight text-white"
          >
            Create links that feel <br />
            <span className="gradient-text">product-grade.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 mb-12 leading-relaxed"
          >
            Open your workspace and start turning long URLs into clean, measurable launch assets in seconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-8"
          >
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-violet-400 shadow-xl shadow-black/20">
                <MousePointer2 size={24} />
              </div>
              <h3 className="text-white font-bold text-lg">Fast Onboarding</h3>
              <p className="text-sm text-slate-500">Get your workspace ready in under a minute.</p>
            </div>
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shadow-xl shadow-black/20">
                <Shield size={24} />
              </div>
              <h3 className="text-white font-bold text-lg">Built-in Trust</h3>
              <p className="text-sm text-slate-500">Verified accounts and secure password recovery.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Right Side: Register Form */}
      <section className="flex-1 flex items-center justify-center p-8 bg-[#0a0a0c] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_70%)]" />
        
        <div className="w-full max-w-md space-y-10 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Create Account</h2>
            <p className="text-slate-500">Join thousands of builders using Shortify</p>
          </div>
          
          <div className="glass-card p-10 shadow-2xl shadow-violet-500/5 border-white/10">
            <RegisterForm />
          </div>

          <div className="flex flex-col items-center gap-6">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-violet-400 font-bold hover:text-violet-300 transition-colors">
                Sign In
              </Link>
            </p>
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-widest">
              <ChevronLeft size={14} />
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;
