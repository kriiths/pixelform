export interface JuniorProduct {
  id: number;
  namn: string;
  bild: string;
  beskrivning: string;
}

export const juniorProdukter: JuniorProduct[] = [
  {
    id: 1,
    namn: "Tetris-figur 1",
    bild: "/junior/tetris1.png",
    beskrivning: "En färgglad pärlfigur inspirerad av Tetris-blocket L. Perfekt för nyfikna små byggare!",
  },
  {
    id: 2,
    namn: "Tetris-figur 2",
    bild: "/junior/tetris2.png",
    beskrivning: "Kreativ tolkning av det klassiska T-blocket. Skapad med glädje och fantasi!",
  },
  {
    id: 3,
    namn: "Tetris-figur 3",
    bild: "/junior/tetris3.png",
    beskrivning: "En lekfull pärlfigur som påminner om det långa I-blocket. Färgsprakande och rolig!",
  },
];
