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
    displayValue?: string; // overrides the trigger label when provided
    optional?: boolean;
}

export default function Dropdown({
    options,
    value,
    onChange,
    placeholder = "Select",
    displayValue,
    optional = false,
}: Props) {
    const [open, setOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1); //-1 means nothing highlighted
    
    const ref = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null); //for scrolling highlighted item into view
    const placeholderRef = useRef<HTMLButtonElement>(null);

    const selected = options.find((o) => o.value === value);

    //Scroll highlighted item into view when highlighted index changes
    useEffect(() => {
        if (highlightedIndex === -1 && placeholderRef.current) {
            placeholderRef.current.scrollIntoView({ block: "nearest" });
        } else if (highlightedIndex >= 0 && listRef.current) {
            const item = listRef.current.children[highlightedIndex] as HTMLElement;
            item?.scrollIntoView({ block: "nearest" });
        }
    }, [highlightedIndex]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setHighlightedIndex(-1);
            }
        };
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") 
            {
                setOpen(false)
                setHighlightedIndex(-1)
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc)
        }
    }, []);

    const getOpeningIndex = () => {
        // if optional and nothing selected, start at placeholder (-1)
        if (optional && !value) return -1;
        const selectedIndex = options.findIndex((o) => o.value === value);
        // if optional, -1 is floor; if not optional, floor is 0
        return selectedIndex >= 0 ? selectedIndex : optional ? -1 : 0;
    };

    // keyboard controls
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // if closed, open on arrow down or enter
        if (!open) {
            if (e.key === "ArrowDown" || e.key === "Enter") {
                e.preventDefault();
                setOpen(true);
                // start highlight at selected option, or 0/-1 if nothing selected
                const selectedIndex = options.findIndex((o) => o.value === value);
                setHighlightedIndex(getOpeningIndex());
            }
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault(); // stop page scrolling
            setHighlightedIndex((prev) =>
                prev < options.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault(); // stop page scrolling
            setHighlightedIndex((prev) => {
                //if optional, then floor is placeholder, else floor is first option
                const floor = optional ? -1 : 0;
                return prev > floor ? prev - 1 : prev;
            });
        } else if (e.key === "Enter") {
            e.preventDefault(); // stop form submission
            if (highlightedIndex === -1 && optional) {
                // enter on placeholder clears the value
                onChange("");
                setOpen(false);
                setHighlightedIndex(-1);
            }
            else if (highlightedIndex >= 0) {
                onChange(options[highlightedIndex].value);
                setOpen(false);
                setHighlightedIndex(-1);
            }
        } else if (e.key === "Escape") {
            setOpen(false);
            setHighlightedIndex(-1);
        }
    };


    return (
        <>
            <style>{`
                @keyframes dropdownFadeIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            <div ref={ref} style={{ position: "relative", flex: 1 }}>
                {/* Trigger */}
                <button
                    type="button"
                    onClick={() => {
                        const next = !open;
                        setOpen(next);
                        setHighlightedIndex(next ? getOpeningIndex() : -1);
                    }}
                    onKeyDown={handleKeyDown}
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
                    <span>
                        {displayValue ?? (selected ? selected.label : placeholder)}
                    </span>
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
                            minWidth: "240px",
                            background: "var(--ink-mid)",
                            border: "1px solid rgba(212,185,106,0.3)",
                            maxHeight: "200px",
                            overflowY: "auto",
                            zIndex: 100,
                            animation: "dropdownFadeIn 0.12s ease",
                        }}
                    >
                        {/* Placeholder option - only when optional */}
                        {optional && (
                            <button
                                ref={placeholderRef}
                                type="button"
                                onClick={() => {
                                    onChange("");
                                    setOpen(false);
                                    setHighlightedIndex(-1);
                                }}
                                onMouseEnter={() => setHighlightedIndex(-1)}
                                style={{
                                    width: "100%",
                                    background: highlightedIndex === -1
                                        ? "rgba(212,185,106,0.05)"
                                        : "transparent",
                                    border: "none",
                                    borderBottom: "1px solid rgba(212,185,106,0.08)",
                                    borderLeft: highlightedIndex === -1
                                        ? "2px solid var(--gold-accent)"
                                        : "2px solid transparent",
                                    color: "var(--cream-muted)",
                                    fontFamily: "var(--font-body)",
                                    fontSize: "12px",
                                    padding: "10px 12px 10px 10px",
                                    textAlign: "left",
                                    cursor: "pointer",
                                    transition: "background 0.15s ease, border-left-color 0.15s ease",
                                }}
                            >
                                {placeholder}
                            </button>
                        )}
                        <div ref={listRef}>
                            {options.map((option, index) => {
                                const isSelected = option.value === value;
                                const isHighlighted = index === highlightedIndex;
                                
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            setOpen(false);
                                            setHighlightedIndex(-1);
                                        }}
                                        //highlight on hover
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                        style={{
                                            width: "100%",
                                            background: isSelected
                                                    ? "rgba(212,185,106,0.1)"
                                                    : isHighlighted
                                                    ? "rgba(212,185,106,0.05)"
                                                    : "transparent",
                                            border: "none",
                                            borderBottom:
                                                "1px solid rgba(212,185,106,0.08)",
                                            borderLeft: isHighlighted
                                                ? "2px solid var(--gold-accent)"
                                                : "2px solid transparent",
                                            color: isSelected
                                                    ? "var(--gold-accent)"
                                                    : "var(--cream)",
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
                    </div>
                )}
            </div>
        </>
    );
}
