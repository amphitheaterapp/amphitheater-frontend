"use client";

import { CSSProperties, useEffect, useRef } from "react";
import gsap from "gsap";

// Pulled straight from the role taxonomy in the product doc. The subcopy
// asserts "every discipline" — the ticker proves it.
const DISCIPLINES = [
    "directors",
    "screenwriters",
    "actors",
    "directors of photography",
    "gaffers",
    "colorists",
    "composers",
    "editors",
    "costume designers",
    "stunt performers",
    "sound designers",
    "casting directors",
    "choreographers",
    "production designers",
    "vfx supervisors",
    "showrunners",
    "foley artists",
    "entertainment lawyers",
];

const heroStyles = `
  /* Masked line reveal. The padding/negative-margin pair keeps
     descenders (the y in "your") from being clipped by the
     overflow:hidden mask at this tight line-height. */
  #top .hero-line {
    display: block;
    overflow: hidden;
    padding-bottom: 0.1em;
    margin-bottom: -0.1em;
  }
  #top .hero-line-inner {
    display: block;
    transform: translateY(110%);
  }

  /* CTA arrow nudge */
  #top .hero-arrow {
    display: inline-block;
    margin-left: 10px;
    transition: transform 0.25s ease;
  }
  #top .amphi-btn-gold:hover .hero-arrow {
    transform: translateX(4px);
  }

  /* Discipline ticker — two identical lists, track slides -50% */
  #top .hero-ticker {
    width: min(680px, 88vw);
    overflow: hidden;
    white-space: nowrap;
    -webkit-mask-image: linear-gradient(
      to right, transparent, black 15%, black 85%, transparent
    );
    mask-image: linear-gradient(
      to right, transparent, black 15%, black 85%, transparent
    );
  }
  #top .hero-ticker-track {
    display: inline-flex;
    animation: hero-ticker-scroll 48s linear infinite;
  }
  #top .hero-ticker-list { display: inline-flex; }
  #top .hero-ticker-item {
    font-family: var(--font-body);
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: lowercase;
    color: var(--cream-muted);
  }
  #top .hero-ticker-item::after {
    content: "·";
    color: var(--gold);
    margin: 0 20px;
  }
  @keyframes hero-ticker-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* Scroll cue is a real control now */
  #top .hero-scroll {
    background: transparent;
    border: none;
    cursor: pointer;
  }
  #top .hero-scroll:focus-visible {
    outline: 1px solid var(--gold);
    outline-offset: 4px;
  }

  @media (prefers-reduced-motion: reduce) {
    #top .hero-line-inner { transform: none; }
    #top .hero-ticker-track { animation: none; }
  }
`;

export default function Hero() {
    const tagRef = useRef<HTMLParagraphElement>(null);
    const headRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const tickerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLButtonElement>(null);

    const linkStyle: CSSProperties = {
        fontFamily: "var(--font-body)",
        fontSize: "11px",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        background: "transparent",
        color: "var(--cream-dim)",
        border: "1px solid rgba(240,234,216,0.2)",
        padding: "16px 32px",
        cursor: "pointer",
    };

    useEffect(() => {
        const lines = headRef.current!.querySelectorAll(".hero-line-inner");
        const fadeTargets = [
            tagRef.current,
            subRef.current,
            ctaRef.current,
            tickerRef.current,
            scrollRef.current,
        ];

        // Respect reduced motion: snap straight to the final state.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            gsap.set(fadeTargets, {
                opacity: 1,
                y: 0,
                clearProps: "transform",
            });
            // Clearing (not zeroing) lets the stylesheet's
            // prefers-reduced-motion rule (transform: none) take over.
            gsap.set(lines, { clearProps: "transform" });
            return;
        }

        const tl = gsap.timeline({ delay: 0.3 });

        tl.fromTo(
            tagRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        )
            .fromTo(
                lines,
                // y: 0 matters: GSAP parses the stylesheet's
                // translateY(110%) into its pixel channel on init, and
                // animating yPercent alone leaves that offset baked in,
                // keeping the lines below the mask forever.
                { y: 0, yPercent: 110 },
                {
                    yPercent: 0,
                    duration: 1.1,
                    stagger: 0.12,
                    ease: "power4.out",
                },
                "-=0.4",
            )
            .fromTo(
                subRef.current,
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
                "-=0.6",
            )
            .fromTo(
                ctaRef.current,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
                "-=0.4",
            )
            .fromTo(
                tickerRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.9, ease: "power2.out" },
                "-=0.3",
            )
            .fromTo(
                scrollRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.6, ease: "power2.out" },
                "-=0.4",
            );

        return () => {
            tl.kill();
        };
    }, []);

    const scrollToNext = () => {
        window.scrollBy({
            top: Math.round(window.innerHeight * 0.92),
            behavior: "smooth",
        });
    };

    return (
        <section
            id="top"
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                // Extra bottom padding keeps the scroll cue clear of the CTAs
                // on short laptop viewports.
                padding: "120px 32px 140px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <style dangerouslySetInnerHTML={{ __html: heroStyles }} />

            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(28,28,56,0.6) 0%, transparent 70%)",
                    pointerEvents: "none",
                }}
            />

            <p
                ref={tagRef}
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    letterSpacing: "0.4em",
                    textTransform: "lowercase",
                    color: "var(--gold)",
                    marginBottom: "24px",
                    opacity: 0,
                }}
            >
                the verified creative network
            </p>

            <h1
                ref={headRef}
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(52px, 9vw, 128px)",
                    fontWeight: 300,
                    lineHeight: 0.95,
                    letterSpacing: "-0.02em",
                    color: "var(--cream)",
                    marginBottom: "32px",
                    maxWidth: "1000px",
                }}
            >
                <span className="hero-line">
                    <span className="hero-line-inner">find your team.</span>
                </span>
                <span className="hero-line">
                    <span className="hero-line-inner">
                        <em style={{ color: "var(--cream-dim)" }}>
                            build your record.
                        </em>
                    </span>
                </span>
            </h1>

            <p
                ref={subRef}
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "var(--cream-muted)",
                    lineHeight: 1.8,
                    maxWidth: "480px",
                    marginBottom: "48px",
                    textTransform: "lowercase",
                    opacity: 0,
                }}
            >
                amphitheater connects every discipline of film, television,
                theatre, music, and content production. verified identities.
                permanent credited work history. no noise.
            </p>

            <div
                ref={ctaRef}
                style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    opacity: 0,
                }}
            >
                <a
                    href="#access"
                    className="amphi-btn-gold"
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        background: "var(--gold)",
                        color: "var(--ink)",
                        border: "none",
                        padding: "16px 32px",
                        cursor: "pointer",
                        fontWeight: 500,
                        textDecoration: "none",
                        display: "inline-block",
                    }}
                >
                    Request Early Access
                    <span className="hero-arrow" aria-hidden="true">
                        →
                    </span>
                </a>
                <a
                    href="#how-it-works"
                    className="amphi-btn-ghost"
                    style={linkStyle}
                >
                    See how it works
                </a>
            </div>

            {/* Discipline ticker — evidence for the "every discipline" claim */}
            <div
                ref={tickerRef}
                className="hero-ticker"
                aria-hidden="true"
                style={{ marginTop: "56px", opacity: 0 }}
            >
                <div className="hero-ticker-track">
                    <span className="hero-ticker-list">
                        {DISCIPLINES.map((d) => (
                            <span key={d} className="hero-ticker-item">
                                {d}
                            </span>
                        ))}
                    </span>
                    <span className="hero-ticker-list">
                        {DISCIPLINES.map((d) => (
                            <span key={`${d}-2`} className="hero-ticker-item">
                                {d}
                            </span>
                        ))}
                    </span>
                </div>
            </div>

            <button
                ref={scrollRef}
                className="hero-scroll"
                aria-label="Scroll to the next section"
                onClick={scrollToNext}
                style={{
                    position: "absolute",
                    bottom: "40px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    opacity: 0,
                }}
            >
                <span
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "10px",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "var(--cream-muted)",
                    }}
                >
                    Scroll
                </span>
                <span
                    className="amphi-scroll-line"
                    style={{
                        width: "1px",
                        height: "48px",
                        background:
                            "linear-gradient(to bottom, var(--gold), transparent)",
                    }}
                />
            </button>
        </section>
    );
}
