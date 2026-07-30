import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";
import { AuroraBackground } from "../components/magic-ui/aurora-background";
import { ShineBorder } from "../components/magic-ui/shine-border";
import { Card, CardContent } from "@/components/ui/card";

const Register = () => {
  const { theme } = useTheme();

  return (
    <AuroraBackground className={`min-h-screen ${theme === "dark" ? "bg-[#0a0a0c] text-white" : "bg-slate-50 text-slate-900"}`}>
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center overflow-hidden p-6 relative transition-colors duration-300"
      >
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-10">
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
            
            <h1 className={`mb-2 text-3xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Join Shortify</h1>
            <p className={`${theme === "dark" ? "text-slate-500" : "text-slate-600"}`}>Start building your premium link portfolio</p>
          </div>
          
          <ShineBorder className="rounded-[1.75rem]">
            <Card className={`border-0 bg-transparent shadow-none ${theme === "dark" ? "shadow-black/50" : "bg-white/90 shadow-slate-200/70"}`}>
              <CardContent className={`p-8 md:p-10 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                <RegisterForm />
              </CardContent>
            </Card>
          </ShineBorder>

          <div className="mt-8 text-center">
            <p className={`text-sm ${theme === "dark" ? "text-slate-500" : "text-slate-600"}`}>
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-violet-400 transition-colors hover:text-violet-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.main>
    </AuroraBackground>
  );
};

export default Register;
