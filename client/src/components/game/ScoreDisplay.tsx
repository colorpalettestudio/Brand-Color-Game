import { useEffect, useState } from "react";
import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Trophy, Star } from "lucide-react";

export function ScoreDisplay({ score }: { score: number }) {
  // Use a spring for smooth counting animation
  const springScore = useSpring(score, { stiffness: 40, damping: 20 });
  const displayScore = useTransform(springScore, (current) => Math.round(current));
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [diff, setDiff] = useState(0);
  const [prevScore, setPrevScore] = useState(score);

  useEffect(() => {
    if (score !== prevScore) {
        const difference = score - prevScore;
        setDiff(difference);
        setPrevScore(score);
        
        springScore.set(score);
        setIsUpdating(true);
        
        const timer = setTimeout(() => setIsUpdating(false), 600);
        return () => clearTimeout(timer);
    }
  }, [score, prevScore, springScore]);

  return (
    <div className="relative z-50">
      {/* Floating +Points Animation */}
      <AnimatePresence>
        {isUpdating && diff > 0 && (
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.5 }}
                animate={{ opacity: 1, y: -40, scale: 1.2 }}
                exit={{ opacity: 0, y: -60, scale: 0.8 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute right-0 -bottom-8 pointer-events-none z-50 flex items-center gap-1"
            >
                <span className="text-3xl font-black text-green-500 drop-shadow-sm">+{diff}</span>
            </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="relative bg-white/90 backdrop-blur-xl border-2 border-black/5 rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-4 min-w-[160px] justify-between overflow-hidden"
        animate={isUpdating ? { 
            scale: 1.05, 
            borderColor: "rgba(0,0,0,0.1)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
        } : { 
            scale: 1, 
            borderColor: "rgba(0,0,0,0.05)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Background Sparkle Effect */}
        {isUpdating && (
            <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-transparent pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />
        )}

        <div className="flex flex-col">
             <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                Total Score
             </span>
             <motion.span className="text-3xl font-black font-mono tracking-tighter text-foreground tabular-nums leading-none mt-1">
                {displayScore}
             </motion.span>
        </div>

        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isUpdating ? 'bg-yellow-100 text-yellow-600' : 'bg-secondary text-muted-foreground'}`}>
            <motion.div
                animate={isUpdating ? { rotate: 360, scale: 1.2 } : { rotate: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {isUpdating ? <Star className="w-5 h-5 fill-current" /> : <Trophy className="w-5 h-5" />}
            </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
