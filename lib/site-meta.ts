/**
 * Canonical address of the deployed site.
 *
 * `NEXT_PUBLIC_SITE_URL` overrides this at build time; otherwise the custom
 * domain is used so canonical links, Open Graph images and the sitemap all
 * point at the public address.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://shabanshaikh.me";

export const SITE_NAME = "Shaban Shaikh";

export const SITE_TITLE = "Shaban Shaikh — Cloud & Infrastructure Engineer";

export const SITE_TAGLINE =
  "Cloud infrastructure, automation and systems built to stay online.";
