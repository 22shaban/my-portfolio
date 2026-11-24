type IconProps = { className?: string };

export function ArrowUpRight({ className = "h-[0.9em] w-[0.9em]" }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
      className={className}
      aria-hidden="true"
    >
      <path d="M3.5 12.5 12.5 3.5M12.5 3.5H5.2M12.5 3.5v7.3" />
    </svg>
  );
}

export function ArrowDown({ className = "h-[1em] w-[1em]" }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 2v11M3.5 8.8 8 13.3l4.5-4.5" />
    </svg>
  );
}

export function ArrowUp({ className = "h-[1em] w-[1em]" }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 14V3M3.5 7.2 8 2.7l4.5 4.5" />
    </svg>
  );
}

export function FolderIcon({ className = "h-[2.2em] w-[2.2em]" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      className={className}
      aria-hidden="true"
    >
      <path d="M1 6.5h16l4 4.5h26v27.5H1V6.5Z" />
      <path d="M1 11h46" opacity=".55" />
    </svg>
  );
}

export function GridIcon({ className = "h-[1em] w-[1em]" }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={className}
      aria-hidden="true"
    >
      <path d="M1 1h14v14H1zM1 6h14M1 11h14M6 1v14M11 1v14" opacity=".8" />
    </svg>
  );
}

export function CloseIcon({ className = "h-[1em] w-[1em]" }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      className={className}
      aria-hidden="true"
    >
      <path d="m3 3 10 10M13 3 3 13" />
    </svg>
  );
}

export function Smiley({ className = "inline-block h-[0.9em] w-[0.9em] align-[-0.06em]" }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="13.5" />
      <path d="M10.5 13.2c.6-.9 1.6-.9 2.2 0M19.3 13.2c.6-.9 1.6-.9 2.2 0M10 19c1.8 3 4 4.4 6 4.4s4.2-1.4 6-4.4" />
    </svg>
  );
}

export function Plane({ className = "inline-block h-[0.9em] w-[0.9em] align-[-0.06em]" }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 15.5 29 4 20.5 28l-5.2-9.2L2.5 15.5Z" />
      <path d="M15.3 18.8 29 4" opacity=".6" />
    </svg>
  );
}
