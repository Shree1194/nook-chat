import { APP_NAME, AppLogo } from "../AppLogo";
import { ThemePresetPicker } from "../ThemePresetPicker";
import { ThemeToggle } from "../ThemeToggle";
import { WallpaperPicker } from "../WallpaperPicker";

function AuthHeader() {
  return (
    <header className="nook-auth-header sticky top-0 z-10 flex shrink-0 items-center gap-3 px-4 py-3 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <AppLogo size={35} className="rounded-[12px]" alt="" />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold leading-tight tracking-[-0.03em]">{APP_NAME}</p>
          <p className="nook-muted truncate text-[11px]">Your own little corner</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        <WallpaperPicker />
        <ThemePresetPicker />
        <ThemeToggle />
      </div>
    </header>
  );
}
export default AuthHeader;
