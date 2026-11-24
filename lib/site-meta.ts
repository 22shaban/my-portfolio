/**
 * Canonical address of the deployed site.
 *
 * Set NEXT_PUBLIC_SITE_URL in Vercel once the custom domain is connected
 * (Project → Settings → Environment Variables), e.g. https://shabanshaikh.me.
 * Until then this falls back to the current deployment URL so that canonical
 * links and Open Graph images still resolve.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-portfolio-22shaban.vercel.app";

export const SITE_NAME = "Shaban Shaikh";

export const SITE_TITLE = "Shaban Shaikh — Cloud & Infrastructure Engineer";

export const SITE_TAGLINE =
  "Cloud infrastructure, automation and systems built to stay online.";
