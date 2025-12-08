import { useState } from "react";
import { GameCard } from "@/components/game/GameCard";
import { brands } from "@/data/brands";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Trophy, Palette, Play, Info } from "lucide-react";

export default function Home() {
  const [gameState, setGameState] = useState<"start" | "level-intro" | "playing" | "end">("start");
  const [currentMode, setCurrentMode] = useState<"easy" | "hard">("easy");
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  
  // We'll split the game into 2 phases: 5 rounds easy, 5 rounds hard
  const [easyBrands, setEasyBrands] = useState(brands.slice(0, 5));
  const [hardBrands, setHardBrands] = useState(brands.slice(5, 10));
  
  // Current active list of brands being played
  const [activeBrands, setActiveBrands] = useState(easyBrands);

  const startGame = () => {
    // Shuffle all brands first
    const shuffled = [...brands].sort(() => Math.random() - 0.5);
    const phase1 = shuffled.slice(0, 5);
    const phase2 = shuffled.slice(5, 10);
    
    setEasyBrands(phase1);
    setHardBrands(phase2);
    
    setScore(0);
    startPhase("easy", phase1);
  };

  const startPhase = (mode: "easy" | "hard", roundBrands: typeof brands) => {
    setCurrentMode(mode);
    setActiveBrands(roundBrands);
    setCurrentRound(0);
    setGameState("level-intro");
  };

  const handleRoundComplete = (points: number) => {
    setScore(prev => prev + points);
    
    if (currentRound < activeBrands.length - 1) {
      setCurrentRound(prev => prev + 1);
    } else {
      // Phase complete
      if (currentMode === "easy") {
        // Move to hard mode
        startPhase("hard", hardBrands);
      } else {
        // Game complete
        setGameState("end");
      }
    }
  };

  const startNextLevel = () => {
    setGameState("playing");
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
                    {currentMode === 'easy' ? 'Level 1' : 'Level 2'} • Round {currentRound + 1}/5
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
                Test your designer eye by matching iconic brands to their official hex codes.
                Progress from Easy to Hard mode and set the high score.
              </p>
            </div>

            <div className="flex justify-center">
              <Button size="lg" onClick={startGame} className="h-16 px-12 text-xl rounded-full gap-3 shadow-xl hover:scale-105 transition-transform">
                Start Game <Play className="w-6 h-6 fill-current" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto text-left text-sm text-muted-foreground bg-card/50 p-6 rounded-2xl border border-border/50">
               <div className="flex gap-3">
                  <div className="bg-green-100 p-2 rounded-lg h-fit text-green-700">
                     <span className="font-bold block text-lg">Lvl 1</span>
                  </div>
                  <div>
                      <span className="font-bold text-foreground block">Easy Mode</span>
                      Multiple choice. Pick the right color from 3 options.
                  </div>
               </div>
               <div className="flex gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg h-fit text-orange-700">
                     <span className="font-bold block text-lg">Lvl 2</span>
                  </div>
                  <div>
                      <span className="font-bold text-foreground block">Hard Mode</span>
                      Spectrum slider. Find the exact hex code on a gradient.
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
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${currentMode === 'easy' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {currentMode === 'easy' ? <Info className="w-10 h-10" /> : <Palette className="w-10 h-10" />}
                </div>
                <div>
                    <h2 className="text-3xl font-bold font-display mb-2">
                        {currentMode === 'easy' ? 'Level 1: Warm Up' : 'Level 2: Expert Eye'}
                    </h2>
                    <p className="text-muted-foreground">
                        {currentMode === 'easy' 
                            ? "Let's start simple. Choose the correct brand color from 3 options." 
                            : "Things are getting real. Use the slider to find the exact hex code match."}
                    </p>
                </div>
                <Button onClick={startNextLevel} size="lg" className="w-full rounded-full">
                    Ready!
                </Button>
             </motion.div>
        )}

        {gameState === "playing" && (
          <GameCard 
            key={`${currentMode}-${activeBrands[currentRound].id}`}
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
                <p className="text-muted-foreground">You completed all levels.</p>
                
                <div className="py-6 space-y-2">
                    <p className="text-sm uppercase tracking-widest text-muted-foreground">Final Score</p>
                    <div className="text-7xl font-bold font-mono tracking-tight text-foreground">
                        {score}
                    </div>
                    <p className="text-sm text-muted-foreground">out of 1000 possible points</p>
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
