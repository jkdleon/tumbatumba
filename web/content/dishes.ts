export interface ImageSlot {
  src: string;
  alt: string;
  isStock: boolean;
}

export interface Dish {
  id: string;
  name: string;
  blurb: string;
  price: string;
  image: ImageSlot;
}

/**
 * The four hero dishes for the Signature strip (spec §5.3). Blurbs are short and
 * factual — no fluff. Images are stock placeholders; swap `src`/`alt`/`isStock`
 * per slot when the family's photos arrive.
 */
export const dishes: Dish[] = [
  {
    id: "pata",
    name: "Crispy Pata",
    blurb: "Whole pork leg, scored and simmered, then fried until the skin blisters and cracks.",
    price: "₱870 XL · ₱900 Jumbo",
    image: {
      src: "/photos/dish-pata.jpg",
      alt: "A whole crispy pata on a black plate, skin blistered and deep golden-brown.",
      isStock: false,
    },
  },
  {
    id: "sisig",
    name: "Sisig",
    blurb: "Chopped, seasoned pork served sizzling straight off the plate.",
    price: "₱200",
    image: {
      src: "/stock/dish-sisig.jpg",
      alt: "Stock photo: pork sisig on a hot cast-iron plate with a raw egg and calamansi.",
      isStock: true,
    },
  },
  {
    id: "ulo",
    name: "Crispy Ulo",
    blurb: "Whole pork head, seasoned and simmered, then fried the same way as the pata.",
    price: "₱900",
    image: {
      src: "/photos/dish-ulo.jpg",
      alt: "A whole crispy ulo (pork head) on a black plate, skin blistered and deep golden-brown.",
      isStock: false,
    },
  },
  {
    id: "pancit",
    name: "Pancit by the Bilao",
    blurb: "Noodles tossed and packed on a woven bilao — small for 3–4, XL for 11–15.",
    price: "₱350 – ₱850",
    image: {
      src: "/stock/dish-pancit.jpg",
      alt: "Stock photo: pancit arranged on a round woven bilao with lemon wedges.",
      isStock: true,
    },
  },
];
