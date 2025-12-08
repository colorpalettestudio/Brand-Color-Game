import { useState } from "react";
import { GameCard } from "@/components/game/GameCard";
import { brands, Brand } from "@/data/brands";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Trophy, Palette, Play, Info, Layers, Sliders } from "lucide-react";

export default function Home() {
  const [gameState, setGameState] = useState<"start" | "level-intro" | "playing" | "end">("start");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentMode, setCurrentMode] = useState<"easy" | "hard">("easy");
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  
  // Game phases
  const [level1Brands, setLevel1Brands] = useState<Brand[]>([]); // Single Color
  const [level2Brands, setLevel2Brands] = useState<Brand[]>([]); // Dual Color
  const [level3Brands, setLevel3Brands] = useState<Brand[]>([]); // Slider Challenge
  
  // Current active list of brands being played
  const [activeBrands, setActiveBrands] = useState<Brand[]>([]);

  const startGame = () => {
    // 1. Separate brands
    const singleColor = brands.filter(b => !b.secondaryHex);
    const dualColor = brands.filter(b => b.secondaryHex);
    
    // 2. Shuffle
    const shuffledSingle = [...singleColor].sort(() => Math.random() - 0.5);
    const shuffledDual = [...dualColor].sort(() => Math.random() - 0.5);
    const shuffledAll = [...brands].sort(() => Math.random() - 0.5); // For hard mode

    // 3. Define Levels (5 rounds each)
    const lvl1 = shuffledSingle.slice(0, 5);
    const lvl2 = shuffledDual.slice(0, 5);
    // For level 3, we prefer single color brands for the slider as dual color sliders are tricky UI-wise
    // So let's pick from the remaining single color brands + some used ones if we run out
    const remainingSingle = shuffledSingle.slice(5); 
    const lvl3 = [...remainingSingle, ...shuffledSingle.slice(0, 5 - remainingSingle.length)].slice(0, 5);
    
    setLevel1Brands(lvl1);
    setLevel2Brands(lvl2);
    setLevel3Brands(lvl3);
    
    setScore(0);
    startLevel(1, lvl1);
  };

  const startLevel = (level: number, roundBrands: Brand[]) => {
    setCurrentLevel(level);
    setActiveBrands(roundBrands);
    
    // Determine mode based on level
    // Level 1 & 2 = Easy (Multiple Choice)
    // Level 3 = Hard (Slider)
    setCurrentMode(level === 3 ? "hard" : "easy");
    
    setCurrentRound(0);
    setGameState("level-intro");
  };

  const handleRoundComplete = (points: number) => {
    setScore(prev => prev + points);
    
    if (currentRound < activeBrands.length - 1) {
      setCurrentRound(prev => prev + 1);
    } else {
      // Level complete
      if (currentLevel === 1) {
        startLevel(2, level2Brands);
      } else if (currentLevel === 2) {
        startLevel(3, level3Brands);
      } else {
        setGameState("end");
      }
    }
  };

  const startNextLevel = () => {
    setGameState("playing");
  };

  const getLevelInfo = (level: number) => {
      switch(level) {
          case 1: return { 
              title: "Level 1: Single Color", 
              desc: "Identify the primary brand color.", 
              icon: <Palette className="w-10 h-10" />,
              color: "bg-blue-100 text-blue-600"
          };
          case 2: return { 
              title: "Level 2: Dual Colors", 
              desc: "Match the correct pair of brand colors.", 
              icon: <Layers className="w-10 h-10" />,
              color: "bg-purple-100 text-purple-600"
          };
          case 3: return { 
              title: "Level 3: Color Perfect", 
              desc: "Use the slider to match the exact hex code.", 
              icon: <Sliders className="w-10 h-10" />,
              color: "bg-orange-100 text-orange-600"
          };
          default: return { title: "", desc: "", icon: null, color: "" };
      }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 font-display font-bold text-xl tracking-tight">
          <Palette className="w-6 h-6" />
          <span>ChromaBrand</span>
        </div>
        {gameState === "playing" && (
            <div className="flex items-center gap-4">
                <div className="font-mono text-sm bg-secondary px-4 py-1 rounded-full border border-border">
                    Level {currentLevel}/3 • Round {currentRound + 1}/5
                </div>
                <div className="font-mono text-sm bg-primary text-primary-foreground px-4 py-1 rounded-full">
                    Score: {score}
                </div>
            </div>
        )}
      </header>

      <main className="w-full max-w-4xl z-10 relative">
        <AnimatePresence mode="wait">
        {gameState === "start" && (
          <motion.div 
            key="start"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-12"
          >
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter text-foreground">
                Do you know your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">colors?</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Test your designer eye by matching iconic brands to their official hex codes across 3 increasingly difficult levels.
              </p>
            </div>

            <div className="flex justify-center">
              <Button size="lg" onClick={startGame} className="h-16 px-12 text-xl rounded-full gap-3 shadow-xl hover:scale-105 transition-transform">
                Start Game <Play className="w-6 h-6 fill-current" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left text-sm text-muted-foreground bg-card/50 p-6 rounded-2xl border border-border/50">
               <div className="flex flex-col gap-3 p-4 rounded-xl hover:bg-white/50 transition-colors">
                  <div className="bg-blue-100 p-2 rounded-lg w-fit text-blue-700">
                     <Palette className="w-5 h-5" />
                  </div>
                  <div>
                      <span className="font-bold text-foreground block text-lg mb-1">Level 1</span>
                      <span className="font-medium text-foreground">Single Colors</span>
                      <p className="mt-1">Pick the correct primary brand color.</p>
                  </div>
               </div>
               <div className="flex flex-col gap-3 p-4 rounded-xl hover:bg-white/50 transition-colors">
                  <div className="bg-purple-100 p-2 rounded-lg w-fit text-purple-700">
                     <Layers className="w-5 h-5" />
                  </div>
                  <div>
                      <span className="font-bold text-foreground block text-lg mb-1">Level 2</span>
                      <span className="font-medium text-foreground">Dual Colors</span>
                      <p className="mt-1">Match the correct color pairings.</p>
                  </div>
               </div>
               <div className="flex flex-col gap-3 p-4 rounded-xl hover:bg-white/50 transition-colors">
                  <div className="bg-orange-100 p-2 rounded-lg w-fit text-orange-700">
                     <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                      <span className="font-bold text-foreground block text-lg mb-1">Level 3</span>
                      <span className="font-medium text-foreground">Slider Challenge</span>
                      <p className="mt-1">Find the exact hex on a spectrum.</p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {gameState === "level-intro" && (
             <motion.div 
                key="intro"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center space-y-6 max-w-md mx-auto bg-card p-12 rounded-3xl border border-border shadow-2xl"
             >
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${getLevelInfo(currentLevel).color}`}>
                    {getLevelInfo(currentLevel).icon}
                </div>
                <div>
                    <h2 className="text-3xl font-bold font-display mb-2">
                        {getLevelInfo(currentLevel).title}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        {getLevelInfo(currentLevel).desc}
                    </p>
                </div>
                <Button onClick={startNextLevel} size="lg" className="w-full rounded-full">
                    Start Level {currentLevel}
                </Button>
             </motion.div>
        )}

        {gameState === "playing" && (
          <GameCard 
            key={`${currentLevel}-${activeBrands[currentRound].id}`}
            brand={activeBrands[currentRound]}
            mode={currentMode}
            onComplete={handleRoundComplete}
          />
        )}

        {gameState === "end" && (
          <motion.div 
            key="end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 bg-card border border-border p-12 rounded-3xl shadow-2xl max-w-xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-yellow-100 text-yellow-600 mb-4 animate-bounce">
                <Trophy className="w-12 h-12" />
            </div>
            
            <div className="space-y-2">
                <h2 className="text-4xl font-display font-bold">Design Master!</h2>
                <p className="text-muted-foreground">You completed all 3 levels.</p>
                
                <div className="py-6 space-y-2">
                    <p className="text-sm uppercase tracking-widest text-muted-foreground">Final Score</p>
                    <div className="text-7xl font-bold font-mono tracking-tight text-foreground">
                        {score}
                    </div>
                    <p className="text-sm text-muted-foreground">out of 1500 possible points</p>
                </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
                <Button size="lg" onClick={startGame} className="gap-2 px-8 rounded-full">
                    Play Again
                </Button>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      <footer className="absolute bottom-4 text-center w-full text-xs text-muted-foreground opacity-50">
        Designed for designers.
      </footer>
    </div>
  );
}
