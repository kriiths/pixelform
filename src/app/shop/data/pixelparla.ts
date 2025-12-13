import type { Product } from './types';

export const pixelparla: Product[] = [
  {
    id: 1,
    name: "Retro-örhänge 1",
    description: "80/90-tal inspirerat",
    price: "450 kr",
    image: "/images/pixelparla/retro1.jpg", // for backward compatibility with components that only use the image field
    images: [
      "/images/pixelparla/retro1.jpg",
      "/images/pixelparla/retro1b.jpg",
      "/images/pixelparla/retro1c.jpg"
    ]
  },
  {
    id: 2,
    name: "Retro-örhänge 2",
    description: "Färgglatt pixelmotiv",
    price: "470 kr",
    image: "/images/pixelparla/retro2.jpg",
  },
  {
    id: 3,
    name: "Retro-örhänge 3",
    description: "Lekfullt pärlplatta",
    price: "430 kr",
    image: "/images/pixelparla/retro3.jpg",
  },
];
