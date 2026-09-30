interface Props {
  readonly className?: string;
}

export function TrashIcon({ className }: Props) {
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
      <path d="M4 6h12M8.5 6V4.5h3V6M6 6l.7 9.5h6.6L14 6" />
    </svg>
  );
}
