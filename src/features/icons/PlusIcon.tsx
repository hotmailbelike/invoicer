interface Props {
  readonly className?: string;
}

export function PlusIcon({ className }: Props) {
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
      <path d="M10 4.5v11M4.5 10h11" />
    </svg>
  );
}
