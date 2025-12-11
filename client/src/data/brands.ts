export interface Brand {
  id: string;
  name: string;
  hex: string;
  secondaryHex?: string; // For dual-color brands like IKEA
  extraColors?: string[]; // For multi-color brands (3+ colors)
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
    extraColors: ["#EA4335", "#FBBC05", "#34A853"],
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
  {
    id: 'airbnb',
    name: "Airbnb",
    hex: "#FF5A5F",
    textColor: "#FFFFFF",
    trivia: "The 'Rausch' color is named after the street where the founders lived when starting the company."
  },
  {
    id: 'pinterest',
    name: "Pinterest",
    hex: "#E60023",
    textColor: "#FFFFFF",
    trivia: "Pinterest chose this custom red to be vibrant and stimulating, encouraging users to take action."
  },
  {
    id: 'youtube',
    name: "YouTube",
    hex: "#FF0000",
    textColor: "#FFFFFF",
    trivia: "YouTube's 'pure red' (#FF0000) represents the 'Record' button found on old camcorders."
  },
  {
    id: 'lyft',
    name: "Lyft",
    hex: "#FF00BF",
    textColor: "#FFFFFF",
    trivia: "Lyft Pink was chosen to be visibly distinct from the yellow cabs and black cars dominating the streets."
  },
  {
    id: 'microsoft',
    name: "Microsoft",
    hex: "#F25022",
    extraColors: ["#7FBA00", "#00A4EF", "#FFB900"],
    textColor: "#FFFFFF",
    trivia: "The four colors of the Microsoft square logo represent its major products: Windows (blue), Office (red), Xbox (green), and Bing (yellow)."
  },
  {
    id: 'ebay',
    name: "eBay",
    hex: "#E53238",
    extraColors: ["#0064D2", "#F5AF02", "#86B817"],
    textColor: "#FFFFFF",
    trivia: "eBay's colorful logo reflects the diverse and connected nature of its marketplace community."
  },
  {
    id: 'nbc',
    name: "NBC",
    hex: "#FFC200", // Yellow
    extraColors: ["#FF8700", "#D60019", "#78288C", "#0055A5", "#5FBD46"], // Orange, Red, Purple, Blue, Green
    textColor: "#000000",
    trivia: "The NBC peacock originally had 11 feathers to sell color TVs, but was simplified to 6 feathers representing the divisions of the network."
  },
  {
    id: 'slack',
    name: "Slack",
    hex: "#4A154B",
    textColor: "#FFFFFF",
    trivia: "Slack's aubergine purple provides a unique, calming backdrop for the colorful communication happening inside."
  },
  {
    id: 'twitch',
    name: "Twitch",
    hex: "#9146FF",
    textColor: "#FFFFFF",
    trivia: "Twitch Purple was selected to stand out in the gaming world, which was dominated by black, red, and green."
  },
  {
    id: 'discord',
    name: "Discord",
    hex: "#5865F2",
    textColor: "#FFFFFF",
    trivia: "Discord's 'Blurple' is a custom shade designed to be friendly and readable across both light and dark modes."
  },
  {
    id: 'ibm',
    name: "IBM",
    hex: "#006699",
    textColor: "#FFFFFF",
    trivia: "Known as 'Big Blue', IBM's color represents stability, intelligence, and corporate strength."
  },
  {
    id: 'dell',
    name: "Dell",
    hex: "#007DB8",
    textColor: "#FFFFFF",
    trivia: "Dell Blue is designed to convey technology, innovation, and reliability."
  },
  {
    id: 'intel',
    name: "Intel",
    hex: "#0068B5",
    textColor: "#FFFFFF",
    trivia: "Intel Blue has been a core part of the brand for decades, symbolizing trust and engineering excellence."
  },
  {
    id: 'bestbuy',
    name: "Best Buy",
    hex: "#0046BE",
    textColor: "#FFFFFF",
    trivia: "The bright blue tag is meant to be instantly recognizable and evoke the feeling of finding a great deal."
  },
  {
    id: 'walmart',
    name: "Walmart",
    hex: "#0071CE",
    textColor: "#FFFFFF",
    trivia: "Walmart's blue is intended to be friendly and approachable, replacing the older, darker navy."
  },
  {
    id: 'ford',
    name: "Ford",
    hex: "#003478",
    textColor: "#FFFFFF",
    trivia: "The Ford oval has used various shades of blue since 1927, symbolizing durability and American tradition."
  },
  {
    id: 'pepsi',
    name: "Pepsi",
    hex: "#004B93",
    textColor: "#FFFFFF",
    trivia: "Pepsi introduced blue to their logo in 1950 to show support for the US during WWII (Red, White, and Blue)."
  },
  {
    id: 'visa',
    name: "Visa",
    hex: "#1A1F71",
    textColor: "#FFFFFF",
    trivia: "Visa's blue represents the blue sky, symbolizing 'limitless possibilities' for customers."
  },
  {
    id: 'lowes',
    name: "Lowe's",
    hex: "#004990",
    textColor: "#FFFFFF",
    trivia: "Lowe's dark blue house silhouette represents the stability and comfort of home."
  },
  {
    id: 'gap',
    name: "Gap",
    hex: "#002868",
    textColor: "#FFFFFF",
    trivia: "The dark navy square was iconic for decades, representing classic American denim."
  },
  {
    id: 'paypal',
    name: "PayPal",
    hex: "#003087",
    textColor: "#FFFFFF",
    trivia: "PayPal's blue is designed to look digital-native and trustworthy for online transactions."
  },
  {
    id: 'heineken',
    name: "Heineken",
    hex: "#008200",
    textColor: "#FFFFFF",
    trivia: "Heineken switched to green bottles to distinguish their premium pilsner from the typical brown beer bottles."
  },
  {
    id: 'wholefoods',
    name: "Whole Foods",
    hex: "#006747",
    textColor: "#FFFFFF",
    trivia: "The fresh green reflects the company's commitment to natural, organic, and healthy food."
  },
  {
    id: 'android',
    name: "Android",
    hex: "#3DDC84",
    textColor: "#000000",
    trivia: "The Android robot is 'Android Green', representing growth, freshness, and the open-source nature of the OS."
  },
  {
    id: 'nvidia',
    name: "NVIDIA",
    hex: "#76B900",
    textColor: "#FFFFFF",
    trivia: "NVIDIA Green symbolizes the company's vision of computing and graphics power."
  },
  {
    id: 'subway',
    name: "Subway",
    hex: "#008C15",
    secondaryHex: "#FFC20B",
    textColor: "#FFFFFF",
    trivia: "The green represents fresh vegetables, while the yellow represents the bread and cheese."
  },
  {
    id: 'sprite',
    name: "Sprite",
    hex: "#008B47",
    textColor: "#FFFFFF",
    trivia: "Sprite uses green to convey lemon-lime refreshment and to stand out on shelves."
  },
  {
    id: '7eleven',
    name: "7-Eleven",
    hex: "#F78F1E",
    extraColors: ["#008163", "#EE2737"],
    textColor: "#FFFFFF",
    trivia: "The orange, green, and red colors were chosen to be visible at any time of day, emphasizing convenience."
  },
  {
    id: 'mastercard',
    name: "Mastercard",
    hex: "#EB001B",
    secondaryHex: "#F79E1B",
    textColor: "#FFFFFF",
    trivia: "The interlocking red and orange circles represent connectivity and global reach."
  },
  {
    id: 'dunkin',
    name: "Dunkin'",
    hex: "#FF671F",
    secondaryHex: "#DA1884",
    textColor: "#FFFFFF",
    trivia: "The bright orange and pink colors were chosen to be fun, energetic, and to look like donuts and coffee."
  },
  {
    id: 'fanta',
    name: "Fanta",
    hex: "#FF8300",
    textColor: "#FFFFFF",
    trivia: "Fanta's vibrant orange color reflects the bold, fruity taste of its most popular flavor."
  },
  {
    id: 'nickelodeon',
    name: "Nickelodeon",
    hex: "#EC7A08",
    textColor: "#FFFFFF",
    trivia: "The famous 'splat' orange was chosen because it's the color least liked by adults, making it perfect for kids."
  },
  {
    id: 'reeses',
    name: "Reese's",
    hex: "#FF6900",
    textColor: "#FFFFFF",
    trivia: "The iconic orange background makes the brown peanut butter cup illustration pop off the wrapper."
  },
  {
    id: 'ferrari',
    name: "Ferrari",
    hex: "#FF2800",
    textColor: "#FFFFFF",
    trivia: "Rosso Corsa (Racing Red) was the national racing color of Italy, which Ferrari adopted for its race cars."
  },
  {
    id: 'adobe',
    name: "Adobe",
    hex: "#FF0000",
    textColor: "#FFFFFF",
    trivia: "The red 'A' represents the creativity and passion of the design community."
  },
  {
    id: 'cnn',
    name: "CNN",
    hex: "#CC0000",
    textColor: "#FFFFFF",
    trivia: "CNN Red is meant to be urgent and authoritative, signaling breaking news."
  },
  {
    id: 'lego',
    name: "LEGO",
    hex: "#D01012",
    secondaryHex: "#FFD500",
    textColor: "#FFFFFF",
    trivia: "The red, yellow, black, and white logo mimics the primary colors of the basic LEGO bricks."
  },
  {
    id: 'natgeo',
    name: "National Geographic",
    hex: "#FFCC00",
    textColor: "#000000",
    trivia: "The yellow border represents a window to the world and the sun shining on the planet."
  },
  {
    id: 'nikon',
    name: "Nikon",
    hex: "#FFE100",
    textColor: "#000000",
    trivia: "Nikon Yellow represents the 'width of possibility' and the passion of photography."
  },
  {
    id: 'cadbury',
    name: "Cadbury",
    hex: "#482683",
    textColor: "#FFFFFF",
    trivia: "Cadbury purple (Pantone 2685C) was Queen Victoria's favorite color and has been used by the brand since 1914."
  },
  {
    id: 'yahoo',
    name: "Yahoo",
    hex: "#410093",
    textColor: "#FFFFFF",
    trivia: "Yahoo used purple because it was a cheap paint color to buy for their office walls in the early startup days."
  },
  {
    id: 'roku',
    name: "Roku",
    hex: "#662D91",
    textColor: "#FFFFFF",
    trivia: "Roku's purple stands out in a sea of black and silver home entertainment devices."
  },
  {
    id: 'hallmark',
    name: "Hallmark",
    hex: "#623588",
    textColor: "#FFFFFF",
    trivia: "Hallmark's purple crown logo represents quality, royalty, and excellence in greeting cards."
  },
];
