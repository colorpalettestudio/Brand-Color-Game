import { useEffect, useRef } from "react";
import { useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreCounterProps {
  value: number;
  className?: string;
}

export function ScoreCounter({ value, className }: ScoreCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { 
    damping: 20, 
    stiffness: 100,
    mass: 0.5 
  });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        // Format with commas if needed, though for <2000 it's fine without
        ref.current.textContent = Math.round(latest).toFixed(0);
      }
    });
  }, [springValue]);

  // Set initial value immediately on mount to avoid starting from 0 if value is already set
  useEffect(() => {
      if (ref.current && motionValue.get() === 0 && value > 0) {
           motionValue.jump(value);
      }
  }, []);

  return <span ref={ref} className={cn("tabular-nums", className)} />;
}
