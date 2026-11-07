import { story } from "@/content/story";

/**
 * Renders only once the family has confirmed their own words (content/story.ts
 * `confirmed: true`). Placeholder copy is never shown to customers.
 */
export function OurStory() {
  if (!story.confirmed) return null;
  return (
    <section id="story" className="py-20 sm:py-28">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.jpg"
          alt="Aling Nene's Tumba Tumba Crispy Pata logo — a smiling pig chef in a red bandana."
          width={540}
          height={540}
          data-reveal
          className="pop-lg mx-auto w-full max-w-sm -rotate-3 rounded-[2rem]"
        />
        <div data-reveal>
          <p className="font-script text-2xl text-hot">kwento namin</p>
          <h2 className="font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight sm:text-7xl">
            Our story
          </h2>
          <div className="mt-6 space-y-4 text-lg text-fg/85">
            {story.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
