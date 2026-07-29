import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-violet-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/5 border border-violet-500/10 text-violet-400/80 text-[10px] font-bold uppercase tracking-widest mb-8"
        >
          <Sparkles size={12} />
          <span>Professional Link Management</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1] text-white"
        >
          Shorten. Track. <br />
          <span className="gradient-text">Dominate.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Transform your messy links into clean, trackable marketing assets. 
          Built for teams who value precision and speed.
        </motion.p>
      </div>
    </section>
  );
};
