// components/common/TagInput.tsx

"use client";

import { useState } from "react";

const inputStyle = {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(212,185,106,0.4)",
    color: "var(--cream)",
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    padding: "8px 0",
    outline: "none",
    width: "100%",
};

const labelStyle = {
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    letterSpacing: "0.3em",
    textTransform: "uppercase" as const,
    color: "var(--cream-muted)",
};

interface Props {
    label: string;
    value: string[];
    onChange: (val: string[]) => void;
}

export default function TagInput({ label, value, onChange }: Props) {
    const [input, setInput] = useState("");

    //hover and active states for the add button
    const [addHovered, setAddHovered] = useState(false);
    const [addActive, setAddActive] = useState(false);

    // tracks which tag's × is currently hovered using the value
    const [hoveredTag, setHoveredTag] = useState<string | null>(null);

    const add = () => {
        const trimmed = input.trim();
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
        }
        setInput("");
    };

    const remove = (item: string) => {
        onChange(value.filter((v) => v !== item));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={labelStyle}>{label}</label>
            <div style={{ display: "flex", gap: "8px" }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), add())
                    }
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="type and press enter"
                />
                <button
                    type="button"
                    onClick={add}
                    onMouseEnter={() => setAddHovered(true)}
                    onMouseLeave={() => {
                        setAddHovered(false);
                        setAddActive(false);
                    }}
                    onMouseDown={() => setAddActive(true)}
                    onMouseUp={() => setAddActive(false)}
                    style={{
                        // background: "transparent",
                        // border: "1px solid rgba(212,185,106,0.3)",
                        // color: "var(--gold-accent)",
                        background: addHovered
                            ? "rgba(212,185,106,0.08)"
                            : "transparent",
                        border: addHovered
                            ? "1px solid rgba(212,185,106,0.7)"
                            : "1px solid rgba(212,185,106,0.3)",
                        color: addHovered
                            ? "var(--gold-accent)"
                            : "rgba(212,185,106,0.6)",
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        padding: "4px 12px",
                        cursor: "pointer",
                        transform: addActive ? "scale(0.95)" : "scale(1)",
                        transition: "background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.1s ease",
                    }}
                >
                    add
                </button>
            </div>
            {value.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {value.map((item) => (
                        <span
                            key={item}
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "10px",
                                letterSpacing: "0.1em",
                                color: "var(--cream)",
                                border: "1px solid rgba(212,185,106,0.3)",
                                padding: "4px 10px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            {item}
                            <button
                                type="button"
                                onClick={() => remove(item)}
                                onMouseEnter={() => setHoveredTag(item)}
                                onMouseLeave={() => setHoveredTag(null)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: hoveredTag === item
                                        ? "#e57373"
                                        : "var(--cream-muted)",
                                    cursor: "pointer",
                                    padding: 0,
                                    fontSize: "12px",
                                    transform: hoveredTag === item
                                        ? "scale(1.2)"
                                        : "scale(1)",
                                    transition: "color 0.15s ease, transform 0.15s ease",
                                }}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
