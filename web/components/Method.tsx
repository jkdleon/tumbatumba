const STEPS = [
  {
    n: "01",
    title: "Scored",
    body: "It starts with a whole pork leg, skin scored.",
    tone: "bg-yellow",
  },
  {
    n: "02",
    title: "Simmered",
    body: "Seasoned and simmered first — long before it ever meets the oil.",
    tone: "bg-pink",
  },
  {
    n: "03",
    title: "Fried till it cracks",
    body: "Then fried until the skin blisters and cracks. That's the sound you came for.",
    tone: "bg-lime",
  },
];

export function Method() {
  return (
    <section id="method" className="relative overflow-hidden bg-night-2 py-20 text-fg sm:py-28">
      <div aria-hidden="true" className="dots-light absolute inset-0" />
      <div className="wrap relative">
        <div data-reveal className="mb-12 max-w-3xl">
          <p className="font-script text-2xl text-yellow">paano ba?</p>
          <h2 className="font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight sm:text-7xl">
            How the{" "}
            <span className="text-stroke [-webkit-text-stroke-color:var(--color-lime)]">
              crunch
            </span>{" "}
            happens
          </h2>
        </div>
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              data-reveal
              style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
              className={`rounded-[2rem] border-2 border-fg p-7 text-on-bright shadow-[6px_6px_0_0_var(--color-fg)] ${s.tone}`}
            >
              <span className="font-script text-5xl text-on-bright">{s.n}</span>
              <h3 className="mt-4 font-display text-3xl font-extrabold leading-none">{s.title}</h3>
              <p className="mt-3 text-on-bright/85">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
