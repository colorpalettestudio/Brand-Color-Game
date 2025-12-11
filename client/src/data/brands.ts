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
    secondaryHex: "#008163",
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
    secondaryHex: "#DA291C",
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
  {
    id: 'instagram',
    name: "Instagram",
    hex: "#E1306C",
    textColor: "#FFFFFF",
    trivia: "Instagram's gradient logo evolved from a realistic Polaroid camera to a minimalist glyph in 2016."
  },
  {
    id: 'whatsapp',
    name: "WhatsApp",
    hex: "#25D366",
    textColor: "#FFFFFF",
    trivia: "WhatsApp Green was chosen to look clean and fresh, similar to traditional SMS bubbles but distinctively brighter."
  },
  {
    id: 'microsoft',
    name: "Microsoft",
    hex: "#00A4EF",
    textColor: "#FFFFFF",
    trivia: "The four squares of the Microsoft logo represent Windows (blue), Office (red), Xbox (green), and Bing (yellow)."
  },
  {
    id: 'xbox',
    name: "Xbox",
    hex: "#107C10",
    textColor: "#FFFFFF",
    trivia: "Xbox Green was originally chosen because it was the only color the designer had available in his marker set."
  },
  {
    id: 'playstation',
    name: "PlayStation",
    hex: "#003791",
    textColor: "#FFFFFF",
    trivia: "The original PlayStation logo used four bright colors to represent joy, passion, and excellence."
  },
  {
    id: 'nintendo',
    name: "Nintendo",
    hex: "#E60012",
    textColor: "#FFFFFF",
    trivia: "Nintendo Red represents energy and excitement, dating back to the company's rebranding in the 1970s."
  },
  {
    id: 'tacobell',
    name: "Taco Bell",
    hex: "#702082",
    textColor: "#FFFFFF",
    trivia: "Taco Bell's purple bell was introduced in the 90s to appeal to the 'MTV Generation' and stand out from red/yellow competitors."
  },
  {
    id: 'kfc',
    name: "KFC",
    hex: "#F40027",
    textColor: "#FFFFFF",
    trivia: "The red stripes on the KFC bucket have become as iconic as the Colonel himself, representing classic American dining."
  },
  {
    id: 'baskinrobbins',
    name: "Baskin-Robbins",
    hex: "#FA4616",
    secondaryHex: "#005596",
    textColor: "#FFFFFF",
    trivia: "Look closely at the 'BR' logo: the pink parts form the number '31', representing a flavor for every day of the month."
  },
  {
    id: 'imdb',
    name: "IMDb",
    hex: "#F5C518",
    textColor: "#000000",
    trivia: "The bold yellow and black design mimics the look of film warning tape and marquee lights."
  },
  {
    id: 'hulu',
    name: "Hulu",
    hex: "#1CE783",
    textColor: "#000000",
    trivia: "Hulu's 'alien green' glow was designed to look like a TV screen illuminating a dark room."
  },
  {
    id: 'primevideo',
    name: "Prime Video",
    hex: "#00A8E1",
    textColor: "#FFFFFF",
    trivia: "Prime Video uses 'Amazon Blue' to maintain brand consistency while distinguishing itself as a streaming service."
  },
  {
    id: 'tiktok',
    name: "TikTok",
    hex: "#FF0050",
    secondaryHex: "#00F2EA",
    textColor: "#FFFFFF",
    trivia: "The TikTok logo features a chromatic aberration effect (red and cyan overlap) to mimic the vibration of a booming speaker."
  },
  {
    id: 'linkedin',
    name: "LinkedIn",
    hex: "#0A66C2",
    textColor: "#FFFFFF",
    trivia: "LinkedIn Blue signifies professionalism, trust, and intelligence—core values for a business network."
  },
  {
    id: 'reddit',
    name: "Reddit",
    hex: "#FF4500",
    textColor: "#FFFFFF",
    trivia: "The mascot 'Snoo' has red eyes, and the 'Orangered' logo color is named after the upvote arrow."
  },
  {
    id: 'tumblr',
    name: "Tumblr",
    hex: "#36465D",
    textColor: "#FFFFFF",
    trivia: "Tumblr's dark blue creates a 'night mode' feel that encourages late-night scrolling and posting."
  },
  {
    id: 'soundcloud',
    name: "SoundCloud",
    hex: "#FF5500",
    textColor: "#FFFFFF",
    trivia: "The orange cloud represents the warmth and creativity of the independent music community."
  },
  {
    id: 'jbl',
    name: "JBL",
    hex: "#FF6600",
    textColor: "#FFFFFF",
    trivia: "JBL's vibrant orange square logo is designed to be instantly visible on speakers at concerts and events."
  },
  {
    id: 'canon',
    name: "Canon",
    hex: "#BC002D",
    textColor: "#FFFFFF",
    trivia: "Canon Red represents the passion and precision required to capture the perfect photograph."
  },
  {
    id: 'samsung',
    name: "Samsung",
    hex: "#1428A0",
    textColor: "#FFFFFF",
    trivia: "In Korean, 'Samsung' means 'three stars'. The blue ellipse represents the universe."
  },
  {
    id: 'lg',
    name: "LG",
    hex: "#A50034",
    textColor: "#FFFFFF",
    trivia: "The LG logo is a stylized face winking, with the 'L' as the nose and 'G' as the face outline, in 'LG Red'."
  },
  {
    id: 'razer',
    name: "Razer",
    hex: "#44D62C",
    textColor: "#000000",
    trivia: "Razer Green is synonymous with PC gaming culture, designed to look 'radioactive' and high-tech."
  },
  {
    id: 'gopro',
    name: "GoPro",
    hex: "#00AEEF",
    textColor: "#FFFFFF",
    trivia: "GoPro Blue represents the sky and ocean, the two most common playgrounds for action cameras."
  },
  {
    id: 'lamborghini',
    name: "Lamborghini",
    hex: "#DDB321",
    textColor: "#000000",
    trivia: "Many Lamborghinis are painted in 'Giallo Midas' (Yellow) because Ferruccio Lamborghini loved bullfighting, and yellow is a cape color."
  },
  {
    id: 'bmw',
    name: "BMW",
    hex: "#0066B1",
    textColor: "#FFFFFF",
    trivia: "The blue and white quadrants represent the Bavarian flag, not a spinning propeller as commonly believed."
  },
  {
    id: 'harleydavidson',
    name: "Harley-Davidson",
    hex: "#FF6900",
    textColor: "#FFFFFF",
    trivia: "The orange and black color scheme represents energy (orange) and strength/authority (black)."
  },
  {
    id: 'caterpillar',
    name: "Caterpillar",
    hex: "#FFCD00",
    textColor: "#000000",
    trivia: "'Caterpillar Yellow' is a trademarked color that signals caution and safety on construction sites."
  },
  {
    id: 'dewalt',
    name: "DeWalt",
    hex: "#FFD500",
    textColor: "#000000",
    trivia: "DeWalt Yellow is so iconic it's often just called 'industrial yellow', signaling heavy-duty power tools."
  },
  {
    id: 'makita',
    name: "Makita",
    hex: "#008496",
    textColor: "#FFFFFF",
    trivia: "Makita's teal color is unique in the tool world, distinguishing it from the red, yellow, and blue competitors."
  },
  {
    id: 'milwaukee',
    name: "Milwaukee",
    hex: "#DB020A",
    textColor: "#FFFFFF",
    trivia: "Milwaukee's 'Lightning Red' represents the raw power and durability of their electric tools."
  },
  {
    id: 'lufthansa',
    name: "Lufthansa",
    hex: "#FFAE00",
    secondaryHex: "#05164E",
    textColor: "#000000",
    trivia: "The 'fried egg' yellow crane logo is one of the oldest airline logos still in use, representing flight and sun."
  },
  {
    id: 'bp',
    name: "BP",
    hex: "#009900",
    secondaryHex: "#FFD500",
    textColor: "#FFFFFF",
    trivia: "The Helios logo combines green and yellow to symbolize energy in all its forms, particularly solar and nature."
  },
  {
    id: 'shell',
    name: "Shell",
    hex: "#FBCE07",
    secondaryHex: "#DA291C",
    textColor: "#000000",
    trivia: "Shell's red and yellow colors were originally chosen to resemble the Spanish flag to appeal to early Californian settlers."
  },
  {
    id: 'zoom',
    name: "Zoom",
    hex: "#2D8CFF",
    textColor: "#FFFFFF",
    trivia: "Zoom Blue represents simplicity and reliability in video communications."
  },
  {
    id: 'trello',
    name: "Trello",
    hex: "#0079BF",
    textColor: "#FFFFFF",
    trivia: "Trello Blue is designed to be a neutral, calming background for organizing chaotic projects."
  },
  {
    id: 'asana',
    name: "Asana",
    hex: "#F06A6A",
    textColor: "#FFFFFF",
    trivia: "The coral color represents the 'energy' of teamwork without the urgency of red."
  },
  {
    id: 'figma',
    name: "Figma",
    hex: "#F24E1E",
    textColor: "#FFFFFF",
    trivia: "Figma's logo uses a stack of colors, but the orange-red stands out as the primary brand accent."
  },
  {
    id: 'mailchimp',
    name: "Mailchimp",
    hex: "#FFE01B",
    textColor: "#000000",
    trivia: "Mailchimp uses 'Cavendish Yellow' to feel sunny, weird, and distinct from the boring blue of most B2B software."
  },
  {
    id: 'shopify',
    name: "Shopify",
    hex: "#96BF48",
    textColor: "#FFFFFF",
    trivia: "Shopify Green represents growth, money, and the fresh start of building a new business."
  },
  {
    id: 'stripe',
    name: "Stripe",
    hex: "#635BFF",
    textColor: "#FFFFFF",
    trivia: "Stripe's 'Blurple' (Blue-Purple) is designed to look futuristic and digital-native."
  }
];
