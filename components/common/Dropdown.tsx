// components/common/Dropdown.tsx

"use client";

import { useState, useRef, useEffect } from "react";

interface Option {
    label: string;
    value: string | number;
}

interface Props {
    options: Option[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
}

export default function Dropdown({
    options,
    value,
    onChange,
    placeholder = "Select",
}: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} style={{ position: "relative", flex: 1 }}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(212,185,106,0.4)",
                    color: selected ? "var(--cream)" : "var(--cream-muted)",
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    padding: "8px 0",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <span>{selected ? selected.label : placeholder}</span>
                <span
                    style={{
                        color: "var(--gold-accent)",
                        fontSize: "10px",
                        transition: "transform 0.2s ease",
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                >
                    ▾
                </span>
            </button>

            {/* List */}
            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        background: "var(--ink-mid)",
                        border: "1px solid rgba(212,185,106,0.3)",
                        maxHeight: "200px",
                        overflowY: "auto",
                        zIndex: 100,
                    }}
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setOpen(false);
                            }}
                            style={{
                                width: "100%",
                                background:
                                    option.value === value
                                        ? "rgba(212,185,106,0.1)"
                                        : "transparent",
                                border: "none",
                                borderBottom:
                                    "1px solid rgba(212,185,106,0.08)",
                                color:
                                    option.value === value
                                        ? "var(--gold-accent)"
                                        : "var(--cream)",
                                fontFamily: "var(--font-body)",
                                fontSize: "12px",
                                padding: "10px 12px",
                                textAlign: "left",
                                cursor: "pointer",
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
