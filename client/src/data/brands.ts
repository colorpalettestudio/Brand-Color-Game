export interface Brand {
  id: string;
  name: string;
  hex: string;
  textColor?: string; // For better contrast on the card
}

export const brands: Brand[] = [
  { id: 'tiffany', name: "Tiffany & Co.", hex: "#0ABAB5", textColor: "#000000" },
  { id: 'target', name: "Target", hex: "#CC0000", textColor: "#FFFFFF" },
  { id: 'ikea', name: "IKEA", hex: "#0051BA", textColor: "#FFFFFF" },
  { id: 'coke', name: "Coca-Cola", hex: "#F40009", textColor: "#FFFFFF" },
  { id: 'starbucks', name: "Starbucks", hex: "#00704A", textColor: "#FFFFFF" },
  { id: 'mcdonalds', name: "McDonald's", hex: "#FFC72C", textColor: "#000000" },
  { id: 'facebook', name: "Facebook", hex: "#1877F2", textColor: "#FFFFFF" },
  { id: 'spotify', name: "Spotify", hex: "#1DB954", textColor: "#FFFFFF" },
  { id: 'homedepot', name: "The Home Depot", hex: "#FA6304", textColor: "#FFFFFF" },
  { id: 'tmobile', name: "T-Mobile", hex: "#E20074", textColor: "#FFFFFF" },
  { id: 'netflix', name: "Netflix", hex: "#E50914", textColor: "#FFFFFF" },
  { id: 'hermes', name: "Hermès", hex: "#F37021", textColor: "#FFFFFF" },
  { id: 'twitter', name: "Twitter (Classic)", hex: "#1DA1F2", textColor: "#FFFFFF" },
  { id: 'snapchat', name: "Snapchat", hex: "#FFFC00", textColor: "#000000" },
  { id: 'amazon', name: "Amazon", hex: "#FF9900", textColor: "#000000" },
  { id: 'google', name: "Google Blue", hex: "#4285F4", textColor: "#FFFFFF" },
  { id: 'john-deere', name: "John Deere", hex: "#367C2B", textColor: "#FFFFFF" },
  { id: 'barbie', name: "Barbie", hex: "#E0218A", textColor: "#FFFFFF" },
  { id: 'ups', name: "UPS", hex: "#351C15", textColor: "#FFFFFF" },
  { id: 'fedex', name: "FedEx Purple", hex: "#4D148C", textColor: "#FFFFFF" },
];
