import useScrollToBottom from "../../hooks/useScrollToBottom";
import { MessageBubble } from "./MessageBubble";
import { NoConversationPlaceholder } from "./NoConversationPlaceholder";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";

export function MessageList() {
  const { activeConversation, activeConversationId } = useSelectedConversation();
  const lastMessageId = activeConversation?.messages.at(-1)?.id;
  const messagesScrollRef = useScrollToBottom(activeConversationId, lastMessageId);

  return (
    <div className="nook-message-stage relative flex flex-1 flex-col overflow-hidden">
      {activeConversation ? (
        <div ref={messagesScrollRef} className="nook-message-canvas flex flex-1 flex-col gap-2 overflow-y-auto overscroll-contain px-3 py-4 sm:px-6 sm:py-5">
          <div className="nook-date-divider mb-2 flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.13em]">
            <span /> Today <span />
          </div>
          {activeConversation.messages.map((message) => <MessageBubble key={message.id} message={message} />)}
        </div>
      ) : <NoConversationPlaceholder />}
    </div>
  );
}
