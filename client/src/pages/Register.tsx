import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";
import { Zap, Sparkles, Shield, MousePointer2 } from "lucide-react";

const Register = () => {
  return (
    <main className="min-h-screen bg-[#0a0a0c] flex flex-col md:flex-row overflow-hidden">
      {/* Left Side: Branding & Info */}
      <section className="relative flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-24 overflow-hidden">
        {/* Background Glows */}
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
            <span>Launch Workspace</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Create links that feel <br />
            <span className="gradient-text">product-grade</span>
          </h1>
          
          <p className="text-lg text-slate-400 mb-12">
            Open your Shortify workspace and start turning long URLs into clean, measurable launch assets.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-violet-400">
                <MousePointer2 size={20} />
              </div>
              <div>
                <h3 className="text-white font-semibold">Fast onboarding</h3>
                <p className="text-sm text-slate-500">Get started in under a minute</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="text-white font-semibold">Built-in trust</h3>
                <p className="text-sm text-slate-500">Verified accounts & recovery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Register Form */}
      <section className="flex-1 flex items-center justify-center p-8 bg-white/[0.02] border-l border-white/5">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">Create account</h2>
            <p className="text-slate-500 mt-2">Join thousands of builders using Shortify</p>
          </div>
          
          <div className="glass-card p-8 shadow-2xl shadow-violet-500/5">
            <RegisterForm />
          </div>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;
