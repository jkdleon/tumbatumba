import Image from "next/image";
import { story } from "@/content/story";
import { useTheme } from "@/components/ThemeProvider";

export function OurStory() {
  const theme = useTheme();

  return (
    <section id="story" className={`${theme.layout.sectionPaddingY} bg-surface-1 text-ink`}>
      <div className="mx-auto grid w-[min(100%-2.5rem,46rem)] gap-6">
        <h2 className="font-display text-3xl font-bold">Our Story</h2>

        {!story.confirmed && (
          <p className="rounded-theme border border-dashed border-accent/50 bg-accent/5 p-3 text-sm">
            ⚠ Placeholder — nothing here is confirmed. This becomes the family&apos;s own words once
            they answer the questions below (spec §5.6). Do not launch with this copy.
          </p>
        )}

        {story.paragraphs.map((p, i) => (
          <p key={i} className="leading-relaxed">
            {p}
          </p>
        ))}

        <figure className="relative overflow-hidden rounded-theme">
          <Image
            src="/stock/story.jpg"
            alt="Stock photo (placeholder — swap for a real photo of the family or the kitchen)."
            width={1200}
            height={800}
            className="h-auto w-full object-cover"
          />
          <figcaption className="absolute left-2 top-2 rounded bg-ink/70 px-2 py-1 text-xs text-ink-invert">
            stock photo — replace before launch
          </figcaption>
        </figure>

        {!story.confirmed && (
          <aside className="rounded-theme border border-ink/15 bg-surface-2 p-4 text-sm">
            <p className="mb-2 font-semibold">Questions for the family:</p>
            <ul className="list-disc space-y-1 pl-5">
              {story.questionsForFamily.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </section>
  );
}
