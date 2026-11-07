"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import type { Vlogger } from "@/content/press";
import { facebookEmbedSrc } from "@/lib/facebookEmbed";
import { VideoModal } from "@/components/VideoModal";

/** Decorative backdrops for the reel cards (the family's own food photos). */
const BACKDROPS = [
  { src: "/photos/hero-pata.jpg", pos: "object-[40%_30%]", tilt: "-rotate-2" },
  { src: "/photos/dish-ulo.jpg", pos: "object-center", tilt: "rotate-1" },
  { src: "/photos/dish-pata.jpg", pos: "object-[60%_center]", tilt: "-rotate-1" },
];

const titleFor = (v: Vlogger, i: number) => v.name ?? `Food vlog ${i + 1}`;

function Player({ vlog, title }: { vlog: Vlogger; title: string }) {
  const vertical = (vlog.orientation ?? "vertical") === "vertical";
  // Size the frame to fit the viewport while keeping the video's shape.
  const box = vertical
    ? "aspect-[9/16] h-[min(78vh,calc((100vw_-_2rem)*16/9))]"
    : "aspect-video w-[min(calc(100vw_-_2rem),56rem)]";
  const frame = useRef<HTMLDivElement>(null);
  // Tell Facebook the real on-screen width so the player fills the frame.
  const [width, setWidth] = useState<number | null>(null);
  useLayoutEffect(() => {
    const measured = frame.current?.getBoundingClientRect().width ?? 0;
    setWidth(Math.round(measured) || (vertical ? 360 : 896));
  }, [vertical]);
  return (
    <div ref={frame} className={`pop-lg relative overflow-hidden rounded-[1.5rem] bg-deep ${box}`}>
      <p className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-fg/70">
        Loading the video from Facebook…
      </p>
      {width !== null && (
        <iframe
          src={facebookEmbedSrc(vlog.embedUrl ?? vlog.url, width)}
          title={`${title} — video player`}
          className="relative h-full w-full border-0"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
    </div>
  );
}

export function VlogReels({ vloggers }: { vloggers: Vlogger[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  const onCardClick = (e: MouseEvent<HTMLAnchorElement>, i: number) => {
    // Let modified clicks (new tab / window) behave like a normal link.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setOpen(i);
  };

  const active = open === null ? null : vloggers[open];

  return (
    <>
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {vloggers.map((v, i) => {
          const bg = BACKDROPS[i % BACKDROPS.length];
          const title = titleFor(v, i);
          return (
            <li
              key={v.url}
              data-reveal
              style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
            >
              {/* A real link, so it still works without JS or as "open in new tab". */}
              <a
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-haspopup="dialog"
                aria-label={`Play ${title} from ${v.platform}`}
                onClick={(e) => onCardClick(e, i)}
                className={`group relative block aspect-[9/14] overflow-hidden rounded-[2rem] border-2 border-on-bright bg-deep text-fg shadow-[8px_8px_0_0_var(--color-on-bright)] transition-transform duration-300 hover:rotate-0 hover:-translate-y-1 ${bg.tilt}`}
              >
                <Image
                  src={v.poster?.src ?? bg.src}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className={`object-cover opacity-80 motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-110 ${bg.pos}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/20 to-transparent" />
                <div className="absolute inset-x-0 top-0 flex items-center gap-2 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.jpg"
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full border-2 border-fg"
                  />
                  <span className="font-display text-sm font-bold">{v.name ?? "Food vlog"}</span>
                  <span className="ml-auto rounded-full bg-night/40 px-2 py-0.5 text-xs font-semibold backdrop-blur">
                    {v.platform}
                  </span>
                </div>
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-on-bright bg-yellow text-on-bright shadow-[4px_4px_0_0_var(--color-on-bright)] transition-transform group-hover:scale-110"
                >
                  <span className="absolute inset-0 rounded-full bg-yellow/60 motion-safe:animate-ping" />
                  <svg viewBox="0 0 24 24" className="relative ml-1 h-8 w-8 fill-current">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-display text-2xl font-extrabold leading-tight">
                    Crunch check #{i + 1}
                  </p>
                  <p className="mt-1 text-sm text-fg/85">Tap to play ▶</p>
                </div>
              </a>
            </li>
          );
        })}
      </ul>

      {active && open !== null && (
        <VideoModal
          title={titleFor(active, open)}
          onClose={close}
          footer={
            <p className="text-center text-sm text-fg/80">
              Video not loading?{" "}
              <a
                href={active.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-fg underline decoration-hot decoration-2 underline-offset-4"
              >
                Watch it on {active.platform} ↗
              </a>
            </p>
          }
        >
          <Player vlog={active} title={titleFor(active, open)} />
        </VideoModal>
      )}
    </>
  );
}
