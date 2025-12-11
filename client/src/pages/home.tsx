import { useState } from "react";
import { GameCard } from "@/components/game/GameCard";
import { MatchingRound } from "@/components/game/MatchingRound";
import { brands, Brand } from "@/data/brands";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Trophy, Palette, Play, Info, Layers, Sliders, Grid3X3, Check } from "lucide-react";

export default function Home() {
  const [gameState, setGameState] = useState<"start" | "level-intro" | "playing" | "end">("start");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentMode, setCurrentMode] = useState<"easy" | "hard" | "match">("easy");
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  
  // Game phases
  const [level1Brands, setLevel1Brands] = useState<Brand[]>([]); // Single Color
  const [level2Brands, setLevel2Brands] = useState<Brand[]>([]); // Dual Color
  const [level3Brands, setLevel3Brands] = useState<Brand[]>([]); // Slider Challenge
  const [level4Brands, setLevel4Brands] = useState<Brand[]>([]); // Matching Round
  const [level4ColorName, setLevel4ColorName] = useState("Color");
  
  // Current active list of brands being played
  const [activeBrands, setActiveBrands] = useState<Brand[]>([]);

  const startGame = () => {
    // 1. Separate brands
    const singleColor = brands.filter(b => !b.secondaryHex);
    const dualColor = brands.filter(b => b.secondaryHex);
    
    // 2. Shuffle
    const shuffledSingle = [...singleColor].sort(() => Math.random() - 0.5);
    const shuffledDual = [...dualColor].sort(() => Math.random() - 0.5);
    
    // 3. Define Levels (5 rounds each)
    const lvl1 = shuffledSingle.slice(0, 5);
    const lvl2 = shuffledDual.slice(0, 5);
    
    // Level 3: Slider
    const remainingSingle = shuffledSingle.slice(5); 
    const lvl3 = [...remainingSingle, ...shuffledSingle.slice(0, 5 - remainingSingle.length)].slice(0, 5);

    // Level 4: Matching Round (Red or Blue family)
    // Simple hex-based proximity check or hardcoded lists
    const redBrands = brands.filter(b => {
        const h = b.hex.replace('#', '');
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b_val = parseInt(h.substring(4, 6), 16);
        return r > 150 && g < 100 && b_val < 100; // Rough "Red" check
    });

    const blueBrands = brands.filter(b => {
        const h = b.hex.replace('#', '');
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b_val = parseInt(h.substring(4, 6), 16);
        return b_val > 150 && r < 100; // Rough "Blue" check
    });

    // Decide which family to use
    const useRed = Math.random() > 0.5;
    let lvl4 = [];
    let familyName = "Blue";

    if (useRed && redBrands.length >= 5) {
        lvl4 = redBrands.sort(() => Math.random() - 0.5).slice(0, 5);
        familyName = "Red";
    } else if (blueBrands.length >= 5) {
        lvl4 = blueBrands.sort(() => Math.random() - 0.5).slice(0, 5);
        familyName = "Blue";
    } else {
        // Fallback to random 5 if detection fails (shouldn't with current data)
        lvl4 = [...brands].sort(() => Math.random() - 0.5).slice(0, 5);
        familyName = "Random";
    }
    
    setLevel1Brands(lvl1);
    setLevel2Brands(lvl2);
    setLevel3Brands(lvl3);
    setLevel4Brands(lvl4);
    setLevel4ColorName(familyName);
    
    setScore(0);
    startLevel(1, lvl1);
  };

  const startLevel = (level: number, roundBrands: Brand[]) => {
    setCurrentLevel(level);
    setActiveBrands(roundBrands);
    
    if (level === 4) {
        setCurrentMode("match");
    } else if (level === 3) {
        setCurrentMode("hard");
    } else {
        setCurrentMode("easy");
    }
    
    setCurrentRound(0);
    setGameState("level-intro");
  };

  const handleRoundComplete = (points: number) => {
    setScore(prev => prev + points);
    
    // If it's the matching mode, it's just one big round
    if (currentMode === 'match') {
         setGameState("end");
         return;
    }

    if (currentRound < activeBrands.length - 1) {
      setCurrentRound(prev => prev + 1);
    } else {
      // Level complete
      if (currentLevel === 1) {
        startLevel(2, level2Brands);
      } else if (currentLevel === 2) {
        startLevel(3, level3Brands);
      } else if (currentLevel === 3) {
        startLevel(4, level4Brands);
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
          case 4: return {
              title: "Level 4: Color Match",
              desc: `Match 5 ${level4ColorName} brands to their exact shade.`,
              icon: <Grid3X3 className="w-10 h-10" />,
              color: "bg-red-100 text-red-600"
          };
          default: return { title: "", desc: "", icon: null, color: "" };
      }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <header className="absolute top-0 left-0 w-full p-6 flex justify-end items-center z-10">
        {gameState === "playing" && (
            <div className="flex items-center gap-4 bg-background/50 backdrop-blur-md p-2 pr-4 rounded-full border border-border/50 shadow-sm">
                <div className="font-bold text-sm text-primary">
                    {score} pts
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-gradient-x bg-[length:200%_200%]">brand colors?</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Test your designer eye by matching iconic brands to their official hex codes across 4 increasingly difficult levels.
              </p>
            </div>

            <div className="flex justify-center">
              <Button size="lg" onClick={startGame} className="h-16 px-12 text-xl rounded-full gap-3 shadow-xl hover:scale-105 transition-transform">
                Start Game <Play className="w-6 h-6 fill-current" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto text-left text-sm text-muted-foreground">
               {/* Level 1 Card */}
               <div className="flex flex-col gap-4 p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 font-display font-bold text-6xl group-hover:opacity-20 transition-opacity">1</div>
                  
                  {/* Visual: 3 Similar Shades */}
                  <div className="h-24 w-full bg-secondary/30 rounded-2xl flex items-center justify-center gap-3 p-4 group-hover:bg-blue-50/50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-blue-500 shadow-sm transform group-hover:scale-110 transition-transform duration-500" />
                      <div className="w-8 h-8 rounded-lg bg-blue-400 shadow-sm transform group-hover:scale-90 transition-transform duration-500 delay-75" />
                      <div className="w-8 h-8 rounded-lg bg-blue-600 shadow-sm transform group-hover:scale-105 transition-transform duration-500 delay-150" />
                  </div>
                  
                  <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Level 1</div>
                      <span className="font-bold text-foreground block text-xl mb-2">Single Color</span>
                      <p className="text-muted-foreground/80 leading-relaxed">Identify the primary brand color from similar shades.</p>
                  </div>
               </div>

               {/* Level 2 Card */}
               <div className="flex flex-col gap-4 p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 font-display font-bold text-6xl group-hover:opacity-20 transition-opacity">2</div>

                  {/* Visual: Split Card */}
                  <div className="h-24 w-full bg-secondary/30 rounded-2xl flex items-center justify-center p-4 group-hover:bg-purple-50/50 transition-colors">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex shadow-sm group-hover:rotate-3 transition-transform duration-500">
                          <div className="w-1/2 h-full bg-purple-600" />
                          <div className="w-1/2 h-full bg-purple-300" />
                      </div>
                  </div>

                  <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">Level 2</div>
                      <span className="font-bold text-foreground block text-xl mb-2">Dual Colors</span>
                      <p className="text-muted-foreground/80 leading-relaxed">Find the correct secondary color pairing.</p>
                  </div>
               </div>

               {/* Level 3 Card */}
               <div className="flex flex-col gap-4 p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 font-display font-bold text-6xl group-hover:opacity-20 transition-opacity">3</div>

                  {/* Visual: Slider Gradient */}
                  <div className="h-24 w-full bg-secondary/30 rounded-2xl flex flex-col items-center justify-center px-6 group-hover:bg-orange-50/50 transition-colors gap-2">
                       <div className="w-full h-4 rounded-full bg-gradient-to-r from-orange-300 via-orange-500 to-red-500 shadow-sm" />
                       <div className="w-full flex justify-center">
                           <div className="w-1 h-3 bg-foreground/20 rounded-full group-hover:translate-x-4 transition-transform duration-1000 ease-in-out" />
                       </div>
                  </div>

                  <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">Level 3</div>
                      <span className="font-bold text-foreground block text-xl mb-2">Slider</span>
                      <p className="text-muted-foreground/80 leading-relaxed">Pinpoint the exact hex code on a gradient.</p>
                  </div>
               </div>

               {/* Level 4 Card */}
               <div className="flex flex-col gap-4 p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 font-display font-bold text-6xl group-hover:opacity-20 transition-opacity">4</div>

                  {/* Visual: Grid Match */}
                  <div className="h-24 w-full bg-secondary/30 rounded-2xl flex items-center justify-center p-4 group-hover:bg-red-50/50 transition-colors">
                      <div className="grid grid-cols-2 gap-2 group-hover:gap-3 transition-all duration-500">
                          <div className="w-6 h-6 rounded bg-red-500 shadow-sm" />
                          <div className="w-6 h-6 rounded bg-green-500 shadow-sm" />
                          <div className="w-6 h-6 rounded bg-blue-500 shadow-sm" />
                          <div className="w-6 h-6 rounded bg-yellow-500 shadow-sm" />
                      </div>
                  </div>

                  <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1">Level 4</div>
                      <span className="font-bold text-foreground block text-xl mb-2">Match</span>
                      <p className="text-muted-foreground/80 leading-relaxed">Group 5 brands with their specific hex codes.</p>
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
          currentMode === 'match' ? (
              <MatchingRound 
                brands={activeBrands}
                onComplete={handleRoundComplete}
                colorFamilyName={level4ColorName}
              />
          ) : (
            <GameCard 
                key={`${currentLevel}-${activeBrands[currentRound].id}`}
                brand={activeBrands[currentRound]}
                mode={currentMode as "easy" | "hard"}
                onComplete={handleRoundComplete}
            />
          )
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
                <p className="text-muted-foreground">You completed all 4 levels.</p>
                
                <div className="py-6 space-y-2">
                    <p className="text-sm uppercase tracking-widest text-muted-foreground">Final Score</p>
                    <div className="text-7xl font-bold font-mono tracking-tight text-foreground">
                        {score}
                    </div>
                    {/* Max score approx: 5*100 + 5*100 + 5*100 + 500 = 2000 */}
                    <p className="text-sm text-muted-foreground">out of ~2000 possible points</p>
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
