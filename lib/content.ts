/**
 * Single source of truth for every piece of editable copy on the site.
 *
 * The data lives in `content/site.json` and `content/projects/*.json` so it can
 * be edited from the admin panel at `/admin` (Sveltia CMS) as well as by hand.
 * `content/projects.generated.ts` is produced by `scripts/build-content.mjs`
 * on every dev/build, which is why components keep importing from this file.
 */
import siteJson from "@/content/site.json";
import { projectEntries } from "@/content/projects.generated";

export type Social = { label: string; href: string };
export type NavItem = { label: string; href: string };
export type ConfidentialState = { top: string; bottom: string };

export type Site = {
  name: string;
  headline: string[];
  studio: string;
  email: string;
  location: string;
  timeZone: string;
  timeLabel: string;
  availability: string;
  since: string;
  statement: string;
  intro: string;
  introSecondary: string;
  introNote: string;
  interlude: string[];
  studioCopy: string;
  ticker: string[];
  socials: Social[];
  nav: NavItem[];
  confidential: ConfidentialState[];
};

export type Project = {
  slug: string;
  title: string;
  year: string;
  order: number;
  tags: string[];
  awards: string[];
  hue: number;
  blurb: string;
};

export const site = siteJson as Site;

export const projects: Project[] = projectEntries as Project[];

export const nav = site.nav;
