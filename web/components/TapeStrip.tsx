import { Marquee } from "@/components/Marquee";

const DISHES = [
  "Crispy Pata",
  "Crispy Ulo",
  "Sisig",
  "Lengua Asado",
  "Pancit Bilao",
  "Lumpiang Shanghai",
];

/** Two crossed "caution-tape" tickers — loud section divider. */
export function TapeStrip() {
  return (
    <div aria-hidden="true" className="relative h-36 overflow-hidden sm:h-44">
      <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[3deg] border-y-2 border-ink bg-sage py-3 font-display text-2xl font-extrabold uppercase sm:text-3xl">
        <Marquee reverse items={DISHES} separator="✸" />
      </div>
      <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 -rotate-[2deg] border-y-2 border-ink bg-chili py-3 font-display text-2xl font-extrabold uppercase text-cream sm:text-3xl">
        <Marquee
          items={DISHES.map((d) => (
            <span key={d}>
              {d} <span className="font-script normal-case text-butter">sarap!</span>
            </span>
          ))}
          separator="✦"
        />
      </div>
    </div>
  );
}
