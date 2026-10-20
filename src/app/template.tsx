"use client";

import { useEffect, useState } from "react";
import { Mark } from "@/components/ui/Wordmark";

let hasHydrated = false;

/**
 * Runs on every client-side navigation: a sheet of blueprint lifts off the new page.
 * It is skipped on the very first load so it never delays the first paint.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const [showSheet] = useState(() => hasHydrated);
  useEffect(() => {
    hasHydrated = true;
  }, []);
  return (
    <>
      {showSheet && (
        <div className="page-sheet blueprint-grid flex items-center justify-center text-[color:var(--color-chalk)]" aria-hidden="true">
          <Mark className="h-10 w-10" />
        </div>
      )}
      {children}
    </>
  );
}
