import { Button, TextArea } from "@heroui/react";
import { ImagePlus, LoaderCircle, Send } from "lucide-react";
import { useRef } from "react";
import useKeyboardSound from "../../hooks/useKeyboardSound";
import { useChatStore } from "../../store/useChatStore";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";

export function ChatComposer() {
  const composerText = useChatStore((state) => state.composerText);
  const isSoundEnabled = useChatStore((state) => state.isSoundEnabled);
  const sendMediaMessage = useChatStore((state) => state.sendMediaMessage);
  const isSendingMedia = useChatStore((state) => state.isSendingMedia);
  const sendTextMessage = useChatStore((state) => state.sendTextMessage);
  const setComposerText = useChatStore((state) => state.setComposerText);
  const { activeConversationId } = useSelectedConversation();
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const mediaInputRef = useRef(null);

  const playSoundIfEnabled = () => {
    if (isSoundEnabled) playRandomKeyStrokeSound();
  };
  const handleSend = async () => {
    const didSendMessage = await sendTextMessage(activeConversationId);
    if (didSendMessage) playSoundIfEnabled();
  };
  const handleComposerTextChange = (event) => {
    setComposerText(event.target.value);
    playSoundIfEnabled();
  };
  const handleMediaPick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const didSendMessage = await sendMediaMessage({ conversationId: activeConversationId, file });
    if (didSendMessage) playSoundIfEnabled();
  };

  return (
    <footer className="nook-composer-footer shrink-0 px-3 pb-3 pt-3 sm:px-5 sm:pb-4">
      {isSendingMedia ? (
        <div className="nook-upload-state mx-auto mb-2 flex max-w-full items-center gap-2 rounded-xl px-3 py-2 text-[12px]">
          <LoaderCircle className="size-4 shrink-0 animate-spin" aria-hidden />
          <span className="truncate">Getting your media ready...</span>
        </div>
      ) : null}
      <div className="nook-composer-row mx-auto flex w-full max-w-full items-end gap-1.5 rounded-[17px] p-1.5 sm:gap-2 sm:p-2">
        <input ref={mediaInputRef} type="file" accept="image/*,video/*" className="sr-only" disabled={isSendingMedia} tabIndex={-1} aria-hidden onChange={handleMediaPick} />
        <Button variant="ghost" isIconOnly isDisabled={isSendingMedia} className="nook-attach-button size-9 shrink-0 self-end" aria-label="Attach a photo or video" onPress={() => mediaInputRef.current?.click()}>
          <ImagePlus className="size-4.5" strokeWidth={2} />
        </Button>
        <TextArea
          fullWidth
          variant="secondary"
          placeholder="Write something kind..."
          rows={1}
          value={composerText}
          onChange={handleComposerTextChange}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          className="nook-message-input min-w-0 flex-1 rounded-[12px]"
        />
        <Button variant="primary" isIconOnly isDisabled={!composerText.trim() || isSendingMedia} className="nook-send-button size-9 shrink-0 rounded-[12px]" aria-label="Send message" onPress={handleSend}>
          <Send className="size-4" strokeWidth={2.2} />
        </Button>
      </div>
      <p className="nook-composer-caption mt-2 text-center text-[9px]">Enter to send <span>·</span> Shift + Enter for a new line</p>
    </footer>
  );
}
