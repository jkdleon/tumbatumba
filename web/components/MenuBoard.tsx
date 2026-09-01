import { menuGroups, printedMenuHref } from "@/content/menu";
import { useTheme } from "@/components/ThemeProvider";

export function MenuBoard() {
  const theme = useTheme();
  const board = theme.layout.menuTreatment === "board";

  return (
    <section
      id="menu"
      className={`${theme.layout.sectionPaddingY} ${
        board ? "bg-canvas text-ink-invert" : "bg-surface-1 text-ink"
      }`}
    >
      <div className="mx-auto w-[min(100%-2.5rem,70rem)]">
        <h2 className="mb-2 font-display text-3xl font-bold">The Food</h2>
        <p className="mb-8 text-sm opacity-80">
          Prices in pesos. Bilao and platters are made to order — please call ahead so it&apos;s hot
          when you arrive.
        </p>

        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {menuGroups.map((group) => (
            <div key={group.id} className={group.wide ? "md:col-span-2" : ""}>
              <h3
                className={`font-display text-xl font-bold ${board ? "text-gold" : "text-accent"}`}
              >
                {group.label}
              </h3>
              {group.note && <p className="mt-1 text-sm italic opacity-80">{group.note}</p>}
              <dl className="mt-3 divide-y divide-current/15">
                {group.items.map((item, i) => (
                  <div key={`${item.name}-${i}`} className="flex justify-between gap-4 py-2">
                    <dt>
                      {item.name}
                      {item.qualifier && (
                        <span className="ml-2 text-sm opacity-70">{item.qualifier}</span>
                      )}
                    </dt>
                    <dd className="whitespace-nowrap font-semibold tabular-nums">{item.price}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <p className="mt-8">
          <a href={printedMenuHref} className="underline hover:text-accent">
            View the printed menu →
          </a>
        </p>
      </div>
    </section>
  );
}
