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
  mode: "easy" | "hard" | "bonus";
  allBrands?: Brand[]; // Needed for bonus mode to find distractors
  forceSingleColor?: boolean; // New prop to force single color display in Level 1
  missingColorMode?: boolean; // New prop for Level 2 "complete the palette"
  onComplete: (score: number) => void;
}

interface ColorOption {
    colors?: string[]; // For easy mode
    name?: string;     // For bonus mode
    id?: string;       // For bonus mode
}

export function GameCard({ brand, mode, allBrands, forceSingleColor = false, missingColorMode = false, onComplete }: GameCardProps) {
  const [selectedOption, setSelectedOption] = useState<ColorOption | null>(null);
  const [currentHex, setCurrentHex] = useState<string>("#888888"); // For live preview in hard mode
  const [options, setOptions] = useState<ColorOption[]>([]);
  const [sliderValue, setSliderValue] = useState(50);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hardModeGradient, setHardModeGradient] = useState<{ start: string; end: string }>({ start: "#000", end: "#fff" });
  const [resultStats, setResultStats] = useState<{ accuracy: number; points: number } | null>(null);
  const [targetPosition, setTargetPosition] = useState<number>(50);
  
  // New state for missing color mode
  const [givenColors, setGivenColors] = useState<string[]>([]);
  const [targetColor, setTargetColor] = useState<string>("");

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

    if (mode === "bonus") {
        // Bonus Mode: Show Color -> Pick Brand
        const correctOption = { name: brand.name, id: brand.id };
        
        // Find distractors with similar hue if possible
        let distractors = allBrands 
            ? allBrands
                .filter(b => b.id !== brand.id)
                .map(b => ({
                    brand: b,
                    diff: Math.abs(colord(b.hex).hue() - baseColor.hue())
                }))
                .sort((a, b) => a.diff - b.diff) // Sort by hue similarity
                .slice(0, 2) // Take top 2 closest
                .map(item => ({ name: item.brand.name, id: item.brand.id }))
            : [];
            
        // If we don't have enough similar ones (or allBrands wasn't passed), pick randoms
        if (distractors.length < 2 && allBrands) {
             const randoms = allBrands
                .filter(b => b.id !== brand.id && !distractors.find(d => d.id === b.id))
                .sort(() => Math.random() - 0.5)
                .slice(0, 2 - distractors.length)
                .map(b => ({ name: b.name, id: b.id }));
             distractors = [...distractors, ...randoms];
        }

        const allOptions = [correctOption, ...distractors].sort(() => Math.random() - 0.5);
        setOptions(allOptions);

    } else if (mode === "easy") {
      // Determine correct palette
      const correctColors = [brand.hex];
      
      // Only add extra colors if we are NOT forcing single color mode
      if (!forceSingleColor) {
          if (brand.extraColors && brand.extraColors.length > 0) {
            correctColors.push(...brand.extraColors);
          } else if (brand.secondaryHex) {
            correctColors.push(brand.secondaryHex);
          }
      }
      
      const correctOption: ColorOption = { colors: correctColors };
      const distractors: ColorOption[] = [];


      // Distractor 1: Hue Shift (e.g. "Warmer/Cooler")
      // Rotate by +/- 8-10 degrees (per user request)
      const hueShift = (Math.random() > 0.5 ? 1 : -1) * (8 + Math.random() * 2);
      
      distractors.push({
          colors: correctColors.map(c => colord(c).rotate(hueShift).toHex())
      });

      // Distractor 2: Lightness Shift (e.g. "Lighter/Darker")
      // Shift lightness by +/- 4-8% (per user request)
      const lightShift = (Math.random() > 0.5 ? 1 : -1) * (0.04 + Math.random() * 0.04);

      // For lightness shift, we want to maintain the relationship but shift the whole palette
      distractors.push({
          colors: correctColors.map(c => colord(c).lighten(lightShift).toHex())
      });

      // Shuffle
      const allOptions = [correctOption, ...distractors].sort(() => Math.random() - 0.5);
      setOptions(allOptions);
    } else {
      // Hard mode: Gradient setup
      // Note: For dual/multi color brands in hard mode, we currently only test the PRIMARY color to keep the UI manageable.
      const variation = Math.random() > 0.5 ? 'hue' : 'lightness';
      const targetPos = 0.2 + (Math.random() * 0.6); 
      setTargetPosition(targetPos * 100);

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
      // Set initial preview color - default to middle of slider, calculating correctly based on 3-stop logic
      const initialMix = 0.5;
      if (initialMix <= targetPos) {
          // Map 0..targetPos to 0..1
          const localMix = initialMix / targetPos;
          setCurrentHex(colord(start).mix(brand.hex, localMix).toHex());
      } else {
          // Map targetPos..1 to 0..1
          const localMix = (initialMix - targetPos) / (1 - targetPos);
          setCurrentHex(colord(brand.hex).mix(end, localMix).toHex());
      }
    }
  }, [brand, mode]);

  // Update live preview when slider moves
  const handleSliderChange = (vals: number[]) => {
    setSliderValue(vals[0]);
    const mix = vals[0] / 100;
    const targetPos = targetPosition / 100;
    
    // Use multi-stop interpolation to ensure we pass exactly through the brand color
    // This prevents "muddy" or desaturated colors in the middle of RGB interpolation
    let pickedColor;
    if (mix <= targetPos) {
        // Interpolate between Start and Brand
        const localMix = mix / targetPos; // 0 to 1 within this segment
        pickedColor = colord(hardModeGradient.start).mix(brand.hex, localMix);
    } else {
        // Interpolate between Brand and End
        const localMix = (mix - targetPos) / (1 - targetPos); // 0 to 1 within this segment
        pickedColor = colord(brand.hex).mix(hardModeGradient.end, localMix);
    }
    
    setCurrentHex(pickedColor.toHex());
  };

  const handleEasySubmit = (option: ColorOption) => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    setSelectedOption(option);

    if (mode === "bonus") {
        const isCorrect = option.id === brand.id;
        const points = isCorrect ? 100 : 0; // Bonus points!

        if (isCorrect) {
             confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: [brand.hex, "#ffffff"] // Use brand color for confetti
             });
        }
        
        // Shorter delay for bonus round
        setTimeout(() => onComplete(points), 1500);
        return;
    }

    // Easy Mode Logic
    // Simple array equality check for correctness
    const correctColors = [brand.hex];
    
    // Only add extra colors if we are NOT forcing single color mode
    if (!forceSingleColor) {
        if (brand.extraColors && brand.extraColors.length > 0) {
            correctColors.push(...brand.extraColors);
        } else if (brand.secondaryHex) {
            correctColors.push(brand.secondaryHex);
        }
    }
    
    const isCorrect = JSON.stringify(option.colors) === JSON.stringify(correctColors);
    const points = isCorrect ? 100 : 0;
    
    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: correctColors
      });
    }
    
    // Wait longer to read trivia regardless of result
    const delay = brand.trivia ? 4000 : 1500;
    setTimeout(() => onComplete(points), delay);
  };

  const handleHardSubmit = () => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    setSelectedOption({ colors: [currentHex] }); // Just for consistency state tracking

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
            {mode === "bonus" ? (
                <>
                    <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tighter text-foreground mb-4">
                        Which brand owns this color?
                    </h1>
                    <div className="flex justify-center py-6">
                        <div 
                            className="w-32 h-32 rounded-full shadow-2xl border-4 border-white ring-1 ring-black/10 animate-pulse"
                            style={{ backgroundColor: brand.hex }}
                        />
                    </div>
                </>
            ) : (
                <>
                    <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-foreground">
                    {brand.name}
                    </h1>
                    {mode === 'hard' && brand.secondaryHex && (
                        <p className="text-sm text-muted-foreground">(Match the primary color)</p>
                    )}
                </>
            )}
          </div>

          <div className="py-4">
            {mode === "easy" || mode === "bonus" ? (
              <>
              {missingColorMode && (
                  <div className="flex justify-center mb-8 gap-4 items-center">
                       {givenColors.map((color, idx) => (
                           <motion.div 
                                key={`given-${idx}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 rounded-xl shadow-md border-2 border-white ring-1 ring-black/5"
                                style={{ backgroundColor: color }}
                           />
                       ))}
                       <div className="w-20 h-20 rounded-xl border-4 border-dashed border-muted-foreground/30 flex items-center justify-center bg-secondary/20">
                           <span className="text-3xl font-bold text-muted-foreground/50">?</span>
                       </div>
                  </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {options.map((option, idx) => {
                    let isCorrect = false;
                    
                    if (mode === "bonus") {
                        isCorrect = option.id === brand.id;
                    } else if (missingColorMode) {
                        isCorrect = option.colors?.[0] === targetColor;
                    } else {
                        const correctColors = [brand.hex];
                        if (!forceSingleColor) {
                            if (brand.extraColors && brand.extraColors.length > 0) {
                                correctColors.push(...brand.extraColors);
                            } else if (brand.secondaryHex) {
                                correctColors.push(brand.secondaryHex);
                            }
                        }
                        isCorrect = JSON.stringify(option.colors) === JSON.stringify(correctColors);
                    }
                    
                    const isSelected = selectedOption === option;
                    
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleEasySubmit(option)}
                        disabled={hasSubmitted}
                        className={`h-40 rounded-2xl shadow-sm border-2 border-transparent hover:border-black/5 hover:shadow-md transition-all relative group cursor-pointer overflow-hidden flex bg-white ${mode === 'bonus' || missingColorMode ? 'items-center justify-center p-4' : ''}`}
                      >
                         {mode === "bonus" ? (
                             <span className="text-xl font-bold text-foreground">{option.name}</span>
                         ) : missingColorMode ? (
                             /* Missing Color Mode: Show single color swatch */
                             <div 
                                className="w-24 h-24 rounded-full shadow-sm border border-black/5"
                                style={{ backgroundColor: option.colors?.[0] }}
                             />
                         ) : (
                             /* Standard Easy Mode: Multi Color Support */
                             <div className="flex w-full h-full">
                                {option.colors && option.colors.map((color, colorIdx) => (
                                    <div 
                                        key={colorIdx} 
                                        className="flex-1 h-full transition-colors duration-300" 
                                        style={{ backgroundColor: color }} 
                                    />
                                ))}
                             </div>
                         )}

                         {/* Feedback Overlay */}
                         <AnimatePresence>
                         {hasSubmitted && isCorrect && (
                           <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center z-10"
                           >
                             <div className="bg-white rounded-full p-3 shadow-xl">
                                <Check className="w-8 h-8 text-green-600" />
                             </div>
                           </motion.div>
                         )}
                         {hasSubmitted && isSelected && !isCorrect && (
                           <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center z-10"
                           >
                             <div className="bg-white rounded-full p-3 shadow-xl">
                                <X className="w-8 h-8 text-red-500" />
                             </div>
                           </motion.div>
                         )}
                         </AnimatePresence>
                      </motion.button>
                    );
                })}
              </div>

              {/* Feedback Message for Easy Mode & Bonus */}
              {hasSubmitted && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-secondary/50 rounded-lg p-6 border border-border text-center"
                >
                    <div className="flex flex-col items-center gap-2">
                        {/* Determine correctness for feedback message logic */}
                        {(() => {
                             let isSelectedCorrect = false;
                             if (mode === "bonus") {
                                 isSelectedCorrect = !!selectedOption && selectedOption.id === brand.id;
                             } else if (missingColorMode) {
                                 isSelectedCorrect = !!selectedOption && selectedOption.colors?.[0] === targetColor;
                             } else {
                                 const correctColors = [brand.hex];
                                 if (!forceSingleColor) {
                                     if (brand.extraColors && brand.extraColors.length > 0) {
                                         correctColors.push(...brand.extraColors);
                                     } else if (brand.secondaryHex) {
                                         correctColors.push(brand.secondaryHex);
                                     }
                                 }
                                 isSelectedCorrect = !!selectedOption && JSON.stringify(selectedOption.colors) === JSON.stringify(correctColors);
                             }
                             
                             return isSelectedCorrect ? (
                                <div className="flex items-center gap-2 text-green-600 font-bold text-xl">
                                    <Check className="w-6 h-6" /> Correct!
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-red-500 font-bold text-xl">
                                    <X className="w-6 h-6" /> Incorrect
                                </div>
                            );
                        })()}
                        
                        {brand.trivia && mode !== "bonus" && (
                            <div className="mt-2 space-y-1">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Did you know?</span>
                                <p className="text-foreground max-w-md mx-auto">{brand.trivia}</p>
                            </div>
                        )}
                    </div>
                </motion.div>
              )}
              </>
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
                        background: `linear-gradient(to right, ${hardModeGradient.start} 0%, ${brand.hex} ${targetPosition}%, ${hardModeGradient.end} 100%)` 
                      }} 
                   />
                </div>

                <div className="px-4 max-w-lg mx-auto relative">
                    <Slider 
                      value={[sliderValue]} 
                      onValueChange={handleSliderChange} 
                      max={100} 
                      step={0.1}
                      disabled={hasSubmitted}
                      className="cursor-pointer"
                    />
                    
                    {/* Correct Position Marker */}
                    {hasSubmitted && (
                       <div className="absolute top-0 w-full px-0 left-0 h-5 pointer-events-none">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg z-10"
                                style={{ left: `calc(${targetPosition}% - 8px)` }}
                            />
                             <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="absolute top-6 -translate-x-1/2 text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full whitespace-nowrap"
                                style={{ left: `${targetPosition}%` }}
                            >
                                Correct
                            </motion.div>
                       </div>
                    )}

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
                        
                        {brand.trivia && (
                            <div className="bg-primary/5 p-3 rounded text-xs text-muted-foreground mt-2 border border-primary/10">
                                <span className="font-bold text-primary block mb-1">Did you know?</span>
                                {brand.trivia}
                            </div>
                        )}

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
