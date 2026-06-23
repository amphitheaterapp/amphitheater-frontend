// components/feed/detailed/DetailFields.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { FIELD_GROUPS_BY_ROLE, formatFieldValue } from "@/lib/feedFields";

interface Props {
    role: string;
    data: Record<string, any>;
    tabIndex: number;
}

function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                transition: "transform 0.25s ease",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                color: "var(--gold-accent)",
            }}
        >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

function FieldGroup({
    title,
    fields,
    data,
    defaultOpen,
}: {
    title: string;
    fields: string[];
    data: Record<string, any>;
    defaultOpen: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    const contentRef = useRef<HTMLDivElement>(null);
    const initialized = useRef(false);

    const visibleFields = fields.filter(
        (field) => formatFieldValue(data?.[field]) !== "—",
    );

    useEffect(() => {
        if (!contentRef.current || initialized.current) return;
        if (!defaultOpen)
            gsap.set(contentRef.current, { height: 0, overflow: "hidden" });
        initialized.current = true;
    }, [defaultOpen]);

    if (visibleFields.length === 0) return null;

    const toggle = () => {
        const content = contentRef.current;
        if (!content) return;
        if (!open) {
            gsap.set(content, { height: "auto", overflow: "hidden" });
            const height = content.offsetHeight;
            gsap.fromTo(
                content,
                { height: 0, overflow: "hidden" },
                {
                    height,
                    duration: 0.35,
                    ease: "power2.out",
                    onComplete: () =>
                        gsap.set(content, {
                            height: "auto",
                            overflow: "visible",
                        }),
                },
            );
        } else {
            gsap.to(content, {
                height: 0,
                overflow: "hidden",
                duration: 0.25,
                ease: "power2.in",
            });
        }
        setOpen(!open);
    };

    return (
        <div style={{ borderTop: "1px solid rgba(212,185,106,0.1)" }}>
            <button
                type="button"
                onClick={toggle}
                style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "18px 0",
                }}
            >
                <span
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: open ? "var(--gold-accent)" : "var(--cream)",
                        transition: "color 0.2s ease",
                    }}
                >
                    {title}
                    <span
                        style={{
                            marginLeft: "10px",
                            color: "rgba(212,185,106,0.4)",
                            fontSize: "10px",
                        }}
                    >
                        {visibleFields.length}
                    </span>
                </span>
                <ChevronIcon open={open} />
            </button>

            <div ref={contentRef}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        paddingBottom: "12px",
                    }}
                >
                    {visibleFields.map((field) => (
                        <div
                            key={field}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "baseline",
                                gap: "24px",
                                padding: "11px 0",
                                borderBottom:
                                    "1px solid rgba(212,185,106,0.04)",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "13px",
                                    color: "var(--cream-muted)",
                                    flexShrink: 0,
                                    letterSpacing: "0.02em",
                                    textTransform: "capitalize",
                                }}
                            >
                                {field.replace(/_/g, " ")}
                            </span>
                            <span
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "14px",
                                    color: "var(--cream)",
                                    textAlign: "right",
                                    lineHeight: 1.4,
                                }}
                            >
                                {formatFieldValue(data?.[field])}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function DetailFields({ role, data, tabIndex }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        gsap.fromTo(
            containerRef.current,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        );
    }, [tabIndex]);

    const groups = FIELD_GROUPS_BY_ROLE[role];

    if (!groups) {
        return (
            <p
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "var(--cream-muted)",
                    fontStyle: "italic",
                    opacity: 0.6,
                }}
            >
                Full detail for this role is coming soon.
            </p>
        );
    }

    return (
        <div
            ref={containerRef}
            style={{ display: "flex", flexDirection: "column" }}
        >
            {groups.map((group, i) => (
                <FieldGroup
                    key={group.title}
                    title={group.title}
                    fields={group.fields}
                    data={data}
                    defaultOpen={i === 0}
                />
            ))}
        </div>
    );
}
