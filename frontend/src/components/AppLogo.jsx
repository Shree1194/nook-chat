export const APP_NAME = "Nook";

/** A small, original chat mark so the app has a consistent identity without a stock logo image. */
export function AppLogo({ className = "", size = 32, alt = APP_NAME }) {
  const decorative = alt === "";

  return (
    <span
      className={`nook-mark inline-flex shrink-0 items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative ? "true" : undefined}
    >
      <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none" aria-hidden="true">
        <path
          d="M10.5 12.5C10.5 8.91 13.41 6 17 6h15c3.59 0 6.5 2.91 6.5 6.5v11c0 3.59-2.91 6.5-6.5 6.5h-7.4l-7.75 6.1c-.83.65-2.05.06-2.05-1V30.7a6.5 6.5 0 0 1-4.3-6.2v-12Z"
          fill="white"
          fillOpacity=".97"
        />
        <path
          d="M8 22.5v8.1c0 3.1 2.5 5.6 5.6 5.6h.2v4.05c0 .82.94 1.29 1.6.79l6.35-4.84h8.65c3.1 0 5.6-2.5 5.6-5.6v-1.1"
          stroke="#E6E1FF"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="18.2" cy="17.5" r="2" fill="#7562E8" />
        <circle cx="24" cy="17.5" r="2" fill="#7562E8" />
        <circle cx="29.8" cy="17.5" r="2" fill="#7562E8" />
        <circle cx="37.5" cy="37.5" r="5.5" fill="#FFBD78" stroke="#5C49C8" strokeWidth="2" />
      </svg>
    </span>
  );
}
