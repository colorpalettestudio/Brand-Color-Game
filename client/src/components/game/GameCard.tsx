import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";
import { Brand } from "@/data/brands";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import confetti from "canvas-confetti";
import { Check, X } from "lucide-react";

extend([mixPlugin]);

interface GameCardProps {
  brand: Brand;
  mode: "easy" | "hard";
  onComplete: (score: number) => void;
}

export function GameCard({ brand, mode, onComplete }: GameCardProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [sliderValue, setSliderValue] = useState(50);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hardModeGradient, setHardModeGradient] = useState<{ start: string; end: string }>({ start: "#000", end: "#fff" });

  // Generate options or gradient on brand change
  useEffect(() => {
    setHasSubmitted(false);
    setSelectedColor(null);
    setSliderValue(50);

    const baseColor = colord(brand.hex);

    if (mode === "easy") {
      // Generate 2 distractors
      const distractors = [
        baseColor.rotate(30).saturate(10).toHex(),
        baseColor.rotate(-30).lighten(10).toHex(),
      ];
      // Shuffle
      const allOptions = [brand.hex, ...distractors].sort(() => Math.random() - 0.5);
      setOptions(allOptions);
    } else {
      // Hard mode: Gradient setup with randomized target position
      const variation = Math.random() > 0.5 ? 'hue' : 'lightness';
      
      // Random position for the target between 20% and 80%
      const targetPos = 0.2 + (Math.random() * 0.6); 
      
      let start, end;
      
      if (variation === 'hue') {
          // Total range of 120 degrees
          const range = 120;
          start = baseColor.rotate(-range * targetPos).toHex();
          end = baseColor.rotate(range * (1 - targetPos)).toHex();
      } else {
          // Total lightness range of 0.6
          const range = 0.6;
          // Ensure we don't go out of bounds (0-1) - clamping handles this implicitly in colord usually but good to be safe
          start = baseColor.darken(range * targetPos).toHex();
          end = baseColor.lighten(range * (1 - targetPos)).toHex();
      }
      
      setHardModeGradient({ start, end });
    }
  }, [brand, mode]);

  const handleEasySubmit = (color: string) => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    setSelectedColor(color);

    const isCorrect = color === brand.hex;
    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [brand.hex, "#ffffff"]
      });
      setTimeout(() => onComplete(100), 1500);
    } else {
      setTimeout(() => onComplete(0), 1500);
    }
  };

  const handleHardSubmit = () => {
    if (hasSubmitted) return;
    setHasSubmitted(true);

    // Calculate color at slider position
    const mix = sliderValue / 100;
    const pickedColor = colord(hardModeGradient.start).mix(hardModeGradient.end, mix);
    setSelectedColor(pickedColor.toHex());

    // Calculate score based on RGB distance
    const rgb1 = pickedColor.toRgb();
    const rgb2 = colord(brand.hex).toRgb();
    
    // Euclidean distance in RGB space
    const distance = Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
    );
    
    // Max distance is roughly 441 (sqrt(255^2 * 3))
    // We want a steep curve. 
    // Distance < 10 is amazing. < 30 is good.
    
    let score = 0;
    if (distance <= 10) score = 100;
    else if (distance <= 30) score = 80;
    else if (distance <= 60) score = 50;
    else if (distance <= 100) score = 20;
    else score = 0;

    if (score >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [brand.hex, pickedColor.toHex()]
      });
    }

    setTimeout(() => onComplete(score), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-card border border-border rounded-xl shadow-xl overflow-hidden"
      >
        <div className="p-12 text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Match the Brand</h2>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-foreground">
              {brand.name}
            </h1>
          </div>

          <div className="py-8">
            {mode === "easy" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {options.map((color, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEasySubmit(color)}
                    disabled={hasSubmitted}
                    className="h-32 rounded-xl shadow-sm border border-transparent hover:border-black/10 transition-all relative group cursor-pointer"
                    style={{ backgroundColor: color }}
                  >
                    {hasSubmitted && color === brand.hex && (
                       <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white rounded-xl">
                         <Check className="w-10 h-10" />
                       </div>
                    )}
                     {hasSubmitted && selectedColor === color && color !== brand.hex && (
                       <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white rounded-xl">
                         <X className="w-10 h-10" />
                       </div>
                    )}
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                <div 
                  className="h-32 rounded-xl w-full shadow-inner border border-border relative overflow-hidden"
                >
                   <div 
                      className="absolute inset-0 w-full h-full"
                      style={{ 
                        background: `linear-gradient(to right, ${hardModeGradient.start}, ${hardModeGradient.end})` 
                      }} 
                   />
                   {/* Indicator of where they are sliding */}
                   {!hasSubmitted && (
                     <div 
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none transition-all duration-75"
                        style={{ left: `${sliderValue}%` }}
                     />
                   )}
                </div>

                <div className="px-4">
                    <Slider 
                      value={[sliderValue]} 
                      onValueChange={(vals) => setSliderValue(vals[0])} 
                      max={100} 
                      step={0.1}
                      disabled={hasSubmitted}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">Drag the slider to find the exact brand color</p>
                </div>

                <div className="flex justify-center">
                    <Button 
                        size="lg" 
                        onClick={handleHardSubmit} 
                        disabled={hasSubmitted}
                        className="font-display text-lg px-8 py-6 rounded-full"
                    >
                        {hasSubmitted ? "Analyzing..." : "Confirm Color"}
                    </Button>
                </div>
                
                {hasSubmitted && (
                    <div className="flex justify-center gap-8 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full shadow mb-2 mx-auto border-4 border-white" style={{ backgroundColor: selectedColor || '#fff' }} />
                            <p className="text-sm font-medium">You</p>
                            <p className="text-xs text-muted-foreground font-mono">{selectedColor}</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full shadow mb-2 mx-auto border-4 border-white" style={{ backgroundColor: brand.hex }} />
                            <p className="text-sm font-medium">Correct</p>
                            <p className="text-xs text-muted-foreground font-mono">{brand.hex}</p>
                        </div>
                    </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
