import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brand } from "@/data/brands";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";

interface MatchingRoundProps {
  brands: Brand[];
  onComplete: (score: number) => void;
  colorFamilyName: string; // e.g. "Red", "Blue"
}

export function MatchingRound({ brands, onComplete, colorFamilyName }: MatchingRoundProps) {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [matches, setMatches] = useState<{ [key: string]: string }>({}); // brandId -> hex
  const [shuffledColors, setShuffledColors] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [wrongMatches, setWrongMatches] = useState<string[]>([]); // Array of brandIds that were wrongly matched temporarily

  useEffect(() => {
    // Shuffle colors on mount
    const colors = brands.map(b => b.hex);
    setShuffledColors([...colors].sort(() => Math.random() - 0.5));
  }, [brands]);

  const handleBrandClick = (brand: Brand) => {
    if (matches[brand.id]) return; // Already matched
    setSelectedBrand(brand);
    setWrongMatches([]); // Clear error state on new selection
  };

  const handleColorClick = (hex: string) => {
    if (!selectedBrand) return;
    
    // Check if this color is already matched to another brand (unless we want to allow re-matching, but simple is best)
    if (Object.values(matches).includes(hex)) return;

    // Check match
    const isCorrect = selectedBrand.hex === hex;
    setAttempts(prev => prev + 1);

    if (isCorrect) {
      setMatches(prev => ({ ...prev, [selectedBrand.id]: hex }));
      setSelectedBrand(null);

      // Check if all matched
      if (Object.keys(matches).length + 1 === brands.length) {
        handleAllMatched();
      }
    } else {
        // Wrong match feedback
        setWrongMatches([selectedBrand.id]);
        setTimeout(() => setWrongMatches([]), 500);
    }
  };

  const handleAllMatched = () => {
    setCompleted(true);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
  };

  // Calculate score: Max 500. Deduct 50 for every wrong attempt beyond the minimum 5.
  // Minimum attempts = 5.
  // Score = 500 - ((attempts - 5) * 50)
  // Min score = 0
  const getScore = () => {
      const penalties = Math.max(0, attempts - 5);
      return Math.max(0, 500 - (penalties * 50));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl shadow-xl overflow-hidden p-8 md:p-12"
      >
        <div className="text-center mb-8 space-y-2">
            <h2 className="text-3xl font-display font-bold">Match the {colorFamilyName}s</h2>
            <p className="text-muted-foreground">Tap a brand on the left, then its matching color on the right.</p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:gap-12 relative max-w-3xl mx-auto">
            {/* Brands Column */}
            <div className="space-y-3">
                {brands.map((brand) => {
                    const isMatched = !!matches[brand.id];
                    const isSelected = selectedBrand?.id === brand.id;
                    const isWrong = wrongMatches.includes(brand.id);

                    return (
                        <motion.button
                            key={brand.id}
                            layout
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleBrandClick(brand)}
                            disabled={isMatched || completed}
                            className={`w-full h-16 px-6 rounded-xl border flex items-center justify-between transition-all relative shadow-sm ${
                                isMatched 
                                    ? 'border-transparent bg-muted/50 text-muted-foreground' 
                                    : isSelected
                                        ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-md'
                                        : isWrong
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-border bg-card hover:border-primary/30 hover:shadow-md'
                            }`}
                        >
                            <span className={`font-medium text-base ${isMatched ? 'line-through decoration-border' : ''}`}>{brand.name}</span>
                            {isMatched && <Check className="w-4 h-4 text-green-600/50" />}
                        </motion.button>
                    );
                })}
            </div>

            {/* Colors Column */}
            <div className="space-y-3">
                {shuffledColors.map((hex, idx) => {
                    const isMatched = Object.values(matches).includes(hex);
                    // Find which brand matched this color
                    const matchedBrandId = Object.keys(matches).find(key => matches[key] === hex);
                    const matchedBrand = brands.find(b => b.id === matchedBrandId);

                    return (
                        <motion.button
                            key={`${hex}-${idx}`}
                            layout
                            whileHover={!isMatched && !completed ? { scale: 1.05 } : {}}
                            whileTap={!isMatched && !completed ? { scale: 0.95 } : {}}
                            onClick={() => handleColorClick(hex)}
                            disabled={isMatched || completed}
                            className={`w-full h-16 rounded-xl shadow-sm border-2 transition-all relative overflow-hidden ${
                                isMatched 
                                    ? 'border-transparent opacity-50 grayscale-[0.5]' 
                                    : selectedBrand
                                        ? 'border-transparent hover:border-primary/50 cursor-pointer shadow-md'
                                        : 'border-transparent'
                            }`}
                            style={{ backgroundColor: hex }}
                        >
                            {isMatched && matchedBrand && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <Check className="w-6 h-6 text-white drop-shadow-md" />
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>

        {completed && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 text-center space-y-4"
            >
                <div className="text-2xl font-bold text-green-600">Perfect Match!</div>
                <div className="text-lg">Score: +{getScore()}</div>
                <Button size="lg" onClick={() => onComplete(getScore())} className="rounded-full px-8">
                    Finish Round <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </motion.div>
        )}
      </motion.div>
    </div>
  );
}
