import Image from 'next/image';

export function BrandLogo({ light = false, className = '' }: { light?: boolean; className?: string }) {
  const size = { width: 1100, height: 192 };
  return <span className={`brand-logo-wrap inline-flex shrink-0 ${light ? 'is-light' : ''} ${className}`}>
    <Image
      src="/brand/logos/svg/siliconmotives-horizontal-primary.svg"
      alt=""
      aria-hidden="true"
      {...size}
      unoptimized
      sizes="(min-width: 640px) 280px, 240px"
      className="brand-logo brand-logo--primary h-auto w-[240px] sm:w-[280px]"
    />
    <Image
      src="/brand/logos/svg/siliconmotives-horizontal-inverted.svg"
      alt=""
      aria-hidden="true"
      {...size}
      unoptimized
      sizes="(min-width: 640px) 280px, 240px"
      className="brand-logo brand-logo--inverted h-auto w-[240px] sm:w-[280px]"
    />
  </span>;
}
