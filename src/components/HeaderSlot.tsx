import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export const HEADER_SLOT_ID = "header-extras";

/** Lets a page inject content into the shared Header's row (next to the
 * title, before the theme toggle) without Header needing to know about
 * any page's data — Header just renders an empty target div, and pages
 * that need something there (like Dashboard's streak badges) portal into
 * it. Pages that render nothing here leave Header exactly as before. */
export function HeaderSlot({ children }: { children: ReactNode }) {
  const [node, setNode] = useState<Element | null>(null);

  useEffect(() => {
    setNode(document.getElementById(HEADER_SLOT_ID));
  }, []);

  if (!node) return null;
  return createPortal(children, node);
}
