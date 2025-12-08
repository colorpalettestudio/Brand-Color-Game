import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";
import { Brand } from "@/data/brands";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import confetti from "canvas-confetti";
import { Check, X, ArrowRight } from "lucide-react";

extend([mixPlugin]);

interface GameCardProps {
  brand: Brand;
  mode: "easy" | "hard";
  onComplete: (score: number) => void;
}

export function GameCard({ brand, mode, onComplete }: GameCardProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [currentHex, setCurrentHex] = useState<string>("#888888"); // For live preview
  const [options, setOptions] = useState<string[]>([]);
  const [sliderValue, setSliderValue] = useState(50);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hardModeGradient, setHardModeGradient] = useState<{ start: string; end: string }>({ start: "#000", end: "#fff" });
  const [resultStats, setResultStats] = useState<{ accuracy: number; points: number } | null>(null);

  // Generate options or gradient on brand change
  useEffect(() => {
    setHasSubmitted(false);
    setSelectedColor(null);
    setSliderValue(50);
    setResultStats(null);

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
      // Hard mode: Gradient setup
      const variation = Math.random() > 0.5 ? 'hue' : 'lightness';
      const targetPos = 0.2 + (Math.random() * 0.6); 
      
      let start, end;
      
      if (variation === 'hue') {
          const range = 120;
          start = baseColor.rotate(-range * targetPos).toHex();
          end = baseColor.rotate(range * (1 - targetPos)).toHex();
      } else {
          const range = 0.6;
          start = baseColor.darken(range * targetPos).toHex();
          end = baseColor.lighten(range * (1 - targetPos)).toHex();
      }
      
      setHardModeGradient({ start, end });
      // Set initial preview color
      const initialColor = colord(start).mix(end, 0.5).toHex();
      setCurrentHex(initialColor);
    }
  }, [brand, mode]);

  // Update live preview when slider moves
  const handleSliderChange = (vals: number[]) => {
    setSliderValue(vals[0]);
    const mix = vals[0] / 100;
    const pickedColor = colord(hardModeGradient.start).mix(hardModeGradient.end, mix);
    setCurrentHex(pickedColor.toHex());
  };

  const handleEasySubmit = (color: string) => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    setSelectedColor(color);

    const isCorrect = color === brand.hex;
    const points = isCorrect ? 100 : 0;
    
    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [brand.hex, "#ffffff"]
      });
    }
    
    setTimeout(() => onComplete(points), 1500);
  };

  const handleHardSubmit = () => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    setSelectedColor(currentHex);

    // Calculate score based on RGB distance
    const rgb1 = colord(currentHex).toRgb();
    const rgb2 = colord(brand.hex).toRgb();
    
    const distance = Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
    );
    
    // Max theoretical distance is ~441. 
    // Convert to accuracy percentage (0-100%)
    // Let's be generous: if distance is 0, accuracy is 100%. 
    // If distance is > 100 (which is quite far visually), accuracy drops to 0.
    const maxForgivableDistance = 100;
    let accuracy = Math.max(0, 100 - (distance / maxForgivableDistance * 100));
    accuracy = Math.round(accuracy);
    
    // Points mapping
    let points = 0;
    if (accuracy >= 95) points = 100;
    else if (accuracy >= 90) points = 80;
    else if (accuracy >= 80) points = 60;
    else if (accuracy >= 50) points = 40;
    else if (accuracy >= 20) points = 10;
    else points = 0;

    setResultStats({ accuracy, points });

    if (points >= 60) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [brand.hex, currentHex]
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-card border border-border rounded-xl shadow-xl overflow-hidden"
      >
        <div className="p-8 md:p-12 text-center space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
                 <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${mode === 'easy' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {mode} Mode
                 </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-foreground">
              {brand.name}
            </h1>
          </div>

          <div className="py-4">
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
                {/* Preview Swatches Area */}
                <div className="flex justify-center gap-4 md:gap-12 items-end h-32 mb-8">
                    {/* Live Preview */}
                    <div className="flex flex-col items-center gap-2">
                        <motion.div 
                            className="w-24 h-24 rounded-full shadow-lg border-4 border-white ring-1 ring-black/5"
                            style={{ backgroundColor: currentHex }}
                            animate={{ scale: hasSubmitted ? 0.9 : 1 }}
                        />
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your Pick</span>
                    </div>

                    {/* Correct Answer (Hidden until submit) */}
                     {hasSubmitted && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div 
                                className="w-24 h-24 rounded-full shadow-lg border-4 border-white ring-1 ring-black/5"
                                style={{ backgroundColor: brand.hex }}
                            />
                            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Correct Match</span>
                        </motion.div>
                    )}
                </div>

                <div 
                  className="h-16 rounded-xl w-full shadow-inner border border-border relative overflow-hidden mx-auto max-w-lg"
                >
                   <div 
                      className="absolute inset-0 w-full h-full"
                      style={{ 
                        background: `linear-gradient(to right, ${hardModeGradient.start}, ${hardModeGradient.end})` 
                      }} 
                   />
                </div>

                <div className="px-4 max-w-lg mx-auto">
                    <Slider 
                      value={[sliderValue]} 
                      onValueChange={handleSliderChange} 
                      max={100} 
                      step={0.1}
                      disabled={hasSubmitted}
                      className="cursor-pointer"
                    />
                    {!hasSubmitted && (
                        <p className="text-xs text-muted-foreground mt-4">Slide to match the brand color above</p>
                    )}
                </div>
                
                {hasSubmitted && resultStats && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-secondary/50 rounded-lg p-6 max-w-sm mx-auto space-y-4"
                    >
                        <div className="flex justify-between items-center border-b border-border pb-4">
                            <span className="text-muted-foreground">Accuracy</span>
                            <span className={`font-bold text-xl ${resultStats.accuracy > 80 ? 'text-green-600' : 'text-orange-600'}`}>
                                {resultStats.accuracy}% Match
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Points Earned</span>
                            <span className="font-bold text-xl">+{resultStats.points}</span>
                        </div>
                        <Button 
                            className="w-full mt-4" 
                            onClick={() => onComplete(resultStats.points)}
                        >
                            Next Brand <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </motion.div>
                )}

                {!hasSubmitted && (
                    <div className="flex justify-center pt-4">
                        <Button 
                            size="lg" 
                            onClick={handleHardSubmit} 
                            className="font-display text-lg px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                        >
                            Confirm Match
                        </Button>
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
