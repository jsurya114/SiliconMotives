type Props = { index?: string; children: string; tone?: "light" | "dark"; className?: string };

/** Chapter marker: the section's position in the story, then its name. */
export function SectionLabel({ index, children, tone = "light", className = "" }: Props) {
  const accent = tone === "dark" ? "text-lagoon" : "text-lagoon-ink";
  const rule = tone === "dark" ? "bg-cloud/25" : "bg-ink/25";
  return (
    <p className={`label flex items-center gap-3 ${className}`}>
      {index ? (
        <>
          <span className={accent}>{index}</span>
          <span aria-hidden="true" className={`h-px w-8 ${rule}`} />
        </>
      ) : null}
      <span>{children}</span>
    </p>
  );
}
