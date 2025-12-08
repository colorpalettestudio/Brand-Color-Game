export interface Brand {
  id: string;
  name: string;
  hex: string;
  secondaryHex?: string; // For dual-color brands like IKEA
  textColor?: string; // For better contrast on the card
}

export const brands: Brand[] = [
  { id: 'tiffany', name: "Tiffany & Co.", hex: "#0ABAB5", textColor: "#000000" },
  { id: 'target', name: "Target", hex: "#CC0000", textColor: "#FFFFFF" },
  { id: 'ikea', name: "IKEA", hex: "#0051BA", secondaryHex: "#FFDA1A", textColor: "#FFFFFF" },
  { id: 'coke', name: "Coca-Cola", hex: "#F40009", textColor: "#FFFFFF" },
  { id: 'starbucks', name: "Starbucks", hex: "#00704A", textColor: "#FFFFFF" },
  { id: 'mcdonalds', name: "McDonald's", hex: "#FFC72C", secondaryHex: "#DA291C", textColor: "#000000" },
  { id: 'facebook', name: "Facebook", hex: "#1877F2", textColor: "#FFFFFF" },
  { id: 'spotify', name: "Spotify", hex: "#1DB954", textColor: "#FFFFFF" },
  { id: 'homedepot', name: "The Home Depot", hex: "#FA6304", textColor: "#FFFFFF" },
  { id: 'tmobile', name: "T-Mobile", hex: "#E20074", textColor: "#FFFFFF" },
  { id: 'netflix', name: "Netflix", hex: "#E50914", textColor: "#FFFFFF" },
  { id: 'hermes', name: "Hermès", hex: "#F37021", textColor: "#FFFFFF" },
  { id: 'twitter', name: "Twitter (Classic)", hex: "#1DA1F2", textColor: "#FFFFFF" },
  { id: 'snapchat', name: "Snapchat", hex: "#FFFC00", textColor: "#000000" },
  { id: 'amazon', name: "Amazon", hex: "#FF9900", textColor: "#000000" },
  { id: 'google', name: "Google", hex: "#4285F4", secondaryHex: "#EA4335", textColor: "#FFFFFF" }, // Blue + Red (just picking 2 dominant)
  { id: 'john-deere', name: "John Deere", hex: "#367C2B", secondaryHex: "#FCEE21", textColor: "#FFFFFF" },
  { id: 'barbie', name: "Barbie", hex: "#E0218A", textColor: "#FFFFFF" },
  { id: 'ups', name: "UPS", hex: "#351C15", secondaryHex: "#FFB500", textColor: "#FFFFFF" },
  { id: 'fedex', name: "FedEx", hex: "#4D148C", secondaryHex: "#FF6600", textColor: "#FFFFFF" },
];
