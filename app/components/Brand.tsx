import Link from "next/link";
export default function Brand() {
  return (
    <Link href="/" className="brand" aria-label="SiliconMotives home">
      <svg
        viewBox="0 0 32 32"
        width="30"
        height="30"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 8h20l-7 8H6l7 8h13"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="m6 8 7 8m6 0 7 8" stroke="currentColor" strokeWidth="3" />
      </svg>
      <span>
        silicon<span className="brand-light">motives</span>
        <span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
