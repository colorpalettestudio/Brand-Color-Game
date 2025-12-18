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
      className={`w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl shadow-sm border-2 border-white ring-1 ring-black/5 cursor-grab active:cursor-grabbing touch-none ${isDragging ? 'opacity-0' : ''}`}
    >
        <div className="w-full h-full rounded-md md:rounded-lg" style={{ backgroundColor: hex }} />
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
    <div className="flex items-center gap-2 md:gap-4">
        {/* Brand Name */}
        <div className="flex-1 text-right font-bold text-sm md:text-lg">
            {brand.name}
        </div>
        
        {/* Slot */}
        <div
            ref={setNodeRef}
            className={`w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl border-2 flex items-center justify-center relative overflow-hidden transition-all shadow-sm ${
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
                     {/* Always show remove X on mobile/touch, hover on desktop */}
                    {!hasSubmitted && (
                         <div className="absolute inset-0 bg-black/10 md:bg-black/20 md:opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                             <X className="text-white w-4 h-4 md:w-6 md:h-6 drop-shadow-md" />
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

interface Assignment {
  hex: string;
  sourceId: string;
}

export function MatchingRound({ brands, onComplete, onScoreUpdate, colorFamilyName }: MatchingRoundProps) {
  const [assignments, setAssignments] = useState<{ [key: string]: Assignment }>({}); // brandId -> { hex, sourceId }
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
        const sourceId = active.id;
        
        // Assign color to brand
        setAssignments(prev => ({
            ...prev,
            [brandId]: { hex, sourceId }
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
        if (assignments[brand.id]?.hex === brand.hex) {
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

  // Get colors that are NOT currently assigned to any brand (filter by ID)
  const assignedSourceIds = Object.values(assignments).map(a => a.sourceId);
  const availableColorItems = shuffledColors.filter(item => 
    !assignedSourceIds.includes(item.id)
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
        <div className="w-full max-w-4xl mx-auto p-2 md:p-4 h-full flex flex-col justify-center min-h-0">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl shadow-xl overflow-hidden p-4 md:p-6 lg:p-12 select-none flex flex-col h-full md:h-auto max-h-full shrink-1"
        >
            <div className="text-center mb-2 md:mb-4 lg:mb-8 space-y-1 md:space-y-2 shrink-0">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-display font-bold">Match the {colorFamilyName}s</h2>
                <p className="text-xs md:text-sm lg:text-base text-muted-foreground">
                    {hasSubmitted 
                        ? `You got ${score / 100} out of ${brands.length} correct!` 
                        : "Drag colors to their matching brands."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 relative max-w-5xl mx-auto items-start overflow-y-auto flex-1 md:overflow-visible">
                {/* Brands Column (Slots) */}
                <div className="space-y-2 md:space-y-4">
                    {brands.map((brand) => {
                        const assignment = assignments[brand.id];
                        const assignedHex = assignment?.hex;
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
                <div className="bg-secondary/20 rounded-2xl p-3 md:p-6 border border-border/50 min-h-[100px] md:min-h-[300px]">
                    <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 md:mb-4 text-center">
                        {hasSubmitted ? "Round Complete" : "Available Colors"}
                    </h3>
                    
                    {!hasSubmitted ? (
                        <div className="flex flex-wrap justify-center gap-2 md:grid md:grid-cols-3 md:gap-4">
                            {availableColorItems.map((item) => (
                                <DraggableColor 
                                    key={item.id} 
                                    id={item.id} 
                                    hex={item.hex} 
                                />
                            ))}
                            
                            {availableColorItems.length === 0 && (
                                <div className="col-span-3 py-4 md:py-8 text-center text-muted-foreground text-xs md:text-sm italic">
                                    All colors placed!
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full space-y-4 py-4 md:py-8">
                            <div className="text-2xl md:text-4xl font-bold">
                                {score} <span className="text-sm md:text-lg text-muted-foreground font-normal">pts</span>
                            </div>
                            <Button onClick={() => onComplete(0)} className="w-full rounded-full h-10 md:h-14 text-sm md:text-lg">
                                Next Level <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {!hasSubmitted && (
                <div className="mt-4 md:mt-8 flex justify-center pb-4 md:pb-0">
                    <Button 
                        onClick={handleSubmit} 
                        disabled={!allAssigned}
                        className="px-8 md:px-12 py-4 md:py-6 h-12 md:h-16 text-base md:text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
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