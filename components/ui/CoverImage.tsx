import Image from "next/image";
import { ReactNode } from "react";

interface CoverImageProps {
  src?: string;
  alt: string;
  gradient: string;
  heightClass?: string;
  initial?: string;
  overlayClass?: string;
  children?: ReactNode;
  priority?: boolean;
}

export function CoverImage({
  src,
  alt,
  gradient,
  heightClass = "h-40",
  initial,
  overlayClass = "bg-black/15",
  children,
  priority = false,
}: CoverImageProps) {
  const showFallback = !src;

  return (
    <div
      className={`${heightClass} ${showFallback ? `bg-gradient-to-br ${gradient}` : ""} relative overflow-hidden`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover"
          priority={priority}
        />
      ) : (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute -right-6 -bottom-10 text-[9rem] font-black leading-none tracking-tight text-white/15 select-none"
          >
            {initial ?? ""}
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute -left-8 -top-8 w-40 h-40 rounded-full bg-white/15 blur-2xl"
          />
        </>
      )}
      <div className={`absolute inset-0 ${overlayClass}`} />
      {children}
    </div>
  );
}
