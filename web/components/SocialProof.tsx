import Image from "next/image";
import { press } from "@/content/press";
import { useTheme } from "@/components/ThemeProvider";

function PendingNote({ label }: { label: string }) {
  return (
    <p className="rounded-theme border border-dashed border-accent/50 bg-accent/5 p-3 text-sm text-ink/70">
      ⚠ {label} — content pending from the family (spec §10). Not for launch.
    </p>
  );
}

export function SocialProof() {
  const theme = useTheme();
  const { tvFeature, vloggers, vloggersConfirmed, facebook } = press;

  return (
    <section id="press" className={`${theme.layout.sectionPaddingY} bg-surface-2 text-ink`}>
      <div className="mx-auto grid w-[min(100%-2.5rem,70rem)] gap-8">
        <h2 className="font-display text-3xl font-bold">People are talking</h2>

        {tvFeature.confirmed ? (
          <p className="text-lg">
            As seen on <strong>{tvFeature.network}</strong> — {tvFeature.show} ({tvFeature.year})
          </p>
        ) : (
          <PendingNote label="National TV feature" />
        )}

        {vloggers.length > 0 ? (
          <div className="grid gap-3">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vloggers.map((v) => (
                <li key={v.url}>
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full flex-col overflow-hidden rounded-theme border border-ink/10 hover:border-accent"
                  >
                    {v.poster && (
                      <Image
                        src={v.poster.src}
                        alt={v.poster.alt}
                        width={480}
                        height={270}
                        className="h-40 w-full object-cover"
                      />
                    )}
                    <span className="p-3 text-sm">
                      {v.name ? (
                        <>
                          <strong>{v.name}</strong> · {v.platform} ↗
                        </>
                      ) : (
                        <>Watch on {v.platform} ↗</>
                      )}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {!vloggersConfirmed && <PendingNote label="Vlogger names and thumbnails" />}
          </div>
        ) : (
          <PendingNote label="Vlogger features" />
        )}

        <p
          className={
            "rounded-theme border border-sage bg-surface-1 p-4 " +
            (facebook.confirmed ? "" : "border-dashed")
          }
        >
          {facebook.ratingLabel} · Tag us <strong>{facebook.tagHandle}</strong>
          {!facebook.confirmed && " — rating unconfirmed"}
        </p>
      </div>
    </section>
  );
}
