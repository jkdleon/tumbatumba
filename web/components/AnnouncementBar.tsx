import { restaurant } from "@/content/restaurant";
import { formatHours } from "@/lib/openNow";
import { Marquee } from "@/components/Marquee";

export function AnnouncementBar() {
  const items = [
    `Open ${restaurant.hours.days} · ${formatHours(restaurant.hours)}`,
    "Chicken ala Tumba — pre-order 1 day ahead",
    `GCash ${restaurant.gcash.number}`,
    "Dine-in by reservation",
    "Pancit by the bilao for 3 to 15",
    `Call ${restaurant.phone.landlineDisplay}`,
  ];
  return (
    <aside
      aria-label="Announcements"
      className="border-b-2 border-ink bg-ink py-2 font-display text-sm font-semibold text-cream"
    >
      <Marquee items={items} separator={<span className="text-butter">●</span>} />
    </aside>
  );
}
