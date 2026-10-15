import { useClerk } from "@clerk/react";
import { Button } from "@heroui/react";
import { ArrowRight, LockKeyhole, MessageCircle, Sparkles } from "lucide-react";
import { APP_NAME, AppLogo } from "../AppLogo";
import { AuthCardShell } from "./AuthCardShell";

const AFTER_AUTH = "/";

export function AuthActionPanel() {
  const clerk = useClerk();

  return (
    <section className="nook-auth-action relative flex flex-1 flex-col items-stretch justify-center overflow-hidden px-5 py-9 sm:px-8 sm:py-12 md:px-8 lg:px-12">
      <AuthCardShell>
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="nook-auth-mini-logo mb-5"><AppLogo size={44} className="rounded-[15px]" alt="" /></div>
          <div className="nook-auth-eyebrow mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em]">
            <Sparkles className="size-3.5" aria-hidden /> Welcome to {APP_NAME}
          </div>
          <h2 className="nook-auth-title text-balance text-[clamp(1.65rem,2.3vw,2.3rem)] font-semibold leading-tight tracking-[-0.05em]">
            Your people are one tap away.
          </h2>
          <p className="nook-muted mt-3 max-w-[280px] text-[13px] leading-6">
            Sign in to pick up where you left off and make room for a good conversation.
          </p>
        </div>

        <Button
          fullWidth
          size="lg"
          variant="primary"
          className="nook-continue-button group h-12 rounded-[15px] text-[14px] font-semibold"
          onPress={() => {
            clerk.openSignIn({ fallbackRedirectUrl: AFTER_AUTH, forceRedirectUrl: AFTER_AUTH });
          }}
        >
          <span className="relative z-1 flex items-center justify-center gap-2">
            Continue to {APP_NAME}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        </Button>

        <div className="nook-auth-note mt-6 flex items-start gap-3 rounded-xl px-3.5 py-3.5">
          <span className="nook-auth-note-icon"><LockKeyhole className="size-4" aria-hidden /></span>
          <p className="text-[11px] leading-5"><strong className="block text-[12px] font-semibold">Your account, your space</strong><span className="nook-muted">Secure sign-in is handled by Clerk.</span></p>
        </div>

        <div className="nook-auth-foot mt-6 flex items-center justify-center gap-2 text-[11px]">
          <MessageCircle className="size-3.5" aria-hidden />
          <span>Small moments make good memories.</span>
        </div>
      </AuthCardShell>
      <p className="nook-action-caption mt-6 text-center text-[10px] tracking-wide">A quieter corner of your day.</p>
    </section>
  );
}
