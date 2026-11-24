"use client";

import { useState } from "react";
import { site, type ConfidentialState } from "@/lib/content";
import { FolderIcon } from "@/components/ui/icons";

const FALLBACK: ConfidentialState[] = [
  { top: "Confidential / 2026", bottom: "Do_not_open" },
  { top: "Didn't you read the label?", bottom: "One time, I'll let it slide." },
  { top: "Ok, you asked.", bottom: "Secret: I still use console.log()" },
];

export default function ConfidentialCard({ className }: { className?: string }) {
  const states = site.confidential?.length ? site.confidential : FALLBACK;
  const [state, setState] = useState(0);
  const current = states[state % states.length];

  return (
    <button
      type="button"
      onClick={() => setState((s) => (s + 1) % states.length)}
      className={`confidential group w-full max-w-full tab:w-auto ${className ?? ""}`}
      data-state={state}
      data-cursor="OPEN"
      aria-label="Confidential file — open it"
    >
      <FolderIcon className="h-[2.4em] w-[2.4em] shrink-0" />
      <span className="min-w-0 text-left text-xxs leading-[1.35]" aria-live="polite">
        <span className="block">{current.top}</span>
        <span className="block text-muted">{current.bottom}</span>
      </span>
      <span className="ml-auto shrink-0 text-xxs text-muted">
        {state === states.length - 1
          ? "(¬‿¬)"
          : `${String(state + 1).padStart(2, "0")} / ${String(states.length).padStart(2, "0")}`}
      </span>
    </button>
  );
}
