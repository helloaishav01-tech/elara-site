export const CATEGORIES = [
  { slug: "heels", name: "Heels & Pumps" },
  { slug: "mules", name: "Mules & Slides" },
  { slug: "sandals", name: "Sandals & Strappy" },
  { slug: "flats", name: "Flats & Loafers" },
  { slug: "boots", name: "Boots" },
  { slug: "evening", name: "Evening & Bridal" },
];

export const BRANDS = [
  "Chanel", "Louis Vuitton", "Gucci", "Manolo Blahnik",
  "Jimmy Choo", "Valentino", "Aquazzura", "Bottega Veneta",
];

const img = (filename) => {
  try { return require(`../images/${filename}`); }
  catch(e) { return null; }
};

const HEEL_SIZES = [35, 36, 37, 38, 39, 40, 41];
const FLAT_SIZES = [35, 36, 37, 38, 39, 40, 41, 42];
const BOOT_SIZES = [36, 37, 38, 39, 40, 41];

const make = (id, name, brand, category, price, color, badge = null, image = null) => ({
  id, name, brand, category, price, color, badge, image,
  sizes: category === "boots" ? BOOT_SIZES : category === "flats" ? FLAT_SIZES : HEEL_SIZES,
});

export const PRODUCTS = [
  // — Heels & Pumps —
  make("h1", "Romy 100 Pump", "Jimmy Choo", "heels", 795, "Blossom Pink", "New", img("Bordeaux-Bow-Slingback.jpeg")),
  make("h2", "Hangisi 105", "Manolo Blahnik", "heels", 1145, "Cream Satin", "Bridal", img("Noir-Double-Strap-Slingback.jpeg")),
  make("h3", "Slingback 65", "Chanel", "heels", 1250, "Beige & Black", null, img("Noir-Patent-Block-Heel.jpeg")),
  make("h4", "Rockstud Slingback", "Valentino", "heels", 1095, "Dusty Rose", "Editor's Pick", img("Rouge-Multi-Strap-Block.jpeg")),
  make("h5", "Nude Block Slingback", "Chanel", "heels", 980, "Nude", null, img("Nude-Block-Slingback.jpeg")),
  make("h6", "Bourgogne Patent Slingback", "Manolo Blahnik", "heels", 1050, "Bourgogne", null, img("Bourgogne-Patent-Slingback.jpeg")),
  make("h7", "Bordeaux Patent Slingback", "Valentino", "heels", 1095, "Bordeaux", null, img("Bordeaux-Patent-Slingback.jpeg")),
  make("h8", "Ivoire Pointed Slingback", "Jimmy Choo", "heels", 920, "Ivory", null, img("Ivoire-Pointed-Slingback.jpeg")),
  make("h9", "Nude Ankle Strap Pump", "Jimmy Choo", "heels", 850, "Nude", null, img("Nude-Ankle-Strap-Pump.jpeg")),
  make("h10", "Ciel Satin Slingback", "Chanel", "heels", 1100, "Sky Blue", "New", img("Ciel-Satin-Slingback.jpeg")),
  make("h11", "Tabac Patent Stiletto", "Gucci", "heels", 990, "Tabac", null, img("Tabac-Patent-Stiletto.jpeg")),
  make("h12", "Blush Cap-Toe", "Chanel", "heels", 1250, "Blush & Rose", null, img("Blush-Cap-Toe.jpeg")),
  make("h13", "Rosa Suprema", "Manolo Blahnik", "heels", 1350, "Floral Print", "New", img("Rosa-Suprema.jpeg")),

  // — Mules & Slides —
  make("m1", "Sunflower Mule", "Aquazzura", "mules", 850, "Petal Pink", "New", img("Trio-Pointed-Mules.jpeg")),
  make("m2", "Cassette Mule", "Bottega Veneta", "mules", 920, "Parfait", null, img("Chocolat-Bow-Mule.jpeg")),
  make("m3", "Princetown Slide", "Gucci", "mules", 990, "Willow Green", null, img("Cognac-Flat-Slide.jpeg")),
  make("m4", "Ciel Bow Mule", "Jimmy Choo", "mules", 875, "Sky Blue", "New", img("Ciel-Bow-Mule.jpeg")),
  make("m5", "Rosa Suede Loafer", "Louis Vuitton", "mules", 1100, "Blush Pink", null, img("Rosa-Suede-Loafer.jpeg")),
  make("m6", "Jardin Miu Mule", "Gucci", "mules", 960, "Floral Denim", "New", img("Jardin-Miu.jpeg")),
  make("m7", "Verde Velours Mule", "Aquazzura", "mules", 820, "Sage Green", null, img("Verde-Velours.jpeg")),
  make("m8", "Ruban Parisien", "Chanel", "mules", 1150, "Ivory & Black", null, img("Ruban-Parisien.jpeg")),
  make("m9", "La Nuit Fleurie", "Valentino", "mules", 980, "Black Floral", null, img("La-Nuit-Fleurie.jpeg")),

  // — Sandals & Strappy —
  make("s1", "Almalfi Strappy", "Aquazzura", "sandals", 720, "Dolce Pink", "New", img("Brun-Ruffle-Sandal.jpeg")),
  make("s2", "Wisteria Sandal", "Valentino", "sandals", 980, "Blossom", null, img("Chocolat-Ankle-Heel.jpeg")),
  make("s3", "Cabochon Sandal", "Jimmy Choo", "sandals", 850, "Cream", null, img("Tan-Minimal-Sandal.jpeg")),
  make("s4", "Toile Verte Sandal", "Aquazzura", "sandals", 890, "Green Floral", "New", img("Toile-Verte.jpeg")),

  // — Flats & Loafers —
  make("f1", "Horsebit Loafer", "Gucci", "flats", 920, "Palm Leaf", null, img("Dentelle-Rose.jpeg")),
  make("f2", "Lido Flat", "Bottega Veneta", "flats", 870, "Parfait", null, img("Bordeaux-Ballet.jpeg")),
  make("f3", "Ballet Flat", "Chanel", "flats", 1080, "Cream & Black", null, img("Patent-Mary-Jane.jpeg")),
  make("f4", "Olive Mary Jane", "Gucci", "flats", 850, "Olive", null, img("Olive-Mary-Jane.jpeg")),
  make("f5", "Bloom Ballet", "Chanel", "flats", 920, "Blush Floral", "New", img("Bloom-Ballet.jpeg")),
  make("f6", "Jardin Denim Ballet", "Gucci", "flats", 980, "Denim Floral", null, img("Jardin-Denim.jpeg")),

  // — Boots —
  make("b1", "Garden Boot", "Louis Vuitton", "boots", 1450, "Willow", null, img("Cognac-Block-Ankle-Boot.jpeg")),

  // — Evening & Bridal —
  make("e1", "Atelier Bridal", "Manolo Blahnik", "evening", 1450, "Ivory Crystal", "Bridal", img("Or-Brode-Stiletto.jpeg")),
  make("e2", "Garavani Couture", "Valentino", "evening", 1880, "Blossom", "Couture", img("Emeraude-Brodee.jpeg")),
  make("e3", "Soirée Pump", "Aquazzura", "evening", 1050, "Gold", null, img("Peony-Embroidered-Heel.jpeg")),
  make("e4", "Blush Embellished Mule", "Jimmy Choo", "evening", 1200, "Blush Crystal", "Bridal", img("Blush-Embellished-Mule.jpeg")),
  make("e5", "Voile Ethereal", "Aquazzura", "evening", 1380, "Ivory & Sage", "New", img("Voile-Ethereal.jpeg")),
  make("e6", "La Rosa d'Oro", "Manolo Blahnik", "evening", 1650, "Gold & Rose", "Bridal", img("La-Rosa-dOro.jpeg")),
];

export const getByCategory = (slug) =>
  slug === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === slug);