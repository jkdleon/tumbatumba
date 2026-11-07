export interface ImageSlot {
  src: string;
  alt: string;
}

export interface Dish {
  id: string;
  name: string;
  /** Short sticker label on the card — descriptive, never a factual claim. */
  tag: string;
  blurb: string;
  price: string;
  /**
   * The family's own photo. Omitted until one exists — the card then renders as a
   * typographic colour tile instead of a stock stand-in (stock never ships).
   */
  image?: ImageSlot;
}

/** The four signature dishes for the bento strip. Blurbs are short and factual. */
export const dishes: Dish[] = [
  {
    id: "pata",
    name: "Crispy Pata",
    tag: "The headliner",
    blurb: "Whole pork leg, scored and simmered, then fried until the skin blisters and cracks.",
    price: "₱870 XL · ₱900 Jumbo",
    image: {
      src: "/photos/dish-pata.jpg",
      alt: "A whole crispy pata on a black plate, skin blistered and deep golden-brown.",
    },
  },
  {
    id: "ulo",
    name: "Crispy Ulo",
    tag: "Same fryer, bolder cut",
    blurb: "Half a pork head, seasoned and simmered, then fried the same way as the pata.",
    price: "₱900",
    image: {
      src: "/photos/dish-ulo.jpg",
      alt: "A crispy ulo (half a pork head) on a black plate, skin blistered and deep golden-brown.",
    },
  },
  {
    id: "sisig",
    name: "Sisig",
    tag: "Sizzling",
    blurb: "Chopped, seasoned pork served sizzling straight off the plate.",
    price: "₱200",
  },
  {
    id: "pancit",
    name: "Pancit by the Bilao",
    tag: "Feeds 3–15",
    blurb: "Noodles tossed and packed on a woven bilao — small for 3–4, XL for 11–15.",
    price: "₱350 – ₱850",
  },
];
