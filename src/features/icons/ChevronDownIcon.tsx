interface Props {
  readonly className?: string;
}

export function ChevronDownIcon({ className }: Props) {
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
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  );
}
