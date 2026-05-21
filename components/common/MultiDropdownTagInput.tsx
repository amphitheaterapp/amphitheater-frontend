"use client";

import { useState, useRef, useEffect } from "react";

interface Option {
    label: string;
    value: string;
}

interface Props {
    label: string;
    options: Option[];
    value: string[];
    onChange: (val: string[]) => void;
}

export default function MultiDropdownTagInput({
    label,
    options,
    value,
    onChange,
}: Props) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [noMatch, setNoMatch] = useState(false);

    const ref = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // exclude already selected, filter by substring
    const filtered = options
        .filter((o) => !value.includes(o.value))
        .filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

    // reset highlighted to 0 (first item in list) when filtered list changes
    useEffect(() => {
        setHighlightedIndex(0);
    }, [query]);

    // scroll highlighted item into view
    useEffect(() => {
        if (listRef.current && highlightedIndex >= 0) {
            const item = listRef.current.children[highlightedIndex] as HTMLElement;
            item?.scrollIntoView({ block: "nearest" });
        }
    }, [highlightedIndex]);

    // click outside closes dropdown
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setQuery("");
                setNoMatch(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const addOption = (option: Option) => {
        onChange([...value, option.value]);
        setQuery("");
        setNoMatch(false);
        setHighlightedIndex(0);
        // keep focus on input so can immediately pick another
        inputRef.current?.focus();
    };

    const remove = (val: string) => {
        onChange(value.filter((v) => v !== val));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setOpen(false);
            setQuery("");
            setNoMatch(false);
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setHighlightedIndex((prev) =>
                prev < filtered.length - 1 ? prev + 1 : prev
            );
            return;
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
            return;
        }

        if (e.key === "Enter") {
            e.preventDefault();
            if (filtered.length === 0) {
                setNoMatch(true);
            } else {
                addOption(filtered[highlightedIndex] ?? filtered[0]);
            }
            return;
        }
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setOpen(true);
        // clear error the moment they start typing again
        setNoMatch(false);
    };

    // label of a selected value for tag display
    const getLabel = (val: string) =>
        options.find((o) => o.value === val)?.label ?? val;

    return (
        <>
            <style>{`
                @keyframes dropdownFadeIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "10px",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "var(--cream-muted)",
                    }}
                >
                    {label}
                </label>

                {/* Input row */}
                <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={handleQueryChange}
                            onFocus={() => setOpen(true)}
                            onKeyDown={handleKeyDown}
                            placeholder="type to search..."
                            style={{
                                flex: 1,
                                background: "transparent",
                                border: "none",
                                // bottom border turns red on noMatch
                                borderBottom: noMatch
                                    ? "1px solid #e57373"
                                    : "1px solid rgba(212,185,106,0.4)",
                                color: "var(--cream)",
                                fontFamily: "var(--font-body)",
                                fontSize: "13px",
                                padding: "8px 24px 8px 0",
                                outline: "none",
                                width: "100%",
                                transition: "border-color 0.15s ease",
                            }}
                        />
                        <span
                            style={{
                                position: "absolute",
                                right: 0,
                                color: "var(--gold-accent)",
                                fontSize: "10px",
                                pointerEvents: "none",
                                transition: "transform 0.2s ease",
                                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                            }}
                        >
                            ▾
                        </span>
                    </div>

                    {/* Dropdown list */}
                    {open && (
                        <div
                            style={{
                                position: "absolute",
                                top: "calc(100% + 4px)",
                                left: 0,
                                right: 0,
                                minWidth: "240px",
                                background: "var(--ink-mid)",
                                border: "1px solid rgba(212,185,106,0.3)",
                                maxHeight: "200px",
                                overflowY: "auto",
                                zIndex: 100,
                                animation: "dropdownFadeIn 0.12s ease",
                            }}
                        >
                            {filtered.length === 0 ? (
                                // no results message
                                <div
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: "12px",
                                        color: "var(--cream-muted)",
                                        fontStyle: "italic",
                                        padding: "10px 12px",
                                    }}
                                >
                                    no results
                                </div>
                            ) : (
                                <div ref={listRef}>
                                    {filtered.map((option, index) => {
                                        const isHighlighted = index === highlightedIndex;
                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => addOption(option)}
                                                onMouseEnter={() => setHighlightedIndex(index)}
                                                style={{
                                                    width: "100%",
                                                    background: isHighlighted
                                                        ? "rgba(212,185,106,0.05)"
                                                        : "transparent",
                                                    border: "none",
                                                    borderBottom: "1px solid rgba(212,185,106,0.08)",
                                                    borderLeft: isHighlighted
                                                        ? "2px solid var(--gold-accent)"
                                                        : "2px solid transparent",
                                                    color: "var(--cream)",
                                                    fontFamily: "var(--font-body)",
                                                    fontSize: "12px",
                                                    padding: "10px 12px 10px 10px",
                                                    textAlign: "left",
                                                    cursor: "pointer",
                                                    transition: "background 0.15s ease, border-left-color 0.15s ease",
                                                }}
                                            >
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Tags */}
                {value.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
                        {value.map((val) => (
                            <span
                                key={val}
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
                                {/* display label */}
                                {getLabel(val)}
                                <button
                                    type="button"
                                    onClick={() => remove(val)}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: "var(--cream-muted)",
                                        cursor: "pointer",
                                        padding: 0,
                                        fontSize: "12px",
                                        transition: "color 0.15s ease, transform 0.15s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.target as HTMLElement).style.color = "#e57373";
                                        (e.target as HTMLElement).style.transform = "scale(1.2)";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.target as HTMLElement).style.color = "var(--cream-muted)";
                                        (e.target as HTMLElement).style.transform = "scale(1)";
                                    }}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}