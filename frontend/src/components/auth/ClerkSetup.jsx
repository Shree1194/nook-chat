import { useState } from "react";
import { AlertCircle, Check, Clipboard, ExternalLink } from "lucide-react";
import { APP_NAME, AppLogo } from "../AppLogo";
import { AuthHeroPanel } from "./AuthHeroPanel";
import { useWallpaper } from "../../context/wallpaper";
import { useTheme } from "../../context/theme";

export default function ClerkSetup() {
  const { frameStyle } = useWallpaper();
  const { theme, toggleTheme, themePreset, setThemePreset } = useTheme();
  const [copied, setCopied] = useState(false);

  async function copyEnvLine() {
    try {
      await navigator.clipboard.writeText("VITE_CLERK_PUBLISHABLE_KEY=pk_test_...");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="nook-frame box-border flex min-h-dvh flex-col p-2.5 sm:p-4 md:p-7" style={frameStyle}>
      <div className="nook-auth-shell mx-auto flex w-full max-w-[1480px] flex-1 flex-col overflow-visible rounded-[24px] sm:rounded-[29px] md:overflow-hidden">
        <header className="nook-auth-header sticky top-0 z-10 flex shrink-0 items-center gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <AppLogo size={35} className="rounded-[12px]" alt="" />
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold leading-tight tracking-[-0.03em]">{APP_NAME}</p>
              <p className="nook-muted truncate text-[11px]">Your own little corner</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <button type="button" onClick={() => {}} aria-label="Wallpaper selection is available after setup" title="Wallpaper settings are available in the app after setup" className="nook-muted rounded-lg px-2 py-1 text-xs">Wallpaper</button>
            <label className="nook-muted flex items-center gap-1 text-xs">
              <span className="sr-only">Theme preset</span>
              <select className="max-w-28 rounded-md border border-[var(--nook-line)] bg-transparent px-2 py-1" value={themePreset} onChange={(event) => setThemePreset(event.target.value)}>
                <option value="default">Wisteria</option>
                <option value="cloud">Cloud</option>
                <option value="fern">Fern</option>
              </select>
            </label>
            <button type="button" onClick={toggleTheme} className="nook-muted rounded-lg px-2 py-1 text-xs" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </header>
        <main className="relative flex flex-1 flex-col overflow-visible md:flex-row md:overflow-hidden">
          <AuthHeroPanel />
          <section className="nook-auth-action flex flex-1 items-center justify-center px-5 py-10 sm:px-8 md:px-10 lg:px-12">
            <div className="w-full max-w-md">
              <div className="mb-6 flex items-center gap-3">
                <AppLogo size={44} className="rounded-[15px]" alt="" />
                <div>
                  <p className="text-lg font-semibold">One setup step left</p>
                  <p className="nook-muted text-sm">{APP_NAME} needs your Clerk development key.</p>
                </div>
              </div>
              <div role="alert" className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" aria-hidden />
                  <div className="min-w-0">
                    <p className="font-medium">Missing VITE_CLERK_PUBLISHABLE_KEY</p>
                    <p className="nook-muted mt-1 text-sm leading-6">
                      Create a Clerk application, copy its development publishable key, and add it to <code>frontend/.env</code>:
                    </p>
                    <pre className="mt-3 overflow-x-auto rounded-xl bg-black/5 px-3 py-2.5 text-xs dark:bg-white/5">VITE_CLERK_PUBLISHABLE_KEY=pk_test_...</pre>
                    <button type="button" onClick={copyEnvLine} className="nook-muted mt-2 inline-flex items-center gap-1.5 text-xs font-medium hover:opacity-75">
                      {copied ? <Check className="size-3.5" /> : <Clipboard className="size-3.5" />}
                      {copied ? "Copied" : "Copy example line"}
                    </button>
                    <p className="nook-muted mt-3 text-xs leading-5">Then restart the frontend. The key is available in Clerk Dashboard → API keys. Use a test key for local development.</p>
                    <a className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline" href="https://dashboard.clerk.com/" target="_blank" rel="noreferrer">
                      Open Clerk Dashboard <ExternalLink className="size-3.5" aria-hidden />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
