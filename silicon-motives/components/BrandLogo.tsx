import Image from 'next/image';

export function BrandLogo({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return <Image
    src="/images/brand/logo-horizontal.png"
    alt="SiliconMotives"
    width={824}
    height={160}
    sizes="(min-width: 640px) 206px, 180px"
    className={`brand-logo h-auto w-[180px] shrink-0 sm:w-[206px] ${light ? 'brightness-0 invert' : ''} ${className}`}
  />;
}
