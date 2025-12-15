import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brand } from "@/data/brands";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

interface MatchingRoundProps {
  brands: Brand[];
  onComplete: (score: number) => void;
  onScoreUpdate: (points: number) => void;
  colorFamilyName: string; // e.g. "Red", "Blue"
}

// Draggable Color Component
function DraggableColor({ hex, id }: { hex: string; id: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: { hex, type: 'color' },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`w-16 h-16 rounded-xl shadow-sm border-2 border-white ring-1 ring-black/5 cursor-grab active:cursor-grabbing touch-none ${isDragging ? 'opacity-0' : ''}`}
    >
        <div className="w-full h-full rounded-lg" style={{ backgroundColor: hex }} />
    </div>
  );
}

// Droppable Slot Component
function DroppableSlot({ 
  brand, 
  assignedHex, 
  isCorrect, 
  isWrong, 
  hasSubmitted, 
  onRemove 
}: { 
  brand: Brand; 
  assignedHex?: string; 
  isCorrect?: boolean; 
  isWrong?: boolean; 
  hasSubmitted: boolean; 
  onRemove: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: brand.id,
    data: { brandId: brand.id, type: 'slot' },
    disabled: hasSubmitted || !!assignedHex
  });

  return (
    <div className="flex items-center gap-4">
        {/* Brand Name */}
        <div className="flex-1 text-right font-bold text-lg">
            {brand.name}
        </div>
        
        {/* Slot */}
        <div
            ref={setNodeRef}
            className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center relative overflow-hidden transition-all shadow-sm ${
                assignedHex 
                    ? 'border-transparent' 
                    : isOver
                        ? 'border-primary bg-primary/10 scale-105'
                        : 'border-dashed border-border bg-secondary/20'
            }`}
        >
            {assignedHex ? (
                <div 
                    onClick={() => !hasSubmitted && onRemove(brand.id)}
                    className={`w-full h-full cursor-pointer hover:opacity-80 transition-opacity relative group`}
                    style={{ backgroundColor: assignedHex }}
                >
                     {/* Hover to remove indicator (desktop) */}
                    {!hasSubmitted && (
                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                             <X className="text-white w-6 h-6" />
                         </div>
                    )}
                </div>
            ) : (
                <div className="w-2 h-2 rounded-full bg-border pointer-events-none" />
            )}

            {/* Feedback Overlay */}
            {hasSubmitted && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                    {isCorrect ? (
                        <Check className="w-8 h-8 text-white drop-shadow-md" />
                    ) : (
                        <X className="w-8 h-8 text-white drop-shadow-md" />
                    )}
                </div>
            )}
        </div>
        
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
}

export function MatchingRound({ brands, onComplete, onScoreUpdate, colorFamilyName }: MatchingRoundProps) {
  const [assignments, setAssignments] = useState<{ [key: string]: string }>({}); // brandId -> hex
  const [shuffledColors, setShuffledColors] = useState<{id: string, hex: string}[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8, // Require 8px movement before drag starts prevents accidental clicks
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Shuffle colors on mount
    const colors = brands.map((b, i) => ({ id: `color-${i}-${b.hex}`, hex: b.hex }));
    setShuffledColors([...colors].sort(() => Math.random() - 0.5));
  }, [brands]);

  const handleDragStart = (event: any) => {
    if (hasSubmitted) return;
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    if (hasSubmitted) return;

    const { active, over } = event;

    if (over && active.data.current?.hex) {
        // Dropped on a slot
        const brandId = over.id;
        const hex = active.data.current.hex;
        
        // Assign color to brand
        setAssignments(prev => ({
            ...prev,
            [brandId]: hex
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

    // Update global score immediately
    onScoreUpdate(finalScore);

    if (correctCount === brands.length) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
    }
  };

  // Get colors that are NOT currently assigned to any brand
  const availableColorItems = shuffledColors.filter(item => 
    !Object.values(assignments).includes(item.hex)
  );

  const allAssigned = brands.every(b => assignments[b.id]);
  
  // Find active drag item data for overlay
  const activeItem = shuffledColors.find(c => c.id === activeId);

  return (
    <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
    >
        <div className="w-full max-w-4xl mx-auto p-6">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl shadow-xl overflow-hidden p-8 md:p-12 select-none"
        >
            <div className="text-center mb-8 space-y-2">
                <h2 className="text-3xl font-display font-bold">Match the {colorFamilyName}s</h2>
                <p className="text-muted-foreground">
                    {hasSubmitted 
                        ? `You got ${score / 100} out of ${brands.length} correct!` 
                        : "Drag colors to their matching brands."}
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
                            <DroppableSlot 
                                key={brand.id}
                                brand={brand}
                                assignedHex={assignedHex}
                                isCorrect={isCorrect}
                                isWrong={isWrong}
                                hasSubmitted={hasSubmitted}
                                onRemove={handleRemoveAssignment}
                            />
                        );
                    })}
                </div>

                {/* Colors Pool */}
                <div className="bg-secondary/20 rounded-2xl p-6 border border-border/50 min-h-[300px]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 text-center">
                        {hasSubmitted ? "Round Complete" : "Available Colors"}
                    </h3>
                    
                    {!hasSubmitted ? (
                        <div className="grid grid-cols-3 gap-4">
                            {availableColorItems.map((item) => (
                                <DraggableColor 
                                    key={item.id} 
                                    id={item.id} 
                                    hex={item.hex} 
                                />
                            ))}
                            
                            {availableColorItems.length === 0 && (
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
                            <Button size="lg" onClick={() => onComplete(0)} className="w-full rounded-full">
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
        
        <DragOverlay>
            {activeId && activeItem ? (
                 <div className="w-16 h-16 rounded-xl shadow-2xl border-2 border-white ring-1 ring-black/10 cursor-grabbing scale-110 rotate-3" style={{ backgroundColor: activeItem.hex }} />
            ) : null}
        </DragOverlay>
        </div>
    </DndContext>
  );
}