"use client";

import { site } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";
import LocalTime from "@/components/ui/LocalTime";
import { scrollToTop } from "@/components/providers/SmoothScroll";
import { ArrowUp, ArrowUpRight } from "@/components/ui/icons";

const MARQUEE = "Available for freelance — say hello";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative flex min-h-svh flex-col justify-between px-[var(--grid-margin)] pb-[var(--grid-margin)] pt-[16svh]"
    >
      <div className="relative flex flex-1 flex-col items-center justify-center">
        <span className="absolute left-[1%] top-[4%] hidden text-xxs text-muted tab:block">
          0110 1001 010
        </span>
        <span className="absolute right-[1%] top-[10%] hidden text-xxs text-muted tab:block">
          &lt;OVER/&gt;
        </span>
        <span className="absolute bottom-[2%] left-[8%] hidden text-xxs text-muted tab:block">
          1 0
        </span>
        <span className="absolute bottom-[8%] right-[6%] hidden text-xxs text-muted tab:block">
          web development
        </span>

        <Reveal className="text-center" y={44}>
          <h2 className="display text-xl leading-[0.85]">
            Thank you &amp;
            <br />
            see <em className="accent-glyph not-italic">you</em> soon!
          </h2>
        </Reveal>

        <Reveal className="mt-[2.2em] max-w-[36ch] text-center" delay={0.1} y={20}>
          <p className="text-xxs leading-[1.5] text-muted">
            Planning something new? I&apos;d love to hear about it. Don&apos;t
            be shy, say hello.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="arrow-link mt-[1.2em] justify-center text-xxs"
            data-cursor="MAIL"
          >
            {site.email}
            <ArrowUpRight className="h-[0.85em] w-[0.85em]" />
          </a>
        </Reveal>
      </div>

      <div className="marquee hairline-t hairline-b my-[6svh] overflow-hidden py-[0.9em] text-xxs">
        <div className="marquee-track">
          {[0, 1].map((group) => (
            <div key={group} className="flex shrink-0 items-center">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="flex items-center whitespace-nowrap">
                  <span className="mx-[1.6em]">{MARQUEE}</span>
                  <span className="text-muted" aria-hidden="true">
                    ✳
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-[var(--grid-gutter)] gap-y-[2.2em] text-xxs tab:grid-cols-3 desktop:grid-cols-6">
        <div className="flex items-start gap-[0.9em]">
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="box-1 flex h-[2.6em] w-[2.6em] shrink-0 items-center justify-center transition-colors duration-300 hover:bg-fg hover:text-base"
            data-cursor="TOP"
          >
            <ArrowUp className="h-[1em] w-[1em]" />
          </button>
          <span className="leading-[1.4]">
            Back
            <br />
            to top
          </span>
        </div>

        <div className="leading-[1.4]">
          Planning something new?
          <br />
          I&apos;d love to hear about it.
          <br />
          <span className="text-muted">Don&apos;t be shy, say hello.</span>
        </div>

        <div className="leading-[1.4]">
          <span className="block text-muted">Drop me a line</span>
          <a
            href={`mailto:${site.email}`}
            className="normal-case underline decoration-line underline-offset-4 hover:decoration-fg"
          >
            {site.email}
          </a>
        </div>

        <div className="leading-[1.6]">
          <span className="block text-muted">Socials</span>
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="arrow-link mr-[0.6em]"
            >
              {s.label}
              <ArrowUpRight className="h-[0.7em] w-[0.7em]" />
            </a>
          ))}
        </div>

        <div className="leading-[1.6]">
          <span className="block text-muted">Currently in</span>
          {site.location}
          <br />
          <LocalTime timeZone={site.timeZone} label={site.timeLabel} />
        </div>

        <div className="leading-[1.6]">
          <span className="block text-muted">Colophon</span>
          Built with Next.js,
          <br />
          GSAP &amp; Three.js
          <br />© 2026
        </div>
      </div>
    </footer>
  );
}
