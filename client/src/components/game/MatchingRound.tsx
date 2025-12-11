import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brand } from "@/data/brands";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, RefreshCw, Undo2 } from "lucide-react";
import confetti from "canvas-confetti";

interface MatchingRoundProps {
  brands: Brand[];
  onComplete: (score: number) => void;
  colorFamilyName: string; // e.g. "Red", "Blue"
}

export function MatchingRound({ brands, onComplete, colorFamilyName }: MatchingRoundProps) {
  const [assignments, setAssignments] = useState<{ [key: string]: string }>({}); // brandId -> hex
  const [shuffledColors, setShuffledColors] = useState<string[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Shuffle colors on mount
    const colors = brands.map(b => b.hex);
    setShuffledColors([...colors].sort(() => Math.random() - 0.5));
  }, [brands]);

  const handleColorSelect = (hex: string) => {
    if (hasSubmitted) return;

    // Find the first brand without an assignment
    const firstUnassigned = brands.find(b => !assignments[b.id]);
    
    if (firstUnassigned) {
      setAssignments(prev => ({
        ...prev,
        [firstUnassigned.id]: hex
      }));
    }
  };

  const handleRemoveAssignment = (brandId: string) => {
    if (hasSubmitted) return;
    
    const newAssignments = { ...assignments };
    delete newAssignments[brandId];
    setAssignments(newAssignments);
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    
    // Calculate Score
    let correctCount = 0;
    brands.forEach(brand => {
        if (assignments[brand.id] === brand.hex) {
            correctCount++;
        }
    });

    // Score: 100 points per correct match
    const finalScore = correctCount * 100;
    setScore(finalScore);

    if (correctCount === brands.length) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
    }
  };

  // Get colors that are NOT currently assigned to any brand
  const availableColors = shuffledColors.filter(hex => 
    !Object.values(assignments).includes(hex)
  );

  const allAssigned = brands.every(b => assignments[b.id]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl shadow-xl overflow-hidden p-8 md:p-12"
      >
        <div className="text-center mb-8 space-y-2">
            <h2 className="text-3xl font-display font-bold">Match the {colorFamilyName}s</h2>
            <p className="text-muted-foreground">
                {hasSubmitted 
                    ? `You got ${score / 100} out of ${brands.length} correct!` 
                    : "Fill all the slots to submit your answers."}
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative max-w-5xl mx-auto items-start">
            {/* Brands Column (Slots) */}
            <div className="space-y-4">
                {brands.map((brand) => {
                    const assignedHex = assignments[brand.id];
                    const isCorrect = hasSubmitted && assignedHex === brand.hex;
                    const isWrong = hasSubmitted && assignedHex !== brand.hex;

                    return (
                        <div key={brand.id} className="flex items-center gap-4">
                            {/* Brand Name */}
                            <div className="flex-1 text-right font-bold text-lg">
                                {brand.name}
                            </div>
                            
                            {/* Slot */}
                            <motion.button
                                layout
                                onClick={() => assignedHex && handleRemoveAssignment(brand.id)}
                                disabled={!assignedHex || hasSubmitted}
                                className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center relative overflow-hidden transition-all shadow-sm ${
                                    assignedHex 
                                        ? 'border-transparent cursor-pointer hover:opacity-80' 
                                        : 'border-dashed border-border bg-secondary/20'
                                }`}
                                style={{ backgroundColor: assignedHex || 'transparent' }}
                            >
                                {!assignedHex && <div className="w-2 h-2 rounded-full bg-border" />}
                                
                                {/* Feedback Overlay */}
                                {hasSubmitted && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        {isCorrect ? (
                                            <Check className="w-8 h-8 text-white drop-shadow-md" />
                                        ) : (
                                            <X className="w-8 h-8 text-white drop-shadow-md" />
                                        )}
                                    </div>
                                )}
                            </motion.button>
                            
                            {/* Correct Answer Reveal (if wrong) */}
                            <div className="w-8 flex items-center justify-center">
                                {isWrong && (
                                    <div 
                                        className="w-6 h-6 rounded-full border border-white shadow-sm ring-1 ring-black/5" 
                                        style={{ backgroundColor: brand.hex }}
                                        title="Correct Answer"
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Colors Pool */}
            <div className="bg-secondary/20 rounded-2xl p-6 border border-border/50">
                 <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 text-center">
                    {hasSubmitted ? "Round Complete" : "Available Colors"}
                 </h3>
                 
                 {!hasSubmitted ? (
                     <div className="grid grid-cols-3 gap-4">
                        <AnimatePresence>
                        {availableColors.map((hex) => (
                            <motion.button
                                key={hex}
                                layoutId={hex}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleColorSelect(hex)}
                                className="w-16 h-16 rounded-xl shadow-sm border-2 border-white ring-1 ring-black/5 cursor-pointer"
                                style={{ backgroundColor: hex }}
                            />
                        ))}
                        </AnimatePresence>
                        
                        {availableColors.length === 0 && (
                            <div className="col-span-3 py-8 text-center text-muted-foreground text-sm italic">
                                All colors placed!
                            </div>
                        )}
                     </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-4 py-8">
                        <div className="text-4xl font-bold">
                            {score} <span className="text-lg text-muted-foreground font-normal">pts</span>
                        </div>
                        <Button size="lg" onClick={() => onComplete(score)} className="w-full rounded-full">
                            Next Level <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                 )}
            </div>
        </div>

        {!hasSubmitted && (
            <div className="mt-8 flex justify-center">
                <Button 
                    size="lg" 
                    onClick={handleSubmit} 
                    disabled={!allAssigned}
                    className="px-12 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                    Check Matches
                </Button>
            </div>
        )}
      </motion.div>
    </div>
  );
}