export function AuthCardShell({ children }) {
  return (
    <div className="nook-auth-card mx-auto w-full max-w-[410px]">
      <div className="nook-auth-card-art" aria-hidden="true">
        <span className="nook-auth-card-bubble bubble-one" />
        <span className="nook-auth-card-bubble bubble-two" />
        <span className="nook-auth-card-star">✳</span>
      </div>
      <div className="relative z-10 px-6 pb-7 pt-8 sm:px-8 sm:pb-8 sm:pt-9">{children}</div>
    </div>
  );
}
