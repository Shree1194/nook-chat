import { Avatar, Button } from "@heroui/react";
import { ChevronLeft, Volume2, VolumeX, X, Sparkles } from "lucide-react";
import { AvatarWithOnlineIndicator } from "./AvatarWithOnlineIndicator";
import { ThemePresetPicker } from "../ThemePresetPicker";
import { ThemeToggle } from "../ThemeToggle";
import { WallpaperPicker } from "../WallpaperPicker";
import { useChatStore } from "../../store/useChatStore";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";

export function ChatHeader() {
  const isSoundEnabled = useChatStore((state) => state.isSoundEnabled);
  const setActiveConversationId = useChatStore((state) => state.setActiveConversationId);
  const setSoundEnabled = useChatStore((state) => state.setSoundEnabled);
  const { activeConversation, isLargeScreen } = useSelectedConversation();

  return (
    <header className="nook-chat-header sticky top-0 z-10 flex shrink-0 flex-wrap items-center gap-2 px-3 py-3 sm:px-5 sm:py-3.5">
      {activeConversation && !isLargeScreen ? (
        <Button variant="ghost" size="sm" isIconOnly className="nook-icon-button shrink-0" onPress={() => setActiveConversationId(null)} aria-label="Back to inbox">
          <ChevronLeft className="size-5" strokeWidth={2.25} />
        </Button>
      ) : null}

      {activeConversation ? (
        <>
          <AvatarWithOnlineIndicator isOnline={activeConversation.peer.isOnline ?? true}>
            <Avatar className="nook-header-avatar size-10 shrink-0">
              <Avatar.Image alt={activeConversation.peer.name} src={activeConversation.peer.avatarUrl} />
              <Avatar.Fallback className="text-[13px] font-semibold">{activeConversation.peer.initials}</Avatar.Fallback>
            </Avatar>
          </AvatarWithOnlineIndicator>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold leading-tight tracking-[-0.025em]">{activeConversation.peer.name}</p>
            <p className="nook-muted mt-1 flex items-center gap-1.5 text-[10px]">
              <span className={`nook-header-status-dot ${activeConversation.peer.isOnline ? "is-online" : ""}`} />
              {activeConversation.peer.isOnline ? "Here for a chat" : "Away for now"}
            </p>
          </div>
        </>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="nook-header-greeting-icon"><Sparkles className="size-4" aria-hidden /></div>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-bold tracking-[-0.025em]">A good day to say hello.</p>
            <p className="nook-muted mt-1 truncate text-[11px]">Choose a person and pick up where you left off.</p>
          </div>
        </div>
      )}

      <div className="ml-auto flex max-w-full shrink-0 flex-wrap items-center justify-end gap-0.5 sm:gap-1">
        <div className="hidden min-[420px]:contents">
          <WallpaperPicker />
          <ThemePresetPicker />
        </div>
        <ThemeToggle />
        <Button variant="ghost" size="sm" isIconOnly className="nook-icon-button shrink-0" aria-label={isSoundEnabled ? "Turn typing sounds off" : "Turn typing sounds on"} aria-pressed={isSoundEnabled} onPress={() => setSoundEnabled(!isSoundEnabled)}>
          {isSoundEnabled ? <Volume2 className="size-4.5" aria-hidden /> : <VolumeX className="size-4.5" aria-hidden />}
        </Button>
        {activeConversation ? (
          <Button variant="ghost" size="sm" isIconOnly className="nook-icon-button shrink-0" aria-label="Close chat" onPress={() => setActiveConversationId(null)}>
            <X className="size-4.5" aria-hidden />
          </Button>
        ) : null}
      </div>
    </header>
  );
}
