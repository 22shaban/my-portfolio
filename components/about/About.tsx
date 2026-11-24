import { site } from "@/lib/content";
import { Plane, Smiley } from "@/components/ui/icons";
import Reveal from "@/components/ui/Reveal";

export default function About() {
  return (
    <section
      id="about"
      className="relative flex min-h-svh flex-col items-center justify-center px-[var(--grid-margin)] pt-[25svh] pb-[15svh] tab:pt-[10svh] tab:pb-[10svh]"
    >
      <h2 className="sr-only">About</h2>

      <Reveal className="relative w-full tab:w-9/12 desktop:w-8/12" y={56}>
        <p className="display text-l text-center leading-[1.16] text-balance">
          I&apos;m <Smiley /> a creative developer passionate about crafting
          smooth, interactive &amp; memorable web experiences.
        </p>
        <p className="display text-l mt-[1.1em] text-center leading-[1.16] text-balance">
          I love bringing ideas <Plane /> to life with clean code, fluid
          animation and playful interaction.
        </p>

        <span className="absolute -top-[2.4em] right-0 text-xxs text-muted tab:-right-[7%]">
          {site.since}
        </span>
        <span className="mt-[2.4em] block max-w-[24ch] text-left text-xxs leading-[1.4] text-muted tab:absolute tab:-bottom-[3.5em] tab:-left-[5%] tab:mt-0 tab:max-w-[16ch]">
          — that make each project stand out.
        </span>
      </Reveal>
    </section>
  );
}
