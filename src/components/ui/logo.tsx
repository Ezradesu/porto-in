export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="4"
        y="4"
        width="32"
        height="32"
        rx="16"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M14 20L18 24L26 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
