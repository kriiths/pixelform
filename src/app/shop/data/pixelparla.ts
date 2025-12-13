export interface Product {
  id: number;
  name: string;
  desc: string;
  price: string;
  image: string;
}

export const pixelparla: Product[] = [
  {
    id: 1,
    name: "Retro-örhänge 1",
    desc: "80/90-tal inspirerat",
    price: "450 kr",
    image: "/images/pixelparla/retro1.jpg",
  },
  {
    id: 2,
    name: "Retro-örhänge 2",
    desc: "Färgglatt pixelmotiv",
    price: "470 kr",
    image: "/images/pixelparla/retro2.jpg",
  },
  {
    id: 3,
    name: "Retro-örhänge 3",
    desc: "Lekfullt pärlplatta",
    price: "430 kr",
    image: "/images/pixelparla/retro3.jpg",
  },
];
