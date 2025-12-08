export interface Brand {
  id: string;
  name: string;
  hex: string;
  secondaryHex?: string; // For dual-color brands like IKEA
  textColor?: string; // For better contrast on the card
  trivia?: string; // Fun fact about the color/brand
}

export const brands: Brand[] = [
  { 
    id: 'tiffany', 
    name: "Tiffany & Co.", 
    hex: "#0ABAB5", 
    textColor: "#000000",
    trivia: "Tiffany Blue (PMS 1837) is trademarked and was chosen by Charles Lewis Tiffany for the cover of his Blue Book in 1845."
  },
  { 
    id: 'target', 
    name: "Target", 
    hex: "#CC0000", 
    textColor: "#FFFFFF",
    trivia: "Target tested various shades of red and found this specific bold red was the most attention-grabbing while remaining friendly."
  },
  { 
    id: 'ikea', 
    name: "IKEA", 
    hex: "#0051BA", 
    secondaryHex: "#FFDA1A", 
    textColor: "#FFFFFF",
    trivia: "IKEA's blue and yellow colors represent the Swedish national flag, honoring the founder's heritage."
  },
  { 
    id: 'coke', 
    name: "Coca-Cola", 
    hex: "#F40009", 
    textColor: "#FFFFFF",
    trivia: "Coca-Cola Red is so distinct it doesn't have a single Pantone number; it's a custom blend of three different reds."
  },
  { 
    id: 'starbucks', 
    name: "Starbucks", 
    hex: "#00704A", 
    textColor: "#FFFFFF",
    trivia: "Starbucks wasn't always green! The original logo was brown, inspired by coffee beans, before switching to green in 1987."
  },
  { 
    id: 'mcdonalds', 
    name: "McDonald's", 
    hex: "#FFC72C", 
    secondaryHex: "#DA291C", 
    textColor: "#000000",
    trivia: "The Golden Arches yellow was chosen because it's easy to spot from the highway, signaling food and safety to drivers."
  },
  { 
    id: 'facebook', 
    name: "Facebook", 
    hex: "#1877F2", 
    textColor: "#FFFFFF",
    trivia: "Mark Zuckerberg chose blue because he is red-green colorblind. 'Blue is the richest color for me,' he said."
  },
  { 
    id: 'spotify', 
    name: "Spotify", 
    hex: "#1DB954", 
    textColor: "#FFFFFF",
    trivia: "Spotify's green was originally a darker lime, but they updated it to this 'neon' shade in 2015 to pop more on dark screens."
  },
  { 
    id: 'homedepot', 
    name: "The Home Depot", 
    hex: "#FA6304", 
    textColor: "#FFFFFF",
    trivia: "Founders Bernie Marcus and Arthur Blank picked orange because it symbolized value and energy, using old circus tent canvas for early signage."
  },
  { 
    id: 'tmobile', 
    name: "T-Mobile", 
    hex: "#E20074", 
    textColor: "#FFFFFF",
    trivia: "T-Mobile owns the trademark for the color magenta in the telecommunications industry."
  },
  { 
    id: 'netflix', 
    name: "Netflix", 
    hex: "#E50914", 
    textColor: "#FFFFFF",
    trivia: "Netflix red is designed to create a cinematic feel, evoking the red velvet curtains of old movie theaters."
  },
  { 
    id: 'hermes', 
    name: "Hermès", 
    hex: "#F37021", 
    textColor: "#FFFFFF",
    trivia: "Hermès only started using orange boxes after WWII because it was the only color of paperboard available during shortages."
  },
  { 
    id: 'twitter', 
    name: "Twitter (Classic)", 
    hex: "#1DA1F2", 
    textColor: "#FFFFFF",
    trivia: "This specific shade of blue was chosen to represent communication, clarity, and the sky."
  },
  { 
    id: 'snapchat', 
    name: "Snapchat", 
    hex: "#FFFC00", 
    textColor: "#000000",
    trivia: "Evan Spiegel chose this yellow because he noticed no other major app was using yellow in their icon."
  },
  { 
    id: 'amazon', 
    name: "Amazon", 
    hex: "#FF9900", 
    textColor: "#000000",
    trivia: "The orange arrow in Amazon's logo points from A to Z, representing that they sell everything."
  },
  { 
    id: 'google', 
    name: "Google", 
    hex: "#4285F4", 
    secondaryHex: "#EA4335", 
    textColor: "#FFFFFF", 
    trivia: "Google's logo uses primary colors but breaks the pattern with a green 'l' to show they don't follow the rules."
  },
  { 
    id: 'john-deere', 
    name: "John Deere", 
    hex: "#367C2B", 
    secondaryHex: "#FCEE21", 
    textColor: "#FFFFFF",
    trivia: "The green and yellow scheme represents growing crops (green) and harvest time (yellow)."
  },
  { 
    id: 'barbie', 
    name: "Barbie", 
    hex: "#E0218A", 
    textColor: "#FFFFFF",
    trivia: "Barbie Pink (Pantone 219C) is trademarked by Mattel and represents femininity, optimism, and playfulness."
  },
  { 
    id: 'ups', 
    name: "UPS", 
    hex: "#351C15", 
    secondaryHex: "#FFB500", 
    textColor: "#FFFFFF",
    trivia: "UPS brown (Pullman Brown) was chosen in 1916 because it hides dirt on delivery vehicles well."
  },
  { 
    id: 'fedex', 
    name: "FedEx", 
    hex: "#4D148C", 
    secondaryHex: "#FF6600", 
    textColor: "#FFFFFF",
    trivia: "Look closely: The negative space between the 'E' and 'x' forms an arrow, symbolizing speed and precision."
  },
];
