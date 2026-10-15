export const WALLPAPER_SECTIONS = [
  { id: "desktop", title: "Desktop" },
  { id: "abstract", title: "Abstract" },
];

export const WALLPAPERS = [
  {
    id: "warm-horizon",
    category: "desktop",
    label: "Warm horizon",
    url: "/wallpapers/warm-horizon.jpg",
  },
  {
    id: "redwoods",
    category: "desktop",
    label: "Redwoods",
    url: "/wallpapers/redwoods.jpg",
  },
  {
    id: "utah-evening",
    category: "desktop",
    label: "Utah Evening",
    url: "/wallpapers/utah-evening.jpg",
  },
  {
    id: "san-francisco-bay",
    category: "desktop",
    label: "San Francisco Bay",
    url: "/wallpapers/san-francisco-bay.jpg",
  },
  {
    id: "iceland-coast",
    category: "desktop",
    label: "Iceland Coast",
    url: "/wallpapers/iceland-coast.jpg",
  },
  {
    id: "new-york-midtown",
    category: "desktop",
    label: "New York Midtown",
    url: "/wallpapers/new-york-midtown.jpg",
  },
  {
    id: "liquid-color",
    category: "abstract",
    label: "Liquid color",
    url: "/wallpapers/liquid-color.jpg",
  },
  {
    id: "radial-yellow",
    category: "abstract",
    label: "Radial Yellow",
    url: "/wallpapers/radial-yellow.jpg",
  },
  {
    id: "radial-purple",
    category: "abstract",
    label: "Radial Purple",
    url: "/wallpapers/radial-purple.jpg",
  },
  {
    id: "radial-green",
    category: "abstract",
    label: "Radial Green",
    url: "/wallpapers/radial-green.jpg",
  },
  {
    id: "radial-blue",
    category: "abstract",
    label: "Radial Blue",
    url: "/wallpapers/radial-blue.jpg",
  },
  {
    id: "soft-glow",
    category: "abstract",
    label: "Soft glow",
    url: "/wallpapers/soft-glow.jpg",
  },
  {
    id: "midnight-glow",
    category: "abstract",
    label: "Midnight glow",
    url: "/wallpapers/midnight-glow.jpg",
  },
];

export function frameStyleFromUrl(url) {
  return {
    backgroundImage: `url("${url}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

export function getWallpaperById(id) {
  return WALLPAPERS.find((w) => w.id === id) ?? WALLPAPERS.find((w) => w.id === "radial-purple");
}
