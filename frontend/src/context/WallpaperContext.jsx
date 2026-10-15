import { useEffect, useState } from "react";
import { frameStyleFromUrl, getWallpaperById } from "../data/wallpapers";
import { WallpaperContext } from "./wallpaper";

const STORAGE_KEY = "chat-wallpaper-id";

function readStoredWallpaperId() {
  if (typeof localStorage === "undefined") return "radial-purple";
  const wallpaperId = localStorage.getItem(STORAGE_KEY);
  if (wallpaperId && getWallpaperById(wallpaperId).id === wallpaperId) return wallpaperId;

  return "radial-purple";
}

export function WallpaperProvider({ children }) {
  const [wallpaperId, setWallpaperIdState] = useState(readStoredWallpaperId);

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, wallpaperId);
  }, [wallpaperId]);

  const wallpaper = getWallpaperById(wallpaperId);

  const setWallpaperId = (id) => {
    setWallpaperIdState(id);
  };

  const frameStyle = frameStyleFromUrl(wallpaper.url);

  return (
    <WallpaperContext.Provider value={{ wallpaperId, setWallpaperId, wallpaper, frameStyle }}>
      {children}
    </WallpaperContext.Provider>
  );
}
