/** Single source of truth for the snaking railway + the alternating page layout. */

export type SnakeSection = { id: string; numeral: string; label: string };

export const SNAKE_SECTIONS: SnakeSection[] = [
  { id: "top", numeral: "I", label: "Cover" },
  { id: "field-notes", numeral: "II", label: "Field Notes" },
  { id: "specimens", numeral: "III", label: "Specimens" },
  { id: "instruments", numeral: "IV", label: "Instruments" },
  { id: "writing", numeral: "V", label: "Writing" },
  { id: "now", numeral: "VI", label: "Now" },
  { id: "colophon", numeral: "VII", label: "Colophon" },
];

export type Side = "left" | "right";

/** Which half the train occupies for a given section index (alternating). */
export function trainSide(index: number): Side {
  return index % 2 === 0 ? "left" : "right";
}

/** Content sits opposite the train. */
export function contentSide(index: number): Side {
  return trainSide(index) === "left" ? "right" : "left";
}
