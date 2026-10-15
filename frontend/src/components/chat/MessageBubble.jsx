import { withTransform } from "../../lib/imagekit";
import { MessageVideo } from "./MessageVideo";

const IMAGE_TRANSFORM = "q-auto,w-640,f-auto";

export function MessageBubble({ message }) {
  const isOwnMessage = message.role === "me";
  const hasImage = Boolean(message.imageUrl);
  const hasVideo = Boolean(message.videoUrl);

  return (
    <div className={`nook-message-row flex w-full ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div className={`nook-message-bubble ${isOwnMessage ? "is-own" : "is-theirs"} max-w-[min(90%,28rem)] sm:max-w-[min(75%,28rem)]`}>
        {hasImage ? (
          <img src={withTransform(message.imageUrl, IMAGE_TRANSFORM)} alt="" className="mb-1.5 max-h-40 max-w-full rounded-xl object-cover sm:max-h-52" />
        ) : null}
        {hasVideo ? <MessageVideo src={message.videoUrl} /> : null}
        {message.text ? <p className="whitespace-pre-wrap wrap-break-word">{message.text}</p> : null}
        <p className="nook-message-time mt-1 text-right text-[10px] tabular-nums">{message.time}</p>
      </div>
    </div>
  );
}
