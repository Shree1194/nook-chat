import { Avatar } from "@heroui/react";
import { ArrowUpRight } from "lucide-react";
import { AvatarWithOnlineIndicator } from "./AvatarWithOnlineIndicator";

export function ConversationRow({ user, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={`nook-conversation-row group flex w-full items-center gap-3 px-4 py-3 text-left sm:px-5 ${selected ? "is-selected" : ""}`}
    >
      <AvatarWithOnlineIndicator isOnline={user.isOnline ?? true} dotClassName="nook-online-indicator">
        <Avatar className="nook-person-avatar size-11 shrink-0">
          <Avatar.Image alt={user.name} src={user.avatarUrl} />
          <Avatar.Fallback className="text-[13px] font-semibold">{user.initials}</Avatar.Fallback>
        </Avatar>
      </AvatarWithOnlineIndicator>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold leading-5">{user.name}</p>
        <p className="nook-conversation-status mt-0.5 truncate text-[10px]">{user.isOnline ? "Around right now" : "Catch them later"}</p>
      </div>
      <ArrowUpRight className="nook-row-arrow size-3.5 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
    </button>
  );
}
