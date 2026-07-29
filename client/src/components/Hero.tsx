import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "../utils/cn";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Animated Grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[#0a0a0c]">
        <div className="absolute h-full w-full bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-8"
        >
          <Sparkles size={14} />
          <span>Next-Gen URL Shortening</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]"
        >
          Links that <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400">
            Convert.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Transform your long, messy links into powerful marketing assets. 
          Real-time analytics, custom aliases, and team collaboration in one sleek dashboard.
        </motion.p>
      </div>
    </section>
  );
};
