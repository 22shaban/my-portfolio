import { site } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";

export default function Interlude() {
  return (
    <section className="px-[var(--grid-margin)] py-[8svh] tab:py-[12svh]">
      <div className="grid grid-cols-2 gap-x-[var(--grid-gutter)] gap-y-[2.2em] text-xxs leading-[1.45] tab:grid-cols-4">
        {site.interlude.map((line, i) => (
          <Reveal key={line} delay={i * 0.06} y={24}>
            <p className={i === 3 ? "text-muted" : undefined}>
              <span className="mr-[0.6em] text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              {line}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
