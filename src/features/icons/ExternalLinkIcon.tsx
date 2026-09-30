interface Props {
  readonly className?: string;
}

export function ExternalLinkIcon({ className }: Props) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M11 4h5v5M16 4l-7 7M14 11.5V16H4V6h4.5" />
    </svg>
  );
}
