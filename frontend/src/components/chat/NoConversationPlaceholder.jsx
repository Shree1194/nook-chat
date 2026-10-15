import { ArrowUpRight, Heart, MessageCircle, Sparkles } from "lucide-react";

export function NoConversationPlaceholder() {
  return (
    <div className="nook-empty-state flex min-h-48 flex-1 flex-col items-center justify-center gap-5 px-5 py-10 text-center sm:px-8 sm:py-16">
      <div className="nook-empty-art relative flex size-36 items-center justify-center sm:size-40" aria-hidden="true">
        <span className="nook-empty-orbit orbit-one" />
        <span className="nook-empty-orbit orbit-two" />
        <div className="nook-empty-main-bubble"><MessageCircle className="size-8" strokeWidth={1.8} /></div>
        <span className="nook-empty-floating heart"><Heart className="size-4" fill="currentColor" /></span>
        <span className="nook-empty-floating spark"><Sparkles className="size-4" /></span>
        <span className="nook-empty-dot dot-one" />
        <span className="nook-empty-dot dot-two" />
      </div>
      <div className="max-w-[310px] space-y-2">
        <p className="nook-section-label text-[10px] font-bold uppercase tracking-[0.18em]">A fresh little start</p>
        <h2 className="text-[22px] font-semibold tracking-[-0.05em] sm:text-[25px]">Make the first move.</h2>
        <p className="nook-muted text-[12px] leading-6 sm:text-[13px]">Pick someone from your inbox and send a hello. The best conversations often start with something small.</p>
      </div>
      <div className="nook-empty-hint inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[10px] font-semibold">
        <span>Choose a person to begin</span><ArrowUpRight className="size-3.5" aria-hidden />
      </div>
    </div>
  );
}
