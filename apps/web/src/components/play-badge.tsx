type PlayBadgeProps = {
  href?: string;
  className?: string;
};

export function PlayBadge({ href = "#", className = "" }: PlayBadgeProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-3 rounded-xl border border-neutral-700 bg-black px-5 py-3 transition-colors hover:border-neutral-500 ${className}`}
    >
      <svg width="26" height="28" viewBox="0 0 28 30" aria-hidden="true">
        <path d="M1.6 1.2 16.3 15 1.6 28.8c-.5-.3-.9-.9-.9-1.7V2.9c0-.8.4-1.4.9-1.7Z" fill="#fff" />
        <path d="M21.7 10.4 17.9 15l3.8 4.6 4.5-2.6c1.1-.7 1.1-2.3 0-3L21.7 10.4Z" fill="#fff" />
        <path d="M1.6 1.2c.4-.2.9-.2 1.5.1l16.2 9.3-2 2.4L1.6 1.2Z" fill="#fff" />
        <path d="m17.3 17 2 2.4L3.1 28.7c-.6.3-1.1.3-1.5.1L17.3 17Z" fill="#fff" />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wide text-neutral-400">Get it on</span>
        <span className="text-lg font-semibold text-white">Google Play</span>
      </span>
    </a>
  );
}
