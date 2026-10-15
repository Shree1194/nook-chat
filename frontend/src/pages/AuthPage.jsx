import { AuthActionPanel } from "../components/auth/AuthActionPanel";
import AuthHeader from "../components/auth/AuthHeader";
import { AuthHeroPanel } from "../components/auth/AuthHeroPanel";
import { useWallpaper } from "../context/wallpaper";

function AuthPage() {
  const { frameStyle } = useWallpaper();

  return (
    <div className="nook-frame box-border flex min-h-dvh flex-col p-2.5 sm:p-4 md:p-7" style={frameStyle}>
      <div className="nook-auth-shell mx-auto flex w-full max-w-[1480px] flex-1 flex-col overflow-visible rounded-[24px] sm:rounded-[29px] md:overflow-hidden">
        <AuthHeader />
        <main className="relative flex flex-1 flex-col overflow-visible md:flex-row md:overflow-hidden">
          <AuthHeroPanel />
          <AuthActionPanel />
        </main>
      </div>
    </div>
  );
}
export default AuthPage;
