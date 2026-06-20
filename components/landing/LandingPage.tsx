"use client";

import ConstellationBackground from "./ConstellationBackground";
import HowItWorks from "./HowItWorks";
import Hero from "./Hero";
import Nav from "./Nav";
import Mission from "./Mission";

/*
 * Shared interaction styles. Inline styles cannot express :hover,
 * :focus-visible, media queries, or keyframes — which is exactly why
 * the page felt static. Everything structural stays inline in the
 * components; only interactive/responsive rules live here.
 *
 * Expected tokens in globals.css:
 * --ink, --ink-mid, --ink-raised, --cream, --cream-dim, --cream-muted,
 * --gold, --font-display, --font-body
 */
const sharedStyles = `
  .amphi-btn-gold {
    transition: background 0.25s ease, color 0.25s ease;
  }
  .amphi-btn-gold:hover {
    background: var(--cream);
  }
  .amphi-btn-ghost {
    transition: border-color 0.25s ease, color 0.25s ease;
    text-decoration: none;
    display: inline-block;
  }
  .amphi-btn-ghost:hover {
    border-color: rgba(240, 234, 216, 0.55);
    color: var(--cream);
  }
  .amphi-nav-link {
    transition: color 0.25s ease;
  }
  .amphi-nav-link:hover {
    color: var(--cream);
  }
  .amphi-btn-gold:focus-visible,
  .amphi-btn-ghost:focus-visible,
  .amphi-nav-link:focus-visible {
    outline: 1px solid var(--gold);
    outline-offset: 3px;
  }

  @keyframes amphi-scroll-pulse {
    0%, 100% { transform: scaleY(0.35); opacity: 0.4; }
    50%      { transform: scaleY(1);    opacity: 1; }
  }
  .amphi-scroll-line {
    transform-origin: top center;
    animation: amphi-scroll-pulse 2.4s ease-in-out infinite;
  }

  @media (max-width: 880px) {
    .amphi-nav-secondary { display: none !important; }
    .amphi-hiw-grid {
      grid-template-columns: 1fr !important;
      gap: 40px !important;
    }
    .amphi-hiw-text, .amphi-hiw-card { order: initial !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    .amphi-scroll-line { animation: none; }
  }
`;

export default function LandingPage() {
    return (
        <main style={{ position: "relative" }}>
            <style dangerouslySetInnerHTML={{ __html: sharedStyles }} />
            <ConstellationBackground />
            <div style={{ position: "relative", zIndex: 1 }}>
                <Nav />
                <Hero />
                <Mission />
                <HowItWorks />
            </div>
        </main>
    );
}
