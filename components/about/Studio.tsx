import { site } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";
import ConfidentialCard from "./ConfidentialCard";

export default function Studio() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center px-[var(--grid-margin)] py-[12svh]">
      <div className="mb-[9svh] flex w-full justify-end tab:mb-[11svh]">
        <ConfidentialCard />
      </div>

      <Reveal className="w-full tab:w-10/12 desktop:w-9/12" y={48}>
        <p className="display text-l text-center leading-[1.16] text-balance">
          I&apos;m also part of{" "}
          <em className="accent-glyph not-italic">North Studio</em>, a small
          digital practice run with a long-time collaborator. Together we design
          &amp; develop custom websites that go from idea to reality.
        </p>

        <div className="mt-[2.6em] flex flex-col items-center gap-[1.6em]">
          <a
            href="#contact"
            className="box-1 px-[1.5em] py-[0.95em] text-xxs transition-colors duration-300 hover:bg-fg hover:text-base"
            data-cursor="SAY HI"
          >
            Let&apos;s talk
          </a>
          <span className="text-xxs text-muted">
            — pixel by pixel, line by line.
          </span>
        </div>
      </Reveal>
    </section>
  );
}
