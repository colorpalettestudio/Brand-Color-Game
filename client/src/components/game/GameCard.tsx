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

interface ColorOption {
    primary: string;
    secondary?: string;
}

export function GameCard({ brand, mode, onComplete }: GameCardProps) {
  const [selectedOption, setSelectedOption] = useState<ColorOption | null>(null);
  const [currentHex, setCurrentHex] = useState<string>("#888888"); // For live preview in hard mode
  const [options, setOptions] = useState<ColorOption[]>([]);
  const [sliderValue, setSliderValue] = useState(50);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hardModeGradient, setHardModeGradient] = useState<{ start: string; end: string }>({ start: "#000", end: "#fff" });
  const [resultStats, setResultStats] = useState<{ accuracy: number; points: number } | null>(null);

  // Helper to generate a similar color
  const generateSimilarColor = (hex: string) => {
      const base = colord(hex);
      // Randomly tweak hue, saturation, or lightness slightly
      // We want them to be tricky!
      const type = Math.random();
      if (type < 0.33) {
          // Hue shift (+/- 10-30 degrees)
          const shift = (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 20);
          return base.rotate(shift).toHex();
      } else if (type < 0.66) {
          // Saturation shift (+/- 10-20%)
          const shift = (Math.random() > 0.5 ? 0.1 : -0.1) * (0.1 + Math.random() * 0.1);
          return base.saturate(shift).toHex();
      } else {
           // Lightness shift (+/- 5-15%)
           const shift = (Math.random() > 0.5 ? 0.05 : -0.05) * (0.05 + Math.random() * 0.1);
           return base.lighten(shift).toHex();
      }
  };

  // Generate options or gradient on brand change
  useEffect(() => {
    setHasSubmitted(false);
    setSelectedOption(null);
    setSliderValue(50);
    setResultStats(null);

    const baseColor = colord(brand.hex);

    if (mode === "easy") {
      const correctOption: ColorOption = { primary: brand.hex, secondary: brand.secondaryHex };
      const distractors: ColorOption[] = [];

      // Distractor 1: Hue Shift (e.g. "Warmer/Cooler")
      // Rotate by +/- 15-25 degrees to make it distinct but similar
      const hueShift = (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 10);
      
      if (brand.secondaryHex) {
          // For dual brands, shift the primary color's hue
          distractors.push({
              primary: colord(brand.hex).rotate(hueShift).toHex(),
              secondary: brand.secondaryHex
          });
      } else {
          distractors.push({
              primary: colord(brand.hex).rotate(hueShift).toHex()
          });
      }

      // Distractor 2: Lightness Shift (e.g. "Lighter/Darker")
      // Shift lightness by +/- 10-15% to be clearly visible
      const lightShift = (Math.random() > 0.5 ? 1 : -1) * (0.1 + Math.random() * 0.05);

      if (brand.secondaryHex) {
           // For dual brands, shift the SECONDARY color's lightness to create a different kind of wrong pair
           distractors.push({
               primary: brand.hex,
               secondary: colord(brand.secondaryHex).lighten(lightShift).toHex()
           });
      } else {
           distractors.push({
               primary: colord(brand.hex).lighten(lightShift).toHex()
           });
      }

      // Shuffle
      const allOptions = [correctOption, ...distractors].sort(() => Math.random() - 0.5);
      setOptions(allOptions);
    } else {
      // Hard mode: Gradient setup
      // Note: For dual color brands in hard mode, we currently only test the PRIMARY color to keep the UI manageable.
      const variation = Math.random() > 0.5 ? 'hue' : 'lightness';
      const targetPos = 0.2 + (Math.random() * 0.6); 
      
      let start, end;
      
      if (variation === 'hue') {
          // Reduced range to ensure RGB interpolation doesn't desaturate the center too much
          // (RGB mix cuts through the color wheel, so wide angles lose saturation)
          const range = 40; 
          start = baseColor.rotate(-range * targetPos).toHex();
          end = baseColor.rotate(range * (1 - targetPos)).toHex();
      } else {
          const range = 0.4; // Reduced lightness range for finer control
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

  const handleEasySubmit = (option: ColorOption) => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    setSelectedOption(option);

    const isCorrect = option.primary === brand.hex && option.secondary === brand.secondaryHex;
    const points = isCorrect ? 100 : 0;
    
    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: brand.secondaryHex ? [brand.hex, brand.secondaryHex] : [brand.hex, "#ffffff"]
      });
    }
    
    setTimeout(() => onComplete(points), 1500);
  };

  const handleHardSubmit = () => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    setSelectedOption({ primary: currentHex }); // Just for consistency state tracking

    // Calculate score based on RGB distance
    const rgb1 = colord(currentHex).toRgb();
    const rgb2 = colord(brand.hex).toRgb();
    
    const distance = Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
    );
    
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
            {mode === 'hard' && brand.secondaryHex && (
                <p className="text-sm text-muted-foreground">(Match the primary color)</p>
            )}
          </div>

          <div className="py-4">
            {mode === "easy" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {options.map((option, idx) => {
                    const isCorrect = option.primary === brand.hex && option.secondary === brand.secondaryHex;
                    const isSelected = selectedOption === option;
                    
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEasySubmit(option)}
                        disabled={hasSubmitted}
                        className="h-32 rounded-xl shadow-sm border border-transparent hover:border-black/10 transition-all relative group cursor-pointer overflow-hidden flex"
                      >
                         {/* Render Logic: Single or Dual Color */}
                         {option.secondary ? (
                             <>
                                <div className="flex-1 h-full" style={{ backgroundColor: option.primary }} />
                                <div className="flex-1 h-full" style={{ backgroundColor: option.secondary }} />
                             </>
                         ) : (
                             <div className="w-full h-full" style={{ backgroundColor: option.primary }} />
                         )}

                         {/* Feedback Overlay */}
                         {hasSubmitted && isCorrect && (
                           <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white z-10">
                             <Check className="w-10 h-10 drop-shadow-md" />
                           </div>
                         )}
                         {hasSubmitted && isSelected && !isCorrect && (
                           <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white z-10">
                             <X className="w-10 h-10 drop-shadow-md" />
                           </div>
                         )}
                      </motion.button>
                    );
                })}
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
