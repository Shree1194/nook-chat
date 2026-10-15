import { ArrowUpRight, Check, Heart, MessageCircle, Sparkles } from "lucide-react";
import { APP_NAME } from "../AppLogo";
import { AuthHeroPattern } from "./AuthHeroPattern";

export function AuthHeroPanel() {
  return (
    <section className="nook-auth-hero relative flex min-h-[min(430px,52vh)] shrink-0 flex-col overflow-hidden md:min-h-0 md:w-[52%]">
      <AuthHeroPattern />

      <div className="relative z-10 flex flex-1 flex-col px-6 pb-7 pt-8 sm:px-9 sm:pb-8 sm:pt-10 lg:px-12 lg:pb-10 lg:pt-12">
        <div className="nook-hero-kicker mb-5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em]">
          <Sparkles className="size-3.5" aria-hidden />
          A little closer, every day
        </div>

        <h1 className="nook-hero-title max-w-xl text-balance text-[clamp(2rem,3.2vw,3.65rem)] font-semibold leading-[1.06] tracking-[-0.055em]">
          Good talks have a place to <span>land.</span>
        </h1>
        <p className="nook-hero-copy mt-4 max-w-md text-sm leading-7 sm:text-[15px]">
          The everyday check-ins, the long stories, and the messages that make a day better. Keep them all in one little corner.
        </p>

        <div className="nook-chat-illustration relative mx-auto mt-8 w-full max-w-[455px] flex-1 md:mt-7 lg:mt-8">
          <div className="nook-float-chip nook-float-chip-one">
            <span className="nook-float-avatar nook-avatar-peach">M</span>
            <span><strong>Maya</strong><small>sent a little hello</small></span>
            <Heart className="ml-auto size-4 text-[#D96D73]" fill="currentColor" aria-hidden />
          </div>
          <div className="nook-preview-window">
            <div className="nook-preview-window-top">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="size-2 rounded-full bg-[#F4A39B]" />
                <span className="size-2 rounded-full bg-[#E7C879]" />
                <span className="size-2 rounded-full bg-[#83C9A5]" />
              </div>
              <span className="nook-preview-label">A little catch-up</span>
              <span className="nook-preview-status"><span /> in sync</span>
            </div>

            <div className="nook-preview-person">
              <div className="nook-preview-avatar">A</div>
              <div className="min-w-0 flex-1">
                <strong>Alex Morgan</strong>
                <small>your favorite notification</small>
              </div>
              <span className="nook-preview-time">now</span>
            </div>

            <div className="nook-preview-messages" aria-hidden="true">
              <div className="nook-demo-bubble nook-demo-incoming">Did you see the sky this evening?</div>
              <div className="nook-demo-bubble nook-demo-outgoing">Yes. It looked unreal.</div>
              <div className="nook-demo-bubble nook-demo-incoming nook-demo-short">Sending you a photo soon</div>
              <div className="nook-demo-reaction"><Heart className="size-3" fill="currentColor" /> <span>1</span></div>
            </div>

            <div className="nook-preview-compose">
              <span>Write something kind...</span>
              <span className="nook-preview-send"><ArrowUpRight className="size-4" /></span>
            </div>
          </div>
          <div className="nook-float-chip nook-float-chip-two">
            <span className="nook-float-avatar nook-avatar-lilac"><Check className="size-4" /></span>
            <span><strong>Always in reach</strong><small>messages stay in sync</small></span>
          </div>
          <div className="nook-illustration-spark nook-spark-one"><MessageCircle className="size-5" /></div>
          <div className="nook-illustration-spark nook-spark-two" />
        </div>

        <div className="nook-hero-footer mt-6 flex items-center justify-between gap-4 text-[11px] font-medium">
          <span>{APP_NAME} · Your people, your pace.</span>
          <span className="inline-flex items-center gap-1.5"><span className="nook-footer-dot" /> Made for everyday conversations</span>
        </div>
      </div>
    </section>
  );
}
