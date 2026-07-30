import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { AuroraBackground } from "./magic-ui/aurora-background";
import { AnimatedGridPattern } from "./magic-ui/animated-grid-pattern";
import { Badge } from "@/components/ui/badge";

export const Hero = () => {
  const { theme } = useTheme();

  return (
    <AuroraBackground className="relative overflow-hidden bg-transparent">
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-40">
          <div className={`absolute top-0 left-1/2 h-96 w-full max-w-4xl -translate-x-1/2 rounded-full blur-[120px] ${theme === "dark" ? "bg-violet-600/10" : "bg-violet-400/15"}`} />
          {theme === "dark" && <AnimatedGridPattern className="opacity-20" />}
        </div>

        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex justify-center"
          >
            <Badge
              variant="outline"
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${theme === "dark" ? "border-violet-500/10 bg-violet-500/5 text-violet-300" : "border-violet-200 bg-violet-50 text-violet-700"}`}
            >
              <Sparkles size={12} />
              <span>Professional Link Management</span>
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`mb-6 text-5xl font-black leading-[1.1] tracking-tight md:text-7xl ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            Shorten. Track. <br />
            <span className="gradient-text">Dominate.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`mx-auto mb-10 max-w-xl text-lg leading-relaxed ${theme === "dark" ? "text-slate-500" : "text-slate-600"}`}
          >
            Transform your messy links into clean, trackable marketing assets.
            Built for teams who value precision and speed.
          </motion.p>
        </div>
      </section>
    </AuroraBackground>
  );
};
