import { type ReactNode } from "react";
import { contentSide } from "@/lib/snake";

/**
 * Lays a section into one half of the page; the other half is left clear so the
 * snaking railway behind shows through. The content side alternates per index,
 * opposite the train. Below `lg` it collapses to a single full-width column.
 */
export function SnakeRow({ index, children }: { index: number; children: ReactNode }) {
  const side = contentSide(index);
  const content = <div className="min-w-0">{children}</div>;
  const spacer = <div aria-hidden className="hidden lg:block" />;

  return (
    <div className="relative w-full lg:grid lg:grid-cols-2 lg:items-center">
      {side === "left" ? (
        <>
          {content}
          {spacer}
        </>
      ) : (
        <>
          {spacer}
          {content}
        </>
      )}
    </div>
  );
}
