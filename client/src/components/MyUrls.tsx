import { useEffect, useState } from "react";
import type { UrlClickUpdate, UrlData } from "../types/url";
import { getMyUrls } from "../services/url.service";
import UrlCard from "./UrlCard";
import { Loader2, Link2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MyUrlsProps {
  refreshKey?: number;
  clickUpdate?: UrlClickUpdate | null;
}

const MyUrls = ({
  refreshKey = 0,
  clickUpdate = null,
}: MyUrlsProps) => {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrls = async () => {
      setLoading(true);

      try {
        const response = await getMyUrls();

        if (response) {
          setUrls(response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, [refreshKey]);

  useEffect(() => {
    if (!clickUpdate) return;

    setUrls((currentUrls) =>
      currentUrls.map((url) =>
        url.id === clickUpdate.id
          ? { ...url, clicks: clickUpdate.clicks }
          : url
      )
    );
  }, [clickUpdate]);

  if (loading && urls.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        >
          <Loader2
            size={42}
            className="text-violet-500"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <section className="w-full">
      {urls.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.45,
          }}
          className="glass-card relative overflow-hidden rounded-3xl border border-white/10 p-14 text-center"
        >
          {/* Glow */}
          <div className="absolute left-1/2 top-0 h-60 w-60 -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative z-10">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-600 shadow-2xl shadow-violet-600/30">
              <Link2
                size={34}
                className="text-white"
              />
            </div>

            <h2 className="mb-3 text-3xl font-bold tracking-tight text-white">
              No Short Links Yet
            </h2>

            <p className="mx-auto mb-8 max-w-md text-[15px] leading-7 text-slate-400">
              Create your first shortened URL and start
              tracking clicks with a beautiful dashboard.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-5 py-2 text-sm text-violet-300">
              <Sparkles size={16} />
              Your links will appear here instantly
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="space-y-5"
        >
          <AnimatePresence mode="popLayout">
            {urls.map((url, index) => (
              <motion.div
                key={url.id}
                layout
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
                  type: "spring",
                  stiffness: 120,
                }}
              >
                <UrlCard urlData={url} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};

export default MyUrls;