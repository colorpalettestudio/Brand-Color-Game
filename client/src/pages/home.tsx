import { useState } from "react";
import { GameCard } from "@/components/game/GameCard";
import { brands } from "@/data/brands";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Palette, Grid3X3, RefreshCw } from "lucide-react";

export default function Home() {
  const [gameState, setGameState] = useState<"start" | "playing" | "end">("start");
  const [mode, setMode] = useState<"easy" | "hard">("easy");
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameBrands, setGameBrands] = useState(brands);

  const startGame = (selectedMode: "easy" | "hard") => {
    setMode(selectedMode);
    // Shuffle and pick 5 brands for a quick game
    const shuffled = [...brands].sort(() => Math.random() - 0.5).slice(0, 5);
    setGameBrands(shuffled);
    setCurrentRound(0);
    setScore(0);
    setGameState("playing");
  };

  const handleRoundComplete = (points: number) => {
    setScore(prev => prev + points);
    
    if (currentRound < gameBrands.length - 1) {
      setCurrentRound(prev => prev + 1);
    } else {
      setGameState("end");
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
            <div className="font-mono text-sm bg-secondary px-4 py-1 rounded-full">
                Round {currentRound + 1}/{gameBrands.length} • Score: {score}
            </div>
        )}
      </header>

      <main className="w-full max-w-4xl z-10">
        {gameState === "start" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-12"
          >
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter text-foreground">
                Do you know your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">colors?</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Test your designer eye by matching iconic brands to their official hex codes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <button 
                onClick={() => startGame("easy")}
                className="group relative overflow-hidden bg-card hover:bg-secondary/50 border border-border p-8 rounded-2xl text-left transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Grid3X3 className="w-24 h-24" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-2">Easy Mode</h3>
                <p className="text-muted-foreground">Multiple choice. Pick the correct color from 3 options.</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
                    Start Easy <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              <button 
                onClick={() => startGame("hard")}
                className="group relative overflow-hidden bg-foreground text-background border border-foreground p-8 rounded-2xl text-left transition-all hover:shadow-xl hover:-translate-y-1"
              >
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-white">
                    <Palette className="w-24 h-24" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-2">Hard Mode</h3>
                <p className="text-background/70">Spectrum slider. Find the exact hex code on a gradient.</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium">
                    Start Hard <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {gameState === "playing" && (
          <GameCard 
            key={gameBrands[currentRound].id} // Force re-render on new round
            brand={gameBrands[currentRound]}
            mode={mode}
            onComplete={handleRoundComplete}
          />
        )}

        {gameState === "end" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 bg-card border border-border p-12 rounded-3xl shadow-2xl max-w-xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                <Trophy className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
                <h2 className="text-4xl font-display font-bold">Game Over!</h2>
                <p className="text-muted-foreground">You scored</p>
                <div className="text-6xl font-bold font-mono my-4">
                    {score} <span className="text-2xl text-muted-foreground font-sans font-normal">/ {gameBrands.length * 100}</span>
                </div>
            </div>

            <div className="flex justify-center gap-4 pt-8">
                <Button variant="outline" size="lg" onClick={() => setGameState("start")}>
                    Back to Menu
                </Button>
                <Button size="lg" onClick={() => startGame(mode)} className="gap-2">
                    <RefreshCw className="w-4 h-4" /> Play Again
                </Button>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="absolute bottom-4 text-center w-full text-xs text-muted-foreground opacity-50">
        Designed for designers.
      </footer>
    </div>
  );
}
