import { useState } from "react";
import { GameCard } from "@/components/game/GameCard";
import { MatchingRound } from "@/components/game/MatchingRound";
import { brands, Brand } from "@/data/brands";
import { Button } from "@/components/ui/button";
import { ScoreCounter } from "@/components/ui/score-counter";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { ArrowRight, Trophy, Palette, Play, Info, Layers, Sliders, Grid3X3, Check, Sparkles, RotateCcw } from "lucide-react";

const LevelIntro = ({ level, info, onStart }: { level: number, info: any, onStart: () => void }) => {
    useEffect(() => {
        if (level === 5) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({
                    ...defaults, 
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                });
                confetti({
                    ...defaults, 
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [level]);

    return (
        <motion.div 
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className={`text-center space-y-6 max-w-md mx-auto p-12 rounded-3xl shadow-2xl relative overflow-hidden bg-card border border-border`}
        >
            {/* Bonus Round Background Effects */}
            {level === 5 && (
                <>
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-75 pointer-events-none" />
                </>
            )}

            <div className="mx-auto flex justify-center mb-6 relative z-10">
                {info.visual}
            </div>
            <div className="relative z-10">
                {level === 5 && (
                    <div className="inline-block bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-pink-200/50 shadow-sm">
                        Extra Credit
                    </div>
                )}
                <h2 className={`text-3xl font-bold font-display mb-2 ${level === 5 ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600" : ""}`}>
                    {info.title}
                </h2>
                <p className="text-lg text-muted-foreground">
                    {info.desc}
                </p>
            </div>
            <Button 
                onClick={onStart} 
                size="lg" 
                className={`w-full rounded-full relative z-10 ${
                    level === 5 
                        ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:opacity-90 hover:scale-105 transition-all font-bold shadow-xl border-none" 
                        : ""
                }`}
            >
                Start Level {level}
            </Button>
        </motion.div>
    );
};

export default function Home() {
  const [gameState, setGameState] = useState<"start" | "level-intro" | "playing" | "end">("start");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentMode, setCurrentMode] = useState<"easy" | "hard" | "match" | "bonus">("easy");
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  
  // Game phases
  const [level1Brands, setLevel1Brands] = useState<Brand[]>([]); // Single Color
  const [level2Brands, setLevel2Brands] = useState<Brand[]>([]); // Dual Color
  const [level3Brands, setLevel3Brands] = useState<Brand[]>([]); // Slider Challenge
  const [level4Brands, setLevel4Brands] = useState<Brand[]>([]); // Matching Round
  const [level4ColorName, setLevel4ColorName] = useState("Color");
  const [level5Brands, setLevel5Brands] = useState<Brand[]>([]); // Bonus Round
  
  // Current active list of brands being played
  const [activeBrands, setActiveBrands] = useState<Brand[]>([]);

  // State persistence
  useEffect(() => {
    // Load state from localStorage on mount
    const savedState = localStorage.getItem("brandColorGameState");
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            if (parsed.gameState !== "start" && parsed.gameState !== "end") {
                setGameState(parsed.gameState);
                setCurrentLevel(parsed.currentLevel);
                setCurrentMode(parsed.currentMode);
                setCurrentRound(parsed.currentRound);
                setScore(parsed.score);
                setLevel1Brands(parsed.level1Brands);
                setLevel2Brands(parsed.level2Brands);
                setLevel3Brands(parsed.level3Brands);
                setLevel4Brands(parsed.level4Brands);
                setLevel4ColorName(parsed.level4ColorName);
                setLevel5Brands(parsed.level5Brands);
                setActiveBrands(parsed.activeBrands);
            }
        } catch (e) {
            console.error("Failed to load saved state", e);
        }
    }
  }, []);

  // Save state to localStorage whenever relevant state changes
  useEffect(() => {
    if (gameState === "start" || gameState === "end") {
        localStorage.removeItem("brandColorGameState");
    } else {
        const stateToSave = {
            gameState,
            currentLevel,
            currentMode,
            currentRound,
            score,
            level1Brands,
            level2Brands,
            level3Brands,
            level4Brands,
            level4ColorName,
            level5Brands,
            activeBrands
        };
        localStorage.setItem("brandColorGameState", JSON.stringify(stateToSave));
    }
  }, [gameState, currentLevel, currentMode, currentRound, score, activeBrands]);

  const resetGame = () => {
    setGameState("start");
    setCurrentLevel(1);
    setScore(0);
    setCurrentRound(0);
    setActiveBrands([]);
    localStorage.removeItem("brandColorGameState");
  };

  const startGame = () => {
    // 1. Define Pools
    // Level 1: Strictly single-color brands (no secondary, no extra)
    const singleColorBrands = brands.filter(b => !b.secondaryHex && (!b.extraColors || b.extraColors.length === 0));
    
    // Level 2: Multi-color brands (has secondary OR extra colors)
    const multiColorBrands = brands.filter(b => b.secondaryHex || (b.extraColors && b.extraColors.length > 0));
    
    // Level 1: 4 random single-color brands
    const lvl1 = [...singleColorBrands].sort(() => Math.random() - 0.5).slice(0, 4);
    
    // Level 2: 4 random multi-color brands
    const lvl2 = [...multiColorBrands].sort(() => Math.random() - 0.5).slice(0, 4);
    
    // Level 3: Slider (Any 4 brands, avoid recent usage for variety)
    // We can pull from the whole pool now
    const usedIds = new Set([...lvl1, ...lvl2].map(b => b.id));
    let lvl3 = brands.filter(b => !usedIds.has(b.id)).sort(() => Math.random() - 0.5).slice(0, 4);
    
    if (lvl3.length < 4) {
        lvl3 = [...brands].sort(() => Math.random() - 0.5).slice(0, 4);
    }

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
    
    // Level 5: Bonus Round (Inverse)
    // Pick 5 random brands for the "Reverse" challenge
    const lvl5 = [...brands].sort(() => Math.random() - 0.5).slice(0, 5);

    setLevel1Brands(lvl1);
    setLevel2Brands(lvl2);
    setLevel3Brands(lvl3);
    setLevel4Brands(lvl4);
    setLevel4ColorName(familyName);
    setLevel5Brands(lvl5);
    
    setScore(0);
    startLevel(1, lvl1);
  };

  const startLevel = (level: number, roundBrands: Brand[]) => {
    setCurrentLevel(level);
    setActiveBrands(roundBrands);
    
    if (level === 5) {
        setCurrentMode("bonus");
    } else if (level === 4) {
        setCurrentMode("match");
    } else if (level === 3) {
        setCurrentMode("hard");
    } else {
        setCurrentMode("easy");
    }
    
    setCurrentRound(0);
    setGameState("level-intro");
  };

  const handleScoreUpdate = (points: number) => {
      setScore(prev => prev + points);
  };

  const handleRoundComplete = (points: number) => {
    // Score is now handled immediately in handleScoreUpdate for GameCard AND MatchingRound
    // So we don't need to add points here anymore for any mode.
    
    // If it's the matching mode, it's just one big round
    if (currentMode === 'match') {
         // Go to level 5 after matching
         startLevel(5, level5Brands);
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
      } else if (currentLevel === 5) {
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
              visual: (
                  <div className="h-32 w-full bg-secondary/30 rounded-2xl flex items-center justify-center gap-4 p-6">
                      <div className="w-12 h-12 rounded-xl bg-blue-500 shadow-sm animate-pulse" />
                      <div className="w-12 h-12 rounded-xl bg-blue-400 shadow-sm" />
                      <div className="w-12 h-12 rounded-xl bg-blue-600 shadow-sm" />
                  </div>
              ),
              color: "text-blue-600"
          };
          case 2: return { 
              title: "Level 2: Multicolors", 
              desc: "Match the correct brand color palette.", 
              visual: (
                  <div className="h-32 w-full bg-secondary/30 rounded-2xl flex items-center justify-center p-6">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden flex shadow-lg rotate-3">
                          <div className="w-1/2 h-full bg-purple-600" />
                          <div className="w-1/2 h-full bg-purple-300" />
                      </div>
                  </div>
              ),
              color: "text-purple-600"
          };
          case 3: return { 
              title: "Level 3: Color Spectrum", 
              desc: "Use the slider to match the exact hex code.", 
              visual: (
                  <div className="h-32 w-full bg-secondary/30 rounded-2xl flex flex-col items-center justify-center px-8 gap-4">
                       <div className="w-full h-6 rounded-full bg-gradient-to-r from-orange-300 via-orange-500 to-red-500 shadow-sm" />
                       <div className="w-full flex justify-center">
                           <div className="w-1.5 h-4 bg-foreground/20 rounded-full animate-bounce" />
                       </div>
                  </div>
              ),
              color: "text-orange-600"
          };
          case 4: return {
              title: "Level 4: Color Match",
              desc: `Match 5 ${level4ColorName} brands to their exact shade.`,
              visual: (
                  <div className="h-32 w-full bg-secondary/30 rounded-2xl flex items-center justify-center p-6">
                      <div className="grid grid-cols-2 gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-500 shadow-sm" />
                          <div className="w-10 h-10 rounded-lg bg-green-500 shadow-sm" />
                          <div className="w-10 h-10 rounded-lg bg-blue-500 shadow-sm" />
                          <div className="w-10 h-10 rounded-lg bg-yellow-500 shadow-sm" />
                      </div>
                  </div>
              ),
              color: "text-red-600"
          };
          case 5: return {
            title: "Bonus Round: Reverse Mode",
            desc: "Identify the brand from its color. These points are EXTRA CREDIT above the max score!",
            visual: (
                <div className="h-32 w-full bg-secondary/30 rounded-2xl flex items-center justify-center p-6 gap-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10" />
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg flex items-center justify-center transform rotate-3 relative z-10">
                         <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 blur-2xl rounded-full" />
                </div>
            ),
            color: "text-pink-600"
        };
          default: return { title: "", desc: "", visual: null, color: "" };
      }
  };

  return (
    <div className="h-[100dvh] flex flex-col items-center justify-center p-2 md:p-6 lg:p-8 relative overflow-hidden bg-background">
      {/* Start Over Button - Only visible when game is in progress (not start or end) */}
      {gameState !== "start" && gameState !== "end" && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetGame}
            className="absolute top-2 left-2 md:top-4 md:left-4 z-50 text-muted-foreground hover:text-foreground text-xs md:text-sm"
          >
            <RotateCcw className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Start Over
          </Button>
      )}

      {/* Background Elements */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <main className="w-full max-w-7xl z-10 relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden block">
        <AnimatePresence mode="wait">
        {gameState === "start" && (
          <motion.div 
            key="start"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center flex flex-col min-h-full justify-center items-center gap-2 md:gap-4 lg:gap-6 xl:gap-10 py-2 md:py-4 lg:py-0"
          >
            <div className="space-y-1 md:space-y-2 lg:space-y-3 xl:space-y-4 shrink-0 max-w-5xl">
              <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-8xl font-display font-bold tracking-tighter text-foreground leading-tight">
                Do you know your <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-gradient-x bg-[length:200%_200%]">brand colors?</span>
              </h1>
              <p className="text-xs md:text-base lg:text-lg xl:text-xl text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
                Test your designer eye by matching iconic brands to their correct brand colors across 4 increasingly difficult levels.
                <span className="block mt-1 md:mt-2 lg:mt-3 xl:mt-4 text-[10px] md:text-sm lg:text-base xl:text-lg font-medium text-primary bg-primary/10 w-fit mx-auto px-2 py-0.5 md:px-4 md:py-1 rounded-full">
                    Takes less than 2 mins to play!
                </span>
              </p>
            </div>

            <div className="flex justify-center shrink-0 mb-2 md:mb-4 lg:mb-6 xl:mb-8">
              <Button size="lg" onClick={startGame} className="h-9 md:h-12 lg:h-14 xl:h-16 px-6 md:px-10 lg:px-12 text-sm md:text-lg lg:text-xl rounded-full gap-2 md:gap-3 shadow-xl hover:scale-105 transition-transform">
                Start Game <Play className="w-3 h-3 md:w-5 md:h-5 lg:w-6 lg:h-6 fill-current" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4 xl:gap-6 max-w-7xl mx-auto text-left text-sm text-muted-foreground w-full px-2 md:px-4 lg:px-0">
               {/* Level 1 Card */}
               <div className="flex flex-col gap-1.5 md:gap-2 lg:gap-3 xl:gap-4 p-2 md:p-3 lg:p-4 xl:p-6 rounded-xl md:rounded-2xl lg:rounded-3xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1.5 md:p-3 lg:p-4 opacity-10 font-display font-bold text-2xl md:text-4xl lg:text-5xl xl:text-6xl group-hover:opacity-20 transition-opacity">1</div>
                  
                  {/* Visual: 3 Similar Shades */}
                  <div className="h-10 md:h-14 lg:h-20 xl:h-24 w-full bg-secondary/30 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center gap-1 md:gap-2 lg:gap-3 p-1.5 md:p-3 lg:p-4 group-hover:bg-blue-50/50 transition-colors">
                      <div className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded md:rounded-lg bg-blue-500 shadow-sm transform group-hover:scale-110 transition-transform duration-500" />
                      <div className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded md:rounded-lg bg-blue-400 shadow-sm transform group-hover:scale-90 transition-transform duration-500 delay-75" />
                      <div className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 rounded md:rounded-lg bg-blue-600 shadow-sm transform group-hover:scale-105 transition-transform duration-500 delay-150" />
                  </div>
                  
                  <div>
                      <div className="text-[8px] md:text-[10px] lg:text-xs font-bold uppercase tracking-wider text-blue-600 mb-0.5 md:mb-1">Level 1</div>
                      <span className="font-bold text-foreground block text-[10px] md:text-sm lg:text-lg xl:text-xl mb-0.5 md:mb-2">Single Color</span>
                      <p className="text-[8px] md:text-xs lg:text-sm xl:text-base text-muted-foreground/80 leading-snug lg:leading-relaxed line-clamp-2 lg:line-clamp-none">Identify the primary brand color from similar shades.</p>
                  </div>
               </div>

               {/* Level 2 Card */}
               <div className="flex flex-col gap-1.5 md:gap-2 lg:gap-3 xl:gap-4 p-2 md:p-3 lg:p-4 xl:p-6 rounded-xl md:rounded-2xl lg:rounded-3xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1.5 md:p-3 lg:p-4 opacity-10 font-display font-bold text-2xl md:text-4xl lg:text-5xl xl:text-6xl group-hover:opacity-20 transition-opacity">2</div>

                  {/* Visual: Split Card */}
                  <div className="h-10 md:h-14 lg:h-20 xl:h-24 w-full bg-secondary/30 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center p-1.5 md:p-3 lg:p-4 group-hover:bg-purple-50/50 transition-colors">
                      <div className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded md:rounded-xl overflow-hidden flex shadow-sm group-hover:rotate-3 transition-transform duration-500">
                          <div className="w-1/2 h-full bg-purple-600" />
                          <div className="w-1/2 h-full bg-purple-300" />
                      </div>
                  </div>

                  <div>
                      <div className="text-[8px] md:text-[10px] lg:text-xs font-bold uppercase tracking-wider text-purple-600 mb-0.5 md:mb-1">Level 2</div>
                      <span className="font-bold text-foreground block text-[10px] md:text-sm lg:text-lg xl:text-xl mb-0.5 md:mb-2">Multicolors</span>
                      <p className="text-[8px] md:text-xs lg:text-sm xl:text-base text-muted-foreground/80 leading-snug lg:leading-relaxed line-clamp-2 lg:line-clamp-none">Find the correct color palette.</p>
                  </div>
               </div>

               {/* Level 3 Card */}
               <div className="flex flex-col gap-1.5 md:gap-2 lg:gap-3 xl:gap-4 p-2 md:p-3 lg:p-4 xl:p-6 rounded-xl md:rounded-2xl lg:rounded-3xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1.5 md:p-3 lg:p-4 opacity-10 font-display font-bold text-2xl md:text-4xl lg:text-5xl xl:text-6xl group-hover:opacity-20 transition-opacity">3</div>

                  {/* Visual: Slider Gradient */}
                  <div className="h-10 md:h-14 lg:h-20 xl:h-24 w-full bg-secondary/30 rounded-lg md:rounded-xl lg:rounded-2xl flex flex-col items-center justify-center px-2 md:px-4 lg:px-6 group-hover:bg-orange-50/50 transition-colors gap-1 md:gap-2">
                       <div className="w-full h-1 md:h-3 lg:h-4 rounded-full bg-gradient-to-r from-orange-300 via-orange-500 to-red-500 shadow-sm" />
                       <div className="w-full flex justify-center">
                           <div className="w-1 h-1 md:h-2 lg:h-3 bg-foreground/20 rounded-full group-hover:translate-x-4 transition-transform duration-1000 ease-in-out" />
                       </div>
                  </div>

                  <div>
                      <div className="text-[8px] md:text-[10px] lg:text-xs font-bold uppercase tracking-wider text-orange-600 mb-0.5 md:mb-1">Level 3</div>
                      <span className="font-bold text-foreground block text-[10px] md:text-sm lg:text-lg xl:text-xl mb-0.5 md:mb-2">Slider</span>
                      <p className="text-[8px] md:text-xs lg:text-sm xl:text-base text-muted-foreground/80 leading-snug lg:leading-relaxed line-clamp-2 lg:line-clamp-none">Pinpoint the exact hex code on a gradient.</p>
                  </div>
               </div>

               {/* Level 4 Card */}
               <div className="flex flex-col gap-1.5 md:gap-2 lg:gap-3 xl:gap-4 p-2 md:p-3 lg:p-4 xl:p-6 rounded-xl md:rounded-2xl lg:rounded-3xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1.5 md:p-3 lg:p-4 opacity-10 font-display font-bold text-2xl md:text-4xl lg:text-5xl xl:text-6xl group-hover:opacity-20 transition-opacity">4</div>

                  {/* Visual: Grid Match */}
                  <div className="h-10 md:h-14 lg:h-20 xl:h-24 w-full bg-secondary/30 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center p-1.5 md:p-3 lg:p-4 group-hover:bg-red-50/50 transition-colors">
                      <div className="grid grid-cols-2 gap-1 md:gap-1.5 lg:gap-2 group-hover:gap-2 transition-all duration-500">
                          <div className="w-3.5 h-3.5 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded bg-red-500 shadow-sm" />
                          <div className="w-3.5 h-3.5 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded bg-green-500 shadow-sm" />
                          <div className="w-3.5 h-3.5 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded bg-blue-500 shadow-sm" />
                          <div className="w-3.5 h-3.5 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded bg-yellow-500 shadow-sm" />
                      </div>
                  </div>

                  <div>
                      <div className="text-[8px] md:text-[10px] lg:text-xs font-bold uppercase tracking-wider text-red-600 mb-0.5 md:mb-1">Level 4</div>
                      <span className="font-bold text-foreground block text-[10px] md:text-sm lg:text-lg xl:text-xl mb-0.5 md:mb-2">Match</span>
                      <p className="text-[8px] md:text-xs lg:text-sm xl:text-base text-muted-foreground/80 leading-snug lg:leading-relaxed line-clamp-2 lg:line-clamp-none">Group 5 brands with their specific hex codes.</p>
                  </div>
               </div>

            </div>
          </motion.div>
        )}

        {gameState === "level-intro" && (
             <div className="min-h-full w-full flex flex-col justify-center items-center p-4">
                 <LevelIntro 
                    level={currentLevel} 
                    info={getLevelInfo(currentLevel)} 
                    onStart={startNextLevel} 
                 />
             </div>
        )}

        {gameState === "playing" && (
          <div className="w-full h-full flex flex-col items-center justify-center min-h-0 pt-4 md:pt-0">
              {/* New Centered Score Display */}
              <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center mb-1 md:mb-2 xl:mb-8 shrink-0 relative z-20"
              >
                  <span className="text-[8px] md:text-[9px] xl:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5 md:mb-1">Current Score</span>
                  <div className="text-3xl md:text-4xl lg:text-5xl xl:text-8xl font-display font-bold text-foreground tabular-nums leading-none tracking-tight">
                      <ScoreCounter value={score} />
                  </div>
              </motion.div>

              {currentMode === 'match' ? (
                  <MatchingRound 
                    brands={activeBrands}
                    onComplete={handleRoundComplete}
                    onScoreUpdate={handleScoreUpdate}
                    colorFamilyName={level4ColorName}
                  />
              ) : (
                <GameCard 
                    key={`${currentLevel}-${activeBrands[currentRound].id}`}
                    brand={activeBrands[currentRound]}
                    mode={currentMode as "easy" | "hard" | "bonus"}
                    allBrands={brands} // Pass all brands for bonus mode distractor generation
                    forceSingleColor={currentLevel === 1}
                    onComplete={() => handleRoundComplete(0)} // Pass 0 as score is updated immediately
                    onScoreUpdate={handleScoreUpdate}
                />
              )}
          </div>
        )}

        {gameState === "end" && (
          <div className="min-h-full w-full flex flex-col justify-center items-center p-4 md:p-8">
            <motion.div 
                key="end"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8 bg-card border border-border p-8 md:p-12 rounded-3xl shadow-2xl max-w-xl mx-auto relative"
            >
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500" />

            {(() => {
                const maxBaseScore = 1700; // Levels 1-3 (4*100) + Level 4 (500)
                const percentage = Math.round((score / maxBaseScore) * 100);
                
                let rank = "Design Intern";
                let message = "Great start! Keep training your eye.";
                let Icon = Palette;
                let color = "text-blue-500";
                
                if (percentage >= 90) {
                    rank = "Color God";
                    message = "Perfection. You see hex codes in your sleep.";
                    Icon = Trophy;
                    color = "text-yellow-500";
                } else if (percentage >= 80) {
                    rank = "Creative Director";
                    message = "Amazing! Your color vision is elite.";
                    Icon = Layers;
                    color = "text-purple-500";
                } else if (percentage >= 60) {
                    rank = "Senior Designer";
                    message = "Impressive! You know your brands.";
                    Icon = Sliders;
                    color = "text-pink-500";
                } else if (percentage >= 40) {
                    rank = "Junior Designer";
                    message = "Not bad! You've got potential.";
                    Icon = Grid3X3;
                    color = "text-green-500";
                }

                // Calculate Percentile (Mock distribution)
                // A score of 0 is 0th percentile. Max score (approx 2200 with bonus) is 99.9th.
                // We'll use a sigmoid-like curve to distribute players.
                // Most players score around 50-70% accuracy.
                let percentile = 0;
                if (percentage < 30) {
                    percentile = Math.max(1, percentage); // Bottom 30% are linear
                } else {
                    // Logarithmic boost for higher scores to simulate a bell curve tail
                    // Normalize remaining 70% of score range to 70% of percentile range
                    const normalized = (percentage - 30) / 70;
                    // Apply easing
                    const eased = 1 - Math.pow(1 - normalized, 3);
                    percentile = 30 + Math.round(eased * 69);
                }
                
                if (score > 2000) percentile = 99; // Bonus points push you to top

                return (
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                className={`w-24 h-24 mx-auto rounded-full bg-secondary/30 flex items-center justify-center ${color}`}
                            >
                                <Icon className="w-12 h-12" />
                            </motion.div>
                            <div>
                                <h2 className="text-4xl font-display font-bold text-foreground mb-2">{rank}</h2>
                                <p className="text-muted-foreground text-lg">{message}</p>
                            </div>
                        </div>

                        {/* Percentile Highlight Card */}
                         <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-xl transform hover:scale-[1.02] transition-transform duration-500">
                             <div className="bg-card rounded-[22px] p-8 relative overflow-hidden">
                                 {/* Confetti Effect Background */}
                                 <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]" />
                                 
                                 <div className="relative z-10 flex flex-col items-center gap-2">
                                     <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Global Performance</span>
                                     <div className="flex items-baseline gap-2">
                                         <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                                             Top {100 - percentile}%
                                         </span>
                                     </div>
                                     <p className="text-lg font-medium text-foreground/80 mt-2">
                                         You scored better than <span className="text-foreground font-bold">{percentile}%</span> of designers globally.
                                     </p>
                                     
                                     {/* Simple Visual Bar */}
                                     <div className="w-full max-w-xs h-3 bg-secondary rounded-full mt-6 overflow-hidden relative">
                                         <motion.div 
                                             initial={{ width: 0 }}
                                             animate={{ width: `${percentile}%` }}
                                             transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                             className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                                         />
                                     </div>
                                     <div className="w-full max-w-xs flex justify-between text-[10px] text-muted-foreground mt-1 px-1">
                                         <span>0%</span>
                                         <span>50%</span>
                                         <span>100%</span>
                                     </div>
                                 </div>
                             </div>
                         </div>

                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                            <div className="bg-secondary/20 rounded-2xl p-4 border border-border/50">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Total Score</span>
                                <span className="text-3xl font-mono font-bold text-foreground">{score}</span>
                                <span className="text-xs text-muted-foreground ml-1">pts</span>
                            </div>
                            <div className="bg-secondary/20 rounded-2xl p-4 border border-border/50">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Accuracy</span>
                                <span className="text-3xl font-mono font-bold text-foreground">{percentage}%</span>
                            </div>
                        </div>

                        <Button onClick={startGame} size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg">
                            Play Again <Play className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                );
            })()}
          </motion.div>
          </div>
        )}
        </AnimatePresence>
      </main>

      <footer className="w-full max-w-2xl mx-auto text-center py-2 px-4 shrink-0 z-20 relative">
        <p className="text-[7px] md:text-[10px] text-black/40 leading-tight mb-1 md:mb-4">
            This game is for educational and entertainment purposes only. Brand names and colors are the property of their respective owners and are used here for identification and educational reference. This product is not affiliated with or endorsed by any brand shown.
        </p>
        <div className="flex justify-center gap-4 md:gap-6 text-[8px] md:text-[10px] text-black/60">
            <a href="https://thecolorpalettestudio.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Created with ❤︎ by the Color Palette Studio
            </a>
            <a href="https://thecolorpalettestudio.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Privacy Policy
            </a>
        </div>
      </footer>
    </div>
  );
}
