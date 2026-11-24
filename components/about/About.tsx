import { Fragment } from "react";
import { site } from "@/lib/content";
import { Plane, Smiley } from "@/components/ui/icons";
import Reveal from "@/components/ui/Reveal";

/** `{smiley}` and `{plane}` in the copy become the little inline drawings. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{smiley\}|\{plane\})/g).map((part, i) => {
        if (part === "{smiley}") return <Smiley key={i} />;
        if (part === "{plane}") return <Plane key={i} />;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="relative flex min-h-svh flex-col items-center justify-center px-[var(--grid-margin)] pt-[25svh] pb-[15svh] tab:pt-[10svh] tab:pb-[10svh]"
    >
      <h2 className="sr-only">About</h2>

      <Reveal className="relative w-full tab:w-9/12 desktop:w-8/12" y={56}>
        <p className="display text-l text-center leading-[1.16] text-balance">
          <Inline text={site.intro} />
        </p>
        <p className="display text-l mt-[1.1em] text-center leading-[1.16] text-balance">
          <Inline text={site.introSecondary} />
        </p>

        <span className="absolute -top-[2.4em] right-0 text-xxs text-muted tab:-right-[7%]">
          {site.since}
        </span>
        <span className="mt-[2.4em] block max-w-[24ch] text-left text-xxs leading-[1.4] text-muted tab:absolute tab:-bottom-[3.5em] tab:-left-[5%] tab:mt-0 tab:max-w-[16ch]">
          {site.introNote}
        </span>
      </Reveal>
    </section>
  );
}
