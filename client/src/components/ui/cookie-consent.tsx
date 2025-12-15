import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Cookie } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  const enableTracking = () => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('init', '997560767984355');
        (window as any).fbq('track', 'PageView');
    }
  };

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay before showing
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else if (consent === "accepted") {
      enableTracking();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
    enableTracking();
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
        >
          <div className="bg-card border border-border shadow-2xl p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary/50 rounded-xl">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="font-bold text-lg leading-none">Cookie Settings</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use cookies to improve your experience and show you relevant content. 
                  Read our <a href="https://thecolorpalettestudio.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
                </p>
              </div>
              <button 
                onClick={handleDecline}
                className="text-muted-foreground hover:text-foreground transition-colors -mt-1 -mr-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl" 
                onClick={handleDecline}
              >
                Decline
              </Button>
              <Button 
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none shadow-md" 
                onClick={handleAccept}
              >
                Accept All
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
