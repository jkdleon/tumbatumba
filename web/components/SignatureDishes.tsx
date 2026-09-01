import Image from "next/image";
import { dishes, type Dish } from "@/content/dishes";
import { restaurant } from "@/content/restaurant";
import { useTheme } from "@/components/ThemeProvider";
import { CtaButton } from "@/components/CtaButton";

function DishCard({ dish, lift }: { dish: Dish; lift: boolean }) {
  return (
    <article
      className={
        "flex flex-col overflow-hidden rounded-theme border border-ink/10 bg-surface-2 text-ink " +
        (lift ? "transition-transform duration-[var(--t-motion-fast)] hover:-translate-y-1" : "")
      }
    >
      <Image
        src={dish.image.src}
        alt={dish.image.alt}
        width={640}
        height={480}
        className="h-44 w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-xl font-bold">{dish.name}</h3>
        <p className="flex-1 text-sm text-ink/80">{dish.blurb}</p>
        <p className="font-semibold text-accent">{dish.price}</p>
        <CtaButton href={restaurant.phone.landlineHref} className="mt-2 w-full text-sm">
          Order this
        </CtaButton>
      </div>
    </article>
  );
}

export function SignatureDishes() {
  const theme = useTheme();
  return (
    <section id="dishes" className={`${theme.layout.sectionPaddingY} bg-surface-1 text-ink`}>
      <div className="mx-auto w-[min(100%-2.5rem,70rem)]">
        <h2 className="mb-8 font-display text-3xl font-bold">What people come back for</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} lift={theme.motion === "full"} />
          ))}
        </div>
      </div>
    </section>
  );
}
